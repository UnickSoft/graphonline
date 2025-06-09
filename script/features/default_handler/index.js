
doInclude ([
  include ("features/base_handler/index.js")
])

/**
 * Default handler.
 * Select using mouse, drag.
 *
 */
function DefaultHandler(app)
{
  this.removeStack = true;
	BaseHandler.apply(this, arguments);
  this.message = this.GetDefaultText();
  this.selectedObjects = [];
  this.dragObject     = null;
  this.selectedObject = null;
  this.prevPosition   = null;
  this.groupingSelect = false;
  this.selectedLogRect    = false;
  this.selectedLogCtrl    = false;
  this.saveUndo    = false;

  this.addContextMenu();
}

// inheritance.
DefaultHandler.prototype = Object.create(BaseHandler.prototype);
// Is pressed
DefaultHandler.prototype.pressed = false;
// Curve change value.
DefaultHandler.prototype.curveValue    = 0.1;

DefaultHandler.prototype.GetSelectedVertex = function()
{
    return (this.selectedObject instanceof BaseVertex) ? this.selectedObject : null;
}

DefaultHandler.prototype.MouseMove = function(pos) 
{
  if (this.dragObject) {
    if (!this.saveUndo) {
      this.app.PushToStack("Move");
      this.saveUndo = true;
    }

    this.dragObject.position.x = pos.x;
    this.dragObject.position.y = pos.y;
    this.needRedraw = true;
  }
  else if (this.selectedObjects.length > 0 && this.pressed && !this.groupingSelect) {
    if (!this.saveUndo) {
      this.app.PushToStack("Move");
      this.saveUndo = true;
    }

    var offset = (new Point(pos.x, pos.y)).subtract(this.prevPosition);
    for (var i = 0; i < this.selectedObjects.length; i++) {
      var object = this.selectedObjects[i];
      if (object instanceof BaseVertex) {
        object.position = object.position.add(offset);
      }
    }
    this.prevPosition = pos;
    this.needRedraw = true;
  }
  else if (this.pressed) {
    if (this.groupingSelect) {
      // Rect select.
      var newPos = new Point(pos.x, pos.y);
      this.app.SetSelectionRect(new Rect(newPos.min(this.prevPosition), newPos.max(this.prevPosition)));
      this.SelectObjectInRect(this.app.GetSelectionRect());
      this.needRedraw = true;
      if (!this.selectedLogRect) {
        userAction("GroupSelected.SelectRect");
        this.selectedLogRect = true;
      }
    }
    else {
      // Move work space
      this.app.onCanvasMove((new Point(pos.x, pos.y)).subtract(this.prevPosition).multiply(this.app.canvasScale));
      this.needRedraw = true;
    }
  }
}

DefaultHandler.prototype.MouseDown = function(pos)
{
  this.dragObject = null;
  var selectedObject = this.GetSelectedObject(pos);
  var severalSelect = g_ctrlPressed;

  if (selectedObject == null || (!severalSelect && !this.selectedObjects.includes(selectedObject))) {
    this.selectedObject = null;
    this.selectedObjects = [];
    this.groupingSelect = g_ctrlPressed;
  }

  if ((severalSelect || this.selectedObjects.includes(selectedObject)) && (this.selectedObjects.length > 0 || this.selectedObject != null) && selectedObject != null) {
    if (this.selectedObjects.length == 0) {
      this.selectedObjects.push(this.selectedObject);
      this.selectedObject = null;
      this.selectedObjects.push(selectedObject);
    }
    else if (!this.selectedObjects.includes(selectedObject)) {
      this.selectedObjects.push(selectedObject);
    }
    else if (severalSelect && this.selectedObjects.includes(selectedObject)) {
      var index = this.selectedObjects.indexOf(selectedObject);
      this.selectedObjects.splice(index, 1);
    }
    if (!this.selectedLogCtrl) {
      userAction("GroupSelected.SelectCtrl");
      this.selectedLogCtrl = true;
    }
  }
  else 
  {
    if (selectedObject != null) {
      this.selectedObject = selectedObject;
    }
    if ((selectedObject instanceof BaseVertex) && selectedObject != null) {
      this.dragObject = selectedObject;
      this.message = g_moveCursorForMoving;
    }
  }
  this.needRedraw = true;
  this.pressed = true;
  this.prevPosition = pos;
  this.app.canvas.style.cursor = "move";
}

