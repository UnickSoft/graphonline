
    <head>
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/home.css')?>" />
	      <link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery-ui.theme.css')?>" />
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery-ui.css')?>" />

        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery.feedback_me.css')?>" />

        <script src="<?= Root('i/js/dev/jquery-ui.min.js')?>"></script>
<!-- No feedback supported for now        <script src="<?= Root('i/js/dev/jquery.feedback_me.js')?>"></script> -->

        <script src="<?= RootCacheJS("script/shared/config.js")?>" ></script>
        <script src="<?= RootCacheJS("script/shared/loader.js")?>" ></script>
    </head>

    <h1 style="display:inline;" id="h1Header"><?= L('title_notg')?></h1>

    <span class="hidden-phone" id="h1Text"><?= L('text')?></span>

    <section>
      <ul class="nav nav-pills" id="main-menu">
			    <li class="nav-item dropdown">
    			    <a class="dropdown-toggle btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown" href="javascript:;" role="button" aria-expanded="false" aria-haspopup="true">
			          <span class="bi bi-menu-app menu-text"></span><span class="hidden-phone menu-text"> <?= L('graph')?> </span>
              </a>
    			    <ul class="dropdown-menu" role="menu">
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="NewGraph" >
                      <span class="bi bi-plus"></span> <?= L('new_graph')?> 
                    </a>
                  </li>
                  <li style="display:none;" id="LastUsedGraphsMenu">
                    <a class="dropdown-item dropdown-toggle btn btn-sm btn-submenu" href="javascript:;" role="button">
                    <span class="bi bi-clock-history"></span> <?= L('open_last_used_graph') ?>
                    </a>
                    <ul class="dropdown-menu dropdown-submenu" id="LastUsedGraphsList">
                      <li>
                        <a class="dropdown-item btn btn-sm" href="javascript:;" role="button">Graph 1</a>
                      </li>
                      <li>
                        <a class="dropdown-item btn btn-sm" href="javascript:;" role="button">Graph 2</a>
                      </li>
                    </ul>
                  </li>
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="SaveGraph">
                      <span class="bi bi-floppy"></span> <?= L('save')?>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button"  id="SaveFullGraphImage">
                      <span class="bi bi-floppy fa-fw"></span> <?= L('save_full_image')?>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="SaveGraphImage">
                      <span class="bi bi-camera fa-fw"></span> <?= L('save_image')?>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="SavePrintGraphImage">
                      <span class="bi bi-printer fa-fw"></span> <?= L('save_print_image')?>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="SaveSvgGraphImage">
                      <span class="bi bi-filetype-svg fa-fw"></span> <?= L('save_svg_image')?>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li class="hidden-phone">
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="ExportGraph">
                      <span class="bi bi-download fa-fw"></span> <?= L('export_graph')?>
                    </a>
                  </li>
                    
                  <li class="hidden-phone">
                      <input type="file" id="ImportGraphFiles" accept=".graphml" style="display:none" onchange="handelImportGraph(this.files)">
                      <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="ImportGraph">
                        <span class="bi bi-upload fa-fw"></span> <?= L('import_graph')?>
                      </a>
                  </li>
                    
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="ShowAdjacencyMatrix">
                      <span class="bi bi-grid-3x3 fa-fw"></span> <?= L('show_adjacency_matrix')?>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="ShowIncidenceMatrix">
                      <span class="bi bi-grid-3x3 fa-fw"></span> <?= L('show_incidence_matrix')?>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="ShowDistanceMatrix">
                      <span class="bi bi-grid-3x3 fa-fw"></span> <?= L('distMatrixText')?>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="GroupRename">
                      <span class="bi bi-pencil fa-fw"></span> <?= L('group_rename')?>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li>
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="DeleteAll">
                      <span class="bi bi-trash fa-fw"></span> <?= L('delete_all')?>
                    </a>
                  </li>
              </ul>
          </li>
          <li class="nav-item dropdown">
              <a class="dropdown-toggle btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown" href="javascript:;" role="button" aria-expanded="false" aria-haspopup="true">
                <span class="bi bi-zoom-in menu-text"></span> <span class="hidden-phone menu-text"><?= L('view')?></span>
              </a>
              <ul class="dropdown-menu" role="menu">
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="Zoom100"><span class="bi bi-zoom-in fa-fw"></span> 100% </a> 
                  </li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="Zoom50"><span class="bi bi-zoom-in fa-fw"></span> 50% </a> 
                  </li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="Zoom25"><span class="bi bi-zoom-in fa-fw"></span> 25% </a> 
                  </li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button"  id="ZoomFit"><span class="bi bi-zoom-in fa-fw"></span> <?= L('zoom_fit') ?></a> 
                  </li>
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button"  id="ZoomIn"><span class="bi bi-zoom-in fa-fw"></span> <?= L('zoom_in') ?> <span style="float:right">+</span></a>
                  </li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button"  id="ZoomOut">
                      <span class="bi bi bi-zoom-out fa-fw"></span> <?= L('zoom_out') ?> <span style="float:right">-</span>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button"  id="MoveWorspace"><span class="bi bi-fullscreen fa-fw"></span> <?= L('move_workspace') ?> </a> 
                  </li>
              </ul>
          </li>
          <li class="nav-item">
            <a class="btn btn-sm btn-outline-secondary" href="javascript:;" role="button" id="Default">
              <span class="bi bi-cursor menu-text"></span><span class="hidden-phone menu-text"> <?= L('default')?> <sub style="color:#AAAAAA">m</sub></span>
            </a>
          </li>
          <li class="nav-item">
            <a class="btn btn-sm btn-outline-secondary" href="javascript:;" role="button" id="AddGraph">
              <span class="bi bi-plus menu-text"></span><span class="hidden-phone menu-text"> <?= L('add_node')?> <sub style="color:#AAAAAA">v</sub></span>
            </a>
          </li>
          <li class="nav-item">
            <a class="btn btn-sm btn-outline-secondary" href="javascript:;" role="button" id="ConnectGraphs">
              <span class="bi bi-share menu-text"></span><span class="hidden-phone menu-text"> <?= L('connect_nodes')?> <sub style="color:#AAAAAA">e</sub></span>
            </a>
          </li>
          <!-- Algorithms -->
          <li class="nav-item">
              <a class="dropdown-toggle btn btn-sm btn-outline-secondary" id="openAlgorithmList" data-bs-toggle="dropdown" href="javascript:;" role="button" aria-expanded="false" aria-haspopup="true">
                <span class="bi bi-calculator menu-text"></span><span class="hidden-phone menu-text"> <?= L('algorithms') ?> </span><span class="caret"></span>
              </a>
              <ul class="dropdown-menu dropdown-menu-right multi-column columns-2" role="menu" id="algorithmList">
                  <div class="row">
                    <div class="col-sm-6">
                      <ul id="algorithmCategoryElements1" class="multi-column-dropdown">
                        <li id="algTopic1" style="display: none;">
                          <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="">
                            <span class="bi bi-search fa-fw"></span> <span></span>
                          </a>
                        </li>
                        <span id="insert1"></span>
                      </ul>
                    </div>
                    <div class="col-sm-6">
                      <ul id="algorithmCategoryElements0" class="multi-column-dropdown">
                        <li id="algTopic0" style="display: none;">
                            <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="">
                              <span class="bi bi-search fa-fw"></span> <span></span>
                            </a>
                        </li>
                        <span id="insert0"></span>
                      </ul>
                    </div>
                  </div>
              </ul>
          </li>
          <li class="nav-item">
            <a class="btn btn-sm btn-outline-secondary" href="javascript:;" role="button"  id="DeleteObject">
              <span class="bi bi-eraser menu-text"></span><span class="hidden-phone menu-text"> <?= L('delete')?> <sub style="color:#AAAAAA">r</sub></span>
            </a>
          </li>
          <li class="nav-item dropdown hidden-phone">
              <a class="dropdown-toggle btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown" href="javascript:;" role="button" aria-expanded="false" aria-haspopup="true" id="openSettings">
                <span class="bi bi-tools menu-text"></span><span class="menu-text"> <?= L('settings')?> </span>
              </a>
              <ul class="dropdown-menu dropdown-menu-right" role="menu" id="Settings">
                  <li>
                    <a class="dropdown-item dropdown-toggle btn btn-sm btn-submenu" href="javascript:;" role="button">
                    <span class="bi bi-brush"></span> <?= L('styles')?>
                    </a>
                    <ul class="dropdown-menu dropdown-submenu" id="LastUsedGraphsList">
                      <li>
                        <a class="dropdown-item btn btn-sm" href="javascript:;" role="button" id="ApplyDefaultStyle"><?= L('default_style')?></a>
                      </li>
                      <li>
                        <a class="dropdown-item btn btn-sm" href="javascript:;" role="button" id="ApplyNightStyle"><?= L('night_style')?></a>
                      </li>
                      <li>
                        <a class="dropdown-item btn btn-sm" href="javascript:;" role="button" id="ApplyLargeStyle"><?= L('large_high_contrast_style')?></a>
                      </li>
                    </ul>
                  </li>
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="SetupVertexStyle"><span class="bi bi-1-circle"></span> <?= L('common_vertex_settings')?></a>
                  </li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="SetupVertexStyleSelected"><span class="bi bi-1-circle-fill"></span> <?= L('selected_vertex_settings')?></a>
                  </li>
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="SetupEdgeStyle"><span class="bi bi-arrow-up-right"></span> <?= L('common_edge_settings')?></a>
                  </li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="SetupEdgeStyleSelected"><span class="bi bi-arrow-up-right"></span> <?= L('selected_edge_settings')?></a>
                  </li>
                  <li><hr class="dropdown-divider hidden-phone"></li>
                  <li> 
                    <a class="dropdown-item btn btn-sm btn-submenu" href="javascript:;" role="button" id="SetupBackgroundStyle"><span class="bi bi-back"></span> <?= L('background_style') ?></a>
                  </li>
              </ul>
          </li>
          <li class="nav-item">
            <a class="btn btn-sm btn-outline-secondary" href="javascript:;" role="button" id="GraphUndo">
              <span class="bi bi-arrow-left menu-text"></span><span class="hidden-phone menu-text"> <?= L('undo')?> <sub style="color:#AAAAAA">crtl+z</sub></span>
            </a>
          </li>
          <!--
              <? if (!$wasVote && count($voteTopics) > 0): ?>
              <button type="button" class="btn btn-success" id="VoteButton"><span class="bi bi-thumbs-up"></span> <?= L('vote') ?></button>
              <? endif ?>
              -->
          <!--
              <button type="button" class="btn btn-default" id="Test"><span class="bi bi-remove"></span> Test repos</button>
              -->
      </ul>
    </section>

    <section>
	<div id="message" class="alert alert-success" role="alert">Graph</div>
    </section>

    <section id="canvasSection">
    <span id="CanvasMessage"></span>
    <input type="text" id="CanvasSearchText" class="form-control form-control-sm hidden-phone" placeholder="⌕ <?= L('vertex_name_place_holder') ?>" list="vertexListCanvas"/>
    <datalist id="vertexListCanvas">
    </datalist>
    
    <span class="bi bi-arrow-down-left icon-300" id="ShowArrow"></span>
    
    <button type="button" class="btn btn-default btn-sm hidden-phone" id="Fullscreen"><span class="bi bi-arrows-fullscreen" id="FullscreenIcon"></span></button>
    <canvas id="canvas"><?= L('browser_no_support')?></canvas>
    <div id="developerTools" class="well well-sm">
        <h4><?= L('developer_tools_title')?></h4> <span class="bi bi-arrows-fullscreen fa-fw leftTopPosition" id="devToolsZoom"></span>
        <span><?= L('developer_tools_text')?></span>
        <textarea id="userScript">
        </textarea>
        <input type="button" value="<?= L('developer_tools_run')?>" id="runUserScript" class="btn btn-success btn-sm"/>
        <input type="button" value="<?= L('developer_tools_submit')?>" id="submitUserScript" class="btn btn-default btn-sm" style="float: right;"/>
    </div>

    <div id="contextMenu" class="dropdown clearfix white-btn">
        <div id="edgeContextMenu">
          <div class="btn-group btn-group-vertical">
            <button type="button" class="btn btn-default btn-sm btn-submenu" id="Context_Edit_Edge"><?= L('edit_weight')?></button>
            <button type="button" class="btn btn-default btn-sm btn-submenu" id="Context_Delete_Edge"><?= L('delete')?></button>
          </div>
        </div>
        <div id="vertexContextMenu">
          <div class="btn-group btn-group-vertical">
            <button type="button" class="btn btn-default btn-sm btn-submenu" id="Context_Connect"><?= L('connect_nodes')?></button>
            <button type="button" class="btn btn-default btn-sm btn-submenu" id="Context_Rename"><?= L('rename_vertex')?></button>
            <button type="button" class="btn btn-default btn-sm btn-submenu" id="Context_Delete"><?= L('delete')?></button>
          </div>
        </div>
        <div id="backgroundContextMenu">
          <div class="btn-group btn-group-vertical">
            <button type="button" class="btn btn-default btn-sm btn-submenu" id="Context_Add_Vertex"><?= L('add_node')?></button>
            <button type="button" class="btn btn-default btn-sm btn-submenu" id="Context_Back_Color"><?= L('background_style') ?></button>
          </div>
        </div>
      </div>
    </div>    
    </section>

