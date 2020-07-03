
    <h1><?= L('head_no_tags')?></h1>
    <p><?= L('text')?></p>
    <div>
<?php $newsList = L('newsList'); ?>
<?php for ($i = 0; $i < count($newsList); $i++): ?>
        <div>
            <h2><?= $newsList[$i]["title"] ?></h2>
        <p>
            <?= $newsList[$i]["text"] ?>
        </p>
        <p style="text-align: right;">
            <?= $newsList[$i]["autor"] ?> <small><?= $newsList[$i]["date"] ?></small>
        </p>
        </div>
<?php endfor; ?>
