doInclude ([
    include ("features/base_handler/index.js"),
    include ("features/graph_preview/index.js"),
])

/**
 * Dialog to select first or second graph.
 *
 */
function SelectGraphDialog(app, originalGraph, originalGraphStyle, 
                                autoSavedGraph, autoSavedGraphStyle, 
                                originalCallback, autoSaveCallback)
{
  BaseHandler.apply(this, arguments);
  this.message = "";
  this.originalGraph = originalGraph;
  this.autoSavedGraph = autoSavedGraph;
  this.originalCallback = originalCallback;
  this.autoSaveCallback = autoSaveCallback;
  this.originalGraphStyle = originalGraphStyle;
  this.autoSavedGraphStyle = autoSavedGraphStyle;
}

// inheritance.
SelectGraphDialog.prototype = Object.create(BaseHandler.prototype);

SelectGraphDialog.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};
    var graph = this.app.graph;
    var app   = this.app;
    
	dialogButtons[g_originalGraph] = 
            {
                text: g_originalGraph,
                class   : "MarginLeft",
                click   : function() {
                    handler.originalGraphPreview = null;
                    handler.originalGraph = null;
                    handler.autoSavedGraph = null;
                    handler.originalCallback();
                    $( this ).dialog( "destroy" );
                }
            };
    
	dialogButtons[g_autoSavedGraph] = function() {
                handler.originalGraphPreview = null;
                handler.originalGraph = null;
                handler.autoSavedGraph = null;
                handler.autoSaveCallback();
				$( this ).dialog( "destroy" );
			};
            
	$( "#autoSaveOrOriginalGraph" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_selectGraphToLoad,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog',
        close: function( event, ui ) 
        {
            handler.originalCallback();
        }
	});

    let originalGraphPositionUpdate = function(pos, scale)
    {
        handler.autoSavedGraphPreview.canvasScale = scale;
        handler.autoSavedGraphPreview.canvasPosition = pos;
        handler.autoSavedGraphPreview.redraw();
    };
    let autoSavedGraphPreviewUpdate = function(pos, scale)
    {
        handler.originalGraphPreview.canvasScale = scale;
        handler.originalGraphPreview.canvasPosition = pos;
        handler.originalGraphPreview.redraw();
    };

    this.originalGraphPreview = new GraphPreview(this.originalGraph, this.originalGraphStyle,
        document.getElementById("OriginalGraphpPreview"), originalGraphPositionUpdate);
    this.autoSavedGraphPreview = new GraphPreview(this.autoSavedGraph, this.autoSavedGraphStyle,
        document.getElementById("AutoSaveGraphpPreview"), autoSavedGraphPreviewUpdate);
}
