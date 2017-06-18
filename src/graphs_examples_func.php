<?php

function getAllExampleGraphs()
{
    global $g_config;
    
    $examples = array();

    // Load from cvs

    $examplesFilename = $g_config['graphSavePath'] . $g_config['graphExamplesFile'];

    if (($handle = fopen($examplesFilename, "r")) !== FALSE)
    {
        while (($data = fgetcsv($handle, 1000, "|")) !== FALSE)
        {
            $item = array();
            $item["id"] = $data[0];
            $item["title_ru"] = $data[1];
            $item["title_en"] = $data[2];
            //$g_lang["m_keyWords"] .= ", " . $item["title_" . $g_lang["current_language"]];
            $examples[] = $item;
        }
        fclose($handle);
    }
    
    return $examples;
}
?>