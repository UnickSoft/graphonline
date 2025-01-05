/**
 * Preview element for graph
 *
 */
function GraphPreview(graph, style, canvas, positionUpdateCallback)
{
    this.graph = graph;
    this.style = style;
    this.canvas = canvas;
    this.canvasScale = 1.0;
    this.canvasPosition = new Point(0, 0);
    this.prevMousePos = null;
    this.positionUpdateCallback = positionUpdateCallback;
    this.AutoAdjustViewport();

    let canvasParent = canvas.parentNode;
    let zoomPlusArray = canvasParent.getElementsByClassName("zoom-plus");
    let preview = this;
    let one_scale = 1.2;
    let zoomFunc = function(real_scale)
    {
        let oldRealW = preview.getRealWidth();
        let oldRealH = preview.getRealHeight();
        preview.canvasScale = preview.canvasScale * real_scale;
        let realW = preview.getRealWidth();
        let realH = preview.getRealHeight();
        preview.canvasPosition = preview.canvasPosition.add(new Point((- oldRealW + realW) / 2, (- oldRealH + realH) / 2));
        preview.redraw();
        preview.callPositionUpdateCallback();
    };

    if (zoomPlusArray.length > 0)
    {
        this.zoomPlusButton = zoomPlusArray[0];
        this.zoomPlusButton.onclick = function()
        {
            zoomFunc(one_scale);
        };
    }
    let zoomMinusArray = canvasParent.getElementsByClassName("zoom-minus");
    if (zoomMinusArray.length > 0)
    {
        this.zoomMinusButton = zoomMinusArray[0];
        this.zoomMinusButton.onclick = function()
        {
            zoomFunc(1.0 / one_scale);
        };
    }

    this.canvas.onmousemove = function (e)
    {
        return preview.CanvasOnMouseMove(e);
    }

    this.canvas.onmousedown = function (e)
    {
        return preview.CanvasOnMouseDown(e);
    }

    this.canvas.onmouseup   = function (e)
    {
        return preview.CanvasOnMouseUp(e);
    }

    this.canvas.onwheel = function (e)
    {
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta > 0)
        {
            zoomFunc(one_scale);
        }
        else
        {
            zoomFunc(1.0 / one_scale);
        }
    }

    this.canvas.removeEventListener("touchstart", touchHandler, true);
    this.canvas.removeEventListener("touchmove", touchHandler, true);
    this.canvas.removeEventListener("touchend", touchHandler, true);
    this.canvas.removeEventListener("touchcancel", touchHandler, true);

    this.canvas.addEventListener("touchstart", touchHandler, true);
    this.canvas.addEventListener("touchmove", touchHandler, true);
    this.canvas.addEventListener("touchend", touchHandler, true);
    this.canvas.addEventListener("touchcancel", touchHandler, true);

    this.redraw();
    // Redraw one, because graph may have background.
    setTimeout( 
        function() 
        { 
            this.redraw(); 
        }.bind(this),
        1000);
}

GraphPreview.prototype.redraw = function()
{
    const ctx = this.canvas.getContext("2d");

    ctx.save();
    
    ctx.scale(this.canvasScale, this.canvasScale);
    ctx.translate(this.canvasPosition.x, this.canvasPosition.y);

    this.redrawGraph(ctx, this.canvasPosition);

    ctx.restore();
}

GraphPreview.prototype.getRealWidth = function ()
{
    return this.canvas.width / this.canvasScale;
}
            
GraphPreview.prototype.getRealHeight = function ()
{
    return this.canvas.height / this.canvasScale;
}

