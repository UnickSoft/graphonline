<?php if (!defined('PmWiki')) exit();
/*  Copyright 2004-2014 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This script implements (:pagelist:) and friends -- it's one
    of the nastiest scripts you'll ever encounter.  Part of the reason
    for this is that page listings are so powerful and flexible, so
    that adds complexity.  They're also expensive, so we have to
    optimize them wherever we can.

    The core function is FmtPageList(), which will generate a 
    listing according to a wide variety of options.  FmtPageList takes 
    care of initial option processing, and then calls a "FPL"
    (format page list) function to obtain the formatted output.
    The FPL function is chosen by the 'fmt=' option to (:pagelist:).

    Each FPL function calls MakePageList() to obtain the list
    of pages, formats the list somehow, and returns the results
    to FmtPageList.  FmtPageList then returns the output to
    the caller, and calls Keep() (preserves HTML) or PRR() (re-evaluate
    as markup) as appropriate for the output being returned.
*/

## $PageIndexFile is the index file for term searches and link= option
if (IsEnabled($EnablePageIndex, 1)) {
  SDV($PageIndexFile, "$WorkDir/.pageindex");
  $EditFunctions[] = 'PostPageIndex';
}

SDV($StrFoldFunction, 'strtolower');

## $SearchPatterns holds patterns for list= option
SDV($SearchPatterns['all'], array());
SDVA($SearchPatterns['normal'], array(
  'recent' => '!\.(All)?Recent(Changes|Uploads)$!',
  'group' => '!\.Group(Print)?(Header|Footer|Attributes)$!',
  'self' => str_replace('.', '\\.', "!^$pagename$!")));

## $FPLFormatOpt is a list of options associated with fmt=
## values.  'default' is used for any undefined values of fmt=.
SDVA($FPLFormatOpt, array(
  'default' => array('fn' => 'FPLTemplate', 'fmt' => '#default'),
  'bygroup' => array('fn' => 'FPLTemplate', 'template' => '#bygroup',
                     'class' => 'fplbygroup'),
  'simple'  => array('fn' => 'FPLTemplate', 'template' => '#simple',
                     'class' => 'fplsimple'),
  'group'   => array('fn' => 'FPLTemplate', 'template' => '#group',
                     'class' => 'fplgroup'),
  'title'   => array('fn' => 'FPLTemplate', 'template' => '#title',
                     'class' => 'fpltitle', 'order' => 'title'),
  'count'   => array('fn' => 'FPLCountA'),
  ));

