/**
 * Find short path.
 *
 */
function DFSAlgorithm(graph, app)
{
    BaseTraversal.apply(this, arguments);
    this.message = g_startTraversal;
}

// inheritance.
DFSAlgorithm.prototype = Object.create(BaseTraversal.prototype);
// timer interval
DFSAlgorithm.prototype.timerInterval = 500;

DFSAlgorithm.prototype.getName = function(local)
{
    return local == "ru" ? "Поиск в глубину" : "Depth-first search";
}

DFSAlgorithm.prototype.getId = function()
{
    return "OlegSh.DFSAlgorithm";
}

// @return message for user.
DFSAlgorithm.prototype.getMessage = function(local)
{
    return this.message;
}

DFSAlgorithm.prototype.result = function(resultCallback)
{
    var result = {};
    result["version"] = 1;
    
    return result;
}

DFSAlgorithm.prototype.getMainMessage = function()
{
    var message = g_traversalOrder;
    // calculate.
    var tempVisited = this.visited.slice();
    var tempEdge    = [];
    
    var oldLength = 0;
    
    while (oldLength < tempVisited.length)
    {
        oldLength = tempVisited.length;
        for (var i = tempVisited.length - 1; i >= 0; i--)
        {
            if (this.dfs(tempVisited[i], tempVisited, tempEdge))
                break;
        }
    }
    
    // Format message
    for (var i = 0; i < tempVisited.length; i ++)
    {
        tempVisited[i].upText = (i + 1) + "";
        message = message + tempVisited[i].mainText + " ";
    }
    return message;
}

DFSAlgorithm.prototype.getPriority = function()
{
    return -9.5;
}

DFSAlgorithm.prototype.step = function()
{
    for (var i = this.visited.length - 1; i >= 0; i--)
    {
        if (this.dfs(this.visited[i], this.visited, this.edges))
        {
            this.app.redrawGraph();
            return;
        }
    }
         
    clearTimeout(this.timer);
    this.timer = null;
    return;
}

DFSAlgorithm.prototype.dfs = function(vertex, vertexArray, edgeArray)
{
    for (var i = 0; i < this.graph.vertices.length; i ++)
    {
        var nextVertex = this.graph.vertices[i];
        var edge        = this.graph.FindEdgeAny(vertex.id, nextVertex.id);
        if (edge && !vertexArray.includes(nextVertex))
        {
            edgeArray.push(edge);
            vertexArray.push(nextVertex);
            return true;
        }
    }
    
    return false;
}

// Algorithm support multi graph
DFSAlgorithm.prototype.IsSupportMultiGraph = function()
{
    return true;
}

// Factory for connected components.
function CreateDFSAlgorithm(graph, app)
{
    return new DFSAlgorithm(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateDFSAlgorithm);