GraphPreview.prototype.redrawGraph = function(context, backgroundPosition)
{
    var backgroundDrawer = new BaseBackgroundDrawer(context);
    
    backgroundDrawer.Draw(
        this.style.backgroundCommonStyle, 
        Math.max(this.canvas.width, this.getRealWidth()), 
        Math.max(this.canvas.height, this.getRealHeight()), 
        backgroundPosition, 
        this.canvasScale);

    // Update edge styles
    for (i = 0; i < this.graph.edges.length; i ++)
    {
        let edge = this.graph.edges[i];
        var currentStyle = null;
        if (edge.hasOwnStyleFor(0))
            currentStyle = edge.getStyleFor(0);
        else
            currentStyle = this.style.edgeCommonStyle;
    
        edge.currentStyle = currentStyle;
    }

    // Upadte current vertexs styles
    for (i = 0; i < this.graph.vertices.length; i ++)
    {
        var currentStyle = null;
        let vetrex = this.graph.vertices[i];
        if (vetrex.hasOwnStyleFor(0))
            currentStyle = vetrex.getStyleFor(0);
        else
            currentStyle = this.style.vertexCommonStyle;

        this.graph.vertices[i].currentStyle = currentStyle;
    }

    for (i = 0; i < this.graph.edges.length; i ++)
    {
        let edge = this.graph.edges[i];
        var arcDrawer       = this.GetBaseArcDrawer(context, edge);
        arcDrawer.Draw(edge, edge.currentStyle.GetStyle({}, edge));
    }

    var graphDrawer   = new BaseVertexDrawer(context);
    for (i = 0; i < this.graph.vertices.length; i ++)
    {
        let vertex = this.graph.vertices[i];
		graphDrawer.Draw(this.graph.vertices[i], vertex.currentStyle.GetStyle({}, vertex));
    }
}

GraphPreview.prototype.GetBaseArcDrawer = function(context, edge)
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

GraphPreview.prototype.AutoAdjustViewport = function()
{
    graphBBox  = this.graph.getGraphBBox();
    bboxCenter = graphBBox.center();
    bboxSize   = graphBBox.size();
                          
    if (bboxSize.length() > 0)
    {
        // Setup size
        if (bboxSize.x > this.getRealWidth() || bboxSize.y > this.getRealHeight())
        {
            this.canvasScale = Math.min(this.getRealWidth() / bboxSize.x, this.getRealHeight() / bboxSize.y);
        }
                          
        // Setup position.
        if (graphBBox.minPoint.x < 0.0 || graphBBox.minPoint.y < 0.0 ||
            graphBBox.maxPoint.x > this.getRealWidth() || graphBBox.maxPoint.y > this.getRealHeight())
        {
            // Move center.
            this.canvasPosition  = graphBBox.minPoint.inverse();
        }
    }
}

GraphPreview.prototype.CanvasOnMouseMove  = function(e)
{
    if (this.prevMousePos == null)
    {
        return;
    }
	// X,Y position.
	var pos = this.getMousePos(this.canvas, e);

    let newPos = (new Point(pos.x, pos.y)).subtract(this.prevMousePos).multiply(this.canvasScale);
    this.canvasPosition = this.canvasPosition.add(newPos.multiply(1 / this.canvasScale));

    this.redraw();
    this.callPositionUpdateCallback();
}

GraphPreview.prototype.CanvasOnMouseDown = function(e)
{
    // Skip non left button.
    if(e.which !== 1) return;

    var pos = this.getMousePos(this.canvas, e); /// provide this canvas and event

	this.prevMousePos = pos;
}

GraphPreview.prototype.CanvasOnMouseUp = function(e)
{
    // Skip non left button.
    if(e.which !== 1) return;

    this.prevMousePos = null;
}

GraphPreview.prototype.getMousePos = function(canvas, e)
{
    /// getBoundingClientRect is supported in most browsers and gives you
    /// the absolute geometry of an element
    var rect = canvas.getBoundingClientRect();

    /// as mouse event coords are relative to document you need to
    /// subtract the element's left and top position:
    return new Point((e.clientX - rect.left) / this.canvasScale - this.canvasPosition.x, 
                     (e.clientY - rect.top) / this.canvasScale - this.canvasPosition.y);
}

GraphPreview.prototype.callPositionUpdateCallback = function()
{
    if (this.positionUpdateCallback != null)
    {
        this.positionUpdateCallback(this.canvasPosition, this.canvasScale);
    }
}

