/**
 *
 *  This event handlers.
 *
 *
 */

/**
 * Base Handler.
 *
 */
 
function BaseHandler(app)
{
	this.app = app;
    this.app.setRenderPath([]);
    
    this.app.ClearUndoStack();
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
		if (this.app.graph.vertices[i].position.distance(pos) < this.app.graph.vertices[i].model.diameter / 2.0)
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

/**
 * Default handler.
 * Select using mouse, drag.
 *
 */
function DefaultHandler(app)
{
	BaseHandler.apply(this, arguments);
	this.message = g_textsSelectAndMove + " <span class=\"hidden-phone\">" + g_selectGroupText + "</span>";
        this.selectedObjects = [];
        this.dragObject     = null;
        this.selectedObject = null;
	this.prevPosition   = null;
    this.groupingSelect = false;
    this.selectedLogRect    = false;
    this.selectedLogCtrl    = false;
}

// inheritance.
DefaultHandler.prototype = Object.create(BaseHandler.prototype);
// Is pressed
DefaultHandler.prototype.pressed = false;
// Cuvled change value.
DefaultHandler.prototype.curvedValue    = 0.1;

DefaultHandler.prototype.MouseMove = function(pos) 
{
	if (this.dragObject)
	{
                this.dragObject.position.x = pos.x;
                this.dragObject.position.y = pos.y;
		this.needRedraw = true;
	}
        else if (this.selectedObjects.length > 0 && this.pressed && !this.groupingSelect)
        {
                var offset = (new Point(pos.x, pos.y)).subtract(this.prevPosition);
                for (var i = 0; i < this.selectedObjects.length; i ++)
                {
                  var object = this.selectedObjects[i];
                  if (object instanceof BaseVertex)
                  {
                    object.position = object.position.add(offset);
                  }
                }
                this.prevPosition = pos;
		this.needRedraw = true;                
        }
        else if (this.pressed)
        {
          if (this.groupingSelect) 
          {
               // Rect select.
               var newPos = new Point(pos.x, pos.y);
               this.app.SetSelectionRect(new Rect(newPos.min(this.prevPosition), newPos.max(this.prevPosition)));
               this.SelectObjectInRect(this.app.GetSelectionRect());    
               this.needRedraw = true;
               if (!this.selectedLogRect)
               {
                 userAction("GroupSelected.SelectRect");
                 this.selectedLogRect = true;
               }
          }
          else
          {
                // Move work space
                this.app.onCanvasMove((new Point(pos.x, pos.y)).subtract(this.prevPosition).multiply(this.app.canvasScale));
                this.needRedraw = true;
          }
        }
}

DefaultHandler.prototype.MouseDown = function(pos)
{
	this.dragObject     = null;
	var selectedObject = this.GetSelectedObject(pos);
	var severalSelect  = g_ctrlPressed;

	if (selectedObject == null || (!severalSelect && !this.selectedObjects.includes(selectedObject)))
    {
  	      this.selectedObject = null;
          this.selectedObjects = [];
          this.groupingSelect = g_ctrlPressed;
    }        

        if ((severalSelect || this.selectedObjects.includes(selectedObject)) && (this.selectedObjects.length > 0 || this.selectedObject != null) && selectedObject != null) 
        {
          if (this.selectedObjects.length == 0)
          {
            this.selectedObjects.push(this.selectedObject);
            this.selectedObject = null;
            this.selectedObjects.push(selectedObject);
          }
          else if (!this.selectedObjects.includes(selectedObject))
          {
            this.selectedObjects.push(selectedObject);
          }
          else if (severalSelect && this.selectedObjects.includes(selectedObject))
          {
            var index = this.selectedObjects.indexOf(selectedObject);
            this.selectedObjects.splice(index, 1);
          }
          if (!this.selectedLogCtrl)
          {
            userAction("GroupSelected.SelectCtrl");
            this.selectedLogCtrl = true;
          }
        }
        else
        {
          if (selectedObject != null)
  	  {
	    this.selectedObject = selectedObject;
 	  }	
 	  if ((selectedObject instanceof BaseVertex) && selectedObject != null)
	  { 
	    this.dragObject = selectedObject;
	    this.message    = g_moveCursorForMoving;		
	  }	
        }
	this.needRedraw = true;
	this.pressed    = true;
	this.prevPosition = pos;
	this.app.canvas.style.cursor = "move";
}

DefaultHandler.prototype.RenameVertex = function(text)
{
    if (this.selectedObject != null && (this.selectedObject instanceof BaseVertex))
    {
        this.selectedObject.mainText = text;
        this.app.redrawGraph();
    }
}

DefaultHandler.prototype.MouseUp = function(pos) 
{
	this.message = g_textsSelectAndMove + " <span class=\"hidden-phone\">" + g_selectGroupText + "</span>";
	this.dragObject = null;
    this.pressed    = false;
    this.app.canvas.style.cursor = "auto";

    this.app.SetSelectionRect(null);
    
    this.groupingSelect = false;
    if (this.selectedObject != null && (this.selectedObject instanceof BaseVertex))
    {
        this.message = g_textsSelectAndMove + " <button type=\"button\" id=\"renameButton\" class=\"btn btn-default btn-xs\" style=\"float:right;z-index:1;position: relative;\">" + g_renameVertex + "</button>";
        
        var handler = this;
        var callback = function (enumType) {
                handler.RenameVertex(enumType.GetVertexText(0));
                userAction("RenameVertex");
        };
        $('#message').unbind();
        $('#message').on('click', '#renameButton', function(){
                        var customEnum =  new TextEnumVertexsCustom();
                        customEnum.ShowDialog(callback, g_rename,  g_renameVertex, handler.selectedObject.mainText);
                     });
    }
    else if (this.selectedObject != null && (this.selectedObject instanceof BaseEdge))
    {
        this.message = g_textsSelectAndMove
        + "<span style=\"float:right;\"><button type=\"button\" id=\"incCurvel\" class=\"btn btn-default btn-xs\"> + </button>"
        + " " + g_curveEdge + " "
        + "<button type=\"button\" id=\"decCurvel\" class=\"btn btn-default btn-xs\"> - </button>"
        + "&nbsp &nbsp<button type=\"button\" id=\"editEdge\" class=\"btn btn-default btn-xs\" style=\"z-index:1;position: relative;\">" + g_editWeight + "</button></span>";
        var handler = this;
        $('#message').unbind();
        $('#message').on('click', '#editEdge', function(){
                         var direct = false;
                         var dialogButtons = {};

                         dialogButtons[g_save] = function() {
                        
                           handler.selectedObject.SetWeight(document.getElementById('EdgeWeight').value);
                           handler.selectedObject.SetUpText(document.getElementById('EdgeLable').value);
                             
                            handler.needRedraw = true;
                            handler.app.redrawGraph();

                            userAction("ChangeWeight");
                            $( this ).dialog( "close" );
                         };

                         document.getElementById('EdgeWeight').value = handler.selectedObject.useWeight ? handler.selectedObject.weight : g_noWeight;
                         document.getElementById('EdgeWeightSlider').value = handler.selectedObject.useWeight ? handler.selectedObject.weight : 0;

                        var edgePresets = handler.app.GetEdgePresets();
                        var presetsStr  = "<span onClick=\"document.getElementById('EdgeWeight').value='" + g_DefaultWeightPreset + "'; document.getElementById('EdgeWeightSlider').value='" + g_DefaultWeightPreset + "';\" style=\"cursor: pointer\" class=\"defaultWeigth\">" + g_DefaultWeightPreset + "</span>";

                        for(var i = 0; i < edgePresets.length; i ++) 
                        {
                            var edgePreset = edgePresets[i];
                            presetsStr += "<span onClick=\"document.getElementById('EdgeWeight').value='" + edgePreset + "'; document.getElementById('EdgeWeightSlider').value=" + edgePreset + ";\" style=\"cursor: pointer\" class=\"defaultWeigth\">" + edgePreset + "</span>";
                        }        
                        document.getElementById("EdgesPresets").innerHTML = presetsStr;
                        document.getElementById('EdgeLable').value = handler.selectedObject.upText;
            
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
                         });

        $('#message').on('click', '#incCurvel', function(){
            handler.selectedObject.model.ChangeCurvedValue(DefaultHandler.prototype.curvedValue);
            handler.needRedraw = true;
            handler.app.redrawGraph();
            userAction("Edge.Bend");
        });
        $('#message').on('click', '#decCurvel', function(){
            handler.selectedObject.model.ChangeCurvedValue(-DefaultHandler.prototype.curvedValue);
            handler.needRedraw = true;
            handler.app.redrawGraph();
            userAction("Edge.Bend");
        });
    }
    else if (this.selectedObjects.length > 0)
    {
        this.message = g_dragGroupText + " <span class=\"hidden-phone\">" + g_selectGroupText + "</span>"
        + "<span style=\"float:right;\">"
        + "<button type=\"button\" id=\"DublicateSelected\" class=\"btn btn-default btn-xs\">"
        + g_copyGroupeButton + "</button> &nbsp &nbsp"
        + "<button type=\"button\" id=\"RemoveSelected\" class=\"btn btn-default btn-xs\">"
        + g_removeGroupeButton + "</button>"
        + "</span>";
        
        var handler = this;
        $('#message').unbind();
        
        $('#message').on('click', '#DublicateSelected', function(){
            userAction("GroupSelected.Dublicate");
            
            var newSelected = [];
            var copyVertex  = {};
            
            // Copy vertex
            for(var i = 0; i < handler.selectedObjects.length; i ++)
            {
              var object = handler.selectedObjects[i];
              if (object instanceof BaseVertex)
              {
                var newObject   = new BaseVertex()
                newObject.copyFrom(object);
                newObject.vertexEnumType = null;
                handler.app.AddNewVertex(newObject);
                var vertex      = newObject;
                var diameter    = (new VertexModel()).diameter;
                vertex.position.offset(diameter, diameter);
                newSelected.push(vertex);
                copyVertex[object.id] = vertex;
              }
            }
            
            // Copy edge
            for (var i = 0; i < handler.selectedObjects.length; i ++)
            {
              var object = handler.selectedObjects[i];
              if (object instanceof BaseEdge)
              {
                var newObject = new BaseEdge()
                newObject.copyFrom(object);
                  
                var toNewVertex = false;
                if (newObject.vertex1.id in copyVertex)
                {
                    newObject.vertex1 = copyVertex[newObject.vertex1.id];
                    toNewVertex = true;
                }
                if (newObject.vertex2.id in copyVertex)
                {
                    newObject.vertex2 = copyVertex[newObject.vertex2.id];
                    toNewVertex = true;
                }
                  
                handler.app.AddNewEdge(newObject);
                if (!toNewVertex)
                {
                    var neighbourEdges = handler.app.graph.getNeighbourEdges(newObject);
                    if (neighbourEdges.length >= 1)
                    {
                        var cruvled = handler.app.GetAvalibleCruvledValue(neighbourEdges, newObject);
                        newObject.model.SetCurvedValue(cruvled);
                    }
                }
                newSelected.push(newObject);
              }
            }

            handler.selectedObjects = newSelected;
            handler.needRedraw      = true;
            handler.app.redrawGraph();
        });
        
        $('#message').on('click', '#RemoveSelected', function(){
            userAction("GroupSelected.Remove");
            
            for(var i = 0; i < handler.selectedObjects.length; i ++)
              handler.app.DeleteObject(handler.selectedObjects[i]);
            handler.selectedObjects = [];
            handler.needRedraw = true;
            handler.app.redrawGraph();
            handler.message = g_textsSelectAndMove + " <span class=\"hidden-phone\">" + g_selectGroupText + "</span>";
        });
    }
    
    this.needRedraw = true;
}

DefaultHandler.prototype.GetSelectedGroup = function(object)
{
  return (object == this.dragObject) || (object == this.selectedObject) ? 1 : 0 || this.selectedObjects.includes(object);
}

DefaultHandler.prototype.SelectObjectInRect = function (rect)
{
    this.selectedObjects = [];
    var vertices = this.app.graph.vertices;
    for (var i = 0; i < vertices.length; i ++)
    {
		if (rect.isIn(vertices[i].position) && !this.selectedObjects.includes(vertices[i]))
            this.selectedObjects.push(vertices[i]);
	}

	// Selected Arc.
    var edges = this.app.graph.edges;
    for (var i = 0; i < edges.length; i ++)
    {
        var edge = edges[i];
        
        if (rect.isIn(edge.vertex1.position) && rect.isIn(edge.vertex2.position) && !this.selectedObjects.includes(edge))
            this.selectedObjects.push(edge);
	}
}


/**
 * Add Graph handler.
 *
 */
function AddGraphHandler(app)
{
  BaseHandler.apply(this, arguments);
  this.message = g_clickToAddVertex;	
}

// inheritance.
AddGraphHandler.prototype = Object.create(BaseHandler.prototype);

AddGraphHandler.prototype.MouseDown = function(pos) 
{
	this.app.CreateNewGraph(pos.x, pos.y);
	this.needRedraw = true;
	this.inited = false;
}

AddGraphHandler.prototype.InitControls = function() 
{
    var enumVertexsText = document.getElementById("enumVertexsText");
    if (enumVertexsText)
    {
        var enumsList = this.app.GetEnumVertexsList();
        for (var i = 0; i < enumsList.length; i ++)
        {
            var option = document.createElement('option');
            option.text  = enumsList[i]["text"];
            option.value = enumsList[i]["value"];
            enumVertexsText.add(option, i);
            if (enumsList[i]["select"])
            {
                enumVertexsText.selectedIndex = i;
            }
        }
        
        var addGraphHandler = this;
        enumVertexsText.onchange = function () {
            addGraphHandler.ChangedType();
        };
    }
}

AddGraphHandler.prototype.ChangedType = function() 
{
	var enumVertexsText = document.getElementById("enumVertexsText");

	this.app.SetEnumVertexsType(enumVertexsText.options[enumVertexsText.selectedIndex].value);
}



/**
 * Connection Graph handler.
 *
 */
function ConnectionGraphHandler(app)
{
  BaseHandler.apply(this, arguments);
  this.SelectFirst();	
}

// inheritance.
ConnectionGraphHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
ConnectionGraphHandler.prototype.firstObject = null;

ConnectionGraphHandler.prototype.AddNewEdge = function(selectedObject, isDirect)
{
	this.app.CreateNewArc(this.firstObject, selectedObject, isDirect, document.getElementById('EdgeWeight').value, $("#RadiosReplaceEdge").prop("checked"), document.getElementById('EdgeLable').value);
    
    EdgeLable
	this.SelectFirst();					
	this.app.NeedRedraw();
}

ConnectionGraphHandler.prototype.SelectVertex = function(selectedObject) 
{
    if (this.firstObject)
    {
        var direct = false;
        var handler = this;
        var dialogButtons = {};
        
        if (!this.app.graph.isMulti())
        {
            var hasEdge        = this.app.graph.FindEdgeAny(this.firstObject.id, selectedObject.id);
            var hasReverseEdge = this.app.graph.FindEdgeAny(selectedObject.id, this.firstObject.id);

            if (hasEdge == null && hasReverseEdge == null)
            {
                $("#RadiosReplaceEdge").prop("checked", true);
                $("#NewEdgeAction" ).hide();
            }
            else
                $( "#NewEdgeAction" ).show();
        }
        else
        {
            $("#RadiosAddEdge").prop("checked", true);
            $("#NewEdgeAction" ).hide();
        }
        
        dialogButtons[g_orintEdge] = function() {
                    handler.AddNewEdge(selectedObject, true);						
                    $( this ).dialog( "close" );					
                };
        dialogButtons[g_notOrintEdge] = function() {
                    handler.AddNewEdge(selectedObject, false);
                    $( this ).dialog( "close" );						
                };
        
        var edgePresets = this.app.GetEdgePresets();
        var presetsStr  = "<span onClick=\"document.getElementById('EdgeWeight').value='" + g_DefaultWeightPreset + "'; document.getElementById('EdgeWeightSlider').value='" + g_DefaultWeightPreset + "';\" style=\"cursor: pointer\" class=\"defaultWeigth\">" + g_DefaultWeightPreset + "</span>";
        
        for(var i = 0; i < edgePresets.length; i ++) 
        {
            var edgePreset = edgePresets[i];
            presetsStr += "<span onClick=\"document.getElementById('EdgeWeight').value='" + edgePreset + "'; document.getElementById('EdgeWeightSlider').value=" + edgePreset + ";\" style=\"cursor: pointer\" class=\"defaultWeigth\">" + edgePreset + "</span>";
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
                }
        });
    }
    else
    {
        this.SelectSecond(selectedObject);	
    }
    this.needRedraw = true;
}

