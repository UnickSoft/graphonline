
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
        <div class="form-group">
            <div class="col-lg-offset-2 col-lg-6">
                <button name="submit" type="submit" class="btn btn-primary" value="delete1YImages">Удалить изображения старше 1 года</button>
            </div>
        </div>
    </form>

    <div>
        <p><?= $msg ?></p>
    </div>