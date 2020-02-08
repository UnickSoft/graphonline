<?php if (!defined('PmWiki')) exit();
/*  Copyright 2004-2015 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This script defines PmWiki's standard markup.  It is automatically
    included from stdconfig.php unless $EnableStdMarkup==0.

    Each call to Markup() below adds a new rule to PmWiki's translation
    engine (unless a rule with the same name has already been defined).  
    The form of the call is Markup($id,$where,$pat,$rep); 
    $id is a unique name for the rule, $where is the position of the rule
    relative to another rule, $pat is the pattern to look for, and
    $rep is the string to replace it with.
*/

## first we preserve text in [=...=] and [@...@]
function PreserveText($sigil, $text, $lead) {
  if ($sigil=='=') return $lead.Keep($text);
  if (strpos($text, "\n")===false) 
    return "$lead<code class='escaped'>".Keep($text)."</code>";
  $text = preg_replace("/\n[^\\S\n]+$/", "\n", $text);
  if ($lead == "" || $lead == "\n") 
    return "$lead<pre class='escaped'>".Keep($text)."</pre>";
  return "$lead<:pre,1>".Keep($text);
}

Markup_e('[=','_begin',"/(\n[^\\S\n]*)?\\[([=@])(.*?)\\2\\]/s",
    "PreserveText(\$m[2], \$m[3], \$m[1])");
Markup_e('restore','<_end',"/$KeepToken(\\d.*?)$KeepToken/",
    '$GLOBALS[\'KPV\'][$m[1]]');
Markup('<:', '>restore',
  '/<:[^>]*>/', '');
Markup('<vspace>', '<restore', 
  '/<vspace>/', 
  "<div class='vspace'></div>");
Markup('<vspace><p>', '<<vspace>',
  "/<vspace><p\\b(([^>]*)(\\s)class=(['\"])([^>]*?)\\4)?/",
  "<p$2 class='vspace$3$5'");

## remove carriage returns before preserving text
Markup('\\r','<[=','/\\r/','');

# $[phrase] substitutions
Markup_e('$[phrase]', '>[=',
  '/\\$\\[(?>([^\\]]+))\\]/', "NoCache(XL(\$m[1]))");

# {$var} substitutions
Markup_e('{$var}', '>$[phrase]',
  '/\\{(\\*|!?[-\\w.\\/\\x80-\\xff]*)(\\$:?\\w[-\\w]*)\\}/',
  "PRR(PVSE(PageVar(\$pagename, \$m[2], \$m[1])))");

# invisible (:textvar:...:) definition
Markup('textvar:', '<split',
  '/\\(: *\\w[-\\w]* *:(?!\\)).*?:\\)/s', '');

## handle relative text vars in includes
if (IsEnabled($EnableRelativePageVars, 1)) 
  SDV($QualifyPatterns["/\\{([-\\w\\x80-\\xfe]*)(\\$:?\\w+\\})/"],
    PCCF("'{' . (\$m[1] ? MakePageName(\$pagename, \$m[1]) : \$pagename) . \$m[2]", 'qualify'));


## character entities
Markup('&','<if','/&amp;(?>([A-Za-z0-9]+|#\\d+|#[xX][A-Fa-f0-9]+));/',
  '&$1;');
Markup('&amp;amp;', '<&', '/&amp;amp;/', Keep('&amp;'));


