<?php

    /**
     * Модель для авторизации администратора
     */
    class AdminModel
    {
        const REMEMBER_PERIOD = 604800; // Время хранения авторизации (в секундах)

        public function MakeHash($pwd)
        {
            global $g_config;
            return md5($pwd . $g_config['admin_sector']['salt']);
        }

        public function IsAuth()
        {
            global $g_config;
            $login    = isset($_COOKIE['auto_admin_auth_login'])    ? $_COOKIE['auto_admin_auth_login']    : '';
            $pwd_hash = isset($_COOKIE['auto_admin_auth_pwd_hash']) ? $_COOKIE['auto_admin_auth_pwd_hash'] : '';

            return $login    == $g_config['admin_sector']['def_login'] && 
                   $pwd_hash == $this->MakeHash($g_config['admin_sector']['def_pwd']);
        }

        // Авторизует пользователя, что бы при будущих обращениях он проходил как авторизованный при успехе вернёт true и запомнит что авторизован, иначе false
        public function Login($login, $pwd_hash)
        {
            global $g_config;
            if (empty($login) || empty($pwd_hash))
            {
                trigger_error("Can not login: login or pwd_hash are empty!", E_USER_ERROR);
            }

            $ret = false;
            if ($login    == $g_config['admin_sector']['def_login'] && 
                $pwd_hash == $this->MakeHash($g_config['admin_sector']['def_pwd']))
            {
                setcookie('auto_admin_auth_login',    $login,     time() + self::REMEMBER_PERIOD, '/', DOMAIN_COOKIE);
                setcookie('auto_admin_auth_pwd_hash', $pwd_hash,  time() + self::REMEMBER_PERIOD, '/', DOMAIN_COOKIE);
                $ret = true;
            }
            return $ret;
        }

        // Проверяет авторизацию, и если человек не авторизован, то редиректим
        public function ChkLogin()
        {
            global $g_config;
            $query = strtolower(GetQuery());

            if (!$this->IsAuth())
            {
                if (SiteRoot($query) !== SiteRoot($g_config['admin_sector']['after_logout_page']))
                {
                    header("Location: " . SiteRoot($g_config['admin_sector']['after_logout_page']));
                    exit();
                }
            }
        }

        public function Logout()
        {
            setcookie('auto_admin_auth_login',    '', -1, '/', DOMAIN_COOKIE);
            setcookie('auto_admin_auth_pwd_hash', '', -1, '/', DOMAIN_COOKIE);
        }
    };
?>