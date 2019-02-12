<?php

include ("./src/graphs_examples_func.php");

function glob_recursive($pattern, $flags = 0)
{
    $files = glob($pattern, $flags);
    foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir)
    {
        $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
    }
    return $files;
}

function processFiles($mask, &$countFiles, &$sizeFiles, &$ageCount, $ageCallback, $ageActionCallback)
{
    // Process graph project files.
    $files = glob_recursive($mask);
    
    $countFiles = count($files);
    foreach ($files as $file)
    {
        $sizeFiles += filesize($file) / 1024;
        $fileAgeInMonth = (time() - filemtime($file)) / (3600 * 24 * 30);

        if ($ageCallback($fileAgeInMonth))
        {
            $ageActionCallback($ageCount, $file);
        }
    }
}

$age6mLessCallback = function($age)
{
    return $age <= 6;
};

$graphTimes = array();

$totalGraphCount = 0;
$totalGraphSize  = 0; // In Kb
$ageGraph        = 0;

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
processFiles($g_config['graphSavePath'] . "*.png", $totalImages, $totalImagesSize, $ageImage, $age6mLessCallback, $ageActionCallback);

$totalGraphSize = intval($totalGraphSize);
$totalImagesSize = intval($totalImagesSize);

?>