<?php if (!defined('PmWiki')) exit();
/*  Copyright 2006-2013 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This script adds blocklisting capabilities to PmWiki, and can
    be enabled by simply setting the following in local/config.php:

        $EnableBlocklist = 1;

    With $EnableBlocklist set to 1, this module will search through
    the SiteAdmin.Blocklist page, as well as any other pages given by
    the $Blocklist pages variable, looking for lines of the
    form "block:some phrase" or "block:/regex/", with "some phrase" 
    and "/regex/" indicating things to be excluded from any 
    posting to the site.  

    In addition, if a page contains IP addresses of the form
    "a.b.c.d" or "a.b.c.*", then any posts coming from hosts
    matching the address will be blocked.

    There is also an "unblock:..." form, which removes an entry
    from the blocklist.  This is useful for removing specific
    block items in wikifarms and with automatically downloaded
    blocklists (below).

    The script also has the capability of automatically downloading
    blocklists from other sources, such as chongqed.org and
    and the MoinMaster blocklist.  These are configured using
    the $BlocklistDownload array.  An $EnableBlocklist value
    of at least 10 configures PmWiki to automatically download
    these external blocklists and refresh them daily.

    More information about blocklists is available in the
    PmWiki.Blocklist page.
*/


##   Some recipes do page updates outside of the built-in posting
##   cycle, so $EnableBlocklistImmediate is used to determine if
##   we need to catch these.  Currently this defaults to enabled,
##   but at some point we may change the default to disabled.
if (IsEnabled($EnableBlocklistImmediate, 1)) {
  SDVA($BlocklistActions, array('comment' => 1));
  $ptext = implode(' ', @$_POST);
  if ($ptext && @$BlocklistActions[$action]) {
    Blocklist($pagename, $ptext);
    if (!$EnablePost) {
      unset($_POST['post']);
      unset($_POST['postattr']);
      unset($_POST['postedit']);
    }
  }
}


##   If $EnableBlocklist is set to 10 or higher, then arrange to 
##   periodically download the "chongqed" and "moinmaster" blacklists.
if ($EnableBlocklist >= 10) {
#  SDVA($BlocklistDownload['SiteAdmin.Blocklist-Chongqed'], array(
#    'url' => 'http://blacklist.chongqed.org/',
#    'format' => 'regex'));
  SDVA($BlocklistDownload['SiteAdmin.Blocklist-MoinMaster'], array(
    'url' => 'http://moinmo.in/BadContent?action=raw',
    'format' => 'regex'));
}


##   CheckBlocklist is inserted into $EditFunctions, to automatically
##   check for blocks on anything being posted through the normal
##   "update a page cycle"
array_unshift($EditFunctions, 'CheckBlocklist');
function CheckBlocklist($pagename, &$page, &$new) { 
  StopWatch("CheckBlocklist: begin $pagename");
  $ptext = implode(' ', @$_POST);
  if (@$ptext) Blocklist($pagename, $ptext); 
  StopWatch("CheckBlocklist: end $pagename");
}


