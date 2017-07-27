<?php
    
    include ("./src/donate.php");
    include ("./src/vote_func.php");
    
    $graphName = "";
    if (isset($_GET["graph"]))
    {
        $graphId = $_GET["graph"];
        
        $graphSampleListFile = $g_config['graphSavePath'] . $g_config['graphExamplesFile'];
        
        $graphSampleList = array();
        
        $cvsFile = fopen($graphSampleListFile, "r");
        
        if ($cvsFile)
        {
            while (($data = fgetcsv($cvsFile, 1000, "|")) !== FALSE)
            {
                if ($graphId == $data[0])
                {
                    $graphName = ($g_lang["current_language"] == "en") ? $data[2] : $data[1];
                    break;
                }
            }
            
            fclose($cvsFile);
        }
    }
    
    
    if (strlen($graphName) > 0)
    {
        $g_lang["m_title"] = $graphName;
        $g_lang["m_keyWords"] = $graphName . ", " . $g_lang["m_keyWords"];
        $g_lang["m_description"] = $g_lang["title_notg"] . ": " . $graphName;
    }

    $wasVote = (isset($_COOKIE["vote0"]));

    $voteTopics = getVoteTopics();
    for ($i = 0; $i < count($voteTopics); $i++)
    {
        $voteTopics[$i]["index"] = $i;
    }
    shuffle($voteTopics);
?>
