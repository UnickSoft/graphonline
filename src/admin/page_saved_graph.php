<?php

include ("./src/graphs_examples_func.php");

function glob_recursive($pattern, $func, $flags = 0)
{
    $files = glob($pattern, $flags);
    
    foreach ($files as $file)
      $func($file);
    
    foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir)
    {
        glob_recursive($dir.'/'.basename($pattern), $func, $flags);
    }
}

function processFiles($mask, &$countFiles, &$sizeFiles, &$ageCount, $ageCallback, $ageActionCallback)
{
    $processFile = function ($file) use (&$countFiles, &$sizeFiles, &$ageCount, $ageCallback, $ageActionCallback)
    {
        $sizeFiles += filesize($file) / 1024;
        $fileAgeInMonth = (time() - filemtime($file)) / (3600 * 24 * 30);

        if ($ageCallback($fileAgeInMonth))
        {
            $ageActionCallback($ageCount, $file);
        }
        
        $countFiles = $countFiles + 1;
    };
    
    // Process graph project files.
    glob_recursive($mask, $processFile);
}

function str_ends_with($haystack, $needle) {
    if ($needle === '') {
        return true;
    }
    return substr($haystack, -strlen($needle)) === $needle;
}

$age6mLessCallback = function($age)
{
    return $age <= 6;
};

$age1mLessCallback = function($age)
{
    return $age <= 1;
};

$graphTimes = array();

$totalGraphCount = 0;
$totalGraphSize  = 0; // In Kb
$ageGraph        = 0;

$totalAutosaveGraphCount = 0;
$totalAutosaveGraphSize  = 0; // In Kb
$ageAutosaveGraph        = 0;

$totalImages = 0;
$totalImagesSize = 0; // In Kb
$ageImage        = 0;
$msg             = "";


if (isset($_POST["submit"]) && $_POST["submit"] == "delete1YImages")
{
    $age1yMoreCallback = function($age)
    {
        return $age > 12;
    };
    
    $examples = getAllExampleGraphs();
    
    $msg = "Deleted files: ";
    $deletedCount = 0;
    
    $ageDelActionCallback = function(&$ageCount, $file) use($examples, &$msg, &$deletedCount)
    {
        // Ignory examples.
        foreach ($examples as $item)
        {
            if (strpos ($file, $item["id"]) !== FALSE)
            {
                return;
            }
        }

        // Ignore test graphs
        if (str_ends_with ($item["id"], "_test"))
        {
            return;
        }
        
        if (unlink($file))
        {
            $msg = $msg . $file . ", ";
            $deletedCount = $deletedCount + 1;
        }
    };
    
    processFiles($g_config['graphSavePath'] . "*.png", $totalImages, $totalImagesSize, $ageImage, $age1yMoreCallback, $ageDelActionCallback);
    
    $msg = $msg . "<br/>" . "Total: $deletedCount";
}


$ageActionCallback = function(&$ageCount, $file)
{
    $ageCount = $ageCount + 1;
};

processFiles($g_config['graphSavePath'] . "*.xml", $totalGraphCount, $totalGraphSize, $ageGraph, $age6mLessCallback, $ageActionCallback);
processFiles($g_config['graphSavePath'] . "autosave/*.xml", $totalAutosaveGraphCount, $totalAutosaveGraphSize, $ageAutosaveGraph, $age1mLessCallback, $ageActionCallback);
processFiles($g_config['graphSavePath'] . "*.png", $totalImages, $totalImagesSize, $ageImage, $age6mLessCallback, $ageActionCallback);

$totalGraphSize = intval($totalGraphSize);
$totalImagesSize = intval($totalImagesSize);

?>