## (:if:)/(:elseif:)/(:else:)
SDV($CondTextPattern, 
  "/ \\(:if (\d*) (?:end)? \\b[^\n]*?:\\)
     .*?
     (?: \\(: (?:if\\1|if\\1end) \\s* :\\)
     |   (?=\\(:(?:if\\1|if\\1end)\\b[^\n]*?:\\) | $)
     )
   /six");
SDV($CondTextReplacement, "CondText2(\$pagename, \$m[0], \$m[1])");
Markup_e('if', 'fulltext', $CondTextPattern, $CondTextReplacement);

function CondText2($pagename, $text, $code = '') {
  global $Conditions, $CondTextPattern, $CondTextReplacement;
  $if = "if$code";
  $repl = str_replace('$pagename', "'$pagename'", $CondTextReplacement);
  
  $parts = preg_split("/\\(:(?:{$if}end|$if|else *$if|else$code)\\b\\s*(.*?)\\s*:\\)/", 
                      $text, -1, PREG_SPLIT_DELIM_CAPTURE);
  $x = array_shift($parts);
  while ($parts) {
    list($condspec, $condtext) = array_splice($parts, 0, 2);
    if (!preg_match("/^\\s*(!?)\\s*(\\S*)\\s*(.*?)\\s*$/", $condspec, $match)) continue;
    list($x, $not, $condname, $condparm) = $match;

    if (!isset($Conditions[$condname])) 
      return PPRE($CondTextPattern, $repl, $condtext);
    $tf = @eval("return ({$Conditions[$condname]});");
    if ($tf xor $not)
      return PPRE($CondTextPattern, $repl, $condtext);
  }
  return '';
}


## (:include:)
Markup_e('include', '>if',
  '/\\(:include\\s+(\\S.*?):\\)/i',
  "PRR(IncludeText(\$pagename, \$m[1]))");

## (:redirect:)
Markup_e('redirect', '<include',
  '/\\(:redirect\\s+(\\S.*?):\\)/i',
  "RedirectMarkup(\$pagename, \$m[1])");

$SaveAttrPatterns['/\\(:(if\\d*|include|redirect)(\\s.*?)?:\\)/i'] = ' ';

## GroupHeader/GroupFooter handling
Markup_e('nogroupheader', '>include',
  '/\\(:nogroupheader:\\)/i',
  "PZZ(\$GLOBALS['GroupHeaderFmt']='')");
Markup_e('nogroupfooter', '>include',
  '/\\(:nogroupfooter:\\)/i',
  "PZZ(\$GLOBALS['GroupFooterFmt']='')");
Markup_e('groupheader', '>nogroupheader',
  '/\\(:groupheader:\\)/i',
  "PRR(FmtPageName(\$GLOBALS['GroupHeaderFmt'],\$pagename))");
Markup_e('groupfooter','>nogroupfooter',
  '/\\(:groupfooter:\\)/i',
  "PRR(FmtPageName(\$GLOBALS['GroupFooterFmt'],\$pagename))");

## (:nl:)
Markup('nl0','<split',"/([^\n])(?>(?:\\(:nl:\\))+)([^\n])/i","$1\n$2");
Markup('nl1','>nl0',"/\\(:nl:\\)/i",'');

## \\$  (end of line joins)
Markup_e('\\$','>nl1',"/\\\\(?>(\\\\*))\n/",
  "str_repeat('<br />',strlen(\$m[1]))");

## Remove one <:vspace> after !headings
Markup('!vspace', '>\\$', "/^(!(?>[^\n]+)\n)<:vspace>/m", '$1');

## (:noheader:),(:nofooter:),(:notitle:)...
Markup_e('noheader', 'directives',
  '/\\(:noheader:\\)/i',
  "SetTmplDisplay('PageHeaderFmt',0)");
Markup_e('nofooter', 'directives',
  '/\\(:nofooter:\\)/i',
  "SetTmplDisplay('PageFooterFmt',0)");
Markup_e('notitle', 'directives',
  '/\\(:notitle:\\)/i',
  "SetTmplDisplay('PageTitleFmt',0)");
Markup_e('noleft', 'directives',
  '/\\(:noleft:\\)/i',
  "SetTmplDisplay('PageLeftFmt',0)");
Markup_e('noright', 'directives',
  '/\\(:noright:\\)/i',
  "SetTmplDisplay('PageRightFmt',0)");
Markup_e('noaction', 'directives',
  '/\\(:noaction:\\)/i',
  "SetTmplDisplay('PageActionFmt',0)");

## (:spacewikiwords:)
Markup_e('spacewikiwords', 'directives',
  '/\\(:(no)?spacewikiwords:\\)/i',
  "PZZ(\$GLOBALS['SpaceWikiWords']=(\$m[1]!='no'))");

## (:linkwikiwords:)
Markup_e('linkwikiwords', 'directives',
  '/\\(:(no)?linkwikiwords:\\)/i',
  "PZZ(\$GLOBALS['LinkWikiWords']=(\$m[1]!='no'))");

## (:linebreaks:)
Markup_e('linebreaks', 'directives',
  '/\\(:(no)?linebreaks:\\)/i',
  "PZZ(\$GLOBALS['HTMLPNewline'] = (\$m[1]!='no') ? '<br  />' : '')");

## (:messages:)
Markup_e('messages', 'directives',
  '/^\\(:messages:\\)/i',
  "'<:block>'.Keep(
    FmtPageName(implode('',(array)\$GLOBALS['MessagesFmt']), \$pagename))");

## (:comment:)
Markup('comment', 'directives', '/\\(:comment .*?:\\)/i', '');

## (:title:) +fix for PITS:00266, 00779
$tmpwhen = IsEnabled($EnablePageTitlePriority, 0) ? '<include' : 'directives';
$tmpkeep = IsEnabled($EnablePageTitlePriority, 0) ? '1' : 'NULL';
Markup_e('title', $tmpwhen,
  '/\\(:title\\s(.*?):\\)/i',
  "PZZ(PCache(\$pagename, 
    \$zz=array('title' => SetProperty(\$pagename, 'title', \$m[1], NULL, $tmpkeep))))");