<?php if (L('current_language') == "en" && false): ?>

    <section style="height:32px;text-align: center;" id="bottom_info" class="hidden-phone">
    <a class="ProgresssBarLink" href="https://docs.google.com/spreadsheets/d/1iLswxMsTwfEu56RjW21nCov2LS_A-OJlmfJZ-j4Cj80/edit?usp=sharing" target="_blank">
    <div class="ProgressBar" style="height:32px">
        <div class="ProgressBarFill" style="width:0%;"></div>
        <span class="ProgressBarText" style="top:-28px">You may help us with translation to Portuguese</span>
    </div>
    </a>
    </section>


<?php elseif (L('current_language') == "ru" && false): ?>
<section id="bottom_adv">
  <section style="height:50px;text-align: center;" id="bottom_info" class="hidden-phone">


  </section>  
    </section>

<!--
  <section style="height:32px;text-align: center;" id="bottom_info" class="hidden-phone">

  <a class="ProgresssBarLink" href="/donate" target="_blank">
  <div class="ProgressBar" style="height:32px">
      <div class="ProgressBarFill" style="width:<?= intval($donates / $totalDonate * 100) ?>%;"></div>
      <span class="ProgressBarText" style="top:-28px"><p>Поддержите наш проект: сбор средств добавления новых алгоритмов.</p></span>
  </div>
  </a>
