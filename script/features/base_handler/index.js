/**
 * Base Handler.
 *
 */ 
function BaseHandler(app)
{
	this.app = app;
    this.app.setRenderPath([]);
    
    if (this.removeStack) {
        this.removeContextMenu();
    }
    this.contextMenuObject = null;
    this.contextMenuPoint = null;
    //this.app.ClearUndoStack();
}

// Need redraw or nor.
BaseHandler.prototype.needRedraw = false;
BaseHandler.prototype.objects    = [];
BaseHandler.prototype.message    = "";


BaseHandler.prototype.IsNeedRedraw = function(object)
{
	return this.needRedraw;
}

BaseHandler.prototype.RestRedraw = function(object)
{
	this.needRedraw = false;
}

BaseHandler.prototype.SetObjects = function(objects)
{
	this.objects = objects;
}

BaseHandler.prototype.GetSelectedGraph = function(pos)
{
	// Selected Graph.
    var res = null;
    for (var i = 0; i < this.app.graph.vertices.length; i ++)
    {
		if (this.app.graph.vertices[i].HitTest(pos))
		{
            // Select last of them.
            res = this.app.graph.vertices[i];
		}
	}

	
	return res;
}

BaseHandler.prototype.GetSelectedArc = function(pos)
{
	// Selected Arc.
    for (var i = 0; i < this.app.graph.edges.length; i ++)
    {
        var edge = this.app.graph.edges[i];
        
        if (edge.HitTest(new Point(pos.x, pos.y)))
            return edge;
	}
	
	return null;
}

BaseHandler.prototype.GetSelectedObject = function(pos)
{
	var graphObject = this.GetSelectedGraph(pos);
	if (graphObject)
	{
		return graphObject;
	}
	
	var arcObject = this.GetSelectedArc(pos);
	if (arcObject)
	{
		return arcObject;
	}
	
	return null;
}


BaseHandler.prototype.GetUpText = function(object)
{
	return "";
}


BaseHandler.prototype.GetMessage = function()
{
	return this.message;
}


BaseHandler.prototype.MouseMove = function(pos) {}

BaseHandler.prototype.MouseDown = function(pos) {}

BaseHandler.prototype.MouseUp   = function(pos) {}

BaseHandler.prototype.GetSelectedGroup = function(object) 
{
	return 0;
}

BaseHandler.prototype.InitControls = function() 
{
    var vertex1Text = document.getElementById("Vertex1");
    if (vertex1Text)
    {
        var handler = this;
        vertex1Text.onchange = function () {
           for (var i = 0; i < handler.app.graph.vertices.length; i++)
           {   
               if (handler.app.graph.vertices[i].mainText == vertex1Text.value)
               {
	               handler.SelectFirstVertexMenu(vertex1Text, handler.app.graph.vertices[i]);
                   userAction("selectVertex1_menu");
                   break;
               }
           }
        };
        
        this.UpdateFirstVertexMenu(vertex1Text);
    }
    
    var vertex2Text = document.getElementById("Vertex2");
    if (vertex2Text)
    {
        var handler = this;
        vertex2Text.onchange = function () {
           for (var i = 0; i < handler.app.graph.vertices.length; i++)
           {   
               if (handler.app.graph.vertices[i].mainText == vertex2Text.value)
               {
	               handler.SelectSecondVertexMenu(vertex2Text, handler.app.graph.vertices[i]);
                   userAction("selectVertex2_menu");
                   break;
               }
           }
        };
        
        this.UpdateSecondVertexMenu(vertex2Text);
    }
}

BaseHandler.prototype.GetNodesPath = function(array, start, count)
{
    var res = [];
    for (var index = start; index < start + count; index++)
    {
        res.push(this.app.graph.FindVertex(array[index].value));
    }
    return res;
}

BaseHandler.prototype.RestoreAll = function()
{
}

BaseHandler.prototype.GetSelectVertexMenu = function(menuName)
{
	var res = "<input list=\"vertexList" + menuName + "\" id=\"" + menuName + "\" class=\"SelectVertexInput\"/>" + 
      "<datalist id=\"vertexList" + menuName + "\">";
    
	for (var i = 0; i < this.app.graph.vertices.length; i++)
	{
		res = res + "<option value=\"" + this.app.graph.vertices[i].mainText + "\"/>";
	}
    
    return res + "</datalist>";
}

BaseHandler.prototype.GetSelect2VertexMenu = function()
{
    return "<span style=\"float:right\">" + 
        this.GetSelectVertexMenu("Vertex1") + " &rarr; " + this.GetSelectVertexMenu("Vertex2") + "</span>";
}

BaseHandler.prototype.SelectFirstVertexMenu = function(vertex1Text, vertex)
{}

BaseHandler.prototype.UpdateFirstVertexMenu = function()
{}

BaseHandler.prototype.SelectSecondVertexMenu = function(vertex2Text, vertex)
{}

BaseHandler.prototype.UpdateSecondVertexMenu = function()
{}

BaseHandler.prototype.GetSelectedVertex = function()
{
    return null;
}

BaseHandler.prototype.addContextMenu = function()
{
    var $contextMenu = $("#contextMenu");

    var handler = this;
    
    $("#Context_Delete").click(function() {
        if (handler.contextMenuObject != null) {
            handler.app.PushToStack("DeleteObject");
            handler.app.DeleteObject(handler.contextMenuObject);
            handler.app.redrawGraph();
            userAction("DeleteObject_contextMenu");
        }
    });

    $("#Context_Rename").click(function() {
        if (handler.contextMenuObject != null) {
            var callback = function (enumType) {
                handler.RenameVertex(enumType.GetVertexText(0), handler.contextMenuObject);
                userAction("RenameVertex_contextMenu");
            };            
            var customEnum =  new TextEnumVerticesCustom(handler.app);
            customEnum.ShowDialog(callback, g_rename,  g_renameVertex, handler.contextMenuObject.mainText);
        }
    });

    $("#Context_Connect").click(function() {
        if (handler.contextMenuObject != null && handler.GetSelectedVertex() != null) {
            var addFunc = function(firstVertex, secondVertex, direct) {
                handler.app.CreateNewArc(firstVertex, secondVertex, direct, 
                    document.getElementById('EdgeWeight').value, 
                    $("#RadiosReplaceEdge").prop("checked"), 
                    document.getElementById('EdgeLable').value);
                handler.app.redrawGraph();
            }
            handler.ShowCreateEdgeDialog(handler.GetSelectedVertex(), handler.contextMenuObject, addFunc);
        }
    });

    $("#Context_Delete_Edge").click(function() {
        if (handler.contextMenuObject != null) {
            handler.app.PushToStack("DeleteObject");
            handler.app.DeleteObject(handler.contextMenuObject);
            handler.app.redrawGraph();
            userAction("DeleteObject_contextMenu");
        }
    });
    
    $("#Context_Edit_Edge").click(function() {
        if (handler.contextMenuObject != null) {
            handler.ShowEditEdgeDialog(handler.contextMenuObject);
        }
    });

    $("#Context_Add_Vertex").click(function() {
        handler.app.PushToStack("Add");
        handler.app.CreateNewGraph(handler.contextMenuPoint.x, handler.contextMenuPoint.y);
        handler.app.redrawGraph();
    });
    
    $("#Context_Back_Color").click(function() {
        var setupBackgroundStyle = new SetupBackgroundStyle(handler.app);
		setupBackgroundStyle.show();
    });

    $("body").on("contextmenu", "canvas", function(e) {
        handler.contextMenuPoint = handler.app.getMousePos(handler.app.canvas, e);
        handler.contextMenuObject = handler.GetSelectedObject(handler.contextMenuPoint);
        if (handler.contextMenuObject instanceof BaseVertex) {
            $("#edgeContextMenu").hide();
            $("#backgroundContextMenu").hide();    
            $("#vertexContextMenu").show();
            if (handler.GetSelectedVertex() == null)  {
                $("#Context_Connect").hide();
            } else {
                $("#Context_Connect").show();
            }
        } else if (handler.contextMenuObject instanceof BaseEdge) {
            $("#vertexContextMenu").hide();
            $("#backgroundContextMenu").hide();    
            $("#edgeContextMenu").show();
        } else {
            $("#vertexContextMenu").hide();
            $("#edgeContextMenu").hide();
            $("#backgroundContextMenu").show();
        }

        $contextMenu.css({
            display: "block",
            left: e.offsetX,
            top: e.offsetY
        });
        return false;
    });

    $("body").click(function() {
        $contextMenu.hide();
    });    
}

BaseHandler.prototype.removeContextMenu = function()
{
    $("body").off("contextmenu");
    $("#Context_Delete").off("click");
    $("#Context_Rename").off("click");
    $("#Context_Connect").off("click");    
    $("#Context_Delete_Edge").off("click");  
    $("#Context_Edit_Edge").off("click"); 
    $("#Context_Add_Vertex").off("click"); 
    $("#Context_Back_Color").off("click");    
}

BaseHandler.prototype.RenameVertex = function(text, object)
{
    if (object != null && (object instanceof BaseVertex))
    {
        this.app.PushToStack("RenameVertex");
        object.mainText = text;
        this.app.redrawGraph();
    }
}

