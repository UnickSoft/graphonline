<?php

  $matrix = $_GET["matrix"];
  $text   = $_GET["text"];

  $file = fopen("../tmp/faildMatrix.txt", "a");
  fprintf($file, "\n%s:\n", date("d.m.y"));
  fprintf($file, "FaildMatrix (%s):\n%s\n", $text, $matrix);
  fclose($file);
?>