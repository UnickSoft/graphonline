/**
 * This is main application class.
 *
 */
 
var globalApplication = null;
 
function Application(document, window)
{
    this.document = document;
    this.canvas  = this.document.getElementById('canvas');
    this.handler = new AddGraphHandler(this);
    this.savedGraphName = "";
    this.currentEnumVertesType = new BaseEnumVertices(this);//this.enumVertexesTextList[0];
    this.findPathReport = 1;
    this.isTimerRender = false;
    globalApplication  = this;
    this.renderPath = [];
    this.renderTimer = 0;
    this.renderPathLength  = 0;
    this.renderPathCounter = 0;
    this.renderPathLoops = 0;
    this.enumVertexesTextList = [new BaseEnumVertices(this), new TextEnumVertexs(this), new TextEnumVertexsCyr(this), new TextEnumVertexsGreek(this), new TextEnumVertexsCustom(this)];
    this.SetDefaultTransformations();
    this.algorithmsValues = {};
    this.userAction = function(){};
    this.undoStack  = [];
    
    this.edgeCommonStyle         = new CommonEdgeStyle();
    this.isEdgeCommonStyleCustom = false;
    this.edgeSelectedStyles      = FullArrayCopy(DefaultSelectedEdgeStyles);
    this.isEdgeSelectedStylesCustom = false;
    
    this.edgePrintCommonStyle      = new CommonPrintEdgeStyle();
    this.edgePrintSelectedStyles   = FullArrayCopy(DefaultPrintSelectedEdgeStyles);
    
    this.vertexCommonStyle          = new CommonVertexStyle();
    this.isVertexCommonStyleCustom  = false;
    this.vertexSelectedVertexStyles = FullArrayCopy(DefaultSelectedGraphStyles);
    this.isVertexSelectedVertexStylesCustom  = false;
    
    this.vertexPrintCommonStyle          = new CommonPrintVertexStyle(); 
    this.vertexPrintSelectedVertexStyles = FullArrayCopy(DefaultPrintSelectedGraphStyles);
    
    this.backgroundCommonStyle = new CommonBackgroundStyle();
    this.backgroundPrintStyle  = new PrintBackgroundStyle(); 
    this.isBackgroundCommonStyleCustom  = false;
    this.renderPathWithEdges = false;
    
    this.edgePresets = [1, 3, 5, 7, 11, 42];
    this.maxEdgePresets = 6;
    this.selectionRect  = null;
};

// List of graph.
//Application.prototype.graph.vertices     = [];
// Current draged object.
Application.prototype.graph = new Graph();
Application.prototype.dragObject = -1;
// List of graph.edges.
//Application.prototype.graph.edges       = [];
// User handler.
Application.prototype.handler = null;
// Hold status.
Application.prototype.status = {};
// Graph name length
Application.prototype.graphNameLength = 16;
// Max undo stack size
Application.prototype.maxUndoStackSize = 8;

Application.prototype.getMousePos = function(canvas, e)
{
    /// getBoundingClientRect is supported in most browsers and gives you
    /// the absolute geometry of an element
    var rect = canvas.getBoundingClientRect();

    /// as mouse event coords are relative to document you need to
    /// subtract the element's left and top position:
    return {x: (e.clientX - rect.left) / this.canvasScale - this.canvasPosition.x, y: (e.clientY - rect.top) / this.canvasScale - this.canvasPosition.y};
}

Application.prototype.redrawGraph = function()
{
    if (!this.isTimerRender)
    {
        this._redrawGraph();
        
        this.GraphTypeChanged();
    }
}

Application.prototype.redrawGraphTimer = function()
{
    if (this.isTimerRender)
    {
        var context = this._redrawGraph();
        
        // Render path
        if (this.renderPath.length > 1)
        {
            context.save();
            context.scale(this.canvasScale, this.canvasScale);
            context.translate(this.canvasPosition.x, this.canvasPosition.y);
            
            var movePixelStep = 16;
            var currentLength = 0;
            
            var i = 0
            for (i = 0; i < this.renderPath.length - 1; i++)
            {
                var edge = null;
                if (this.renderPathWithEdges)
                {
                    edge = this.graph.FindEdgeById(this.renderPath[i + 1]);
                    i++;
                }
                else if (this.renderMinPath)
                {
                    edge = this.graph.FindEdgeMin(this.renderPath[i], this.renderPath[i + 1]);
                }
                else
                {
                    edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
                }
                    
                currentLength += edge.GetPixelLength();
                if (currentLength > this.renderPathCounter)
                {
                    currentLength -= edge.GetPixelLength();
                    break;
                }
            }
            
            if (i >= this.renderPath.length - 1)
            {
                i = 0;
                if (this.renderPathWithEdges)
                    i = 1;
                this.renderPathCounter = 0;
                currentLength = 0;
                this.renderPathLoops += 1;
            }
            
            var edge = null;
            var currentVertexId = this.renderPath[i];
            if (this.renderPathWithEdges)
            {
                edge = this.graph.FindEdgeById(this.renderPath[i]);
                currentVertexId = this.renderPath[i - 1];
            }
            else if (this.renderMinPath)
            {
                edge = this.graph.FindEdgeMin(this.renderPath[i], this.renderPath[i + 1]);
            }
            else
            {
                edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
            }
            
            var progress = (this.renderPathCounter - currentLength) / edge.GetPixelLength();
            
            this.RedrawEdgeProgress(context, edge, edge.vertex1.id == currentVertexId ? progress : 1.0 - progress);

            this.renderPathCounter += movePixelStep;
            
            context.restore();
        }
    }
    
    if (this.renderPathLoops >= 5)
    {
        this.stopRenderTimer();
    }
}

Application.prototype._redrawGraph = function()
{
    var context = this.canvas.getContext('2d');
    
    context.save();
    
    context.scale(this.canvasScale, this.canvasScale);
    context.translate(this.canvasPosition.x, this.canvasPosition.y);
    
    var backgroundDrawer = new BaseBackgroundDrawer(context);
    
    backgroundDrawer.Draw(this.backgroundCommonStyle, Math.max(this.canvas.width, this.GetRealWidth()), Math.max(this.canvas.height, this.GetRealHeight()), this.canvasPosition, this.canvasScale);
    
    this.RedrawEdges(context);
    this.RedrawNodes(context);
    if (this.selectionRect != null)
      this.RedrawSelectionRect(context);

    context.restore();
    
    return context;
}

