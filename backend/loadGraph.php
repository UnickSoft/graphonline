<?php

  include ("../core/config/main.php");
  include ("saveGraphHelpers.php");
  include ("crossDomain.php");

  $name  = $_GET["name"];
  $log = "";
  if (isValidName($name))
  {
    $content = file_get_contents(getXMLFileName($name));
    // Try to find on extarnal domains
    if (false === $content) 
    {
      foreach ($domains as $domain) 
      {
        if (!isCurrentDomain($domain))
        {
          $log .= "<!-- Search in $domain -->\n";
          $content = file_get_contents("https://" . $domain . "/" . getXMLFileName($name, true));
          if (false !== $content)
          {
            $content = $content;
            $log .= "<!-- Got from $domain -->\n";
            break;
          }
        }
      }
    }

  	echo (gzuncompress($content) . $log);
  }

  echo (""); 
?>
