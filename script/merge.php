<?php
$outputFilename = 'example.js';

unlink($outputFilename);

file_put_contents($outputFilename, file_get_contents("utils.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("texts.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("point.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("EdgeModel.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("VertexModel.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("BaseVertex.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("BaseEdge.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("BaseVertexDrawer.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("BaseEdgeDrawer.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("BaseBackgroundDrawer.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("Algorithms.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("EventHandlers.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("GraphMLCreator.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("Graph.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("EnumVertices.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("Application.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("main.js"), FILE_APPEND);
file_put_contents($outputFilename, file_get_contents("BaseTraversal.js"), FILE_APPEND);

if (file_exists($outputFilename))
{
  echo ("File exists");
}
else
{
  echo ("File not exists");
}

?>