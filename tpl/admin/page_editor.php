    <h1>Редактирование страниц сайта</h1>
    <p>
        Если кнопка редактирования страницы на нужном языке отсутствует, 
        то нужно выбрать редактирование этой страницы на языке по умолчанию (или другом доступном языке),
        заполнить её нужным текстом и в выпадающем списке "Сохранять для языка" выбрать нужный язык.
    </p>
    <?= $msg?>
    <form action="<?= GetCurUrl()?>" method="post">
        <div class="table-responsive">
            <table class="table table-bordered table-striped table-condensed">
                <?php foreach($all as $path => $pageLangs):?>
                    <tr>
                        <td class="path">
                            <?php for ($i = 0; $i < substr_count(substr($path, 0, -1), '/'); ++$i):?>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                            <?php endfor;?>
       
                            <?php if (substr($path, -1) == "/"):?>
                                <span class="glyphicon glyphicon-folder-open"></span> &nbsp;
                                <em><?= basename($path)?></em>
                            <?php else:?>
                                <span class="glyphicon glyphicon-file"></span> &nbsp;
                                <strong><?= str_replace(".php", "", basename($path))?></strong>
                            <?php endif;?>
       
                            <?php if (isset($g_config['page_editor']['labels'][$path])):?>
                                &nbsp; <span class="label label-default"><?= $g_config['page_editor']['labels'][$path]?></span>
                            <?php endif;?>
                        </td>
                        <?php foreach ($g_arrLangs as $lang => $langInfo):?>
                            <td width=1>
                                <nobr>
                                    <?php if (substr($path, -1) != "/" && in_array($lang, $pageLangs)):?>
                                        <a href="<?= SiteRoot("admin/page_editor_page&lang=" . $lang . "&page=" . urlencode($path))?>" class="btn btn-sm btn-primary" title="Редактировать страницу на этом языке">
                                            <?= $langInfo['name']?>
                                        </a>
                                        <a target="_blank" href="<?= SiteRoot("{$lang}/" . str_replace(".php", "", $path))?>" class="btn btn-sm btn-default" title="Проверить страницу на этом языке">
                                            <span class="glyphicon glyphicon-open"></span>
                                        </a>
                                    <?php endif;?>
                                </nobr>
                            </td>
                        <?php endforeach;?>
                        <td width=1> <!-- @todo Добавить защиту от дурака (запрет на удаление файлов в dev, autoload и т.д.) -->
                            <button class="btn btn-sm btn-danger" name="remove_page" value="<?= str_replace(".php", "", $path)?>" onclick="return confirm('Удалить данную страницу?')">
                                <span class="glyphicon glyphicon-trash"></span>
                            </button>
                        </td>
                    </tr>
                <?php endforeach;?>
            </table>
        </div>
    </form>
