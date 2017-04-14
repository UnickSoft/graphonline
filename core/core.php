<?php

    /**
     * Ининциализатор системы
     *
     * @author Zmi and GYL
     */


    // Подключаем все файлы которые есть в папках core/{func|config|init}
    foreach (array(BASEPATH . 'core/func/', BASEPATH . 'core/config/', BASEPATH . 'core/init/') as $dir)
    {
        $files  = array_merge(array($dir . 'main.php'), glob($dir . "*.php"));
        foreach ($files as $f)
        {
            if (is_readable($f))
            {
                require_once $f;
            }
        }
    }
?>