<?php

    global $g_arrLangs;
    $flashParam = new FlashParam();
    $msg = $flashParam->Get('msg');

    $removePage = trim(Post("remove_page"));
    if ($removePage)
    {
        //if (!is_file(BASEPATH . "src/" . $removePage . ".php") && 
        //    !is_file(BASEPATH . "tpl/" . $removePage . ".php"))
        //{
        //    $msg = MsgErr("Страница '{$removePage}' не существует.");
        //}
        //else
        //{
            $removedCount = 0;
            if (is_file(BASEPATH . "src/" . $removePage . ".php"))
            {
                unlink(BASEPATH . "src/" . $removePage . ".php");
                $removedCount++;
            }
            if (is_file(BASEPATH . "tpl/" . $removePage . ".php"))
            {
                unlink(BASEPATH . "tpl/" . $removePage . ".php");
                $removedCount++;
            }
            foreach ($g_arrLangs as $lang => $v)
            {
                if (is_file(BASEPATH . "lang/{$lang}/" . $removePage . ".php"))
                {
                    unlink(BASEPATH . "lang/{$lang}/" . $removePage . ".php");
                    $removedCount++;
                }
            }
            $msg = $removedCount == 0 ? 
                        MsgErr("Не удалось удалить страницу '{$removePage}'.") : 
                        MsgOk("Страница '{$removePage}' была удалена (всего {$removedCount} файлов).");
            $_POST = array();
        //}
    }

    $all = array();

    // Считываем все возможные файлы для всех языков
    foreach ($g_arrLangs as $lang => $v)
    {
        $list = array();
        PageEditorGetListFilesDirs(BASEPATH . "lang/" . $lang, $list);
        // В $list у нас массив вида:
        // Array
        // (
        //     [0] => Z:/home/zcomp.page_editor/www/lang/en/404.php
        //     [1] => Z:/home/zcomp.page_editor/www/lang/en/autoload/
        //     [2] => Z:/home/zcomp.page_editor/www/lang/en/autoload/main.php
        // )

        foreach ($list as $l)
        {
            // Превращаем 'Z:/home/zcomp.page_editor/www/lang/en/autoload/main.php' в 'autoload/main.php'
            $l = str_replace(BASEPATH . "lang/" . $lang . "/", "", $l);

            foreach ($g_config['page_editor']['exceptions'] as $e)
            {
                if (strpos($l, $e) === 0)
                {
                    continue 2;
                }
            }

            if (empty($all[$l]))
            {
                $all[$l] = array();
            }
            $all[$l][] = $lang;
        }
    }
    ksort($all);

    // Теперь в $all у нас есть асоциативный массив вида:

    // dev/
    //   en
    //   ru
    // dev/404.php:
    //   en
    //   ru
    // default.php:
    //   ru
?>
