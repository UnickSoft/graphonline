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
    return g_VerticesDegreeName; //local == "ru" ? "Рассчитать степень вершин" : "Calculate vertices degree";
}

VerticesDegree.prototype.getId = function()
{
    return "OlegSh.VertexDegree";
}

// @return message for user.
VerticesDegree.prototype.getMessage = function(local)
{
    return g_maximumDegreeOfGraph + " " + this.maxDegree;
}

VerticesDegree.prototype.result = function(resultCallback)
{
    this.degree = {};
    this.maxDegree = 0;
    
    var result = {};
    result["version"] = 1;

    var graph = this.graph;
    var thisObj = this;
    
    var addDegreeToVertex = function (id)
    {
        if (thisObj.degree.hasOwnProperty(id))
        {
            thisObj.degree[id] ++;
            currentDegree = thisObj.degree[id];
            thisObj.maxDegree = Math.max(thisObj.maxDegree, currentDegree);
        }
        else
        {
            thisObj.degree[id] = 1;      
        }
    }
    
    for (var i = 0; i < graph.edges.length; i++)
    {
        var edge          = graph.edges[i];
        var currentDegree = 0;
        
        addDegreeToVertex(edge.vertex1.id);
        if (!edge.isDirect)
        {
            addDegreeToVertex(edge.vertex2.id);
        }
    }
    
    for (var i = 0; i < graph.vertices.length; i++)
    {
        var vertex    = graph.vertices[i];
        if (!this.degree.hasOwnProperty(vertex.id))
        {
            this.degree[vertex.id] = 0;  
        }
        
        vertex.upText = this.degree[vertex.id];
    }

    return result;
}

VerticesDegree.prototype.getObjectSelectedGroup = function(object)
{
    return (this.degree.hasOwnProperty(object.id)) ? this.degree[object.id]: 0;
}

// Algorithm support multi graph
VerticesDegree.prototype.IsSupportMultiGraph = function ()
{
    return true;
}

VerticesDegree.prototype.IsSupportNegativeWeight = function()
{
    return true;
}

// Factory for connected components.
function CreateAlgorithmVerticesDegree(graph, app)
{
    return new VerticesDegree(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateAlgorithmVerticesDegree);
