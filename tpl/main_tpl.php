<!DOCTYPE html>
<html lang="<?= LANG?>" dir="ltr">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=<?= $g_config['charset']?>" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?= $title?></title>
        <?php if (!empty($description)):?><meta name="description" content="<?= $description?>" /><?php endif?>
        <?php if (!empty($keyWords)):?><meta name="keywords" content="<?= $keyWords?>" /><?php endif?>

        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="<?= Root('i/image/touch_icon/favicon_144x144.png')?>" />
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?= Root('i/image/touch_icon/favicon_114x114.png')?>" />
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?= Root('i/image/touch_icon/favicon_72x72.png')?>" />
        <link rel="apple-touch-icon-precomposed" href="<?= Root('i/image/touch_icon/favicon_57x57.png')?>" />

        <link rel="icon" href="<?= Root('favicon.ico')?>" type="image/x-icon" />
        <link rel="shortcut icon" href="<?= Root('favicon.ico')?>" type="image/x-icon" />

        <meta http-equiv="cleartype" content="on">

        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/dev/funcs.css')?>" />

        <script src="<?= Root("i/js/dev/jquery-2.0.3.js")?>" ></script>

<!--        <?php IncludeCom('dev/jquery')?> -->
        <?php IncludeCom('dev/font_ptsans')?>
        <?php IncludeCom('dev/fontawesome')?>

        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/bootstrap.css')?>" />
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/main_tpl.css')?>" />

        <meta name="yandex-verification" content="66de0a468e59b81b" />

        <!-- Следущая строчка нужна для обозначения места вставки объеденённых css/js файлов. Её не следует удалять.-->
        <!-- extraPacker -->

    </head>
    <body>
        <div class="container page-wrap" id="mainContainer">
<!--            <div class="header"> -->
<nav class="navbar navbar-default" id="navigation">
    <div class="container-fluid">
    <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="<?= SiteRoot()?>"><span class="fa fa-sitemap fa-fw"></span> Graph Online</a>
    </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
<ul class="nav navbar-nav navbar-right">
<?php foreach ($menu as $m):?>
<?php if (!isset($m["list"])) { ?>
<li class="<?= $m["is_active"] ? "active" : ""?>"><a href="<?= $m["link"]?>"><?= $m["title"]?></a></li>
<?php }	else { ?>
<li class="dropdown"> <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false"> <?= $m["title"]?> <span class="caret"></span></a>
<ul class="dropdown-menu">
<?php foreach ($m["list"] as $subm):?>
<li><a href="<?= $subm["link"]?>"><?= $subm["title"]?></a></li>
<?php endforeach?>
</ul>
</li>
<?php } ?>
<?php endforeach?>
<li class="dropdown">
<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><img src="<?= Root("i/image/flags/enru.png")?>" alt="<?= $langInfo["name"]?>"> <?= L('lang')?> <span class="caret"></span></a>
<ul class="dropdown-menu">
<?php foreach($g_arrLangs as $lang => $langInfo):?>
<li><a href="<?= ChangeLang($lang, GetCurUrl())?>" title="<?= $langInfo["name"]?>" class="<?= $lang == LANG ? "selected" : ""?>"><img src="<?= Root("i/image/flags/{$lang}.png")?>" alt="<?= $langInfo["name"]?>"> <?= $langInfo["name"]?></a></li>
<?php endforeach?>
</ul>
</li>
</ul>


        </div>
    </div>
</nav>
            <div class="content">
                <?= $content?>
            </div>

        <!-- Футер приходится обрамить в .container, потому что у него position:absolute и он занимает всю ширину игнорируя паддинги родителя -->

        <footer class="footer" id="footer" >
           <div class="container hidden-phone" id="footerContent">
                    <p>© <?= L('footer_info')?> 2015 - <?= date("Y")?></p>
           </div>
        </footer>
        </div>



<!-- Yandex.Metrika counter -->
<script type="text/javascript">
(function (d, w, c) {
    (w[c] = w[c] || []).push(function() {
        try {
            w.yaCounter25827098 = new Ya.Metrika({id:25827098,
                    clickmap:true,
                    accurateTrackBounce:true});
        } catch(e) { }
    });

    var n = d.getElementsByTagName("script")[0],
        s = d.createElement("script"),
        f = function () { n.parentNode.insertBefore(s, n); };
    s.type = "text/javascript";
    s.async = true;
    s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

    if (w.opera == "[object Opera]") {
        d.addEventListener("DOMContentLoaded", f, false);
    } else { f(); }
})(document, window, "yandex_metrika_callbacks");
</script>
<noscript><div><img src="//mc.yandex.ru/watch/25827098" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->

	<script>
		if (typeof preLoadPage == 'function')
		{  
			preLoadPage();
		}
	</script>
	<script src="<?= Root("i/js/dev/bootstrap3/bootstrap.min.js")?>" >
        	        $('.dropdown-toggle').dropdown();
	</script>
	<script>
		if (typeof postLoadPage == 'function')
		{  
			postLoadPage();
		}		
	</script>              
    </body>
</html>
