<?
  include ("saveGraphHelpers.php");

  $graph = file_get_contents("php://input");
  $name  = $_GET["name"];

  if (isValidName($name))
  {
  	$file = fopen(getXMLFileName($name), "w");
  	fprintf($file, "%s", gzcompress($graph, -1));
  	fclose($file);
	echo ("OK");
  }
?>
