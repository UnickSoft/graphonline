<?php

    /**
     * Класс для запомининия прошло url
     *
     * @author Zmi
     */
    class BackUrl
    {
        public $flashParam; // Я знаю что public плохо, но мне все равно

        public function __construct()
        {
            $this->flashParam = new FlashParam();
        }

        public function __destruct()
        {
            $this->flashParam->Set('back_url', GetCurUrl());
        }
    };
?>