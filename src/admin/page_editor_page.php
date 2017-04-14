<?php

    global $g_arrLangs;

    $lang = Get('lang');
    $file = Get('page');
    
    $flashParam = new FlashParam();
    $msg = $flashParam->Get('msg');

    $showSEO = true;
    if (strpos($file, "autoload/") === 0 && $file !== "autoload/main.php")
    {
        $showSEO = false;
    }
    foreach ($g_config['page_editor']['seo_exceptions'] as $e)
    {
        if (strpos($file, $e) === 0)
        {
            $showSEO = false;
            break;
        }
    }

    $seoVars = array("m_title", "m_keyWords", "m_description");
    $srcPath = BASEPATH . "lang/{$lang}/{$file}";

    if (!is_readable($srcPath))
    {
        trigger_error("File {$srcPath} not found.", E_USER_ERROR);
    }

    $t       = $g_lang;
    $g_lang  = array();
        require $srcPath;
    $curLang = $g_lang;
    $g_lang  = $t;
    
    if (Post('___is_apply'))
    {
        $prefix  = "<?php\r\n\r\n";
        $postfix = "\r\n?>";

        $lines   = array();

        foreach ($curLang as $k => $v)
        {
            if (!in_array($k, $seoVars))
            {
                $v = $_POST[$k];

                //$v = addslashes($v); Нельзя применить потому что добавит слеш и к ' и к " а считываться это будет неверно
                $v = str_replace("\"", "\\\"", $v);

                $v = str_replace("\r", '', $v);
                $v = str_replace("\n", '\n', $v);
                $lines[] = '    $g_lang["' . $k . '"] = "' . $v . '";';
            }
        }
        if ($showSEO)
        {
            $lines[] = ''; // Вставляем пустую строку
            foreach ($seoVars as $s)
            {
                if (strlen(Post($s)))
                {
                    $lines[] = '    $g_lang["' . $s . '"] = "' . Post($s) . '";';
                }
                else if ($file == "autoload/main.php") // Если SEO переменная пустая, то пишем её только для autoload/main.php
                {
                    $lines[] = '    $g_lang["' . $s . '"] = "";';
                }
            }
        }

        $text = $prefix . implode("\r\n", $lines) . $postfix;

        $l2 = Post("___lang", $lang);
        $savePath = BASEPATH . "lang/{$l2}/{$file}";

        // Если нужно делать backup-ы изменений то сохраняем их
        if (is_readable($srcPath) && $g_config['page_editor']['with_backup'])
        {
            $fileTo = BASEPATH . "lang/backup/{$lang}/{$file}";
            $fileTo = str_replace(".php", "." . time() . ".php", $fileTo);
            FileSys::MakeDir(dirname($fileTo));
            copy($srcPath, $fileTo);
        }

        FileSys::MakeDir(dirname($savePath));
        $isWrite = FileSys::WriteFile($savePath, $text, false);
        $msg     = $isWrite ? MsgOk("Файл {$file} успешно сохранен на языке " . $g_arrLangs[$l2]["name"]) : MsgErr("Ошибка сохранения файла");

        if ($isWrite)
        {
            $flashParam->Set('msg', $msg);
            if (Post("___no_return") != "1")
            {
                Header("Location: " . SiteRoot("admin/page_editor"));
            }
            else
            {
                Header("Location: " . GetCurUrl("lang={$l2}"));
            }
            exit(0);
        }
        $msg = MsgErr("Неизвестная ошибка сохранения");
    }
?>
