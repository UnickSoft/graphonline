/**
 * Find Eulerian Loop.
 *
 */
function FindHamiltonianLoop(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_processing;
    this.selectedObjects = [];
}


// inheritance.
FindHamiltonianLoop.prototype = Object.create(BaseAlgorithmEx.prototype);


FindHamiltonianLoop.prototype.getName = function(local)
{
    return local == "ru" ? "Найти Гамильтонов цикл" : "Find Hamiltonian cycle";
}

FindHamiltonianLoop.prototype.getId = function()
{
    return "OlegSh.FindHamiltonianLoop";
}

// @return message for user.
FindHamiltonianLoop.prototype.getMessage = function(local)
{
    return this.message;
}

FindHamiltonianLoop.prototype.result = function(resultCallback)
{
    this.outResultCallback = function (result ) { resultCallback(result); };
    self = this;
    this.CalculateAlgorithm("hamloop=cgiInput&report=xml", function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    
    return true;
}

FindHamiltonianLoop.prototype.resultCallback = function(pathObjects, properties, results)
{
    result  = results.length > 0 && results[0].value > 0 && results[0].type == 1;
    
    var outputResult = {};
    outputResult["version"] = 1;
    
    this.message = result > 0 ? g_hasHamiltonianLoop : g_hasNotHamiltonianLoop;
    if (result > 0)
    {
        var nodesEdgesPath = this.GetNodesEdgesPath(results, 1, results.length - 1);
        var nodesPath      = this.GetNodesPath(results, 1, results.length - 1);

        this.message = this.message + ": ";

        if (this.graph.isMulti())
        {
          outputResult["pathsWithEdges"] = [];
          outputResult["pathsWithEdges"].push(nodesEdgesPath);
        }
        else
        {
          outputResult["paths"] = [];
          outputResult["paths"].push(nodesEdgesPath);
        }
        
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

FindHamiltonianLoop.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

FindHamiltonianLoop.prototype.getPriority = function()
{
    return -5;
}

// Algorithm support multi graph
FindHamiltonianLoop.prototype.IsSupportMultiGraph = function()
{
    return true;
}

// Factory for connected components.
function CreateFindHamiltonianLoop(graph, app)
{
    return new FindHamiltonianLoop(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFindHamiltonianLoop);