-->
<?php else: ?>
    <section style="height:32px;text-align: center;" id="bottom_info" class="hidden-phone">
    <a class="ProgresssBarLink" href="mailto:admin@graphonline.ru" target="_blank">
    <div class="ProgressBar" style="height:32px">
        <div class="ProgressBarFill" style="width:0%;"></div>
        <span class="ProgressBarText" style="top:-28px"><p><?= L('we_are_improving')?></p></span>
    </div>
    </a>
    </section>

<?php endif; ?>

    <section class="translation" style="display:none;">
    <div id="addEdge">
		<form>
		<fieldset>
              <div id="MainEdgeWeightControl">
                    <table id="EdgeWeightControls">
                      <tr>
                      <td rowspan="2">
                          <label id="WeightLabel"><?= L('edge_weight')?>&nbsp; </label> 
                      </td>
                      <td>
                        <input type="text" name="edgeWeight" value="<?= L('default_weight')?>" id="EdgeWeight" class="inputBox">
                      </td>
                      </tr>
                      <tr>
                      <td>
                        <input type="range" id="EdgeWeightSlider" min="0" max="29" value="0" oninput="document.getElementById('EdgeWeight').value = (this.value > 0 ? this.value : '<?= L('default_weight')?>');" onchange="document.getElementById('EdgeWeight').value = (this.value > 0 ? this.value : '<?= L('default_weight')?>');">
                      </td>
                      </tr>
                    </table>
                    <div id="EdgesPresets">
                      <span onClick="document.getElementById('EdgeWeight').value='<?= L('default_weight')?>'; document.getElementById('EdgeWeightSlider').value=0;" style="cursor: pointer" class="defaultWeigth"><?= L('default_weight')?></span>
                      <span onClick="document.getElementById('EdgeWeight').value='1'; document.getElementById('EdgeWeightSlider').value=1;" style="cursor: pointer"  class="defaultWeigth">1</span>
                    </div>
              </div>
              <div id="NewEdgeAction">
                <div class="InlineStyle PaddingRight">
                  <input class="form-check-input" type="radio" name="NewEdgeActionValue" id="RadiosReplaceEdge" value="replace" checked>
                  <label for="RadiosReplaceEdge">
                    <?= L('replace_edge')?>
                  </label>
                </div>
                <div class="InlineStyle PaddingRight">
                  <input class="form-check-input" type="radio" name="NewEdgeActionValue" id="RadiosAddEdge" value="add">
                  <label for="RadiosAddEdge" id="RadiosAddEdgeLabel">
                    <?= L('add_edge')?>
                  </label>
                </div>
              </div>

              <small>
                <div id="EdgeLabelControls">
                  <label id="EdgeLabel"><?= L('text_above_edge')?></label>&nbsp;&nbsp;<input type="text" name="edgeLable" value="" id="EdgeLable" class="inputBox">
                </div>

                <div class="PaddingRight small-top-marging" id="defaultEdgeDialogBlock">
                  <input class="form-check-input" type="checkbox" name="SaveDefaultEdge" id="CheckSaveDefaultEdge" value="saveAsDefault">
                  <label for="CheckSaveDefaultEdge">
                    <?= L('save_edge_for_future')?>
                  </label>
                </div>
              </small>
		</fieldset>
		</form>
    </div>

    <div id="addVertex">
        <form>
        <fieldset>
            <label id="VertexTitleLable">
                <p><?= L('enter_vertex_title')?></p> <input type="text" name="VertextTitle" value="Title" id="VertexTitle" class="inputBox">
            </label>
            <br/><br/><button type="button" id="groupRenameButton" class="btn btn-outline-secondary btn-sm menu-text hidden-phone"> <?= L('group_rename')?> </button>
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
				<p style="margin-bottom: 0.5rem;"><?= L('adjacency_matrix_description')?></p>
        <p id="AdjacencyMatrixMultiGraphDesc"><?= L('adjacency_matrix_multigraph_description')?></p>
        <div class="matrix-wrapper">
          <div class="corner"><span class="bi bi-arrow-90deg-right"></span></div>

          <div class="top-text-wrap" id="adjacencyMatrix_top_text">
            <div class="top-text" id="adjacencyMatrix_top_text_text"></div>
          </div>

          <div class="side-text-wrap" id="adjacencyMatrix_side_text">
            <div class="side-text" id="adjacencyMatrix_side_text_text"></div>
          </div>

          <textarea class="matrix" name="adjacencyMatrixField" id="AdjacencyMatrixField" wrap="off"></textarea>
        </div>
				<p id="BadMatrixFormatMessage"><?= L('adjacency_matrix_bad_format')?></p>
		</fieldset>
		</form>
    </div>

	<div id="incidenceMatrix">
		<form>
		<fieldset>
				<p style="margin-bottom: 0.5rem;"><?= L('incidence_matrix_description')?></p>				
				
        <div class="matrix-wrapper">

          <div class="side-text-wrap" id="incidenceMatrix_side_text">
            <div class="side-text" id="incidenceMatrix_side_text_text"></div>
          </div>

          <textarea class="matrix" name="incidenceMatrixField" id="IncidenceMatrixField" wrap="off"></textarea>
        </div>

				<p id="BadIncidenceMatrixFormatMessage"><?= L('incidence_matrix_bad_format')?></p>
		</fieldset>
		</form>
       </div>
        
	<div id="floidMatrix">
		<form>
		<fieldset>
				<p style="margin-bottom: 0.5rem;"><?= L('min_dist_matrix_description') ?></p>

        <div class="matrix-wrapper">
          <div class="corner"><span class="bi bi-arrow-90deg-right"></span></div>

          <div class="top-text-wrap" id="floidMatrix_top_text">
            <div class="top-text" id="floidMatrix_top_text_text"></div>
          </div>

          <div class="side-text-wrap" id="floidMatrix_side_text">
            <div class="side-text" id="floidMatrix_side_text_text"></div>
          </div>

          <textarea class="matrix" name="floidMatrixField" id="FloidMatrixField" wrap="off"></textarea>
        </div>
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
<? 
   $shareImagePageURL = $_SERVER['SERVER_NAME'] . "/";
   $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
