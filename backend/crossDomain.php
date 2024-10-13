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
    return strcasecmp($domain, $_SERVER['SERVER_NAME']) == 0;
}


?>