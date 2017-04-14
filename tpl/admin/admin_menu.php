    <?php IncludeCom('dev/bootstrap3')?>
    <head>
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/admin/admin_menu.css')?>" />
    </head>


    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation" id="admin-menu">
        <div class="container">

            <!-- Логотип и кнопка открытия меню сгруппированы для лучшего отображения на мобильных устройствах -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".nav-menu-collapse">
                    <span class="sr-only">Меню</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <?php if (!empty($logo)):?>
                    <a class="navbar-brand" href="<?= $logo['href']?>"><?= $logo['logo']?></a>
                <?php endif?>
            </div>

            <!-- Содержит ссылки и прочий контент который можно будет показать/скрывать на мобильных устройствах -->
            <div class="collapse navbar-collapse nav-menu-collapse">
                <ul class="nav navbar-nav">
                    <?php foreach ($menu as $v):?>
                        <li class="<?= (isset($v['list']) && count($v['list'])) ? "dropdown" : ''?><?= isset($v['css']) ? " {$v['css']}" : ''?>">
                            <a href="<?= $v['link']?>" title="<?= $v['label']?>"<?= (isset($v['list']) && count($v['list'])) ?' class="dropdown-toggle" data-toggle="dropdown"' : ''?>>
                                <?= $v['name']?>
                            </a>
                            <?php if (isset($v['list']) && count($v['list'])):?>
                                <ul class="dropdown-menu">
                                    <?php
                                        foreach ($v['list'] as $v)
                                        {
                                            if ($v === 'divider')
                                            {
                                                ?><li class="divider"></li><?php
                                            }
                                            elseif (isset($v['divider_name']))
                                            {
                                                ?><li class="dropdown-header"><?= $v['divider_name']?></li><?php
                                            }
                                            else
                                            {
                                                ?><li><a href="<?= $v['link']?>" title="<?= $v['label']?>"><?= $v['name']?></a></li><?php
                                            }
                                        }
                                    ?>
                                </ul>
                            <?php endif?>
                        </li>
                    <?php endforeach?>
                </ul>
            </div>
        </div>
    </nav>
