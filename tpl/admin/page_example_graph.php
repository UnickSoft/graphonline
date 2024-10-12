
    <?php IncludeCom('dev/bootstrap3')?>

    <h1>Примеры графов</h1>

    <form action="<?= GetCurUrl()?>" method="post" class="form-horizontal" role="form" class="form-inline">
        <div class="form-group">
            <div class="col-lg-offset-2 col-lg-6">
                <?= isset($msg) ? $msg : ""?>
            </div>
        </div>

        <div class="form-group">
            <label for="inputName" class="col-lg-2 control-label">ID graph исходного графа</label>
            <input type="text" id="inputName" autocomplete="on" name="source_id" value="<?= Post("source_id")?>">
        </div>

        <div class="form-group">
            <label for="inputName" class="col-lg-2 control-label">ID graph конечного графа</label>
            <input type="text" id="inputName" autocomplete="on" name="dest_id" value="<?= Post("dest_id")?>">
        </div>

        <div class="form-group">
            <label for="inputName" class="col-lg-2 control-label">Русское название</label>
            <input type="text" id="inputName" autocomplete="on" name="title_ru" value="<?= Post("title_ru")?>">
        </div>

        <div class="form-group">
            <label for="inputName" class="col-lg-2 control-label">Английское название</label>
            <input type="text" id="inputName" autocomplete="on" name="title_en" value="<?= Post("title_en")?>">
        </div>

        <div class="form-group">
            <label for="inputName" class="col-lg-2 control-label">Изображение</label>
            <input type="text" id="inputName" autocomplete="on" name="image" value="<?= Post("image")?>">
        </div>

        <div class="form-group">
            <div class="col-lg-offset-2 col-lg-6">
                <button type="submit" class="btn btn-primary">Добавить</button>
            </div>
        </div>
    </form>

    <div>
<?php for ($i = 0; $i < count($examples); $i++): ?>
        <p>
        <?= $examples[$i]["title_ru"] ?> -
        <?= $examples[$i]["title_en"] ?> -
        <a href="/?graph=<?= $examples[$i]["id"] ?>" target="_blank">http://graphonline.ru/?graph=<?= $examples[$i]["id"] ?></a>
        </p>
<?php endfor; ?>
    </div>
    <h3>Example files list</h3>
    <div>
<?php for ($i = 0; $i < count($examples); $i++): ?>
        <?= getXMLFileName($examples[$i]["id"], true) ?> <?= getImageFileName($examples[$i]["id"], true) ?>
<?php endfor; ?>
    </div>

