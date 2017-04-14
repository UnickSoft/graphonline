<?php

    require_once dirname(__FILE__) . "/Lib/CssPacker.php";
    require_once dirname(__FILE__) . "/Lib/HtmlPacker.php";
    require_once dirname(__FILE__) . "/Lib/JSMin.php";
    require_once dirname(__FILE__) . "/Lib/lessc.inc.php";


    /**
     * ExtraPacker - для склеивания и сжатия css и js файлов, а так же сжатия html-контента
     *
     * Выбирает все подключаемые js-ки (тоже с css-ками) собирает в 1 файл и пакует записывая файл info с информацией по запакованным файлам.
     * Поддерживает механизм транзакций.
     *
     * @author Zmi
     */
    class ExtraPacker
    {
        /**
         * Коэфициент сжатия для js/css при GZIP сжатии
         */
        const COEF_GZIP_COMPRESS        = 9;

        /**
         * Тег после которого должны встать ссылки на запакованные js и css файлы должен рассполагаться в head разделе документа
         */
        const TAG_EXTRAPACKER            = '<!-- extraPacker -->';

        const MEMORY_FOR_PACKING         = 67108864; // 64Mb

        private $addrJsCacheFileInfo;
        private $addrJsCacheFile;
        private $addrCssCacheFileInfo;
        private $addrCssCacheFile;
        private $addrNumJsTrans;
        private $addrNumCssTrans;
        private $flgHtmlPack;
        private $flgCssPack;
        private $flgJsPack;
        private $flgUseTransSystem;
        private $gzipPostfix             = '.gz';
        private $pCallBackFunctionJS     = NULL;
        private $pCallBackFunctionCSS    = NULL;
        private $pFuncGetAddrJsPackFile  = NULL;
        private $pFuncGetAddrCssPackFile = NULL;
        private $pGetPathJsFileFromUrl   = NULL;
        private $pGetPathCssFileFromUrl  = NULL;
        private $arrExeptions_js;
        private $arrExeptionsNotAdd_js;
        private $arrExeptions_css;
        private $arrExeptionsNotAdd_css;
        private $pFuncPreWriteCache;
        private $pFuncPostWriteCache;
        private $flgUseGZIP;
        private $flgBuffering;
        private $pPrepareEachFile       = NULL;

        // Только склеивать файлы
        const ONLY_MERGE_CSS = false;
        const ONLY_MERGE_JS  = false;

        // Перепаковывать каждый раз (удобно если = DEBUG_MODE)
        const ALWAYS_INDEPENDENT_PACK = false;
        const ALWAYS_REPACK           = false;

        private static function MakeDir($path)
        {
            if (is_dir($path))
            {
                return;
            }

            $path = explode("/", $path);
            if (count($path) == 1)
            {
                $path = explode("\\", $path[0]);
            }

            $d = "";
            foreach ($path as $dir)
            {
                $d .= $dir . "/";
                if ($d != "/" && $d != "/home/" && !is_dir($d))
                {
                    @mkdir($d, 0777);
                    @chmod($d, 0777);
                }
            }
        }

        private static function WriteFile($file, $b)
        {
            self::MakeDir(dirname($file));
            fclose(fopen($file, "a+"));
            $f = fopen($file,"r+");
            fwrite($f, $b);
            fclose($f);
            @chmod($file, 0777);
        }

        private function HtmlPack($html)
        {
            return Minify_HTML::minify($html);
        }

        private function PrepareJsContent($jsContent)
        {
            if ($this->pCallBackFunctionJS)
            {
                $jsContent = call_user_func($this->pCallBackFunctionJS, $jsContent);
            }

            return $jsContent;
        }

        private function PrepareCssContent($cssContent)
        {
            if ($this->pCallBackFunctionCSS)
            {
                $cssContent = call_user_func($this->pCallBackFunctionCSS, $cssContent);
            }

            return $cssContent;
        }

        private static function ReadFile($file, $flag = false)
        {
            $file = trim($file);
            if (!strlen(trim($file)))
            {
                return false;
            }

            if ($flag && $file[0] == "/")
            {
                $file = $_SERVER["DOCUMENT_ROOT"] . $file;
            }

            $b = false;
            if (strstr($file, "http://") == $file)
            {
                $f = fopen($file, "r");
                while (!feof($f))
                {
                    $b .= fread($f, 1024);
                }
            }
            elseif (file_exists($file) && is_readable($file))
            {
                $f = fopen($file, "r");
                $b = fread($f, filesize($file));
            }

            if (isset($f) && $f)
            {
                fclose($f);
            }

            return $b;
        }

        private function GetTrans($type)
        {
            if (file_exists($type == 'js' ? $this->addrNumJsTrans : $this->addrNumCssTrans))
            {
                $number = self::ReadFile($type == 'js' ? $this->addrNumJsTrans : $this->addrNumCssTrans);
                return (int)$number;
            }
            else
            {
                return 0;
            }
        }

        private function IncTrans($type)
        {
            self::WriteFile($type == 'js' ? $this->addrNumJsTrans : $this->addrNumCssTrans, time());
        }

        private function UnickList($arrFiles)
        {
            $arrRes = array();
            foreach ($arrFiles as $file)
            {
                $arrRes[$file['addr']] = $file;
            }

            return array_values($arrRes);
        }

        public static function MemInBytes($mem)
        {
            $lastSymbol = strtoupper(substr($mem, -1));
            $mem        = in_array($lastSymbol, array('K', 'M', 'G')) ? substr($mem, 0, -1) : $mem;
            switch ($lastSymbol)
            {
                case 'K':
                    $mem *= 1024;
                    break;
                case 'M':
                    $mem *= (1024 * 1024);
                    break;
                case 'G':
                    $mem *= (1024 * 1024 * 1024);
                    break;
            };
            return $mem;
        }

        private function WriteDataInCache($type, $arrFiles, $arrExeptions = array())
        {
            // Устанавливаем памяти на выполнение побольше т.к. будет идти создание pack-версии js/css
            global $g_config;
            $memInBytes = self::MemInBytes($g_config['phpIni']['memory_limit']);
            if (self::MEMORY_FOR_PACKING > $memInBytes)
            {
                ini_set('memory_limit', self::MEMORY_FOR_PACKING);
            }
            // Устанавлиаем время выполнения скрипта больше той что установлено сейчас на 30 секунд
            ini_set('max_execution_time', intval(intval($g_config['phpIni']['max_execution_time']) + 30));


            if ($this->pFuncPreWriteCache)
            {
                call_user_func($this->pFuncPreWriteCache);
            }

            if ($this->flgUseTransSystem)
            {
                $this->IncTrans($type);
            }

            if ($this->flgUseTransSystem)
            {
                $ext = '.' . $type;
                $t   = str_replace($ext, self::GetTrans($type) . $ext, $type == 'js' ? $this->addrJsCacheFile : $this->addrCssCacheFile);
                $type == 'js' ? $this->addrJsCacheFile = $t : $this->addrCssCacheFile = $t;
            }

            // Удаляем файлы из списка для запаковки которых уже нет на сервере
            foreach ($arrFiles as $k => $v)
            {
                if (!file_exists($v['addr']))
                {
                    unset($arrFiles[$k]);
                }
            }

            $packInfoAboutFiles = serialize($arrFiles);
            self::WriteFile($type == 'js' ? $this->addrJsCacheFileInfo : $this->addrCssCacheFileInfo, $packInfoAboutFiles);


            foreach ($arrExeptions as $k => $v)
            {
                $arrExeptions[$k] = call_user_func($type == 'js' ? $this->pGetPathJsFileFromUrl : $this->pGetPathCssFileFromUrl , $v);
            }

            $endl = $type == 'js' ? ";" : '';
            $fullExeptionContent = "";
            $fullContent         = "";
            foreach ($arrFiles as $file)
            {
                $file = $file['addr'];
                $curContent = file_get_contents($file);
                // Если стоит обработка каждого файла перед добавлением в сжатый архив
                if ($this->pPrepareEachFile)
                {
                    $curContent = call_user_func($this->pPrepareEachFile, $curContent, $file, $type);
                }
                if (in_array($file, $arrExeptions))
                {
                    $fullExeptionContent .= $curContent . $endl;
                }
                else
                {
                    $fullContent .= $curContent . $endl;
                }
            }

            if ($type == 'js')
            {
                if (!self::ONLY_MERGE_JS)
                {
                    $packed = JSMin::minify($fullContent);
                }
                else
                {
                    $packed = $fullContent;
                }
            }
            else
            {
                $less = new lessc();
                $less->importDir = BASEPATH . 'i/css/';
                $fullContent     = $less->parse($fullContent);

                if (!self::ONLY_MERGE_CSS)
                {
                    $cssPacker = new CssPacker($fullContent);
                    $packed    = $cssPacker->Pack();
                }
                else
                {
                    $packed = $fullContent;
                }
            }

            $packed   = $type == 'js' ? ($packed . $fullExeptionContent) : ($fullExeptionContent . $packed);
            $packed   = $type == 'js' ? $this->PrepareJsContent($packed) : $this->PrepareCssContent($packed); // Дополнительно обработать контент пользовательской функцией (если есть)

            self::WriteFile($type == 'js' ? $this->addrJsCacheFile : $this->addrCssCacheFile, $packed);
            self::WriteFile(($type == 'js' ? $this->addrJsCacheFile : $this->addrCssCacheFile) . $this->gzipPostfix, gzencode($packed, self::COEF_GZIP_COMPRESS));

            if ($this->pFuncPostWriteCache)
            {
                call_user_func($this->pFuncPostWriteCache);
            }
        }

        /**
         * Если массив now содержиться в storage то перепаковывать не надо т.к. все запакованные данные есть
         */
        private function NeedRePack($storage, $now)
        {
            if (self::ALWAYS_REPACK) return true;

            $ret = false;
            
            foreach ($now as $v)
            {
                if (!in_array($v, $storage))
                {
                    $ret = true;
                    break;
                }
            }
            return $ret;
        }

        private function JsPack($html)
        {
            $arrExeptions       = $this->arrExeptions_js;
            $arrExeptionsNotAdd = $this->arrExeptionsNotAdd_js;

            $s = preg_replace('/<!--.*-->/Uis', '', $html);
            $m = array();
            preg_match("~<head.*?>(.*?)</head>~is", $s, $m);
            if (empty($m))
            {
                return $html;
            }

            $s = $m[1];
            $m = array();
            preg_match_all("~<script.*?src=['\"](.*?).js['\"].*?></script>~", $s, $m);
            if (empty($m))
            {
                return $html;
            }

            $arrJsFiles = array();
            foreach ($m[1] as $k => $jsAddr)
            {
                $jsAddr     = $jsAddr . ".js";
                if (in_array($jsAddr, $arrExeptionsNotAdd))
                {
                    unset($m[1][$k]);
                    continue;
                }
                $html         = str_ireplace($m[0][$k], "", $html);
                $jsAddr       = call_user_func($this->pGetPathJsFileFromUrl, $jsAddr);
                $whenModify   = filemtime($jsAddr);
                $arrJsFiles[] = array('time' => $whenModify, 'addr' => $jsAddr);
            }

            $arrJsFiles = $this->UnickList($arrJsFiles);

            if (file_exists($this->addrJsCacheFileInfo))
            {
                $strInfoJsFiles = file_get_contents($this->addrJsCacheFileInfo);
                $arrInfoJsFiles = unserialize($strInfoJsFiles);
                if ($this->NeedRePack($arrInfoJsFiles, $arrJsFiles))
                {
                    if (self::ALWAYS_INDEPENDENT_PACK)
                    {
                        $arrInfoJsFiles = array();
                    }
                    $arrAllJsFiles = self::AUnique(self::AMerge($arrInfoJsFiles, $arrJsFiles));
                    self::WriteDataInCache('js', $arrAllJsFiles, $arrExeptions);
                }
                else
                {
                    if ($this->flgUseTransSystem)
                    {
                        $this->addrJsCacheFile = str_replace(".js", self::GetTrans('js') . ".js", $this->addrJsCacheFile);
                    }
                }
            }
            else
            {
                self::WriteDataInCache('js', $arrJsFiles , $arrExeptions);
            }

            $includeFileAddr = ($this->flgBuffering && $this->flgUseGZIP) ? $this->addrJsCacheFile.$this->gzipPostfix : $this->addrJsCacheFile;

            $inc  = call_user_func($this->pFuncGetAddrJsPackFile, $includeFileAddr);
            $html = str_ireplace(self::TAG_EXTRAPACKER, self::TAG_EXTRAPACKER . '<script type="text/javascript" charset="UTF-8" src="' . $inc . '"></script>', $html);

            return $html;
        }

        private static function AUnique($arr)
        {
            $a = array();
            foreach ($arr as $v)
            {
                $a[$v['addr']] = $v;
            }
            return array_values($a);
        }

        // По сути тот же самый array_merge
        private static function AMerge()
        {
            $arrs           = func_get_args();  // Массивы которые нужно слить в один
            $eaxA           = array();          // Результирующий массив
            $eaxAddrsOnly   = array();          // Массив только адресов к файлам (нужен просто для более локаничного вычисления)

            foreach ($arrs as $arr)
            {
                foreach ($arr as $canBeElem)
                {
                    // Если текущий файл уже был добавлен
                    if (in_array($canBeElem['addr'], $eaxAddrsOnly))
                    {
                        // То находим его и проверяем, если время его изменения в новом массиве больше старого то заменяем, иначе ничего не делаем
                        foreach ($eaxA as $k => $v)
                        {
                            if ($v['addr'] == $canBeElem['addr'])
                            {
                                if ($v['time'] < $canBeElem['time'])
                                {
                                    $eaxA[$k] = $canBeElem;
                                }
                            }
                        }
                    }
                    // Если же этого файла нет в массиве то добавляем его следущим
                    else
                    {
                        $eaxA[]             = $canBeElem;
                        $eaxAddrsOnly[]     = $canBeElem['addr'];
                    }
                }
            }
            return $eaxA;
        }

        private function CssPack($html)
        {
            $arrExeptions       = $this->arrExeptions_css;
            $arrExeptionsNotAdd = $this->arrExeptionsNotAdd_css;

            $s = preg_replace('/<!--.*-->/Uis', '', $html);
            $m = array();
            preg_match("~<head.*?>(.*?)</head>~is", $s, $m);
            if (empty($m))
            {
                return $html;
            }

            $s = $m[1];
            $m = array();
            preg_match_all("~<link.*?href=['\"](.*?)\.(css|less)['\"].*?>~", $s, $m);
            if (empty($m))
            {
                return $html;
            }

            $arrCssFiles = array();
            foreach ($m[1] as $k => $cssAddr)
            {
                $ext      = $m[2][$k];
                $cssAddr .= ".{$ext}";
                if (in_array($cssAddr, $arrExeptionsNotAdd))
                {
                    unset($m[1][$k]);
                    continue;
                }
                $html          = str_ireplace($m[0][$k], "", $html);
                $cssAddr       = call_user_func($this->pGetPathCssFileFromUrl, $cssAddr);
                $whenModify    = filemtime($cssAddr);
                $arrCssFiles[] = array('time' => $whenModify, 'addr' => $cssAddr);
            }

            $arrCssFiles = $this->UnickList($arrCssFiles);

            if (file_exists($this->addrCssCacheFileInfo))
            {
                $strInfoCssFiles = file_get_contents($this->addrCssCacheFileInfo);
                $arrInfoCssFiles = unserialize($strInfoCssFiles);
                if ($this->NeedRePack($arrInfoCssFiles, $arrCssFiles))
                {
                    if (self::ALWAYS_INDEPENDENT_PACK)
                    {
                        $arrInfoCssFiles = array();
                    }
                    $arrAllCssFiles = self::AUnique(self::AMerge($arrInfoCssFiles, $arrCssFiles));
                    self::WriteDataInCache('css', $arrAllCssFiles, $arrExeptions);
                }
                else
                {
                    if ($this->flgUseTransSystem)
                    {
                        $this->addrCssCacheFile = str_replace(".css", self::GetTrans('css') . ".css", $this->addrCssCacheFile);
                    }
                }
            }
            else
            {
                self::WriteDataInCache('css', $arrCssFiles , $arrExeptions);
            }

            $includeFileAddr = ($this->flgBuffering && $this->flgUseGZIP) ? $this->addrCssCacheFile.$this->gzipPostfix : $this->addrCssCacheFile;

            $inc  = call_user_func($this->pFuncGetAddrCssPackFile, $includeFileAddr);
            $html = str_ireplace(self::TAG_EXTRAPACKER, self::TAG_EXTRAPACKER . '<link rel="stylesheet" charset="UTF-8" type="text/css" href="' . $inc . '" />', $html);

            return $html;
        }

        private function CanUseGZIP()
        {
            $httpAcceptEncoding = isset($_SERVER['HTTP_ACCEPT_ENCODING']) ? $_SERVER['HTTP_ACCEPT_ENCODING'] : '';
            $hasGzip            = strstr($httpAcceptEncoding, 'gzip') !== false && extension_loaded('zlib');
            $canEncoding        = true;

            if (!isset($_SERVER['HTTP_USER_AGENT']))
            {
                return false;
            }

            $matches = array();
            if (stripos($_SERVER['HTTP_USER_AGENT'], 'safari') === false)
            {
                if (!strstr($_SERVER['HTTP_USER_AGENT'], 'Opera')
                        &&
                    preg_match('/^Mozilla\/4\.0 \(compatible; MSIE ([0-9]\.[0-9])/i', $_SERVER['HTTP_USER_AGENT'], $matches))
                {
                    if (isset($matches[1]))
                    {
                        $version = floatval($matches[1]);

                        if ($version < 6)
                        {
                            $canEncoding = false;
                        }

                        if ($version == 6 && !strstr($_SERVER['HTTP_USER_AGENT'], 'EV1'))
                        {
                            $canEncoding = false;
                        }
                    }
                }
            }
            else
            {
                $canEncoding = false;
            }

            return $canEncoding && $hasGzip;
        }

        /**
         * Функция запаковки контента в зависимости от параметров пакера
         *
         * @param string html-контент документа в котором содержится head с подключенными js-ками и css-ами
         */
        public function Pack($html)
        {
            // Если нету тега для замены ExtraPacker-ом то просто вернуть контент
            if (strpos($html, self::TAG_EXTRAPACKER) === false)
            {
                return $html;
            }

            if ($this->flgJsPack)
            {
                $html = $this->JsPack($html);
            }
            if ($this->flgCssPack)
            {
                $html = $this->CssPack($html);
            }
            if ($this->flgHtmlPack)
            {
                $html = $this->HtmlPack($html);
            }

            return $html;
        }

        /**
         * Конструктор объекта
         *
         * @param pointer $pGetPathJsFileFromUrl   - ссылка на функцию которая получит из url в src js-ки физический путь на диске к этому файлу
         * @param pointer $pGetPathCssFileFromUrl  - ссылка на функцию которая получит из url в href css-ки физический путь на диске к этому файлу
         * @param pointer $pFuncGetAddrJsPackFile  - ссылка на фунцию которая получит из path на диске спакованного js-файла url который подставится в новый src спакованной js-ки
         * @param pointer $pFuncGetAddrCssPackFile - ссылка на фунцию которая получит из path на диске спакованного css-файла url который подставится в новый href спакованной css-ки
         * @param pointer $pFuncPreWriteCache      - указатель на функцию выполняемую до начала работы по созданию нового кеш-файла (обычно блокировка сайта)
         * @param pointer $pFuncPostWriteCache     - указатель на функцию выполняемую по завершению работы и записи кеш-файла (обычно разблокировка сайта)
         * @param string $addrJsCacheFileInfo      - путь к временному файлу с информацией о спакованных js файлах в текущей транзакции
         * @param string $addrJsCacheFile          - путь к временному кеш файлу спакованных js-ок (GZIP будут с таким же именем только префикс из настроек добавится)
         * @param string $addrCssCacheFileInfo     - путь к временному файлу с информацией о спакованных css файлах в текущей транзакции
         * @param string $addrCssCacheFile         - путь к временному кеш файлу спакованных css-ок (GZIP будут с таким же именем только префикс из настроек добавится)
         * @param bool $flgHtmlPack                - флаг включения html-запаковки (могут быть проблемы если используете js-подстветки кода сайте т.к. в начале удалятся пробелы и табуляция)
         * @param bool $flgCssPack                 - флаг включения css-запаковки
         * @param bool $flgJsPack                  - флаг включения js-запаковки
         * @param array $arrExeptions_js           - массив исключений 1-го порядка (url-ы как и src), данные файлы прибавятся склеенному в конец, но не будут поковаться
         * @param array $arrExeptionsNotAdd_js     - массив исключений 2-го порядка - вообще не добавятся в запокованный файл
         * @param array $arrExeptions_css          - массив исключений 1-го порядка (url-ы как и href), данные файлы прибавятся склеенному в конец, но не будут поковаться
         * @param array $arrExeptionsNotAdd_css    - массив исключений 2-го порядка - вообще не добавятся в запокованный файл
         * @param bool $flgUseTransSystem          - использоватьс систему транзакций (в url запакованного файла ставится № говорящий о текущей транзакции)
         * @param string $addrNumJsTrans           - путь к файлу содержащий № js транзакций
         * @param string $addrNumCssTrans          - путь к файлу содержащий № css транзакций
         * @param bool $flgBuffering               - включить авто-определение GZIP буферизации для браузеров
         */
        public function __construct(
                                        $pGetPathJsFileFromUrl,
                                        $pGetPathCssFileFromUrl,
                                        $pFuncGetAddrJsPackFile,
                                        $pFuncGetAddrCssPackFile,
                                        $pFuncPreWriteCache     = NULL,
                                        $pFuncPostWriteCache    = NULL,
                                        $addrJsCacheFileInfo    = '',
                                        $addrJsCacheFile        = '',
                                        $addrCssCacheFileInfo   = '',
                                        $addrCssCacheFile       = '',
                                        $flgHtmlPack            = true,
                                        $flgCssPack             = true,
                                        $flgJsPack              = true,
                                        $arrExeptions_js        = array(),
                                        $arrExeptionsNotAdd_js  = array(),
                                        $arrExeptions_css       = array(),
                                        $arrExeptionsNotAdd_css = array(),
                                        $flgUseTransSystem      = true,
                                        $addrNumJsTrans         = '',
                                        $addrNumCssTrans        = '',
                                        $flgBuffering           = true,
                                        $pPrepareEachFile       = NULL,
                                        $pCallBackFunctionCSS   = NULL,
                                        $pCallBackFunctionJS    = NULL
                                    )
        {
            $this->pGetPathJsFileFromUrl   = $pGetPathJsFileFromUrl;
            $this->pGetPathCssFileFromUrl  = $pGetPathCssFileFromUrl;

            $this->pFuncGetAddrJsPackFile  = $pFuncGetAddrJsPackFile;
            $this->pFuncGetAddrCssPackFile = $pFuncGetAddrCssPackFile;

            $this->pFuncPreWriteCache      = $pFuncPreWriteCache;
            $this->pFuncPostWriteCache     = $pFuncPostWriteCache;

            $defaultDir                    = str_replace("\\", "/", dirname(__FILE__)) . '/tmp/';
            $this->addrJsCacheFileInfo     = $addrJsCacheFileInfo  ? $addrJsCacheFileInfo  : ($defaultDir . "js/cache/info.txt");
            $this->addrJsCacheFile         = $addrJsCacheFile      ? $addrJsCacheFile      : ($defaultDir . "js/cache/js.js");
            $this->addrCssCacheFileInfo    = $addrCssCacheFileInfo ? $addrCssCacheFileInfo : ($defaultDir . "css/cache/info.txt");
            $this->addrCssCacheFile        = $addrCssCacheFile     ? $addrCssCacheFile     : ($defaultDir . "css/cache/css.css");

            $this->flgHtmlPack             = $flgHtmlPack;
            $this->flgCssPack              = $flgCssPack;
            $this->flgJsPack               = $flgJsPack;

            $this->arrExeptions_js         = $arrExeptions_js;
            $this->arrExeptionsNotAdd_js   = $arrExeptionsNotAdd_js;

            $this->arrExeptions_css        = $arrExeptions_css;
            $this->arrExeptionsNotAdd_css  = $arrExeptionsNotAdd_css;

            $this->flgUseTransSystem       = $flgUseTransSystem;
            $this->addrNumJsTrans          = $addrNumJsTrans  ? $addrNumJsTrans  : ($defaultDir . 'js/cache/trans.txt');
            $this->addrNumCssTrans         = $addrNumCssTrans ? $addrNumCssTrans : ($defaultDir . 'css/cache/trans.txt');

            $this->flgBuffering            = $flgBuffering;
            $this->flgUseGZIP              = self::CanUseGZIP();

            $this->pPrepareEachFile        = $pPrepareEachFile;
            $this->pCallBackFunctionCSS    = $pCallBackFunctionCSS;
            $this->pCallBackFunctionJS     = $pCallBackFunctionJS;
        }
    };
?>
