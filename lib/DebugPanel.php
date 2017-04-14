<?php

    /**
     * Информационная панель
     *
     * @author Zmi
     */
    class DebugPanel
    {
        const PHP_INI_USER   = 1;
        const PHP_INI_PERDIR = 2;
        const PHP_INI_SYSTEM = 4;
        const PHP_INI_ALL    = 7;

        public function Files()
        {
            $files  = get_included_files();
            $stat   = array();
            foreach ($files as $file)
            {
                $stat[] = array('file'  => $file,
                                'size'  => FileSys::Size($file),
                                'lines' => count(file($file)));
            }
            return $stat;
        }

        public function TotalFileSize()
        {
            $total = 0;
            foreach (get_included_files() as $f)
            {
                $total += filesize($f);
            }
            $size         = sprintf("%u", $total);
            $filesizename = array(" Bytes", " Kb", " Mb", " Gb", " Tb", " Pb", " Eb", " Zb", " Yb");
            return $size ? round($size / pow(1024, ($i = floor(log($size, 1024)))), 2) . $filesizename[$i] : '0 Bytes';
        }

        public function TotalFileLines()
        {
            $total = 0;
            foreach (get_included_files() as $f)
            {
                $total += count(file($f));
            }
            return $total;
        }

        public function Db()
        {
            return class_exists('MyDataBaseLog') ? MyDataBaseLog::Render() : '';
        }

        public function MemoryUsage()
        {
            $size         = sprintf("%u", memory_get_usage());
            $filesizename = array(" Bytes", " Kb", " Mb", " Gb", " Tb", " Pb", " Eb", " Zb", " Yb");
            return $size ? round($size / pow(1024, ($i = floor(log($size, 1024)))), 2) . $filesizename[$i] : '0 Bytes';
        }

        public static function ShowPhpIniAccess($access)
        {
            switch ($access)
            {
                case self::PHP_INI_USER:
                    $ret = 'scripts';
                    break;
                case self::PHP_INI_PERDIR:
                    $ret = 'php.ini | .htaccess | httpd.conf';
                    break;
                case 6:
                    $ret = 'php.ini | .htaccess | httpd.conf';
                    break;
                case self::PHP_INI_SYSTEM:
                    $ret = 'php.ini | httpd.conf';
                    break;
                case self::PHP_INI_ALL:
                    $ret = 'anywhere';
                    break;
                default:
                    $ret = '-';
            };
            return $ret;
        }
    };
?>