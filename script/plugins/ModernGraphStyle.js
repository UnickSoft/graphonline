/**
 * Algorithm for modern style of graph.
 *
 */
function ModernGraphStyle(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
    this.minVertexSize = 20;
    this.maxVertexSize = 100;
    
    this.minEdgeSize = 2;
    this.maxEdgeSize = 12;
}


// inheritance.
ModernGraphStyle.prototype = Object.create(BaseAlgorithm.prototype);


ModernGraphStyle.prototype.getName = function(local)
{
    return local == "ru" ? "Визуализация на основе весов" : "Visualisation based on weight";
}

ModernGraphStyle.prototype.getId = function()
{
    return "OlegSh.ModernGraphStyle";
}

// @return message for user.
ModernGraphStyle.prototype.getMessage = function(local)
{
    return (local == "ru" ? "Готово" : "Done");
}

ModernGraphStyle.prototype.result = function(resultCallback)
{
    var result = {};
    result["version"] = 1;
    
    this.vertexVisualization();
    this.edgeVisualization();

    return result;
}

ModernGraphStyle.prototype.vertexVisualization = function()
{
    var degree = getVertexToVertexArray(this.graph, false);
    var graph  = this.graph;
    var maxDegree = 0;
    
    // Search max vertex degree.
    for (var i = 0; i < graph.vertices.length; i++)
    {
        var vertex = graph.vertices[i];
        
        if (degree.hasOwnProperty(vertex.id))
        {
            var currentDegree = degree[vertex.id].length;
            maxDegree = Math.max(maxDegree, currentDegree);
        }
    }
    

    for (var i = 0; i < graph.vertices.length; i++)
    {
        var vertex = graph.vertices[i];

        if (degree.hasOwnProperty(vertex.id))
        {
            var currentDegree = degree[vertex.id].length;
            vertex.model.diameter = (currentDegree / maxDegree) * (this.maxVertexSize - this.minVertexSize) + this.minVertexSize; 
        }
        else
        {
            vertex.model.diameter = this.minVertexSize;     
        }
    }
}

ModernGraphStyle.prototype.edgeVisualization = function()
{
    var graph         = this.graph;
    var maxEdgeWeight = 0;
    
    // Search max edge weight.
    for (var i = 0; i < graph.edges.length; i++)
    {
        var edge = graph.edges[i];
        if (edge.useWeight)
        {
            maxEdgeWeight = Math.max(maxEdgeWeight, edge.weight);         
        }
    }
    
    // Search max edge weight.
    if (maxEdgeWeight != 0) 
    {
        for (var i = 0; i < graph.edges.length; i++)
        {
            var edge = graph.edges[i];
            if (edge.useWeight)
            {
                edge.model.width = (edge.weight / maxEdgeWeight) * (this.maxEdgeSize - this.minEdgeSize) + this.minEdgeSize;         
            }
            else
            {
                edge.model.width = this.minEdgeSize;  
            }
        }
    }
}

ModernGraphStyle.prototype.getObjectSelectedGroup = function(object)
{
    return 0;
}


// Factory for connected components.
function CreateAlgorithmModernGraphStyle(graph, app)
{
    return new ModernGraphStyle(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateAlgorithmModernGraphStyle);
