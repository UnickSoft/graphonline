<?php

    /**
     * Функции для валидации данных
     *
     * @author Zmi
     */


    function IsValidEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    function PhoneFilter($phone)
    {
        return preg_replace("~[^\+\*|^0-9]~is", '', $phone);
    }

    function IsValidPhone($phone)
    {
        $phone = PhoneFilter($phone);
        return strlen($phone) > 5;
    }

    function IsValidUrl($url)
    {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }
?>
