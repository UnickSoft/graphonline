<?php
/*
   Function to save/open graph
   */

// Domains of service.
$domains = array(
    "graphonline.ru",
    "graphonline.top",
);

function isCurrentDomain($domain)
{
    return strtolower($domain) == strtolower($_SERVER['SERVER_NAME']);
}


?>