<?php if (!defined('PmWiki')) exit();
/*  Copyright 2004-2011 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This file is used to enable the iso-8859-2 character set in PmWiki.
    The first part converts the charset to iso-8859-2 and removes
    conflicts for newline and keep tokens; the second part
    handles the conversion of pagenames from utf-8 (sent by browsers)
    into iso-8859-2 if needed.  
*/
  global $HTTPHeaders, $pagename, $KeepToken, $Charset, $DefaultPageCharset;

  $HTTPHeaders[] = "Content-Type: text/html; charset=iso-8859-2;";
  $Charset = "ISO-8859-2";
  SDVA($DefaultPageCharset, array('ISO-8859-1'=>$Charset));

  $KeepToken = "\263\263\263";

  $pagename = $_REQUEST['n'];
  if (!$pagename) $pagename = @$_GET['pagename'];
  if ($pagename=='' && $EnablePathInfo)
    $pagename = @substr($_SERVER['PATH_INFO'],1);
  if (!$pagename &&
      preg_match('!^'.preg_quote($_SERVER['SCRIPT_NAME'],'!').'/?([^?]*)!',
          $_SERVER['REQUEST_URI'],$match))
      $pagename = urldecode($match[1]);
  $pagename = preg_replace('!/+$!','',$pagename);

  if (!preg_match('/[\\x80-\\x9f]/', $pagename)) return;

  if (function_exists('iconv')) 
    $pagename = iconv('UTF-8','ISO-8859-2',$pagename);
  else {
    $conv = array(
      'Â '=>' ', 'Ä„'=>'¡', 'Ë˜'=>'¢', 'Å'=>'£', 
      'Â¤'=>'¤', 'Ä½'=>'¥', 'Åš'=>'¦', 'Â§'=>'§', 
      'Â¨'=>'¨', 'Å '=>'©', 'Åž'=>'ª', 'Å¤'=>'«', 
      'Å¹'=>'¬', 'Â­'=>'­', 'Å½'=>'®', 'Å»'=>'¯', 
      'Â°'=>'°', 'Ä…'=>'±', 'Ë›'=>'²', 'Å‚'=>'³', 
      'Â´'=>'´', 'Ä¾'=>'µ', 'Å›'=>'¶', 'Ë‡'=>'·', 
      'Â¸'=>'¸', 'Å¡'=>'¹', 'ÅŸ'=>'º', 'Å¥'=>'»', 
      'Åº'=>'¼', 'Ë'=>'½', 'Å¾'=>'¾', 'Å¼'=>'¿', 
      'Å”'=>'À', 'Ã'=>'Á', 'Ã‚'=>'Â', 'Ä‚'=>'Ã', 
      'Ã„'=>'Ä', 'Ä¹'=>'Å', 'Ä†'=>'Æ', 'Ã‡'=>'Ç', 
      'ÄŒ'=>'È', 'Ã‰'=>'É', 'Ä˜'=>'Ê', 'Ã‹'=>'Ë', 
      'Äš'=>'Ì', 'Ã'=>'Í', 'ÃŽ'=>'Î', 'ÄŽ'=>'Ï', 
      'Ä'=>'Ð', 'Åƒ'=>'Ñ', 'Å‡'=>'Ò', 'Ã“'=>'Ó', 
      'Ã”'=>'Ô', 'Å'=>'Õ', 'Ã–'=>'Ö', 'Ã—'=>'×', 
      'Å˜'=>'Ø', 'Å®'=>'Ù', 'Ãš'=>'Ú', 'Å°'=>'Û', 
      'Ãœ'=>'Ü', 'Ã'=>'Ý', 'Å¢'=>'Þ', 'ÃŸ'=>'ß', 
      'Å•'=>'à', 'Ã¡'=>'á', 'Ã¢'=>'â', 'Äƒ'=>'ã', 
      'Ã¤'=>'ä', 'Äº'=>'å', 'Ä‡'=>'æ', 'Ã§'=>'ç', 
      'Ä'=>'è', 'Ã©'=>'é', 'Ä™'=>'ê', 'Ã«'=>'ë', 
      'Ä›'=>'ì', 'Ã­'=>'í', 'Ã®'=>'î', 'Ä'=>'ï', 
      'Ä‘'=>'ð', 'Å„'=>'ñ', 'Åˆ'=>'ò', 'Ã³'=>'ó', 
      'Ã´'=>'ô', 'Å‘'=>'õ', 'Ã¶'=>'ö', 'Ã·'=>'÷', 
      'Å™'=>'ø', 'Å¯'=>'ù', 'Ãº'=>'ú', 'Å±'=>'û', 
      'Ã¼'=>'ü', 'Ã½'=>'ý', 'Å£'=>'þ', 'Ë™'=>'ÿ', 
    );
    $pagename = str_replace(array_keys($conv),array_values($conv),$pagename);
  }

