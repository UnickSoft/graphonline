
    <head>
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/home.css')?>" />
	<link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery-ui.theme.css')?>" />
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery-ui.css')?>" />
<!--
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery-ui.structure.css')?>" />
-->
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery.feedback_me.css')?>" />

        <script src="<?= Root('i/js/dev/jquery-ui.js')?>"></script>
	<script src="<?= Root('i/js/dev/jquery.feedback_me.js')?>"></script>
        <script src="<?= Root("script/example.js?v=2")?>" ></script>
    </head>
<!--
<div class="pull-right">
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:inline-block;width:240px;height:100px"
     style="display:inline-block;width:240px;height:100px"
     data-ad-client="ca-pub-6777969915840976"
     data-ad-slot="6397293847"></ins>
</div>
-->

    <h1 style="display:inline;"><?= L('title_notg')?></h1>

    <span class="hidden-xs"><?= L('text')?></span>

	<section>
		<ul class="nav nav-pills">

			<div class="btn-group" role="group">
    			<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
			<span class="glyphicon glyphicon-cog fa-fw"></span><span class="hidden-phone"> <?= L('graph')?> </span><span class="caret"></span></button>
    			<ul class="dropdown-menu" role="menu">
      				<li>
                        <button type="button" class="btn btn-default btn-sm btn-submenu" id="NewGraph"><span class="glyphicon glyphicon-plus fa-fw"></span> <?= L('new_graph')?> <span style="float:right">n</span></button>
				</li>
				<li class="divider"></li>
      				<li>
				  <button type="button" class="btn btn-default btn-sm btn-submenu" id="SaveGraph"><span class="glyphicon glyphicon-floppy-disk fa-fw"></span> <?= L('save')?></button>
				</li>
                <li>
                    <button type="button" class="btn btn-default btn-sm btn-submenu" id="SaveGraphImage"><span class="glyphicon glyphicon-floppy-disk fa-fw"></span> <?= L('save_image')?></button>
                </li>
                <li>
                    <button type="button" class="btn btn-default btn-sm btn-submenu" id="SaveFullGraphImage"><span class="glyphicon glyphicon-floppy-disk fa-fw"></span> <?= L('save_full_image')?></button>
                </li>
				<li class="divider"></li>
      				<li>
				  <button type="button" class="btn btn-default btn-sm btn-submenu" id="ShowAdjacencyMatrix"><span class="glyphicon glyphicon-th fa-fw"></span> <?= L('show_adjacency_matrix')?></button>
				</li>
      				<li>
		  		  <button type="button" class="btn btn-default btn-sm btn-submenu" id="ShowIncidenceMatrix"><span class="glyphicon glyphicon-th fa-fw"></span> <?= L('show_incidence_matrix')?> </button>
				</li>
                <li>
		  		  <button type="button" class="btn btn-default btn-sm btn-submenu" id="GroupRename"><span class="glyphicon glyphicon-pencil fa-fw"></span> <?= L('group_rename')?> </button>
				</li>
				<li class="divider"></li>
      				<li>
				  <button type="button" class="btn btn-default btn-sm btn-submenu" id="DeleteAll"><span class="glyphicon glyphicon-remove fa-fw"></span> <?= L('delete_all')?></button>
				</li>
    			</ul>
  			</div>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="glyphicon glyphicon-zoom-in fa-fw"></span><span class="hidden-phone"> <?= L('view')?> </span><span class="caret hidden-phone"></span>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="Zoom100"><span class="glyphicon glyphicon-zoom-in fa-fw"></span> 100% </button> </li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="Zoom50"><span class="glyphicon glyphicon-zoom-in fa-fw"></span> 50% </button> </li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="Zoom25"><span class="glyphicon glyphicon-zoom-in fa-fw"></span> 25% </button> </li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="ZoomFit"><span class="glyphicon glyphicon-zoom-in fa-fw"></span> <?= L('zoom_fit') ?></button> </li>
                <li class="divider"></li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="ZoomIn"><span class="glyphicon glyphicon-zoom-in fa-fw"></span> <?= L('zoom_in') ?> <span style="float:right">+</span></button></li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="ZoomOut"><span class="glyphicon glyphicon-zoom-in fa-fw"></span> <?= L('zoom_out') ?> <span style="float:right">-</span></button></li>
                <li class="divider"></li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="MoveWorspace"><span class="glyphicon glyphicon-fullscreen fa-fw"></span> <?= L('move_workspace') ?> </button> </li>
            </ul>
          </div>
		  <button type="button" class="btn btn-default btn-sm" id="Default"><span class="glyphicon glyphicon-fullscreen fa-fw"></span><span class="hidden-phone"> <?= L('default')?> <sub style="color:#AAAAAA">m</sub></span></button>
          <button type="button" class="btn btn-primary btn-sm" id="AddGraph"><span class="glyphicon glyphicon-plus fa-fw"></span><span class="hidden-phone"> <?= L('add_node')?> <sub style="color:#AAAAAA">v</sub></span></button>
		  <button type="button" class="btn btn-default btn-sm" id="ConnectGraphs"><span class="glyphicon glyphicon-road fa-fw"></span><span class="hidden-phone"> <?= L('connect_nodes')?> <sub style="color:#AAAAAA">e</sub></span></button>

        <!-- Algorithms -->
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <span class="glyphicon glyphicon-cog fa-fw "></span><span class="hidden-phone"> <?= L('algorithms') ?> </span><span class="caret"></span>
            </button>
          <ul class="dropdown-menu dropdown-menu-right" role="menu" id="algorithmList">
            <li>