Application.prototype._OffscreenRedrawGraph = function()
{
    var bbox = this.graph.getGraphBBox();
    var canvas = document.createElement('canvas');
    canvas.width  = bbox.size().x;
    canvas.height = bbox.size().y;
    var context = canvas.getContext('2d');
    
    context.save();

    context.translate(bbox.minPoint.inverse().x, bbox.minPoint.inverse().y);
    
    var backgroundDrawer = new BaseBackgroundDrawer(context);
    
    backgroundDrawer.Draw(this.backgroundCommonStyle, Math.max(this.canvas.width, this.GetRealWidth()), Math.max(this.canvas.height, this.GetRealHeight()), bbox.minPoint.inverse(), this.canvasScale);
    
    this.RedrawEdges(context);
    this.RedrawNodes(context);
    
    context.restore();
    
    return canvas;
}

Application.prototype._PrintRedrawGraph = function()
{
    var bbox = this.graph.getGraphBBox();
    var canvas = document.createElement('canvas');
    canvas.width  = bbox.size().x;
    canvas.height = bbox.size().y;
    var context = canvas.getContext('2d');
    
    context.save();
    
    context.translate(bbox.minPoint.inverse().x, bbox.minPoint.inverse().y);
    
    var backgroundDrawer = new BaseBackgroundDrawer(context);
    
    backgroundDrawer.Draw(this.backgroundPrintStyle, Math.max(this.canvas.width, this.GetRealWidth()), Math.max(this.canvas.height, this.GetRealHeight()), bbox.minPoint.inverse(), this.canvasScale);
    
    this.RedrawEdges(context, this.edgePrintCommonStyle,   this.edgePrintSelectedStyles);
    this.RedrawNodes(context, this.vertexPrintCommonStyle, this.vertexPrintSelectedVertexStyles);
    
    context.restore();
    
    return canvas;
}

Application.prototype.updateRenderPathLength = function()
{
    this.renderPathLength = 0;
    this.renderPathCounter = 0;
    if (this.renderPath.length > 1)
    {
        for (var i = 0; i < this.renderPath.length - 1; i++)
        {
            var edge = null;
            if (this.renderPathWithEdges)
            {
                edge = this.graph.FindEdgeById(this.renderPath[i + 1]);
                i++;
            }
            else
            {
                edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
            }
            this.renderPathLength += edge.GetPixelLength();
        }
    }
}

Application.prototype.startRenderTimer = function()
{
    this.updateRenderPathLength();
    this.renderTimer = window.setInterval(function(){globalApplication.redrawGraphTimer();}, 50);
    this.isTimerRender = true;
    this.renderPathLoops = 0;
}

Application.prototype.stopRenderTimer = function()
{
    if (this.isTimerRender)
    {
        window.clearInterval(this.renderTimer);
        this.isTimerRender = false;
        this.renderPathLoops = 0;
    }
}

Application.prototype.setRenderPath = function(renderPath, renderMinPath)
{
    this.renderPath    = renderPath;
    this.renderMinPath = renderMinPath;
    this.renderPathWithEdges = false;
    
    if (this.renderPath.length > 0)
    {
        this.startRenderTimer();
    }
    else
    {
        this.stopRenderTimer();
    }
}

Application.prototype.setRenderPathWithEdges = function(renderPath)
{
    this.renderPath    = renderPath;
    this.renderMinPath = false;
    this.renderPathWithEdges = true;
    
    if (this.renderPath.length > 0)
    {
        this.startRenderTimer();
    }
    else
    {
        this.stopRenderTimer();
    }
}

Application.prototype.GetBaseArcDrawer = function(context, edge)
{
    var arcDrawer = new BaseEdgeDrawer(context);
    
    if (edge.model.type == EdgeModels.cruvled)
    {
        var curvedArcDrawer = new CurvedArcDrawer(context, edge.model);

        arcDrawer = new BaseEdgeDrawer(context, 
                                        {
                                            drawArc             : curvedArcDrawer, 
                                            startArrowDiretion  : curvedArcDrawer,
                                            finishArrowDiretion : curvedArcDrawer,
                                            textCenterObject    : curvedArcDrawer,
                                            getPointOnArc       : curvedArcDrawer
                                        }
                                      );
    }
    
    return arcDrawer;
}

Application.prototype.RedrawEdge = function(context, edge, ForceCommonStyle, ForceSelectedStyle)
{
    var curvedArcDrawer = new CurvedArcDrawer(context, edge.model)
    var arcDrawer       = this.GetBaseArcDrawer(context, edge);
    
    var commonStyle   = (ForceCommonStyle === undefined) ? this.edgeCommonStyle : ForceCommonStyle;
    var selectedStyle = (ForceSelectedStyle === undefined) ? this.edgeSelectedStyles : ForceSelectedStyle;
    
    this._RedrawEdge(edge, arcDrawer, commonStyle, selectedStyle);
}

Application.prototype._RedrawEdge = function(edge, arcDrawer, commonStyle, selectedStyles)
{
    var selectedGroup = this.handler.GetSelectedGroup(edge);
    var currentStyle  = selectedGroup > 0 ?
        selectedStyles[(selectedGroup - 1) % selectedStyles.length] : commonStyle;
    
    this._RedrawEdgeWithStyle(edge, currentStyle, arcDrawer, commonStyle, selectedStyles);
}

Application.prototype._RedrawEdgeWithStyle = function(edge, style, arcDrawer, commonStyle, selectedStyles)
{
    arcDrawer.Draw(edge, style.GetStyle({}));
}

Application.prototype.RedrawEdgeProgress = function(context, edge, progress)
{
    var progressDraw     = new ProgressArcDrawer(context, this.GetBaseArcDrawer(context, edge), progress);
    var arcDrawer        = new BaseEdgeDrawer(context, {drawObject : progressDraw});

    this._RedrawEdge(edge, arcDrawer, this.edgeCommonStyle, this.edgeSelectedStyles);
}

