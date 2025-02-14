    <head>
	    <link rel="stylesheet" type="text/css" href="<?= Root('i/css/create_graph_by_incidence_matrix.css')?>" />
        <script src="<?= RootCacheJS("script/shared/config.js")?>" ></script>
        <script src="<?= RootCacheJS("script/shared/loader.js")?>" ></script>
	    <script src="<?= RootCacheJS('script/pages/create_graph_by_incidence_matrix/api/index.js')?>"></script>
    </head>

<script>

// Current matrix size
var g_MatrixWidth  = 2;
var g_MatrixHeight = 3;
var g_ctrlPressed = false;

function PackMatrix()
{
    var matrix = "";
    
    for (i = 0; i < g_MatrixHeight; i++)
    {
        for (j = 0; j < g_MatrixWidth; j++)
        {
            var element = document.getElementsByName("field" + i + "_" + j)[0];
            matrix = matrix + (element.value.length > 0 ? element.value : "0") + ", ";
        }
        matrix = matrix + "\n";
    }
    return matrix;
}

function getCharCode(event) 
{
    if (event.which == null) 
    { // IE
        return event.keyCode;
    }

    if (event.which != 0) 
    { // not IE
        return event.which; 
    }

    return null;
}
    
function getChar(event) 
{
    var k = getCharCode(event)
    return String.fromCharCode(k);
}

function CopyMatrixToTextInput(event)
{
    document.getElementById("IncidenceMatrixFieldPage").value = PackMatrix();
    // Move between cells.
    if (event)
    {
        var key = getChar(event);
        var code = getCharCode(event);
        console.log(key + " code=" + code);
        if (g_ctrlPressed)
        {
            var moveFocus = function(offsetX, offsetY)
            {
                var focused_element = document.activeElement;
                
                if (focused_element && focused_element.name.includes("field"))
                {
                    var name = focused_element.name;
                    var coords = name.replace('field','').split("_");
                    if (coords.length == 2)
                    {
                        var focusName = "field" + (parseInt(coords[0]) + offsetY) + "_" + (parseInt(coords[1]) + offsetX)
                        var element   = document.getElementsByName(focusName)[0];
                        if (element)
                        {
                            element.focus();
                        }
                    }
                }
            }
            switch (code)
            {
                case 38: // Up
                {                    
                    moveFocus(0, -1);
                    break;
                }
                case 40: // Down
                {
                    moveFocus(0, 1);
                    break;
                }
                case 37: // Left
                {
                    moveFocus(-1, 0);
                    break;
                }
                case 39: // Right
                {
                    moveFocus(1, 0);
                    break;
                }
            }

        }
    }
}

function _ShowTextInput()
{
    $( "#IncidenceMatrixFieldPage" ).show();
    $( "#MatrixForm" ).hide();
    $( "#TextDescription").show();
    $( "#MatrixDescription").hide();
}

function _ShowMatrixInput()
{
    $( "#MatrixForm" ).show();
    $( "#IncidenceMatrixFieldPage" ).hide();
    $( "#TextDescription").hide();
    $( "#MatrixDescription").show();
}

function ShowTextInput()
{
    _ShowTextInput();
    document.getElementById("showMatrix").className = "nav-link";// btn-secondary";
    document.getElementById("showText").className = "nav-link active"; //btn-secondary 
}

function ShowMatrixInput()
{
    _ShowMatrixInput();
    document.getElementById("showMatrix").className = "nav-link active"; // btn-secondary 
    document.getElementById("showText").className = "nav-link"; // btn-secondary
}

function CopyMatrixToMatrixInput()
{
    var graph = new Graph();
    
    var colsObj = {};
    var rowsObj = {};
    
    if (graph.TestIncidenceMatrix($( "#IncidenceMatrixFieldPage" ).val(), rowsObj, colsObj))
    {
        var rows = rowsObj.rows;
        var cols = colsObj.cols;
        
        for (var i = g_MatrixWidth; i < cols[0].length; i++)
        {
            IncSizeW();
        }
        
        for (var i = g_MatrixHeight; i < cols.length; i++)
        {
            IncSizeH();
        }
        
        for (var i = 0; i < cols.length; i++)
        {
            for (var j = 0; j < cols[0].length; j++)
            {
                var element = document.getElementsByName("field" + i + "_" + j)[0];
                element.value = cols[i][j];
            }
        }
    }
    else
    {
        ShowTextInput();
    }
}

function CreateInputElement(col, row)
{
    var input = document.createElement("input");
    input.type = "text";
    input.size = 3;
    input.name = "field" + col + "_" + row;
    input.value = 0;
    input.onkeyup = function(event) {CopyMatrixToTextInput(event);};
    
    return input;
}

function InsertBeforeElement(element, beforeName, space)
{
    var parent = document.getElementsByName(beforeName)[0].parentNode;
    var beforeElement = document.getElementsByName(beforeName)[0];
    parent.insertBefore(element, beforeElement);
    
    if (space)
    {
        // Insert space
        parent.insertBefore(document.createTextNode( '\u00A0' ), beforeElement);
    }
}

function IncSizeW()
{
    // End one more line:
    for (var i = 0; i < g_MatrixHeight; i ++)
    {
        var input = CreateInputElement(i, g_MatrixWidth);
        InsertBeforeElement(input, "row" + i, true);
        //InsertBeforeElement(input, "matrixEnd", true);
    }
    
    g_MatrixWidth++;
    CopyMatrixToTextInput();
}

function IncSizeH()
{
    var br = document.createElement("br");
    br.setAttribute("name", "row" + g_MatrixHeight);
    InsertBeforeElement(br, "matrixEnd", false);
    
    for (var i = 0; i < g_MatrixWidth; i ++)
    {
        var input = CreateInputElement(g_MatrixHeight, i);
        InsertBeforeElement(input, "row" + g_MatrixHeight, true);
    }
    g_MatrixHeight++;
    CopyMatrixToTextInput();
}

window.onload = function ()
{
	if (document.getElementById('CreateByIncidenceMatrix'))
	{
		document.getElementById('CreateByIncidenceMatrix').onclick = function ()
		{
            $("#matrixForm").submit();
			//window.location = "./?incidenceMatrix=" + $( "#IncidenceMatrixFieldPage" ).val().replace(/\n/g,'%0A');
	  	}
        }

	$( "#IncidenceMatrixFieldPage" ).on('keyup change', function (eventObject)
		{
			var graph = new Graph();

			if (!graph.TestIncidenceMatrix($( "#IncidenceMatrixFieldPage" ).val(), [], []))
			{
				$( "#BadFormatMessage" ).show();
			}
			else
			{
				$( "#BadFormatMessage" ).hide();
			}
		});

		$( "#BadFormatMessage" ).hide();
            $( "#IncidenceMatrixFieldPage" ).hide();
    
    $( "#showMatrix" ).on('click', function (eventObject)
                          {
                          ShowMatrixInput();
                          });
    
    $( "#showText" ).on('click', function (eventObject)
                        {
                        ShowTextInput();
                        });
    
    CopyMatrixToMatrixInput();

    $(document).keydown(function(event) {
        if (event.which == "17" || event.which == "91")
          g_ctrlPressed = true;
    });

    $(document).keyup(function(event) {
        if (event.which == "17" || event.which == "91")
            g_ctrlPressed = false;
    });    
}
</script>


    <h1><?= L('head_no_tags')?></h1>
    <p><?= L('text')?></p>

    <div>
		<form>
		<fieldset>
				<div id="message" class="alert alert-success" role="alert" style="height:64px">
                    <p id="TextDescription" style="display: none;"><?= L('incidence_matrix_description') ?></p>
                    <p id="MatrixDescription"><?= L('incidence_matrix_description_matrix') ?></p>
                </div>

				<div class="row">
				<div class="col-md-4">

<form>
<div class="btn-group" data-toggle="buttons">
<ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="javascript:;" id="showMatrix"> <?= L('matrix_matrix_input') ?></a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="javascript:;" id="showText"> <?= L('text_matrix_input') ?></a>
  </li>
</ul>
</div>
</form>

<form action="./" method="post" id="matrixForm">
				<textarea name="incidenceMatrix" id="IncidenceMatrixFieldPage" wrap="off" style="display: none;">
<?php if (!isset($_GET["incidenceMatrix"])): ?>
1, 0
1, 1
0, -1
<?php else: ?><?= $_GET["incidenceMatrix"] ?><?php endif;?></textarea>
</form>
<div id="MatrixForm">
<form id="AdjacencyMatrixFieldInput" role="form" class="mb-2">
<input type="text" name="field0_0" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
<input type="text" name="field0_1" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
<br name="row0">

<input type="text" name="field1_0" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
<input type="text" name="field1_1" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
<br name="row1">

<input type="text" name="field2_0" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
<input type="text" name="field2_1" size="3" value = "0" onkeyup="CopyMatrixToTextInput(event)">
<br name="row2">

<span name="matrixEnd"></span>
</form>
<button type="button" onclick="IncSizeW()" value="add" name="add" class="btn btn-outline-secondary menu-text mb-2"><span class="bi bi-plus-circle"></span>
<?= L('add_edge_to_matrix') ?>
</button>
<button type="button" onclick="IncSizeH()" value="add" name="add" class="btn btn-outline-secondary menu-text"><span class="bi bi-plus-circle"></span>
<?= L('add_node_to_matrix') ?>
</button>
<p><small><?= L('use_ctrl_to_move_cells')?></small></p>
</div>


				</div>
				<div class="col-md-4">
		  		<button type="button" class="btn btn-outline-success btn-lg" id="CreateByIncidenceMatrix"><span class="bi bi-check-lg"></span> <?= L('plot_graph_button')?></button>
				<div id="BadFormatMessage" class="alert alert-warning" role="alert">
					<?= L('incidence_matrix_bad_format')?>
				</div>
				</div>
				</div>
		</fieldset>     
		</form>
    </div>
     