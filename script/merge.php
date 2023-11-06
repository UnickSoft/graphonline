<h1>Update cache</h1>

<?php
  $cacheList =  array(
  "/script/pages/editor/api/index.js",
	"/script/pages/create_graph_by_edge_list/api/index.js", 
	"/script/pages/create_graph_by_incidence_matrix/api/index.js",
	"/script/pages/create_graph_by_matrix/api/index.js"
	);

  echo ("<ul>");
  foreach ($cacheList as &$page) {
    $date = date('d.m.Y H:i:s', filemtime("../$page.cache"));
    echo ("<li><a href='pack.php?target=$page' target='_blank'>$page</a> $date</li>");
  }
  echo ("</ul>");
?>

