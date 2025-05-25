<!DOCTYPE html>
<html lang="<?= LANG?>" dir="ltr">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=<?= $g_config['charset']?>" />
        <title><?= L('m_title')?></title>
        <link rel="icon" href="<?= Root('favicon.ico')?>" type="image/x-icon" />
        <link rel="shortcut icon" href="<?= Root('favicon.ico')?>" type="image/x-icon" />
        <meta http-equiv="cleartype" content="on">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <script src="<?= Root("i/js/dev/jquery-2.0.3.min.js")?>" ></script>

        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/dev/funcs.css')?>" />
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/dev/bootstrap3/bootstrap.css')?>" />

        <script src="<?= Root("i/js/dev/bootstrap3/bootstrap.min.js")?>" ></script>

        <!-- extraPacker -->
        <meta name="robots" content="noindex, nofollow">

        <script>
            // Global version needs to force reload scripts from server.
            globalVersion = <?= $g_config['engine_version'] ?>;
        </script>
    </head>
    <body>
        <?php IncludeCom('admin/admin_menu', array('menu' => $menu, 'logo' => $logo))?>
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <?= $content?>
                </div>
            </div>
        </div>

    </body>
</html>
