<?php 

    IncludeCom("dev/ckeditor4", array
    (
        "name"  => empty($name)  ? NULL : $name, 
        "value" => empty($value) ? NULL : $value,
        "mode"  => empty($mode)  ? NULL : $mode
    ));
?>