<?php

    /**
     * Класс настроечных функций ExtraPacker-а
     *
     * @author Zmi
     */
    class ExtraPacker_Config
    {
        private static function GetDocRoot()
        {
            $path = BASEPATH;
            if (SITE_IN_DIR)
            {
                $path = substr($path, 0, strrpos($path, SITE_IN_DIR));
            }
            return $path;
        }

        private static function GetPathFromUrl($url)
        {
            $url = substr($url, strpos($url, SITE_ROOT) + strlen(SITE_ROOT));
            return self::GetDocRoot() . $url;
        }

        public static function GetPathJsFileFromUrl($url)
        {
            return self::GetPathFromUrl($url);
        }

        public static function GetPathCssFileFromUrl($url)
        {
            return self::GetPathFromUrl($url);
        }

        private static function GetAddrPackFile($path)
        {
            return str_replace(self::GetDocRoot(), '/', $path);
        }

        public static function GetAddrJsPackFile($path)
        {
            return self::GetAddrPackFile($path);
        }

        public static function GetAddrCssPackFile($path)
        {
            return self::GetAddrPackFile($path);
        }

        public static function ChangeCssUrl($m)
        {
            // Если сайт в папке то надо добавить эту папку в пути поиска
            $docRoot = str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']);
            $docRoot = substr($docRoot, -1, 1) == '/' ? substr($docRoot, 0, -1) : $docRoot;

            $dir     = str_replace($docRoot, '', BASEPATH);
            $dir     = trim($dir, '/');
            $dir     = empty($dir) ? '' : "/{$dir}";

            $curUrl = $dir . $GLOBALS['__engineExtraPackerChangeCssUrl__curUrl__'];
            $url = isset($m[1]) ? trim($m[1], '\'"') : '';
            if ($url)
            {
                // Это не Less-переменная, не путь вида http://google.com/ и не url(data:image/png;base64,....
                if (strpos($url, "@") === false && strpos($url, "://") === false && strpos($url, "data:") !== 0)
                {
                    // Это не абсолютный адрес
                    if ($url[0] !== '/')
                    {
                        $url = "$curUrl/$url";
                    }
                    // Если это абсолтный путь но к корню это сайта, но сайт запущен из каталога то переделываем пути так что бы они были как-будто из каталога
                    elseif (strlen($dir) && strpos($url, $dir) === false)
                    {
                        $url = $dir . $url;
                    }
                }
            }

            return $url;
        }

        public static function ChangeCssUrl_Url($url)
        {
            $url = self::ChangeCssUrl($url);
            return "url('$url')";
        }

        public static function ChangeCssUrl_Src($url)
        {
            $url = self::ChangeCssUrl($url);
            return "src='$url'";
        }

        /**
         * Предобработка каждого файла перед помещением в общий архив
         *
         * @param string $content
         * @param string $file
         * @param string $type либо js либо css
         */
        public static function PrepareEachFile($content, $path, $type)
        {
            global $g_config;
            $url = str_replace(BASEPATH, '/', $path);
            if ($type == 'css')
            {
                // Меняем пути к файлам
                $GLOBALS['__engineExtraPackerChangeCssUrl__curUrl__'] = dirname($url);
                $content = preg_replace_callback("~url\((.*?)\)~is", array(__CLASS__, "ChangeCssUrl_Url"), $content);
                unset($GLOBALS['__engineExtraPackerChangeCssUrl__curUrl__']);
            }
            return $content;
        }

        /**
         * Подготовка спакованного js-контента перед записью в файл
         *
         * Данная функция по умолчанию дописывает пустой обработчик ошибок в начало js файла если это production
         */
        public static function PrepareAllJs($content)
        {
            global $g_config;
            
            $noErrorsCode = '';

            // Если не debug режим то выключаем javascript ошибки
            if (!$g_config['phpIni']['display_errors'])
            {
                ob_start();
                    ?>
                        function __MyErrHandler(msg)
                        {
                            return true;
                        }

                        window.onerror = __MyErrHandler;
                    <?php
                $noErrorsCode = ob_get_clean();
            }
            return $noErrorsCode . $content;
        }

        /**
         * Подготовка всего спакованного контента css перед записью в файл
         *
         * Пример использования:
         *      Пусть у нас галит ф-я переписывания путей к картинкам в css, и она ставит BASEPATH тогда можно сделать что-то вроде такого:
         *      return str_replace("/home/Sites/test.com/i/", "/i/")
         */
        public static function PrepareAllCss($content)
        {
            return $content;
        }
    };
?>