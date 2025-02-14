
doInclude ([
    include ("features/base_handler/index.js")
])

/**
 * Connection Graph handler.
 *
 */
function ConnectionGraphHandler(app)
{
  this.removeStack = true;
  BaseHandler.apply(this, arguments);
  this.SelectFirst();
  this.addContextMenu();	
}

// inheritance.
ConnectionGraphHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
ConnectionGraphHandler.prototype.firstObject = null;

ConnectionGraphHandler.prototype.GetSelectedVertex = function()
{
    return (this.firstObject instanceof BaseVertex) ? this.firstObject : null;
}

ConnectionGraphHandler.prototype.AddNewEdge = function(selectedObject, isDirect)
{
	let newEdge = this.app.CreateNewArc(this.firstObject, selectedObject, isDirect, 
        document.getElementById('EdgeWeight').value, 
        $("#RadiosReplaceEdge").prop("checked"), 
        document.getElementById('EdgeLable').value);
    
    if ($("#CheckSaveDefaultEdge").prop("checked")) {
        let defaultEdge = new BaseEdge();
        defaultEdge.copyFrom(this.app.graph.edges[newEdge]);
        this.app.setDefaultEdge(defaultEdge);
    }

	this.SelectFirst();					
	this.app.NeedRedraw();
}

ConnectionGraphHandler.prototype.AddDefaultEdge = function(selectedObject)
{
    let defaultEdge = this.app.getDefaultEdge();
	let newEdge = this.app.CreateNewArc(this.firstObject, selectedObject, defaultEdge.isDirect, 
        defaultEdge.weight, 
        false, 
        defaultEdge.upText);
    this.app.graph.edges[newEdge].useWeight = defaultEdge.useWeight;

	this.SelectFirst();					
	this.app.NeedRedraw();

    userAction("CreateDefaultEdge");
}

ConnectionGraphHandler.prototype.SelectVertex = function(selectedObject) 
{
    if (this.firstObject)
    {
        var direct = false;
        var handler = this;

        if (!this.app.hasDefaultEdge() || !document.getElementById('useDefaultEdge').checked) {
            this.ShowCreateEdgeDialog(this.firstObject, selectedObject, function (firstVertex, secondVertex, direct) {
                handler.AddNewEdge(secondVertex, direct);
            });
        } else {
            handler.AddDefaultEdge(selectedObject);
        }
    }
    else
    {
        this.SelectSecond(selectedObject);	
    }
    this.needRedraw = true;
}

ConnectionGraphHandler.prototype.MouseDown = function(pos) 
{
    $('#message').unbind();
    
	var selectedObject = this.GetSelectedGraph(pos);
	if (selectedObject && (selectedObject instanceof BaseVertex))
	{
        this.SelectVertex(selectedObject);
	}
    else
    {  
      this.SelectFirst();
      this.needRedraw = true;
    }
}

ConnectionGraphHandler.prototype.GetSelectedGroup = function(object)
{
	return (object == this.firstObject) ? 1 : 0;
}

ConnectionGraphHandler.prototype.SelectFirst = function()
{
	this.firstObject = null;
    
	this.message = g_selectFirstVertexToConnect + this.GetUseDefaultEdgeCheckBox() + 
        this.GetSelect2VertexMenu();
    this.message = this.AppendSpecialSctionsButton(this.message);
}

ConnectionGraphHandler.prototype.SelectSecond = function(selectedObject)
{
	this.firstObject = selectedObject;
	this.message     = g_selectSecondVertexToConnect + this.GetUseDefaultEdgeCheckBox() + 
        this.GetSelect2VertexMenu();		
    this.message = this.AppendSpecialSctionsButton(this.message);				
}

ConnectionGraphHandler.prototype.SelectFirstVertexMenu = function(vertex1Text, vertex)
{
   this.firstObject = null;
   this.SelectVertex(vertex);
}

ConnectionGraphHandler.prototype.UpdateFirstVertexMenu = function(vertex1Text)
{
    if (this.firstObject)
    {
        vertex1Text.value = this.firstObject.mainText;        
    }
}

ConnectionGraphHandler.prototype.SelectSecondVertexMenu = function(vertex2Text, vertex)
{
    this.SelectVertex(vertex);
}

ConnectionGraphHandler.prototype.UpdateSecondVertexMenu = function(vertex2Text)
{
    if (this.secondObject)
    {
        vertex2Text.value = this.secondObject.mainText;
    }   
}

ConnectionGraphHandler.prototype.AppendSpecialSctionsButton = function(baseMessage)
{
    let hasEdges           = this.app.graph.hasEdges();

    if (!hasEdges) return baseMessage;

    let hasDirectedEdges   = this.app.graph.hasDirectEdge();
    let hasUndirectedEdges = this.app.graph.hasUndirectEdge();

    let handler = this;

    $('#message').on('click', '#reverseAll', function() {
            handler.app.PushToStack("ReverseAllEdges");

            handler.app.graph.reverseAllEdges();
            handler.app.redrawGraph();

            userAction("ReverseAllEdges");
        });
    $('#message').on('click', '#makeAllUndirected', function(){        
        handler.app.PushToStack("makeAllEdgesUndirected");

        handler.app.graph.makeAllEdgesUndirected();
        handler.app.redrawGraph();

        userAction("makeAllEdgesUndirected");
    });
    $('#message').on('click', '#makeAllDirected', function(){        
        handler.app.PushToStack("makeAllEdgesDirected");

        handler.app.graph.makeAllEdgesDirected();
        handler.app.redrawGraph();

        userAction("makeAllEdgesDirected");
    });     
        
    return "<div class=\"dropdown\" style=\"float:right; position: relative; margin-left: 8px\">"
    +  "<button type=\"button\" class=\"btn btn-outline-secondary dropdown-toggle btn-sm menu-text white-btn\" id=\"dropdownMenuForEdges\" data-bs-toggle=\"dropdown\" saria-expanded=\"false\">"
    +  g_additionalActions + " <span class=\"caret\"></span>"
    +  " </button> "
    +  "<ul class=\"dropdown-menu dropdown-menu-right\" style=\"z-index:15; position: absolute;\" aria-labelledby=\"dropdownMenuForEdges\">"
    +  (hasDirectedEdges ? " <li><a href=\"javascript:;\" class=\"dropdown-item\" id=\"reverseAll\">" + g_reverseAllEdges + "</a></li>" : "")
    +  (hasDirectedEdges ? " <li><a href=\"javascript:;\" class=\"dropdown-item\" id=\"makeAllUndirected\">" + g_makeAllUndirected + "</a></li>" : "")
    +  (hasUndirectedEdges ? " <li><a href=\"javascript:;\" class=\"dropdown-item\" id=\"makeAllDirected\">" + g_makeAllDirected + "</a></li>" : "")
    +  "</ul>"
    +  "</div> " + baseMessage;
}

ConnectionGraphHandler.checkUseDefaultEdge = function (elem, app) 
{
    app.setUseDefaultEdge(elem.checked);
    app.updateMessage();
};

ConnectionGraphHandler.prototype.GetUseDefaultEdgeCheckBox = function() {
    if (!this.app.hasDefaultEdge()) {
        return "";
    }

    return " <div class=\"messageSwitcher\" style=\"display:inline\">" +
        "<span id=\"switcher\"><input type=\"checkbox\" id=\"useDefaultEdge\" >" +
        "<label for=\"useDefaultEdge\" class=\"Switcher\"></label></span> <label for=\"useDefaultEdge\" class=\"switcherText\">" + g_reuseSavedEdge + "</label>" +
        "</div>";
}

ConnectionGraphHandler.prototype.InitControls = function() {
    BaseHandler.prototype.InitControls.call(this)

    if (!this.app.hasDefaultEdge()) {
        return;
    }

    let app = this.app;
    
    $('#useDefaultEdge').unbind();
    $('#useDefaultEdge').change(function() {
        app.setUseDefaultEdge(this.checked);
    });
    $("#useDefaultEdge").prop("checked", this.app.getUseDefaultEdge());
}
