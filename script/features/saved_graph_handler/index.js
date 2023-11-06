doInclude ([
	include ("features/base_handler/index.js")
])

/**
 * Save dialog Graph handler.
 *
 */
function SavedDialogGraphHandler(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";
}

// inheritance.
SavedDialogGraphHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
SavedDialogGraphHandler.prototype.firstObject = null;
// Path
SavedDialogGraphHandler.prototype.pathObjects = null;
// Objects.
SavedDialogGraphHandler.prototype.objects    = null;

SavedDialogGraphHandler.prototype.show = function(object)
{
	this.app.SaveGraphOnDisk();

	var dialogButtons = {};

	dialogButtons[g_close] = function() {
				$( this ).dialog( "close" );					
			};

	document.getElementById('GraphName').value = "http://" + window.location.host + window.location.pathname + 
							"?graph=" + this.app.GetGraphName();

 	document.getElementById('GraphName').select();

        document.getElementById("ShareSavedGraph").innerHTML = 
		document.getElementById("ShareSavedGraph").innerHTML.replace(/graph=([A-Za-z]*)/g, "graph=" + this.app.GetGraphName());

	$( "#saveDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_save_dialog,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});

}
