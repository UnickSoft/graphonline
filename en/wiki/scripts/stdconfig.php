<?php if (!defined('PmWiki')) exit();
/*  Copyright 2002-2007 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This file allows features to be easily enabled/disabled in config.php.
    Simply set variables for the features to be enabled/disabled in config.php
    before including this file.  For example:
        $EnableQAMarkup=0;                      #disable Q: and A: tags
        $EnableWikiStyles=1;                    #include default wikistyles
    Each feature has a default setting, if the corresponding $Enable
    variable is not set then you get the default.

    To avoid processing any of the features of this file, set 
        $EnableStdConfig = 0;
    in config.php.
*/

$pagename = ResolvePageName($pagename);

if (!IsEnabled($EnableStdConfig,1)) return;


if (!function_exists('session_start') && IsEnabled($EnableRequireSession, 1))
  Abort('PHP is lacking session support', 'session');

if (IsEnabled($EnablePGCust,1))
  include_once("$FarmD/scripts/pgcust.php");

if (isset($PostConfig) && is_array($PostConfig)) {
  asort($PostConfig, SORT_NUMERIC);
  foreach ($PostConfig as $k=>$v) {
    if (!$k || !$v || $v<0 || $v>=50) continue;
    if (function_exists($k)) $k($pagename);
    elseif (file_exists($k)) include_once($k);
  }
}

if (IsEnabled($EnableRobotControl,1))
  include_once("$FarmD/scripts/robots.php");

if (IsEnabled($EnableCaches, 1))
  include_once("$FarmD/scripts/caches.php");

## Scripts that are part of a standard PmWiki distribution.
if (IsEnabled($EnableAuthorTracking,1)) 
  include_once("$FarmD/scripts/author.php");
if (IsEnabled($EnablePrefs, 1))
  include_once("$FarmD/scripts/prefs.php");
if (IsEnabled($EnableSimulEdit, 1))
  include_once("$FarmD/scripts/simuledit.php");
if (IsEnabled($EnableDrafts, 0))
  include_once("$FarmD/scripts/draft.php");        # after simuledit + prefs
if (IsEnabled($EnableSkinLayout,1))
  include_once("$FarmD/scripts/skins.php");        # must come after prefs
if (@$Transition || IsEnabled($EnableTransitions, 0))
  include_once("$FarmD/scripts/transition.php");   # must come after skins
if (@$LinkWikiWords || IsEnabled($EnableWikiWords, 0))
  include_once("$FarmD/scripts/wikiwords.php");    # must come before stdmarkup
if (IsEnabled($EnableStdMarkup,1))
  include_once("$FarmD/scripts/stdmarkup.php");    # must come after transition
if ($action=='diff' && @!$HandleActions['diff'])
  include_once("$FarmD/scripts/pagerev.php");
if (IsEnabled($EnableWikiTrails,1))
  include_once("$FarmD/scripts/trails.php");
if (IsEnabled($EnableWikiStyles,1))
  include_once("$FarmD/scripts/wikistyles.php");
if (IsEnabled($EnableMarkupExpressions, 1) 
    && !function_exists('MarkupExpression'))
  include_once("$FarmD/scripts/markupexpr.php");
if (IsEnabled($EnablePageList,1))
  include_once("$FarmD/scripts/pagelist.php");
if (IsEnabled($EnableVarMarkup,1))
  include_once("$FarmD/scripts/vardoc.php");
if (!function_exists(@$DiffFunction)) 
  include_once("$FarmD/scripts/phpdiff.php");
if ($action=='crypt')
  include_once("$FarmD/scripts/crypt.php");
if ($action=='edit' && IsEnabled($EnableGUIButtons,0))
  include_once("$FarmD/scripts/guiedit.php");
if (IsEnabled($EnableForms,1))                     
  include_once("$FarmD/scripts/forms.php");       # must come after prefs
if (IsEnabled($EnableUpload,0))
  include_once("$FarmD/scripts/upload.php");      # must come after forms
if (IsEnabled($EnableBlocklist, 0))
  include_once("$FarmD/scripts/blocklist.php");
if (IsEnabled($EnableNotify,0))
  include_once("$FarmD/scripts/notify.php");
if (IsEnabled($EnableDiag,0)) 
  include_once("$FarmD/scripts/diag.php");

if (IsEnabled($EnableUpgradeCheck,1)) {
  SDV($StatusPageName, "$SiteAdminGroup.Status");
  $page = ReadPage($StatusPageName, READPAGE_CURRENT);
  if (@$page['updatedto'] != $VersionNum) 
    { $action = 'upgrade'; include_once("$FarmD/scripts/upgrades.php"); }
}
