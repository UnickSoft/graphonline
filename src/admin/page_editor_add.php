<?php

    global $g_arrLangs;
    $flashParam = new FlashParam();
    $msg = $flashParam->Get('msg');

    // Добавление страницы
    if (Post("is_add_page"))
    {
        $newPage = trim(Post("name"));
        if (empty($newPage) || $newPage != preg_replace("~[^a-z0-9_]~", '', $newPage))
        {
            $msg = MsgErr("Некорректные символы");
        }
        else if (is_readable(BASEPATH . "src/{$newPage}.php") || 
                 is_readable(BASEPATH . "tpl/{$newPage}.php") || 
                 is_readable(BASEPATH . "lang/" . DEF_LANG . "/{$newPage}.php"))
        {
            $msg = MsgErr("Файл уже существует");
        }
        else
        {
            $path1 = BASEPATH . "tpl/{$newPage}.php";

            $text  = "";
            $text .= "\n    <h1><?= L('head_no_tags')?></h1>";
            $text .= "\n    <p><?= L('text')?></p>\n";
           
            FileSys::MakeDir(dirname($path1)); // На всякий случай
            $isWrite1 = FileSys::WriteFile($path1, $text, false);

            //**

            $path2 = BASEPATH . "lang/" . DEF_LANG . "/{$newPage}.php";
           
            $text  = "";
            $text .= "<?php\n\n";
            $text .= "    $" . "g_lang['head_no_tags'] = 'Страница наполняется';\n"; 
            $text .= "    $" . "g_lang['text'] = '<p>Извините, но страница находится в стадии наполнения. Приносим свои изменения.</p>';\n";
            $text .= "?>";
           
            FileSys::MakeDir(dirname($path2)); // На всякий случай
            $isWrite2 = FileSys::WriteFile($path2, $text, false);

            
            if (!$isWrite1 || !$isWrite2 || !is_readable($path1) || !is_readable($path2))
            {
                $flashParam->Set('msg', MsgErr("Неизвестная ошибка"));
                @unlink($path1);
                @unlink($path2);
            }
            else
            {
               $flashParam->Set('msg', MsgOk("Страница '{$newPage}' успешно создана"));
               Header("Location: " . SiteRoot("admin/page_editor"));
               exit(0);
            }
        }
    }
?>
