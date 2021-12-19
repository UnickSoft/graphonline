<?php if (!defined('PmWiki')) exit();

/*	=== FastCache ===
 *	Copyright 2007-09 Eemeli Aro <eemeli@gmail.com>
 *
 *	Caches complete wiki pages for very fast retrieval.
 *
 *	Developed and tested using the PmWiki 2.2.0 series.
 *
 *	To install, add the following line to your local/config.php file :
		include_once("$FarmD/cookbook/fastcache.php");
 *
 *	For more information, please see the online documentation at
 *		http://www.pmwiki.org/wiki/Cookbook/FastCache
 *
 *	This program is free software; you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License, Version 2, as
 *	published by the Free Software Foundation.
 *	http://www.gnu.org/copyleft/gpl.html
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU General Public License for more details.
 *	
 *	Updated for PHP5.5-7.4 by Petko Yotov pmwiki.org/petko
 */

$RecipeInfo['FastCache']['Version'] = '2020-10-17';

Markup( 'nofastcache', 'directives', '/\\(:nofastcache:\\)/i', "NoFastCache" );
function NoFastCache(){
  $GLOBALS['FastCacheValid'] = FALSE;
  return "";
}

SDV( $FastCacheDir, "$FarmD/htmlcache" );
SDV( $FastCacheValid, (
  empty($_POST) &&
  ( empty($_GET) || ( array_keys($_GET) == array('n') ) ) &&
  ( empty($_SESSION) || ( $_SESSION == array( 'authid' => '' ) ) ) &&
  ( empty( $_REQUEST[ ini_get('session.name') ] ) ) # suggested by MagicBeanDip
  && ( empty( $_COOKIE[ ini_get('session.name') ] ) ) # Petko: PHP5.3+ cookies are not in $_REQUEST
) );

if ( !IsEnabled( $EnableFastCache, TRUE ) || !$FastCacheDir ) return;

if ($FastCacheValid) $HandleActions['browse'] = 'HandleFastCacheBrowse';
$EditFunctions[] = 'FastCacheUpdate';


function FastCacheUpdate($pagename, &$page, &$new) {
  global $IsPagePosted;
  global $FastCacheDir, $FastCacheInvalidateAllOnUpdate;
  if ( !$IsPagePosted || !$FastCacheDir ) return;
  if ( IsEnabled( $FastCacheInvalidateAllOnUpdate, TRUE ) ) {
    if ( is_dir($FastCacheDir) && ( $fd = opendir($FastCacheDir) ) ) {
      while ( ( $fh = readdir($fd) ) !== FALSE ) {
        if ( $fh[0] == '.' ) continue;
        if ( !unlink("$FastCacheDir/$fh") ) {
          StopWatch("FastCacheUpdate: error unlinking file $FastCacheDir/$fh > stopping");
          return;
        }
      }
    } else {
      StopWatch("FastCacheUpdate: error opening directory $FastCacheDir");
      return;
    }
  } else {
    SDV( $FastCacheSuffix, '.html' );
    $fcfile = "$FastCacheDir/$pagename$FastCacheSuffix";
    if ( is_file($fcfile) )
      if ( !unlink($fcfile) )
        StopWatch("FastCacheUpdate: error unlinking file $fcfile");
  }
}


