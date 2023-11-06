<?php if (!isset($_GET["cacheFiles"]) && isset($_GET["target"])): ?>
<head>
<script src="/script/shared/config.js" ></script>
<script src="/script/shared/loader.js" ></script>
<script src="<?= $_GET["target"] ?>" ></script>
<script>
  setTimeout(
  () => {
      document.getElementById("state").innerHTML = "Saving files";
      const xhr = new XMLHttpRequest();      
      xhr.open("GET", "<?= $_SERVER['PHP_SELF'] ?>?cacheFiles=" + moduleLoader.syncLoaded.toString() + "&target=" + "<?=  $_GET["target"] ?>");
      xhr.send();
      xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          document.getElementById("state").innerHTML = "Finished <br>" + xhr.response;
        } else {
          document.getElementById("state").innerHTML = "Error happends";
        }
      };
  }, 3000);
</script>
</head>


<body>
<div>
<p>State:</p>
<p id="state">Loading</p>
</div>
</doby>
<?php endif; ?>

<?php 
  if (!isset($_GET["target"])) {
    echo ("Error target is not set");
    return;
  }
?>

<!-- Create cache file -->
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
$indexFilename  = "../" . $_GET["target"];
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

echo("Prcoessed files: " . $processedFilesCount);
}
?>
