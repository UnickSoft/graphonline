/**
 * Find Salesman Problem Loop.
 *
 */
function SalesmanProblem(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_processing;
    this.selectedObjects = [];
}


// inheritance.
SalesmanProblem.prototype = Object.create(BaseAlgorithmEx.prototype);


SalesmanProblem.prototype.getName = function(local)
{
    return g_salesmanProblem;
}

SalesmanProblem.prototype.getId = function()
{
    return "OlegSh.SalesmanProblem";
}

// @return message for user.
SalesmanProblem.prototype.getMessage = function(local)
{
    return this.message;
}

SalesmanProblem.prototype.getCategory = function()
{
    return 1;
}

SalesmanProblem.prototype.MaxGraphSize = function()
{
    return 18;
}

SalesmanProblem.prototype.MaxEgdeNumber = function()
{
    return 50;
}

SalesmanProblem.prototype.result = function(resultCallback)
{
    this.outResultCallback = function (result ) { resultCallback(result); };
    self = this;
    this.CalculateAlgorithm("slsmen",
                [
                    {name: "start", value: 0}
                ], function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    
    return true;
}

SalesmanProblem.prototype.resultCallback = function(pathObjects, properties, results)
{
    let result  = results.length > 0 && results[0].value > 0 && results[0].type == 1;
    let dist    = results.length > 1 && (results[1].type == 1 || results[1].type == 2) ?  results[1].value : 0;
    
    var outputResult = {};
    outputResult["version"] = 1;
    
    this.message = result > 0 ? g_shortestLoopIs + (dist * 1).toString() : g_noSolution;
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

SalesmanProblem.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

SalesmanProblem.prototype.getPriority = function()
{
    return -1;
}

// Algorithm support multi graph
SalesmanProblem.prototype.IsSupportMultiGraph = function()
{
    return false;
}

SalesmanProblem.prototype.IsSupportNegativeWeight = function()
{
    return true;
}

// Factory for connected components.
function CreateSalesmanProblem(graph, app)
{
    return new SalesmanProblem(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateSalesmanProblem);
