/**
 * Find short path.
 *
 */
function NewAlgorithm(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
    this.message      = "Please select vertex";
    this.selectObject = null;
    this.neighbours   = [];
}

// inheritance.
NewAlgorithm.prototype = Object.create(BaseAlgorithm.prototype);

// Algorithm name
NewAlgorithm.prototype.getName = function(local)
{
    return "New algorithm";
}

// Id: CreatorName.AlgorithmName
NewAlgorithm.prototype.getId = function()
{
    return "Unknown.Unknown";
}

// @return message to user.
NewAlgorithm.prototype.getMessage = function(local)
{
    return this.message;
}

// Callback is called, when user select vertex.
NewAlgorithm.prototype.selectVertex = function(vertex)
{
    this.message      = "Processing...";
    this.selectObject = vertex;
    this.neighbours   = [];

    return true;
}

// Callback is called, when user deselect vertexs.
NewAlgorithm.prototype.deselectAll = function()
{
    this.selectObject = null;
    this.neighbours   = [];
    this.message      = "Please select vertex";
    
    return true;
}

// After each action if method is called,
// if algorithm is not ready, it should return null
// otherwise return struct result.
NewAlgorithm.prototype.result = function(resultCallback)
{
    if (this.selectObject)
    {
        var result = {};
        result["version"] = 1;
        
        // This is not best way to search neighbours.
        for (var i = 0; i < this.graph.vertices.length; i ++)
        {
            var nextVertex = this.graph.vertices[i];
            var edge       = this.graph.FindEdgeAny(this.selectObject.id, nextVertex.id);
            if (edge)
                this.neighbours.push(nextVertex);
        }
    
        // Return selected objects.
        result.selectedObjects = this.neighbours;
        // Change message
        this.message           = "Found " + this.neighbours.length + " neighbours";

        return result;
    }
    
    return null;
}

NewAlgorithm.prototype.getObjectSelectedGroup = function(object)
{
    // To select objects different color, we return different numbers. 
    // For deselected objects we return 0.
    return (object == this.selectObject) ? 1 :
        (this.neighbours.includes(object) ? 2 : 0);
}

// This means nothing for now. Just return 0.
NewAlgorithm.prototype.getPriority = function()
{
    return 0;
}

// Algorithm support multi graph or not.
NewAlgorithm.prototype.IsSupportMultiGraph = function()
{
    return false;
}

// Our algorithm is not instant, because user should select vertex.
// For example search connected component is instant, 
// because it is not wait any actions from user.
NewAlgorithm.prototype.instance = function()
{
    return false;
}

// Factory for connected components.
function CreateNewAlgorithm(graph, app)
{
    return new NewAlgorithm(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateNewAlgorithm);
