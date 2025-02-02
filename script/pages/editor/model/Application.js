/**
 * This is main application class.
 *
 */
 
var globalApplication = null;
 
function Application(document, window, listener)
{
    this.document = document;
    this.listener = listener;
    this.canvas  = this.document.getElementById('canvas');
    this.handler = new DefaultHandler(this);
    this.savedGraphName = "";
    this.currentEnumVerticesType = new BaseEnumVertices(this, 1);//this.enumVerticesTextList[0];
    this.findPathReport = 1;
    this.isTimerRender = false;
    globalApplication  = this;
    this.renderPath = [];
    this.renderTimer = 0;
    this.renderPathLength  = 0;
    this.renderPathCounter = 0;
    this.renderPathLoops = 0;
    this.enumVerticesTextList = [new BaseEnumVertices(this, 1), 
        new BaseEnumVertices(this, 0), 
        new TextEnumVertices(this), 
        new TextEnumVerticesCyr(this), 
        new TextEnumVerticesGreek(this), 
        new TextEnumVerticesCustom(this)];

    this.SetDefaultTransformations();
    this.algorithmsValues = {};
    this.undoStack  = new UndoStack(this.maxUndoStackSize);

    this.style = new GraphFullStyle(function() 
        {
            this.redrawGraph();
        }.bind(this));
    
    this.edgePrintCommonStyle      = new CommonPrintEdgeStyle();
    this.edgePrintSelectedStyles   = FullArrayCopy(DefaultPrintSelectedEdgeStyles);
    
    this.vertexPrintCommonStyle          = new CommonPrintVertexStyle(); 
    this.vertexPrintSelectedVertexStyles = FullArrayCopy(DefaultPrintSelectedGraphStyles);
    this.backgroundPrintStyle  = new PrintBackgroundStyle();
    this.renderPathWithEdges = false;
    
    this.edgePresets = [1, 3, 5, 7, 11, 42];
    this.maxEdgePresets = 6;
    this.selectionRect  = null;

    this.processEmscriptenFunction = null;

    this.defaultEdge = null;
    this.useDefaultEdge = false;

    this.lastSavedAutoSave = "";
    this.lastGraphName = ""; // It could be last loaded or last saved graph.
};

// Current dragged object.
Application.prototype.graph = new Graph();
Application.prototype.dragObject = -1;
// User handler.
Application.prototype.handler = null;
// Hold status.
Application.prototype.status = {};
// Graph name length
Application.prototype.graphNameLength = 16;
// Max undo stack size
Application.prototype.maxUndoStackSize = 8;
// Max autosave graph size for cookie.
Application.prototype.maxAutosaveSizeForCookie = 2000; // Max cookie size is at least 4096.
// Auto save time interval
Application.prototype.autosaveTimeInterval = 1000 * 60; // in ms. 1 minutes.
// We add postfix into name of graphs with styles.
Application.prototype.styliedGraphNamePostfix = "ZZcst";

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
        this._redrawGraphInWindow();
        
        this.GraphTypeChanged();
    }
}

