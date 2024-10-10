<?php
// File remove old images from all sub folder of this folder.
    
    // maxDate in hours.
    function rrmdir($dir, $extention, $maxDate, &$removedList)
    {
        if (is_dir($dir))
        {
            $objects = scandir($dir);
            foreach ($objects as $object)
            {
                if ($object != "." && $object != "..")
                {
                    $objectName = $dir . "/" . $object;
                    if (filetype($objectName) == "dir")
                    {
                        rrmdir($objectName, $extention, $maxDate, $removedList);
                    }
                    else if (pathinfo($objectName)['extension'] == $extention
                             && time() - filemtime($objectName) > $maxDate * 3600)
                    {
                        unlink ($objectName);
                        $removedList[] = $objectName;
                    }
                }
            }
            reset($objects);
            //rmdir($dir);
        }
    }


    // Remove only png and 1 month old.
    $removedList = [];
    rrmdir(".", "png", 24 * 30, $removedList);
    
    foreach($removedList as $value)
    {
        echo ($value . "<br>");
    }

?>