unset($tmpwhen, $tmpkeep);

## (:keywords:), (:description:)
Markup_e('keywords', 'directives',
  "/\\(:keywords?\\s+(.+?):\\)/i",
  "PZZ(SetProperty(\$pagename, 'keywords', \$m[1], ', '))");
Markup_e('description', 'directives',
  "/\\(:description\\s+(.+?):\\)/i",
  "PZZ(SetProperty(\$pagename, 'description', \$m[1], '\n'))");
$HTMLHeaderFmt['meta'] = 'function:PrintMetaTags';
function PrintMetaTags($pagename, $args) {
  global $PCache;
  foreach(array('keywords', 'description') as $n) {
    foreach((array)@$PCache[$pagename]["=p_$n"] as $v) {
      $v = str_replace("'", '&#039;', $v);
      print "<meta name='$n' content='$v' />\n";
    }
  }
}

#### inline markups ####
## ''emphasis''
Markup("''",'inline',"/''(.*?)''/",'<em>$1</em>');

## '''strong'''
Markup("'''","<''","/'''(.*?)'''/",'<strong>$1</strong>');

## '''''strong emphasis'''''
Markup("'''''","<'''","/'''''(.*?)'''''/",'<strong><em>$1</em></strong>');

## @@code@@
Markup('@@','inline','/@@(.*?)@@/','<code>$1</code>');

## '+big+', '-small-'
Markup("'+","<'''''","/'\\+(.*?)\\+'/",'<big>$1</big>');
Markup("'-","<'''''","/'\\-(.*?)\\-'/",'<small>$1</small>');

## '^superscript^', '_subscript_'
Markup("'^","<'''''","/'\\^(.*?)\\^'/",'<sup>$1</sup>');
Markup("'_","<'''''","/'_(.*?)_'/",'<sub>$1</sub>');

