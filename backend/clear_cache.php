<?php
/**
 *  Clear cache css cache.
 */

function deleteDirectory($dir) 
{
    if (!file_exists($dir)) {
        return true;
    }

    if (!is_dir($dir)) {
        return unlink($dir);
    }

    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }

        $path = $dir . DIRECTORY_SEPARATOR . $item;
        if (is_dir($path)) {
            deleteDirectory($path);
        } else if('.gitignore' !== $item && '.htaccess' !== $item) {
            unlink($path);
        }
    }

    return rmdir($dir);
}

$path = '../tmp/auto_merge_css_js/css/';
if (deleteDirectory($path)) {
    echo "Cache deleted successfully.";
} else {
    echo "Error deleting cache.";
}

?>