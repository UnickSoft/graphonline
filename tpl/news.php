
    <h1><?= L('head_no_tags')?></h1>
    <p><?= L('text')?></p>

    <div style="align:center">
<? if (L('current_language') == "ru"): ?>
<script type="text/javascript" src="https://vk.com/js/api/openapi.js?168"></script>
<!-- VK Widget -->
<div id="vk_groups"></div>
<script type="text/javascript">
VK.Widgets.Group("vk_groups", {mode: 4, wide: 1, width: "600", height: "400"}, 153431694);
</script>
<? else: ?>
<div id="fb-root"></div>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v8.0" nonce="pfXO5s37"></script>
        
<div class="fb-page" data-href="https://www.facebook.com/Graphonline-2230709670325388/" data-tabs="timeline" data-width="600" data-height="500" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/Graphonline-2230709670325388/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/Graphonline-2230709670325388/">Graphonline</a></blockquote></div>
<? endif; ?>

</div>