## [+big+], [-small-]
Markup_e('[+','inline','/\\[(([-+])+)(.*?)\\1\\]/',
  "'<span style=\'font-size:'.(round(pow(6/5,(\$m[2]=='-'? -1:1)*strlen(\$m[1]))*100,0)).'%\'>'.
    \$m[3].'</span>'");

## {+ins+}, {-del-}
Markup('{+','inline','/\\{\\+(.*?)\\+\\}/','<ins>$1</ins>');
Markup('{-','inline','/\\{-(.*?)-\\}/','<del>$1</del>');

## [[<<]] (break)
Markup('[[<<]]','inline','/\\[\\[&lt;&lt;\\]\\]/',"<br clear='all' />");

###### Links ######
## [[free links]]
Markup_e('[[','links',"/(?>\\[\\[\\s*(.*?)\\]\\])($SuffixPattern)/",
  "Keep(MakeLink(\$pagename,\$m[1],NULL,\$m[2]),'L')");

## [[!Category]]
SDV($CategoryGroup,'Category');
SDV($LinkCategoryFmt,"<a class='categorylink' href='\$LinkUrl'>\$LinkText</a>");
Markup_e('[[!','<[[','/\\[\\[!(.*?)\\]\\]/',
  "Keep(MakeLink(\$pagename,'$CategoryGroup/'.\$m[1],NULL,'',\$GLOBALS['LinkCategoryFmt']),'L')");
# This is a temporary workaround for blank category pages.
# It may be removed in a future release (Pm, 2006-01-24)
if (preg_match("/^$CategoryGroup\\./", $pagename)) {
  SDV($DefaultPageTextFmt, '');
  SDV($PageNotFoundHeaderFmt, 'HTTP/1.1 200 Ok');
}

## [[target | text]]
Markup_e('[[|','<[[',
  "/(?>\\[\\[([^|\\]]*)\\|\\s*)(.*?)\\s*\\]\\]($SuffixPattern)/",
  "Keep(MakeLink(\$pagename,\$m[1],\$m[2],\$m[3]),'L')");

## [[text -> target ]]
Markup_e('[[->','>[[|',
  "/(?>\\[\\[([^\\]]+?)\\s*-+&gt;\\s*)(.*?)\\]\\]($SuffixPattern)/",
  "Keep(MakeLink(\$pagename,\$m[2],\$m[1],\$m[3]),'L')");

if (IsEnabled($EnableRelativePageLinks, 1))
  SDV($QualifyPatterns['/(\\[\\[(?>[^\\]]+?->)?\\s*)([-\\w\\x80-\\xfe\\s\'()]+([|#?].*?)?\\]\\])/'],
    PCCF("\$m[1].\$group.'/'.\$m[2]", 'qualify'));

## [[#anchor]]
Markup_e('[[#','<[[','/(?>\\[\\[#([A-Za-z][-.:\\w]*))\\]\\]/',
  "Keep(TrackAnchors(\$m[1]) ? '' : \"<a name='{\$m[1]}' id='{\$m[1]}'></a>\", 'L')");
function TrackAnchors($x) { global $SeenAnchor; return @$SeenAnchor[$x]++; }

## [[target |#]] reference links
Markup_e('[[|#', '<[[|',
  "/(?>\\[\\[([^|\\]]+))\\|\\s*#\\s*\\]\\]/",
  "Keep(MakeLink(\$pagename,\$m[1],'['.++\$GLOBALS['MarkupFrame'][0]['ref'].']'),'L')");

## [[target |+]] title links moved inside LinkPage()

## bare urllinks 
Markup_e('urllink','>[[',
  "/\\b(?>(\\L))[^\\s$UrlExcludeChars]*[^\\s.,?!$UrlExcludeChars]/",
  "Keep(MakeLink(\$pagename,\$m[0],\$m[0]),'L')");

## mailto: links 
Markup_e('mailto','<urllink',
  "/\\bmailto:([^\\s$UrlExcludeChars]*[^\\s.,?!$UrlExcludeChars])/",
  "Keep(MakeLink(\$pagename,\$m[0],\$m[1]),'L')");

## inline images
Markup_e('img','<urllink',
  "/\\b(?>(\\L))([^\\s$UrlExcludeChars]+$ImgExtPattern)(\"([^\"]*)\")?/",
  "Keep(\$GLOBALS['LinkFunctions'][\$m[1]](\$pagename,\$m[1],\$m[2],\$m[4],\$m[1].\$m[2],
    \$GLOBALS['ImgTagFmt']),'L')");

## bare wikilinks
##    v2.2: markup rule moved to scripts/wikiwords.php)
Markup('wikilink', '>urllink');

## escaped `WikiWords 
##    v2.2: rule kept here for markup compatibility with 2.1 and earlier
Markup_e('`wikiword', '<wikilink',
  "/`(($GroupPattern([\\/.]))?($WikiWordPattern))/",
  "Keep(\$m[1])");

#### Block markups ####
## Completely blank lines don't do anything.
Markup('blank', '<block', '/^\\s+$/', '');

## process any <:...> markup (after all other block markups)
Markup_e('^<:','>block','/^(?=\\s*\\S)(<:([^>]+)>)?/',"Block(\$m[2])");

## unblocked lines w/block markup become anonymous <:block>
Markup('^!<:', '<^<:',
  "/^(?!<:)(?=.*(<\\/?($BlockPattern)\\b)|$KeepToken\\d+B$KeepToken)/",
  '<:block>');

