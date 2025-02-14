
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
        <script src="<?= Root("script/example.js")?>" ></script>

    </head>
<!--
<div class="pull-right">
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
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
			<span class="bi bi-cog fa-fw"></span>
      				<?= L('graph')?>
      			<span class="caret"></span>
			</button>
    			<ul class="dropdown-menu" role="menu">
      				<li>
				  <button type="button" class="btn btn-default btn-sm btn-submenu" id="NewGraph"><span class="bi bi-plus fa-fw"></span> <?= L('new_graph')?></button>
				</li>
				<li class="divider"></li>
      				<li>
				  <button type="button" class="btn btn-default btn-sm btn-submenu" id="SaveGraph"><span class="bi bi-floppy-disk fa-fw"></span> <?= L('save')?></button>
				</li>
                <li>
                    <button type="button" class="btn btn-default btn-sm btn-submenu" id="SaveGraphImage"><span class="bi bi-floppy-disk fa-fw"></span> <?= L('save_image')?></button>
                </li>
				<li class="divider"></li>
      				<li>
				  <button type="button" class="btn btn-default btn-sm btn-submenu" id="ShowAdjacencyMatrix"><span class="bi bi-th fa-fw"></span> <?= L('show_adjacency_matrix')?></button>
				</li>
      				<li>
		  		  <button type="button" class="btn btn-default btn-sm btn-submenu" id="ShowIncidenceMatrix"><span class="bi bi-th fa-fw"></span> <?= L('show_incidence_matrix')?> </button>
				</li>
				<li class="divider"></li>
      				<li>
				  <button type="button" class="btn btn-default btn-sm btn-submenu" id="DeleteAll"><span class="bi bi-remove fa-fw"></span> <?= L('delete_all')?></button>
				</li>
    			</ul>
  			</div>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="bi bi-zoom-in fa-fw"></span> <?= L('view')?>
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="Zoom100"><span class="bi bi-zoom-in fa-fw"></span> 100% </button> </li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="Zoom50"><span class="bi bi-zoom-in fa-fw"></span> 50% </button> </li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="Zoom25"><span class="bi bi-zoom-in fa-fw"></span> 25% </button> </li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="ZoomFit"><span class="bi bi-zoom-in fa-fw"></span> <?= L('zoom_fit') ?></button> </li>
                <li class="divider"></li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="ZoomIn"><span class="bi bi-zoom-in fa-fw"></span> <?= L('zoom_in') ?> </button> </li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="ZoomOut"><span class="bi bi-zoom-in fa-fw"></span> <?= L('zoom_out') ?> </button> </li>
                <li class="divider"></li>
                <li> <button type="button" class="btn btn-default btn-sm btn-submenu" id="MoveWorspace"><span class="bi bi-fullscreen fa-fw"></span> <?= L('move_workspace') ?> </button> </li>
            </ul>
          </div>
		  <button type="button" class="btn btn-default btn-sm" id="Default"><span class="bi bi-fullscreen fa-fw"></span> <?= L('default')?></button>
          <button type="button" class="btn btn-primary btn-sm" id="AddGraph"><span class="bi bi-plus fa-fw"></span> <?= L('add_node')?></button>
		  <button type="button" class="btn btn-default btn-sm" id="ConnectGraphs"><span class="bi bi-road fa-fw"></span> <?= L('connect_nodes')?></button>

        <!-- Algorithms -->
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <span class="bi bi-cog fa-fw"></span>
                <?= L('algorithms') ?>
            <span class="caret"></span>
            </button>
          <ul class="dropdown-menu" role="menu" id="algorithmList">
            <li>
<!--
		  <button type="button" class="btn btn-default btn-sm" style="width: 100%; text-align: left; border: none;" id="FindPath"><span class="bi bi-search fa-fw"></span> <?= L('short_path')?></button></li>
          <li><button type="button" class="btn btn-default btn-sm" style="width: 100%; text-align: left; border: none;" id="ConnectedComponent"><span class="bi bi-search fa-fw"></span> <?= L('connected_component') ?> </button></li>
		  <li><button type="button" class="btn btn-default btn-sm" style="width: 100%; text-align: left; border: none;" id="EulerianLoop"><span class="bi bi-refresh fa-fw"></span> <span><?= L('find_eulerian_loop')?></span></button></li>
