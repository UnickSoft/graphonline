
    <?php IncludeCom('dev/bootstrap3')?>

    <h1>Голосование</h1>

    <div>
        <? for ($i = 0; $i < count($voteTopics); $i++): ?>
        <p><?= $voteTopics[$i]["title"] ?> - <?= $voteTopics[$i]["vote"] ?></p>
        <?php endfor; ?>
    </div>
