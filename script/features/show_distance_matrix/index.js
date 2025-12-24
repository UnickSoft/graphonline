doInclude ([
	include ("features/base_handler/index.js")
])

/**
 * Show distance matrix.
 *
 */
function ShowDistanceMatrix(app)
{
  BaseHandler.apply(this, arguments);
  this.app = app;
  this.message = "";	
}

// inheritance.
ShowDistanceMatrix.prototype = Object.create(BaseHandler.prototype);
// First selected.
ShowDistanceMatrix.prototype.firstObject = null;
// Path
ShowDistanceMatrix.prototype.pathObjects = null;

ShowDistanceMatrix.prototype.GetIncidenceMatrix = function (rawMatrix, res_columns_width)
{
	let get_weight_str = function (i, j)
	{
		let str = "";
		if (i == j)
		{
			str += "0";
		}
		else if ((new Graph()).infinity == rawMatrix[i][j])
		{
			str += '\u221E';
		}
		else
		{
			str += rawMatrix[i][j];   
		}
        return str;
	};
	
	for (var j = 0; j < rawMatrix.length; j++)
	{
		let max_length = 0;
		for (var i = 0; i < rawMatrix.length; i++)
		{	
			let str = get_weight_str(i, j);
			let weight_len = str.length;
			// Make the length at least 2 if vertex name length > 1
			if (this.app.graph.vertices[j].mainText.toString().length > weight_len && weight_len == 1)
			{
				weight_len = 2;
			}
			max_length = Math.max(max_length, weight_len);
		}
		res_columns_width.push(max_length);
	}

	var matrix = "";
	for (var i = 0; i < rawMatrix.length; i++)
	{
		for (var j = 0; j < rawMatrix[i].length; j++)
		{	
			let weight_str = get_weight_str(i, j);
			if (weight_str.length < res_columns_width[j])
			{
				weight_str = " ".repeat(res_columns_width[j] - weight_str.length) + weight_str;
			}

            matrix += weight_str;
            
			if (j != rawMatrix[i].length - 1)
			{
				matrix += ", ";
			}
			
		}
		matrix = matrix + "\n";
	}
	
	return matrix;
}

ShowDistanceMatrix.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};

	dialogButtons[g_close] = function() {
				$( this ).dialog( "close" );						
			};

    var handler = g_Algorithms[g_AlgorithmIds.indexOf("OlegSh.FloidAlgorithm")](this.app.graph, this.app);
        
	let ta = $("#FloidMatrixField");
	let topWrap = $("#floidMatrix_top_text");
	let sideWrap = $("#floidMatrix_side_text");

	ta.on("scroll", function() {
		topWrap.scrollLeft(ta.scrollLeft());
		sideWrap.scrollTop(ta.scrollTop());
	});

	let res_columns_width = [];

	ta.val(this.GetIncidenceMatrix(handler.resultMatrix(), res_columns_width).trimEnd());
	ta.focus()[0].setSelectionRange(0, 0);	

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
	$("#floidMatrix_top_text_text").html(topText);
	$("#floidMatrix_side_text_text").html(sideText + "\n");
				
	$( "#floidMatrix" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_minDistMatrixText,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog',
		open: function(event, ui) {
			/* Set width for side text */
			$("#floidMatrix_top_text").width(ta.width());
		}
	});

}
