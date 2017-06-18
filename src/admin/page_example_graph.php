<?php

include ("cgi-bin/saveGraphHelpers.php");
include ("./src/graphs_examples_func.php");

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

$examplesFilename = $g_config['graphSavePath'] . $g_config['graphExamplesFile'];

if (isset($_POST["source_id"]))
{
    $sourceFileFullname = getXMLFileName($_POST["source_id"], true);
    if (strlen($sourceFileFullname) > 0)
    {
        $graph = gzuncompress(file_get_contents($sourceFileFullname));

        if (strlen($graph) > 0)
        {
            if (saveGraphXML($graph, $_POST["dest_id"], true))
            {
                $imageSource = getImageFileName($_POST["image"], true);
                $imageDest   = getImageFileName($_POST["dest_id"], true);
                
                if ( copy($imageSource, $imageDest))
                {
                    
                    if (($handle = fopen($examplesFilename, "a")) !== FALSE)
                    {
                        $line = array();
                        $line[] = $_POST["dest_id"];
                        $line[] = $_POST["title_ru"];
                        $line[] = $_POST["title_en"];
                        
                        fputcsv($handle, $line, "|");
                        fclose($handle);
                        
                        $msg = "added";
                    }
                    else
                    {
                        $msg = "Cannot open data base";
                    }
                }
                else
                {
                    $msg = "Cannot copy image";
                }
            }
            else
            {
                $msg = "Cannot save dest file";
            }
        }
        else
        {
            $msg = "Cannot open source file";
        }
    }
    else
    {
        $msg = "Wrong source name";
    }
}


$examples = getAllExampleGraphs();

?>