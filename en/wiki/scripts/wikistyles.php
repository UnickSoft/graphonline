<?php if (!defined('PmWiki')) exit();
/*  Copyright 2004-2015 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.
*/

SDV($WikiStylePattern,'%%|%[A-Za-z][-,=:#\\w\\s\'"().]*%');

## %% markup
Markup('%%','style','%','return ApplyStyles($x);');

## %define=...% markup on a line by itself
Markup_e('%define=', '>split',
  "/^(?=%define=)((?:$WikiStylePattern)\\s*)+$/",
  "PZZ(ApplyStyles(\$m[0]))");

## restore links before applying styles
Markup_e('restorelinks','<%%',"/$KeepToken(\\d+L)$KeepToken/",
  '$GLOBALS[\'KPV\'][$m[1]]');

# define PmWiki's standard/default wikistyles
if (IsEnabled($EnableStdWikiStyles,1)) {
  ## standard colors
  foreach(array('black','white','red','yellow','blue','gray',
      'silver','maroon','green','navy','purple') as $c)
    SDV($WikiStyle[$c]['color'],$c);
  ## %newwin% style opens links in a new window
  SDV($WikiStyle['newwin']['target'],'_blank');
  ## %comment% style turns markup into a comment via display:none css
  SDV($WikiStyle['comment']['display'],'none');
  ## display, margin, padding, and border css properties
  $WikiStyleCSS[] = 
    'float|clear|display|(margin|padding|border)(-(left|right|top|bottom))?';
  $WikiStyleCSS[] = 'white-space';
  $WikiStyleCSS[] = '((min|max)-)?(width|height)';
  ## list-styles
  $WikiStyleCSS[] = 'list-style';
  foreach(array('decimal'=>'decimal', 'roman'=>'lower-roman',
    'ROMAN'=>'upper-roman', 'alpha'=>'lower-alpha', 'ALPHA'=>'upper-alpha')
    as $k=>$v) 
      SDV($WikiStyle[$k],array('apply'=>'list','list-style'=>$v));
  ## apply ranges
  SDVA($WikiStyleApply,array(
    'item' => 'li|dt',
    'list' => 'ul|ol|dl',
    'div' => 'div',
    'article' => 'article',
    'section' => 'section',
    'nav' => 'nav',
    'aside' => 'aside',
    'header' => 'header',
    'footer' => 'footer',
    'address' => 'address',
    'pre' => 'pre',
    'img' => 'img',
    'block' => 'p(?!\\s+class=)|div|ul|ol|dl|li|dt|pre|h[1-6]|article|section|nav|aside|address|header|footer',
    'p' => 'p(?!\\s+class=)'));
  foreach(array('item', 'list', 'block', 'p', 'div') as $c)
    SDV($WikiStyle[$c],array('apply'=>$c));
  ## block justifications
  foreach(array('left','right','center','justify') as $c)
    SDV($WikiStyle[$c],array('apply'=>'block','text-align'=>$c));
  ## frames, floating frames, and floats
  SDV($HTMLStylesFmt['wikistyles'], " 
    .frame 
      { border:1px solid #cccccc; padding:4px; background-color:#f9f9f9; }
    .lfloat { float:left; margin-right:0.5em; }
    .rfloat { float:right; margin-left:0.5em; }\n");
  SDV($WikiStyle['thumb'], array('width' => '100px'));
  SDV($WikiStyle['frame'], array('class' => 'frame'));
  SDV($WikiStyle['lframe'], array('class' => 'frame lfloat'));
  SDV($WikiStyle['rframe'], array('class' => 'frame rfloat'));
  SDV($WikiStyle['cframe'], array(
    'class' => 'frame', 'margin-left' => 'auto', 'margin-right' => 'auto',
    'width' => '200px', 'apply' => 'block', 'text-align' => 'center'));
  ##  preformatted text sections
  SDV($WikiStyle['pre'], array('apply' => 'block', 'white-space' => 'pre'));
  SDV($WikiStyle['sidehead'], array('apply' => 'block', 'class' => 'sidehead'));
}

SDVA($WikiStyleAttr,array(
  'vspace' => 'img',
  'hspace' => 'img',
  'align' => 'img',
  'value' => 'li',
  'target' => 'a',
  'accesskey' => 'a',
  'rel' => 'a'));

SDVA($WikiStyleRepl,array(
  '/^%(.*)%$/' => '$1',
  '/\\bbgcolor([:=])/' => 'background-color$1',
  '/\\b(\d+)pct\\b/' => '$1%',
  ));

$WikiStyleCSS[] = 'color|background-color';
$WikiStyleCSS[] = 'text-align|text-decoration';
$WikiStyleCSS[] = 'font-size|font-family|font-weight|font-style';

SDV($imgTag, '(?:img|object|embed)');  SDV($aTag, 'a'); SDV($spanTag, 'span');

function ApplyStyles($x) {
  global $UrlExcludeChars, $WikiStylePattern, $WikiStyleRepl, $WikiStyle,
    $WikiStyleAttr, $WikiStyleCSS, $WikiStyleApply, $BlockPattern,
    $WikiStyleTag, $imgTag, $aTag, $spanTag, $WikiStyleAttrPrefix;
  $wt = @$WikiStyleTag; $ns = $WikiStyleAttrPrefix; $ws = '';
  $x = PPRE("/\\b(href|src)=(['\"]?)[^$UrlExcludeChars]+\\2/",
                    "Keep(\$m[0])", $x);
  $x = PPRE("/\\bhttps?:[^$UrlExcludeChars]+/", "Keep(\$m[0])", $x);
  $parts = preg_split("/($WikiStylePattern)/",$x,-1,PREG_SPLIT_DELIM_CAPTURE);
  $parts[] = NULL;
  $out = '';
  $style = array();
  $wikicsspat = '/^('.implode('|',(array)$WikiStyleCSS).')$/';
  while ($parts) {
    $p = array_shift($parts);
    if (preg_match("/^$WikiStylePattern\$/",$p)) {
      $WikiStyle['curr']=$style; $style=array();
      foreach((array)$WikiStyleRepl as $pat=>$rep) 
        $p=preg_replace($pat,$rep,$p);
      preg_match_all(
        '/\\b([a-zA-Z][-\\w]*)([:=]([-#,\\w.()%]+|([\'"]).*?\\4))?/',
        $p, $match, PREG_SET_ORDER);
      while ($match) {
        $m = array_shift($match);
        if (@$m[2]) $style[$m[1]]=preg_replace('/^([\'"])(.*?)\\1$/','$2',$m[3]);
        else if (!isset($WikiStyle[$m[1]])) @$style['class'] .= ' ' . $m[1];
        else {
          $c = @$style['class'];
          $style=array_merge($style,(array)$WikiStyle[$m[1]]);
          if ($c && !preg_match("/(^| )$c( |$)/", $style['class']) )
            $style['class'] = $c . ' ' . $style['class'];
        }
      }
      if (@$style['define']) {
        $d = $style['define']; unset($style['define']);
        $WikiStyle[$d] = $style;
      }
      if (@$WikiStyleApply[$style['apply']]) {
        $apply[$style['apply']] = 
          array_merge((array)@$apply[$style['apply']],$style);
        $style=array();
      }
      continue;
    }
    if (is_null($p)) 
      { $alist=@$apply; unset($alist['']); $p=$out; $out=''; }
    elseif ($p=='') continue;
    else { $alist=array(''=>$style); }
    foreach((array)$alist as $a=>$s) {
      $spanattr = ''; $stylev = array(); $id = '';
      foreach((array)$s as $k=>$v) {
        $v = trim($v);
        if ($wt) $ws = str_replace('$1', "$ns$k='$v'", $wt);
        if ($k == 'class' && $v) $spanattr = "{$ns}class='$v'";
        elseif ($k=='id') $id = preg_replace('/[^-A-Za-z0-9:_.]+/', '_', $v);
        elseif (($k=='width' || $k=='height') && !@$WikiStyleApply[$a]
            && preg_match("/\\s*<$imgTag\\b/", $p)) 
          $p = preg_replace("/<($imgTag)\\b(?![^>]*\\s$k=)/", 
                 "$ws<$1 $ns$k='$v'", $p);
        elseif (@$WikiStyleAttr[$k]) 
          $p = preg_replace(
                 "/<({$WikiStyleAttr[$k]}(?![^>]*\\s(?:$ns)?$k=))([^>]*)>/s",
                 "$ws<$1 $ns$k='$v' $2>", $p);
        elseif (preg_match($wikicsspat,$k)) $stylev[]="$k: $v;";
      }
      if ($stylev) $spanattr .= " {$ns}style='".implode(' ',$stylev)."'";
      if ($id) $spanattr .= " {$ns}id='$id'";
      if ($spanattr) {
        if ($wt) $ws = str_replace('$1', $spanattr, $wt);
        if (!@$WikiStyleApply[$a]) {
          $p = preg_replace("!^(.*?)($|</?($BlockPattern))!s", 
                            "$ws<$spanTag $spanattr>$1</$spanTag>$2", $p, 1);
}
        elseif (!preg_match('/^(\\s*<[^>]+>)*$/s',$p) ||
                preg_match("/<$imgTag\\b/", $p)) {
          $p = preg_replace("/<({$WikiStyleApply[$a]})\\b/",
                 "$ws<$1 $spanattr", $p);
        }
      }
      if (@$s['color']) {
        $colorattr = "{$ns}style='color: {$s['color']}'";
        if ($wt) $ws = str_replace('$1', $colorattr, $wt);
        $p = preg_replace("/<$aTag\\b/", "$ws<$aTag $colorattr", $p);
      }
    }
    $out .= $p;
  }
  return $out;
}