##   Blocklist is the function that does all of the work of
##   checking for reasons to block a posting.  It reads
##   the available blocklist pages ($BlocklistPages) and
##   builds an array of strings and regular expressiongs to
##   be checked against the page; if any are found, then
##   posting is blocked (via $EnablePost=0).  The function
##   also checks the REMOTE_ADDR against any blocked IP addresses.
function Blocklist($pagename, $text) {
  global $BlocklistPages, $BlockedMessagesFmt, $BlocklistDownload,
    $BlocklistDownloadRefresh, $Now, $EnablePost, $WhyBlockedFmt,
    $MessagesFmt, $BlocklistMessageFmt, $EnableWhyBlocked, $IsBlocked;

  StopWatch("Blocklist: begin $pagename");

  $BlocklistDownload = (array)@$BlocklistDownload;
  SDV($BlocklistPages, 
    array_merge(array('$SiteAdminGroup.Blocklist', 
                      '$SiteAdminGroup.Blocklist-Farm'),
                array_keys($BlocklistDownload)));
  SDV($BlocklistMessageFmt, "<h3 class='wikimessage'>$[This post has been blocked by the administrator]</h3>");
  SDVA($BlockedMessagesFmt, array(
    'ip' => '$[Address blocked from posting]: ',
    'text' => '$[Text blocked from posting]: '));
  SDV($BlocklistDownloadRefresh, 86400);

  ##  Loop over all blocklist pages
  foreach((array)$BlocklistPages as $b) {

    ##  load the current blocklist page
    $pn = FmtPageName($b, $pagename);
    $page = ReadPage($pn, READPAGE_CURRENT);
    if (!$page) continue;

    ##  if the page being checked is a blocklist page, stop blocking
    if ($pagename == $pn) return;

    ##  If the blocklist page is managed by automatic download,
    ##  schedule any new downloads here
    if (@$BlocklistDownload[$pn]) {
      $bd = &$BlocklistDownload[$pn];
      SDVA($bd, array(
        'refresh' => $BlocklistDownloadRefresh,
        'url' => "http://www.pmwiki.org/blocklists/$pn" ));
      if (!@$page['text'] || $page['time'] < $Now - $bd['refresh'])
        register_shutdown_function('BlocklistDownload', $pn, getcwd());
    }

    ##  If the blocklist is simply a list of regexes to be matched, load 
    ##  them into $terms['block'] and continue to the next blocklist page.
    ##  Some regexes from remote sites aren't well-formed, so we have
    ##  to escape any slashes that aren't already escaped.
    if (strpos(@$page['text'], 'blocklist-format: regex') !==false) {
      if (preg_match_all('/^([^\\s#].+)/m', $page['text'], $match)) 
        foreach($match[0] as $m) {
          $m = preg_replace('#(?<!\\\\)/#', '\\/', trim($m));
          $terms['block'][] = "/$m/";
        }
      continue;
    }

    ##  Treat the page as a pmwiki-format blocklist page, with
    ##  IP addresses and "block:"-style declarations.  First, see
    ##  if we need to block the author based on a.b.c.d or a.b.c.*
    ##  IP addresses.
    $ip = preg_quote($_SERVER['REMOTE_ADDR']);
    $ip = preg_replace('/\\d+$/', '($0\\b|\\*)', $ip);
    if (preg_match("/\\b$ip/", @$page['text'], $match)) {
      $EnablePost = 0;
      $IsBlocked = 1;
      $WhyBlockedFmt[] = $BlockedMessagesFmt['ip'] . $match[0];
    }

    ##  Now we'll load any "block:" or "unblock:" specifications
    ##  from the page text.
    if (preg_match_all('/(un)?(?:block|regex):(.*)/', @$page['text'], 
                       $match, PREG_SET_ORDER)) 
      foreach($match as $m) $terms[$m[1].'block'][] = trim($m[2]);
  }

  ##  okay, we've loaded all of the terms, now subtract any 'unblock'
  ##  terms from the block set.
  StopWatch("Blocklist: diff unblock");
  $blockterms = array_diff((array)@$terms['block'], (array)@$terms['unblock']);

  ##  go through each of the remaining blockterms and see if it matches the
  ##  text -- if so, disable posting and add a message to $WhyBlockedFmt.
  StopWatch('Blocklist: blockterms (count='.count($blockterms).')');
  $itext = strtolower($text);
  foreach($blockterms as $b) {
    if ($b{0} == '/') {
      if (!preg_match($b, $text)) continue;
    } else if (strpos($itext, strtolower($b)) === false) continue;
    $EnablePost = 0;
    $IsBlocked = 1;
    $WhyBlockedFmt[] = $BlockedMessagesFmt['text'] . $b;
  }
  StopWatch('Blocklist: blockterms done');

  ##  If we came across any reasons to block, let's provide a message
  ##  to the author that it was blocked.  If $EnableWhyBlocked is set,
  ##  we'll even tell the author why.  :-)
  if (@$WhyBlockedFmt) {
    $MessagesFmt[] = $BlocklistMessageFmt;
    if (IsEnabled($EnableWhyBlocked, 0)) 
      foreach((array)$WhyBlockedFmt as $why) 
        $MessagesFmt[] = "<pre class='blocklistmessage'>$why</pre>\n";
  }
  StopWatch("Blocklist: end $pagename");
}


##   BlocklistDownload() handles retrieving blocklists from
##   external sources into PmWiki pages.  If it's able to
##   download an updated list, it uses that; otherwise it leaves
##   any existing list alone.
function BlocklistDownload($pagename, $dir = '') {
  global $BlocklistDownloadFmt, $BlocklistDownload, $FmtV;

  if ($dir) { flush(); chdir($dir); }
  SDV($BlocklistDownloadFmt, "
  [@
## blocklist-note:   NOTE: This page is automatically generated by blocklist.php
## blocklist-note:   NOTE: Any edits to this page may be lost!
## blocklist-url:    \$BlocklistDownloadUrl
## blocklist-when:   \$CurrentTimeISO
#  blocklist-format: \$BlocklistFormat
\$BlocklistData
  @]
");

  ##  get the existing blocklist page
  $bd = &$BlocklistDownload[$pagename];
  $page = ReadPage($pagename, READPAGE_CURRENT);

  ##  try to retrieve the remote data
  $blocklistdata = @file($bd['url']);

  ##  if we didn't get it, and we don't already have text, save a
  ##  note in the page so we know what happened
  if (!$blocklistdata && !@$page['text']) {
    $auf = ini_get('allow_url_fopen');
    $blocklistdata = "#### Unable to download blocklist (allow_url_fopen=$auf)";
  }

  ##  if we have some new text to save, let's format it and save it
  if ($blocklistdata) {
    $blocklistdata = implode('', (array)$blocklistdata);
    $blocklistdata = preg_replace('/^##blocklist.*/m', '', $blocklistdata);
    $FmtV['$BlocklistData'] = $blocklistdata;
    $FmtV['$BlocklistDownloadUrl'] = $bd['url'];
    $FmtV['$BlocklistFormat'] = $bd['format'];
    $page['text'] = FmtPageName($BlocklistDownloadFmt, $pagename);
    SDV($page['passwdread'], '@lock');
  }

  ##  save our updated(?) blocklist page
  WritePage($pagename, $page);
}