Application.prototype.RedrawEdges = function(context, ForceCommonStyle, ForceSelectedStyle)
{
    for (i = 0; i < this.graph.edges.length; i ++)
    {
        this.RedrawEdge(context, this.graph.edges[i], ForceCommonStyle, ForceSelectedStyle);
    }
}

Application.prototype.RedrawNodes = function(context, ForceCommonStyle, ForceSelectedStyle)
{
    var graphDrawer   = new BaseVertexDrawer(context);
    var commonStyle   = (ForceCommonStyle === undefined) ? this.vertexCommonStyle : ForceCommonStyle;
    var selectedStyle = (ForceSelectedStyle === undefined) ? this.vertexSelectedVertexStyles : ForceSelectedStyle;

    for (i = 0; i < this.graph.vertices.length; i ++)
    {
		var selectedGroup = this.handler.GetSelectedGroup(this.graph.vertices[i]);
		var currentStyle  = selectedGroup > 0 ?
				selectedStyle[(selectedGroup - 1) % selectedStyle.length] : commonStyle;

		graphDrawer.Draw(this.graph.vertices[i], currentStyle.GetStyle({}));
    }	
}

Application.prototype.RedrawSelectionRect = function(context)
{
  context.lineWidth    = 1.0 / this.canvasScale;
      
  context.strokeStyle  = this.edgeSelectedStyles[0].strokeStyle;	
  context.setLineDash([6, 3]);
  context.beginPath();
  context.rect(this.selectionRect.left(), this.selectionRect.top(), 
               this.selectionRect.size().x, this.selectionRect.size().y);
  context.closePath();
  context.stroke();
    
  context.setLineDash([]);
}

Application.prototype.updateMessage = function()
{
	this.document.getElementById('message').innerHTML = this.handler.GetMessage(); 
	this.handler.InitControls();
}

Application.prototype.CanvasOnMouseMove  = function(e)
{
	// X,Y position.
	var pos = this.getMousePos(this.canvas, e);

	this.handler.MouseMove(pos);
	if (this.handler.IsNeedRedraw())
	{
		this.handler.RestRedraw();
		this.redrawGraph();
	}

    this.updateMessage();
}

Application.prototype.CanvasOnMouseDown = function(e)
{
    var pos = this.getMousePos(this.canvas, e); /// provide this canvas and event

	this.handler.MouseDown(pos);
	if (this.handler.IsNeedRedraw())
	{
		this.handler.RestRedraw();
		this.redrawGraph();
	}

    this.updateMessage();
}

Application.prototype.CanvasOnMouseUp = function(e)
{
//	this.dragObject = -1;
	var pos = this.getMousePos(this.canvas, e);

	this.handler.MouseUp(pos);
	if (this.handler.IsNeedRedraw())
	{
		this.handler.RestRedraw();
		this.redrawGraph();
	}

    this.updateMessage();
}

Application.prototype.multCanvasScale = function(factor)
{
    var oldRealWidth = this.GetRealWidth();
    var oldRealHeight = this.GetRealHeight();
    
    this.canvasScale *= factor;
    
    this.canvasPosition = this.canvasPosition.add(new Point((this.GetRealWidth()  - oldRealWidth) / 2.0,
                                                            (this.GetRealHeight() - oldRealHeight) / 2.0));
    
    this.redrawGraph();
}

Application.prototype.setCanvasScale = function(factor)
{
    var oldRealWidth = this.GetRealWidth();
    var oldRealHeight = this.GetRealHeight();
    
    this.canvasScale = factor;
    
    this.canvasPosition = this.canvasPosition.add(new Point((this.GetRealWidth()  - oldRealWidth) / 2.0,
                                                            (this.GetRealHeight() - oldRealHeight) / 2.0));
    
    this.redrawGraph();
}

Application.prototype.onCanvasMove = function(point)
{
    this.canvasPosition = this.canvasPosition.add(point.multiply(1 / this.canvasScale));
    this.redrawGraph();
}

Application.prototype.AddNewVertex = function(vertex)
{
	return this.graph.AddNewVertex(vertex);
}

Application.prototype.AddNewEdge = function(edge, replaceIfExists)
{
	return this.graph.AddNewEdge(edge, replaceIfExists);
}

Application.prototype.CreateNewGraph = function(x, y)
{
    var app = this;
    
    this.currentEnumVertesType.GetVertexTextAsync(
                        function (enumType)
                        {
                            app.graph.AddNewVertex(new BaseVertex(x, y, enumType));
                            app.redrawGraph();
                                                  });
}

Application.prototype.CreateNewGraphEx = function(x, y, vertexEnume)
{
    return this.graph.AddNewVertex(new BaseVertex(x, y, vertexEnume));
}

Application.prototype.CreateNewArc = function(graph1, graph2, isDirect, weight, replaceIfExist, upText)
{
	var edge = this.AddNewEdge(new BaseEdge(graph1, graph2, isDirect, weight, upText), replaceIfExist);

    this.graph.FixEdgeCurved(edge);

    var edgeObject = this.graph.edges[edge];

    if (edgeObject.useWeight)
        this.UpdateEdgePresets(edgeObject.weight);
    
    return edge;
}

Application.prototype.DeleteEdge = function(edgeObject)
{
    var vertex1 = edgeObject.vertex1;
    var vertex2 = edgeObject.vertex2;
    
    var hasPair = this.graph.hasPair(edgeObject);
    
	this.graph.DeleteEdge(edgeObject);
    
    // Make line for pair.
    if (hasPair)
    {
        var pairEdges = this.FindAllEdges(vertex2.id, vertex1.id);
        
        if (pairEdges.length == 1 && pairEdges[0].model.default)
            pairEdges[0].model.type = EdgeModels.line;
    }
}

Application.prototype.DeleteVertex = function(graphObject)
{
	this.graph.DeleteVertex(graphObject);
}

Application.prototype.DeleteObject = function(object)
{
	if (object instanceof BaseVertex)
	{
		this.DeleteVertex(object);
	}
	else if (object instanceof BaseEdge)
	{
		this.DeleteEdge(object);
	}
}

