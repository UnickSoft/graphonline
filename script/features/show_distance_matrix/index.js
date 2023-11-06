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

ShowDistanceMatrix.prototype.GetIncidenceMatrix = function (rawMatrix)
{
	var matrix = "";
	for (var i = 0; i < rawMatrix.length; i++)
	{
		for (var j = 0; j < rawMatrix[i].length; j++)
		{	
            if (i == j)
            {
                matrix += "0";
            }
            else if ((new Graph()).infinity == rawMatrix[i][j])
            {
                matrix += '\u221E';
            }
            else
            {
                matrix += rawMatrix[i][j];   
            }
            
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
        
	$( "#FloidMatrixField" ).val(this.GetIncidenceMatrix(handler.resultMatrix()));	
				
	$( "#floidMatrix" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_minDistMatrixText,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
}
