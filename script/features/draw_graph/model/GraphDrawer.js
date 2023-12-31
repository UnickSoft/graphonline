


function GraphDrawer(listener)
{
    this.graph      = null;
    this.canvasInfo = null;
    this.handler    = null;
    this.listener   = listener; 
}


GraphDrawer.prototype._RedrawGraph = function(context, graph, canvasInfo, handler, backgroundPosition, backgroundStyle,
    forceVertexCommon, forceVertexSelected, forceEdgeCommon, forceEdgeSelected)
{
    this.graph = graph;
    this.canvasInfo = canvasInfo;
    this.handler = handler;
    var backgroundDrawer = new BaseBackgroundDrawer(context);
    
    backgroundDrawer.Draw(
        backgroundStyle, 
        Math.max(this.canvasInfo.width, this.GetRealWidth()), 
        Math.max(this.canvasInfo.height, this.GetRealHeight()), 
        backgroundPosition, 
        this.canvasInfo.Scale);
    
    this.UpdateEdgesCurrentStyle(forceEdgeCommon, forceEdgeSelected);
    this.UpdateNodesCurrentStyle(forceVertexCommon, forceVertexSelected);

    this.RedrawEdges(context);
    this.RedrawNodes(context);
}

GraphDrawer.prototype.UpdateEdgesCurrentStyle = function(ForceCommonStyle, ForceSelectedStyle)
{
    for (i = 0; i < this.graph.edges.length; i ++)
    {
        this.UpdateEdgeCurrentStyle(this.graph.edges[i], ForceCommonStyle, ForceSelectedStyle);
    }
}

GraphDrawer.prototype.UpdateNodesCurrentStyle = function(ForceCommonStyle, ForceSelectedStyle)
{
    var force         = ForceCommonStyle !== undefined || ForceSelectedStyle !== undefined;
    var commonStyle   = (ForceCommonStyle === undefined) ? this.vertexCommonStyle : ForceCommonStyle;
    var selectedStyle = (ForceSelectedStyle === undefined) ? this.vertexSelectedVertexStyles : ForceSelectedStyle;

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

GraphDrawer.prototype.UpdateEdgeCurrentStyle = function(edge, ForceCommonStyle, ForceSelectedStyle)
{
    var commonStyle    = (ForceCommonStyle === undefined) ? this.edgeCommonStyle : ForceCommonStyle;
    var selectedStyle  = (ForceSelectedStyle === undefined) ? this.edgeSelectedStyles : ForceSelectedStyle;

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

GraphDrawer.prototype.RedrawEdges = function(context)
{
    for (i = 0; i < this.graph.edges.length; i ++)
    {
        this.RedrawEdge(context, this.graph.edges[i]);
    }
}

GraphDrawer.prototype.RedrawEdge = function(context, edge)
{
    var curvedArcDrawer = new CurvedArcDrawer(context, edge.model)
    var arcDrawer       = this.GetBaseArcDrawer(context, edge);
    
    this._RedrawEdge(edge, arcDrawer);
}

GraphDrawer.prototype._RedrawEdge = function(edge, arcDrawer, commonStyle, selectedStyles)
{
    this._RedrawEdgeWithStyle(edge, edge.currentStyle, arcDrawer, commonStyle, selectedStyles);
}

GraphDrawer.prototype._RedrawEdgeWithStyle = function(edge, style, arcDrawer, commonStyle, selectedStyles)
{
    arcDrawer.Draw(edge, style.GetStyle({}, edge));
}

GraphDrawer.prototype.RedrawNodes = function(context)
{
    var graphDrawer   = new BaseVertexDrawer(context);

    for (i = 0; i < this.graph.vertices.length; i ++)
    {
		graphDrawer.Draw(this.graph.vertices[i], this.graph.vertices[i].currentStyle.GetStyle({}, this.graph.vertices[i]));
    }	
}

GraphDrawer.prototype.redrawGraphTimer = function()
{
    if (this.isTimerRender)
    {
        var context = this._redrawGraphInWindow();
        
        // Render path
        if (this.renderPath.length > 1)
        {
            context.save();
            context.scale(this.canvasInfo.Scale, this.canvasInfo.Scale);
            context.translate(this.canvasInfo.position.x, this.canvasInfo.position.y);
            
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

GraphDrawer.prototype.GetRealWidth = function ()
{
    return this.canvasInfo.width / this.canvasInfo.Scale;
}
                          
GraphDrawer.prototype.GetRealHeight = function ()
{
    return this.canvasInfo.height / this.canvasInfo.Scale;
}