<?php

    // Этот файл должен вызываться, когда меню уже заполнено. Добавляем в конце кнопку 'выход':
    $g_config['admin_menu'][]   = array
                        (
                            'link'  => SiteRoot('admin/logout'),
                            'name'  => '<span class="glyphicon glyphicon-log-out"></span>',
                            'label' => 'Выйти',
                            'css'   => '',
                            'list'  => array()
                        );

    // Выделяем нужный элемент в меню:
    foreach ($g_config['admin_menu'] as $k => $v)
    {
        // Выделять если это текущая страница или страница в ее выподающем списке
        $links = array($v['link']);
        foreach ($v['list'] as $subLink)
        {
            if (is_array($subLink))
            {
                $links[] = $subLink['link'];
            }
        }

        if (in_array(GetCurUrl(), $links))
        {
            $v['css'] = empty($v['css']) ? 'active' : "{$v['css']} active";
            $g_config['admin_menu'][$k] = $v;
        }
    }
?>
