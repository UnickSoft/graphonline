<?php

    if (is_file(BASEPATH . 'core/config/browserdatacache.php'))
    {
        require_once BASEPATH . 'core/config/browserdatacache.php';
        $g_config['browserdatacache_allow_dirs'][] = BASEPATH . 'upl/ckeditor4_files/';
        //$g_config['browserdatacache_allow_dirs'][] = BASEPATH . 'lib/ckeditor4/';
    }

    $g_config['ckeditor4']['resize_down_width']  = 1600;
    $g_config['ckeditor4']['resize_down_height'] = 1200;
?>
