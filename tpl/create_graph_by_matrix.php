    <head>
	    <link rel="stylesheet" type="text/css" href="<?= Root('i/css/create_graph_by_matrix.css')?>" />
	   <script src="<?= Root('script/Graph.js')?>"></script>

    </head>

<script>

// Current matrix size
var g_MatrixSize = 3;

function PackMatrix()
{
    var matrix = "";
    
    for (i = 0; i < g_MatrixSize; i++)
    {
        for (j = 0; j < g_MatrixSize; j++)
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
    document.getElementById("AdjacencyMatrixFieldPage").value = PackMatrix();
}

function _ShowTextInput()
{
    $( "#AdjacencyMatrixFieldPage" ).show();
    $( "#MatrixForm" ).hide();
    $( "#TextDescription").show();
    $( "#MatrixDescription").hide();
    $( "#idSeparatorList").show();
}

function _ShowMatrixInput()
{
    $( "#MatrixForm" ).show();
    $( "#AdjacencyMatrixFieldPage" ).hide();
    $( "#TextDescription").hide();
    $( "#MatrixDescription").show();
    $( "#idSeparatorList").hide();
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
    

    if (graph.TestAdjacencyMatrix($( "#AdjacencyMatrixFieldPage" ).val(), rowsObj, colsObj))
    {
        var rows = rowsObj.rows;
        var cols = colsObj.cols;
        
        for (var i = g_MatrixSize; i < rows.length; i++)
        {
            IncSize();
        }
        
        for (var i = 0; i < rows.length; i++)
        {
            for (var j = 0; j < rows.length; j++)
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

function IncSize()
{
    // End one more line:
    for (var i = 0; i < g_MatrixSize; i ++)
    {
        var input = CreateInputElement(g_MatrixSize, i);
        InsertBeforeElement(input, "matrixEnd", true);
    }
    var br = document.createElement("br");
    br.setAttribute("name", "row" + g_MatrixSize);
    InsertBeforeElement(br, "matrixEnd", false);
    
    for (var i = 0; i < g_MatrixSize + 1; i ++)
    {
        var input = CreateInputElement(i, g_MatrixSize);
        InsertBeforeElement(input, "row" + i, g_MatrixSize);
    }
    g_MatrixSize++;
    CopyMatrixToTextInput();
}

function checkFormat()
{
    var graph = new Graph();
    var separator = $("#spaceSep").is(':checked') ? " " : ",";
    
    if (!graph.TestAdjacencyMatrix($( "#AdjacencyMatrixFieldPage" ).val(), [], [], separator))
    {
        $( "#BadFormatMessage" ).show();
    }
    else
    {
        $( "#BadFormatMessage" ).hide();
    }
}

window.onload = function ()
{
    
	if (document.getElementById('CreateByAdjacencyMatrix'))
	{
		document.getElementById('CreateByAdjacencyMatrix').onclick = function ()
		{
            $("#matrixForm").submit();
			//window.location = "./?matrix=" + $( "#AdjacencyMatrixFieldPage" ).val().replace(/\n/g,'%0A');
	  	}
    }


	$( "#AdjacencyMatrixFieldPage" ).on('keyup change', function (eventObject)
		{
            checkFormat();
		});

		$( "#BadFormatMessage" ).hide();
        $( "#AdjacencyMatrixFieldPage" ).hide();
    
    $( "#showMatrix" ).on('click', function (eventObject)
                          {
                          _ShowMatrixInput();
                          });
    
    $( "#showText" ).on('click', function (eventObject)
                        {
                        _ShowTextInput();
                        });
    
    $('input:radio[name="separator"]').change( function(){
                                                checkFormat()
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
					<p id="TextDescription" style="display: none;"><?= L('adjacency_matrix_description') ?></p>
                    <p id="MatrixDescription"><?= L('adjacency_matrix_description_matrix') ?></p>
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
				<textarea name="matrix" id="AdjacencyMatrixFieldPage" wrap="off" style="display: none;">
<? if (!isset($_GET["matrix"])): ?>
0, 1, 0
1, 0, 0
0, 1, 0
<? else: ?><?= $_GET["matrix"] ?><? endif;?></textarea>
<div id="idSeparatorList" style="display: none;">
<?= L('separator') ?>
    <input type="radio" name="separator" value="commo" id="commoSep" checked> <label for="commoSep"><?= L('separator_commo') ?></label>
    <input type="radio" name="separator" value="space" id="spaceSep"> <label for="spaceSep"><?= L('separator_space') ?></label>
</div>
</form>
<div id="MatrixForm">
<form id="AdjacencyMatrixFieldInput" role="form">
<input type="text" name="field00" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<input type="text" name="field01" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<input type="text" name="field02" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<br name="row0">

<input type="text" name="field10" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<input type="text" name="field11" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<input type="text" name="field12" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<br name="row1">

<input type="text" name="field20" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<input type="text" name="field21" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<input type="text" name="field22" size="3" value = "0" onkeyup="CopyMatrixToTextInput()">
<br name="row2">

<span name="matrixEnd"></span>
</form>
<button type="button" onclick="IncSize()" value="add" name="add" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span>
    <?= L('add_node_to_matrix') ?>
</button>
</div>
				</div>
				<div class="col-md-4">
		  		<button type="button" class="btn btn-default btn-lg" id="CreateByAdjacencyMatrix"><span class="glyphicon glyphicon-ok"></span> <?= L('plot_graph_button')?></button>
				<div id="BadFormatMessage" class="alert alert-warning" role="alert">
					<?= L('adjacency_matrix_bad_format')?>
				</div>
				</div>
				</div>
		</fieldset>     
		</form>
    </div>
<script>
    CopyMatrixToMatrixInput();
</script>

<? if (L('current_language') == "ru"): ?>
<section>
				<div id="videoHelp">
					<a href="./create_graph_by_matrix_help">Видео справка</a>
                    <a href="./wiki/Справка/МатрицаСмежности">Wiki справка</a>
				</div>
</section>
<? endif; ?>

<section style="text-align: center;" class="hidden-phone">
<div>
    <img src="/i/image/help/createGrapthByMatrix.gif" alt="<?= L('head_no_tags')?>"/>
</div>
</section>
                <? if (L('current_language') == "ru"): ?>
    <section style="height:90px;text-align: center;" id="adv" class="hidden-phone">
<!-- Yandex.RTB R-A-202319-1 -->
<iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/donate.xml?account=41001394497131&quickpay=donate&payment-type-choice=on&mobile-payment-type-choice=on&default-sum=30&targets=%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B8%D1%82%D0%B5+%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82+%D0%93%D1%80%D0%B0%D1%84+%D0%9E%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD.&target-visibility=on&project-name=&project-site=&button-text=01&successURL=" width="522" height="90"></iframe>
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

