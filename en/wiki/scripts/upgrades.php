<?php if (!defined('PmWiki')) exit();
/*  Copyright 2007-2011 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

*/
global $HandleActions, $HandleAuth;

$HandleActions['upgrade'] = 'HandleUpgrade';
$HandleAuth['upgrade'] = 'read';

function HandleUpgrade($pagename, $auth = 'ALWAYS') {
  global $SiteGroup, $SiteAdminGroup, $StatusPageName, $ScriptUrl,
    $AuthUserPageFmt, $VersionNum, $Version;
  StopWatch('HandleUpgrade: begin');

  $message = '';
  $done = '';
  ##  check for Site.* --> SiteAdmin.*
  foreach(array('AuthUser', 'NotifyList', 'Blocklist', 'ApprovedUrls') as $n) {
    $n0 = "$SiteGroup.$n"; $n1 = "$SiteAdminGroup.$n";
    StopWatch("HandleUpgrade: checking $n0 -> $n1");
    ## checking AuthUser is special, because Site.AuthUser comes with the
    ## distribution.
    if ($n == 'AuthUser') {
      ##  if we already have a user-modified SiteAdmin.AuthUser, we can skip
      SDV($AuthUserPageFmt, '$SiteAdminGroup.AuthUser');
      $n1 = FmtPageName($AuthUserPageFmt, $pagename);
      $page = ReadPage($n1, READPAGE_CURRENT);
      if (@$page['time'] > 1000000000) continue;
      ##  if there's not a user-modified Site.AuthUser, we can skip
      $page = ReadPage($n0, READPAGE_CURRENT);
      if (@$page['time'] == 1000000000) continue;
    } else if (!PageExists($n0) || PageExists($n1)) continue;

    if (@$_REQUEST['migrate'] == 'yes') {
      ##  if the admin wants PmWiki to migrate, do it.
      $page = RetrieveAuthPage($n0, 'admin', true);
      StopWatch("HandleUpgrade: copying $n0 -> $n1");
      if ($page) { 
        WritePage($n1, $page); 
        $done .= "<li>Copied $n0 to $n1</li>";
        continue; 
      }
    }
    $message .= "<li>$n0 -&gt; $n1</li>";
  }

  if ($message) {
    $migrateurl = "$ScriptUrl?action=upgrade&amp;migrate=yes";
    $infourl = 'http://www.pmwiki.org/wiki/PmWiki/UpgradeToSiteAdmin';
    $message = 
      "<h2>Upgrade notice -- SiteAdmin group</h2>
      <p>This version of PmWiki expects several administrative pages 
      from the <em>Site</em> group to be found in a new <em>SiteAdmin</em> group.  
      On this site, the following pages appear to need to be relocated:</p>
      <ul>$message</ul>

      <p>For more information about this change, including the various
      options for proceeding, see</p>
      <blockquote><a target='_blank' href='$infourl'>$infourl</a></blockquote>

      <form action='$ScriptUrl' method='post'>
      <p>If you would like PmWiki to attempt to automatically copy 
      these pages into their new <br /> locations for you, try 
        <input type='hidden' name='action' value='upgrade' />
        <input type='hidden' name='migrate' value='yes' />
        <input type='submit' value='Relocate pages listed above' /> 
        (admin password required) </p>
      </form>

      <p>If you want to configure PmWiki so that it continues to
      look for the above pages in <em>$SiteGroup</em>, add the
      following line near the top of <em>local/config.php</em>:</p>

      <blockquote><pre>\$SiteAdminGroup = \$SiteGroup;</pre></blockquote>

      $Version
      ";
    print $message;
    exit;
  }

  StopWatch("UpgradeCheck: writing $StatusPageName");
  Lock(2);
  SDV($StatusPageName, "$SiteAdminGroup.Status");
  $page = ReadPage($StatusPageName);
  $page['updatedto'] = $VersionNum;
  WritePage($StatusPageName, $page);

  if ($done) {
    $done .= "<li>Updated $StatusPageName</li>";
    echo "<h2>Upgrade to $Version ... ok</h2><ul>$done</ul>";
    $GLOBALS['EnableRedirect'] = 0;
  }
  Redirect($pagename);
}
