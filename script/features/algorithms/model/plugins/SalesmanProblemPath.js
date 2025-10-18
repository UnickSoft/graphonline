/**
 * Find Salesman Problem Path.
 *
 */
function SalesmanProblemPath(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_startTraversal;
    this.selectedObjects = [];
    this.startVertex = null
}


// inheritance.
SalesmanProblemPath.prototype = Object.create(BaseAlgorithmEx.prototype);


SalesmanProblemPath.prototype.getName = function(local)
{
    return g_salesmanProblemPath;
}

SalesmanProblemPath.prototype.getId = function()
{
    return "OlegSh.SalesmanProblemPath";
}

// @return message for user.
SalesmanProblemPath.prototype.getMessage = function(local)
{
    return this.message;
}

SalesmanProblemPath.prototype.getCategory = function()
{
    return 1;
}

SalesmanProblemPath.prototype.MaxGraphSize = function()
{
    return 20;
}

SalesmanProblemPath.prototype.MaxEgdeNumber = function()
{
    return 50;
}

SalesmanProblemPath.prototype.result = function(resultCallback)
{
    if (!this.startVertex)
    {
        return false;
    }

    this.outResultCallback = function (result ) { resultCallback(result); };
    self = this;
    this.CalculateAlgorithm("slsmenpath",
                [
                    {name: "start", value: this.startVertex.id}
                ], function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    this.startVertex = false;
    
    return true;
}

SalesmanProblemPath.prototype.selectVertex = function(vertex)
{
	this.startVertex =  vertex;
    this.message = g_processing;
    return true;
}

SalesmanProblemPath.prototype.resultCallback = function(pathObjects, properties, results)
{
    let result  = results.length > 0 && results[0].value > 0 && results[0].type == 1;
    let dist    = results.length > 1 && (results[1].type == 1 || results[1].type == 2) ?  results[1].value : 0;
    
    var outputResult = {};
    outputResult["version"] = 1;
    
    this.message = result > 0 ? g_shortestPathIs + (dist * 1).toString() : g_noSolution;
    if (result > 0)
    {
        var nodesEdgesPath = this.GetNodesEdgesPath(results, 1, results.length - 1);
        var nodesPath      = this.GetNodesPath(results, 1, results.length - 1);

        this.message = this.message + ": ";

        outputResult["pathsWithEdges"] = [];
        outputResult["pathsWithEdges"].push(nodesEdgesPath);
        
        for (var i = 0; i < nodesPath.length; i++)
        {
            this.message = this.message + this.graph.FindVertex(nodesPath[i]).mainText + ((i < nodesPath.length - 1) ? "&rArr;" : "");
        }
        this.selectedObjects = [];
        
        for (var i = 0; i < pathObjects.length; i++)
        {
            this.selectedObjects[pathObjects[i].id] = 1;
        }
    }
    
    this.outResultCallback(outputResult);
}

SalesmanProblemPath.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

SalesmanProblemPath.prototype.getPriority = function()
{
    return -0.9;
}

// Algorithm support multi graph
SalesmanProblemPath.prototype.IsSupportMultiGraph = function()
{
    return false;
}

SalesmanProblemPath.prototype.IsSupportNegativeWeight = function()
{
    return true;
}

SalesmanProblemPath.prototype.instance = function()
{
    return false;
}

// Factory for connected components.
function CreateSalesmanProblemPath(graph, app)
{
    return new SalesmanProblemPath(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateSalesmanProblemPath);
