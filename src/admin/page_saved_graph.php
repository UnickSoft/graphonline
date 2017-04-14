<?php


function glob_recursive($pattern, $flags = 0)
{
    $files = glob($pattern, $flags);
    foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir)
    {
        $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
    }
    return $files;
}

function processFiles($mask, &$countFiles, &$sizeFiles, &$ageCount, $ageCallback)
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
            $ageCount = $ageCount + 1;
        }
    }
}

$ageCallback = function($age)
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

processFiles($g_config['graphSavePath'] . "*.xml", $totalGraphCount, $totalGraphSize, $ageGraph, $ageCallback);
processFiles($g_config['graphSavePath'] . "*.png", $totalImages, $totalImagesSize, $ageImage, $ageCallback);

$totalGraphSize = intval($totalGraphSize);
$totalImagesSize = intval($totalImagesSize);

?>