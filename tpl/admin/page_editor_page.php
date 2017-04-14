    <?php IncludeCom('dev/bootstrap3')?>
    <?php IncludeCom("dev/ckeditor4_head")?>


    <h1>Редактируем страницу <span class="label label-primary"><?= $file?></span> на языке <span class="label label-success"><?= $g_arrLangs[$lang]["name"]?></span></h1>
    <form action="<?= GetCurUrl()?>" role="form" method="post" <?= Uploader::FORM_LOAD?>>
        <?php if (count($g_arrLangs) > 1):?>
            <div class="well">
                <label for="inputLang">Сохранить для языка</label>
                <select class="form-control" name="___lang" id="inputLang">
                    <?php foreach($g_arrLangs as $k => $v):?>
                        <option value="<?= $k?>"  <?= Post("___lang", $lang) == $k ? "selected" : ""?> ><?= $g_arrLangs[$k]['name']?></option>
                    <?php endforeach;?>
                </select>
            </div>
        <?php endif;?>
        <h2>Задайте новые значения переменным:</h2>
        <input type="hidden" name="___is_apply" value="1">
        <?= $msg?>
        <?php foreach ($curLang as $k => $v):?>
            <?php if (!in_array($k, $seoVars)):?>
                <div class="form-group">
                    <label for="input_<?= $k?>"><?= $k?>:</label>
                    <?php if (strlen($v) == strlen(strip_tags($v)) || substr($k, -strlen("_no_tags")) == "_no_tags" || substr($k, -strlen("_notg")) == "_notg"):?>
                        <textarea id="input_<?= $k?>" class="form-control" name="<?= $k?>"><?= Post($k, $v)?></textarea>
                    <?php else:?>
                        <?php IncludeCom("dev/richtext", array
                              (
                                  "name"  => $k, 
                                  "value" => Post($k, $v, M_HTML_FILTER_OFF | M_XSS_FILTER_OFF),
                                  "mode"  => "full"
                              ));
                         ?>
                    <?php endif;?>
                </div>
            <?php endif;?>
        <?php endforeach;?>

        <?php if ($showSEO):?>
            <h3>Задайте новые значения для SEO параметров:</h3>
            <p>
                SEO параметры нужны для продвижения сайта в интернете. Если вы не знаете, что в них вписать, то просто оставьте эти поля нетронутыми.<br>
                Помните, что если для страницы сайта не задан <em>title</em>, то он будет скопирован из тега <em>h1</em>.
            </p>

            <div class="form-group">
                <label for="inputTitle">Title:</label>
                <textarea id="inputTitle" class="form-control" name="m_title"><?= Post('m_title', @$curLang['m_title'])?></textarea>
            </div>
            <div class="form-group">
                <label for="inputKeywords">Key words:</label>
                <textarea id="inputKeywords" class="form-control" name="m_keyWords"><?= Post('m_keyWords', @$curLang['m_keyWords'])?></textarea>
            </div>
            <div class="form-group">
                <label for="inputDesc">Description:</label>
                <textarea id="inputDesc" class="form-control" name="m_description"><?= Post('m_description', @$curLang['m_description'])?></textarea>
            </div>
        <?php endif;?>
        <button class="btn btn-primary">
            <span class="glyphicon glyphicon-save"></span> Сохранить
        </button>
        <button class="btn btn-primary" name="___no_return" value="1">
            <span class="glyphicon glyphicon-ok"></span> Сохранить и продолжить редактировать
        </button>
        <a class="btn btn-default" href="<?= SiteRoot("admin/page_editor")?>">
            <span class="glyphicon glyphicon-ban-circle"></span> Отмена
        </a>
    </form>
