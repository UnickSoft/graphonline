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
                var edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
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
                this.renderPathCounter = 0;
                currentLength = 0;
                this.renderPathLoops += 1;
            }
            
            var edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
            
            var progress = (this.renderPathCounter - currentLength) / edge.GetPixelLength();
            
            this.RedrawEdgeProgress(context, edge, edge.vertex1.id == this.renderPath[i] ? progress : 1.0 - progress);

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
    context.clearRect(0, 0, Math.max(this.canvas.width, this.GetRealWidth()), Math.max(this.canvas.height, this.GetRealHeight()));
    context.scale(this.canvasScale, this.canvasScale);
    context.translate(this.canvasPosition.x, this.canvasPosition.y);
    
    this.RedrawEdges(context);
    this.RedrawNodes(context);
    
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
    context.clearRect(0, 0, Math.max(this.canvas.width, this.GetRealWidth()), Math.max(this.canvas.height, this.GetRealHeight()));
    context.translate(bbox.minPoint.inverse().x, bbox.minPoint.inverse().y);
    
    this.RedrawEdges(context);
    this.RedrawNodes(context);
    
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
            var edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
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

Application.prototype.setRenderPath = function(renderPath)
{
    this.renderPath = renderPath;
    
    if (this.renderPath.length > 0)
    {
        this.startRenderTimer();
    }
    else
    {
        this.stopRenderTimer();
    }
}

Application.prototype.RedrawEdge = function(context, edge)
{
    var arcDrawer = new BaseEdgeDrawer(context);
    var commonStyle      = new CommonEdgeStyle(context);
    var selectedStyles   = selectedEdgeStyles;
    
    this._RedrawEdge(edge, arcDrawer, commonStyle, selectedStyles);
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
    arcDrawer.Draw(edge, style);
}

