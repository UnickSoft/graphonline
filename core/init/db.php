<?php

    /**
     * Инициализация подключей ко всем БД и подключение моделей
     *
     * @author Zmi
     */


    require_once BASEPATH . 'lib/Db/Db.php';
    new Db();
?>