Application.prototype.redrawGraphTimer = function()
{
    if (this.isTimerRender)
    {
        var context = this._redrawGraphInWindow();
        
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

Application.prototype._redrawGraphInWindow = function()
{
    var context = this.canvas.getContext('2d');
    
    context.save();
    
    context.scale(this.canvasScale, this.canvasScale);
    context.translate(this.canvasPosition.x, this.canvasPosition.y);
    
    this._RedrawGraph(context, {width: this.canvas.width, height: this.canvas.height, scale: this.canvasScale}, 
        this.canvasPosition, this.style.backgroundCommonStyle, true);

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
    
    this._RedrawGraph(context, {width: canvas.width, height: canvas.height, scale: 1.0}, 
        bbox.minPoint.inverse(), this.style.backgroundCommonStyle, false);
    
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
    
    this._RedrawGraph(context, {width: canvas.width, height: canvas.height, scale: 1.0}, 
        bbox.minPoint.inverse(), this.backgroundPrintStyle, false, 
        this.vertexPrintCommonStyle, this.vertexPrintSelectedVertexStyles, 
        this.edgePrintCommonStyle,   this.edgePrintSelectedStyles);
    
    context.restore();
    
    return canvas;
}

Application.prototype._printToSVG = function()
{
    var bbox = this.graph.getGraphBBox();
    var context = new C2S(bbox.size().x, bbox.size().y);
    
    context.save();
    
    context.translate(bbox.minPoint.inverse().x, bbox.minPoint.inverse().y);
    
    this._RedrawGraph(context, {width: bbox.size().x, height: bbox.size().y, scale: 1.0}, 
        bbox.minPoint.inverse(), this.style.backgroundCommonStyle, false);
    
    context.restore();
    
    return context.getSerializedSvg();
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
    
    if (edge.model.type == EdgeModels.curve)
    {
        var curvedArcDrawer = new CurvedArcDrawer(context, edge.model);

        arcDrawer = new BaseEdgeDrawer(context, 
                                        {
                                            drawArc              : curvedArcDrawer, 
                                            startArrowDirection  : curvedArcDrawer,
                                            finishArrowDirection : curvedArcDrawer,
                                            textCenterObject     : curvedArcDrawer,
                                            getPointOnArc        : curvedArcDrawer
                                        }
                                      );
    }
    
    return arcDrawer;
}

Application.prototype.UpdateEdgeCurrentStyle = function(edge, ForceCommonStyle, ForceSelectedStyle)
{
    var commonStyle    = (ForceCommonStyle === undefined) ? this.style.edgeCommonStyle : ForceCommonStyle;
    var selectedStyle  = (ForceSelectedStyle === undefined) ? this.style.edgeSelectedStyles : ForceSelectedStyle;

    var selectedGroup = this.handler.GetSelectedGroup(edge);
    var selected = false;
    if (selectedGroup > 0)
    {
        selectedGroup = (selectedGroup - 1) % selectedStyle.length;
        selected = true;
    }

    var currentStyle = null;
    if (edge.hasOwnStyleFor((selected ? 1 : 0) + selectedGroup))
        currentStyle = edge.getStyleFor((selected ? 1 : 0) + selectedGroup);
    else
        currentStyle = selected ? selectedStyle[selectedGroup] : commonStyle;

    edge.currentStyle = currentStyle;
}

Application.prototype.RedrawEdge = function(context, edge)
{
    var curvedArcDrawer = new CurvedArcDrawer(context, edge.model)
    var arcDrawer       = this.GetBaseArcDrawer(context, edge);
    
    this._RedrawEdge(edge, arcDrawer);
}

Application.prototype._RedrawEdge = function(edge, arcDrawer, commonStyle, selectedStyles)
{
    this._RedrawEdgeWithStyle(edge, edge.currentStyle, arcDrawer, commonStyle, selectedStyles);
}

Application.prototype._RedrawEdgeWithStyle = function(edge, style, arcDrawer, commonStyle, selectedStyles)
{
    arcDrawer.Draw(edge, style.GetStyle({}, edge));
}

Application.prototype.RedrawEdgeProgress = function(context, edge, progress)
{
    var progressDraw     = new ProgressArcDrawer(context, this.GetBaseArcDrawer(context, edge), progress);
    var arcDrawer        = new BaseEdgeDrawer(context, {drawObject : progressDraw});

    this._RedrawEdge(edge, arcDrawer, this.style.edgeCommonStyle, this.style.edgeSelectedStyles);
}

Application.prototype.UpdateEdgesCurrentStyle = function(ForceCommonStyle, ForceSelectedStyle)
{
    for (i = 0; i < this.graph.edges.length; i ++)
    {
        this.UpdateEdgeCurrentStyle(this.graph.edges[i], ForceCommonStyle, ForceSelectedStyle);
    }
}

Application.prototype.RedrawEdges = function(context)
{
    for (i = 0; i < this.graph.edges.length; i ++)
    {
        this.RedrawEdge(context, this.graph.edges[i]);
    }
}

Application.prototype.RedrawNodes = function(context)
{
    var graphDrawer   = new BaseVertexDrawer(context);

    for (i = 0; i < this.graph.vertices.length; i ++)
    {
		graphDrawer.Draw(this.graph.vertices[i], this.graph.vertices[i].currentStyle.GetStyle({}, this.graph.vertices[i]));
    }	
}

Application.prototype.UpdateNodesCurrentStyle = function(ForceCommonStyle, ForceSelectedStyle)
{
    var force         = ForceCommonStyle !== undefined || ForceSelectedStyle !== undefined;
    var commonStyle   = (ForceCommonStyle === undefined) ? this.style.vertexCommonStyle : ForceCommonStyle;
    var selectedStyle = (ForceSelectedStyle === undefined) ? this.style.vertexSelectedVertexStyles : ForceSelectedStyle;

    for (i = 0; i < this.graph.vertices.length; i ++)
    {
		var selectedGroup = this.handler.GetSelectedGroup(this.graph.vertices[i]);
        var selected = false;
        if (selectedGroup > 0)
        {
            selectedGroup = (selectedGroup - 1) % selectedStyle.length;
            selected = true;            
        }

        var currentStyle = null;
        if (this.graph.vertices[i].hasOwnStyleFor((selected ? 1 : 0) + selectedGroup) && !force)
		    currentStyle = this.graph.vertices[i].getStyleFor((selected ? 1 : 0) + selectedGroup);
        else
            currentStyle = selected ? selectedStyle[selectedGroup] : commonStyle;

        this.graph.vertices[i].currentStyle = currentStyle;
    }	
}

Application.prototype.RedrawSelectionRect = function(context)
{
  context.lineWidth    = 1.0 / this.canvasScale;
      
  context.strokeStyle  = this.style.edgeSelectedStyles[0].strokeStyle;	
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
    this.listener.updateMessage(this.handler.GetMessage());
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
    // Skip non left button.
    if(e.which !== 1) return;

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
    // Skip non left button.
    if(e.which !== 1) return;

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

Application.prototype.multCanvasScale = function(factor, zoom_to=null)
{  
    if (zoom_to) // zoom on cursor
    {
        var pos1 = this.getMousePos(this.canvas, zoom_to); // mouse position before zooming
        this.canvasScale *= factor;
        var pos2 = this.getMousePos(this.canvas, zoom_to); // mouse position after zooming

        this.canvasPosition = this.canvasPosition.add(new Point(pos2.x-pos1.x, pos2.y-pos1.y));
    }  
    else // zoom on center
    {
        var oldRealWidth = this.GetRealWidth();
        var oldRealHeight = this.GetRealHeight();
        this.canvasScale *= factor;
        
        this.canvasPosition = this.canvasPosition.add(new Point((this.GetRealWidth()  - oldRealWidth) / 2.0, (this.GetRealHeight() - oldRealHeight) / 2.0));
    }
    
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
    
    this.currentEnumVerticesType.GetVertexTextAsync(
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

    this.graph.FixEdgeCurve(edge);

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

Application.prototype.SetHandler = function(newHandler)
{
    if (this.handler)
    {
        this.handler.RestoreAll();
    } 

    this.handler = newHandler;

    this.ToDefaultStateAndRedraw();
}

Application.prototype.ToDefaultStateAndRedraw = function()
{
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
    this.SetEnumVerticesType(document.cookie.replace(/(?:(?:^|.*;\s*)enumType\s*\=\s*([^;]*).*$)|^.*$/, "$1"));

    var wasLoad = false;
    let startAutoSave = true;
    var matrix  = document.getElementById("inputMatrix").innerHTML;
    var separator = document.getElementById("separator").innerHTML == "space" ? " " : ",";
    
    console.log(matrix);
    console.log("separator: \"" + separator + "\"");
    
    matrix  = (matrix.length <= 0) ? this.getParameterByName("matrix") : matrix;
    if (matrix.length > 0)
    {   
	    if (!this.SetAdjacencyMatrixSmart(matrix, separator))
	    {
           userAction("AdjacencyMatrix.Failed");
		   this.listener.ShowAdjacencyMatrixErrorDialog(matrix);
	    }
        else
        {
           userAction("AdjacencyMatrix.Success");
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
            userAction("IncidenceMatrix.Failed");
		    this.listener.ShowIncidenceMatrixErrorDialog(matrix);
	    }
        else
        {
            userAction("IncidenceMatrix.Success");
        }

    	this.updateMessage();
    	this.redrawGraph();
	    wasLoad = true;
    }

    var pairs  = document.getElementById("inputPair").innerHTML;

    if (pairs.length > 0)
    {    
        pairs = pairs.replaceAll('&gt;', '>');
        pairs = pairs.replaceAll('&lt;', '<');

	    if (!this.SetPairSmart(pairs))
	    {
            userAction("Pair.Failed");
		    this.listener.ShowPairErrorDialog(pairs);
	    }
        else
        {
            userAction("Pair.Success");
        }

    	this.updateMessage();
    	this.redrawGraph();
	    wasLoad = true;
    }    

    if (!wasLoad)
    {
    	var graphName = this.getParameterByName("graph");
        var is_user_graph = graphName.length > 0;
	    if (!is_user_graph)
	    {
           graphName = document.cookie.replace(/(?:(?:^|.*;\s*)graphName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	    }

        // Load from auto save only if it is graph name from cookie
        // or name was empty.
        if (!is_user_graph && this.hasAutoSave())
        {
            userAction("LoadGraphFromAutoSave");
            this.loadAutoSave();
        }
        else if (graphName.length > 0)
	    {
            if (this.getAutoSaveRefGraphCookie() == graphName)
            {
                this.showSelectGraphDialog(graphName);
                console.log("Show select graph dialog");
                startAutoSave = false;
            }
            else
            {
                userAction("LoadGraphFromDisk");
                this.LoadGraphFromDisk(graphName);
            }
	    }
    }

    if (this.undoStack.IsUndoStackEmpty())
        document.getElementById('GraphUndo').style.display = 'none';

    this.updateMessage();
    this.redrawGraph();

    if (startAutoSave)
    {
        this.startAutoSaveTimer();
    }
}

Application.prototype.onLoad = function()
{
    this.canvas = this.document.getElementById('canvas');

    this.SetDefaultHandler()

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
		$.get( "/" + SiteDir + "backend/addFailedMatrix.php?text=adjacency&matrix=" + encodeURIComponent(matrix), function( data ) {;});
		res = false;
	}

	this.graph.SetAdjacencyMatrix(matrix, new Point(this.GetRealWidth(), this.GetRealHeight()), this.currentEnumVerticesType, separator);
    this.AutoAdjustViewport();
	this.redrawGraph();
	return res;
}

Application.prototype.SetPair = function (pair)
{   
	var res = true;
    var r = {};
	var c = {};
	if (!this.TestPair(pair))
	{
		$.get( "/" + SiteDir + "backend/addFailedMatrix.php?text=pair&matrix=" + encodeURIComponent(pair), function( data ) {;});
		res = false;
	}

	this.graph.SetPair(pair, new Point(this.GetRealWidth(), this.GetRealHeight()), this.currentEnumVerticesType);
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

Application.prototype.TestPair = function (pair)
{
	return this.graph.TestPair(pair);
}

Application.prototype.SetIncidenceMatrix = function (matrix)
{
	var res = true;
        var r = {};
	var c = {};
	if (!this.TestIncidenceMatrix(matrix, r, c))
	{
		$.get( "/" + SiteDir + "backend/addFailedMatrix.php?text=incidence&matrix=" + encodeURIComponent(matrix), function( data ) {;});
		res = false;
	}

	this.graph.SetIncidenceMatrix(matrix, new Point(this.GetRealWidth(), this.GetRealHeight()), this.currentEnumVerticesType);
    this.AutoAdjustViewport();
	this.redrawGraph();
	return res;
}

Application.prototype.Test = function ()
{
	this.graph.VerticesReposition(new Point(this.GetRealWidth(), this.GetRealHeight()), this.graph.vertices);
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

Application.prototype.SetPairSmart = function (pair)
{
	var res = false;

    if (this.TestPair(pair))
	{
    	res = this.SetPair(pair);
    }
	else
	{
    	res = false;
	}

	return res;
}


Application.prototype.SaveGraphOnDisk = function ()
{
	var graphAsString = this.graph.SaveToXML(this.SaveUserSettings());
	var app = this;

	if (this.savedGraphName.length <= 0)
	{
		this.savedGraphName = this.GetNewGraphName();
	}

    DiskSaveLoad.SaveGraphOnDisk(this.savedGraphName, graphAsString, function( msg ) 
        {
                document.cookie = "graphName=" + app.savedGraphName;
                // Remove cookie after save, beacuse we have this graph name in cookies.
                app.removeAutosave();
                app.lastGraphName = app.savedGraphName; // Update last graph name after save.
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
    }

    var imageBase64Data = this.canvas.toDataURL();

    DiskSaveLoad.SaveGraphImageOnDisk(imageName, rectParams, imageBase64Data, showDialogCallback);
                          
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

    DiskSaveLoad.SaveGraphImageOnDisk(imageName, rectParams, imageBase64Data, showDialogCallback);
                          
    return imageName;
}

Application.prototype.SaveSVGGraphOnDisk = function (showDialogCallback)
{
    var imageName = this.GetNewName();
                          
    this.stopRenderTimer();
    var svgText = this._printToSVG();

    DiskSaveLoad.SaveSVGGraphOnDisk(imageName, svgText, showDialogCallback);
                          
    return imageName;
}

Application.prototype.LoadGraphFromString = function (str)
{
    var graph = new Graph();
    
    var userSettings = {};
    graph.LoadFromXML(str, userSettings);
    if (userSettings.hasOwnProperty("data") && userSettings["data"].length > 0)
        this.LoadUserSettings(userSettings["data"]);
    this.SetDefaultTransformations();
    this.graph = graph;
    if (this.graph.isNeedReposition())
    {
        this.graph.VerticesReposition(new Point(this.GetRealWidth(), this.GetRealHeight()), this.graph.vertices); 
    }
    this.AutoAdjustViewport();
    this.updateMessage();
    this.redrawGraph();   
}

Application.prototype.LoadNewGraphFromString = function (str)
{
    this.LoadGraphFromString(str); 
    this.lastGraphName = ""; // if we import graph we forget the name.
}

Application.prototype.LoadGraphFromDisk = function (graphName)
{
    var  app = this;
    DiskSaveLoad.LoadGraphFromDisk(graphName, function( msg ) 
	{
       app.LoadGraphFromString(msg);
       // Remove auto save after load from disk.
       app.removeAutosave();
       app.lastGraphName = graphName; // Save graph name on loading.
	});
}

Application.prototype.GetNewGraphName = function()
{
    var name = this.GetNewName();
    
    if (this.style.isVertexCommonStyleCustom || this.style.isVertexSelectedVertexStylesCustom || 
       this.style.isBackgroundCommonStyleCustom || this.style.isEdgeCommonStyleCustom || this.style.isEdgeSelectedStylesCustom)
    {
        name = name + this.styliedGraphNamePostfix;
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
	this.listener.SetDefaultHandler();
}

Application.prototype.GetEnumVerticesList = function()
{
	var res = [];

	for (var i = 0; i < this.enumVerticesTextList.length; i ++)
	{
		var one = {};
		one["text"]  = this.enumVerticesTextList[i].GetText();
		one["value"] = this.enumVerticesTextList[i].GetValue();

		one["select"] = this.enumVerticesTextList[i].GetValue() == this.currentEnumVerticesType.GetValue();

		res.push(one);
	}

	return res;
}

Application.prototype.SetEnumVerticesType = function(value)
{
	for (var i = 0; i < this.enumVerticesTextList.length; i ++)
	{
		if (this.enumVerticesTextList[i].GetValue() == value)
		{
			this.currentEnumVerticesType = this.enumVerticesTextList[i];
			document.cookie = "enumType=" + value;
			break;
		}
	}

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
        obj.category = oneFactory.getCategory();
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
    this.undoStack.PushToStack(actionName, this.graph.SaveToXML(this.SaveUserSettings()));

    document.getElementById('GraphUndo').style.display = 'inline-block';
}

Application.prototype.Undo = function()
{
    let data = this.undoStack.Undo();

    if (data == null)
        return;
    
    this.graph = new Graph();
    var userSettings = {};
    this.graph.LoadFromXML(data, userSettings);
    if (userSettings.hasOwnProperty("data") && userSettings["data"].length > 0)
        this.LoadUserSettings(userSettings["data"]);

    this.redrawGraph();

    if (this.undoStack.IsUndoStackEmpty())
        document.getElementById('GraphUndo').style.display = 'none';    
}

Application.prototype.SaveUserSettings = function()
{
    return "{" + this.style.Save() + "}";
}

Application.prototype.LoadUserSettings = function(json)
{
    this.style.Load(json);
}


Application.prototype.SetVertexStyle = function (index, style)
{
    if (index == 0)
    {
        this.style.vertexCommonStyle = style;
        this.style.isVertexCommonStyleCustom = true;
    }
    else
    {
        this.style.vertexSelectedVertexStyles[index - 1] = style;
        this.style.isVertexSelectedVertexStylesCustom = true;
    }
}

Application.prototype.ResetVertexStyle = function (index)
{
    if (index == 0)
    {
        this.style.vertexCommonStyle = new CommonVertexStyle();
        this.style.isVertexCommonStyleCustom = false;
    }
    else
    {
        this.style.vertexSelectedVertexStyles = FullArrayCopy(DefaultSelectedGraphStyles);
        this.style.isVertexSelectedVertexStylesCustom = false;
    }
}

Application.prototype.SetEdgeStyle = function (index, style)
{
    if (index == 0)
    {
        this.style.edgeCommonStyle = style;
        this.style.isEdgeCommonStyleCustom = true;
    }
    else
    {
        this.style.edgeSelectedStyles[index - 1] = style;
        this.style.isEdgeSelectedStylesCustom = true;
    }
}

Application.prototype.ResetEdgeStyle = function (index)
{
    if (index == 0)
    {
        this.style.edgeCommonStyle = new CommonEdgeStyle();
        this.style.isEdgeCommonStyleCustom = false;
    }
    else
    {
        this.style.edgeSelectedStyles = FullArrayCopy(DefaultSelectedEdgeStyles);
        this.style.isEdgeSelectedStylesCustom = false;
    }
}

Application.prototype.SetBackgroundStyle = function (style)
{
    this.style.backgroundCommonStyle         = style;
    this.style.isBackgroundCommonStyleCustom = true;
}

Application.prototype.ResetBackgroundStyle = function ()
{
    this.style.backgroundCommonStyle         = new CommonBackgroundStyle();
    this.style.isBackgroundCommonStyleCustom = false;
}

Application.prototype.GetAvailableCurveValue = function(neighborEdges, originalEdge)
{
    return this.graph.GetAvailableCurveValue(neighborEdges, originalEdge);
}

Application.prototype.GraphTypeChanged = function()
{
    this.listener.OnGraphTypeChanged(this.graph.isMulti());
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

Application.prototype.GetStyle = function(type, styleName, object, index)
{
    var correctIndex = index;
    if (correctIndex == undefined)
        correctIndex = 0;

    if (type == "vertex")
    {
        if (styleName == "common")
        {
            return object !== undefined ? object.getStyleFor(0) : this.style.vertexCommonStyle;
        }
        else if (styleName == "selected")
        {
            return object !== undefined && object.hasOwnStyleFor(correctIndex + 1) ? object.getStyleFor(correctIndex + 1) : this.style.vertexSelectedVertexStyles[correctIndex];
        }
        else if (styleName == "printed")
        {
            return this.vertexPrintCommonStyle;
        }
        else if (styleName == "printedSelected")
        {
            return this.vertexPrintSelectedVertexStyles[correctIndex];
        }       

        return null;
    }
    else if(type == "edge")
    {
        if (styleName == "common")
        {
            return object !== undefined ? object.getStyleFor(0) : this.style.edgeCommonStyle;
        }
        else if (styleName == "selected")
        {
            return object !== undefined && object.hasOwnStyleFor(correctIndex + 1) ? object.getStyleFor(correctIndex + 1) : this.style.edgeSelectedStyles[correctIndex];
        }
        else if (styleName == "printed")
        {
            return this.edgePrintCommonStyle;
        }
        else if (styleName == "printedSelected")
        {
            return this.edgePrintSelectedStyles[correctIndex];
        }

        return null;
    }

    return null;
}

Application.prototype._RedrawGraph = function(context, canvasParams, backgroundPosition, backgroundStyle, bDrawSelectedRect,
    forceVertexCommon, forceVertexSelected, forceEdgeCommon, forceEdgeSelected)
{
    var backgroundDrawer = new BaseBackgroundDrawer(context);
    
    backgroundDrawer.Draw(
        backgroundStyle, 
        Math.max(canvasParams.width, this.GetRealWidth()), 
        Math.max(canvasParams.height, this.GetRealHeight()), 
        backgroundPosition, 
        canvasParams.scale);
    
    this.UpdateEdgesCurrentStyle(forceEdgeCommon, forceEdgeSelected);
    this.UpdateNodesCurrentStyle(forceVertexCommon, forceVertexSelected);

    this.RedrawEdges(context);
    this.RedrawNodes(context);
    if (bDrawSelectedRect && this.selectionRect != null)
        this.RedrawSelectionRect(context);
}

Application.prototype.GetSelectedVertices = function()
{
    var res = [];
    for (i = 0; i < this.graph.vertices.length; i ++)
    {
        if (this.handler.GetSelectedGroup(this.graph.vertices[i]) > 0)
        {
            res.push(this.graph.vertices[i]);
        }
    }

    return res;
}

Application.prototype.GetSelectedEdges = function()
{
    var res = [];
    for (i = 0; i < this.graph.edges.length; i ++)
    {
        if (this.handler.GetSelectedGroup(this.graph.edges[i]) > 0)
        {
            res.push(this.graph.edges[i]);
        }
    }

    return res;
}

Application.prototype.SetDefaultVertexSize = function(diameter)
{
    var oldDefaultDiameter = this.GetDefaultVertexSize();
    this.style.defaultVertexSize = diameter;

    for (i = 0; i < this.graph.vertices.length; i ++)
    {
        if (this.graph.vertices[i].model.diameter == oldDefaultDiameter)
        {
            this.graph.vertices[i].model.diameter = diameter;
        }
    }     
}

Application.prototype.GetDefaultVertexSize = function(diameter)
{
    if (this.style.defaultVertexSize != null)
        return this.style.defaultVertexSize;
    else
        return defaultVertexDiameter;
}

Application.prototype.ResetVertexSize = function()
{
    this.style.defaultVertexSize = null;

    for (i = 0; i < this.graph.vertices.length; i ++)
    {
        this.graph.vertices[i].model.diameter = this.GetDefaultVertexSize();
    }     
}

Application.prototype.SetDefaultEdgeWidth = function(width)
{
    var oldDefaultWidth = this.GetDefaultEdgeWidth();
    this.style.defaultEdgeWidth = width;

    for (i = 0; i < this.graph.edges.length; i ++)
    {
        if (this.graph.edges[i].model.width == oldDefaultWidth)
        {
            this.graph.edges[i].model.width = width;
        }
    }     
}

Application.prototype.GetDefaultEdgeWidth = function(diameter)
{
    if (this.style.defaultEdgeWidth != null)
        return this.style.defaultEdgeWidth;
    else
        return defaultEdgeWidth;
}

Application.prototype.ResetEdgeWidth = function()
{
    this.style.defaultEdgeWidth = null;

    for (i = 0; i < this.graph.edges.length; i ++)
    {
        this.graph.edges[i].model.width = this.GetDefaultEdgeWidth();
    }     
}

Application.prototype.setEmscripten = function(processFunction) 
{
    this.processEmscriptenFunction = processFunction;
    console.log("Emscripten set");
}

Application.prototype.isSupportEmscripten = function () 
{
    return this.processEmscriptenFunction != null;
}

Application.prototype.processEmscripten = function (inputData)
{
    return this.processEmscriptenFunction(inputData);
}

Application.prototype.setDefaultEdge = function (defaultEdge)
{
    this.defaultEdge = defaultEdge;
}

Application.prototype.hasDefaultEdge = function ()
{
    return this.defaultEdge != null;
}

Application.prototype.getDefaultEdge = function ()
{
    return this.defaultEdge;
}

Application.prototype.setUseDefaultEdge = function (value)
{
    this.useDefaultEdge = value;
}

Application.prototype.getUseDefaultEdge = function ()
{
    return this.useDefaultEdge;
}

Application.prototype.loadGraphFromZippedBase64 = function (base64Str, callback)
{
    decompress_base64_zip_into_text(base64Str, callback);
}

Application.prototype.isAutoSaveGraphName = function (str)
{
    // If it is graph file name or Base64 graph.
    return str.length > 0 && str.length <= this.graphNameLength + this.styliedGraphNamePostfix.length;
}

Application.prototype.saveAutoSave = function (graphXML, callback)
{
    compress_text_into_zip_base64(graphXML, function(base64Str) {
        if (this.lastSavedAutoSave == base64Str)
        {
            if (callback)
            {
                callback();
            }
            return;
        }
    
        if (base64Str.length < this.maxAutosaveSizeForCookie)
        {
            this.setAutoSaveCookie(base64Str);
            let saveGraphData = this.getAutoSaveCookie();
            if (saveGraphData == base64Str)
            {
                this.lastSavedAutoSave = base64Str;
                console.log("Auto save to cookie");
                if (callback)
                {
                    callback();
                }
                return;
            }
            else
            {
                console.log("Failed to save autosave to cookie");
                this.removeAutoSaveCookie();
            }
        }
    
        let autoSaveGraphName = this.getAutoSaveCookie();
    
        if (!this.isAutoSaveGraphName(autoSaveGraphName))
        {
            autoSaveGraphName = this.GetNewGraphName();
        }
    
        let app = this;
        
        // Backend zip graph xml by itself.
        DiskSaveLoad.SaveAutoSaveGraphOnDisk(autoSaveGraphName, graphXML, function( msg ) 
        {
            app.setAutoSaveCookie(autoSaveGraphName);
            app.lastSavedAutoSave = base64Str;
            if (callback)
            {
                callback();
            }
            console.log("Auto save to file");
        }.bind(base64Str));
    }.bind(this));
}

Application.prototype.hasAutoSave = function ()
{
    let autoSaveData = this.getAutoSaveCookie();
    return (autoSaveData.length > 0);
}

Application.prototype.loadAutoSave = function (callback)
{
    let app = this;
    this.getAutoSaveGraph(function(xmlGraph){
        app.LoadGraphFromString(xmlGraph);
        app.lastGraphName = app.getAutoSaveRefGraphCookie();
        if (callback)
        {
            callback();
        }
    });
}

Application.prototype.getAutoSaveGraph = function (callback)
{
    let autoSaveData = this.getAutoSaveCookie();

    if (autoSaveData.length < 0)
    {
        console.log("Auto save to cookie is empty");
        return;
    }

    let app = this;
	if (!this.isAutoSaveGraphName(autoSaveData))
    {
        this.loadGraphFromZippedBase64(autoSaveData, function(xmlGraph){
            console.log("Load graph from cookie");
            if (callback)
            {
                callback(xmlGraph);
            }
        });
        return;
    }

    DiskSaveLoad.LoadAutoSaveGraphFromDisk(autoSaveData, function( xmlGraph ) 
	{
        if (callback)
        {
            callback(xmlGraph);
        }
	});
}

Application.prototype.removeAutosave = function (callback)
{
    let autoSaveData = this.getAutoSaveCookie();
    this.lastSavedAutoSave = "";
    let app = this;
    if (autoSaveData.length < 0)
    {
        console.log("Auto save to cookie is empty");
        return;
    }

    if (!this.isAutoSaveGraphName(autoSaveData))
    {
        app.removeAutoSaveCookie();
        console.log("Remove auto save from cookie");
        if (callback)
        {
            callback();
        }
        return;
    }

    DiskSaveLoad.RemoveAutoSaveGraphFromDisk(autoSaveData, function( msg ) 
    {
        app.removeAutoSaveCookie();
        console.log("Remove auto save file");
        if (callback)
        {
            callback();
        }
    });
}

Application.prototype.setAutoSaveCookie = function (value)
{
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000 * 3600 * 24 * 7; // In a week.
    now.setTime(expireTime);
    document.cookie = 'auto_save=' + value + ';expires=' + now.toUTCString() + ';path=/';
    document.cookie = 'auto_save_ref_graph=' + this.lastGraphName + ';expires=' + now.toUTCString() + ';path=/';
}

Application.prototype.removeAutoSaveCookie = function (value)
{
    document.cookie = "auto_save=;path=/";
    document.cookie = "auto_save_ref_graph=;path=/";
}

Application.prototype.getAutoSaveCookie = function (value)
{
    return document.cookie.replace(/(?:(?:^|.*;\s*)auto_save\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}

Application.prototype.getAutoSaveRefGraphCookie = function (value)
{
    return document.cookie.replace(/(?:(?:^|.*;\s*)auto_save_ref_graph\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}

Application.prototype.CreateNewGraphObject = function ()
{
    this.graph = new Graph(); 
    this.savedGraphName = "";
    this.lastGraphName = ""; // Reset name on create new graph.
}

Application.prototype.showSelectGraphDialog = function(graphName)
{
    let app = this;
    DiskSaveLoad.LoadGraphFromDisk(graphName, function( graphOriginXML ) 
	{
        app.getAutoSaveGraph(function(xmlGraph){
            // We moodify id after each load, so we need to remove it from xml before compare.
            let remove_id_from_xml = function(graphXML)
            {
                graphXML = graphXML.replace(/uidEdge=\"([0-9]+)\"/i,"")
                graphXML = graphXML.replaceAll(/id=\"([0-9]+)\"/g,"")
                return graphXML;
            };

            if (remove_id_from_xml(xmlGraph) == remove_id_from_xml(graphOriginXML))
            {
                app.onSelectOgirinalGraph(graphName);
                return;
            }

            var autosaveGraph = new Graph();
            var userSettings1 = {};
            autosaveGraph.LoadFromXML(xmlGraph, userSettings1);
            let styleAutoSave = new GraphFullStyle(null);
            if (userSettings1.hasOwnProperty("data") && userSettings1["data"].length > 0)
                styleAutoSave.Load(userSettings1["data"]);
            
            var originalGraph = new Graph();
            var userSettings2 = {};
            originalGraph.LoadFromXML(graphOriginXML, userSettings2);
            let styleOriginal = new GraphFullStyle(null);
            if (userSettings2.hasOwnProperty("data") && userSettings2["data"].length > 0)
                styleOriginal.Load(userSettings2["data"]);

            (new SelectGraphDialog(app, 
                originalGraph, styleOriginal,
                autosaveGraph, styleAutoSave,
                function() {
                    app.onSelectOgirinalGraph(graphName);
                },
                function() {
                    app.onSelectAutosaveGraph();
                })).show();
        });
	});
}

Application.prototype.startAutoSaveTimer = function()
{
    // Start autosave timer.
    setInterval(function()
    {
        var graphXML = this.graph.SaveToXML(this.SaveUserSettings());
        this.saveAutoSave(graphXML);
    }.bind(this), this.autosaveTimeInterval);
}

Application.prototype.onSelectOgirinalGraph = function(graphName)
{
    this.LoadGraphFromDisk(graphName);
    this.startAutoSaveTimer();
    userAction("LoadGraphFromDisk_userSelect");
    console.log("User selected original graph");
}

Application.prototype.onSelectAutosaveGraph = function()
{
    this.loadAutoSave();
    this.startAutoSaveTimer();
    userAction("LoadGraphFromAutoSave_userSelect");
    console.log("User selected auto-save graph");
}