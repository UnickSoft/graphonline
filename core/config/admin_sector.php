<?php

    $g_config['admin_sector']                      = array();
    
    $g_config['admin_sector']['salt']              = "sal"; // Соль для хранения паролей в базе. По сути любой набор символов
    $g_config['admin_sector']['after_login_page']  = 'admin/home'; // Страница административного раздела, на которую мы попадём после авторизации
    $g_config['admin_sector']['after_logout_page'] = 'admin/login'; // Страница на которую мы попадем после выхода из админки 
    
    $g_config['admin_sector']['def_login']         = 'root'; // Логин для входа в административный раздел
    $g_config['admin_sector']['def_pwd']           = 'rootPass'; // Пароль для входа в административный раздел
?>