## based on HandleBrowse in pmwiki.php
function HandleFastCacheBrowse($pagename, $auth = 'read') {
  # handle display of a page
  global $DefaultPageTextFmt, $PageNotFoundHeaderFmt, $HTTPHeaders,
    $EnableHTMLCache, $NoHTMLCache, $PageCacheFile, $LastModTime, $IsHTMLCached,
    $FmtV, $HandleBrowseFmt, $PageStartFmt, $PageEndFmt, $PageRedirectFmt;
  ## begin added
  global $FastCachePage, $FastCacheDir, $FastCacheValid, $FastCacheSuffix;
  if ( !$FastCacheValid || !$FastCacheDir ) { HandleBrowse($pagename, $auth); return; }
  SDV( $FastCacheSuffix, '.html' );
  $fcfile = "$FastCacheDir/$pagename$FastCacheSuffix";
  if ( @filemtime($fcfile) > $LastModTime ) {
    if ( $FastCachePage = file_get_contents($fcfile) ) {
      StopWatch("HandleFastCacheBrowse: using FastCached copy of $pagename");
      echo $FastCachePage;
    } else {
      $FastCacheValid = FALSE;
      StopWatch("HandleFastCacheBrowse: read error on $fcfile");
      HandleBrowse($pagename, $auth);
    }
	return;
  }
  ## end added
  $page = RetrieveAuthPage($pagename, $auth, true, READPAGE_CURRENT);
  if (!$page) Abort("?cannot read $pagename");
  PCache($pagename,$page);
  if (PageExists($pagename)) $text = @$page['text'];
  else {
    $FastCacheValid = FALSE; ## added
    SDV($DefaultPageTextFmt,'(:include $[{$SiteGroup}.PageNotFound]:)');
    $text = FmtPageName($DefaultPageTextFmt, $pagename);
    SDV($PageNotFoundHeaderFmt, 'HTTP/1.1 404 Not Found');
    SDV($HTTPHeaders['status'], $PageNotFoundHeaderFmt);
  }
  $opt = array();
  SDV($PageRedirectFmt,"<p><i>($[redirected from] <a rel='nofollow'
    href='{\$PageUrl}?action=edit'>{\$FullName}</a>)</i></p>\$HTMLVSpace\n");
  if (@!$_GET['from']) { $opt['redirect'] = 1; $PageRedirectFmt = ''; }
  else $PageRedirectFmt = FmtPageName($PageRedirectFmt, $_GET['from']);
  if (@$EnableHTMLCache && !$NoHTMLCache && $PageCacheFile &&
      @filemtime($PageCacheFile) > $LastModTime) {
    list($ctext) = unserialize(file_get_contents($PageCacheFile));
    $FmtV['$PageText'] = "<!--cached-->$ctext";
    $IsHTMLCached = 1;
    StopWatch("HandleFastCacheBrowse: using HTMLCached copy"); ## modified
  } else {
    $IsHTMLCached = 0;
    $text = '(:groupheader:)'.@$text.'(:groupfooter:)';
    $t1 = time();
    $FmtV['$PageText'] = MarkupToHTML($pagename, $text, $opt);
    if (@$EnableHTMLCache > 0 && !$NoHTMLCache && $PageCacheFile
        && (time() - $t1 + 1) >= $EnableHTMLCache) {
      $fp = @fopen("$PageCacheFile,new", "x");
      if ($fp) {
        StopWatch("HandleFastCacheBrowse: HTMLCaching page"); ## modified
        fwrite($fp, serialize(array($FmtV['$PageText']))); fclose($fp);
        rename("$PageCacheFile,new", $PageCacheFile);
      }
    }
  }
  SDV($HandleBrowseFmt,array(&$PageStartFmt, &$PageRedirectFmt, '$PageText',
    &$PageEndFmt));
  ## begin modified
  if ($FastCacheValid) {
    ob_start();
    PrintFmt($pagename,$HandleBrowseFmt);
    $FastCachePage = ob_get_contents();
    ob_end_flush();
    mkdirp(dirname($fcfile));
    if ( $FastCacheValid && ( $fc = fopen( "$fcfile,new", 'x' ) ) ) {
      StopWatch( "HandleFastCacheBrowse: FastCaching $pagename" );
      fwrite( $fc, $FastCachePage );
      fclose($fc);
      rename( "$fcfile,new", $fcfile );
    } else {
      StopWatch( "HandleFastCacheBrowse: error writing cache to $fcfile,new" );
    }
  } else {
    PrintFmt($pagename,$HandleBrowseFmt);
  }
  ## end modified
}
