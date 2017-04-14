<?php

    /**
     * Класс ведения статистики в файл
     *
     * Предназначен для создания файлов логирования
     *
     * @author Zmi
     */
    class FileLogger
    {
        private static $loggers = array();

        private $time;
        private $aLog;
        private $fPath;
        private $fHandle;

        const LOG_SEPARATOR      = PHP_EOL;
        const MAXSIZE_LOGFILE    = 10485760; // 10mb
        const FLG_CREATE_ARCHIVE = true;

        private function __construct($fPath, $flgAppendData = true)
        {
            $this->fPath = $fPath;
            $dirs        = dirname($fPath);

            if ($dirs)
            {
                FileSys::MakeDir($dirs);
            }

            if (!$flgAppendData)
            {
                fclose(fopen($fPath, 'a+'));
                $this->fHandle = fopen($fPath, 'r+');
                ftruncate($this->fHandle, 0);
            }
            else
            {
                if (file_exists($fPath))
                {
                    if (filesize($fPath) >= self::MAXSIZE_LOGFILE)
                    {
                        if (self::FLG_CREATE_ARCHIVE)
                        {
                            rename($fPath, $fPath . '-archive[' . date('Y-m-d') . ']');
                        }
                        fclose(fopen($fPath, 'a+'));
                        $this->fHandle = fopen($fPath, 'r+');
                        ftruncate($this->fHandle, 0);
                    }
                    else
                    {
                        $this->fHandle = fopen($fPath, 'a+');
                    }
                }
                else
                {
                    $this->fHandle = fopen($fPath, 'a+');
                }
            }

            $this->time   = microtime(true);
            $this->aLog   = array();
        }

        /**
         * Создает новый объект-логгер
         *
         * @static
         * @param $fPath - путь к файлу куда необходимо записать лог
         */
        public static function Create($fPath)
        {
            if (isset(self::$loggers[$fPath]))
            {
                return self::$loggers[$fPath];
            }
            else
            {
                return self::$loggers[$fPath] = new self($fPath);
            }
        }

        private function Add($str, $msgType)
        {
            $this->aLog[]  = "--- {$msgType}: " . date('Y-m-d H:i:s') . " ---" . PHP_EOL .
                             $str . PHP_EOL . 
                             "------------------------------------" . PHP_EOL;
            $this->Flush();
        }

        public function Error($str)
        {
            $this->Add($str, 'Error');
        }

        public function Ok($str)
        {
            $this->Add($str, 'Ok');
        }

        public function Message($str)
        {
            $this->Add($str, 'Message');
        }

        public function Flush()
        {
            $sLog = '';
            if (sizeof($this->aLog))
            {
                $sLog = implode(self::LOG_SEPARATOR, $this->aLog);
            }

            if (empty($sLog))
            {
                return;
            }

            $sLog .= self::LOG_SEPARATOR;
            fputs($this->fHandle, $sLog);
            $this->aLog = array();
        }

        public function __destruct()
        {
            $this->Flush();
            fclose($this->fHandle);
        }
    };
?>