<?php

    /**
     * Класс для работы с каталогами и файлами в системе
     *
     * @author Zmi
     */
    class FileSys
    {
        private function __construct()
        {

        }

        public static function FilenameSecurity($str)
        {
            $bad = array(
                            "../",
                            "./",
                            "<!--",
                            "-->",
                            "<",
                            ">",
                            "'",
                            '"',
                            '&',
                            '$',
                            '#',
                            '{',
                            '}',
                            '[',
                            ']',
                            '=',
                            ';',
                            '?',
                            "%20",
                            "%22",
                            "%3c",   // <
                            "%253c", // <
                            "%3e",   // >
                            "%0e",   // >
                            "%28",   // (
                            "%29",   // )
                            "%2528", // (
                            "%26",   // &
                            "%24",   // $
                            "%3f",   // ?
                            "%3b",   // ;
                            "%3d"    // =
                        );

            return stripslashes(str_replace($bad, '', $str));
        }

        /**
         * Удаляет каталог с его содержимым
         */
        public static function DeleteDir($directory)
        {
            $dir = opendir($directory);
            while (($file = readdir($dir)))
            {
                if (is_file($directory . '/' . $file))
                {
                    unlink($directory . '/' . $file);
                }
                elseif (is_dir($directory . '/' . $file) && ($file != '.') && ($file != '..'))
                {
                    self::DeleteDir($directory . '/' . $file);
                }
            }
            closedir($dir);
            return rmdir($directory);
        }

        /**
         * Создать каталоги по указанному пути
         */
        public static function MakeDir($path)
        {
            if (is_dir($path))
            {
                return;
            }

            $path = explode('/', $path);
            if (count($path) == 1)
            {
                $path = explode('\\', $path[0]);
            }

            $d = '';
            foreach ($path as $dir)
            {
                $d .= $dir . '/';
                if (!in_array($d, array('/', '/home/')) && !is_dir($d))
                {
                    mkdir($d, 0777);
                    @chmod($d, 0777);
                }
            }
        }

        /**
         * Cоздать и записать содержимое в файл по указанному пути, если каталоги указанные в пути не созданы, то их создадут
         */
        public static function WriteFile($file, $data, $flgAppend = false)
        {
            $file = self::FilenameSecurity($file);
            if (!$flgAppend)
            {
                if (file_exists($file))
                {
                    @unlink($file);
                }
            }

            self::MakeDir(dirname($file));
            fclose(fopen($file, 'a+b'));
            $f   = fopen($file, $flgAppend ? 'a+b' : 'r+b');
            $ret = fwrite($f, $data);
            fclose($f);
            @chmod($file, 0777);
            return $ret;
        }

        /**
         * Читает файл по переданному пути
         */
        public static function ReadFile($file)
        {
            $file = self::FilenameSecurity(trim($file));

            if (!strlen(trim($file)))
            {
                return false;
            }

            $b = false;
            if (strstr($file, 'http://') == $file)
            {
                $f = fopen($file, 'rb');
                while (!feof($f))
                {
                    $b .= fread($f, 1024);
                }
            }
            elseif (file_exists($file) && is_readable($file))
            {
                $f = fopen($file, 'rb');
                $size = filesize($file);
                $b = ($size == 0) ? "" : fread($f, $size);
            }

            if (isset($f) && $f)
            {
                fclose($f);
            }

            return $b;
        }

        /**
         * Получает список файлов каталога со всеми вложенными каталогами
         *
         * @param string $dir
         * @return array
         */
        public static function ReadList($dir)
        {
            if (!is_readable($dir))
            {
                return array();
            }

            $list = array();
            $dir  = in_array(substr($dir, -1, 1), array('/', '\\')) ? $dir : "$dir/";
            $hDir = opendir($dir);
            while(($f = readdir($hDir)) !== false)
            {
                if ($f != '.' && $f != '..')
                {
                    $path = $dir . $f;
                    $list[$f] = is_dir($path) ? self::ReadList($path) : $path;
                }
            }
            closedir($hDir);
            return $list;
        }

        /**
         * Возвращает размер файла в виде: Kb Mb Gb
         */
        public static function Size($file)
        {
            $size         = sprintf("%u", filesize($file));
            $filesizename = array(" Bytes", " Kb", " Mb", " Gb", " Tb", " Pb", " Eb", " Zb", " Yb");
            return $size ? round($size / pow(1024, ($i = floor(log($size, 1024)))), 2) . $filesizename[$i] : '0 Bytes';
        }
    };
?>