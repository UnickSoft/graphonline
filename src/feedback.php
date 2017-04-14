<?
/*
  Sample page
*/

print_r ($_POST);


$dateFile = "./tmp/dateFeedback.txt";
$mymail   = "soft_support@list.ru";

$fh = fopen($dateFile, "r"); 
$lastTime = 0;
$lastTime = fread($fh, filesize($dateFile)); 
fclose($fh);
$secondsForPost = 5;

$error = "";
$accept = "";

if (time() - $lastTime > $secondsForPost)
{
  $text = $_POST['message'];
  $name = $_POST['name'];
    
  $headers  = 'MIME-Version: 1.0' . "\r\n";
  $headers .= 'Content-type: text/plain; charset=utf-8' . "\r\n";
  $headers .= "From: support@freeanalogs.ru \r\n";

  if (mail($mymail, "Graph feedback", $text . "\n\n" . $name, $headers))
  {
    $accept = "Ваше предложение отправлено модераторам.<br>";	  
  }
  else
  {
    $error = "Неопределенная ошибка. Свяжитесь с администратором по адресу soft_support@list.ru<br>";
  }

  $fh = fopen($dateFile, "w"); 
  fwrite($fh, time()); 
  fclose($fh);

  $STitle     = "";
  $softDetail = "";
  $webSite    = "";
  $TTitle     = "";
}
else
{
  echo (3);
  $error = "Сервер перегружен, повторите попытку через 30 секунд.<br>";
}

echo ($error);
echo ($accept);

?>