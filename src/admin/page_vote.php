<?php

include ("cgi-bin/saveGraphHelpers.php");
include ("./src/vote_func.php");

$g_lang["current_language"] = "ru";
$voteTopics = getVoteTopics();
$votes = getVotes($voteTopics);
    
for ($i = 0; $i < count($voteTopics); $i++)
{
    $voteTopics[$i]["vote"] = $votes[$i]; 
}

?>