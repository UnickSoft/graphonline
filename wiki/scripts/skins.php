<?php if (!defined('PmWiki')) exit();
/*  Copyright 2004-2007 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This file implements the skin selection code for PmWiki.  Skin 
    selection is controlled by the $Skin variable, which can also
    be an array (in which case the first skin found is loaded).

    In addition, $ActionSkin[$action] specifies other skins to be
    searched based on the current action.

*/

SDV($Skin, 'pmwiki');
SDV($ActionSkin['print'], 'print');
SDV($FarmPubDirUrl, $PubDirUrl);
SDV($PageLogoUrl, "$FarmPubDirUrl/skins/pmwiki/pmwiki-32.gif");
SDVA($TmplDisplay, array('PageEditFmt' => 0));

# $PageTemplateFmt is deprecated
if (isset($PageTemplateFmt)) LoadPageTemplate($pagename,$PageTemplateFmt);
else {
  $x = array_merge((array)@$ActionSkin[$action], (array)$Skin);
  SetSkin($pagename, $x);
}

SDV($PageCSSListFmt,array(
  'pub/css/local.css' => '$PubDirUrl/css/local.css',
  'pub/css/{$Group}.css' => '$PubDirUrl/css/{$Group}.css',
  'pub/css/{$FullName}.css' => '$PubDirUrl/css/{$FullName}.css'));

foreach((array)$PageCSSListFmt as $k=>$v) 
  if (file_exists(FmtPageName($k,$pagename))) 
    $HTMLHeaderFmt[] = "<link rel='stylesheet' type='text/css' href='$v' />\n";

# SetSkin changes the current skin to the first available skin from 
# the $skin array.
function SetSkin($pagename, $skin) {
  global $Skin, $SkinLibDirs, $SkinDir, $SkinDirUrl, 
    $IsTemplateLoaded, $PubDirUrl, $FarmPubDirUrl, $FarmD, $GCount;
  SDV($SkinLibDirs, array(
    "./pub/skins/\$Skin"      => "$PubDirUrl/skins/\$Skin",
    "$FarmD/pub/skins/\$Skin" => "$FarmPubDirUrl/skins/\$Skin"));
  foreach((array)$skin as $sfmt) {
    $Skin = FmtPageName($sfmt, $pagename); $GCount = 0;
    foreach($SkinLibDirs as $dirfmt => $urlfmt) {
      $SkinDir = FmtPageName($dirfmt, $pagename);
      if (is_dir($SkinDir)) 
        { $SkinDirUrl = FmtPageName($urlfmt, $pagename); break 2; }
    }
  }
  if (!is_dir($SkinDir)) {
    unset($Skin);
    Abort("?unable to find skin from list ".implode(' ',(array)$skin));
  }
  $IsTemplateLoaded = 0;
  if (file_exists("$SkinDir/$Skin.php"))
    include_once("$SkinDir/$Skin.php");
  else if (file_exists("$SkinDir/skin.php"))
    include_once("$SkinDir/skin.php");
  if ($IsTemplateLoaded) return;
  if (file_exists("$SkinDir/$Skin.tmpl")) 
    LoadPageTemplate($pagename, "$SkinDir/$Skin.tmpl");
  else if (file_exists("$SkinDir/skin.tmpl"))
    LoadPageTemplate($pagename, "$SkinDir/skin.tmpl");
  else if (($dh = opendir($SkinDir))) {
    while (($fname = readdir($dh)) !== false) {
      if ($fname[0] == '.') continue;
      if (substr($fname, -5) != '.tmpl') continue;
      if ($IsTemplateLoaded) 
        Abort("?unable to find unique template in $SkinDir");
      LoadPageTemplate($pagename, "$SkinDir/$fname");
    }
    closedir($dh);
  }
  if (!$IsTemplateLoaded) Abort("Unable to load $Skin template", 'skin');
}


# LoadPageTemplate loads a template into $TmplFmt
function LoadPageTemplate($pagename,$tfilefmt) {
  global $PageStartFmt, $PageEndFmt, 
    $EnableSkinDiag, $HTMLHeaderFmt, $HTMLFooterFmt,
    $IsTemplateLoaded, $TmplFmt, $TmplDisplay,
    $PageTextStartFmt, $PageTextEndFmt, $SkinDirectivesPattern;

  SDV($PageTextStartFmt, "\n<div id='wikitext'>\n");
  SDV($PageTextEndFmt, "</div>\n");
  SDV($SkinDirectivesPattern, 
      "[[<]!--((?:wiki|file|function|markup):.*?)--[]>]");

  $sddef = array('PageEditFmt' => 0);
  $k = implode('', file(FmtPageName($tfilefmt, $pagename)));

  if (IsEnabled($EnableSkinDiag, 0)) {
    if (!preg_match('/<!--((No)?(HT|X)MLHeader|HeaderText)-->/i', $k))
      Abort("Skin template missing &lt;!--HTMLHeader--&gt;", 'htmlheader');
    if (!preg_match('/<!--(No)?(HT|X)MLFooter-->/i', $k))
      Abort("Skin template missing &lt;!--HTMLFooter--&gt;", 'htmlheader');
  }

  $sect = preg_split(
    '#[[<]!--(/?(?:Page[A-Za-z]+Fmt|(?:HT|X)ML(?:Head|Foot)er|HeaderText|PageText).*?)--[]>]#',
    $k, 0, PREG_SPLIT_DELIM_CAPTURE);
  $TmplFmt['Start'] = array_merge(array('headers:'),
    preg_split("/$SkinDirectivesPattern/s",
      array_shift($sect),0,PREG_SPLIT_DELIM_CAPTURE));
  $TmplFmt['End'] = array($PageTextEndFmt);
  $ps = 'Start';
  while (count($sect)>0) {
    $k = array_shift($sect);
    $v = preg_split("/$SkinDirectivesPattern/s",
      array_shift($sect),0,PREG_SPLIT_DELIM_CAPTURE);
    $TmplFmt[$ps][] = "<!--$k-->";
    if ($k{0} == '/') 
      { $TmplFmt[$ps][] = (count($v) > 1) ? $v : $v[0]; continue; }
    @list($var, $sd) = explode(' ', $k, 2);
    $GLOBALS[$var] = (count($v) > 1) ? $v : $v[0];
    if ($sd > '') $sddef[$var] = $sd;
    if ($var == 'PageText') { $ps = 'End'; }
    if ($var == 'HTMLHeader' || $var == 'XMLHeader') 
      $TmplFmt[$ps][] = &$HTMLHeaderFmt; 
    if ($var == 'HTMLFooter' || $var == 'XMLFooter') 
      $TmplFmt[$ps][] = &$HTMLFooterFmt; 
    ##   <!--HeaderText--> deprecated, 2.1.16
    if ($var == 'HeaderText') { $TmplFmt[$ps][] = &$HTMLHeaderFmt; }
    $TmplFmt[$ps][$var] =& $GLOBALS[$var];
  }
  array_push($TmplFmt['Start'], $PageTextStartFmt);
  $PageStartFmt = 'function:PrintSkin Start';
  $PageEndFmt = 'function:PrintSkin End';
  $IsTemplateLoaded = 1;
  SDVA($TmplDisplay, $sddef);
}

# This function is called to print a portion of the skin template
# according to the settings in $TmplDisplay.
function PrintSkin($pagename, $arg) {
  global $TmplFmt, $TmplDisplay;
  foreach ($TmplFmt[$arg] as $k => $v) 
    if (!isset($TmplDisplay[$k]) || $TmplDisplay[$k])
      PrintFmt($pagename, $v);
}

