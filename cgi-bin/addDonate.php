<?php

    include ("../core/config/main.php");
    
    //if ("RdukIxdb0Lxc+uNhgfFXb7ll" == $_POST["notification_secret"])
    {
        $file = fopen("../" . $g_config['donateTransactions'], "a");
        if ($file)
        {
            fprintf($file, "%d\n",  $_POST["amount"]);
            fclose($file);
        }
    }
    
    
?>
