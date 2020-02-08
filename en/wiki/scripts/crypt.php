<?php if (!defined('PmWiki')) exit();
/*  Copyright 2002-2015 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This script defines ?action=crypt, providing help for WikiAdministrators
    to set up site-wide passwords in the installation.
*/

SDV($HandleActions['crypt'],'HandleCrypt');
SDV($ActionTitleFmt['crypt'],'| $[Password encryption]');

function HandleCrypt($pagename, $auth='read') {
  global $ScriptUrl,$HTMLStartFmt,$HTMLEndFmt;
  PrintFmt($pagename,$HTMLStartFmt);
  $passwd = stripmagic(@$_POST["passwd"]);
  echo FmtPageName(
    "<form action='{\$ScriptUrl}' method='POST'><p>
      Enter password to encrypt: 
      <input type='text' name='passwd' value='"
      . PHSC($passwd, ENT_QUOTES) ."' />
      <input type='submit' />
      <input type='hidden' name='n' value='{\$FullName}' />
      <input type='hidden' name='action' value='crypt' /></p></form>",
    $pagename);
  if ($passwd) { 
    $crypt = pmcrypt($passwd);
    echo "<p class='vspace'>Encrypted password = $crypt</p>"; 
    echo "<p class='vspace'>To set a site-wide password, insert the line below
      in your <i>config.php</i> file, <br />replacing <tt>'type'</tt> with
      one of <tt>'admin'</tt>, <tt>'read'</tt>, <tt>'edit'</tt>,
      or <tt>'attr'</tt>.  <br />See <a 
      href='$ScriptUrl?n=PmWiki.PasswordsAdmin'>PasswordsAdmin</a> for more
      details.</p>
      <pre class='vspace'>  \$DefaultPasswords['type']='$crypt';</pre>";
  }
  PrintFmt($pagename,$HTMLEndFmt);
}

