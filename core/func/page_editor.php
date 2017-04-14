<?php

    /**
     * Рекурсивно получить все файлы и папки
     */
    function PageEditorGetListFilesDirs($folder, &$allFiles)
    {
        $fp = is_readable($folder) ? opendir($folder) : false;
        if ($fp)
        {
            $file = readdir($fp);
           
            while ($file !== false) 
            {
                $path = $folder . "/" . $file;
           
                if (is_file($path)) 
                {
                    if (substr($path, -4) == ".php")
                    {
                        $allFiles[] = $folder . "/" . $file;
                    }
                }
                elseif ($file != "." && $file != ".." && is_dir($path))
                {
                    $allFiles[] = $folder . "/" . $file . "/";
                    PageEditorGetListFilesDirs($path, $allFiles);
                }
                
                $file = readdir($fp);
            }
            closedir($fp);
        }
    }
?>