<!--
		  <button type="button" class="btn btn-default btn-sm" style="width: 100%; text-align: left; border: none;" id="FindPath"><span class="glyphicon glyphicon-search fa-fw"></span> <?= L('short_path')?></button></li>
          <li><button type="button" class="btn btn-default btn-sm" style="width: 100%; text-align: left; border: none;" id="ConnectedComponent"><span class="glyphicon glyphicon-search fa-fw"></span> <?= L('connected_component') ?> </button></li>
		  <li><button type="button" class="btn btn-default btn-sm" style="width: 100%; text-align: left; border: none;" id="EulerianLoop"><span class="glyphicon glyphicon-refresh fa-fw"></span> <span><?= L('find_eulerian_loop')?></span></button></li>
-->
		  <li style="display: none;"><button type="button" class="btn btn-default btn-sm" style="width: 100%; text-align: left; border: none;" id=""><span class="glyphicon glyphicon-search fa-fw"></span> <span></span></button></li>

          </ul>
        </div>

        <button type="button" class="btn btn-default btn-sm" id="DeleteObject"><span class="glyphicon glyphicon-remove fa-fw"></span><span class="hidden-phone"> <?= L('delete')?> <sub style="color:#AAAAAA">r</sub></span></button>

<!--
        <? if (!$wasVote && count($voteTopics) > 0): ?>
        <button type="button" class="btn btn-success" id="VoteButton"><span class="glyphicon glyphicon-thumbs-up"></span> <?= L('vote') ?></button>
        <? endif ?>
-->
<!--
		  <button type="button" class="btn btn-default" id="Test"><span class="glyphicon glyphicon-remove"></span> Test repos</button>
-->
		</ul>
	</section>		

    <section>
	<div id="message" class="alert alert-success" role="alert">Graph</div>
    </section>

    <section id="canvasSection">
	<canvas id="canvas"><?= L('browser_no_support')?></canvas>
    <div id="developerTools" class="well well-sm">
        <h4><?= L('developer_tools_title')?></h4> <span class="glyphicon glyphicon-resize-full fa-fw leftTopPosition" id="devToolsZoom"></span>
        <span><?= L('developer_tools_text')?></span>
        <textarea id="userScript">
        </textarea>
        <input type="button" value="<?= L('developer_tools_run')?>" id="runUserScript" class="btn btn-success btn-sm"/>
        <input type="button" value="<?= L('developer_tools_submit')?>" id="submitUserScript" class="btn btn-default btn-sm" style="float: right;"/>
    </div>
    </section>

