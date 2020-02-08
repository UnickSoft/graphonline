<?php if (!defined('PmWiki')) exit();
/*  Copyright 2006-2011 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This script enables email notifications to be sent when posts
    are made.  It is included by default from the stdconfig.php 
    script if $EnableNotify is set to non-zero.

    Once enabled, the addresses to receive messages are configured
    via the Site.NotifyList page.  A simple line in that page
    such as 

        notify=somebody@example.com

    will cause messages to be periodically sent to "somebody@example.com"
    listing the pages that have changed on the site since the previous
    message was sent.  Multiple notify lines can be placed in the page,
    and there are options to restrict the types of notifications
    desired.  For more details, see the PmWiki.Notify page in
    the documentation.

    Several variables set defaults for this script:

    $NotifyFrom - return email address to use in message.
    $NotifyDelay - number of seconds to wait before sending mail
        after the first post.
    $NotifySquelch - minimum number of seconds between sending email
        messages to each address.  Individual "notify=" lines in
        Site.NotifyList can override this value via a custom "squelch="
        parameter.
    $NotifyFile - scratchpad file used to keep track of pending emails.
    $NotifyListPageFmt - name of the NotifyList configuration page.
    $NotifySubjectFmt - subject line for sent messages.
    $NotifyBodyFmt - body of message to be sent.  The string '$NotifyItems'
        is replaced with the list of posts in the email.
    $NotifyItemFmt - the format for each post to be included in a notification.
    $NotifyTimeFmt - the format for dates and times ($PostTime) 
        in notification messages.
    $NotifyHeaders - any additional message headers to be sent.
    $NotifyParameters - any additional parameters to be passed to PHP's
        mail() function.
*/

SDV($NotifyDelay, 0);
SDV($NotifySquelch, 10800);
SDV($NotifyFile, "$WorkDir/.notifylist");
SDV($NotifyListPageFmt, '$SiteAdminGroup.NotifyList');
SDV($NotifySubjectFmt, '[$WikiTitle] recent notify posts');
SDV($NotifyBodyFmt, 
  "Recent \$WikiTitle posts:\n" 
  . "  \$ScriptUrl/$[{\$SiteGroup}/AllRecentChanges]\n\n\$NotifyItems\n");
SDV($NotifyTimeFmt, $TimeFmt);
SDV($NotifyItemFmt, 
  ' * {$FullName} . . . $PostTime by {$Author}');
SDV($NotifyHeaders, '');
SDV($NotifyParameters, '');

if (@$NotifyFrom)
  $NotifyHeaders = "From: $NotifyFrom\r\n$NotifyHeaders";

$EditFunctions[] = 'PostNotify';

##   check if we need to do notifications
if ($action != 'edit' && $action != 'postupload') NotifyCheck($pagename);


function NotifyCheck($pagename) {
  global $NotifyFile, $Now, $LastModTime;
  $nfp = @fopen($NotifyFile, 'r');
  if (!$nfp) return;
  $nextevent = fgets($nfp);
  fclose($nfp);
  if ($Now < $nextevent && $LastModTime < filemtime($NotifyFile)) return;
  register_shutdown_function('NotifyUpdate', $pagename, getcwd());
}

    
function PostNotify($pagename, &$page, &$new) {
  global $IsPagePosted;
  if ($IsPagePosted) 
    register_shutdown_function('NotifyUpdate', $pagename, getcwd());
}


