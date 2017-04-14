
    <?php IncludeCom('dev/bootstrap3')?>

    <h1>Добавление страницы</h1>
    <p>В названии страницы допускаются только маленькие латинские буквы и цифры.</p>

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
