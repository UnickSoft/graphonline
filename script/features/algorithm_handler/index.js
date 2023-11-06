doInclude ([
    include ("features/base_handler/index.js")
])

/**
 * Algorithm Graph handler.
 *
 */
function AlgorithmGraphHandler(app, algorithm)
{
    BaseHandler.apply(this, arguments);
    this.algorithm = algorithm;
    this.SaveUpText();
    
    this.UpdateResultAndMessage();
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
            
            this.UpdateResultAndMessage();
        }
        else  if (selectedObject && (selectedObject instanceof BaseEdge))
        {
            if (this.algorithm.selectEdge(selectedObject))
            {
                this.needRedraw = true;
            }
            
            this.UpdateResultAndMessage();
        }
        else
        {
            if (this.algorithm.deselectAll())
            {
                this.needRedraw = true;
                this.UpdateResultAndMessage();
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

AlgorithmGraphHandler.prototype.UpdateResultAndMessage = function()
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
