    <h1>Вход в административный раздел</h1>
    <form action="<?= GetCurUrl()?>" method="post" class="form-horizontal" role="form">
        <input type="hidden" name="is_login" value="1">
        <div class="form-group">
            <div class="col-lg-offset-2 col-lg-6">
                <?= $msg?>
            </div>
        </div>
        <div class="form-group">
            <label for="inputLogin" class="col-lg-2 control-label">Логин</label>
            <div class="col-lg-6">
                <input type="text" class="form-control" id="inputLogin" autocomplete="on" name="login" value="<?= Post("login")?>" placeholder="Введите ваш логин">
            </div>
        </div>
        <div class="form-group">
            <label for="inputPassword" class="col-lg-2 control-label">Пароль</label>
            <div class="col-lg-6">
                <input type="password" class="form-control" id="inputPassword" autocomplete="on" name="pwd" placeholder="Введите ваш пароль">
            </div>
        </div>
        <div class="form-group">
            <div class="col-lg-offset-2 col-lg-6">
                <button type="submit" class="btn btn-primary">Войти</button>
            </div>
        </div>
    </form>