ConnectionGraphHandler.prototype.MouseDown = function(pos) 
{
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
	this.message     = g_selectFisrtVertexToConnect + this.GetSelect2VertexMenu();
}

ConnectionGraphHandler.prototype.SelectSecond = function(selectedObject)
{
	this.firstObject = selectedObject;
	this.message     = g_selectSecondVertexToConnect + this.GetSelect2VertexMenu();						
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

/**
 * Delete Graph handler.
 *
 */
function DeleteGraphHandler(app)
{
  BaseHandler.apply(this, arguments);
  this.message = g_selectObjectToDelete;
}

// inheritance.
DeleteGraphHandler.prototype = Object.create(BaseHandler.prototype);

DeleteGraphHandler.prototype.MouseDown = function(pos) 
{
	var selectedObject = this.GetSelectedObject(pos);
        
    if (!this.app.IsCorrectObject(selectedObject))
        return;
    
    this.app.PushToStack("Delete");
    this.app.DeleteObject(selectedObject);
	this.needRedraw = true;
    
    this.UpdateUndoButton();
}

DeleteGraphHandler.prototype.UpdateUndoButton = function()
{
    if (!this.app.IsUndoStackEmpty())
    {
        this.message = g_selectObjectToDelete + "<span style=\"float:right;\"><button type=\"button\" id=\"undoDelete\" class=\"btn btn-default btn-xs\"> " + g_Undo + " </button>";
        
        var handler = this;
        $('#message').unbind();
        $('#message').on('click', '#undoDelete', function(){
            handler.app.Undo();
            userAction("Undo.Delete");
            
            handler.UpdateUndoButton();
        });
    }
    else
    {
        this.message = g_selectObjectToDelete;        
    }

    this.app.updateMessage();
}

/**
 * Delete Graph handler.
 *
 */
function DeleteAllHandler(app)
{
  BaseHandler.apply(this, arguments);  
}

// inheritance.
DeleteAllHandler.prototype = Object.create(BaseHandler.prototype);

DeleteAllHandler.prototype.clear = function() 
{	
	// Selected Graph.
    this.app.graph = new Graph(); 
    this.app.savedGraphName = "";
    this.needRedraw = true;
}


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
				handler.app.SetAdjacencyMatrixSmart($( "#AdjacencyMatrixField" ).val());					
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};

	$( "#AdjacencyMatrixField" ).val(this.app.GetAdjacencyMatrix());	
	$( "#BadMatrixFormatMessage" ).hide();
	
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
		dialogClass: 'EdgeDialog'
	});
}


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
				handler.app.SetIncidenceMatrixSmart($( "#IncidenceMatrixField" ).val());					
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};

	$( "#IncidenceMatrixField" ).val(this.app.GetIncidenceMatrix());	
	$( "#BadIncidenceMatrixFormatMessage" ).hide();
				
	$( "#incidenceMatrix" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_incidenceMatrixText,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
}


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
            if ((new Graph()).infinity == rawMatrix[i][j])
            {
                matrix += '\u221E';
            }
            else if (i == j)
            {
                matrix += "0";
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

/**
 * Save dialog Graph handler.
 *
 */
function SavedDialogGraphImageHandler(app)
{
    BaseHandler.apply(this, arguments);
    this.message = "";
    this.imageName = "";
}

// inheritance.
SavedDialogGraphImageHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
SavedDialogGraphImageHandler.prototype.firstObject = null;
// Path
SavedDialogGraphImageHandler.prototype.pathObjects = null;
// Objects.
SavedDialogGraphImageHandler.prototype.objects    = null;

SavedDialogGraphImageHandler.prototype.showDialogCallback = function ()
{
    var dialogButtons = {};

    dialogButtons[g_close] = function() {
        $( this ).dialog( "close" );
    };

    var fileLocation = "tmp/saved/" + this.imageName.substr(0, 2) + "/"+ this.imageName + ".png"

    document.getElementById("showSavedImageGraph").src     = "/" + fileLocation;
    document.getElementById("showSavedImageGraphRef").href = "/" + fileLocation;
    //document.getElementById("showSavedImageGraph").src = document.getElementById("showSavedImageGraph").src.replace(/tmp\/saved\/([A-Za-z]*)\/([A-Za-z]*).png/g, fileLocation);
    document.getElementById("ShareSavedImageGraph").innerHTML =
    document.getElementById("ShareSavedImageGraph").innerHTML.replace(/tmp\/saved\/([A-Za-z]*)\/([A-Za-z]*).png/g, fileLocation);

    document.getElementById("SaveImageLinks").innerHTML =
    document.getElementById("SaveImageLinks").innerHTML.replace(/tmp\/saved\/([A-Za-z]*)\/([A-Za-z]*).png/g, fileLocation);

    $( "#saveImageDialog" ).dialog({
                              resizable: false,
                              height: "auto",
                              width:  "auto",
                              modal: true,
                              title: g_save_image_dialog,
                              buttons: dialogButtons,
                              dialogClass: 'EdgeDialog'
                              });

}

SavedDialogGraphImageHandler.prototype.showWorkspace = function()
{
    var object = this;
    var callback = function() {
      object.showDialogCallback();
    };
    
    this.imageName = this.app.SaveGraphImageOnDisk(callback);
}

SavedDialogGraphImageHandler.prototype.showFullgraph = function()
{
    var object = this;
    var callback = function() {
      object.showDialogCallback();
    };
    
    this.imageName = this.app.SaveFullGraphImageOnDisk(callback, false);
}

SavedDialogGraphImageHandler.prototype.showPrint = function()
{
    var object = this;
    var callback = function() {
      object.showDialogCallback();
    };
    
    this.imageName = this.app.SaveFullGraphImageOnDisk(callback, true);
}

/**
 * Algorithm Graph handler.
 *
 */
function AlgorithmGraphHandler(app, algorithm)
{
    BaseHandler.apply(this, arguments);
    this.algorithm = algorithm;
    this.SaveUpText();
    
    this.UpdateResultAndMesasge();
}

// inheritance.
AlgorithmGraphHandler.prototype = Object.create(BaseHandler.prototype);

// Rest this handler.
AlgorithmGraphHandler.prototype.MouseMove = function(pos) {}

AlgorithmGraphHandler.prototype.MouseDown = function(pos)
{
    this.app.setRenderPath([]);
 
    if (this.algorithm.instance())
    {
        this.app.SetDefaultHandler();
    }
    else
    {
        var selectedObject = this.GetSelectedGraph(pos);
        if (selectedObject && (selectedObject instanceof BaseVertex))
        {
            if (this.algorithm.selectVertex(selectedObject))
            {
                this.needRedraw = true;
            }
            
            this.UpdateResultAndMesasge();
        }
        else  if (selectedObject && (selectedObject instanceof BaseEdge))
        {
            if (this.algorithm.selectEdge(selectedObject))
            {
                this.needRedraw = true;
            }
            
            this.UpdateResultAndMesasge();
        }
        else
        {
            if (this.algorithm.deselectAll())
            {
                this.needRedraw = true;
                this.UpdateResultAndMesasge();
            }
        }
    }
}

AlgorithmGraphHandler.prototype.MouseUp   = function(pos) {}

AlgorithmGraphHandler.prototype.GetSelectedGroup = function(object)
{
	return this.algorithm.getObjectSelectedGroup(object);
}

AlgorithmGraphHandler.prototype.RestoreAll = function()
{
    this.app.setRenderPath([]);
 
    if (this.algorithm.needRestoreUpText())
    {
        this.RestoreUpText();
    }
    
    if (this.algorithm.wantRestore())
    {
        this.algorithm.restore();
    }
}

AlgorithmGraphHandler.prototype.SaveUpText = function()
{
    this.vertexUpText = {};
    var graph = this.app.graph;
    for (i = 0; i < graph.vertices.length; i ++)
    {
        this.vertexUpText[graph.vertices[i].id] = graph.vertices[i].upText;
    }
}

AlgorithmGraphHandler.prototype.RestoreUpText = function()
{
    var graph = this.app.graph;

    for (i = 0; i < graph.vertices.length; i ++)
    {
        if (graph.vertices[i].id in this.vertexUpText)
        {
            graph.vertices[i].upText = this.vertexUpText[graph.vertices[i].id];
        }
    }
}

AlgorithmGraphHandler.prototype.UpdateResultAndMesasge = function()
{
    var self = this;
    result = this.algorithm.result(function (result)
                                   {
                                        self.message = self.algorithm.getMessage(g_language);
                                        self.app.resultCallback(result);
                                   });
    
    this.app.resultCallback(result);
    
    this.message = this.algorithm.getMessage(g_language);
}

AlgorithmGraphHandler.prototype.InitControls = function()
{
    this.algorithm.messageWasChanged();
}

AlgorithmGraphHandler.prototype.GetMessage = function()
{
	return this.algorithm.getMessage(g_language);
}


/**
 * Groupe rename vertices.
 *
 */
function GroupRenameVertices(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
GroupRenameVertices.prototype = Object.create(BaseHandler.prototype);
// First selected.
GroupRenameVertices.prototype.firstObject = null;
// Path
GroupRenameVertices.prototype.pathObjects = null;

GroupRenameVertices.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};
    var graph = this.app.graph;
    var app = this.app;
    
	dialogButtons[g_save] = function() {
                var titlesList = $( "#VertextTitleList" ).val().split('\n');
                for (i = 0; i < Math.min(graph.vertices.length, titlesList.length); i ++)
                {
                    graph.vertices[i].mainText = titlesList[i];
                }
                app.redrawGraph();
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};

    var titleList = "";
    for (i = 0; i < graph.vertices.length; i ++)
    {
        titleList = titleList + graph.vertices[i].mainText + "\n";
    }
    
	$( "#VertextTitleList" ).val(titleList);
		
	$( "#GroupRenameDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_groupRename,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
}


/**
 * Setup Vertex Style rename vertices.
 *
 */
function SetupVertexStyle(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
SetupVertexStyle.prototype = Object.create(BaseHandler.prototype);

SetupVertexStyle.prototype.show = function(index)
{
	var handler = this;
	var dialogButtons = {};
    var graph = this.app.graph;
    var app   = this.app;
    var style = Object.assign({}, (index == 0 ? app.vertexCommonStyle : app.vertexSelectedVertexStyles[index - 1]));
    
    var fillFields = function()
    {
        $( "#vertexFillColor" ).val(style.fillStyle);
        $( "#vertexStrokeColor" ).val(style.strokeStyle);
        $( "#vertexTextColor" ).val(style.mainTextColor);
        $( "#vertexStrokeSize" ).val(style.lineWidth);
    }
    
    var redrawVertex = function()
    {
        style.fillStyle     = $( "#vertexFillColor" ).val();
        style.strokeStyle   = $( "#vertexStrokeColor" ).val();
        style.mainTextColor = $( "#vertexTextColor" ).val();
        style.lineWidth     = $( "#vertexStrokeSize" ).val();
        
        var canvas  = document.getElementById( "VertexPreview" );
        var context = canvas.getContext('2d');    
        
        context.save();

        var backgroundDrawer = new BaseBackgroundDrawer(context);
        backgroundDrawer.Draw(app.backgroundCommonStyle, canvas.width, canvas.height, new Point(0, 0), 1.0);
        
        var graphDrawer = new BaseVertexDrawer(context);
        var baseVertex  = new BaseVertex(canvas.width / 2, canvas.height / 2, new BaseEnumVertices(this));
        baseVertex.mainText = "1";
        baseVertex.upText   = "Up Text";
        
        graphDrawer.Draw(baseVertex, style);
        
        context.restore();
    }
    
    //var dialogButtons = [];
    
	dialogButtons[g_default] = 
           {
               text    : g_default,
               class   : "MarginLeft",
               click   : function() {
                    app.ResetVertexStyle(index);
                    app.redrawGraph();
                    $( this ).dialog( "close" );
               }
           };
    
	dialogButtons[g_save] = function() {
                app.SetVertexStyle(index, style);    
                app.redrawGraph();
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};
    
    fillFields();
        
	$( "#SetupVertexStyleDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_vertexDraw,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
    
    redrawVertex();

    $( "#vertexFillColor" ).unbind();
    $( "#vertexStrokeColor" ).unbind();
    $( "#vertexTextColor" ).unbind();
    $( "#vertexStrokeSize" ).unbind();
    
    $( "#vertexFillColor" ).change(redrawVertex);
    $( "#vertexStrokeColor" ).change(redrawVertex);
    $( "#vertexTextColor" ).change(redrawVertex);
    $( "#vertexStrokeSize" ).change(redrawVertex);
}

/**
 * Setup Vertex Style rename vertices.
 *
 */
function SetupEdgeStyle(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
SetupEdgeStyle.prototype = Object.create(BaseHandler.prototype);

SetupEdgeStyle.prototype.show = function(index)
{
	var handler = this;
	var dialogButtons = {};
    var graph = this.app.graph;
    var app   = this.app;
    var style = Object.assign({}, (index == 0 ? app.edgeCommonStyle : app.edgeSelectedStyles[index - 1]));
    
    var fillFields = function()
    {
        $( "#edgeFillColor" ).val(style.fillStyle);
        $( "#edgeStrokeColor" ).val(style.strokeStyle);
        $( "#edgeTextColor" ).val(style.weightText);
    }
    
    var redrawVertex = function()
    {
        style.fillStyle     = $( "#edgeFillColor" ).val();
        style.strokeStyle   = $( "#edgeStrokeColor" ).val();
        style.weightText    = $( "#edgeTextColor" ).val();
        
        var canvas  = document.getElementById( "EdgePreview" );
        var context = canvas.getContext('2d');    
        
        context.save();
        
        var backgroundDrawer = new BaseBackgroundDrawer(context);
        backgroundDrawer.Draw(app.backgroundCommonStyle, canvas.width, canvas.height, new Point(0, 0), 1.0);
        
        var graphDrawer  = new BaseEdgeDrawer(context);
        var baseVertex1  = new BaseVertex(0, canvas.height / 2, new BaseEnumVertices(this));
        var baseVertex2  = new BaseVertex(canvas.width, canvas.height / 2, new BaseEnumVertices(this));
        var baseEdge     = new BaseEdge(baseVertex1, baseVertex2, true, 10, "Text");
        
        graphDrawer.Draw(baseEdge, style);
        
        context.restore();
    }
    
	dialogButtons[g_default] = 
           {
               text    : g_default,
               class   : "MarginLeft",
               click   : function() {
                    app.ResetEdgeStyle(index);
                    app.redrawGraph();
                    $( this ).dialog( "close" );
               }
           };
    
	dialogButtons[g_save] = function() {
                app.SetEdgeStyle(index, style);    
                app.redrawGraph();
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};
    
    fillFields();
        
	$( "#SetupEdgeStyleDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_edgeDraw,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
    
    redrawVertex();

    $( "#edgeFillColor" ).unbind();
    $( "#edgeStrokeColor" ).unbind();
    $( "#edgeTextColor" ).unbind();
    
    $( "#edgeFillColor" ).change(redrawVertex);
    $( "#edgeStrokeColor" ).change(redrawVertex);
    $( "#edgeTextColor" ).change(redrawVertex);
}

/**
 * Setup Background Style rename vertices.
 *
 */
function SetupBackgroundStyle(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
SetupBackgroundStyle.prototype = Object.create(BaseHandler.prototype);

SetupBackgroundStyle.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};
    var graph = this.app.graph;
    var app   = this.app;
    var style = Object.assign({}, app.backgroundCommonStyle);
    
    var fillFields = function()
    {
        $( "#backgroundColor" ).val(style.commonColor);
        $( "#backgroundTransporent" ).val(style.commonOpacity);
    }
    
    var redrawVertex = function()
    {
        style.commonColor     = $( "#backgroundColor" ).val();
        style.commonOpacity   = $( "#backgroundTransporent" ).val();
        
        var canvas  = document.getElementById( "BackgroundPreview" );
        var context = canvas.getContext('2d');    
        
        context.save();

        var backgroundDrawer = new BaseBackgroundDrawer(context);
        backgroundDrawer.Draw(style, canvas.width, canvas.height, new Point(0, 0), 1.0);
        
        context.restore();
    }
    
	dialogButtons[g_default] = 
           {
               text    : g_default,
               class   : "MarginLeft",
               click   : function() {
                    app.ResetBackgroundStyle();
                    app.redrawGraph();
                    $( this ).dialog( "close" );
               }
           };
    
	dialogButtons[g_save] = function() {
                app.SetBackgroundStyle(style);    
                app.redrawGraph();
				$( this ).dialog( "close" );
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );
			};
    
    fillFields();
        
	$( "#SetupBackgroundStyleDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_backgroundStyle,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
    
    redrawVertex();

    $( "#backgroundColor" ).unbind();
    $( "#backgroundTransporent" ).unbind();
    
    $( "#backgroundColor" ).change(redrawVertex);
    $( "#backgroundTransporent" ).change(redrawVertex);
}
