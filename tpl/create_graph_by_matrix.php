    <head>
	    <link rel="stylesheet" type="text/css" href="<?= Root('i/css/create_graph_by_matrix.css')?>" />
        <script src="<?= RootCacheJS("script/shared/config.js")?>" ></script>
        <script src="<?= RootCacheJS("script/shared/loader.js")?>" ></script>
	    <script src="<?= RootCacheJS('script/pages/create_graph_by_matrix/api/index.js')?>"></script>
    </head>

    <h1><?= L('head_no_tags')?></h1>
    <p><?= L('text')?></p>

    <div>
		<form>
		<fieldset>
				<div id="message" class="alert alert-success" role="alert" style="height:64px">
					<p id="TextDescription" style="display: none;"><?= L('adjacency_matrix_description') ?></p>
                    <p id="MatrixDescription"><?= L('adjacency_matrix_description_matrix') ?></p>
				</div>
				<div class="row">
				<div class="col-md-4">
<form id="matrixViewForm">
<!--
<div class="btn-group" data-toggle="buttons">
    <label class="btn btn-default active" id="showMatrix"><input type="radio" name="matrixInputType" id="showMatrixRadio" checked> <?= L('matrix_matrix_input') ?></label>
    <label class="btn btn-default" id="showText"><input type="radio" name="matrixInputType" id="showTextRadio" > <?= L('text_matrix_input') ?></label>
</div>
-->
<ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="javascript:;" id="showMatrix"> <?= L('matrix_matrix_input') ?></a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="javascript:;" id="showText"> <?= L('text_matrix_input') ?></a>
  </li>
</ul>
</form>
<form action="./" method="post" id="matrixForm" class="pb-2">
				<textarea name="matrix" id="AdjacencyMatrixFieldPage" wrap="off" style="display: none;">
<?php if (!isset($_GET["matrix"])): ?>
0, 1, 0
1, 0, 0
0, 1, 0
<?php else: ?><?= $_GET["matrix"] ?><?php endif;?></textarea>
<div id="idSeparatorList" style="display: none;">
<?= L('separator') ?>
    <label for="commoSep"><input type="radio" name="separator" value="commo" id="commoSep" checked> <?= L('separator_commo') ?></label>
    <label for="spaceSep"><input type="radio" name="separator" value="space" id="spaceSep"> <?= L('separator_space') ?></label>
</div>
</form>
<div id="MatrixForm" class="pb-0">
    <form id="AdjacencyMatrixFieldInput" role="form">
    <input type="text" name="field0_0" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
    <input type="text" name="field0_1" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
    <input type="text" name="field0_2" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
    <br name="row0">

    <input type="text" name="field1_0" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
    <input type="text" name="field1_1" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
    <input type="text" name="field1_2" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
    <br name="row1">

    <input type="text" name="field2_0" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
    <input type="text" name="field2_1" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
    <input type="text" name="field2_2" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
    <br name="row2">

    <span name="matrixEnd"></span>
    </form>
    <p><small><?= L('use_ctrl_to_move_cells')?></small></p>
</div>
<button type="button" onclick="IncSize()" value="add" name="add" class="btn btn-outline-secondary menu-text"><span class="bi bi-plus-circle"></span>
    <?= L('add_node_to_matrix') ?>
</button>
				</div>
				<div class="col-md-4">
		  		<button type="button" class="btn btn-outline-success btn-lg" id="CreateByAdjacencyMatrix"><span class="bi bi-check-lg"></span> <?= L('plot_graph_button')?></button>
				<div id="BadFormatMessage" class="alert alert-warning" role="alert">
					<?= L('adjacency_matrix_bad_format')?>
				</div>
				</div>
				</div>
		</fieldset>     
		</form>
    </div>

<? if (L('current_language') == "ru"): ?>
<section>
				<div id="videoHelp">
					<a href="./create_graph_by_matrix_help">Видео справка</a>
                    <a href="./wiki/Справка/МатрицаСмежности">Wiki справка</a>
				</div>    
</section>

                <section style="text-align: center;" class="hidden-phone">
                <div>
                    <img src="/i/image/help/createGrapthByMatrix.gif" alt="<?= L('head_no_tags')?>"/>
                </div>
                </section>
<? endif; ?>

<? if (L('current_language') == "en"): ?>

<section>
				<div id="videoHelp">
                    <a href="./wiki/Help/AdjacencyMatrix">Wiki help</a>
				</div>    
</section>
                <section style="text-align: center;" class="hidden-phone">
                <div>
                    <img src="/i/image/help/createGraphByMatrixEn.gif" alt="<?= L('head_no_tags')?>"/>
                </div>
                </section>
<? endif; ?>

                <? if (L('current_language') == "ru"): ?>
    <section style="height:90px;text-align: center;" id="info" class="hidden-phone">
<!-- Yandex.RTB R-A-202319-1 -->
<!--
<div style="text-align:center;">
<div id="yandex_rtb_R-A-202319-1" style="display: inline-block;"></div>
</div>
<script type="text/javascript">
    (function(w, d, n, s, t) {
        w[n] = w[n] || [];
        w[n].push(function() {
            Ya.Context.AdvManager.render({
                blockId: "R-A-202319-1",
                renderTo: "yandex_rtb_R-A-202319-1",
                async: true
            });
        });
        t = d.getElementsByTagName("script")[0];
        s = d.createElement("script");
        s.type = "text/javascript";
        s.src = "//an.yandex.ru/system/context.js";
        s.async = true;
        t.parentNode.insertBefore(s, t);
    })(this, this.document, "yandexContextAsyncCallbacks");
</script>
-->
    </section>
<? endif; ?>

