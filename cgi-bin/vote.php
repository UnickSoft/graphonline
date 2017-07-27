<?
    include ("../core/config/main.php");

    if (!isset($_COOKIE["vote0"]))
    {
        $index  = $_GET["index"];

        setcookie("vote0", "true", time() + 3600 * 24 * 90, '/'); // 3 month

        $file = fopen("../" . $g_config['vote'], "a");
        fprintf($file, "%d\n", $index);
        fclose($file);
        echo ("OK");
    }
?>
