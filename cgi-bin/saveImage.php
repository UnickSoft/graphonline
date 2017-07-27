<?php

include ("../core/config/main.php");
include ("saveGraphHelpers.php");

$name  = $_GET["name"];

if (isValidName($name))
{
    $imageFilename = getImageFileName($name);
    $imageData     = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $_POST['base64data']));
    
    if (isset($_GET["x"]) && $_GET["width"] < 4000 && $_GET["height"] < 4000)
    {
        $src = imagecreatefromstring($imageData);
        $dst = imagecreatetruecolor($_GET["width"], $_GET["height"]);
        imagesavealpha($dst, true);
        imagealphablending($dst, false);
        
        imagecopy($dst, $src, 0, 0, $_GET["x"], $_GET["y"], $_GET["width"], $_GET["height"]);
        imagepng($dst, $imageFilename);
    }
    else
    {
        file_put_contents($imageFilename, $imageData);
    }
    
    chmod($imageFilename, 0644);
    echo ("OK");
}

?>
