<?php
    $totalDonate = trim(file_get_contents($g_config['donateTotal']));

    $lines   = file($g_config['donateTransactions']);
    $donates = 0;
    $lastDonate = 0;

    foreach ($lines as $line)
    {
      $donates = $donates + $line;
      $lastDonate = $line;
    }
?>
