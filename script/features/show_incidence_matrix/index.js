doInclude ([
	include ("features/base_handler/index.js")
])

/**
 * Save/Load graph from Incidence matrix.
 *
 */
function ShowIncidenceMatrix(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
ShowIncidenceMatrix.prototype = Object.create(BaseHandler.prototype);
// First selected.
ShowIncidenceMatrix.prototype.firstObject = null;
// Path
ShowIncidenceMatrix.prototype.pathObjects = null;

ShowIncidenceMatrix.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};

    $('#IncidenceMatrixField').unbind();
	$( "#IncidenceMatrixField" ).on('keyup change', function (eventObject)
		{
			if (!handler.app.TestIncidenceMatrix($( "#IncidenceMatrixField" ).val(), [], []))
			{
				$( "#BadIncidenceMatrixFormatMessage" ).show();
			}
			else
			{
				$( "#BadIncidenceMatrixFormatMessage" ).hide();
			}
		});

	dialogButtons[g_save] = function() {
                handler.app.PushToStack("IncidenceMatrixChanged");
				handler.app.SetIncidenceMatrixSmart($( "#IncidenceMatrixField" ).val());
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};

	let ta = $("#IncidenceMatrixField");
	let sideWrap = $("#incidenceMatrix_side_text");

	ta.on("scroll", function() {
		sideWrap.scrollTop(ta.scrollTop());
	});

	$( "#IncidenceMatrixField" ).val(this.app.GetIncidenceMatrix().trimEnd());	
	ta.focus()[0].setSelectionRange(0, 0);

	$( "#BadIncidenceMatrixFormatMessage" ).hide();
				
	/* Make side and top text */
	let sideText = "";
	for (let i = 0; i < this.app.graph.vertices.length; i++)
	{
		/* Each vertex name max 3 symbols */
		sideText += this.app.graph.vertices[i].mainText.toString().slice(0, 3) + "\n";		
	}
	$("#incidenceMatrix_side_text_text").html(sideText + "\n");

	$( "#incidenceMatrix" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_incidenceMatrixText,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog',
		open: function(event, ui) {
			/* Set width for side text */
			$("#incidenceMatrix_top_text").width(ta.width());
			$("#BadIncidenceMatrixFormatMessage").width(ta.width());
		}
	});
}
