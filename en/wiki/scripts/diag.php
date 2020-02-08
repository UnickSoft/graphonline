<?php if (!defined('PmWiki')) exit();
/*  Copyright 2003-2005, 2007 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This file adds "?action=diag" and "?action=phpinfo" actions to PmWiki.  
    This produces lots of diagnostic output that may be helpful to the 
    software authors when debugging PmWiki or other scripts.
*/

@ini_set('display_errors', '1');
@ini_set('track_errors','1');

if ($action=='diag') {
  @session_start();
  header('Content-type: text/plain');
  print_r($GLOBALS);
  exit();
}

if ($action=='phpinfo') { phpinfo(); exit(); }

function Ruleset() {
  global $MarkupTable;
  $out = '';
  $dbg = 0;
  BuildMarkupRules();
  foreach($MarkupTable as $id=>$m) {
    $out .= sprintf("%-16s %-16s %-16s %s\n",$id,@$m['cmd'],@$m['seq'], @$m['dbg']);
    if(@$m['dbg']) $dbg++;
  }
  if($dbg) $out .= "
[!] Markup rules possibly incompatible with PHP 5.5 or newer.
    Please contact the recipe maintainer for update
    or see www.pmwiki.org/wiki/PmWiki/CustomMarkup";
  return $out;
}

$HandleActions['ruleset'] = 'HandleRuleset';

function HandleRuleset($pagename) {
  header("Content-type: text/plain");
  print Ruleset();
}

function StopWatchHTML($pagename, $print = 0) {
  global $StopWatch;
  StopWatch('now');
  $l = strlen(count($StopWatch));
  $out = '<pre>';
  foreach((array)$StopWatch as $i => $x)
    $out .= sprintf("%{$l}d: %s\n", $i, $x);
  $out .= '</pre>';
  if (is_array($StopWatch)) array_pop($StopWatch);
  if ($print) print $out;
  return $out;
}

