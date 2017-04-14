<?php

    /**
     * Входная точка в движок
     *
     * @author Zmi
     */


    // Режим работы сайта (Debug || Production)
    define('DEBUG_MODE', (bool)(strpos($_SERVER["REMOTE_ADDR"], "127.0.0.") === 0 || strpos($_SERVER["REMOTE_ADDR"], "192.168.0.") === 0));
    // Режим вывода ошибок по идёт инициализация движка, после перенастроится на параметр $g_config['phpIni']['display_errors']
    ini_set('display_errors', DEBUG_MODE);

    define('BASEPATH', str_replace('\\', '/', dirname(__FILE__)) . '/');

    require_once BASEPATH . 'core/core.php';

    ob_start();
        header(Php::Status(200));
        $g_config['isControllerLoad'] = IncludeCom(GetQuery());
    $content = ob_get_clean();

    // Если страницы небыло то 404-ая
    if (!$g_config['isControllerLoad'])
    {
        ob_start();
            IncludeCom('404');
        $content = ob_get_clean();
    }

    // Если страницу нужно загрузить в главном шаблоне
    if ($g_config['isLoadInMainTpl'])
    {
        ob_start();
            IncludeCom($g_config['mainTpl'], array('content' => $content));
        $content = ob_get_clean();
    }

    echo PrepareContent($content);
?>
