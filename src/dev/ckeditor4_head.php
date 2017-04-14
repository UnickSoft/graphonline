<?php

    $contentCss = NULL;
    if ($g_config['extrapacker']['packCss'] && $g_config['extrapacker']['dir'])
    {
        // Если мы в админке, то директория может быть переопределена, но изначальная должна быть сохранена в $g_config['extrapacker']['non_admin_dir']
        $dir  = isset($g_config['extrapacker']['non_admin_dir']) ? $g_config['extrapacker']['non_admin_dir'] : $g_config['extrapacker']['dir'];
        $path = "tmp/{$dir}/css/";

        $files = glob(BASEPATH . $path . "*.css");
        if (count($files) > 0)
        {
            sort($files);
            $file = end($files);
            $contentCss = "/" . $path . basename($file);
        }
    }
?>
