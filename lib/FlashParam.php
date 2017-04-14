<?php

    /**
     * Параметры запоминаемые на 1 (N) переходов
     *
     * Хорошо подгодят для сообщений вида "Успешно добавлено" которое при обновлении страницы пропадет
     *
     * @author Zmi
     * @author Guul
     */
    class FlashParam
    {
        const SESSION_PAR = '__engineSessionFlashParamSector__';

        // Флаг проводилась ли очистка параметров
        private static $cleanParams = false;
        private $opened = false;

        public function __construct()
        {
            $this->opened = true;
            try 
            {
                @session_start();
            } 
            catch(ErrorExpression $e) 
            {
                $this->opened = false;
            }
            if (!self::$cleanParams)
            {
                self::$cleanParams = true;
                $this->AutoClean();
            }
        }

        public function Get($name)
        {
            $ret = false;
            if (isset($_SESSION[self::SESSION_PAR]))
            {
                if (isset($_SESSION[self::SESSION_PAR][$name]))
                {
                    $ret = $_SESSION[self::SESSION_PAR][$name]['value'];
                }
            }
            return $ret;
        }

        public function Set($name, $value, $countSessionRemember = 1)
        {
            $elem = array
                        (
                            'value'             => $value,
                            'countSessionPass'  => $countSessionRemember,
                            'time'              => time()
                        );
            if (!isset($_SESSION[self::SESSION_PAR]))
            {
                $_SESSION[self::SESSION_PAR] = array();
            }
            $_SESSION[self::SESSION_PAR][$name] = $elem;
        }

        private function AutoClean()
        {
            if (!isset($_SESSION[self::SESSION_PAR]))
            {
                return;
            }
            foreach ($_SESSION[self::SESSION_PAR] as $k => $v)
            {
                if ($v['countSessionPass'] < 1)
                {
                    unset($_SESSION[self::SESSION_PAR][$k]);
                }
                else
                {
                    $v['countSessionPass'] = $v['countSessionPass'] - 1;
                    $_SESSION[self::SESSION_PAR][$k] = $v;
                }
            }
        }

        public function __destruct()
        {
            if ($this->opened)
            {
                session_write_close();
            }
        }
    };
?>