?>
<p id="SaveImageLinks"><a href="<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank"><?= L('open_saved_image_browser')?></a> <?= L('or')?> <a href="<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" download><?= L('download_saved_image')?></a>
</p>
<p class="hidden-phone">
<a href="<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" class="hidden-phone showShareImage" id="showSavedImageGraphRef"><img src="<?= $protocol . $shareImagePageURL ?>/tmp/saved/XX/XXXXX.png" id="showSavedImageGraph" class="showShareImage"></a>
</p>
<p><?= L('share_graph_description') ?></p>
<ul class="share-buttons" id="ShareSavedImageGraph">
<li><a href="http://vkontakte.ru/share.php?url=<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png&text=<?= L('share_graph_text') ?>" target="_blank" title="Share on Vkontate"><i class="fa fa-vk fa-2x"></i></a></li>
<li><a href="https://www.facebook.com/sharer/sharer.php?u=<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png&t=<?= L('share_graph_text') ?>" target="_blank" title="Share on Facebook"><i class="fa fa-facebook-square fa-2x"></i></a></li>
<li><a href="https://twitter.com/intent/tweet?source=<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png&text=<?= L('share_graph_text') ?> <?= $protocol . $sharePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" title="Tweet"><i class="fa fa-twitter-square fa-2x"></i></a></li>
<li><a href="https://plus.google.com/share?url=<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" title="Share on Google+"><i class="fa fa-google-plus-square fa-2x"></i></a></li>
<li><a href="http://www.linkedin.com/shareArticle?mini=true&url=<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png&title=<?= L('share_graph_text') ?>&summary=<?= L('share_graph_text') ?> &source=<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" title="Share on LinkedIn"><i class="fa fa-linkedin-square fa-2x"></i></a></li>
<li><a href="mailto:?subject=<?= L('share_graph_text') ?>&body=<?= $protocol . $shareImagePageURL ?>tmp/saved/XX/XXXXX.png" target="_blank" title="Email"><i class="fa fa-envelope fa-2x"></i></a></li>
</ul>

