
    <head>
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/donate.css')?>" />
    </head>

    <h1><?= L('title_notg')?></h1>

    <h2>Почему мы собираем средства</h2>
    <p><img src="<?= Root('i/image/cat.jpg')?>" alt="Поддержите граф онлайн" style="float:left; padding: 12px"> <?= L('text')?></p>

    <div>
    <span ></span>
    </div>

    <h2>Безопасная форма для отправки средств от Яндекса</h2>
    <div>
    <iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/donate.xml?account=41001394497131&quickpay=donate&payment-type-choice=on&mobile-payment-type-choice=on&default-sum=30&targets=%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B8%D1%82%D0%B5+%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82+%D0%93%D1%80%D0%B0%D1%84+%D0%9E%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD.&target-visibility=on&project-name=&project-site=&button-text=01&successURL=" width="522" height="90"></iframe>
    </div>
<!--
    <h2>Текущий прогресс</h2>
    <div class="ProgressBar" style="height:96px">
        <div class="ProgressBarFill" style="width:<?= intval($donates / $totalDonate * 100) ?>%;"></div>
        <span class="ProgressBarText" style="top:-90px"><p>Cбор средств для добавления новых алгоритмов.</p><p>Осталось собрать- <?= max($totalDonate - $donates, 0) ?> руб</p><p>Последний перевод - <?= $lastDonate ?> руб.</p></span>
    </div>
-->
    <h2>Расскажите про нас</h2>
<? $sharePageURL = $_SERVER['SERVER_NAME'] . "/donate";?>
<ul class="share-buttons">
	<li><a href="http://vkontakte.ru/share.php?url=http://<?= $sharePageURL ?>&text=<?= L('m_description') ?>" target="_blank" title="Share on Vkontate"><i class="fa fa-vk fa-2x"></i></a></li>
	<li><a href="https://www.facebook.com/sharer/sharer.php?u=http://<?= $sharePageURL ?>&t=<?= L('m_description') ?>" target="_blank" title="Share on Facebook"><i class="fa fa-facebook-square fa-2x"></i></a></li>
	<li><a href="https://twitter.com/intent/tweet?source=http://<?= $sharePageURL ?>&text=<?= L('m_description') ?> http://<?= $sharePageURL ?>" target="_blank" title="Tweet"><i class="fa fa-twitter-square fa-2x"></i></a></li>
	<li><a href="https://plus.google.com/share?url=http://<?= $sharePageURL ?>" target="_blank" title="Share on Google+"><i class="fa fa-google-plus-square fa-2x"></i></a></li>
	<li><a href="http://www.linkedin.com/shareArticle?mini=true&url=http://<?= $sharePageURL ?>&title=<?= L('m_description') ?>&summary=<?= L('m_description') ?> &source=http://<?= $sharePageURL ?>?graph=XXXX" target="_blank" title="Share on LinkedIn"><i class="fa fa-linkedin-square fa-2x"></i></a></li>
	<li><a href="mailto:?subject=<?= L('m_description') ?>&body=http://<?= $sharePageURL ?>" target="_blank" title="Email"><i class="fa fa-envelope fa-2x"></i></a></li>
</ul>

    <?php IncludeCom('main_tpl/page_btns')?>
