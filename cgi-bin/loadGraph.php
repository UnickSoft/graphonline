<?php

  include ("../core/config/main.php");
  include ("saveGraphHelpers.php");

  $name  = $_GET["name"];

  if (isValidName($name))
  {
  	echo (gzuncompress(file_get_contents(getXMLFileName($name))));
  }

  echo (""); 
?>