<? if (L('current_language') == "ru"): ?>
    <section style="height:32px;text-align: center;" id="adv" class="hidden-phone">

    <a class="ProgresssBarLink" href="/donate" target="_blank">
    <div class="ProgressBar" style="height:32px">
        <div class="ProgressBarFill" style="width:<?= intval($donates / $totalDonate * 100) ?>%;"></div>
        <span class="ProgressBarText" style="top:-28px"><p>Поддержите наш проект: сбор средств добавления новых алгоритмов.</p></span>
    </div>
    </a>
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
    <section class="translation">
    <div id="addEdge">
		<form>
		<fieldset>
              <div>
			  <label id="WeightLabel"><?= L('edge_weight')?>&nbsp; </label> <input type="range" id="EdgeWeightSlider" min="0" max="29" value="0" oninput="document.getElementById('EdgeWeight').value = (this.value > 0 ? this.value : '<?= L('default_weight')?>');" onchange="document.getElementById('EdgeWeight').value = (this.value > 0 ? this.value : '<?= L('default_weight')?>');"> &nbsp; &nbsp;<input type="text" name="edgeWeight" value="<?= L('default_weight')?>" id="EdgeWeight" class="inputBox">
              </div>
			  <div>
  			  <span onClick="document.getElementById('EdgeWeight').value='<?= L('default_weight')?>'; document.getElementById('EdgeWeightSlider').value=0;" style="cursor: pointer" class="defaultWeigth"><?= L('default_weight')?></span>
  			  <span onClick="document.getElementById('EdgeWeight').value='1'; document.getElementById('EdgeWeightSlider').value=1;" style="cursor: pointer"  class="defaultWeigth">1</span>
  			  <span onClick="document.getElementById('EdgeWeight').value='3'; document.getElementById('EdgeWeightSlider').value=3;" style="cursor: pointer"  class="defaultWeigth">3</span>
  			  <span onClick="document.getElementById('EdgeWeight').value='5'; document.getElementById('EdgeWeightSlider').value=5;" style="cursor: pointer"  class="defaultWeigth">5</span>
			  <span onClick="document.getElementById('EdgeWeight').value='7'; document.getElementById('EdgeWeightSlider').value=7;" style="cursor: pointer"  class="defaultWeigth">7</span>
			  <span onClick="document.getElementById('EdgeWeight').value='11'; document.getElementById('EdgeWeightSlider').value=11;" style="cursor: pointer"  class="defaultWeigth">11</span>
			  </div>
		</fieldset>
		</form>
    </div>

    <div id="addVertex">
        <form>
        <fieldset>
            <label id="VertexTitleLable">
                <p><?= L('enter_vertex_title')?></p> <input type="text" name="VertextTitle" value="Title" id="VertexTitle" class="inputBox">
            </label>
            <br/><br/><button type="button" id="groupRenameButton" class="btn btn-default btn-xs hidden-phone"> <?= L('group_rename')?> </button>
        </fieldset>
        </form>
    </div>

    <div id="GroupRenameDialog">
        <form>
        <fieldset>
                <p><?= L('enter_vertices_text_in_each_line')?></p> <textarea name="VertextTitleList" id="VertextTitleList" wrap="off" rows="8"></textarea>
        </fieldset>
        </form>
    </div>

	<div id="adjacencyMatrix">
		<form>
		<fieldset>
				<p><?= L('adjacency_matrix_description')?></p>
				<textarea name="adjacencyMatrixField" id="AdjacencyMatrixField" wrap="off"></textarea>
				<p id="BadMatrixFormatMessage"><?= L('adjacency_matrix_bad_format')?></p>
		</fieldset>
		</form>
    </div>

	<div id="incidenceMatrix">
		<form>
		<fieldset>
				<p><?= L('incidence_matrix_description')?></p>				
				<textarea name="incidenceMatrixField" id="IncidenceMatrixField" wrap="off"></textarea>
				<p id="BadIncidenceMatrixFormatMessage"><?= L('incidence_matrix_bad_format')?></p>
		</fieldset>
		</form>
       </div>
        
	<div id="floidMatrix">
		<form>
		<fieldset>
				<p><?= L('min_dist_matrix_description') ?></p>
				<textarea name="floidMatrixField" id="FloidMatrixField" wrap="off"></textarea>
		</fieldset>
		</form>
    </div>

	<div id="saveDialog">
		<form>
		<fieldset>
				<p><?= L('this_is_graph_link')?> <br/>
				<input type="text" name="graphName" id="GraphName" onClick="this.select();">
				</p>
				<p><?= L('share_graph_description') ?></p>