function NotifyUpdate($pagename, $dir='') {
  global $NotifyList, $NotifyListPageFmt, $NotifyFile, $IsPagePosted, $IsUploadPosted,
    $FmtV, $NotifyTimeFmt, $NotifyItemFmt, $SearchPatterns,
    $NotifySquelch, $NotifyDelay, $Now, $Charset, $EnableNotifySubjectEncode,
    $NotifySubjectFmt, $NotifyBodyFmt, $NotifyHeaders, $NotifyParameters;

  $abort = ignore_user_abort(true);
  if ($dir) { flush(); chdir($dir); }

  $GLOBALS['EnableRedirect'] = 0;

  ##   Read in the current notify configuration
  $pn = FmtPageName($NotifyListPageFmt, $pagename);
  $npage = ReadPage($pn, READPAGE_CURRENT);
  preg_match_all('/^[\s*:#->]*(notify[:=].*)/m', $npage['text'], $nlist);
  $nlist = array_merge((array)@$NotifyList, (array)@$nlist[1]);
  if (!$nlist) return;

  ##   make sure other processes are locked out
  Lock(2);

  ##   let's load the current .notifylist table
  $nfile = FmtPageName($NotifyFile, $pagename);
  $nfp = @fopen($nfile, 'r');
  if ($nfp) {
    ##   get our current squelch and delay timestamps
    clearstatcache();
    $sz = filesize($nfile);
    list($nextevent, $firstpost) = explode(' ', rtrim(fgets($nfp, $sz)));
    ##   restore our notify array
    $notify = unserialize(fgets($nfp, $sz));
    fclose($nfp);
  }
  if (!is_array($notify)) $notify = array();

  ##   if this is for a newly posted page, get its information
  if ($IsPagePosted || $IsUploadPosted) {
    $page = ReadPage($pagename, READPAGE_CURRENT);
    $FmtV['$PostTime'] = strftime($NotifyTimeFmt, $Now);
    $item = urlencode(FmtPageName($NotifyItemFmt, $pagename));
    if ($firstpost < 1) $firstpost = $Now;
  }

  foreach($nlist as $n) {
    $opt = ParseArgs($n);
    $mailto = preg_split('/[\s,]+/', $opt['notify']);
    if (!$mailto) continue;
    if ($opt['squelch']) 
      foreach($mailto as $m) $squelch[$m] = $opt['squelch'];
    if (!$IsPagePosted) continue;
    if ($opt['link']) {
      $link = MakePageName($pagename, $opt['link']);
      if (!preg_match("/(^|,)$link(,|$)/i", $page['targets'])) continue;
    }
    $pats = @(array)$SearchPatterns[$opt['list']];
    if ($opt['group']) $pats[] = FixGlob($opt['group'], '$1$2.*');
    if ($opt['name']) $pats[] = FixGlob($opt['name'], '$1*.$2');
    if ($pats && !MatchPageNames($pagename, $pats)) continue;
    if ($opt['trail']) {
      $trail = ReadTrail($pagename, $opt['trail']);
      for ($i=0; $i<count($trail); $i++) 
        if ($trail[$i]['pagename'] == $pagename) break;
      if ($i >= count($trail)) continue;
    }
    foreach($mailto as $m) { $notify[$m][] = $item; }
  }

  $nnow = time();
  if ($nnow < $firstpost + $NotifyDelay) 
    $nextevent = $firstpost + $NotifyDelay;
  else {
    $firstpost = 0;
    $nextevent = $nnow + 86400;
    $mailto = array_keys($notify);
    $subject = FmtPageName($NotifySubjectFmt, $pagename);
    if(IsEnabled($EnableNotifySubjectEncode, 0)
      && preg_match("/[^\x20-\x7E]/", $subject))
        $subject = strtoupper("=?$Charset?B?"). base64_encode($subject)."?=";
    $body = FmtPageName($NotifyBodyFmt, $pagename);
    foreach ($mailto as $m) {
      $msquelch = @$notify[$m]['lastmail'] +
                    ((@$squelch[$m]) ? $squelch[$m] : $NotifySquelch);
      if ($nnow < $msquelch) {
        if ($msquelch < $nextevent && count($notify[$m])>1)
          $nextevent = $msquelch;
        continue;
      }
      unset($notify[$m]['lastmail']);
      if (!$notify[$m]) { unset($notify[$m]); continue; }
      $mbody = str_replace('$NotifyItems',   
                           urldecode(implode("\n", $notify[$m])), $body);
      if ($NotifyParameters && !@ini_get('safe_mode'))
        mail($m, $subject, $mbody, $NotifyHeaders, $NotifyParameters);
      else 
        mail($m, $subject, $mbody, $NotifyHeaders);
      $notify[$m] = array('lastmail' => $nnow);
    }
  }

  ##   save the updated notify status
  $nfp = @fopen($nfile, "w");
  if ($nfp) {
    fputs($nfp, "$nextevent $firstpost\n");
    fputs($nfp, serialize($notify) . "\n");
    fclose($nfp);
  }
  Lock(0);
  return true;
}

