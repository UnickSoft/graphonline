<?php if (!isset($_GET["cacheFiles"]) && isset($_GET["target"])): ?>
<head>
<script src="/script/shared/config.js?v=<?= $g_config['engine_version'] ?>" ></script>
<script src="/script/shared/loader.js?v=<?= $g_config['engine_version'] ?>" ></script>
<script src="<?= $_GET["target"] ?>" ></script>
<script>
  setTimeout(
  () => {
      document.getElementById("state").innerHTML = "Saving files";
      const xhr = new XMLHttpRequest();      
      xhr.open("GET", "pack?cacheFiles=" + moduleLoader.syncLoaded.toString() + "&target=" + "<?=  $_GET["target"] ?>");
      xhr.send();
      xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          document.getElementById("state").innerHTML = "Finished <br>";
          document.getElementById("other_page").innerHTML = xhr.response;          
        } else {
          document.getElementById("state").innerHTML = "Error happends";
        }
      };
  }, 3000);
</script>
</head>


<body>
<div>
<h1>Update script cache</h1>

<h2>State: <span id="state">Loading</span></h2>
<p id="other_page"></p>
</div>
</doby>
<?php endif; ?>

<?php 
  if (!isset($_GET["target"])) {
    echo ("Error target is not set");
    return;
  }
?>