SDV($SearchResultsFmt, "<div class='wikisearch'>\$[SearchFor]
  <div class='vspace'></div>\$MatchList
  <div class='vspace'></div>\$[SearchFound]</div>");
SDV($SearchQuery, str_replace('$', '&#036;', 
  PHSC(stripmagic(@$_REQUEST['q']), ENT_NOQUOTES)));
XLSDV('en', array(
  'SearchFor' => 'Results of search for <em>$Needle</em>:',
  'SearchFound' => 
    '$MatchCount pages found out of $MatchSearched pages searched.'));

SDV($PageListArgPattern, '((?:\\$:?)?\\w+)[:=]');

Markup_e('pagelist', 'directives',
  '/\\(:pagelist(\\s+.*?)?:\\)/i',
  "FmtPageList('\$MatchList', \$pagename, array('o' => \$m[1].' '))");
Markup_e('searchbox', 'directives',
  '/\\(:searchbox(\\s.*?)?:\\)/',
  "SearchBox(\$pagename, ParseArgs(\$m[1], '$PageListArgPattern'))");
Markup_e('searchresults', 'directives',
  '/\\(:searchresults(\\s+.*?)?:\\)/i',
  "FmtPageList(\$GLOBALS['SearchResultsFmt'], \$pagename, 
       array('req' => 1, 'request'=>1, 'o' => \$m[1]))");

SDV($SaveAttrPatterns['/\\(:(searchresults|pagelist)(\\s+.*?)?:\\)/i'], ' ');

SDV($HandleActions['search'], 'HandleSearchA');
SDV($HandleAuth['search'], 'read');
SDV($ActionTitleFmt['search'], '| $[Search Results]');

SDVA($PageListFilters, array(
  'PageListCache' => 80,
  'PageListProtect' => 90,
  'PageListSources' => 100,
  'PageListPasswords' => 120,
  'PageListIf' => 140,
  'PageListTermsTargets' => 160,
  'PageListVariables' => 180,
  'PageListSort' => 900,
));

foreach(array('random', 'size', 'time', 'ctime') as $o) 
  SDV($PageListSortCmp[$o], "@(\$PCache[\$x]['$o']-\$PCache[\$y]['$o'])");
SDV($PageListSortCmp['title'], 
  '@strcasecmp($PCache[$x][\'=title\'], $PCache[$y][\'=title\'])');

define('PAGELIST_PRE' , 1);
define('PAGELIST_ITEM', 2);
define('PAGELIST_POST', 4);

## SearchBox generates the output of the (:searchbox:) markup.
## If $SearchBoxFmt is defined, that is used, otherwise a searchbox
## is generated.  Options include group=, size=, label=.
function SearchBox($pagename, $opt) {
  global $SearchBoxFmt, $SearchBoxOpt, $SearchQuery, $EnablePathInfo;
  if (isset($SearchBoxFmt)) return Keep(FmtPageName($SearchBoxFmt, $pagename));
  SDVA($SearchBoxOpt, array('size' => '40', 
    'label' => FmtPageName('$[Search]', $pagename),
    'value' => str_replace("'", "&#039;", $SearchQuery)));
  $opt = array_merge((array)$SearchBoxOpt, @$_GET, (array)$opt);
  $opt['action'] = 'search';
  $target = (@$opt['target']) 
            ? MakePageName($pagename, $opt['target']) : $pagename;
  $opt['n'] = IsEnabled($EnablePathInfo, 0) ? '' : $target;
  $out = FmtPageName(" class='wikisearch' action='\$PageUrl' method='get'>",
                     $target);
  foreach($opt as $k => $v) {
    if ($v == '' || is_array($v)) continue;
    $v = str_replace("'", "&#039;", $v);
    $opt[$k] = $v;
    if ($k == 'q' || $k == 'label' || $k == 'value' || $k == 'size') continue;
    $k = str_replace("'", "&#039;", $k);
    $out .= "<input type='hidden' name='$k' value='$v' />";
  }
  $out .= "<input type='text' name='q' value='{$opt['value']}' 
    class='inputbox searchbox' size='{$opt['size']}' /><input type='submit' 
    class='inputbutton searchbutton' value='{$opt['label']}' />";
  return '<form '.Keep($out).'</form>';
}


## FmtPageList combines options from markup, request form, and url,
## calls the appropriate formatting function, and returns the string.
function FmtPageList($outfmt, $pagename, $opt) {
  global $GroupPattern, $FmtV, $PageListArgPattern, 
    $FPLFormatOpt, $FPLFunctions;
  # get any form or url-submitted request
  $rq = PHSC(stripmagic(@$_REQUEST['q']), ENT_NOQUOTES);
  # build the search string
  $FmtV['$Needle'] = $opt['o'] . ' ' . $rq;
  # Handle "group/" at the beginning of the form-submitted request
  if (preg_match("!^($GroupPattern(\\|$GroupPattern)*)?/!i", $rq, $match)) {
    $opt['group'] = @$match[1];
    $rq = substr($rq, strlen(@$match[1])+1);
  }
  $opt = array_merge($opt, ParseArgs($opt['o'], $PageListArgPattern));
  # merge markup options with form and url
  if (@$opt['request'] && @$_REQUEST) {
    $rkeys = preg_grep('/^=/', array_keys($_REQUEST), PREG_GREP_INVERT);
    if ($opt['request'] != '1') {
      list($incl, $excl) = GlobToPCRE($opt['request']);
      if ($excl) $rkeys = array_diff($rkeys, preg_grep("/$excl/", $rkeys));
      if ($incl) $rkeys = preg_grep("/$incl/", $rkeys);
    }
    $cleanrequest = array();
    foreach($rkeys as $k) {
      $cleanrequest[$k] = stripmagic($_REQUEST[$k]);
    }
    $opt = array_merge($opt, ParseArgs($rq, $PageListArgPattern), $cleanrequest);
  }

  # non-posted blank search requests return nothing
  if (@($opt['req'] && !$opt['-'] && !$opt[''] && !$opt['+'] && !$opt['q']))
    return '';
  # terms and group to be included and excluded
  $GLOBALS['SearchIncl'] = array_merge((array)@$opt[''], (array)@$opt['+']);
  $GLOBALS['SearchExcl'] = (array)@$opt['-'];
  $GLOBALS['SearchGroup'] = @$opt['group'];
  $fmt = @$opt['fmt']; if (!$fmt) $fmt = 'default';
  $fmtopt = @$FPLFormatOpt[$fmt];
  if (!is_array($fmtopt)) {
    if ($fmtopt) $fmtopt = array('fn' => $fmtopt);
    elseif (@$FPLFunctions[$fmt]) 
      $fmtopt = array('fn' => $FPLFunctions[$fmt]);
    else $fmtopt = $FPLFormatOpt['default'];
  }
  $fmtfn = @$fmtopt['fn'];
  if (!is_callable($fmtfn)) $fmtfn = $FPLFormatOpt['default']['fn'];
  $matches = array();
  $opt = array_merge($fmtopt, $opt);
  $out = $fmtfn($pagename, $matches, $opt);
  $FmtV['$MatchCount'] = count($matches);
  if ($outfmt != '$MatchList') 
    { $FmtV['$MatchList'] = $out; $out = FmtPageName($outfmt, $pagename); }
  if ($out[0] == '<') $out = Keep($out);
  return PRR($out);
}


## MakePageList generates a list of pages using the specifications given
## by $opt.
function MakePageList($pagename, $opt, $retpages = 1) {
  global $MakePageListOpt, $PageListFilters, $PCache;

  StopWatch('MakePageList pre');
  SDVA($MakePageListOpt, array('list' => 'default'));
  $opt = array_merge((array)$MakePageListOpt, (array)$opt);
  if (!@$opt['order'] && !@$opt['trail']) $opt['order'] = 'name';
  $opt['order'] = preg_replace('/[^-\\w:$]+/', ',', $opt['order']);

  ksort($opt); $opt['=key'] = md5(serialize($opt));

  $itemfilters = array(); $postfilters = array();
  asort($PageListFilters);
  $opt['=phase'] = PAGELIST_PRE; $list=array(); $pn=NULL; $page=NULL;
  foreach($PageListFilters as $fn => $v) {
    if ($v<0) continue;
    $ret = $fn($list, $opt, $pagename, $page);
    if ($ret & PAGELIST_ITEM) $itemfilters[] = $fn;
    if ($ret & PAGELIST_POST) $postfilters[] = $fn;
  }

  StopWatch("MakePageList items count=".count($list).", filters=".implode(',',$itemfilters));
  $opt['=phase'] = PAGELIST_ITEM;
  $matches = array(); $opt['=readc'] = 0;
  foreach((array)$list as $pn) {
    $page = array();
    foreach((array)$itemfilters as $fn) 
      if (!$fn($list, $opt, $pn, $page)) continue 2;
    $page['pagename'] = $page['name'] = $pn;
    PCache($pn, $page);
    $matches[] = $pn;
  }
  $list = $matches;
  StopWatch("MakePageList post count=".count($list).", readc={$opt['=readc']}");

  $opt['=phase'] = PAGELIST_POST; $pn=NULL; $page=NULL;
  foreach((array)$postfilters as $fn) 
    $fn($list, $opt, $pagename, $page);
  
  if ($retpages) 
    for($i=0; $i<count($list); $i++)
      $list[$i] = &$PCache[$list[$i]];
  StopWatch('MakePageList end');
  return $list;
}


function PageListProtect(&$list, &$opt, $pn, &$page) {
  global $EnablePageListProtect;

  switch ($opt['=phase']) {
    case PAGELIST_PRE:
      if (!IsEnabled($EnablePageListProtect, 1) && @$opt['readf'] < 1000)
        return 0;
      StopWatch("PageListProtect enabled");
      $opt['=protectexclude'] = array();
      $opt['=protectsafe'] = (array)@$opt['=protectsafe'];
      return PAGELIST_ITEM|PAGELIST_POST;

    case PAGELIST_ITEM:
      if (@$opt['=protectsafe'][$pn]) return 1;
      $page = RetrieveAuthPage($pn, 'ALWAYS', false, READPAGE_CURRENT);
      $opt['=readc']++;
      if (!$page['=auth']['read']) $opt['=protectexclude'][$pn] = 1;
      if (!$page['=passwd']['read']) $opt['=protectsafe'][$pn] = 1; 
      else NoCache();
      return 1;

    case PAGELIST_POST:
      $excl = array_keys($opt['=protectexclude']);
      $safe = array_keys($opt['=protectsafe']);
      StopWatch("PageListProtect excluded=" .count($excl)
                . ", safe=" . count($safe));
      $list = array_diff($list, $excl);
      return 1;
  }
}


function PageListSources(&$list, &$opt, $pn, &$page) {
  global $SearchPatterns;

  StopWatch('PageListSources begin');
  ## add the list= option to our list of pagename filter patterns
  $opt['=pnfilter'] = array_merge((array)@$opt['=pnfilter'], 
                                  (array)@$SearchPatterns[$opt['list']]);

  if (@$opt['group']) $opt['=pnfilter'][] = FixGlob($opt['group'], '$1$2.*');
  if (@$opt['name']) $opt['=pnfilter'][] = FixGlob($opt['name'], '$1*.$2');

  if (@$opt['trail']) {
    $trail = ReadTrail($pn, $opt['trail']);
    $tlist = array();
    foreach($trail as $tstop) {
      $n = $tstop['pagename'];
      $tlist[] = $n;
      $tstop['parentnames'] = array();
      PCache($n, $tstop);
    }
    foreach($trail as $tstop) 
      $PCache[$tstop['pagename']]['parentnames'][] = 
        @$trail[$tstop['parent']]['pagename'];
    if (!@$opt['=cached']) $list = MatchPageNames($tlist, $opt['=pnfilter']);
  } else if (!@$opt['=cached']) $list = ListPages($opt['=pnfilter']);
  StopWatch("PageListSources end count=".count($list));
  return 0;
}


function PageListPasswords(&$list, &$opt, $pn, &$page) {
  if ($opt['=phase'] == PAGELIST_PRE)
    return (@$opt['passwd'] > '' && !@$opt['=cached']) ? PAGELIST_ITEM : 0;

  if (!$page) { $page = ReadPage($pn, READPAGE_CURRENT); $opt['=readc']++; }
  if (!$page) return 0;
  return (boolean)preg_grep('/^passwd/', array_keys($page));
}


function PageListIf(&$list, &$opt, $pn, &$page) {
  global $Conditions, $Cursor;

  ##  See if we have any "if" processing to perform
  if ($opt['=phase'] == PAGELIST_PRE) 
    return (@$opt['if'] > '') ? PAGELIST_ITEM : 0;

  $condspec = $opt['if'];
  $Cursor['='] = $pn;
  $varpat = '\\{([=*]|!?[-\\w.\\/\\x80-\\xff]*)(\\$:?\\w+)\\}';
  while (preg_match("/$varpat/", $condspec, $match)) {
    $condspec = PPRE("/$varpat/",
                    "PVSE(PageVar('$pn', \$m[2], \$m[1]))", $condspec);
  }
  if (!preg_match("/^\\s*(!?)\\s*(\\S*)\\s*(.*?)\\s*$/", $condspec, $match)) 
    return 0;
  list($x, $not, $condname, $condparm) = $match;
  if (!isset($Conditions[$condname])) return 1;
  $tf = (int)@eval("return ({$Conditions[$condname]});");
  return (boolean)($tf xor $not);
}


function PageListTermsTargets(&$list, &$opt, $pn, &$page) {
  global $FmtV;
  static $reindex = array();
  $fold = $GLOBALS['StrFoldFunction'];

  switch ($opt['=phase']) {
    case PAGELIST_PRE:
      $FmtV['$MatchSearched'] = count($list);
      $incl = array(); $excl = array();
      foreach((array)@$opt[''] as $i) { $incl[] = $fold($i); }
      foreach((array)@$opt['+'] as $i) { $incl[] = $fold($i); }
      foreach((array)@$opt['-'] as $i) { $excl[] = $fold($i); }

      $indexterms = PageIndexTerms($incl);
      foreach($incl as $i) {
        $delim = (!preg_match('/[^\\w\\x80-\\xff]/', $i)) ? '$' : '/';
        $opt['=inclp'][] = $delim . preg_quote($i,$delim) . $delim . 'i';
      }
      if ($excl) 
        $opt['=exclp'][] = '$'.implode('|', array_map('preg_quote',$excl)).'$i';

      if (@$opt['link']) {
        $link = MakePageName($pn, $opt['link']);
        $opt['=linkp'] = "/(^|,)$link(,|$)/i";
        $indexterms[] = " $link ";
      }

      if (@$opt['=cached']) return 0;
      if ($indexterms) {
        StopWatch("PageListTermsTargets begin count=".count($list));
        $xlist = PageIndexGrep($indexterms, true);
        $list = array_diff($list, $xlist);
        StopWatch("PageListTermsTargets end count=".count($list));
      }

      if (@$opt['=inclp'] || @$opt['=exclp'] || @$opt['=linkp']) 
        return PAGELIST_ITEM|PAGELIST_POST; 
      return 0;

    case PAGELIST_ITEM:
      if (!$page) { $page = ReadPage($pn, READPAGE_CURRENT); $opt['=readc']++; }
      if (!$page) return 0;
      if (@$opt['=linkp'] && !preg_match($opt['=linkp'], @$page['targets'])) 
        { $reindex[] = $pn; return 0; }
      if (@$opt['=inclp'] || @$opt['=exclp']) {
        $text = $fold($pn."\n".@$page['targets']."\n".@$page['text']);
        foreach((array)@$opt['=exclp'] as $i) 
          if (preg_match($i, $text)) return 0;
        foreach((array)@$opt['=inclp'] as $i) 
          if (!preg_match($i, $text)) { 
            if ($i{0} == '$') $reindex[] = $pn;
            return 0; 
          }
      }
      return 1;

    case PAGELIST_POST:
      if ($reindex) PageIndexQueueUpdate($reindex);
      $reindex = array();
      return 0;
  }
}


function PageListVariables(&$list, &$opt, $pn, &$page) {
  switch ($opt['=phase']) {
    case PAGELIST_PRE:
      $varlist = preg_grep('/^\\$/', array_keys($opt));
      if (!$varlist) return 0;
      foreach($varlist as $v) {
        list($inclp, $exclp) = GlobToPCRE($opt[$v]);
        if ($inclp) $opt['=varinclp'][$v] = "/$inclp/i";
        if ($exclp) $opt['=varexclp'][$v] = "/$exclp/i";
      }
      return PAGELIST_ITEM;

    case PAGELIST_ITEM:
      if (@$opt['=varinclp'])
        foreach($opt['=varinclp'] as $v => $pat) 
          if (!preg_match($pat, PageVar($pn, $v))) return 0;
      if (@$opt['=varexclp'])
        foreach($opt['=varexclp'] as $v => $pat) 
           if (preg_match($pat, PageVar($pn, $v))) return 0;
      return 1;
  }
}


function PageListSort(&$list, &$opt, $pn, &$page) {
  global $PageListSortCmp, $PCache, $PageListSortRead;
  SDVA($PageListSortRead, array('name' => 0, 'group' => 0, 'random' => 0,
    'title' => 0));

  switch ($opt['=phase']) {
    case PAGELIST_PRE:
      $ret = 0;
      foreach(preg_split('/[^-\\w:$]+/', @$opt['order'], -1, PREG_SPLIT_NO_EMPTY) 
              as $o) {
        $ret |= PAGELIST_POST;
        $r = '+';
        if ($o{0} == '-') { $r = '-'; $o = substr($o, 1); }
        $opt['=order'][$o] = $r;
        if ($o{0} != '$' && 
            (!isset($PageListSortRead[$o]) || $PageListSortRead[$o]))
          $ret |= PAGELIST_ITEM;
      }
      StopWatch(@"PageListSort pre ret=$ret order={$opt['order']}");
      return $ret;

    case PAGELIST_ITEM:
      if (!$page) { $page = ReadPage($pn, READPAGE_CURRENT); $opt['=readc']++; }
      return 1;
  }

  ## case PAGELIST_POST
  StopWatch('PageListSort begin');
  $order = $opt['=order'];
  if (@$order['title'])
    foreach($list as $pn) $PCache[$pn]['=title'] = PageVar($pn, '$Title');
  if (@$order['group'])
    foreach($list as $pn) $PCache[$pn]['group'] = PageVar($pn, '$Group');
  if (@$order['random']) 
    { NoCache(); foreach($list as $pn) $PCache[$pn]['random'] = rand(); }
  foreach(preg_grep('/^\\$/', array_keys($order)) as $o) 
    foreach($list as $pn) 
      $PCache[$pn][$o] = PageVar($pn, $o);
  $code = '';
  foreach($opt['=order'] as $o => $r) {
    if (@$PageListSortCmp[$o]) 
      $code .= "\$c = {$PageListSortCmp[$o]}; "; 
    else 
      $code .= "\$c = @strcasecmp(\$PCache[\$x]['$o'],\$PCache[\$y]['$o']); ";
    $code .= "if (\$c) return $r\$c;\n";
  }
  StopWatch('PageListSort sort');
  if ($code) 
    uasort($list,
           create_function('$x,$y', "global \$PCache; $code return 0;"));
  StopWatch('PageListSort end');
}


function PageListCache(&$list, &$opt, $pn, &$page) {
  global $PageListCacheDir, $LastModTime, $PageIndexFile;

  if (@!$PageListCacheDir) return 0;
  if (isset($opt['cache']) && !$opt['cache']) return 0;
 
  $key = $opt['=key'];
  $cache = "$PageListCacheDir/$key,cache"; 
  switch ($opt['=phase']) {
    case PAGELIST_PRE:
      if (!file_exists($cache) || filemtime($cache) <= $LastModTime)
        return PAGELIST_POST;
      StopWatch("PageListCache begin load key=$key");
      list($list, $opt['=protectsafe']) = 
        unserialize(file_get_contents($cache));
      $opt['=cached'] = 1;
      StopWatch("PageListCache end load");
      return 0;

    case PAGELIST_POST:
      StopWatch("PageListCache begin save key=$key");
      $fp = @fopen($cache, "w");
      if ($fp) {
        fputs($fp, serialize(array($list, $opt['=protectsafe'])));
        fclose($fp);
      }
      StopWatch("PageListCache end save");
      return 0;
  }
  return 0;
}


## HandleSearchA performs ?action=search.  It's basically the same
## as ?action=browse, except it takes its contents from Site.Search.
function HandleSearchA($pagename, $level = 'read') {
  global $PageSearchForm, $FmtV, $HandleSearchFmt, 
    $PageStartFmt, $PageEndFmt;
  SDV($HandleSearchFmt,array(&$PageStartFmt, '$PageText', &$PageEndFmt));
  SDV($PageSearchForm, '$[{$SiteGroup}/Search]');
  $form = RetrieveAuthPage($pagename, $level, true, READPAGE_CURRENT);
  if (!$form) Abort("?unable to read $pagename");
  PCache($pagename, $form);
  $text = preg_replace('/\\[([=@])(.*?)\\1\\]/s', ' ', @$form['text']);
  if (!preg_match('/\\(:searchresults(\\s.*?)?:\\)/', $text))
    foreach((array)$PageSearchForm as $formfmt) {
      $form = ReadPage(FmtPageName($formfmt, $pagename), READPAGE_CURRENT);
      if ($form['text']) break;
    }
  $text = @$form['text'];
  if (!$text) $text = '(:searchresults:)';
  $FmtV['$PageText'] = MarkupToHTML($pagename,$text);
  PrintFmt($pagename, $HandleSearchFmt);
}


########################################################################
## The functions below provide different formatting options for
## the output list, controlled by the fmt= parameter and the
## $FPLFormatOpt hash.
########################################################################

## This helper function handles the count= parameter for extracting
## a range of pagelist in the list.
function CalcRange($range, $n) {
  if ($n < 1) return array(0, 0);
  if (strpos($range, '..') === false) {
    if ($range > 0) return array(1, min($range, $n));
    if ($range < 0) return array(max($n + $range + 1, 1), $n);
    return array(1, $n);
  }
  list($r0, $r1) = explode('..', $range);
  if ($r0 < 0) $r0 += $n + 1;
  if ($r1 < 0) $r1 += $n + 1;
  else if ($r1 == 0) $r1 = $n;
  if ($r0 < 1 && $r1 < 1) return array($n+1, $n+1);
  return array(max($r0, 1), max($r1, 1));
}


##  FPLCountA handles fmt=count
function FPLCountA($pagename, &$matches, $opt) {
  $matches = array_values(MakePageList($pagename, $opt, 0));
  return count($matches);
}

SDVA($FPLTemplateFunctions, array(
  'FPLTemplateLoad' => 100,
  'FPLTemplateDefaults' => 200,
  'FPLTemplatePageList' => 300,
  'FPLTemplateSliceList' => 400,
  'FPLTemplateFormat' => 500
  ));

function FPLTemplate($pagename, &$matches, $opt) {
  global $FPLTemplateFunctions;
  StopWatch("FPLTemplate: Chain begin");
  asort($FPLTemplateFunctions, SORT_NUMERIC);
  $fnlist = $FPLTemplateFunctions;
  $output = '';
  foreach($FPLTemplateFunctions as $fn=>$i) {
    if ($i<0) continue;
    StopWatch("FPLTemplate: $fn");
    $fn($pagename, $matches, $opt, $tparts, $output);
  }
  StopWatch("FPLTemplate: Chain end");
  return $output;
}

## Loads a template section
function FPLTemplateLoad($pagename, $matches, $opt, &$tparts){
  global $Cursor, $FPLTemplatePageFmt, $RASPageName, $PageListArgPattern;
  SDV($FPLTemplatePageFmt, array('{$FullName}',
    '{$SiteGroup}.LocalTemplates', '{$SiteGroup}.PageListTemplates'));

  $template = @$opt['template'];
  if (!$template) $template = @$opt['fmt'];
  $ttext = RetrieveAuthSection($pagename, $template, $FPLTemplatePageFmt);
  $ttext = PVSE(Qualify($RASPageName, $ttext));

  ##  save any escapes
  $ttext = MarkupEscape($ttext);
  ##  remove any anchor markups to avoid duplications
  $ttext = preg_replace('/\\[\\[#[A-Za-z][-.:\\w]*\\]\\]/', '', $ttext);

  ##  extract portions of template
  $tparts = preg_split('/\\(:(template)\\s+([-!]?)\\s*(\\w+)\\s*(.*?):\\)/i',
    $ttext, -1, PREG_SPLIT_DELIM_CAPTURE);
}

## Merge parameters from (:template default :) with those in the (:pagelist:)
function FPLTemplateDefaults($pagename, $matches, &$opt, &$tparts){
  global $PageListArgPattern;
  $i = 0;
  while ($i < count($tparts)) {
    if ($tparts[$i] != 'template') { $i++; continue; }
    if ($tparts[$i+2] != 'defaults' && $tparts[$i+2] != 'default') { $i+=5; continue; }
    $pvars = $GLOBALS['MarkupTable']['{$var}']; # expand {$PVars}
    $ttext = preg_replace_callback($pvars['pat'], $pvars['rep'], $tparts[$i+3]);
    $opt = array_merge(ParseArgs($ttext, $PageListArgPattern), $opt);
    array_splice($tparts, $i, 4);
  }
  SDVA($opt, array('class' => 'fpltemplate', 'wrap' => 'div'));
}

##  get the list of pages
function FPLTemplatePageList($pagename, &$matches, &$opt){
  $matches = array_unique(array_merge((array)$matches, MakePageList($pagename, $opt, 0)));
  ## count matches before any slicing and save value as template var {$$PageListCount}
  $opt['PageListCount'] = count($matches);
}

## extract page subset according to 'count=' parameter
function FPLTemplateSliceList($pagename, &$matches, $opt){
  if (@$opt['count']) {
    list($r0, $r1) = CalcRange($opt['count'], count($matches));
    if ($r1 < $r0) 
      $matches = array_reverse(array_slice($matches, $r1-1, $r0-$r1+1));
    else 
      $matches = array_slice($matches, $r0-1, $r1-$r0+1);
  }
}


function FPLTemplateFormat($pagename, $matches, $opt, $tparts, &$output){
  global $Cursor, $FPLTemplateMarkupFunction, $PCache;
  SDV($FPLTemplateMarkupFunction, 'MarkupToHTML');
  $savecursor = $Cursor;
  $pagecount = $groupcount = $grouppagecount = $traildepth = 0;
  $pseudovars = array('{$$PageCount}' => &$pagecount, 
                      '{$$GroupCount}' => &$groupcount, 
                      '{$$GroupPageCount}' => &$grouppagecount,
                      '{$$PageTrailDepth}' => &$traildepth);

  foreach(preg_grep('/^[\\w$]/', array_keys($opt)) as $k) 
    if (!is_array($opt[$k]))
      $pseudovars["{\$\$$k}"] = PHSC($opt[$k], ENT_NOQUOTES);

  $vk = array_keys($pseudovars);
  $vv = array_values($pseudovars);

  $lgroup = ''; $out = '';
  if(count($matches)==0 ) {
    $t = 0;
    while($t < count($tparts)) {
      if($tparts[$t]=='template' && $tparts[$t+2]=='none') {
         $out .= MarkupRestore(FPLExpandItemVars($tparts[$t+4], $matches, 0, $pseudovars));
         $t+=4;
      }
      $t++;
    }
  } # else:
  foreach($matches as $i => $pn) {
    $traildepth = intval(@$PCache[$pn]['depth']);
    $group = PageVar($pn, '$Group');
    if ($group != $lgroup) { $groupcount++; $grouppagecount = 0; $lgroup = $group; }
    $grouppagecount++; $pagecount++;

    $t = 0;
    while ($t < count($tparts)) {
      if ($tparts[$t] != 'template') { $item = $tparts[$t]; $t++; }
      else {
        list($neg, $when, $control, $item) = array_slice($tparts, $t+1, 4); $t+=5;
        if($when=='none') continue;
        if (!$control) {
          if ($when == 'first' && ($neg xor ($i != 0))) continue;
          if ($when == 'last' && ($neg xor ($i != count($matches) - 1))) continue;
        } else {
          if ($when == 'first' || !isset($last[$t])) {
            $curr = FPLExpandItemVars($control, $matches, $i, $pseudovars);
            if ($when == 'first' && ($neg xor (($i != 0) && ($last[$t] == $curr))))
              { $last[$t] = $curr; continue; }
            $last[$t] = $curr;
          }
          if ($when == 'last') {
            $next = FPLExpandItemVars($control, $matches, $i+1, $pseudovars);
            if ($neg xor ($next == $last[$t] && $i != count($matches) - 1)) continue;
            $last[$t] = $next;
          }
        }
      }
      $item = FPLExpandItemVars($item, $matches, $i, $pseudovars);
      $out .= MarkupRestore($item);
    }
  }

  $class = preg_replace('/[^-a-zA-Z0-9\\x80-\\xff]/', ' ', @$opt['class']);
  if ($class) $class = " class='$class'";
  $wrap = @$opt['wrap'];
  if ($wrap != 'inline') {
    $out = $FPLTemplateMarkupFunction($pagename, $out, array('escape' => 0, 'redirect'=>1));
    if ($wrap != 'none') $out = "<div$class>$out</div>";
  }
  $Cursor = $savecursor;
  $output .= $out;
}
## This function moves repeated code blocks out of FPLTemplateFormat()
function FPLExpandItemVars($item, $matches, $idx, $psvars) {
  global $Cursor, $EnableUndefinedTemplateVars;
  $Cursor['<'] = $Cursor['&lt;'] = (string)@$matches[$idx-1];
  $Cursor['='] = $pn = (string)@$matches[$idx];
  $Cursor['>'] = $Cursor['&gt;'] = (string)@$matches[$idx+1];
  $item = str_replace(array_keys($psvars), array_values($psvars), $item);
  $item = PPRE('/\\{(=|&[lg]t;)(\\$:?\\w[-\\w]*)\\}/',
              "PVSE(PageVar('$pn',  \$m[2], \$m[1]))", $item);
  if(! IsEnabled($EnableUndefinedTemplateVars, 0))
    $item = preg_replace("/\\{\\$\\$\\w+\\}/", '', $item);
  return $item;
}

########################################################################
## The functions below optimize searches by maintaining a file of
## words and link cross references (the "page index").
########################################################################

## PageIndexTerms($terms) takes an array of strings and returns a
## normalized list of associated search terms.  This reduces the
## size of the index and speeds up searches.
function PageIndexTerms($terms) {
  global $StrFoldFunction;
  $w = array();
  foreach((array)$terms as $t) {
    $w = array_merge($w, preg_split('/[^\\w\\x80-\\xff]+/', 
           $StrFoldFunction($t), -1, PREG_SPLIT_NO_EMPTY));
  }
 return $w;
}

## The PageIndexUpdate($pagelist) function updates the page index
## file with terms and target links for the pages in $pagelist.
## The optional $dir parameter allows this function to be called
## via register_shutdown_function (which sometimes changes directories
## on us).
function PageIndexUpdate($pagelist = NULL, $dir = '') {
  global $EnableReadOnly, $PageIndexUpdateList, $PageIndexFile, 
    $PageIndexTime, $Now;
  if (IsEnabled($EnableReadOnly, 0)) return;
  $abort = ignore_user_abort(true);
  if ($dir) { flush(); chdir($dir); }
  if (is_null($pagelist)) 
    { $pagelist = (array)$PageIndexUpdateList; $PageIndexUpdateList = array(); }
  if (!$pagelist || !$PageIndexFile) return;
  SDV($PageIndexTime, 10);
  $c = count($pagelist); $updatecount = 0;
  StopWatch("PageIndexUpdate begin ($c pages to update)");
  $pagelist = (array)$pagelist;
  $timeout = time() + $PageIndexTime;
  $cmpfn = create_function('$a,$b', 'return strlen($b)-strlen($a);');
  Lock(2);
  $ofp = fopen("$PageIndexFile,new", 'w');
  foreach($pagelist as $pn) {
    if (@$updated[$pn]) continue;
    @$updated[$pn]++;
    if (time() > $timeout) continue;
    $page = ReadPage($pn, READPAGE_CURRENT);
    if ($page) {
      $targets = str_replace(',', ' ', @$page['targets']);
      $terms = PageIndexTerms(array(@$page['text'], $targets, $pn));
      usort($terms, $cmpfn);
      $x = '';
      foreach($terms as $t) { if (strpos($x, $t) === false) $x .= " $t"; }
      fputs($ofp, "$pn:$Now: $targets :$x\n");
    }
    $updatecount++;
  }
  $ifp = @fopen($PageIndexFile, 'r');
  if ($ifp) {
    while (!feof($ifp)) {
      $line = fgets($ifp, 4096);
      while (substr($line, -1, 1) != "\n" && !feof($ifp)) 
        $line .= fgets($ifp, 4096);
      $i = strpos($line, ':');
      if ($i === false) continue;
      $n = substr($line, 0, $i);
      if (@$updated[$n]) continue;
      fputs($ofp, $line);
    }
    fclose($ifp);
  }
  fclose($ofp);
  if (file_exists($PageIndexFile)) unlink($PageIndexFile); 
  rename("$PageIndexFile,new", $PageIndexFile);
  fixperms($PageIndexFile);
  StopWatch("PageIndexUpdate end ($updatecount updated)");
  ignore_user_abort($abort);
}

## PageIndexQueueUpdate specifies pages to be updated in
## the index upon shutdown (via register_shutdown function).
function PageIndexQueueUpdate($pagelist) {
  global $PageIndexUpdateList;
  if (!@$PageIndexUpdateList) 
    register_shutdown_function('PageIndexUpdate', NULL, getcwd());
  $PageIndexUpdateList = array_merge((array)@$PageIndexUpdateList,
                                     (array)$pagelist);
  $c1 = count($pagelist); $c2 = count($PageIndexUpdateList);
  StopWatch("PageIndexQueueUpdate: queued $c1 pages ($c2 total)");
}

## PageIndexGrep returns a list of pages that match the strings
## provided.  Note that some search terms may need to be normalized
## in order to get the desired results (see PageIndexTerms above).
## Also note that this just works for the index; if the index is
## incomplete, then so are the results returned by this list.
## (MakePageList above already knows how to deal with this.)
function PageIndexGrep($terms, $invert = false) {
  global $PageIndexFile;
  if (!$PageIndexFile) return array();
  StopWatch('PageIndexGrep begin');
  $pagelist = array();
  $fp = @fopen($PageIndexFile, 'r');
  if ($fp) {
    $terms = (array)$terms;
    while (!feof($fp)) {
      $line = fgets($fp, 4096);
      while (substr($line, -1, 1) != "\n" && !feof($fp))
        $line .= fgets($fp, 4096);
      $i = strpos($line, ':');
      if (!$i) continue;
      $add = true;
      foreach($terms as $t) 
        if (strpos($line, $t) === false) { $add = false; break; }
      if ($add xor $invert) $pagelist[] = substr($line, 0, $i);
    }
    fclose($fp);
  }
  StopWatch('PageIndexGrep end');
  return $pagelist;
}
  
## PostPageIndex is inserted into $EditFunctions to update
## the linkindex whenever a page is saved.
function PostPageIndex($pagename, &$page, &$new) {
  global $IsPagePosted;
  if ($IsPagePosted) PageIndexQueueUpdate($pagename);
}
