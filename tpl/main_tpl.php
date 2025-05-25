<!DOCTYPE html>
<html lang="<?= LANG?>" dir="ltr">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=<?= $g_config['charset']?>" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?= $title?></title>
        <?php if (!empty($description)):?><meta name="description" content="<?= $description?>" /><?php endif?>
        <?php if (!empty($keyWords)):?><meta name="keywords" content="<?= $keyWords?>" /><?php endif?>

        <meta property="og:title" content="<?= $title ?>" />
        <meta property="og:type" content="website" />
        <?php $page_url = 'https://' . $_SERVER['HTTP_HOST'] . explode('?', $_SERVER['REQUEST_URI'], 2)[0] . (!empty($_GET["graph"]) ? '?graph=' . $_GET["graph"] : "" ); ?>        
        <meta property="og:url" content="<?= $page_url ?>" />
        <?php if (!empty($g_lang["m_description_long"])):?><meta property="og:description" content="<?= $g_lang["m_description_long"] ?>"><?php endif?>

        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="<?= Root('i/image/touch_icon/favicon_144x144.png')?>" />
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?= Root('i/image/touch_icon/favicon_114x114.png')?>" />
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?= Root('i/image/touch_icon/favicon_72x72.png')?>" />
        <link rel="apple-touch-icon-precomposed" href="<?= Root('i/image/touch_icon/favicon_57x57.png')?>" />

        <link rel="icon" href="<?= Root('favicon.ico')?>" type="image/x-icon" />
        <link rel="shortcut icon" href="<?= Root('favicon.ico')?>" type="image/x-icon" />

        <meta http-equiv="cleartype" content="on">

        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/dev/funcs.css')?>" />

        <script src="<?= Root("i/js/dev/jquery-2.0.3.min.js")?>" ></script>

<!--        <?php /*IncludeCom('dev/jquery')*/?> -->
        <?php IncludeCom('dev/font_ptsans')?>
<!--        <?php /*IncludeCom('dev/fontawesome')*/?> -->

        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/dev/bootstrap5/bootstrap.css')?>" />
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/dev/bootstrap-icons/bootstrap-icons.css')?>" />
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/main_tpl.css')?>" />

        <meta name="yandex-verification" content="66de0a468e59b81b" />

        <!-- Следущая строчка нужна для обозначения места вставки объеденённых css/js файлов. Её не следует удалять.-->
        <!-- extraPacker -->

        <script>
            var now = new Date();
            var Dec015_2019_start = new Date(2019,11,15,12,0,0,0);
            var Dec015_2019_stop = new Date(2019,11,15,12,30,0,0);
                if( now > Dec015_2019_start && now < Dec015_2019_stop) {
                    window.location.href = '/blackout/index.html';
                }

            // Global version needs to force reload scripts from server.
            globalVersion = <?= $g_config['engine_version'] ?>;
        </script>
    </head>
    <body>
        <div class="container page-wrap" id="mainContainer">
<!--            <div class="header"> -->
<nav class="navbar navbar-expand-lg navbar-default navbar-light" id="navigation">
    <div class="container-fluid">
        <a class="navbar-brand" href="<?= SiteRoot()?>"><span class="bi bi-share"></span> Graph Online</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMainContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarMainContent">
            <ul class="navbar-nav ms-auto">
            <?php foreach ($menu as $key => $m):?>
            <?php if (!isset($m["list"])) { ?>
                <li class="nav-item <?= $m["is_active"] ? "active" : ""?>">
                    <a class="nav-link" href="<?= $m["link"]?>"><?= $m["title"]?></a>
                </li>
                <?php }	else { ?>
                <li class="nav-item dropdown"> 
                    <a class="nav-link dropdown-toggle" href="#" role="button" id="id_menu_<?= $key ?>" data-bs-toggle="dropdown" aria-expanded="false"> 
                        <?= $m["title"]?> <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="id_menu_<?= $key ?>">
                        <?php foreach ($m["list"] as $subm):?>
                        <li><a class="dropdown-item" href="<?= $subm["link"]?>"><?= $subm["title"]?></a></li>
                        <?php endforeach?>
                    </ul>
                </li>
                <?php } ?>
            <?php endforeach?>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" id="id_menu_lang" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="bi bi-globe"></span> <?= L('lang')?> <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="id_menu_lang">
                        <?php foreach($g_arrLangs as $lang => $langInfo):?>
                        <?php if (!array_key_exists('hidden', $langInfo) || !$langInfo["hidden"]):?>
                            <li>
                                <a href="<?= ChangeLang($lang, GetCurUrl())?>" title="<?= $langInfo["name"]?>" class="<?= $lang == LANG ? "selected" : ""?> dropdown-item">
                                    <img id="flag_<?= $lang?>" src="/i/image/1px.png" width="30" height="22"> <?= $langInfo["name"]?>
                                </a>
                            </li>
                        <?php endif?>
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
                    <p>© <?= L('footer_info')?> 2015 - <?= date("Y")?><sub>r<?= $g_config['engine_version'] ?></sub></p>
           </div>
        </footer>
        </div>

<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter25827098 = new Ya.Metrika({
                    id:25827098,
                    clickmap:false,
                    trackLinks:true,
                    accurateTrackBounce:true
                });
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            x = "https://mc.webvisor.org/metrika/watch_ww.js",
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        for (var i = 0; i < document.scripts.length; i++) {
            if (document.scripts[i].src === x) { return; }
        }
        s.type = "text/javascript";
        s.async = true;
        s.src = x;

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks");
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/25827098" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->

	<script>
		if (typeof preLoadPage == 'function')
		{  
			preLoadPage();
		}
	</script>
	<script src="<?= Root("i/js/dev/bootstrap5/bootstrap.bundle.min.js")?>" >
            var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
            var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
                return new bootstrap.Dropdown(dropdownToggleEl)
            })
        	//$('.dropdown-toggle').dropdown();
	</script>
	<script>
		if (typeof postLoadPage == 'function')
		{  
			postLoadPage();
		}		
	</script>              
    </body>
</html>
