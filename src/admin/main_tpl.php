<?php

    if (!IS_ADMIN_AUTH)
    {
        $g_config['admin_menu']   = array();
        $g_config['admin_menu'][] = array
                            (
                                'link'  => SiteRoot('admin/login'),
                                'name'  => 'Вход',
                                'label' => 'Войти в административный раздел',
                                'css'   => '',
                                'list'  => array()
                            );
    }

    $menu = $g_config['admin_menu'];
    $logo = array
    (
        'href' => SiteRoot('admin'), 
        'logo' => '<span class="glyphicon glyphicon-home"></span>'
    );
?>