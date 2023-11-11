
<?php IncludeCom('dev/bootstrap3')?>

<h1>Update script cache</h1>
<p>Click to each link to update cache. Don't forget change $g_config['engine_version'] version in file /core/config/main.php</p>
<ul>
<?php
  foreach ($cacheList as &$page) {
    $date = date('d.m.Y H:i:s', filemtime("./$page.cache"));
    echo ("<li><a href='pack?target=$page' target='_blank'>$page</a> $date</li>");
  }
?>
</ul>