DefaultHandler.prototype.MouseUp = function(pos) 
{
    this.saveUndo = false;
    this.message = this.GetDefaultText();
    this.dragObject = null;
    this.pressed    = false;
    this.app.canvas.style.cursor = "auto";

    this.app.SetSelectionRect(null);
    
    this.groupingSelect = false;
    if (this.selectedObject != null && (this.selectedObject instanceof BaseVertex))
    {
        this.message = g_textsSelectAndMove        
         +  "<div style=\"float:right;position: relative;\">"
         +  "<button type=\"button\" class=\"btn btn-outline-secondary dropdown-toggle btn-sm menu-text white-btn\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">"
         +  " " + g_action + " <span class=\"caret\"></span>"
         +  "</button>"
         +  "<ul class=\"dropdown-menu\" style=\"z-index:15; position: absolute;\">"
         +  " <li><a href=\"#\" class=\"dropdown-item\" id=\"renameButton\">" + g_renameVertex + "</a></li>"
         +  " <li><a href=\"#\" class=\"dropdown-item\" id=\"changeCommonStyle\">" + g_commonVertexStyle + "</a></li>"
         +  " <li><a href=\"#\" class=\"dropdown-item\" id=\"changeSelectedStyle\">" + g_selectedVertexStyle + "</a></li>"
         +  "</ul>"
         +  "</div>";
        
        var handler = this;
        var callback = function (enumType) {
                handler.RenameVertex(enumType.GetVertexText(0), handler.selectedObject);
                userAction("RenameVertex");
        };
        $('#message').unbind();
        $('#message').on('click', '#renameButton', function(){
                        var customEnum =  new TextEnumVerticesCustom(handler.app);
                        customEnum.ShowDialog(callback, g_rename,  g_renameVertex, handler.selectedObject.mainText);
                     });
        $('#message').on('click', '#changeCommonStyle', function(){
            var selectedVertices = handler.app.GetSelectedVertices();
            var setupVertexStyle = new SetupVertexStyle(handler.app);
            setupVertexStyle.show(0, selectedVertices);
        });
        $('#message').on('click', '#changeSelectedStyle', function(){
            var selectedVertices = handler.app.GetSelectedVertices();
            var setupVertexStyle = new SetupVertexStyle(handler.app);
            setupVertexStyle.show(1, selectedVertices);
        });                                          
    }
    else if (this.selectedObject != null && (this.selectedObject instanceof BaseEdge))
    {
        this.message = g_textsSelectAndMove
        + "<span style=\"float:right;\"><button type=\"button\" id=\"incCurvel\" class=\"btn btn-outline-secondary btn-sm menu-text white-btn\"> + </button>"
        + " " + g_curveEdge + " "
        + "<button type=\"button\" id=\"decCurvel\" class=\"btn btn-outline-secondary btn-sm menu-text white-btn\"> - </button> &nbsp; "
        +  "<div style=\"float:right;position: relative;\">"
        +  "<button type=\"button\" class=\"btn btn-outline-secondary dropdown-toggle btn-sm menu-text white-btn\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">"
        +  " " + g_action + " <span class=\"caret\"></span>"
        +  " </button>"
        +  "<ul class=\"dropdown-menu dropdown-menu-right\" style=\"z-index:15; position: absolute;\">"
        +  " <li><a class=\"dropdown-item\" href=\"javascript:;\" id=\"editEdge\">" + g_editWeight + "</a></li>"
        +  " <li><a class=\"dropdown-item\" href=\"javascript:;\" id=\"changeCommonStyle\">" + g_commonEdgeStyle + "</a></li>"
        +  " <li><a class=\"dropdown-item\" href=\"javascript:;\" id=\"changeSelectedStyle\">" + g_selectedEdgeStyle + "</a></li>"
        +  "</ul>"
        +  "</div>";

        var handler = this;
        $('#message').unbind();
        $('#message').on('click', '#editEdge', function(){
                            handler.ShowEditEdgeDialog(handler.selectedObject);
                         });

        $('#message').on('click', '#incCurvel', function(){
            handler.app.PushToStack("ChangeCurvelEdge");

            handler.selectedObject.model.ChangeCurveValue(DefaultHandler.prototype.curveValue);
            handler.needRedraw = true;
            handler.app.redrawGraph();
            userAction("Edge.Bend");
        });
        $('#message').on('click', '#decCurvel', function(){
            handler.app.PushToStack("ChangeCurvelEdge");

            handler.selectedObject.model.ChangeCurveValue(-DefaultHandler.prototype.curveValue);
            handler.needRedraw = true;
            handler.app.redrawGraph();
            userAction("Edge.Bend");
        });
        $('#message').on('click', '#changeCommonStyle', function(){
            var selectedEdges = handler.app.GetSelectedEdges();
            var setupVertexStyle = new SetupEdgeStyle(handler.app);
            setupVertexStyle.show(0, selectedEdges);
        });
        $('#message').on('click', '#changeSelectedStyle', function(){
            var selectedEdges = handler.app.GetSelectedEdges();
            var setupVertexStyle = new SetupEdgeStyle(handler.app);
            setupVertexStyle.show(1, selectedEdges);
        });          
    }
    else if (this.selectedObjects.length > 0)
    {
        this.message = g_dragGroupText + " <span class=\"hidden-phone\">" + g_selectGroupText + "</span>";

        var hasVertices = false;
        var hasEdges = false;
        for(var i = 0; i < this.selectedObjects.length; i ++)
        {
          var object = this.selectedObjects[i];
          if (object instanceof BaseVertex)
          {
            hasVertices = true;
          }
          else if (object instanceof BaseEdge)
          {
            hasEdges = true;
          }
        }

        this.message = this.message + "<span style=\"float:right;position: relative;\">";

        this.message = this.message
            + "<button type=\"button\" id=\"DublicateSelected\" class=\"btn btn-outline-secondary btn-sm menu-text white-btn\">"
            + g_copyGroupeButton + "</button> &nbsp &nbsp"
            + "<button type=\"button\" id=\"RemoveSelected\" class=\"btn btn-outline-secondary btn-sm menu-text white-btn\">"
            + g_removeGroupeButton + "</button>"

        this.message = this.message
            +  " &nbsp &nbsp <button type=\"button\" class=\"btn btn-outline-secondary dropdown-toggle btn-sm menu-text white-btn\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">"
            +  " " + g_action + " <span class=\"caret\"></span>"
            +  " </button>"            
            +  "<ul class=\"dropdown-menu dropdown-menu-right\" style=\"z-index:15; position: absolute;\">";
     
        if (hasEdges) {
            this.message = this.message + " <li><a href=\"javascript:;\" id=\"changeCommonStyleEdge\" class=\"dropdown-item\">"   + g_commonEdgeStyle + "</a></li>";
            this.message = this.message +  " <li><a href=\"javascript:;\" id=\"changeSelectedStyleEdge\" class=\"dropdown-item\">" + g_selectedEdgeStyle + "</a></li>";
        }

        if (hasVertices) {
            this.message = this.message +  " <li><a href=\"javascript:;\" id=\"changeCommonStyleVertex\" class=\"dropdown-item\">" + g_commonVertexStyle + "</a></li>";
            this.message = this.message +  " <li><a href=\"javascript:;\" id=\"changeSelectedStyleVertex\" class=\"dropdown-item\">" + g_selectedVertexStyle + "</a></li>";
        }

        this.message = this.message
        +  "</ul>"
        +  "</span>";
        
        var handler = this;
        $('#message').unbind();
        
        $('#message').on('click', '#DublicateSelected', function(){
            handler.app.PushToStack("DublicateSelection");

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
                    var neighborEdges = handler.app.graph.getNeighborEdges(newObject);
                    if (neighborEdges.length >= 1)
                    {
                        var curve = handler.app.GetAvailableCurveValue(neighborEdges, newObject);
                        newObject.model.SetCurveValue(curve);
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
            handler.app.PushToStack("RemoveSelection");

            userAction("GroupSelected.Remove");
            
            for(var i = 0; i < handler.selectedObjects.length; i ++)
              handler.app.DeleteObject(handler.selectedObjects[i]);
            handler.selectedObjects = [];
            handler.needRedraw = true;
            handler.app.redrawGraph();
            handler.message = g_textsSelectAndMove + " <span class=\"hidden-phone\">" + g_selectGroupText + "</span>";
        });

        if (hasEdges) {
            $('#message').on('click', '#changeCommonStyleEdge', function(){
                var selectedEdges = handler.app.GetSelectedEdges();
                var setupVertexStyle = new SetupEdgeStyle(handler.app);
                setupVertexStyle.show(0, selectedEdges);
            });
            $('#message').on('click', '#changeSelectedStyleEdge', function(){
                var selectedEdges = handler.app.GetSelectedEdges();
                var setupVertexStyle = new SetupEdgeStyle(handler.app);
                setupVertexStyle.show(1, selectedEdges);
            });    
        }

        if (hasVertices) {
            $('#message').on('click', '#changeCommonStyleVertex', function(){
                var selectedVertices = handler.app.GetSelectedVertices();
                var setupVertexStyle = new SetupVertexStyle(handler.app);
                setupVertexStyle.show(0, selectedVertices);
            });
            $('#message').on('click', '#changeSelectedStyleVertex', function(){
                var selectedVertices = handler.app.GetSelectedVertices();
                var setupVertexStyle = new SetupVertexStyle(handler.app);
                setupVertexStyle.show(1, selectedVertices);
            });  
        }
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

DefaultHandler.prototype.GetDefaultText = function()
{
  return g_textsSelectAndMove + 
    " <span class=\"hidden-phone\">" + g_selectGroupText + "</span>" + 
    " <span class=\"hidden-phone\">" + g_useContextMenuText + "</span>" +
    this.GetSelectOneVertexMenu();
}

DefaultHandler.prototype.SelectFirstVertexMenu = function(vertex1Text, vertex)
{
  this.selectedObject = vertex;
  this.MouseUp(new Point(0, 0));
}

DefaultHandler.prototype.UpdateFirstVertexMenu = function(vertex1Text)
{
    if (this.selectedObject)
    {
        vertex1Text.value = this.selectedObject.mainText;        
    }
}

BaseHandler.prototype.GraphWasUpdated = function() 
{
  // Update state
  this.MouseUp(new Point(0, 0));
}
