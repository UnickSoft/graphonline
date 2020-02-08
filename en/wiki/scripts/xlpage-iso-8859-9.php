<?php if (!defined('PmWiki')) exit();
/*  Copyright 2005-2011 Patrick R. Michaud (pmichaud@pobox.com)
    This file is part of PmWiki; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published
    by the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.  See pmwiki.php for full details.
*/

  global $HTTPHeaders, $Charset, $DefaultPageCharset;

  $HTTPHeaders[] = "Content-type: text/html; charset=iso-8859-9;";
  $Charset = "ISO-8859-9";
  SDVA($DefaultPageCharset, array('ISO-8859-1'=>$Charset));

