<?php

include ("../core/config/main.php");
include ("saveGraphHelpers.php");

$name  = $_GET["name"];

if (isValidName($name))
{
    $imageFilename = getSvgFileName($name);
    $svgData     = $_POST['svgdata'];
    
    file_put_contents($imageFilename, $svgData);
    
    chmod($imageFilename, 0644);
    echo ("OK");
}

?>
