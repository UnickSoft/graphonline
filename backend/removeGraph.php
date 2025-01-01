<?php

  include ("../core/config/main.php");
  include ("saveGraphHelpers.php");

  $name  = $_GET["name"];

  if (isValidName($name) && isAutoSave($name))
  {
    $xmlFileName = getXMLFileName($name);
    if (file_exists($xmlFileName))
    {
      unlink($xmlFileName);
    }
    echo ("OK");
  }
  else
  {
    echo ("Error");
  }
?>
