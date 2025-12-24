doInclude ([
	include ("features/base_handler/index.js")
])

/**
 * Save/Load graph from matrix.
 *
 */
function ShowAdjacencyMatrix(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
ShowAdjacencyMatrix.prototype = Object.create(BaseHandler.prototype);
// First selected.
ShowAdjacencyMatrix.prototype.firstObject = null;
// Path
ShowAdjacencyMatrix.prototype.pathObjects = null;

ShowAdjacencyMatrix.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};

    $('#AdjacencyMatrixField').unbind();
	$( "#AdjacencyMatrixField" ).on('keyup change', function (eventObject)
		{
			if (!handler.app.TestAdjacencyMatrix($( "#AdjacencyMatrixField" ).val(), [], []))
			{
				$( "#BadMatrixFormatMessage" ).show();
			}
			else
			{
				$( "#BadMatrixFormatMessage" ).hide();
			}
		});

	dialogButtons[g_save] = function() {
                handler.app.PushToStack("ChangeAdjacencyMatrix");
				handler.app.SetAdjacencyMatrixSmart($( "#AdjacencyMatrixField" ).val());					
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};

	let ta = $("#AdjacencyMatrixField");
	let topWrap = $("#adjacencyMatrix_top_text");
	let sideWrap = $("#adjacencyMatrix_side_text");

	ta.on("scroll", function() {
		topWrap.scrollLeft(ta.scrollLeft());
		sideWrap.scrollTop(ta.scrollTop());
	});

	let res_columns_width = [];
	ta.val(this.app.GetAdjacencyMatrix(res_columns_width).trimEnd());	
	ta.focus()[0].setSelectionRange(0, 0);

	$( "#BadMatrixFormatMessage" ).hide();

	/* Make side and top text */
	let sideText = "";
	let topText = "";
	for (let i = 0; i < this.app.graph.vertices.length; i++)
	{
		/* Each vertex name max 3 symbols */
		sideText += this.app.graph.vertices[i].mainText.toString().slice(0, 3) + "\n";
		
		let col_width = res_columns_width[i];
		let col_text = this.app.graph.vertices[i].mainText.toString();
		if (col_width < col_text.length)
		{
			col_text = col_text.slice(0, col_width);
		}
		col_text = col_text.padStart(col_width, " ");
		topText += col_text + "  ";
	}
	$("#adjacencyMatrix_top_text_text").html(topText);
	$("#adjacencyMatrix_side_text_text").html(sideText + "\n");
	
    if (this.app.graph.isMulti())
        $( "#AdjacencyMatrixMultiGraphDesc").show();
    else
        $( "#AdjacencyMatrixMultiGraphDesc").hide();
    
	$( "#adjacencyMatrix" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_adjacencyMatrixText,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog',
		open: function(event, ui) {
			/* Set width for side text */
			$("#adjacencyMatrix_top_text").width(ta.width());
			$("#BadMatrixFormatMessage").width(ta.width());
		}
	});
}
