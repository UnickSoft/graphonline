<?php
/*
  Sample page
*/

$mymail = "soft_support@list.ru";

header('Content-type: text/html; charset=utf-8');

$text = "New Algorithm!\n" . $_GET["text"];

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/plain; charset=utf-8' . "\r\n";
$headers .= "From: support@graphonline.ru \r\n";

echo ($headers);
echo ($text);

mail($mymail, "New algorithm", $text, $headers);

?>