-->
		  <li style="display: none;"><button type="button" class="btn btn-default btn-sm" style="width: 100%; text-align: left; border: none;" id=""><span class="bi bi-search fa-fw"></span> <span></span></button></li>

          </ul>
        </div>

        <button type="button" class="btn btn-default btn-sm" id="DeleteObject"><span class="bi bi-remove fa-fw"></span> <?= L('delete')?></button>
<!--
		  <button type="button" class="btn btn-default" id="Test"><span class="bi bi-remove"></span> Test repos</button>
-->
		</ul>
	</section>		

	
    <section>
	<div id="message" class="alert alert-success" role="alert">Graph</div>
    </section>

    <section id="canvasSection">
	<canvas id="canvas"><?= L('browser_no_support')?></canvas>
    <div id="developerTools" class="well well-sm">
        <h4><?= L('developer_tools_title')?></h4>
        <span><?= L('developer_tools_text')?></span>
        <textarea id="userScript">
        </textarea>
        <input type="button" value="<?= L('developer_tools_run')?>" id="runUserScript" class="btn btn-success btn-sm"/>
        <input type="button" value="<?= L('developer_tools_submit')?>" id="submitUserScript" class="btn btn-default btn-sm" style="float: right;"/>
    </div>
    </section>
	
    <div id="addEdge">
		<form>
		<fieldset>
			  <label id="WeightLabel">	 
				<?= L('edge_weight')?>&nbsp; &nbsp; &nbsp; <input type="text" name="edgeWeight" value="<?= L('default_weight')?>" id="EdgeWeight" class="inputBox">
			  </label>
			  <div>
  			  <span onClick="document.getElementById('EdgeWeight').value='<?= L('default_weight')?>'" style="cursor: pointer" class="defaultWeigth"><?= L('default_weight')?></span>
  			  <span onClick="document.getElementById('EdgeWeight').value='1'" style="cursor: pointer"  class="defaultWeigth">1</span>
  			  <span onClick="document.getElementById('EdgeWeight').value='3'" style="cursor: pointer"  class="defaultWeigth">3</span>
  			  <span onClick="document.getElementById('EdgeWeight').value='5'" style="cursor: pointer"  class="defaultWeigth">5</span>
			  <span onClick="document.getElementById('EdgeWeight').value='7'" style="cursor: pointer"  class="defaultWeigth">7</span>
			  <span onClick="document.getElementById('EdgeWeight').value='11'" style="cursor: pointer"  class="defaultWeigth">11</span>			  
			  </div>
		</fieldset>
		</form>
    </div>

    <div id="addVertex">
        <form>
        <fieldset>
            <label id="VertexTitleLable">
                <?= L('enter_vertex_title')?> &nbsp; &nbsp; &nbsp; <input type="text" name="VertextTitle" value="Title" id="VertexTitle" class="inputBox">
            </label>
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
<p id="SaveImageLinks"><a href="http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank"><?= L('open_saved_image_browser')?></a> or <a href="http://<?= $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" download><?= L('download_saved_image')?></a></p>
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


       <div id="matrixError" class="translation">
	<div><span class="bi bi-remove-sign text-danger"></span> <?= L('bad_adj_matrix_message')?></div>
       </div>

       <div id="matrixErrorInc" class="translation">
	<div><span class="bi bi-remove-sign text-danger"></span> <?= L('bad_inc_matrix_message')?></div>
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
    <p id="inputIncidenceMatrix" class="translation"><?= isset($_POST["incidenceMatrix"]) ? $_POST["incidenceMatrix"] : ""?></p>
    <p id="currentLanguage" class="translation"><?= L('current_language')?></p>
<!--
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
-->

        <script src="<?= Root("i/js/create_algorithm.js")?>" ></script>