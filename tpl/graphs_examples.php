
<?php
 include ("cgi-bin/saveGraphHelpers.php");
?>
    <h1><?= L('head_no_tags')?></h1>
    <p><?= L('text')?></p>
        <div>
<?php for ($i = 0; $i < count($examples); $i++): ?>

<?php if ($i % 3 == 0): ?>
 <div class="row">
<?php endif ?>

  <div class="col-md-4">
    <div class="thumbnail">
      <a href="./?graph=<?= $examples[$i]["id"] ?>">
        <img src="/<?php echo (getImageFileName($examples[$i]["id"], true)); ?>" alt="<?= $examples[$i]["title_" . $g_lang["current_language"]] ?>" style="width:100%">
        <div class="caption">
          <p><?= $examples[$i]["title_" . $g_lang["current_language"]] ?></p>
        </div>
      </a>
    </div>
  </div>

<?php if ($i % 3 == 2): ?>
 </div>
<?php endif ?>

<?php endfor; ?>
    </div>