<? $sharePageURL = $_SERVER['SERVER_NAME'] . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);?>
<ul class="share-buttons" id="ShareSavedGraph">
	<li><a href="http://vkontakte.ru/share.php?url=http://<?= $sharePageURL ?>?graph=XXXX&text=<?= L('share_graph_text') ?>" target="_blank" title="Share on Vkontate"><i class="fa fa-vk fa-2x"></i></a></li>
	<li><a href="https://www.facebook.com/sharer/sharer.php?u=http://<?= $sharePageURL ?>?graph=XXXX&t=<?= L('share_graph_text') ?>" target="_blank" title="Share on Facebook"><i class="fa fa-facebook-square fa-2x"></i></a></li>
	<li><a href="https://twitter.com/intent/tweet?source=http://<?= $sharePageURL ?>?graph=XXXX&text=<?= L('share_graph_text') ?> http://<?= $sharePageURL ?>?graph=XXXX" target="_blank" title="Tweet"><i class="fa fa-twitter-square fa-2x"></i></a></li>
	<li><a href="https://plus.google.com/share?url=http://<?= $sharePageURL ?>?graph=XXXX" target="_blank" title="Share on Google+"><i class="fa fa-google-plus-square fa-2x"></i></a></li>
	<li><a href="http://www.linkedin.com/shareArticle?mini=true&url=http://<?= $sharePageURL ?>?graph=XXXX&title=<?= L('share_graph_text') ?>&summary=<?= L('share_graph_text') ?> &source=http://<?= $sharePageURL ?>?graph=XXXX" target="_blank" title="Share on LinkedIn"><i class="fa fa-linkedin-square fa-2x"></i></a></li>
	<li><a href="mailto:?subject=<?= L('share_graph_text') ?>&body=http://<?= $sharePageURL ?>?graph=XXXX" target="_blank" title="Email"><i class="fa fa-envelope fa-2x"></i></a></li>
</ul>

		</fieldset>
		</form>
       </div>

<div id="saveImageDialog">
<form>
<fieldset>
<? $shareImagePageURL = $_SERVER['SERVER_NAME'] . "/";?>
<p id="SaveImageLinks"><a href="http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank"><?= L('open_saved_image_browser')?></a> <?= L('or')?> <a href="http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" download><?= L('download_saved_image')?></a>
</p>
<p class="hidden-phone">
<a href="http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" class="hidden-phone showShareImage" id="showSavedImageGraphRef"><img src="http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" id="showSavedImageGraph" class="showShareImage"></a>
</p>
<p><?= L('share_graph_description') ?></p>
<ul class="share-buttons" id="ShareSavedImageGraph">
<li><a href="http://vkontakte.ru/share.php?url=http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png&text=<?= L('share_graph_text') ?>" target="_blank" title="Share on Vkontate"><i class="fa fa-vk fa-2x"></i></a></li>
<li><a href="https://www.facebook.com/sharer/sharer.php?u=http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png&t=<?= L('share_graph_text') ?>" target="_blank" title="Share on Facebook"><i class="fa fa-facebook-square fa-2x"></i></a></li>
<li><a href="https://twitter.com/intent/tweet?source=http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png&text=<?= L('share_graph_text') ?> http://<?= $sharePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" title="Tweet"><i class="fa fa-twitter-square fa-2x"></i></a></li>
<li><a href="https://plus.google.com/share?url=http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" title="Share on Google+"><i class="fa fa-google-plus-square fa-2x"></i></a></li>
<li><a href="http://www.linkedin.com/shareArticle?mini=true&url=http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png&title=<?= L('share_graph_text') ?>&summary=<?= L('share_graph_text') ?> &source=http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" title="Share on LinkedIn"><i class="fa fa-linkedin-square fa-2x"></i></a></li>
<li><a href="mailto:?subject=<?= L('share_graph_text') ?>&body=http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" title="Email"><i class="fa fa-envelope fa-2x"></i></a></li>
</ul>

