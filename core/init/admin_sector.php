<?php

    require_once BASEPATH . 'core/init/db.php';

    // Изначальная папка нам может понадобится для CKEditor
    $g_config['extrapacker']['non_admin_dir'] = $g_config['extrapacker']['dir'];

    // Проверяем вход в админку и авторизацию
    $isAdminSector = (stripos(strtolower(GetQuery()), 'admin/') === 0 || GetQuery() === 'admin');
    if ($isAdminSector)
    {
        // Меняем папку куда будут складироваться css/js админки
        $g_config['extrapacker']['dir']     = 'extrapacker_admin';
        $g_config['extrapacker']['packCss'] = false;
        $g_config['mainTpl']                = 'admin/main_tpl';

        $g_adminAuth = new AdminModel();
        $g_adminAuth->ChkLogin();
        define('IS_ADMIN_AUTH', $g_adminAuth->IsAuth());
    }
    else
    {
        define('IS_ADMIN_AUTH', false);
    }
?>
