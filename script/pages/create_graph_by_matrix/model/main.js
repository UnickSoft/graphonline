// Current matrix size
var g_MatrixSize = 3;
var g_ctrlPressed = false;

function PackMatrix()
{
    var matrix = "";
    
    for (i = 0; i < g_MatrixSize; i++)
    {
        for (j = 0; j < g_MatrixSize; j++)
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
    { // ��� ����� IE
        return event.which; // ���������
    }

    return null; // ����. ������
}
    
function getChar(event) 
{
    var k = getCharCode(event)
    return String.fromCharCode(k); // ���������
}

function CopyMatrixToTextInput(event)
{
    document.getElementById("AdjacencyMatrixFieldPage").value = PackMatrix();

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
                var element = document.getElementsByName("field" + i + "_"+ j)[0];
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

    $(document).keydown(function(event) {
        if (event.which == "17" || event.which == "91")
          g_ctrlPressed = true;
    });

    $(document).keyup(function(event) {
        if (event.which == "17" || event.which == "91")
            g_ctrlPressed = false;
    });    
}