BaseHandler.prototype.ShowCreateEdgeDialog = function(firstVertex, secondVertex, addEdgeCallBack) {
    if (!this.app.graph.isMulti())
    {
        var hasEdge        = this.app.graph.FindEdgeAny(firstVertex.id, secondVertex.id);
        var hasReverseEdge = this.app.graph.FindEdgeAny(secondVertex.id, firstVertex.id);

        if (hasEdge == null && hasReverseEdge == null)
        {
            $("#RadiosReplaceEdge").prop("checked", true);
            $("#NewEdgeAction" ).hide();
        }
        else {
            $( "#NewEdgeAction" ).show();
        }
    }
    else
    {
        $("#RadiosAddEdge").prop("checked", true);
        $("#NewEdgeAction" ).hide();
    }

    var dialogButtons = {};
    var handler = this;

    $("#CheckSaveDefaultEdge").prop("checked", false);
    $("#defaultEdgeDialogBlock").show(); 

    dialogButtons[g_orintEdge] = function() {
                handler.app.PushToStack("Connect");                
                addEdgeCallBack(firstVertex, secondVertex, true);
                //handler.AddNewEdge(selectedObject, true);	                    
                $( this ).dialog( "close" );					
            };
    dialogButtons[g_notOrintEdge] = function() {
                handler.app.PushToStack("Connect");
                addEdgeCallBack(firstVertex, secondVertex, false);
                //handler.AddNewEdge(selectedObject, false);                    
                $( this ).dialog( "close" );						
            };

    var edgePresets = this.app.GetEdgePresets();
    var presetsStr  = "<span onClick=\"document.getElementById('EdgeWeight').value='" + g_DefaultWeightPreset 
        + "'; document.getElementById('EdgeWeightSlider').value='" + g_DefaultWeightPreset 
        + "';\" style=\"cursor: pointer\" class=\"defaultWeigth\">" + g_DefaultWeightPreset + "</span>";

    for(var i = 0; i < edgePresets.length; i ++) 
    {
        var edgePreset = edgePresets[i];
        presetsStr += "<span onClick=\"document.getElementById('EdgeWeight').value='" + edgePreset 
        + "'; document.getElementById('EdgeWeightSlider').value=" + edgePreset 
        + ";\" style=\"cursor: pointer\" class=\"defaultWeigth\">" + edgePreset + "</span>";
    }        
    document.getElementById("EdgesPresets").innerHTML = presetsStr;
    document.getElementById('EdgeLable').value = "";

    $( "#addEdge" ).dialog({
        resizable: false,
        height: "auto",
        width:  "auto",
        modal: true,
        title: g_addEdge,
        buttons: dialogButtons,
        dialogClass: 'EdgeDialog',
        open: function () {
                    $(this).off('submit').on('submit', function () {
                        return false;
                    });

                    // Focues weight
                    setTimeout(function(){ 
                        const weightInput = document.getElementById('EdgeWeight');
                        if(weightInput)
                        {
                            weightInput.focus();
                            weightInput.select();        
                        } 
                        },0);                        
            }
    });
}

BaseHandler.prototype.ShowEditEdgeDialog = function(edgeObject) {
    var dialogButtons = {};

    var handler = this;

    dialogButtons[g_save] = function() {
        handler.app.PushToStack("ChangeEdge");

        edgeObject.SetWeight(document.getElementById('EdgeWeight').value);
        edgeObject.SetUpText(document.getElementById('EdgeLable').value);
            
        handler.needRedraw = true;
        handler.app.redrawGraph();

        userAction("ChangeWeight");
        $( this ).dialog( "close" );
    };

    document.getElementById('EdgeWeight').value       = edgeObject.useWeight ? edgeObject.weight : g_noWeight;
    document.getElementById('EdgeWeightSlider').value = edgeObject.useWeight ? edgeObject.weight : 0;

    var edgePresets = handler.app.GetEdgePresets();
    var presetsStr  = "<span onClick=\"document.getElementById('EdgeWeight').value='" + g_DefaultWeightPreset + "'; document.getElementById('EdgeWeightSlider').value='" +
        g_DefaultWeightPreset + "';\" style=\"cursor: pointer\" class=\"defaultWeigth\">" + g_DefaultWeightPreset + "</span>";

    for(var i = 0; i < edgePresets.length; i ++) 
    {
        var edgePreset = edgePresets[i];
        presetsStr += "<span onClick=\"document.getElementById('EdgeWeight').value='" + edgePreset + "'; document.getElementById('EdgeWeightSlider').value=" + 
            edgePreset + ";\" style=\"cursor: pointer\" class=\"defaultWeigth\">" + edgePreset + "</span>";
    }        
    document.getElementById("EdgesPresets").innerHTML = presetsStr;
    document.getElementById('EdgeLable').value = edgeObject.upText;

    $("#CheckSaveDefaultEdge").prop("checked", false);
    
    $("#defaultEdgeDialogBlock").hide(); 

    $( "#addEdge" ).dialog({
        resizable: false,
        height: "auto",
        width:  "auto",
        modal: true,
        title: g_editWeight,
        buttons: dialogButtons,
        dialogClass: 'EdgeDialog',
        open: function () {
        $(handler).off('submit').on('submit', function () {
                                    return false;
                                    });
        }
        });
}
