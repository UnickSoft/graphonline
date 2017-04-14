<?php

    //** Инициализация параметов

    require_once BASEPATH . 'core/config/main.php'; // Чтобы использовать $g_config['defaultComponent']
    $g_config['page_editor'] = array();
    
    // Какие страницы не показывать в списке страниц
    $g_config['page_editor']['exceptions'] = array();
    $g_config['page_editor']['exceptions'][] = 'admin/';
    
    // Для каких страниц не показывать SEO параметры
    $g_config['page_editor']['seo_exceptions'] = array();
    $g_config['page_editor']['seo_exceptions'][] = 'dev/';
    $g_config['page_editor']['seo_exceptions'][] = 'main_tpl/';
    $g_config['page_editor']['seo_exceptions'][] = 'main_tpl.php';

    // Нужно ли делать backup-ы страниц
    // Backup-ы сохраняются по адресу lang/backup/[язык]/[путь_к_файлу]/[имя_файла].[дата_сохранения].php
    $g_config['page_editor']['with_backup'] = true;

    // Дополнительная информация о некоторых страницах
    $g_config['page_editor']['labels'] = array();
    $g_config['page_editor']['labels']["autoload/"] = "Файлы в этой папке задают глобальные параметры";
    $g_config['page_editor']['labels']["autoload/main.php"] = "Файл для задания глобальных SEO параметров";
    $g_config['page_editor']['labels']["main_tpl.php"] = "Главный шаблон сайта";
    $g_config['page_editor']['labels']["404.php"]   = "Страница 404 Ошибки (Страница не найдена)";
    $g_config['page_editor']['labels']["_500.php"]  = "Страница 500 Ошибки (Внутренняя ошибки сервера)";
    $g_config['page_editor']['labels'][$g_config['defaultComponent']] = "Главная страница сайта";

    //** Инициализация меню

    require_once BASEPATH . 'core/config/admin_menu.php';

    GetQuery(); // Чтобы фунция SiteRoot корректно заработала нужно проинициализировать LANG в функции GetQuery
    $menu = array
            (
                'link'  => 'javascript:void(0)',
                'name'  => 'Страницы',
                'label' => 'Редактирование страниц',
                'css'   => '',
                'list'  => array
                           (
                               array('link' => SiteRoot('admin/page_editor'),     'name' => 'Все страницы', 'label' => 'Смотреть все страницы'),
                               array('link' => SiteRoot('admin/page_editor_add'), 'name' => 'Добавить',     'label' => 'Добавить новую страницу')
                           )
            );

    $g_config['admin_menu'][] = $menu;
?>