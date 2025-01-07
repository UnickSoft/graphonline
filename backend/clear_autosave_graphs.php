<?php
include ("../core/config/main.php");

$dirName = "../" . $g_config['graphSavePath'] . 'autosave/*';
$days_to_remove = 14;
//echo($dirName . "<br>");
$files = glob($dirName, 0);
$count = 0;
foreach ($files as $file)
{
    $fileAgeInDays = (time() - filemtime($file)) / (3600 * 24);
    if ($fileAgeInDays > $days_to_remove)
    {
        if (unlink($file))
        {
            echo($file . " " . $fileAgeInDays . "<br>");
            $count = $count + 1;
        }
    }
}
echo("Deleted " . $count . " graphs");

?>