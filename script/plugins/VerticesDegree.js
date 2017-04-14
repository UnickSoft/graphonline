/**
 * Algorithm samble.
 *
 */
function VerticesDegree(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
    this.degree = {};
    this.maxDegree = 0;
}


// inheritance.
VerticesDegree.prototype = Object.create(BaseAlgorithm.prototype);


VerticesDegree.prototype.getName = function(local)
{
    return local == "ru" ? "Рассчитать степень вершин" : "Calculate vertices degree";
}

VerticesDegree.prototype.getId = function()
{
    return "OlegSh.VertexDegree";
}

// @return message for user.
VerticesDegree.prototype.getMessage = function(local)
{
    return (local == "ru" ? "Максимальная степень вершин графа равна " : "The maximum degree of a graph is ") + this.maxDegree;
}

VerticesDegree.prototype.result = function(resultCallback)
{
    this.degree = {};
    this.maxDegree = 0;
    
    var result = {};
    result["version"] = 1;
    this.degree = getVertexToVertexArray(this.graph, false);
    var graph = this.graph;
    
    for (var i = 0; i < graph.vertices.length; i++)
    {
        var vertex = graph.vertices[i];
        var currentDegree = 0;
        
        if (this.degree.hasOwnProperty(vertex.id))
        {
            currentDegree = this.degree[vertex.id].length;
            this.maxDegree = Math.max(this.maxDegree, currentDegree);
        }
        
        vertex.upText = currentDegree;
    }

    return result;
}

VerticesDegree.prototype.getObjectSelectedGroup = function(object)
{
    return (this.degree.hasOwnProperty(object.id)) ? this.degree[object.id].length: 0;
}


// Factory for connected components.
function CreateAlgorithmVerticesDegree(graph, app)
{
    return new VerticesDegree(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateAlgorithmVerticesDegree);
