<?php

    /**
     * Функции используемые при дебаге кода
     *
     * @author Zmi
     */


    // Запись в стандартный лог движка
    function ToLog($msg, $path = '')
    {
        global $g_config;
        $path   = empty($path) ? $g_config['logPath'] : $path;
        $logger = FileLogger::Create($path);
        $logger->Message($msg);
    }

    function Xmp($a)
    {
        printf("<xmp>%s</xmp>", print_r($a, true));
    }

    function VarDump($var)
    {
        $ret = '';
        if (is_bool($var))
        {
            $ret = ($var) ? 'true' : 'false';
        }
        elseif (is_scalar($var))
        {
            $ret = htmlspecialchars($var);
        }
        elseif (is_null($var))
        {
            $ret = 'NULL';
        }
        else
        {
            ob_start();
                var_dump($var);
            $data = ob_get_clean();
            $data = preg_replace('/=>\n\s+/', ' => ', $data);
            $data = htmlspecialchars($data);
            $ret = '<pre>' . $data . '</pre>';
        }
        return $ret;
    }
?>