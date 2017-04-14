<?php

    header(Php::Status(500));

    ob_start();
        IncludeCom('_500');
    $content = ob_get_clean();

    echo $content;
    exit;
?>