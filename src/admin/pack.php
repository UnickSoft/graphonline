<?php

/**
 * Return relative path between two sources
 * @param $from
 * @param $to
 * @param string $separator
 * @return string
 */
function relativePath($from, $to, $separator = DIRECTORY_SEPARATOR)
{
    $from   = str_replace(array('/', '\\'), $separator, $from);
    $to     = str_replace(array('/', '\\'), $separator, $to);

    $arFrom = explode($separator, rtrim($from, $separator));
    $arTo = explode($separator, rtrim($to, $separator));
    while(count($arFrom) && count($arTo) && ($arFrom[0] == $arTo[0]))
    {
        array_shift($arFrom);
        array_shift($arTo);
    }

    return str_pad("", count($arFrom) * 3, '..'.$separator).implode($separator, $arTo);
}

include (relativePath(dirname($_SERVER['PHP_SELF']), "/") . "lib/ExtraPacker/Lib/JSMin.php");

if (isset($_GET["cacheFiles"])) {
  $cacheFilenameList = $_GET["cacheFiles"];
  $files = explode(",", $cacheFilenameList);
  //print_r($files);
  $indexFilename  = "./" . $_GET["target"];
  $outputFilename = $indexFilename . '.cache';
  unlink($outputFilename);

  // Put files already loaded.
  $cacheContent = "";
  $cacheContent = $cacheContent . "\nmoduleLoader.beginCacheLoading([";

  foreach ($files as &$file) {
    $cacheContent = $cacheContent . "\"" . $file . "\"" . ",";
  }
  $cacheContent = $cacheContent .  "]);\n";
  // Put index file.
  $processedFilesCount = 1;
  $cacheContent = $cacheContent . file_get_contents($indexFilename);
  // Put files
  foreach ($files as &$file) {
    $relativePath = strtok($file, '?');
    $relativePath = relativePath(dirname($_SERVER['PHP_SELF']), $relativePath);
    $cacheContent = $cacheContent . file_get_contents($relativePath);
    $processedFilesCount ++;
  }
  // Put event about cache loaded.
  $cacheContent = $cacheContent . "\nmoduleLoader.endCacheLoading();";

  $minifiedCacheContent = JSMin::minify($cacheContent);

  file_put_contents($outputFilename, $minifiedCacheContent, FILE_APPEND);

  echo("<p>Processed files: " . $processedFilesCount . "</p>");
  echo("<p>File updated: " . $outputFilename . "</p>");
  echo("<p>You may close this page</p>");  
}



?>