</fieldset>
</form>
</div>

	<div id="sentAlgorithm" title="<?= L('algorithm_was_sent')?>">
		  <p><?= L('your_algorithm_was_sent')?></p>
    </div>


       <div id="matrixError" class="translation">
	<div><span class="bi bi-exclamation-octagon-fill text-danger"></span> <?= L('bad_adj_matrix_message')?></div>
       </div>

       <div id="matrixErrorInc" class="translation">
	<div><span class="bi bi-exclamation-octagon-fill text-danger"></span> <?= L('bad_inc_matrix_message')?></div>
       </div>

       <div id="pairErrorInc" class="translation">
	<div><span class="bi bi-exclamation-octagon-fill text-danger"></span> <?= L('bad_inc_pair_message')?></div>
       </div>       

    <div id="graphMaxVerexLimit" class="translation">
	      <div><span class="bi bi-exclamation-octagon-fill text-danger"></span> <?= L('graph_is_to_large')?></div>
        <div><span class="bi bi-info-circle-fill text-info"></span> <?= L('algorith_supports_max_limit')?></div>
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
        
    <div id="SetupVertexStyleDialog">
        <form class="pb-2">
		    <fieldset>
          <div class="form-group row" id="VertexSelectedIndexForm">
            <label for="vertexSelectedIndex" class="col-sm-5 col-form-label"><?= L('selected_index')?></label>
            <div class="col-sm-5">
              <select id="vertexSelectedIndex" class="form-select">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="all"><?= L('all')?></option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="vertexFillColor" class="col-sm-5 col-form-label"><?= L('common_color') ?></label>
            <div class="col-sm-5">
              <input type="color" class="form-control" id="vertexFillColor" value="#FFAA22" list="vertexFillColorPreset">
              <datalist id="vertexFillColorPreset">
              </datalist>
            </div>
          </div>
          <div class="form-group row">
            <label for="vertexStrokeColor" class="col-sm-5 col-form-label"><?= L('stroke_color') ?></label>
            <div class="col-sm-5">
              <input type="color" class="form-control" id="vertexStrokeColor" value="#FFAA22" list="vertexStrokeColorPreset">
              <datalist id="vertexStrokeColorPreset">
              </datalist>              
            </div>
          </div>
          <div class="form-group row">
            <label for="vertexStrokeSize" class="col-sm-5 col-form-label"><?= L('stroke_size') ?></label>
            <div class="col-sm-5">
              <input type="number" class="form-control" id="vertexStrokeSize" placeholder="10" min="0">
            </div>
          </div>
          <div class="form-group row">
            <label for="textSize" class="col-sm-5 col-form-label"><?= L('text_size') ?></label>
            <div class="col-sm-5">
              <input type="number" class="form-control" id="textSize" placeholder="10" min="5" min="500">
            </div>
          </div>
          <div class="form-group row small-bottom-marging">
            <label for="vertexTextColor" class="col-sm-5 col-form-label"><?= L('text_color') ?></label>
            <div class="col-sm-5">
                <input type="color" class="form-control" id="vertexTextColor" value="#FFAA22" list="vertexTextColorPreset">
                <datalist id="vertexTextColorPreset">
                </datalist>                     
            </div>
          </div>
          <div class="form-group row small-bottom-marging">
            <label for="upVertexTextColor" class="col-sm-5 col-form-label"><?= L('additional_text_color') ?></label>
            <div class="col-sm-5">
                <input type="color" class="form-control" id="upVertexTextColor" value="#FFAA22" list="upVertexTextColorPreset">
                <datalist id="upVertexTextColorPreset">
                </datalist>
            </div>
          </div>
          <div class="form-group row">
            <label for="commonTextPosition" class="col-sm-5 col-form-label"><?= L('text_position') ?></label>
            <div class="col-sm-5">
              <select id="commonTextPosition" class="form-select">
                <option value="0"><?= L('center') ?></option>
                <option value="1"><?= L('on_up') ?></option>
              </select>
            </div>
          </div>                    
          <div class="form-group row">
            <label for="vertexShape" class="col-sm-5 col-form-label"><?= L('shape')?></label>
            <div class="col-sm-5">
              <select id="vertexShape" class="form-select">
                <option value="0"><?= L('circle')?></option>
                <option value="1"><?= L('squere')?></option>
                <option value="2"><?= L('triangle')?></option>
                <option value="3"><?= L('pentagon')?></option>
                <option value="5"><?= L('textbox')?></option>
                <option value="6"><?= L('snowflake')?></option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="vertexSize" class="col-sm-5 col-form-label"><?= L('vertex_diameter')?> </label>
            <div class="col-sm-5">
              <input type="number" class="form-control" id="vertexSize" placeholder="10" min="10" min="100">
            </div>
          </div>     
        </fieldset>
        </form>
        
        <canvas id="VertexPreview" width="350" height="150"></canvas>
    </div>
        
    <div id="SetupEdgeStyleDialog">
        <form class="pb-2">
		    <fieldset>
          <div class="form-group row" id="EdgeSelectedIndexForm">
            <label for="edgeSelectedIndex" class="col-sm-5 col-form-label"><?= L('selected_index')?></label>
            <div class="col-sm-5">
              <select id="edgeSelectedIndex" class="form-select">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="all"><?= L('all')?></option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="edgeStrokeColor" class="col-sm-5 col-form-label"><?= L('common_color') ?></label>
            <div class="col-sm-5">
              <input type="color" class="form-control" id="edgeStrokeColor" value="#FFAA22" list="edgeStrokeColorPreset">
              <datalist id="edgeStrokeColorPreset">
              </datalist>              
            </div>
          </div>
          <div class="form-group row">
            <label for="edgeTextSize" class="col-sm-5 col-form-label"><?= L('text_size') ?></label>
            <div class="col-sm-5">
              <input type="number" class="form-control" id="edgeTextSize" placeholder="10" min="5" min="500">
            </div>
          </div>
          <div class="form-group row small-bottom-marging">
            <label for="edgeTextColor" class="col-sm-5 col-form-label"><?= L('text_color') ?></label>
            <div class="col-sm-5">
              <input type="color" class="form-control" id="edgeTextColor" value="#FFAA22" list="edgeTextColorPreset">
              <datalist id="edgeTextColorPreset">
              </datalist>                 
            </div>
          </div>
          <div class="form-group row small-bottom-marging">
            <label for="weightEdgeTextColor" class="col-sm-5 col-form-label"><?= L('additional_text_color') ?></label>
            <div class="col-sm-5">
              <input type="color" class="form-control" id="weightEdgeTextColor" value="#FFAA22" list="weightEdgeTextColorPreset">
              <datalist id="weightEdgeTextColorPreset">
              </datalist>            
            </div>
          </div>
          <div class="form-group row">
            <label for="weightTextPosition" class="col-sm-5 col-form-label"><?= L('weight_position') ?></label>
            <div class="col-sm-5">
              <select id="weightTextPosition" class="form-select" >
                <option value="0"><?= L('center') ?></option>
                <option value="1"><?= L('on_up') ?></option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="edgeFillColor" class="col-sm-5 col-form-label"><?= L('text_background') ?></label>
            <div class="col-sm-5">
              <input type="color" class="form-control" id="edgeFillColor" value="#FFAA22" list="edgeFillColorPreset">
              <datalist id="edgeFillColorPreset">
              </datalist>                     
            </div>
          </div>
          <div class="form-group row">
            <label for="edgeStyle" class="col-sm-5 col-form-label"><?= L('line_style') ?></label>
            <div class="col-sm-5">
              <select id="edgeStyle" class="form-select">
                <option value="0">Solid</option>
                <option value="1">Dotted</option>
                <option value="2">Dashed</option>
                <option value="3">Dashdotted</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="edgeWidth" class="col-sm-5 col-form-label"><?= L('edge_width') ?></label>
            <div class="col-sm-5">
              <input type="number" class="form-control" id="edgeWidth" placeholder="3" min="1" min="20">
            </div>
          </div>          
        </fieldset>
        </form>
        
        <canvas id="EdgePreview" width="350" height="150"></canvas>
    </div>
        
    <div id="SetupBackgroundStyleDialog">
        <form>
		    <fieldset>
          <div class="form-group row">
            <label for="bacgkroundColor" class="col-sm-5 col-form-label"><?= L('color') ?></label>
            <div class="col-sm-5">
              <input type="color" class="form-control" id="backgroundColor" value="#FFAA22">
            </div>
          </div>
          <div class="form-group row">
            <label for="backgroundTransporent" class="col-sm-5 col-form-label"><?= L('alpha') ?></label>
            <div class="col-sm-5">
              <input type="range" min="0" max="1" step="0.1" id="backgroundTransporent">
            </div>
          </div>
          <div class="form-group row">
            <label for="formFile" class="col-sm-5 col-form-label"><?= L('background_image') ?></label>
            <div class="col-sm-7">
              <input type="file" id="ImportBackgroundImage" accept="image/jpg, image/png, image/jpeg" style="display:none">
              <button type="button" id="LoadBackgroundFile" class="btn btn-default btn-xs">
                <span class="bi bi-upload" aria-hidden="true"></span>
                <?= L('upload') ?>
              </button>
              <button type="button" id="RemoveBackgroundFile" class="btn btn-default btn-xs" title="<?= L('remove_background_image') ?>">
                <span class="bi bi-trash" aria-hidden="true"></span>
              </button>
              <!-- <input type="button" value="Browse..." onclick="document.getElementById('selectedFile').click();" /> -->
              <!-- <input class="form-control" type="file" id="backgroundFile"> -->
            </div>
          </div>
        </fieldset>
        </form>
        
        <canvas id="BackgroundPreview" width="300" height="150" style="border: 1px solid;"></canvas>

        <div id="UploadBackgroundImageError" class="alert alert-danger" role="alert" style="display: none"></div>
    </div>

    <div id="autoSaveOrOriginalGraph">
      <form>
        <fieldset>
        <p><?= L('you_have_autosave') ?></br><b><?= L('load_oiginal_or_autosaved') ?></b></p>
        <div class="form-group row">
          <div class="col-sm-6">
            <p><?= L('original_graph') ?></p>
            <canvas id="OriginalGraphpPreview" width="300" height="200" style="border: 1px solid;"></canvas>
            <div>
              <button type="button" class="btn btn-default btn-xs zoom-plus" title="+">
                <span class="bi bi-zoom-in" aria-hidden="true"></span>
              </button>
              <button type="button" class="btn btn-default btn-xs zoom-minus" title="-">
                <span class="bi bi-zoom-out" aria-hidden="true"></span>
              </button>
              <span><?= L('use_mouse_for_moving') ?></span>
            </div>
          </div>
          <div class="col-sm-6">
            <p><?= L('autosaved_graph') ?></p>
            <canvas id="AutoSaveGraphpPreview" width="300" height="200" style="border: 1px solid;"></canvas>
            <div>
              <button type="button" class="btn btn-default btn-xs zoom-plus" title="+">
                <span class="bi bi-zoom-in" aria-hidden="true"></span>
              </button>
              <button type="button" class="btn btn-default btn-xs zoom-minus" title="-">
                <span class="bi bi-zoom-out" aria-hidden="true"></span>
              </button>
              <span><?= L('use_mouse_for_moving') ?></span>
            </div>
          </div>
        </div>
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
    <p id="inputMatrix" class="translation"><?= isset($_POST["matrix"]) ? htmlspecialchars ($_POST["matrix"]) : ""?></p>
    <p id="separator" class="translation"><?= isset($_POST["separator"]) ? htmlspecialchars ($_POST["separator"]) : ""?></p>
    <p id="inputIncidenceMatrix" class="translation"><?= isset($_POST["incidenceMatrix"]) ? htmlspecialchars ($_POST["incidenceMatrix"]) : ""?></p>
    <p id="inputPair" class="translation"><?= isset($_POST["pairs"]) ? str_replace("<", "&lt;", str_replace(">", "&gt;", $_POST["pairs"])) : ""?></p>
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
        
    <p id="selectStartVertexForMaxFlow" class="translation"><?= L('selectStartVertexForMaxFlow')?></p>
    <p id="selectFinishVertexForMaxFlow" class="translation"><?= L('selectFinishVertexForMaxFlow')?></p>
    <p id="maxFlowResult" class="translation"><?= L('maxFlowResult')?></p>
    <p id="flowNotExists" class="translation"><?= L('flowNotExists')?></p>
        
    <p id="sourceVertex" class="translation"><?= L('sourceVertex')?></p>
    <p id="sinkVertex" class="translation"><?= L('sinkVertex')?></p>
        
    <p id="hasNotHamiltonianLoop" class="translation"><?= L('has_not_hamiltonian_loop')?></p>
    <p id="hasHamiltonianLoop" class="translation"><?= L('has_hamiltonian_loop')?></p>
        
    <p id="hasNotHamiltonianPath" class="translation"><?= L('has_not_hamiltonian_path')?></p>
    <p id="hasHamiltonianPath" class="translation"><?= L('has_hamiltonian_path')?></p>
        
    <p id="startTraversal" class="translation"><?= L('start_traversal')?></p>
    <p id="traversalOrder" class="translation"><?= L('traversal_order')?></p>

    <p id="curveEdge" class="translation"><?= L('curve_edge')?></p>
    <p id="undoTranslate" class="translation"><?= L('undo')?></p>
    <p id="saveGraph" class="translation"><?= L('save_graph')?></p>
    <p id="default" class="translation"><?= L('default')?></p>
    <p id="vertexDrawStyle" class="translation"><?= L('vertex_draw_style')?></p>
    <p id="edgeDrawStyle" class="translation"><?= L('edge_draw_style')?></p>
    <p id="backgroundStyle" class="translation"><?= L('background_style')?></p>
        
    <p id="graphIsMultiMessage" class="translation"><?= L('graph_is_multi_message')?></p>
    <p id="graphIsGeneralMessage" class="translation"><?= L('graph_is_general_message')?></p>
    <p id="defaultWeightPreset" class="translation"><?= L('default_weight')?></p>
        
    <p id="selectGroupMac" class="translation"><?= L('select_groupe_mac')?></p>
    <p id="selectGroupWin" class="translation"><?= L('select_groupe_win')?></p>
    <p id="dragSelectedGroup" class="translation"><?= L('drag_select_group')?></p>
    <p id="copySelectedGroup" class="translation"><?= L('copy_select_group')?></p>
    <p id="removeSelectedGroup" class="translation"><?= L('remove_select_group')?></p>
        
    <p id="BFSName" class="translation"><?= L('bfs_name')?></p>
    <p id="ColoringName" class="translation"><?= L('coloring_name')?></p>
    <p id="findConnectedComponent" class="translation"><?= L('find_connection_component_name')?></p>
    <p id="DFSName" class="translation"><?= L('dfs_name')?></p>
    <p id="EulerinLoopName" class="translation"><?= L('eulerin_loop_name')?></p>
    <p id="EulerinPath" class="translation"><?= L('eulerin_path_name')?></p>
    <p id="FloidName" class="translation"><?= L('fiold_name')?></p>
    <p id="GraphReorder" class="translation"><?= L('graph_reorder_name')?></p>
    <p id="HamiltoianCycleName" class="translation"><?= L('hamiltoian_cycle_name')?></p>
    <p id="HamiltonianPath" class="translation"><?= L('hamiltonian_path_name')?></p>
    <p id="MaxFlowName" class="translation"><?= L('max_flow_name')?></p>
    <p id="minimumSpanningTree" class="translation"><?= L('minimum_spanning_tree')?></p>
    <p id="modernGraphStyleName" class="translation"><?= L('modern_graph_style_name')?></p>
    <p id="RadiusAndDiameter" class="translation"><?= L('radius_and_diameter_name')?></p>
    <p id="findShortPathName" class="translation"><?= L('find_short_path_name')?></p>
    <p id="findShortPathBellmanFordName" class="translation"><?= L('find_short_path_belman_ford_name')?></p>

    <p id="VerticesDegreeName" class="translation"><?= L('vertices_degree_name')?></p>
        
    <p id="MinSpanningTreeResult" class="translation"><?= L('min_spanning_tree_res_is')?></p>
    <p id="MinSpanningIgnoreDir" class="translation"><?= L('min_spanning_tree_ignore_direction')?></p>
    <p id="MinSpanningNotConnected" class="translation"><?= L('min_spanning_tree_graph_not_connected')?></p>

    <!-- IsomorphismCheck.js -->
    <p id="SelectFirstGraphIsomorphismCheck" class="translation"><?= L('select_first_graph_isomorphism_check')?></p>
    <p id="SelectSecondGraphIsomorphismCheck" class="translation"><?= L('select_second_graph_isomorphism_check')?></p>    
    <p id="SelectFirstGraphPatternCheck" class="translation"><?= L('select_first_graph_pattern_check')?></p>
    <p id="SelectSecondGraphForSearchSubgraph" class="translation"><?= L('select_second_graph_for_search_subgraph')?></p>
    <p id="GraphsIsomorph" class="translation"><?= L('graphs_isomorph')?></p>
    <p id="GraphsNotIsomorph" class="translation"><?= L('graphs_not_isomorph')?></p>
    <p id="NumberOfIsomorphSubgraphIs" class="translation"><?= L('number_of_isomorph_subgraph_is')?></p>
    <p id="GraphHasNoIsomorphSubgraph" class="translation"><?= L('graph_has_no_isomorph_subgraph')?></p>
    <p id="SearchIsomorphSubgraph" class="translation"><?= L('search_isomorph_subgraph')?></p>
    <p id="SubgraphNo" class="translation"><?= L('subgraph_no')?></p>
    <p id="GraphHasNoAtleast2Graphs" class="translation"><?= L('graph_has_no_atleast_2_graphs')?></p>
    <p id="IsomorphismCheck" class="translation"><?= L('isomorphism_check')?></p>

    <!-- RadiusAndDiameter.js -->
    <p id="GraphIsDisconnected" class="translation"><?= L('graph_is_disconnected')?></p>
    <p id="GraphIsTrivial" class="translation"><?= L('graph_is_trivial')?></p>
    <p id="GraphRadius" class="translation"><?= L('graph_radius')?></p>
    <p id="GraphDiameter" class="translation"><?= L('graph_diameter')?></p>
    <p id="VertexCentral" class="translation"><?= L('vertex_central')?></p>
    <p id="VertexPeripheral" class="translation"><?= L('vertex_peripheral')?></p>

    <!-- VerticesDegree.js -->
    <p id="MaximumDegreeOfGraph" class="translation"><?= L('maximum_degree_of_graph')?></p>

    <!-- Coloring.js -->
    <p id="ColorNumber" class="translation"><?= L('color_number')?></p>

    <p id="Done" class="translation"><?= L('done')?></p>

    <p id="ActionText" class="translation"><?= L('action')?></p>
    <p id="CommonEdgeStyleText" class="translation"><?= L('common_edge_style')?></p>
    <p id="SelectedEdgeStyleText" class="translation"><?= L('selected_edge_style')?></p>
    <p id="CommonVertexStyleText" class="translation"><?= L('common_vertex_style')?></p>
    <p id="SelectedVertexStyleText" class="translation"><?= L('selected_vertex_style')?></p>

    <!-- FindAllPatches.js -->
    <p id="FindAllPathes" class="translation"><?= L('find_all_pathes')?></p>
    <p id="NumberOfPathesFrom" class="translation"><?= L('number_of_pathes_from')?></p>
    <p id="To" class="translation"><?= L('to')?></p>
    <p id="Are" class="translation"><?= L('are')?></p>
    <p id="PathN" class="translation"><?= L('path_n')?></p>
    <p id="SelectFinishVertex" class="translation"><?= L('selected_finish_vertex')?></p>
    <p id="SelectStartVertex" class="translation"><?= L('selected_start_vertex')?></p>

    <p id="findAllPathsFromVertex" class="translation"><?= L('find_all_paths_from_vertex')?></p>
    <p id="distanceFrom" class="translation"><?= L('distance_from')?></p>
    <p id="pathTo" class="translation"><?= L('path_to')?></p>
    <p id="UseContextMenuText" class="translation"><?= L('use_context_menu')?></p>
    
    <p id="findLongestPath" class="translation"><?= L('find_longest_path')?></p>
    <p id="LengthOfLongestPathFrom" class="translation"><?= L('length_of_longest_path_from')?></p>

    <p id="additionlActions" class="translation"><?= L('additionl_actions')?></p>
    <p id="reverseAllEdges" class="translation"><?= L('reverse_all_edges')?></p>
    <p id="makeAllUndirected" class="translation"><?= L('make_all_undirected')?></p>
    <p id="makeAllDirected" class="translation"><?= L('make_all_directed')?></p>

    <p id="pairWrongFormat" class="translation"><?= L('edge_list_wrong_format')?></p>
    <p id="fixButton" class="translation"><?= L('fix_button')?></p>
    <p id="reuseSavedEdge" class="translation"><?= L('reuse_saved_edge')?></p>

    <p id="maxClique" class="translation"><?= L('max_clique')?></p>
    <p id="maxCliqueNotFound" class="translation"><?= L('max_clique_not_found')?></p>
    <p id="maxCliqueSizeIs" class="translation"><?= L('max_clique_size_is')?></p>
    <p id="maxCliqueContains" class="translation"><?= L('max_clique_contains')?></p>

    <p id="wrongImageFormatPNGAndJPEG" class="translation"><?= L('wrong_image_background_format')?></p>
    <p id="wrongImageSizeP1" class="translation"><?= L('wrong_image_background_size')?></p>

    <p id="originalGraph" class="translation"><?= L('original_graph')?></p>
    <p id="autoSavedGraph" class="translation"><?= L('autosaved_graph')?></p>
    <p id="selectGraphToLoad" class="translation"><?= L('load_oiginal_or_autosaved')?></p>

    <p id="vertexNamePlaceHolder" class="translation"><?= L('vertex_name_place_holder')?></p>

    <p id="maxIndependentSet" class="translation"><?= L('max_independent_set')?></p>
    <p id="maxIndependentSetNotFound" class="translation"><?= L('max_independent_set_not_found')?></p>
    <p id="maxIndependentSetSizeIs" class="translation"><?= L('max_independent_set_size_is')?></p>
    <p id="maxIndependentSetContains" class="translation"><?= L('max_independent_set_contains')?></p>

    <p id="findAllShortestPathes" class="translation"><?= L('find_all_shortest_pathes')?></p>
    <p id="numberOfShortestPathesFrom" class="translation"><?= L('number_of_shortest_pathes_from')?></p>
    <p id="lengthIs" class="translation"><?= L('length_is')?></p>
    <p id="error" class="translation"><?= L('error')?></p>

    <p id="salesmanProblem" class="translation"><?= L('salesman_problem')?></p>
    <p id="noSolution" class="translation"><?= L('no_solution')?></p>
    <p id="shortestLoopIs" class="translation"><?= L('shortest_loop_is')?></p>
    <p id="salesmanProblemPath" class="translation"><?= L('salesman_path_problem')?></p>
    <p id="shortestPathIs" class="translation"><?= L('shortest_path_is')?></p>
</section>

<script src="<?= RootCacheJS("script/pages/editor/api/index.js")?>" ></script>
<!--
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
-->
