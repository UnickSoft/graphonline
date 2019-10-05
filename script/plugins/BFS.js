/**
 * Find short path.
 *
 */
function BFSAlgorithm(graph, app)
{
    BaseTraversal.apply(this, arguments);
    this.message = g_startTraversal;
}

// inheritance.
BFSAlgorithm.prototype = Object.create(BaseTraversal.prototype);
// timer interval
BFSAlgorithm.prototype.timerInterval = 500;

BFSAlgorithm.prototype.getName = function(local)
{
    return local == "ru" ? "Поиск в ширину" : "Breadth-first search";
}

BFSAlgorithm.prototype.getId = function()
{
    return "OlegSh.BFSAlgorithm";
}

// @return message for user.
BFSAlgorithm.prototype.getMessage = function(local)
{
    return this.message;
}

BFSAlgorithm.prototype.result = function(resultCallback)
{
    var result = {};
    result["version"] = 1;
    
    return result;
}

BFSAlgorithm.prototype.getMainMessage = function()
{
    var message = g_traversalOrder;
    // calculate.
    var tempVisited = this.visited.slice();
    var tempEdge    = [];
    
    var oldLength = 0;
    
    while (oldLength < tempVisited.length)
    {
        oldLength = tempVisited.length;
        for (var i = 0; i < tempVisited.length; i++)
        {
            if (this.bfs(tempVisited[i], tempVisited, tempEdge))
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

BFSAlgorithm.prototype.getPriority = function()
{
    return -9.5;
}

BFSAlgorithm.prototype.step = function()
{
    for (var i = 0; i < this.visited.length; i++)
    {
        if (this.bfs(this.visited[i], this.visited, this.edges))
        {
            this.app.redrawGraph();
            return;
        }
    }
         
    clearTimeout(this.timer);
    this.timer = null;
    return;
}

BFSAlgorithm.prototype.bfs = function(vertex, vertexArray, edgeArray)
{
    for (var i = 0; i < this.graph.vertices.length; i ++)
    {
        var nextVertex = this.graph.vertices[i];
        var edge       = this.graph.FindEdgeAny(vertex.id, nextVertex.id);
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
BFSAlgorithm.prototype.IsSupportMultiGraph = function()
{
    return true;
}

// Factory for connected components.
function CreateBFSAlgorithm(graph, app)
{
    return new BFSAlgorithm(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateBFSAlgorithm);
