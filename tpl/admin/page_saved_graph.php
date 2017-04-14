
    <?php IncludeCom('dev/bootstrap3')?>

    <h1>Сохранённые файлы</h1>
    <div>
        <h2>Сохранённые графы</h2>
        <p>Всего сохранёных графов - <?= $totalGraphCount ?> шт</p>
        <p>Общий размер сохранённых графов - <?= $totalGraphSize ?> Кб</p>
        <p>За последние полгода сохранено - <?= $ageGraph / $totalGraphCount * 100 ?> %</p>
        <h2>Сохранённые изображения</h2>
        <p>Всего сохранёных изображений - <?= $totalImages ?> шт</p>
        <p>Общий размер сохранённых изображений - <?= $totalImagesSize ?> Кб</p>
        <p>За последние полгода сохранено - <?= $ageImage / $totalImages * 100 ?> %</p>
    </div>

    <form action="<?= GetCurUrl()?>" method="post" class="form-horizontal" role="form">
        <input type="hidden" name="is_add_page" value="1">
        <div class="form-group">
            <div class="col-lg-offset-2 col-lg-6">
                <?= $msg?>
            </div>
        </div>
        <div class="form-group">
            <label for="inputName" class="col-lg-2 control-label">Название страницы</label>
            <div class="col-lg-6">
                <input type="text" class="form-control" id="inputName" autocomplete="on" name="name" value="<?= Post("name")?>" placeholder="Только маленькие латинские буквы и цифры">
            </div>
        </div>
        <div class="form-group">
            <div class="col-lg-offset-2 col-lg-6">
                <button type="submit" class="btn btn-primary">Добавить</button>
            </div>
        </div>
    </form>
