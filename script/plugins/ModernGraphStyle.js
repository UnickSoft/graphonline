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
    
    this.vertexVisualization2();
    this.edgeVisualization();

    return result;
}

ModernGraphStyle.prototype.vertexVisualization = function()
{
    var degree = getVertexToVertexArray(this.graph, false);
    var graph  = this.graph;
    var maxDegree = 0;
    var sumDegree = 0;
    
    var sumOfDiameters = graph.vertices.length * (new VertexModel()).diameter;
    
    // Search max vertex degree.
    for (var i = 0; i < graph.vertices.length; i++)
    {
        var vertex = graph.vertices[i];
        
        if (degree.hasOwnProperty(vertex.id))
        {
            var currentDegree = degree[vertex.id].length;
            maxDegree = Math.max(maxDegree, currentDegree);
            sumDegree = sumDegree + currentDegree;
        }
    }
    

    for (var i = 0; i < graph.vertices.length; i++)
    {
        var vertex = graph.vertices[i];

        if (degree.hasOwnProperty(vertex.id))
        {
            var currentDegree = degree[vertex.id].length;
            //vertex.model.diameter = (currentDegree / maxDegree) * (this.maxVertexSize - this.minVertexSize) + this.minVertexSize;
            vertex.model.diameter = Math.max(Math.min((currentDegree / sumDegree) * sumOfDiameters, this.maxVertexSize), this.minVertexSize);
            //sumOfDiameters
        }
        else
        {
            vertex.model.diameter = this.minVertexSize;     
        }
    }
}

ModernGraphStyle.prototype.vertexVisualization2 = function()
{
    var degree = {};
    var graph  = this.graph;
    var sumDegree = 0;
    
    var sumOfDiameters = graph.vertices.length * (new VertexModel()).diameter;
    
    // Search max vertex degree.
    for (var i = 0; i < graph.edges.length; i++)
    {
        var edge = graph.edges[i];
        if (!degree.hasOwnProperty(edge.vertex1.id))
        {
            degree[edge.vertex1.id] = 0;
        }
        if (!degree.hasOwnProperty(edge.vertex2.id))
        {
            degree[edge.vertex2.id] = 0;
        }
        
        var currentWeight = 0;
        if (edge.isDirect)
        {
            currentWeight = edge.GetWeight() / 2;
        }
        else
        {
            currentWeight = edge.GetWeight();
        }
        
        sumDegree = sumDegree + 2 * currentWeight;
        degree[edge.vertex1.id] += currentWeight;
        degree[edge.vertex2.id] += currentWeight;
    }

    console.log("sumDegree = " + sumDegree);
    for (var i = 0; i < graph.vertices.length; i++)
    {
        var vertex = graph.vertices[i];

        if (degree.hasOwnProperty(vertex.id))
        {
            var currentDegree = degree[vertex.id];
            console.log(currentDegree / sumDegree);
            vertex.model.diameter = Math.max(Math.min((currentDegree / sumDegree) * sumOfDiameters, this.maxVertexSize), this.minVertexSize);
            //sumOfDiameters
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
    var sumWeight     = 0;
    var sumOfDiameters = graph.edges.length * (new EdgeModel()).width;
    
    // Search max edge weight.
    for (var i = 0; i < graph.edges.length; i++)
    {
        var edge = graph.edges[i];
        if (edge.useWeight)
        {
            maxEdgeWeight = Math.max(maxEdgeWeight, edge.weight);
            sumWeight     = sumWeight + edge.weight;
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
                //edge.model.width = (edge.weight / maxEdgeWeight) * (this.maxEdgeSize - this.minEdgeSize) + this.minEdgeSize; 
                edge.model.width = Math.max(Math.min((edge.weight / sumWeight) * sumOfDiameters, this.maxEdgeSize), this.minEdgeSize);
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
