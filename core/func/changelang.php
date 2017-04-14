<?php

    /**
     * Фукнция для смены языка на нужный
     *
     * @param $lang - Язык на который нужно произвести смену
     * @param $url  - Страница на которой нужно произвести смену
     */
    function ChangeLang($lang, $url)
    {
        $url = _StrReplaceFirst("/?q=", "/", $url);

        global $g_arrLangs, $g_config;
        $lang      = in_array($lang, array_keys($g_arrLangs)) ? $lang : LANG;

        $siteRoot  = SiteRoot();
        $uri       = _StrReplaceFirst($siteRoot, '', $url);

        $dir  = SITE_IN_DIR ? (SITE_IN_DIR . '/') : '';
        $lang = $lang == DEF_LANG ? '' : ($lang . '/');
        $ret  = $lang || $uri ? "/{$dir}?q={$lang}{$uri}" : $dir;
        $ret  = empty($ret) ? '/' : $ret;

        return $g_config['useModRewrite'] ?
                _StrReplaceFirst("/?q=", "/", strpos($ret, '?') === false ? _StrReplaceFirst('&', '?', $ret) : $ret) :
                $ret;
    }
?>