Application.prototype.IsCorrectObject = function(object)
{
	return (object instanceof BaseVertex) || 
           (object instanceof BaseEdge);
}

Application.prototype.FindVertex = function(id)
{
	return this.graph.FindVertex(id);
}

Application.prototype.FindEdge = function(id1, id2)
{
	return this.graph.FindEdge(id1, id2);
}

Application.prototype.FindEdgeAny = function(id1, id2)
{
	return this.graph.FindEdgeAny(id1, id2);
}

Application.prototype.FindAllEdges = function(id1, id2)
{
	return this.graph.FindAllEdges(id1, id2);
}

Application.prototype.SetHandlerMode = function(mode)
{
    var manipolationHandlers = ["default", "addGraph", "addArc", "delete", "findPath", "connectedComponent", "eulerianLoop"];
    
    if (this.handler && (g_AlgorithmIds.indexOf(mode) >= 0 || manipolationHandlers.indexOf(mode) >= 0))
    {
        this.handler.RestoreAll();
    }
    
	if (mode == "default")
	{
		this.handler = new DefaultHandler(this);
	}
	else if (mode == "addGraph")
	{
		this.handler = new AddGraphHandler(this);
	}
	else if (mode == "addArc")
	{
		this.handler = new ConnectionGraphHandler(this);
	}
	else if (mode == "delete")
	{
		this.handler = new DeleteGraphHandler(this);
	}
	else if (mode == "deleteAll")
	{
		var removeAll = new DeleteAllHandler(this);
		removeAll.clear();
	}	
	else if (mode == "findPath")
	{
		this.handler = new FindPathGraphHandler(this);
	}
	else if (mode == "showAdjacencyMatrix")
	{
		var showAdjacencyMatrix = new ShowAdjacencyMatrix(this);
		showAdjacencyMatrix.show();
	}
	else if (mode == "showIncidenceMatrix")
	{
		var showIncidenceMatrix = new ShowIncidenceMatrix(this);
		showIncidenceMatrix.show();
	}
    else if (mode == "showDistanceMatrix")
	{
		var showDistanceMatrix = new ShowDistanceMatrix(this);
		showDistanceMatrix.show();
	}
	else if (mode == "connectedComponent")
	{
		this.handler = new ConnectedComponentGraphHandler(this);
	}  
	else if (mode == "saveDialog")
	{
		var savedDialogGraphHandler = new SavedDialogGraphHandler(this);
		savedDialogGraphHandler.show();
	}
    else if (mode == "saveDialogImage")
    {
        var savedDialogGraphImageHandler = new SavedDialogGraphImageHandler(this);
        savedDialogGraphImageHandler.showWorkspace();
    }
    else if (mode == "saveDialogFullImage")
    {
        var savedDialogGraphImageHandler = new SavedDialogGraphImageHandler(this);
        savedDialogGraphImageHandler.showFullgraph();           
    }
    else if (mode == "savePrintGraphImage")
    {
        var savedDialogGraphImageHandler = new SavedDialogGraphImageHandler(this);
        savedDialogGraphImageHandler.showPrint();           
    }
    else if (mode == "eulerianLoop")
    {
		this.handler = new EulerianLoopGraphHandler(this);
    }
    else if (mode == "GroupRename")
    {
		var groupRenameVertices = new GroupRenameVertices(this);
		groupRenameVertices.show();
    }
    else if (mode == "setupVertexStyle")
    {
		var setupVertexStyle = new SetupVertexStyle(this);
		setupVertexStyle.show(0);
    }
    else if (mode == "setupVertexStyleSelected")
    {
		var setupVertexStyle = new SetupVertexStyle(this);
		setupVertexStyle.show(1); 
    }
    else if (mode == "setupEdgeStyle")
    {
		var setupEdgeStyle = new SetupEdgeStyle(this);
		setupEdgeStyle.show(0);
    }
    else if (mode == "setupEdgeStyleSelected")
    {
		var setupEdgeStyle = new SetupEdgeStyle(this);
		setupEdgeStyle.show(1); 
    }
    else if (mode == "setupBackgroundStyle")
    {
		var setupBackgroundStyle = new SetupBackgroundStyle(this);
		setupBackgroundStyle.show();
    }
    else if (g_AlgorithmIds.indexOf(mode) >= 0)
    {
        this.handler = new AlgorithmGraphHandler(this, g_Algorithms[g_AlgorithmIds.indexOf(mode)](this.graph, this));
    }
    
    console.log(mode);

    this.setRenderPath([]);
	this.updateMessage();
	this.redrawGraph();
}


Application.prototype.getParameterByName = function (name)
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

