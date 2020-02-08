<?php if (!defined('PmWiki')) exit();
/*  Copyright 2005-2014 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This script handles per-browser preferences.  Preference settings
    are stored in wiki pages as XLPage translations, and a cookie on
    the browser tells PmWiki where to find the browser's preferred
    settings.

    This script looks for a ?setprefs= request parameter (e.g., in
    a url); when it finds one it sets a 'setprefs' cookie on the browser 
    identifying the page to be used to load browser preferences,
    and loads the associated preferences.

    If there is no ?setprefs= request, then the script uses the
    'setprefs' cookie from the browser to load the preference settings.
*/

SDV($PrefsCookie, $CookiePrefix.'setprefs');
SDV($PrefsCookieExpires, $Now + 60 * 60 * 24 * 365);
$LogoutCookies[] = $PrefsCookie;

$sp = '';
if (@$_COOKIE[$PrefsCookie]) $sp = $_COOKIE[$PrefsCookie];
if (isset($_GET['setprefs'])) {
  $sp = MakePageName($pagename, $_GET['setprefs']);
  setcookie($PrefsCookie, $sp, $PrefsCookieExpires, '/');
}
if ($sp && PageExists($sp)) XLPage('prefs', $sp, true);

if(is_array($XL['prefs'])) {
  foreach($XL['prefs'] as $k=>$v) {
    if(! preg_match('/^(e_rows|e_cols|TimeFmt|Locale|Site\\.EditForm)$|^ak_/', $k))
      unset($XL['prefs'][$k]);
  }
}

XLSDV('en', array(
  'ak_view' => '',
  'ak_edit' => 'e',
  'ak_history' => 'h',
  'ak_attach'  => '',
  'ak_backlinks' => '',
  'ak_logout' => '',
  'ak_print' => '',
  'ak_recentchanges' => 'c',
  'ak_save' => 's',
  'ak_saveedit' => 'u',
  'ak_savedraft' => 'd',
  'ak_preview' => 'p',
  'ak_em' => '',
  'ak_strong' => '',
  ));

