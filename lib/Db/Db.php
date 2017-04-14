<?php

    /**
     * Класс инициализации баз данных
     *
     * @author Zmi
     */
    class Db
    {
        // Обработчик ошибок БД
        public static function DbSimpleError($message, $info)
        {
            global $g_config;

            if (!error_reporting())
            {
                return;
            }

            if ($info['query'] == "mysql_connect()") // Не подсоединилась к БД
            {
                exit("Can not connect to database(s)"); // Не работаем дальше с кодом
            }

            static $fileLogger = NULL;
            if (is_null($fileLogger))
            {
                $fileLogger = FileLogger::Create($g_config['dbSimple']['dbLogFile']);
            }
            $fileLogger->Error(
                                  PHP_EOL .
                                  "\tquery: "   . $info['query']   . PHP_EOL .
                                  "\tmessage: " . $info['message'] . PHP_EOL .
                                  "\tcode: "    . $info['code']    . PHP_EOL .
                                  "\tcontext: " . $info['context'] . PHP_EOL .
                                  PHP_EOL
                              );
        }

        public function __construct()
        {
            global $g_config;

            // Подключаем модули для работы с DbSimple (не по подгрузится автолоудером)
            $path = dirname(__FILE__) . '/DbSimple/';
            require_once $path . 'Generic.php';
            require_once $path . 'Mysql.php';
            require_once $path . 'Postgresql.php';
            require_once $path . 'my/MyDataBaseLog.php';

            $dbs = $g_config['dbSimple']['databases'];

            // Собираем все объекты в $o
            $o = new stdClass();
            foreach ($dbs as $db => $conn)
            {
                $dsn       = $conn['dsn'];
                $cacheFunc = isset($conn['pCacheFunc']) ? $conn['pCacheFunc'] : NULL;

                $o->$db = DbSimple_Generic::connect($dsn);

                if ($g_config['dbSimple']['logDbError'])
                {
                    MyDataBaseLog::SetFuncOnError(array(__CLASS__, 'DbSimpleError'));
                    $o->$db->setLogger(array('MyDataBaseLog', 'Log'));
                    $o->$db->setErrorHandler(array('MyDataBaseLog', 'Error'));
                }

                if ($cacheFunc)
                {
                    $o->$db->setCacher($cacheFunc);
                }
            }

            // Регистрируем все базы данных как объект $g_databases
            $GLOBALS['g_databases'] = $o;
        }
    };
?>