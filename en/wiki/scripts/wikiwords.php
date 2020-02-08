<?php if (!defined('PmWiki')) exit();
/*  Copyright 2001-2013 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.

    This script adds WikiWord (CamelCase) processing to PmWiki.
    Originally WikiWords were part of the default configuration,
    but their usage has died out over time and so it's now optional.

    To enable WikiWord links, simply add the following to
    a local customization file:

        $EnableWikiWords = 1;

    To have PmWiki recognize and process WikiWords but not link
    them (i.e., the default behavior in PmWiki 2.1), also add

        $LinkWikiWords = 0;

    If you want only the first occurrence of a WikiWord to be converted
    to a link, set $WikiWordCountMax=1.

        $WikiWordCountMax = 1;         # converts only first WikiWord
        $WikiWordCountMax = 0;         # another way to disable WikiWord links

    The $WikiWordCount array can be used to control the number of times
    a WikiWord is converted to a link.  This is useful for disabling
    or limiting specific WikiWords.

        $WikiWordCount['PhD'] = 0;         # disables 'PhD'
        $WikiWordCount['PmWiki'] = 1;      # convert only first 'PmWiki'
        $WikiWordCount['WikiWord'] = -1;   # ignore $SpaceWikiWord setting

    By default, PmWiki is configured such that only the first occurrence
    of 'PmWiki' in a page is treated as a WikiWord.  If you want to
    restore 'PmWiki' to be treated like other WikiWords, uncomment the
    line below.
        unset($WikiWordCount['PmWiki']);

    If you want to disable WikiWords matching a pattern, you can use
    something like the following.  Note that the first argument has to
    be different for each call to Markup().  The example below disables
    WikiWord links like COM1, COM2, COM1234, etc.
        Markup('COM\d+', '<wikilink', '/\\bCOM\\d+/', "Keep('$0')");
*/

SDV($LinkWikiWords, 1);

## bare wikilinks
Markup_e('wikilink', '>urllink',
  "/\\b(?<![#&])($GroupPattern([\\/.]))?($WikiWordPattern)/",
  "Keep('<span class=\\'wikiword\\'>'.WikiLink(\$pagename,\$m[0]).'</span>',
        'L')");

function WikiLink($pagename, $word) {
  global $LinkWikiWords, $WikiWordCount, $SpaceWikiWords, $AsSpacedFunction,
    $MarkupFrame, $WikiWordCountMax;
  if (!$LinkWikiWords || ($WikiWordCount[$word] < 0)) return $word;
  $text = ($SpaceWikiWords) ? $AsSpacedFunction($word) : $word;
  $text = preg_replace('!.*/!', '', $text);
  if (!isset($MarkupFrame[0]['wwcount'][$word]))
    $MarkupFrame[0]['wwcount'][$word] = $WikiWordCountMax;
  if ($MarkupFrame[0]['wwcount'][$word]-- < 1) return $text;
  return MakeLink($pagename, $word, $text);
}