Application.prototype.RedrawEdgeProgress = function(context, edge, progress)
{
    var arcDrawer        = new ProgressArcDrawer(context, new BaseEdgeDrawer(context), progress);
    var commonStyle      = new CommonEdgeStyle(context);
    var selectedStyles   = selectedEdgeStyles;

    this._RedrawEdge(edge, arcDrawer, commonStyle, selectedStyles);
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
    var graphDrawer = new BaseVertexDrawer(context);
    var commonGraphDrawer = new CommonVertexStyle();
    var selectedGraphDrawer = selectedGraphStyles;

    for (i = 0; i < this.graph.vertices.length; i ++)
    {
		var selectedGroup = this.handler.GetSelectedGroup(this.graph.vertices[i]);
		var currentStyle  = selectedGroup > 0 ?
				selectedGraphDrawer[(selectedGroup - 1) % selectedGraphDrawer.length] : commonGraphDrawer;

		//this.graph.vertices[i].upText = this.handler.GetUpText(this.graph.vertices[i]);

		graphDrawer.Draw(this.graph.vertices[i], currentStyle);
    }	
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

Application.prototype.AddNewEdge = function(edge)
{
	return this.graph.AddNewEdge(edge);
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

Application.prototype.CreateNewArc = function(graph1, graph2, isDirect, weight)
{
	var useWeight = false;
	if (!isNaN(parseInt(weight, 10)))
	{
		useWeight = true;
	}
	weight = (!isNaN(parseInt(weight, 10)) && weight >= 0) ? weight : 1;
	return this.AddNewEdge(new BaseEdge(graph1, graph2, isDirect, weight, useWeight));
}

Application.prototype.DeleteEdge = function(edgeObject)
{
	this.graph.DeleteEdge(edgeObject);
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

Application.prototype.FindVertex = function(id)
{
	return this.graph.FindVertex(id);
}

Application.prototype.FindEdge = function(id1, id2)
{
	return this.graph.FindEdge(id1, id2);
}

Application.prototype.FindPath = function(graph1, graph2)
{
	var creator = new GraphMLCreater(this.graph.vertices, this.graph.edges);
	var app = this;

	$.ajax({
	type: "POST",
	url: "/cgi-bin/GraphCGI.exe?dsp=cgiInput&start=" + graph1.id + "&finish=" + graph2.id + "&report=xml",
	data: creator.GetXMLString(),
	dataType: "text"
	})
	.done(function( msg ) 
	{		
		$('#debug').text(msg);
		xmlDoc = $.parseXML( msg );
		var $xml = $( xmlDoc );
		
		$nodes = $xml.find( "node" );	
		
		var pathObjects = new Array();
		var shortDistObjects = {};
		
		$nodes.each(function(){
			var id = $(this).attr('id');
			$data = $(this).find("data");
			$data.each(function(){
				if ("hightlightNode" == $(this).attr('key') && $(this).text() == "1")
				{
					pathObjects.push(app.FindVertex(id));  
				}
				if ("lowestDistance" == $(this).attr('key'))
				{
					shortDistObjects[id] = $(this).text();
				}
			});
		});
		
		$edges = $xml.find( "edge" );
		
		$edges.each(function(){
			var source = $(this).attr('source');
			var target = $(this).attr('target');
			pathObjects.push(app.FindEdge(source, target));
		});
		
		var $graph = $xml.find( "graph" );
		$graph.each(function(){
			var shortPathResult = $(this).attr('result');
			app.handler.SetShortPath(shortPathResult);
		});
		
		app.handler.SetObjects(pathObjects);
		app.handler.SetShortDist(shortDistObjects);

		app.redrawGraph();
		app.updateMessage();
	});
  
    // return empty, will set later.
	return [];
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
        savedDialogGraphImageHandler.show();
    }
    else if (mode == "saveDialogFullImage")
    {
        var savedDialogGraphImageHandler = new SavedDialogGraphImageHandler(this);
        savedDialogGraphImageHandler.show(null, true);           
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

Application.prototype.TestAdjacencyMatrix = function (matrix, rowsObj, colsObj, separator = ",")
{
	return this.graph.TestAdjacencyMatrix(matrix, rowsObj, colsObj, separator);
}

Application.prototype.SetAdjacencyMatrix = function (matrix, separator = ",")
{
	var res = true;
        var r = {};
	var c = {};
	if (!this.TestAdjacencyMatrix(matrix, r, c, separator))
	{
		$.get( "/cgi-bin/addFailedMatrix.php?text=adjacency&matrix=" + encodeURIComponent(matrix), function( data ) {;});
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
		$.get( "/cgi-bin/addFailedMatrix.php?text=incidence&matrix=" + encodeURIComponent(matrix), function( data ) {;});
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



Application.prototype.SetAdjacencyMatrixSmart = function (matrix, separator = ",")
{
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
	var graphAsString = this.graph.SaveToXML();
	
	if (this.savedGraphName.length <= 0)
	{
		this.savedGraphName = this.GetNewGraphName();
	}

	var app = this;
	$.ajax({
	type: "POST",
	url: "/cgi-bin/saveGraph.php?name=" + this.savedGraphName,
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
    var imageName = this.GetNewGraphName();
                          
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
     url: "/cgi-bin/saveImage.php?name=" + imageName + rectParams,
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

Application.prototype.SaveFullGraphImageOnDisk = function (showDialogCallback)
{
    var imageName = this.GetNewGraphName();
                          
    this.stopRenderTimer();
    var canvas = this._OffscreenRedrawGraph();
                          
    var bbox = this.graph.getGraphBBox();
    
    var rectParams = ""; 
    rectParams = "&x=0" + "&y=0" + "&width=" + bbox.size().x + "&height=" + bbox.size().y;

    var imageBase64Data = canvas.toDataURL();

    $.ajax({
     type: "POST",
     url: "/cgi-bin/saveImage.php?name=" + imageName + rectParams,
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
                          
                          


Application.prototype.LoadGraphFromDisk = function (graphName)
{
	var  app = this;

	$.ajax({
	type: "GET",
	url: "/cgi-bin/loadGraph.php?name=" + graphName
	})
	.done(function( msg ) 
	{
		var graph = new Graph();
		graph.LoadFromXML(msg);
        app.SetDefaultTransformations();
		app.graph = graph;
        app.AutoAdjustViewport();
        app.updateMessage();
        app.redrawGraph();
	});
}


Application.prototype.GetNewGraphName = function()
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
                          
/*                         
Application.prototype.CalculateAlgorithm = function(queryString, callbackObject)
{
    var app = this;
    var creator = new GraphMLCreater(app.graph.vertices, app.graph.edges);
    var pathObjects = [];
    var properties = {};
    var result = [];

    $.ajax({
         type: "POST",
         url: "/cgi-bin/GraphCGI.exe?" + queryString,
         data: creator.GetXMLString(),
         dataType: "text",
         })
    .done(function( msg )
        {
        console.log(msg);
        $('#debug').text(msg);
        xmlDoc = $.parseXML( msg );
        var $xml = $( xmlDoc );
        
        $results = $xml.find( "result" );
        
        $results.each(function(){
                      $values = $(this).find( "value" );
                      
                      $values.each(function(){
                                   var type  = $(this).attr('type');
                                   var value = $(this).text();
                                   var res = {};
                                   res.type = type;
                                   res.value = value;
                                   result.push(res);
                                   });
                      });
        
        $nodes = $xml.find( "node" );
        
        $nodes.each(function(){
                    var id = $(this).attr('id');
                    $data = $(this).find("data");
                    $data.each(function(){
                               if ("hightlightNode" == $(this).attr('key') && $(this).text() == "1")
                               {
                                    pathObjects.push(app.FindVertex(id));
                               }
                               else
                               {
                                    if (!properties[id])
                                    {
                                        properties[id] = {};
                                    }
                                    properties[id][$(this).attr('key')] = $(this).text();
                               }
                               });
                    });
        
        $edges = $xml.find( "edge" );
        
        $edges.each(function(){
                        var source = $(this).attr('source');
                        var target = $(this).attr('target');
                        var edge   = app.FindEdge(source, target);
                        pathObjects.push(edge);
            
                        $data = $(this).find("data");
                        $data.each(function(){
                            if (!properties[edge.id])
                            {
                                properties[edge.id] = {};
                            }
                            properties[edge.id][$(this).attr('key')] = $(this).text();
                            console.log("Data edge " + $(this).text());
                        });
                    });
        
        console.log(result);
        
        callbackObject.CalculateAlgorithmCallback(pathObjects, properties, result);
        });

    return true;
}
*/
                          
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
        this.setRenderPath(paths["paths"][0]);
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

                          
