<?php

    /**
     * Главные ф-ии
     *
     * @author Zmi
     */


    // Параметры какие защиты отключать
    define('M_HTML_FILTER_OFF', 2); // Выкл. защиту от HTML текста
    define('M_XSS_FILTER_OFF',  4); // Выкл. защиту от XSS вставок
    define('M_DELETE_PARAM', 'micron_not_use_this_param__98gmkhgKfdg');


    // Производит замену только 1-го вхождения подстроки в строку
    function _StrReplaceFirst($search, $replace, $subject)
    {
        $ret = $subject;
        $pos = strpos($subject, $search);
        if ($pos !== false)
        {
            $ret = substr_replace($subject, $replace, $pos, strlen($search));
        }
        return $ret;
    }

    /**
     * Загрузка компонента
     *
     * Производит подключение файлов lang/src/tpl
     *
     * @global array  $g_lang
     * @global array  $g_config
     * @global string $g_arrLangs
     *
     * @param string  $_micron_file   - URI запроса т.е. подключаемый файл или строка вида file_name&par1=a&par2=b
     * @param array   $_micron_params - массив параметров которые необходимо создать до подключения
     *
     * @return int - вовзращает кол-во подключенных файлов этого компонента
     */
    function IncludeCom($_micron_file, $_micron_params = array())
    {
        global $g_lang, $g_config, $g_arrLangs;

        $_micron_file = GetQuery($_micron_file);
        foreach ($_micron_params as $micron_name => $micron_value)
        {
            $$micron_name = $micron_value;
        }

        $micron_has   = 0;
        // Список всех файлов которые требуется полключить
        $micron_files = array
                      (
                          BASEPATH . 'lang/' . DEF_LANG . "/{$_micron_file}.php",
                          BASEPATH . 'lang/' . LANG . "/{$_micron_file}.php",
                          BASEPATH . "src/{$_micron_file}.php",
                          BASEPATH . "tpl/{$_micron_file}.php"
                      );
        $micron_files = array_unique($micron_files);

        // Подключаем все возможные файлы компонента
        foreach ($micron_files as $micron_f)
        {
            if (is_readable($micron_f))
            {
                $micron_has++;
                require $micron_f;
                if (isset($GLOBALS['__breakCurrentCom__']) && $GLOBALS['__breakCurrentCom__'])
                {
                    $GLOBALS['__breakCurrentCom__'] = 0;
                    return $micron_has;
                }
            }
        }
        return $micron_has;
    }

    /**
     * Фунция выхода из компонента что бы дальше файлы не подключала
     */
    function ExitCom()
    {
        $GLOBALS['__breakCurrentCom__'] = 1;
    }

    /**
     * Получает строку запроса к движку
     *
     * Так же данная функция занимается созданием параметров в $_GET если они были переданны в q и созданием константы LANG если ее еще не было
     *
     * @global array  $g_config
     * @global array  $g_arrLangs   - массив языков сайта
     *
     * @param  string $q            - строка запроса при ее отсутвии то что было в $_GET[q]
     *
     * @return string
     */
    function GetQuery($q = NULL)
    {
        global $g_config, $g_arrLangs;

        $langs   = array_keys($g_arrLangs);
        $defPage = $g_config['defaultComponent'];

        require_once BASEPATH . 'lib/InputClean.php';

        $q     = is_null($q) ? (isset($_GET['q']) && !empty($_GET['q']) ? rtrim($_GET['q'], "/") : $defPage) : $q;
        $q     = _StrReplaceFirst('&', '?', $q);
        $parse = parse_url($q);
        $q     = FileSys::FilenameSecurity($parse['path']);
        if (isset($parse['query']))
        {
            foreach (explode('&', $parse['query']) as $elem)
            {
                if (strpos($elem, '=') !== false)
                {
                    $elem = explode('=', $elem);
                    $_GET[$elem[0]] = isset($elem[1]) ? $elem[1] : NULL;
                }
            }
        }
        $parts = explode('/', $q);

        $lang = isset($parts[0]) && in_array($parts[0], $langs) ? $parts[0] : DEF_LANG;

        if (!defined('LANG'))
        {
            define('LANG', $lang);
        }

        if (isset($parts[0]) && in_array($parts[0], $langs))
        {
            $q = implode('/', array_splice($parts, 1));
        }

        $cleaner = new InputClean($g_config['charset']);
        return empty($q) ? $defPage : $cleaner->_clean_input_data($q);
    }

    function _HtmlClean(&$value)
    {
        $value = htmlspecialchars($value);
    }

    // Очищает входные данные
    function _Clean($value, $secureFlags)
    {
        if (!($secureFlags & M_XSS_FILTER_OFF)) // Если не отключена защита от XSS
        {
            global $g_config;
            static $cleaner = NULL;
            if (is_null($cleaner))
            {
                $cleaner = new InputClean($g_config['charset']);
            }
            $value = $cleaner->_clean_input_data($value);
        }
        if (!($secureFlags & M_HTML_FILTER_OFF)) // Если не отключена защита от HTML
        {
            is_array($value) ? array_walk_recursive($value, "_HtmlClean") : _HtmlClean($value);
        }
        return $value;
    }

    /**
     * Возвращает юрл до корня сайта, нужна для данных (image, js, css ...)
     */
    function Root($uri = '')
    {
        $dir = SITE_IN_DIR ? (SITE_IN_DIR . '/') : '';
        return SITE_ROOT . "{$dir}{$uri}";
    }

    function RootCacheJS($uri = '') {
        global $g_config;

        $cacheFilePath = Root($uri . ".cache");
        $filePath      = Root($uri);
        $cacheExists   = file_exists("." . $cacheFilePath);
        $finalFileName = $cacheExists && $g_config['use_js_cache'] ? $cacheFilePath : $filePath;

        return $finalFileName . "?v=" . $g_config['engine_version'];
    }

    /**
     * Путь до корня сайта с подставкой языка, нужна для ссылок
     */
    function SiteRoot($uri = '')
    {
        global $g_config;

        $uri  = $uri == $g_config['defaultComponent'] ? '' : $uri;

        $dir  = SITE_IN_DIR ? (SITE_IN_DIR . '/') : '';
        $lang = LANG == DEF_LANG ? '' : (LANG . '/');
        $ret  = $lang || $uri ? "/{$dir}?q={$lang}{$uri}" : "/{$dir}";
        $ret  = empty($ret) ? '/' : $ret;
        $ret  = $g_config['useModRewrite'] ?
                    _StrReplaceFirst('/?q=', '/', _StrReplaceFirst('&', '?', $ret)) :
                    $ret;
        $ret  = SITE_ROOT . substr($ret , 1);

        // Заменяем начальную страницу в URL а просто корень
        $ret = in_array(
                            $ret,
                            array(
                                    SITE_ROOT . $g_config['defaultComponent'],
                                    SITE_ROOT . '?q=' . $g_config['defaultComponent']
                                  )
                        ) ?
                SITE_ROOT :
                $ret;

        return $ret;
    }

    // Возвращает дебаг панель располагаемую внизу страницу
    function GetDebug()
    {
        global $g_config;

        $ret = '';
        // Выводить дебаг-панель только если это режим отладки и только если страница прошла через главный шаблон
        if (DEBUG_MODE && $g_config['isLoadInMainTpl'])
        {
            ob_start();
                IncludeCom('dev/debug_panel');
            return ob_get_clean();
        }
        return $ret;
    }

    function _PrepareContent($c)
    {
        global $g_config;

        require_once BASEPATH . 'lib/ExtraPacker/Config.php';
        require_once BASEPATH . 'lib/ExtraPacker/ExtraPacker.php';
        require_once BASEPATH . 'lib/HtmlValidate.php';

        $validator   = new HtmlValidate($c);
        $c           = $validator->Get();

        $postfix     = str_replace ("/", "", strtok($_SERVER["REQUEST_URI"],'?'));

        $cfg         = $g_config['extrapacker'];
        $extraPacker = new ExtraPacker(
                                            array('ExtraPacker_Config', 'GetPathJsFileFromUrl'),
                                            array('ExtraPacker_Config', 'GetPathCssFileFromUrl'),
                                            array('ExtraPacker_Config', 'GetAddrJsPackFile'),
                                            array('ExtraPacker_Config', 'GetAddrCssPackFile'),
                                            NULL,
                                            NULL,
                                            BASEPATH . 'tmp/' . $cfg['dir'] . "/js/$postfix/inf.txt",
                                            BASEPATH . 'tmp/' . $cfg['dir'] . "/js/$postfix/js.js",
                                            BASEPATH . 'tmp/' . $cfg['dir'] . "/css/$postfix/inf.txt",
                                            BASEPATH . 'tmp/' . $cfg['dir'] . "/css/$postfix/css.css",
                                            $cfg['packHtml'],
                                            $cfg['packCss'],
                                            $cfg['packJs'],
                                            $cfg['arrExeptions_js'],
                                            $cfg['arrExeptionsNotAdd_js'],
                                            $cfg['arrExeptions_css'],
                                            $cfg['arrExeptionsNotAdd_css'],
                                            true,
                                            BASEPATH . 'tmp/' . $cfg['dir'] . "/js/$postfix/trans.txt",
                                            BASEPATH . 'tmp/' . $cfg['dir'] . "/css/$postfix/trans.txt",
                                            $cfg['buffering'],
                                            array('ExtraPacker_Config', 'PrepareEachFile'),
                                            array('ExtraPacker_Config', 'PrepareAllCss'),
                                            array('ExtraPacker_Config', 'PrepareAllJs')
                                       );
        return $extraPacker->Pack($c) . GetDebug();
    }

    /**
     * Функиця подготовки вывода контента в браузер
     */
    function PrepareContent($c)
    {
        global $g_config;

        foreach ($g_config['prepareFunctions'] as $func)
        {
            $c = call_user_func($func, $c);
        }
        return $c;
    }

    /**
     * Параметр из $_GET
     */
    function Get($name, $def = false, $secureFlags = 0)
    {
        return isset($_GET[$name]) ? _Clean($_GET[$name], $secureFlags) : $def;
    }

    /**
     * Параметр из $_POST
     */
    function Post($name, $def = false, $secureFlags = 0)
    {
        return isset($_POST[$name]) ? _Clean($_POST[$name], $secureFlags) : $def;
    }

    /**
     * Получение текущей строки запроса к движку (удобно юзать в action для формы если это компоннет)
     */
    function GetCurUrl($_pars = '')
    {
        $pars = '';
        $all  = $_GET;

        foreach (array_filter(explode('&', $_pars)) as $v)
        {
            if (strpos($v, '=') === false)
            {
                $all[$v] = NULL;
            }
            else
            {
                $t              = explode('=', $v);
                list($id, $val) = $t;
                $all[$id]       = urldecode($val);
            }
        }

        foreach ($all as $k => $v)
        {
            if ($k == 'q') continue;
            if ($v == M_DELETE_PARAM) continue;
            $pars .= ("{$k}=" . urlencode($v) . "&");
        }
        $pars = substr($pars, 0, -1) ? ('&' . substr($pars, 0, -1)) : '';
        return SiteRoot(GetQuery() . $pars);
    }

    /**
     * Переопределяем функцию автозагрузки классов
     */
    function _AutoLoadLib($className)
    {
        if (is_readable(BASEPATH . "lib/{$className}.php"))
        {
            require_once BASEPATH . "lib/{$className}.php";
        }
        if (is_readable(BASEPATH . "model/{$className}.php"))
        {
            require_once BASEPATH . "model/{$className}.php";
        }
    }
    spl_autoload_register('_AutoLoadLib');

    /**
     * Функция установки title/desk/kw если страница не главная и не было установлено значений до этого
     */
    function AutoTDKW($content)
    {
        global $g_lang, $g_config;

        if ($g_config['autoGetTitle']) // Только если это не главная, ибо там то по любому выставлено
        {
            if (L('m_title') === L('m_defTitle'))
            {
                preg_match('~<h1(.*?)>(.*?)</h1>~is', $content, $m);
                if (isset($m[2]))
                {
                    $g_lang['m_title'] = strip_tags($m[2]) . L('m_titlePostfix');
                }
            }
        }
    }

    // Получить параметр из языкового массива
    function L($name)
    {
        global $g_lang;
        if (!isset($g_lang[$name]))
        {
            trigger_error("Unknown lang ($name) variable", E_USER_ERROR);
        }
        return $g_lang[$name];
    }
?>