## Lines that begin with displayed images receive their own block.  A
## pipe following the image indicates a "caption" (generates a linebreak).
Markup_e('^img', 'block',
  "/^((?>(\\s+|%%|%[A-Za-z][-,=:#\\w\\s'\".]*%)*)$KeepToken(\\d+L)$KeepToken)(\\s*\\|\\s?)?(.*)$/",
  "(strpos(\$GLOBALS['KPV'][\$m[3]],'<img')===false) ? \$m[0] :
       '<:block,1><div>'.\$m[1] . (\$m[4] ? '<br />' : '') .\$m[5].'</div>'");


## Whitespace at the beginning of lines can be used to maintain the
## indent level of a previous list item, or a preformatted text block.
Markup_e('^ws', '<^img', '/^\\s+ #1/x', "WSIndent(\$m[0])");
function WSIndent($i) {
  global $MarkupFrame;
  $icol = strlen($i);
  for($depth = count(@$MarkupFrame[0]['cs']); $depth > 0; $depth--)
    if (@$MarkupFrame[0]['is'][$depth] == $icol) {
      $MarkupFrame[0]['idep'] = $depth;
      $MarkupFrame[0]['icol'] = $icol;
      return '';
    }
  return $i;
}

## The $EnableWSPre setting uses leading spaces on markup lines to indicate
## blocks of preformatted text.
SDV($EnableWSPre, 1);
Markup_e('^ ', 'block',
  '/^\\s+ #2/x',
  "(\$GLOBALS['EnableWSPre'] > 0 && strlen(\$m[0]) >= \$GLOBALS['EnableWSPre'])
     ? '<:pre,1>'.\$m[0] : \$m[0]");

## bullet lists
Markup('^*','block','/^(\\*+)\\s?(\\s*)/','<:ul,$1,$0>$2');

## numbered lists
Markup('^#','block','/^(#+)\\s?(\\s*)/','<:ol,$1,$0>$2');

## indented (->) /hanging indent (-<) text
Markup('^->','block','/^(?>(-+))&gt;\\s?(\\s*)/','<:indent,$1,$1  $2>$2');
Markup('^-<','block','/^(?>(-+))&lt;\\s?(\\s*)/','<:outdent,$1,$1  $2>$2');

## definition lists
Markup('^::','block','/^(:+)(\s*)([^:]+):/','<:dl,$1,$1$2><dt>$2$3</dt><dd>');

## Q: and A:
Markup('^Q:', 'block', '/^Q:(.*)$/', "<:block,1><p class='question'>$1</p>");
Markup('^A:', 'block', '/^A:/', Keep(''));

## tables
## ||cell||, ||!header cell||, ||!caption!||
Markup_e('^||||', 'block',
  '/^\\|\\|.*\\|\\|.*$/',
  "FormatTableRow(\$m[0])");
## ||table attributes
Markup_e('^||','>^||||','/^\\|\\|(.*)$/',
  "PZZ(\$GLOBALS['BlockMarkups']['table'][0] = '<table '.PQA(\$m[1]).'>')
    .'<:block,1>'");

## headings
Markup_e('^!', 'block',
  '/^(!{1,6})\\s?(.*)$/',
  "'<:block,1><h'.strlen(\$m[1]).'>'.\$m[2].'</h'.strlen(\$m[1]).'>'");

## horiz rule
Markup('^----','>^->','/^----+/','<:block,1><hr />');

#### (:table:) markup (AdvancedTables)
function Cells($name,$attr) {
  global $MarkupFrame, $EnableTableAutoValignTop;
  $attr = PQA($attr);
  $tattr = @$MarkupFrame[0]['tattr'];
  $name = strtolower($name);
  $key = preg_replace('/end$/', '', $name);
  if (preg_match("/^(?:head|cell)(nr)?$/", $name)) $key = 'cell';
  $out = '<:block>'.MarkupClose($key);
  if (substr($name, -3) == 'end') return $out;
  $cf = & $MarkupFrame[0]['closeall'];
  if ($name == 'table') $MarkupFrame[0]['tattr'] = $attr; 
  else if ($key == 'cell') {
    if (IsEnabled($EnableTableAutoValignTop, 1) && strpos($attr, "valign=")===false)
      $attr .= " valign='top'";
    $t = (strpos($name, 'head')===0 ) ? 'th' : 'td';
    if (!@$cf['table']) {
       $tattr = @$MarkupFrame[0]['tattr'];
       $out .= "<table $tattr><tr><$t $attr>";
       $cf['table'] = '</tr></table>';
    } else if ( preg_match("/nr$/", $name)) $out .= "</tr><tr><$t $attr>";
    else $out .= "<$t $attr>";
    $cf['cell'] = "</$t>";
  } else {
    $tag = preg_replace('/\\d+$/', '', $key);
    $out .= "<$tag $attr>";
    $cf[$key] = "</$tag>";
  }
  return $out;
}

Markup_e('table', '<block',
  '/^\\(:(table|cell|cellnr|head|headnr|tableend|(?:div\\d*|section\\d*|article\\d*|header|footer|nav|address|aside)(?:end)?)(\\s.*?)?:\\)/i',
  "Cells(\$m[1],\$m[2])");
Markup('^>>', '<table',
  '/^&gt;&gt;(.+?)&lt;&lt;(.*)$/',
  '(:div:)%div $1 apply=div%$2 ');
Markup('^>><<', '<^>>',
  '/^&gt;&gt;&lt;&lt;/',
  '(:divend:)');

#### special stuff ####
## (:markup:) for displaying markup examples
function MarkupMarkup($pagename, $text, $opt = '') {
  global $MarkupWordwrapFunction, $MarkupWrapTag;
  SDV($MarkupWordwrapFunction, 
    PCCF('return str_replace("  ", " &nbsp;", nl2br($m));'));
  SDV($MarkupWrapTag, 'code');
  $MarkupMarkupOpt = array('class' => 'vert');
  $opt = array_merge($MarkupMarkupOpt, ParseArgs($opt));
  $html = MarkupToHTML($pagename, $text, array('escape' => 0));
  if (@$opt['caption']) 
    $caption = str_replace("'", '&#039;', 
                           "<caption>{$opt['caption']}</caption>");
  $class = preg_replace('/[^-\\s\\w]+/', ' ', @$opt['class']);
  if (strpos($class, 'horiz') !== false) 
    { $sep = ''; $pretext = $MarkupWordwrapFunction($text, 40); } 
  else 
    { $sep = '</tr><tr>'; $pretext = $MarkupWordwrapFunction($text, 75); }
  return Keep(@"<table class='markup $class' align='center'>$caption
      <tr><td class='markup1' valign='top'><$MarkupWrapTag>$pretext</$MarkupWrapTag></td>$sep<td 
        class='markup2' valign='top'>$html</td></tr></table>");
}

Markup_e('markup', '<[=',
  "/\\(:markup(\\s+([^\n]*?))?:\\)[^\\S\n]*\\[([=@])(.*?)\\3\\]/si",
  "MarkupMarkup(\$pagename, \$m[4], \$m[2])");
Markup_e('markupend', '>markup',
  "/\\(:markup(\\s+([^\n]*?))?:\\)[^\\S\n]*\n(.*?)\\(:markupend:\\)/si",
  "MarkupMarkup(\$pagename, \$m[3], \$m[1])");

SDV($HTMLStylesFmt['markup'], "
  table.markup { border:2px dotted #ccf; width:90%; }
  td.markup1, td.markup2 { padding-left:10px; padding-right:10px; }
  table.vert td.markup1 { border-bottom:1px solid #ccf; }
  table.horiz td.markup1 { width:23em; border-right:1px solid #ccf; }
  table.markup caption { text-align:left; }
  div.faq p, div.faq pre { margin-left:2em; }
  div.faq p.question { margin:1em 0 0.75em 0; font-weight:bold; }
  div.faqtoc div.faq * { display:none; }
  div.faqtoc div.faq p.question 
    { display:block; font-weight:normal; margin:0.5em 0 0.5em 20px; line-height:normal; }
  div.faqtoc div.faq p.question * { display:inline; }
  ");

#### Special conditions ####
## The code below adds (:if date:) conditions to the markup.
$Conditions['date'] = "CondDate(\$condparm)";

function CondDate($condparm) {
  global $Now;
  if (!preg_match('/^(\\S*?)(\\.\\.(\\S*))?(\\s+\\S.*)?$/',
                  trim($condparm), $match))
    return false;
  if ($match[4] == '') { $x0 = $Now; NoCache(); }
  else { list($x0, $x1) = DRange($match[4]); }
  if ($match[1] > '') {
    list($t0, $t1) = DRange($match[1]);
    if ($x0 < $t0) return false;
    if ($match[2] == '' && $x0 >= $t1) return false;
  }
  if ($match[3] > '') {
    list($t0, $t1) = DRange($match[3]);
    if ($x0 >= $t1) return false;
  }
  return true;
}

# This pattern enables the (:encrypt <phrase>:) markup/replace-on-save
# pattern.
SDV($ROSPatterns['/\\(:encrypt\\s+([^\\s:=]+).*?:\\)/'], PCCF("return pmcrypt(\$m[1]);"));

