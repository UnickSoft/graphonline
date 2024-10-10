<?php

$tempFilename = "../tmp/pluginsList.txt";

if (isset($_GET["reset"]))
{
    unlink($tempFilename);
}

$res = "";
if (!file_exists($tempFilename)) 
{   
    $jsScripts = glob("../script/plugins/*.js");
    $res = json_encode($jsScripts);
    file_put_contents ($tempFilename, $res);
}
else
{
    $res = file_get_contents($tempFilename);
}


echo $res;

?>