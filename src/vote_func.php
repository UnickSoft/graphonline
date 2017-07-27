<?php

function getVoteTopics()
{
    global $g_config, $g_lang;
    
    $voteTopics = array();
    $voteTopicsFile = $g_config['voteTopics'] . $g_lang["current_language"];
    $csvTopicFile = fopen($voteTopicsFile, "r");
    if ($csvTopicFile)
    {
        while (($data = fgetcsv($csvTopicFile, 1000, "|")) !== FALSE)
        {
            $topic["title"] = $data[0];
            $topic["desc"]  = $data[1];                
            $voteTopics[] = $topic;
        }

        fclose($csvTopicFile);  
    }
    
    return $voteTopics;
}

function getVotes($voteTopics)
{
    global $g_config;
    
    $votes = array();
    for ($i = 0; $i < count($voteTopics); $i++)
    {
       $votes[] = 0; 
    }

    $voteFile = fopen($g_config['vote'], "r");
    if ($voteFile)
    {
        while (($line = fgets($voteFile)) !== false)
        {
            $votes[intval($line)] ++;
        }
    }

    fclose($voteFile);
    
    return $votes;
}
?>