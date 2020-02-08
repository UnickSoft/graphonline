<?php if (!defined('PmWiki')) exit();
/*  Copyright 2002-2013 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This script enables markup of the form <<|TrailPage|>> to be 
    used to build "trails" through wiki documents.

    This feature is automatically included from stdconfig.php unless
    disabled by $EnableWikiTrails = 0; .  To explicitly include this feature,
    execute
   	include_once("scripts/trails.php");
    from config.php somewhere.

    Once enabled, the <<|TrailPage|>> markup is replaced with
    << PrevPage | TrailPage | NextPage >> on output.  TrailPage should
    contain either a bullet or number list defining the sequence of pages
    in the "trail".

    The ^|TrailPage|^ markup uses the depth of the bullets to display
    the ancestry of the TrailPage to the current one.  The <|TrailPage|> 
    markup is like <<|TrailPage|>> except that "< PrevPage |" and 
    "| NextPage >" are omitted if at the beginning or end of the 
    trail respectively.  Thanks to John Rankin for contributing these
    markups and the original suggestion for WikiTrails.
*/

Markup_e('<<|','<links','/&lt;&lt;\\|([^|]+|\\[\\[(.+?)\\]\\])\\|&gt;&gt;/',
  "PRR(MakeTrailStop(\$pagename,\$m[1]))");
Markup_e('<|','><<|','/&lt;\\|([^|]+|\\[\\[(.+?)\\]\\])\\|&gt;/',
  "PRR(MakeTrailStopB(\$pagename,\$m[1]))");
Markup_e('^|','<links','/\\^\\|([^|]+|\\[\\[(.+?)\\]\\])\\|\\^/',
  "PRR(MakeTrailPath(\$pagename,\$m[1]))");

SDVA($SaveAttrPatterns, array(
   '/<<\\|([^|]+|\\[\\[(.+?)\\]\\])\\|>>/' => '$1',
   '/<\\|([^|]+|\\[\\[(.+?)\\]\\])\\|>/' => '$1',
   '/\\^\\|([^|]+|\\[\\[(.+?)\\]\\])\\|\\^/' => '$1'));

$Conditions['ontrail'] = 'CondOnTrail($pagename, $condparm)';

function CondOnTrail($pagename, $condparm) {
  @list($trailname, $pn) = preg_split('/\\s+/', $condparm, 2);
  $trail = ReadTrail($pagename, $trailname);
  if (!$trail) return false;
  $pn = ($pn > '') ? MakePageName($pagename, $pn) : $pagename;
  foreach($trail as $t)
    if ($t['pagename'] == $pn) return true;
  return false;
}

function ReadTrail($pagename, $trailname) {
  global $RASPageName, $SuffixPattern, $GroupPattern, $WikiWordPattern,
    $LinkWikiWords;
  if (preg_match('/^\\[\\[(.+?)(-&gt;|\\|)(.+?)\\]\\]$/', $trailname, $m)) 
    $trailname = ($m[2] == '|') ? $m[1] : $m[3];
  $trailtext = RetrieveAuthSection($pagename, $trailname);
  $trailname = $RASPageName;
  $trailtext = Qualify($trailname, $trailtext);
  $t = array();
  $n = 0;
  foreach(explode("\n", PHSC(@$trailtext, ENT_NOQUOTES)) 
          as $x) {
    $x = preg_replace("/\\[\\[([^\\]]*)-&gt;([^\\]]*)\\]\\]/",'[[$2|$1]]',$x);
    if (!preg_match("/^([#*:]+) \\s* 
          (\\[\\[([^:#!|][^|:]*?)(?:\".*?\")?(\\|.*?)?\\]\\]($SuffixPattern)
          | (($GroupPattern([\\/.]))?$WikiWordPattern)) (.*)/x",$x,$match))
       continue;
    if (@$match[6]) {
       if (!$LinkWikiWords) continue;
       $tgt = MakePageName($trailname, $match[6]);
    } else $tgt = MakePageName($trailname, $match[3]);
    $t[$n]['depth'] = $depth = strlen($match[1]);
    $t[$n]['pagename'] = $tgt;
    $t[$n]['markup'] = $match[2];
    $t[$n]['detail'] = $match[9];
    for($i=$depth;$i<10;$i++) $d[$i]=$n;
    if ($depth>1) $t[$n]['parent']=@$d[$depth-1];
    $n++;
  }
  return $t;
}

function MakeTrailStop($pagename,$trailname) {
  $t = ReadTrail($pagename,$trailname);
  $prev=''; $next='';
  for($i=0;$i<count($t);$i++) {
    if ($t[$i]['pagename']==$pagename) {
      if ($i>0) $prev = $t[$i-1]['markup'];
      if ($i+1<count($t)) $next = $t[$i+1]['markup'];
    }
  }
  return "<span class='wikitrail'>&lt;&lt; $prev | $trailname | $next &gt;&gt;</span>";
}

function MakeTrailStopB($pagename,$trailname) {
  $t = ReadTrail($pagename,$trailname);
  $prev = ''; $next = '';
  for($i=0;$i<count($t);$i++) {
    if ($t[$i]['pagename']==$pagename) {
      if ($i>0) $prev = '&lt; '.$t[$i-1]['markup'].' | ';
      if ($i+1<count($t)) $next = ' | '.$t[$i+1]['markup'].' &gt;';
    }
  }
  return "<span class='wikitrail'>$prev$trailname$next</span>";
} 

function MakeTrailPath($pagename,$trailname) {
  global $TrailPathSep;
  SDV($TrailPathSep,' | ');
  $t = ReadTrail($pagename,$trailname);
  $crumbs = '';
  for($i=0;$i<count($t);$i++) {
    if ($t[$i]['pagename']==$pagename) {
      while (@$t[$i]['depth']>0) {
        $crumbs = $TrailPathSep.$t[$i]['markup'].$crumbs;
        $i = @$t[$i]['parent'];
      }
      return "<span class='wikitrail'>$trailname$crumbs</span>";
    }
  }
  return "<span class='wikitrail'>$trailname</span>";
}

