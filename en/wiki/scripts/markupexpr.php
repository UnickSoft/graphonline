<?php if (!defined('PmWiki')) exit();
/*  Copyright 2007-2014 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This script implements "markup expressions" --  a method to
    do simple computations and manipulations from markup.  The
    generic form of a markup expression is "{(func arg1 arg2)}",
    where the named function (held in the $MarkupExpr array)
    is called with arg1 and arg2 as arguments.

    Markup expressions can be nested.  For example, to strip
    off the first five characters and convert the remainder to
    lowercase, an author can write:

        {(tolower (substr "HELLOWORLD" 5))}    # produces "world"

    Some "built-in" expressions defined by this recipe include:
        substr   - extract a portion of a string
        ftime    - date/time formatting
        strlen   - length of a string
        rand     - generate a random number
        pagename - build a pagename from a string
        toupper  - convert string to uppercase
        tolower  - convert string to lowercase
        ucfirst  - convert first character to uppercase
        ucwords  - convert first character of each word to uppercase
        asspaced - spaceformatting of wikiwords

    Custom expressions may be added by other recipes by adding
    entries into the $MarkupExpr array.  Each entry's key is
    the name of the function, the value is the code to be evaluated
    for that function (similar to the way $FmtPV works).  By default,
    any arguments for the expression are placed into the $args array:

        ##  expressions like {(myfunc foo bar)}
        $MarkupExpr['myfunc'] = 'myfunc($args[0], $args[1])';

    The expression arguments are parsed using ParseArgs(), and the
    result of this parsing is available through the $argp array:

        ##  expressions like {(myfunc fmt=foo output=bar)}
        $MarkupExpr['myfunc'] = 'myfunc($argp["fmt"], $argp["output"])';
   
    Finally, if the code in $MarkupExpr contains '$params', then
    it is executed directly without any preprocessing into arguments,
    and $params contains the entire argument string.  Note that $params
    may contain escaped values representing quoted arguments and
    results of other expressions; these values may be un-escaped
    by using "preg_replace($rpat, $rrep, $params)".
*/
Markup_e('{(', '>{$var}',
  '/\\{(\\(\\w+\\b.*?\\))\\}/',
  "MarkupExpression(\$pagename, \$m[1])");

SDVA($MarkupExpr, array(
  'substr'   => 'call_user_func_array("substr", $args)',
  'strlen'   => 'strlen($args[0])',
  'ftime'    => 'ME_ftime(@$args[0], @$args[1], $argp)',
  'rand'     => '($args) ? rand($args[0], $args[1]) : rand()',
  'ucfirst'  => 'ucfirst($args[0])',
  'ucwords'  => 'ucwords($args[0])',
  'tolower'  => 'strtolower($args[0])',
  'toupper'  => 'strtoupper($args[0])',
  'mod'      => '0 + ($args[0] % $args[1])',
  'asspaced' => '$GLOBALS["AsSpacedFunction"]($args[0])',
  'pagename' => 'MakePageName($pagename, PPRE($rpat, $rrep, $params))',
));

function MarkupExpression($pagename, $expr) {
  global $KeepToken, $KPV, $MarkupExpr;
  $rpat = "/$KeepToken(\\d+P)$KeepToken/";
  $rrep = '$GLOBALS["KPV"][$m[1]]';
  $expr = PPRE('/([\'"])(.*?)\\1/', "Keep(\$m[2],'P')", $expr);
  $expr = PPRE('/\\(\\W/', "Keep(\$m[0],'P')", $expr);
  while (preg_match('/\\((\\w+)(\\s[^()]*)?\\)/', $expr, $match)) {
    list($repl, $func, $params) = $match;
    $code = @$MarkupExpr[$func];
    ##  if not a valid function, save this string as-is and exit
    if (!$code) break;
    ##  if the code uses '$params', we just evaluate directly
    if (strpos($code, '$params') !== false) {
      $out = eval("return ({$code});");
      if ($expr == $repl) { $expr = $out; break; }
      $expr = str_replace($repl, $out, $expr);
      continue;
    }
    ##  otherwise, we parse arguments into $args before evaluating
    $argp = ParseArgs($params);
    $x = $argp['#']; $args = array();
    while ($x) {
      list($k, $v) = array_splice($x, 0, 2);
      if ($k == '' || $k == '+' || $k == '-') 
        $args[] = $k.PPRE($rpat, $rrep, $v);
    }
    ##  fix any quoted arguments
    foreach ($argp as $k => $v)
      if (!is_array($v)) $argp[$k] = PPRE($rpat, $rrep, $v);
    $out = eval("return ({$code});");
    if ($expr == $repl) { $expr = $out; break; }
    $expr = str_replace($repl, Keep($out, 'P'), $expr);
  }
  return PPRE($rpat, $rrep, $expr);
}

##   ME_ftime handles {(ftime ...)} expressions.
##
function ME_ftime($arg0 = '', $arg1 = '', $argp = NULL) {
  global $TimeFmt, $Now, $FTimeFmt;
  if (@$argp['fmt']) $fmt = $argp['fmt']; 
  else if (strpos($arg0, '%') !== false) { $fmt = $arg0; $arg0 = $arg1; }
  else if (strpos($arg1, '%') !== false) $fmt = $arg1;
  ## determine the timestamp
  if (isset($argp['when'])) list($time, $x) = DRange($argp['when']);
  else if ($arg0 > '') list($time, $x) = DRange($arg0);
  else $time = $Now;
  if (@$fmt == '') { SDV($FTimeFmt, $TimeFmt); $fmt = $FTimeFmt; }
  ##  make sure we have %F available for ISO dates
  $fmt = str_replace(array('%F', '%s'), array('%Y-%m-%d', $time), $fmt);
  return strftime($fmt, $time);
}

