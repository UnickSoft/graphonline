<?php

include ("./src/graphs_examples_func.php");

$examples = getAllExampleGraphs();

// Load from cvs

foreach ($examples as $item)
{
    $g_lang["m_keyWords"] .= ", " . $item["title_" . $g_lang["current_language"]];
}
?>