<?php

    $admin = new AdminModel(NULL, true);

    // Если человек уже залогинен, то редиректим его с этой страницы
    if ($admin->IsAuth())
    {
        header("Location: " . SiteRoot($g_config['admin_sector']['after_login_page']));
        exit();
    }

    $msg = '';
    if (Post('is_login'))
    {
        $login = Post('login');
        $pwd   = Post('pwd');
        $errs  = array();

        if (empty($login))
        {
            $errs[] = "Впишите логин";
        }
        if (empty($pwd))
        {
            $errs[] = "Впишите пароль";
        }

        if (!count($errs))
        {
            $isLogin = $admin->Login($login, $admin->MakeHash($pwd));
            if ($isLogin)
            {
                header("Location: " . SiteRoot($g_config['admin_sector']['after_login_page']));
                exit();
            }
            else
            {
                $errs[] = "Неверный логин или пароль";
            }
        }

        $msg = MsgErr(implode('<br>', $errs));
    }
?>