</fieldset>
</form>
</div>

	<div id="sentAlgorithm" title="<?= L('algorithm_was_sent')?>">
		  <p><?= L('your_algorithm_was_sent')?></p>
    </div>


       <div id="matrixError" class="translation">
	<div><span class="glyphicon glyphicon-remove-sign text-danger"></span> <?= L('bad_adj_matrix_message')?></div>
       </div>

       <div id="matrixErrorInc" class="translation">
	<div><span class="glyphicon glyphicon-remove-sign text-danger"></span> <?= L('bad_inc_matrix_message')?></div>
       </div>

	<div id="incidenceMatrix">
		<form>
		<fieldset>
				<p><?= L('incidence_matrix_description')?></p>				
				<textarea name="incidenceMatrixField" id="IncidenceMatrixField" wrap="off"></textarea>
				<p id="BadIncidenceMatrixFormatMessage"><?= L('incidence_matrix_bad_format')?></p>
		</fieldset>
		</form>
       </div>
        
	<div id="voteDialog">
		<form>
		<fieldset>
				<p><?= L('vote_question') ?></p>	
            <? foreach ($voteTopics as $topic): ?>
                <div class="list-group">
                  <button type="button" class="list-group-item" id="vote<?=$topic["index"]?>">
                    <h4 class="list-group-item-heading"><?= $topic["title"] ?></h4>
                    <p class="list-group-item-text"><?= $topic["desc"] ?></p>
                  </button>
                </div>
            <? endforeach ?>
		</fieldset>
		</form>
    </div>
        
        
	<div id="NeedAlgorithm">
		<form>
		<fieldset>
				<p><?= L('what_algorithm_need') ?></p>
                <textarea name="needAlgorthmText" id="NeedAlgorithmMessage" rows="5"></textarea>
                <p><?= L('what_algorithm_we_have') ?></p>
		</fieldset>
		</form>
    </div>
	
    <p id="SelectAndMoveObject" class="translation"><?= L('select_and_move_objects')?></p>
    <p id="MoveCursorForMoving" class="translation"><?= L('move_cursor_for_moving')?></p>

    <p id="SelectAndMoveObject" class="translation"><?= L('select_and_move_objects')?></p>
    <p id="MoveCursorForMoving" class="translation"><?= L('move_cursor_for_moving')?></p>
    <p id="clickToAddVertex" class="translation"><?= L('click_to_add_vertex')?></p>
    <p id="selectFisrtVertextToConnect" class="translation"><?= L('select_first_vertext_to_connect')?></p>
    <p id="selectSecondVertextToConnect" class="translation"><?= L('select_second_vertext_to_connect')?></p>
    <p id="selectStartShortPathVertex" class="translation"><?= L('select_start_short_path_vertex')?></p>
    <p id="selectFinishShortPathVertex" class="translation"><?= L('select_finish_short_path_vertex')?></p>
    <p id="shortPathResult" class="translation"><?= L('short_path_result')?></p>
    <p id="pathNotExists" class="translation"><?= L('path_not_exists')?></p>
    <p id="selectObjectToDelete" class="translation"><?= L('select_object_to_delete')?></p>
 
    <p id="AddEdge" class="translation"><?= L('add_graph')?></p>
	<p id="OrintEdge" class="translation"><?= L('orint_edge')?></p>
	<p id="NotOrintdge" class="translation"><?= L('not_orint_edge')?></p>
	
	<p id="AdjacencyMatrixText" class="translation"><?= L('show_adjacency_matrix')?></p>
	<p id="Save" class="translation"><?= L('save')?></p>
	<p id="Cancel" class="translation"><?= L('cancel')?></p>
	<p id="shortestDist" class="translation"><?= L('shortest_dist')?></p>
	<p id="IncidenceMatrixText" class="translation"><?= L('show_incidence_matrix')?></p>


	<p id="saveDialogTitle" class="translation"><?= L('save_dialog_title')?></p>
	<p id="closeButton" class="translation"><?= L('close_button')?></p>

	<p id="connectedComponentResult" class="translation"><?= L('connected_component_result')?></p>
	<p id="sickConnectedComponentResult" class="translation"><?= L('sick_connected_component_result')?></p>


	<p id="whatDoYouThink" class="translation"><?= L('what_do_you_think')?></p>
	<p id="name" class="translation"><?= L('name')?></p>
	<p id="feedback" class="translation"><?= L('feedback')?></p>
	<p id="send" class="translation"><?= L('send')?></p>
	<p id="writeToUs" class="translation"><?= L('write_to_us')?></p>


	<p id="fixMatrixButton" class="translation"><?= L('fix_matrix_button')?></p>
	<p id="matrixHelp" class="translation"><?= L('open_matrix_help')?></p>
	<p id="wronMatrixTitle" class="translation"><?= L('wrong_matrix_title')?></p>

    <p id="saveImageDialogTitle" class="translation"><?= L('save_image_dialog_title')?></p>

    <p id="fullReport" class="translation"><?= L('full_report')?></p>
    <p id="shortReport" class="translation"><?= L('short_report')?></p>

    <p id="hasNotEulerianLoop" class="translation"><?= L('has_not_eulerian_loop')?></p>
    <p id="hasEulerianLoop" class="translation"><?= L('has_eulerian_loop')?></p>
    <p id="processing" class="translation"><?= L('processing')?></p>

    <p id="customEnumVertex" class="translation"><?= L('custom')?></p>
    <p id="addVertexText" class="translation"><?= L('add_node')?></p>

    <p id="renameVertex" class="translation"><?= L('rename_vertex')?></p>
    <p id="renameText" class="translation"><?= L('rename_text')?></p>
    <p id="inputMatrix" class="translation"><?= isset($_POST["matrix"]) ? $_POST["matrix"] : ""?></p>
    <p id="separator" class="translation"><?= isset($_POST["separator"]) ? $_POST["separator"] : ""?></p>
    <p id="inputIncidenceMatrix" class="translation"><?= isset($_POST["incidenceMatrix"]) ? $_POST["incidenceMatrix"] : ""?></p>
    <p id="currentLanguage" class="translation"><?= L('current_language')?></p>
    <p id="editWeight" class="translation"><?= L('edit_weight')?></p>
    <p id="noWeight" class="translation"><?= L('default_weight')?></p>
    <p id="groupeRenameText" class="translation"><?= L('group_rename')?></p>
    <p id="voteText" class="translation"><?= L('vote')?></p>
    <p id="recommend_algorithm" class="translation"><?= L('recommend_algorithm')?></p>

    <p id="hasNotEulerianPath" class="translation"><?= L('has_not_eulerian_path')?></p>
    <p id="hasEulerianPath" class="translation"><?= L('has_eulerian_path')?></p>

    <p id="graphOfMinDist" class="translation"><?= L('graphOfMinDist')?></p>
    <p id="checkToSave" class="translation"><?= L('checkToSave')?></p>
    <p id="showDistMatrix" class="translation"><?= L('showDistMatrix')?></p>
    <p id="distMatrixText" class="translation"><?= L('distMatrixText')?></p>
</section>
<!--
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
-->