Application.prototype.onPostLoadEvent = function()
{
    this.SetEnumVertexsType(document.cookie.replace(/(?:(?:^|.*;\s*)enumType\s*\=\s*([^;]*).*$)|^.*$/, "$1"));

    var wasLoad = false;
    var matrix  = document.getElementById("inputMatrix").innerHTML;
    var separator = document.getElementById("separator").innerHTML == "space" ? " " : ",";
    
    console.log(matrix);
    console.log("separator: \"" + separator + "\"");
    
    matrix  = (matrix.length <= 0) ? this.getParameterByName("matrix") : matrix;
    if (matrix.length > 0)
    {   
	    if (!this.SetAdjacencyMatrixSmart(matrix, separator))
	    {
           this.userAction("AdjacencyMatrix.Failed");
		   this.ShowAdjacencyMatrixErrorDialog(matrix);
	    }
        else
        {
           this.userAction("AdjacencyMatrix.Success");
        }

    	this.updateMessage();
    	this.redrawGraph();
        wasLoad = true;
    }

    var matrix  = document.getElementById("inputIncidenceMatrix").innerHTML;
    matrix  = (matrix.length <= 0) ? this.getParameterByName("incidenceMatrix") : matrix;
    
    if (matrix.length > 0)
    {    
	    if (!this.SetIncidenceMatrixSmart(matrix))
	    {
            this.userAction("IncidenceMatrix.Failed");
		    this.ShowIncidenceMatrixErrorDialog(matrix);
	    }
        else
        {
            this.userAction("IncidenceMatrix.Success");
        }

    	this.updateMessage();
    	this.redrawGraph();
	    wasLoad = true;
    }

    if (!wasLoad)
    {
    	var graphName  = this.getParameterByName("graph");
	    if (graphName.length <= 0)
	    {
           graphName = document.cookie.replace(/(?:(?:^|.*;\s*)graphName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	    }
                          
       	if (graphName.length > 0)
	    {
            this.userAction("LoadGraphFromDisk");
    		this.LoadGraphFromDisk(graphName);
	    }
    }

    this.updateMessage();
    this.redrawGraph();
}

Application.prototype.onLoad = function()
{
    this.canvas = this.document.getElementById('canvas');

    this.handler = new AddGraphHandler(this);

    this.updateMessage();
    this.redrawGraph();
}

Application.prototype.NeedRedraw = function()
{
	//TODO
	this.updateMessage();
	this.redrawGraph();
}

Application.prototype.SetStatus = function(name, value)
{
	this.status[name] = value;
}

Application.prototype.GetStatus = function()
{
	return this.status[name];
}


Application.prototype.GetAdjacencyMatrix = function ()
{
	return this.graph.GetAdjacencyMatrixStr();
}

Application.prototype.TestAdjacencyMatrix = function (matrix, rowsObj, colsObj, separator)
{
    if(separator === undefined) 
    {
      separator = ",";
    }
    
	return this.graph.TestAdjacencyMatrix(matrix, rowsObj, colsObj, separator);
}

Application.prototype.SetAdjacencyMatrix = function (matrix, separator)
{
    if(separator === undefined) 
    {
      separator = ",";
    }
    
	var res = true;
    var r = {};
	var c = {};
	if (!this.TestAdjacencyMatrix(matrix, r, c, separator))
	{
		$.get( "/" + SiteDir + "cgi-bin/addFailedMatrix.php?text=adjacency&matrix=" + encodeURIComponent(matrix), function( data ) {;});
		res = false;
	}

	this.graph.SetAdjacencyMatrix(matrix, new Point(this.GetRealWidth(), this.GetRealHeight()), this.currentEnumVertesType, separator);
    this.AutoAdjustViewport();
	this.redrawGraph();
	return res;
}


Application.prototype.GetIncidenceMatrix = function ()
{
	return this.graph.GetIncidenceMatrix();
}

Application.prototype.TestIncidenceMatrix = function (matrix, rowsObj, colsObj)
{
	return this.graph.TestIncidenceMatrix(matrix, rowsObj, colsObj);
}

Application.prototype.SetIncidenceMatrix = function (matrix)
{
	var res = true;
        var r = {};
	var c = {};
	if (!this.TestIncidenceMatrix(matrix, r, c))
	{
		$.get( "/" + SiteDir + "cgi-bin/addFailedMatrix.php?text=incidence&matrix=" + encodeURIComponent(matrix), function( data ) {;});
		res = false;
	}

	this.graph.SetIncidenceMatrix(matrix, new Point(this.GetRealWidth(), this.GetRealHeight()), this.currentEnumVertesType);
    this.AutoAdjustViewport();
	this.redrawGraph();
	return res;
}

Application.prototype.Test = function ()
{
	this.graph.VertexesReposition(new Point(this.GetRealWidth(), this.GetRealHeight()), this.graph.vertices);
	this.redrawGraph();
}


Application.prototype.SetAdjacencyMatrixSmart = function (matrix, separator)
{
    if (separator === undefined) 
    {
      separator = ",";
    }
    
	var res = false;
	if (this.TestAdjacencyMatrix(matrix, {}, {}, separator))
        {
    		res = this.SetAdjacencyMatrix(matrix, separator);
	}
        else if (this.TestIncidenceMatrix(matrix, {}, {}))
	{
    		res = this.SetIncidenceMatrix(matrix);
        }
	else
	{
    		res = this.SetAdjacencyMatrix(matrix);
	}
	return res;
}

Application.prototype.SetIncidenceMatrixSmart = function (matrix)
{
	var res = false;

        if (this.TestIncidenceMatrix(matrix, {}, {}))
	{
    		res = this.SetIncidenceMatrix(matrix);
        }
	else if (this.TestAdjacencyMatrix(matrix, {}, {})) 	
        {
    		res = this.SetAdjacencyMatrix(matrix);
	}
	else
	{
    		res = this.SetIncidenceMatrix(matrix);
	}

	return res;
}


Application.prototype.SaveGraphOnDisk = function ()
{
	var graphAsString = this.graph.SaveToXML(this.SaveUserSettings());
    
    var styleSave = this.SaveUserSettings();
	
	if (this.savedGraphName.length <= 0)
	{
		this.savedGraphName = this.GetNewGraphName();
	}

	var app = this;
	$.ajax({
	type: "POST",
	url: "/" + SiteDir + "cgi-bin/saveGraph.php?name=" + this.savedGraphName,
	data: graphAsString,
	dataType: "text"
	})
	.done(function( msg ) 
	{
	        document.cookie = "graphName=" + app.savedGraphName;
	});
}
                          
Application.prototype.SaveGraphImageOnDisk = function (showDialogCallback)
{
    var imageName = this.GetNewName();
                          
    this.stopRenderTimer();
    this.redrawGraph();
                          
    var bbox = this.graph.getGraphBBox();
    
    var rectParams = "";
    if (this.IsGraphFitOnViewport())
    {
        var canvasWidth  = this.GetRealWidth();
        var canvasHeight = this.GetRealHeight();
        var canvasPositionInverse = this.canvasPosition.inverse();

        var pos = bbox.minPoint.subtract(canvasPositionInverse);
        
        rectParams = "&x=" + Math.round(pos.x * this.canvasScale) + "&y=" + Math.round(pos.y * this.canvasScale)
            + "&width=" + Math.round(bbox.size().x * this.canvasScale) + "&height=" + Math.round(bbox.size().y * this.canvasScale);
        
        //console.log(rectParams);
    }

    var imageBase64Data = this.canvas.toDataURL();

    $.ajax({
     type: "POST",
     url: "/" + SiteDir + "cgi-bin/saveImage.php?name=" + imageName + rectParams,
     data: {
           base64data : imageBase64Data
     },
     dataType: "text",
     success: function(data){
        showDialogCallback();
    }
     });
                          
    return imageName;
}

Application.prototype.SaveFullGraphImageOnDisk = function (showDialogCallback, forPrint)
{
    var imageName = this.GetNewName();
                          
    this.stopRenderTimer();
    var canvas = forPrint ? this._PrintRedrawGraph() : this._OffscreenRedrawGraph();
                          
    var bbox = this.graph.getGraphBBox();
    
    var rectParams = ""; 
    rectParams = "&x=0" + "&y=0" + "&width=" + bbox.size().x + "&height=" + bbox.size().y;

    var imageBase64Data = canvas.toDataURL();

    $.ajax({
     type: "POST",
     url: "/" + SiteDir + "cgi-bin/saveImage.php?name=" + imageName + rectParams,
     data: {
           base64data : imageBase64Data
     },
     dataType: "text",
     success: function(data){
        showDialogCallback();
    }
     });
                          
    return imageName;
}
                          
Application.prototype.LoadGraphFromString = function (str)
{
    var graph = new Graph();
    
    //console.log(str);
    
    var userSettings = {};
    graph.LoadFromXML(str, userSettings);
    if (userSettings.hasOwnProperty("data") && userSettings["data"].length > 0)
        this.LoadUserSettings(userSettings["data"]);
    this.SetDefaultTransformations();
    this.graph = graph;
    if (this.graph.isNeedReposition())
    {
        this.graph.VertexesReposition(new Point(this.GetRealWidth(), this.GetRealHeight()), this.graph.vertices); 
    }
    this.AutoAdjustViewport();
    this.updateMessage();
    this.redrawGraph();   
}

Application.prototype.LoadGraphFromDisk = function (graphName)
{
	var  app = this;

	$.ajax({
	type: "GET",
	url: "/" + SiteDir + "cgi-bin/loadGraph.php?name=" + graphName
	})
	.done(function( msg ) 
	{
       app.LoadGraphFromString(msg);
	});
}


Application.prototype.GetNewGraphName = function()
{
    var name = this.GetNewName();
    
    if (this.isVertexCommonStyleCustom || this.isVertexSelectedVertexStylesCustom || 
       this.isBackgroundCommonStyleCustom || this.isEdgeCommonStyleCustom || this.isEdgeSelectedStylesCustom)
    {
        name = name + "ZZcst";
    }
    
    return name;
}

Application.prototype.GetNewName = function()
{
    var name = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < this.graphNameLength; i++ )
    {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return name;
}

Application.prototype.GetGraphName = function()
{
    return this.savedGraphName;
}


Application.prototype.SetDefaultHandler = function()
{
	restButtons ('Default');
	this.SetHandlerMode("default");
}

Application.prototype.GetEnumVertexsList = function()
{
	var res = [];

	for (var i = 0; i < this.enumVertexesTextList.length; i ++)
	{
		var one = {};
		one["text"]  = this.enumVertexesTextList[i].GetText();
		one["value"] = this.enumVertexesTextList[i].GetValue();

		one["select"] = this.enumVertexesTextList[i].GetValue() == this.currentEnumVertesType.GetValue();

		res.push(one);
	}

	return res;
}

Application.prototype.SetEnumVertexsType = function(value)
{
	for (var i = 0; i < this.enumVertexesTextList.length; i ++)
	{
		if (this.enumVertexesTextList[i].GetValue() == value)
		{
			this.currentEnumVertesType = this.enumVertexesTextList[i];
			document.cookie = "enumType=" + value;
			break;
		}
	}

}


Application.prototype.ShowAdjacencyMatrixErrorDialog = function(matrix)
{
	var dialogButtons = {};

	matrixRes = matrix.replace(/\n/g,'%0A');
	dialogButtons[g_readMatrixHelp] = function() {
			window.location.assign(g_language == "ru" ? "./wiki/Справка/МатрицаСмежности#matrixFormat" : "./wiki/Help/AdjacencyMatrix#matrixFormat");
		};
	dialogButtons[g_fixMatrix] = function() {
			window.location.assign("./create_graph_by_matrix?matrix=" + matrixRes);
		};
	dialogButtons[g_close] = function() {
			$( this ).dialog( "close" );					
		}; 

	$( "#matrixError" ).dialog({
		resizable: false,
		title: g_matrixWrongFormat,
		width: 400,
		modal: true,
		dialogClass: 'EdgeDialog',
		buttons: dialogButtons,
	});
}

Application.prototype.ShowIncidenceMatrixErrorDialog = function(matrix)
{
	var dialogButtons = {};

	matrixRes = matrix.replace(/\n/g,'%0A');
	dialogButtons[g_readMatrixHelp] = function() {
			window.location.assign(g_language == "ru" ? "./wiki/Справка/МатрицаИнцидентности#matrixFormat" : "./wiki/Help/IncidenceMatrix#matrixFormat");
		};
	dialogButtons[g_fixMatrix] = function() {
			window.location.assign("./create_graph_by_incidence_matrix?incidenceMatrix=" + matrixRes);
		};
	dialogButtons[g_close] = function() {
			$( this ).dialog( "close" );					
		}; 

	$( "#matrixErrorInc" ).dialog({
		resizable: false,
		title: g_matrixWrongFormat,
		width: 400,
		modal: true,
		dialogClass: 'EdgeDialog',
		buttons: dialogButtons,
	});
}
                          
Application.prototype.SetFindPathReport = function (value)
{
    this.findPathReport = value;
}
                          
Application.prototype.GetFindPathReport = function ()
{
    return this.findPathReport;
}
                                                    
Application.prototype.GetRealWidth = function ()
{
    return this.canvas.width / this.canvasScale;
}
                          
Application.prototype.GetRealHeight = function ()
{
    return this.canvas.height / this.canvasScale;
}
                          
Application.prototype.SetDefaultTransformations = function()
{
    this.canvasScale = 1.0;
    this.canvasPosition = new Point(0, 0);
}

Application.prototype.AutoAdjustViewport = function()
{
    graphBBox  = this.graph.getGraphBBox();
    bboxCenter = graphBBox.center();
    bboxSize   = graphBBox.size();
                          
    if (bboxSize.length() > 0)
    {
        // Setup size
        if (bboxSize.x > this.GetRealWidth() || bboxSize.y > this.GetRealHeight())
        {
            this.canvasScale = Math.min(this.GetRealWidth() / bboxSize.x, this.GetRealHeight() / bboxSize.y);
        }
                          
        // Setup position.
        if (graphBBox.minPoint.x < 0.0 || graphBBox.minPoint.y < 0.0 ||
            graphBBox.maxPoint.x > this.GetRealWidth() || graphBBox.maxPoint.y > this.GetRealHeight())
        {
            // Move center.
            this.canvasPosition  = graphBBox.minPoint.inverse();
        }
    }
}
                          
Application.prototype.OnAutoAdjustViewport = function()
{
    this.SetDefaultTransformations();
    this.AutoAdjustViewport();
    this.redrawGraph();
}
                          
Application.prototype.getAlgorithmNames = function()
{
    var res = [];
    for (var i = 0; i < g_Algorithms.length; i++)
    {
        factory = g_Algorithms[i];
        var obj = {};
        oneFactory = factory(this.graph);
        obj.name = oneFactory.getName(g_language);
        obj.id   = oneFactory.getId();
        obj.priority = oneFactory.getPriority();
        res.push(obj);
    }
    
    res.sort(function (a, b) {
      return a.priority - b.priority;
    });
    
    return res;
}
   
Application.prototype.resultCallback = function(paths)
{
    console.log(paths);
    if ((paths instanceof Object) && "paths" in paths)
    {
        this.setRenderPath(paths["paths"][0], "minPath" in paths);
    }
    else if ((paths instanceof Object) && "pathsWithEdges" in paths)
    {
        this.setRenderPathWithEdges(paths["pathsWithEdges"][0]);
    }
    
    this.updateMessage();
    this.redrawGraph();
}

Application.prototype.GetCurrentValue = function(paramName, defaultValue)
{
    return (paramName in this.algorithmsValues) ? this.algorithmsValues[paramName] : defaultValue;
}

Application.prototype.SetCurrentValue = function(paramName, value)
{
    this.algorithmsValues[paramName] = value;
}

Application.prototype.IsGraphFitOnViewport = function()
{
    res = true;
    graphBBox  = this.graph.getGraphBBox();
    var canvasWidth  = this.GetRealWidth();//  * this.canvasScale;
    var canvasHeight = this.GetRealHeight();// * this.canvasScale;
    var canvasPositionInverse = this.canvasPosition./*multiply(this.canvasScale).*/inverse();
    //console.log("BBox_min = " + graphBBox.minPoint.toString() + " - BBox_max = " + graphBBox.maxPoint.toString()
    //    + " Position" + canvasPositionInverse.toString() + " - cw = " + canvasWidth + " ch = " + canvasHeight);
    
    return (Math.floor(canvasPositionInverse.x) <= Math.floor(graphBBox.minPoint.x) &&
        Math.floor(canvasPositionInverse.y) <= Math.floor(graphBBox.minPoint.y) && Math.floor(canvasPositionInverse.x + canvasWidth) >= Math.floor(graphBBox.maxPoint.x)
        && Math.floor(canvasPositionInverse.y + canvasHeight) >= Math.floor(graphBBox.maxPoint.y));
}

Application.prototype.PushToStack = function(actionName)
{
    var object        = {};
    object.actionName = actionName;
    object.graphSave  = this.graph.SaveToXML("");    
    
    this.undoStack.push(object);
    
    while (this.undoStack.length > this.maxUndoStackSize)
    {
        this.undoStack.shift();
    }
}

Application.prototype.Undo = function()
{
    if (this.IsUndoStackEmpty())
        return;
    
    var state  = this.undoStack.pop();
    this.graph = new Graph();
    var empty;
    this.graph.LoadFromXML(state.graphSave, empty);
    this.redrawGraph();
}

Application.prototype.ClearUndoStack = function()
{
    this.undoStack = [];
}

Application.prototype.IsUndoStackEmpty = function()
{
    return (this.undoStack.length <= 0);
}

Application.prototype.SaveUserSettings = function()
{
    var res = "{";
    
    var needEnd    = false;
    var checkValue = [];
    
    checkValue.push({field: "edgeCommonStyle",
                     value: this.edgeCommonStyle,
                     check: this.isEdgeCommonStyleCustom});
    
    checkValue.push({field: "edgeSelectedStyles",
                     value: this.edgeSelectedStyles,
                     check: this.isEdgeSelectedStylesCustom});

    //checkValue.push({field: "edgePrintCommonStyle",
    //                 value: this.edgePrintCommonStyle});

    //checkValue.push({field: "edgePrintSelectedStyles",
    //                 value: this.edgePrintSelectedStyles});
    
    checkValue.push({field: "vertexCommonStyle",
                     value: this.vertexCommonStyle,
                     check: this.isVertexCommonStyleCustom});
    
    checkValue.push({field: "vertexSelectedVertexStyles",
                     value: this.vertexSelectedVertexStyles,
                     check: this.isVertexSelectedVertexStylesCustom});
    
    checkValue.push({field: "backgroundCommonStyle",
                     value: this.backgroundCommonStyle,
                     check: this.isBackgroundCommonStyleCustom});
    
    //checkValue.push({field: "vertexPrintCommonStyle",
    //                 value: this.vertexPrintCommonStyle});

    //checkValue.push({field: "vertexPrintSelectedVertexStyles",
    //                 value: this.vertexPrintSelectedVertexStyles});
    
    checkValue.forEach(function(entry) {
            if (!entry.check)
                return;
                
            if (needEnd)
                res = res + ",";
                
            res = res + "\"" + entry.field + "\"" + ":" + JSON.stringify(entry.value);
            needEnd = true;
        });
    
    res = res + "}";
    
    return this.EncodeToHTML(res);
}

Application.prototype.LoadUserSettings = function(json)
{
    var checkValue = [];
    
    checkValue.push({field: "edgeCommonStyle",
                     value: this.edgeCommonStyle,
                     check: "isEdgeCommonStyleCustom",
                     deep: false});
    
    checkValue.push({field: "edgeSelectedStyles",
                     value: this.edgeSelectedStyles,
                     check: "isEdgeSelectedStylesCustom",
                     deep: true});

    //checkValue.push({field: "edgePrintCommonStyle",
    //                 value: this.edgePrintCommonStyle});

    //checkValue.push({field: "edgePrintSelectedStyles",
    //                 value: this.edgePrintSelectedStyles});
    
    checkValue.push({field: "vertexCommonStyle",
                     value: this.vertexCommonStyle,
                     check: "isVertexCommonStyleCustom",
                     deep: false});
    
    checkValue.push({field: "vertexSelectedVertexStyles",
                     value: this.vertexSelectedVertexStyles,
                     check: "isVertexSelectedVertexStylesCustom",
                     deep: true});
    
    //checkValue.push({field: "vertexPrintCommonStyle",
    //                 value: this.vertexPrintCommonStyle});

    //checkValue.push({field: "vertexPrintSelectedVertexStyles",
    //                 value: this.vertexPrintSelectedVertexStyles});
    
    checkValue.push({field: "backgroundCommonStyle",
                     value: this.backgroundCommonStyle,
                     check: "isBackgroundCommonStyleCustom",
                     deep: false});
    
    var decoderStr = this.DecodeFromHTML(json);
    var parsedSave = JSON.parse(decoderStr);
    
    var app = this;
    
    checkValue.forEach(function(entry) {
            if (parsedSave.hasOwnProperty(entry.field))
            {
                for(var k in parsedSave[entry.field])
                {
                    if (!entry.deep)
                    {
                        if (entry.value.ShouldLoad(k))
                            entry.value[k] = parsedSave[entry.field][k];
                    }
                    else
                    {
                        for(var deepK in parsedSave[entry.field][k])
                        {
                            if (entry.value[k].ShouldLoad(deepK))
                                entry.value[k][deepK] = parsedSave[entry.field][k][deepK];
                        }
                    }
                }
                
                app[entry.check] = true;
            }
        });
}

Application.prototype.EncodeToHTML = function (str)
{
    return gEncodeToHTML(str);
}

Application.prototype.DecodeFromHTML = function (str)
{
   return gDecodeFromHTML(str); 
}

Application.prototype.SetVertexStyle = function (index, style)
{
    if (index == 0)
    {
        this.vertexCommonStyle = style;
        this.isVertexCommonStyleCustom = true;
    }
    else
    {
        this.vertexSelectedVertexStyles[index - 1] = style;
        this.isVertexSelectedVertexStylesCustom = true;
    }
}

Application.prototype.ResetVertexStyle = function (index)
{
    if (index == 0)
    {
        this.vertexCommonStyle = new CommonVertexStyle();
        this.isVertexCommonStyleCustom = false;
    }
    else
    {
        this.vertexSelectedVertexStyles = FullArrayCopy(DefaultSelectedGraphStyles);
        this.isVertexSelectedVertexStylesCustom = false;
    }
}

Application.prototype.SetEdgeStyle = function (index, style)
{
    if (index == 0)
    {
        this.edgeCommonStyle = style;
        this.isEdgeCommonStyleCustom = true;
    }
    else
    {
        this.edgeSelectedStyles[index - 1] = style;
        this.isEdgeSelectedStylesCustom = true;
    }
}

Application.prototype.ResetEdgeStyle = function (index)
{
    if (index == 0)
    {
        this.edgeCommonStyle = new CommonEdgeStyle();
        this.isEdgeCommonStyleCustom = false;
    }
    else
    {
        this.edgeSelectedStyles = FullArrayCopy(DefaultSelectedEdgeStyles);
        this.isEdgeSelectedStylesCustom = false;
    }
}

Application.prototype.SetBackgroundStyle = function (style)
{
    this.backgroundCommonStyle         = style;
    this.isBackgroundCommonStyleCustom = true;
}

Application.prototype.ResetBackgroundStyle = function ()
{
    this.backgroundCommonStyle         = new CommonBackgroundStyle();
    this.isBackgroundCommonStyleCustom = false;
}

Application.prototype.GetAvalibleCruvledValue = function(neighbourEdges, originalEdge)
{
    return this.graph.GetAvalibleCruvledValue(neighbourEdges, originalEdge);
}

Application.prototype.GraphTypeChanged = function()
{
    $("#CanvasMessage").text(this.graph.isMulti() ? g_GrapsIsMultiMessage : g_GrapsIsGeneralMessage);
}

Application.prototype.UpdateEdgePresets = function(weight)
{
    var oldPresets = this.edgePresets;
    this.edgePresets = [1];
    oldPresets.unshift(weight);
    
    for(var i = 0; i < oldPresets.length; i ++) 
    {
        var k = oldPresets[i];
        if (!this.edgePresets.includes(k))
            this.edgePresets.push(k);
        
        if (this.edgePresets.length >= this.maxEdgePresets)
            break;
    }
}

Application.prototype.GetEdgePresets = function()
{
    return this.edgePresets;
}

Application.prototype.SetSelectionRect = function(rect)
{
  this.selectionRect = rect;
}

Application.prototype.GetSelectionRect = function(rect)
{
  return this.selectionRect;
}

Application.prototype.GetStyle = function(type, styleName)
{
    if (type == "vertex")
    {
        if (styleName == "common")
        {
            return this.vertexCommonStyle;
        }
        else if (styleName == "selected")
        {
            return this.vertexSelectedVertexStyles[0];
        }
        else if (styleName == "printed")
        {
            return this.vertexPrintCommonStyle;
        }
        else if (styleName == "printedSelected")
        {
            return this.vertexPrintSelectedVertexStyles[0];
        }       

        return null;
    }
    else if(type == "edge")
    {
        if (styleName == "common")
        {
            return this.edgeCommonStyle;
        }
        else if (styleName == "selected")
        {
            return this.edgeSelectedVertexStyles[0];
        }
        else if (styleName == "printed")
        {
            return this.edgePrintCommonStyle;
        }
        else if (styleName == "printedSelected")
        {
            return this.edgePrintSelectedVertexStyles[0];
        }       

        return null;
    }

    return null;
}
