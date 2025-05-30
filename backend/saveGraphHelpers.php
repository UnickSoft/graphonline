<?php
/*
   Function to save/open graph
   */

// Only latic.
function isValidName($name)
{
	return preg_match("(^[autosave_]*+[a-zA-Z]+[_test]*$)", $name);
}

function isAutoSave($name)
{
	return strpos($name, 'autosave_') === 0;
}

function getXMLFileName($graphName, $fromRoot=false)
{
    global $g_config;
    
    $auto_save = isAutoSave($graphName);

	$dirName = ($fromRoot ? "" : "../") . $g_config['graphSavePath'] . ($auto_save ? 'autosave' : substr($graphName, 0, 2));

	if(!file_exists($dirName))
	{
        mkdir($dirName, 0777, true);
	}

	return $dirName . "/$graphName.xml";
}


function getImageFileName($graphName, $fromRoot=false)
{
    global $g_config;
    
    $dirName = ($fromRoot ? "" : "../") . $g_config['graphSavePath'] . substr($graphName, 0, 2);

    if(!file_exists($dirName))
    {
        mkdir($dirName, 0777, true);
    }

    return $dirName . "/$graphName.png";
}

function getSvgFileName($graphName, $fromRoot=false)
{
    global $g_config;
    
    $dirName = ($fromRoot ? "" : "../") . $g_config['graphSavePath'] . substr($graphName, 0, 2);

    if(!file_exists($dirName))
    {
        mkdir($dirName, 0777, true);
    }

    return $dirName . "/$graphName.svg";
}

    
function saveGraphXML($graph, $name, $fromRoot = false)
{
    $res = false;
    if (isValidName($name))
    {
        $file = fopen(getXMLFileName($name, $fromRoot), "w");
        if ($file)
        {
            fprintf($file, "%s", gzcompress($graph, -1));
            fclose($file);
            $res = true;
        }
    }
    return $res;
}


?>