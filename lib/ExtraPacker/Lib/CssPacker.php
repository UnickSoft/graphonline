<?php

    require_once dirname(__FILE__) . "/cssmin-v1.0.1.b3.php";


    /**
     * Пакеровщик css файлов
     *
     * @author Zmi
     */
    class CssPacker
    {
        private $content;

        public function __construct($c)
        {
            $this->content = $c;
        }

        public function Pack()
        {
            return cssmin::minify($this->content);
        }
    };
?>