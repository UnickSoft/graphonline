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

NewAlgorithm.prototype.getName = function(local)
{
    return "New algorithm";
}

NewAlgorithm.prototype.getId = function()
{
    return "Unknown.Unknown";
}

// @return message for user.
NewAlgorithm.prototype.getMessage = function(local)
{
    return this.message;
}

NewAlgorithm.prototype.selectVertex = function(vertex)
{
    this.message      = "Processing...";
    this.selectObject = vertex;
    this.neighbours   = [];

    return true;
}

NewAlgorithm.prototype.deselectAll = function()
{
    this.selectObject = null;
    this.neighbours   = [];
    this.message      = "Please select vertex";
    
    return true;
}

NewAlgorithm.prototype.result = function(resultCallback)
{
    if (this.selectObject)
    {
        var result = {};
        result["version"] = 1;
        
        for (var i = 0; i < this.graph.vertices.length; i ++)
        {
            var nextVertex = this.graph.vertices[i];
            var edge       = this.graph.FindEdgeAny(this.selectObject.id, nextVertex.id);
            if (edge)
                this.neighbours.push(nextVertex);
        }
    
        result.selectedObjects = this.neighbours;
        this.message      = "Found " + this.neighbours.length + " neighbours";

        return result;
    }
    
    return null;
}

NewAlgorithm.prototype.getObjectSelectedGroup = function(object)
{
    return (object == this.selectObject) ? 1 :
        (this.neighbours.includes(object) ? 2 : 0);
}

NewAlgorithm.prototype.getPriority = function()
{
    return 0;
}

// Algorithm support multi graph
NewAlgorithm.prototype.IsSupportMultiGraph = function()
{
    return false;
}

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
