    <head>
	    <link rel="stylesheet" type="text/css" href="<?= Root('i/css/create_graph_by_incidence_matrix.css')?>" />
	    <script src="<?= Root('script/Graph.js')?>"></script>
    </head>

<script>

// Current matrix size
var g_MatrixWidth  = 2;
var g_MatrixHeight = 3;

function PackMatrix()
{
    var matrix = "";
    
    for (i = 0; i < g_MatrixHeight; i++)
    {
        for (j = 0; j < g_MatrixWidth; j++)
        {
            var element = document.getElementsByName("field" + i + j)[0];
            matrix = matrix + (element.value.length > 0 ? element.value : "0") + ", ";
        }
        matrix = matrix + "\n";
    }
    return matrix;
}

function CopyMatrixToTextInput()
{
    document.getElementById("IncidenceMatrixFieldPage").value = PackMatrix();
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
    document.getElementById("showMatrix").className = "btn btn-default";
    document.getElementById("showText").className = "btn btn-default active";
}

function ShowMatrixInput()
{
    _ShowMatrixInput();
    document.getElementById("showMatrix").className = "btn btn-default active";
    document.getElementById("showText").className = "btn btn-default";
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
                var element = document.getElementsByName("field" + i + j)[0];
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
    input.name = "field" + col + row;
    input.value = 0;
    input.onkeyup = function() {CopyMatrixToTextInput();};
    
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
                          _ShowMatrixInput();
                          });
    
    $( "#showText" ).on('click', function (eventObject)
                        {
                        _ShowTextInput();
                        });
    
    CopyMatrixToMatrixInput();

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
<label class="btn btn-default active" id="showMatrix"><input type="radio" name="matrixInputType"> <?= L('matrix_matrix_input') ?></label>
<label class="btn btn-default" id="showText"><input type="radio" name="matrixInputType"> <?= L('text_matrix_input') ?></label>
</div>
</form>

<form action="./" method="post" id="matrixForm">
				<textarea name="incidenceMatrix" id="IncidenceMatrixFieldPage" wrap="off" style="display: none;">
<? if (!isset($_GET["incidenceMatrix"])): ?>
1, 0
1, 1
0, -1
<? else: ?><?= $_GET["incidenceMatrix"] ?><? endif;?></textarea>
</form>
<div id="MatrixForm">
<form id="AdjacencyMatrixFieldInput" role="form">
<input type="text" name="field00" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<input type="text" name="field01" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<br name="row0">

<input type="text" name="field10" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<input type="text" name="field11" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<br name="row1">

<input type="text" name="field20" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<input type="text" name="field21" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<br name="row2">

<span name="matrixEnd"></span>
</form>
<button type="button" onclick="IncSizeW()" value="add" name="add" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span>
<?= L('add_edge_to_matrix') ?>
</button>
<button type="button" onclick="IncSizeH()" value="add" name="add" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span>
<?= L('add_node_to_matrix') ?>
</button>
</div>


				</div>
				<div class="col-md-4">
		  		<button type="button" class="btn btn-default btn-lg" id="CreateByIncidenceMatrix"><span class="glyphicon glyphicon-th"></span> <?= L('plot_graph_button')?></button>
				<div id="BadFormatMessage" class="alert alert-warning" role="alert">
					<?= L('incidence_matrix_bad_format')?>
				</div>
				</div>
				</div>
		</fieldset>     
		</form>
    </div>
     