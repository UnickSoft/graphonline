<?php

    new Php(); // Настройка php и включение слежки за ошибками
    header('Content-type: text/html; charset=' . $g_config['charset']);

    GetQuery(); // Что бы определился язык сайта
    $redirectUrl = GetRedirectURL(); // Check redirect
    if ($redirectUrl != NULL)
    {
        header("HTTP/1.1 301 Moved Permanently"); 
        header("Location: $redirectUrl");
        exit();
    }
    // Подключаем все языковые файлы из автозагруки
    $dirs  = array_unique(
                            array(
                                      BASEPATH . 'lang/' . DEF_LANG . '/autoload/',
                                      BASEPATH . 'lang/' . LANG . '/autoload/'
                                  )
                          );
    $g_lang = array();
    foreach ($dirs as $dir)
    {
        $files = array_merge(array($dir . 'main.php'), glob($dir . "*.php"));
        foreach ($files as $f)
        {
            if (is_readable($f))
            {
                require_once $f;
            }
        }
    }
    $g_lang['m_defTitle'] = L('m_title');
?>