<?php

    /**
     * Класс работы с пхп
     *
     * @author Zmi
     */
    class Php
    {
        // Массив с перечнем кодов ответов от сервера
        private static $codes = array
                                    (
                                        '200' => 'OK',
                                        '201' => 'Created',
                                        '202' => 'Accepted',
                                        '203' => 'Non-Authoritative Information',
                                        '204' => 'No Content',
                                        '205' => 'Reset Content',
                                        '206' => 'Partial Content',

                                        '300' => 'Multiple Choices',
                                        '301' => 'Moved Permanently',
                                        '302' => 'Found',
                                        '304' => 'Not Modified',
                                        '305' => 'Use Proxy',
                                        '307' => 'Temporary Redirect',

                                        '400' => 'Bad Request',
                                        '401' => 'Unauthorized',
                                        '403' => 'Forbidden',
                                        '404' => 'Not Found',
                                        '405' => 'Method Not Allowed',
                                        '406' => 'Not Acceptable',
                                        '407' => 'Proxy Authentication Required',
                                        '408' => 'Request Timeout',
                                        '409' => 'Conflict',
                                        '410' => 'Gone',
                                        '411' => 'Length Required',
                                        '412' => 'Precondition Failed',
                                        '413' => 'Request Entity Too Large',
                                        '414' => 'Request-URI Too Long',
                                        '415' => 'Unsupported Media Type',
                                        '416' => 'Requested Range Not Satisfiable',
                                        '417' => 'Expectation Failed',

                                        '500' => 'Internal Server Error',
                                        '501' => 'Not Implemented',
                                        '502' => 'Bad Gateway',
                                        '503' => 'Service Unavailable',
                                        '504' => 'Gateway Timeout',
                                        '505' => 'HTTP Version Not Supported'
                                    );

        /**
         * Вернет правильный статус для отсылки его по header
         */
        public static function Status($code)
        {
            if (empty($code) || !is_numeric($code) || !isset(self::$codes[$code]))
            {
                return false;
            }

            $text           = self::$codes[$code];
            $serverProtocol = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : false;

            if (substr(php_sapi_name(), 0, 3) == 'cgi')
            {
                $ret = "Status: {$code} {$text}";
            }
            elseif ($serverProtocol == 'HTTP/1.1' or $serverProtocol == 'HTTP/1.0')
            {
                $ret = $serverProtocol . " {$code} {$text}";
            }
            else
            {
                $ret = "HTTP/1.1 {$code} {$text}";
            }

            return $ret;
        }

        public static function StripslashesGpc(&$value)
        {
            $value = stripslashes($value);
        }

        // Нормализация переменных в массивах при включенном magic_quotes (так же чистит от html)
        private static function NormalizeArrays()
        {
            if (get_magic_quotes_gpc())
            {
                if (is_array($_FILES))
                {
                    foreach ($_FILES AS $key=>$val)
                    {
                        $_FILES[$key]['tmp_name']  = str_replace('\\\\', '\\', $val['tmp_name']);
                    }
                }

                array_walk_recursive($_GET, array(__CLASS__, 'StripslashesGpc'));
                array_walk_recursive($_POST, array(__CLASS__, 'StripslashesGpc'));
                array_walk_recursive($_COOKIE, array(__CLASS__, 'StripslashesGpc'));
                array_walk_recursive($_REQUEST, array(__CLASS__, 'StripslashesGpc'));

                set_magic_quotes_runtime(0);
            }
        }

        private function DebugErrorHook()
        {
            global $g_config;
            static $errorListner = NULL;

            $path = dirname(__FILE__) . '/Debug/ErrorHook/';
            require_once $path . 'Listener.php';
            require_once $path . 'Catcher.php';
            require_once $path . 'INotifier.php';
            require_once $path . 'Util.php';
            require_once $path . 'TextNotifier.php';
            require_once $path . 'MailNotifier.php';
            require_once $path . 'RemoveDupsWrapper.php';
            require_once $path . 'my/MyDebug_ErrorHook_TextNotifier.php';

            $cfgLog = $g_config['logErrors'];

            FileSys::MakeDir(dirname($cfgLog['repeatTmp']));

            $errorListner = new Debug_ErrorHook_Listener();
            $errorListner->addNotifier(new MyDebug_ErrorHook_TextNotifier(MyDebug_ErrorHook_TextNotifier::LOG_ALL));
            if (!empty($cfgLog['email']))
            {
                $errorListner->addNotifier(
                                            new Debug_ErrorHook_RemoveDupsWrapper(
                                                                                    new Debug_ErrorHook_MailNotifier($cfgLog['email'], Debug_ErrorHook_TextNotifier::LOG_ALL),
                                                                                    $cfgLog['repeatTmp'] . "/email/",
                                                                                    $cfgLog['emailTimeRepeat']
                                                                                 )
                                          );
            }
        }

        public function __construct()
        {
            global $g_config;

            // Настраиваем php
            foreach ($g_config['phpIni'] as $k => $v)
            {
                ini_set($k, $v);
            }

            self::NormalizeArrays();

            setlocale(LC_ALL, "en_US.UTF-8", "English");
            date_default_timezone_set('Europe/London');

            if (function_exists("mb_internal_encoding") && function_exists("mb_regex_encoding"))
            {
                mb_internal_encoding($g_config['charset']);
                mb_regex_encoding($g_config['charset']);
            }

            if ($g_config['useDebugErrorHook'])
            {
                // Подключаем слежку за ошибками
                $this->DebugErrorHook();
            }
        }
    };
?>