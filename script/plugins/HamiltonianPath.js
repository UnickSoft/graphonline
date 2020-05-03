/**
 * Find Eulerian Loop.
 *
 */
function FindHamiltonianPath(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_processing;
    this.selectedObjects = [];
}


// inheritance.
FindHamiltonianPath.prototype = Object.create(BaseAlgorithmEx.prototype);


FindHamiltonianPath.prototype.getName = function(local)
{
    return local == "ru" ? "Найти Гамильтонову цепь" : "Find Hamiltonian path";
}

FindHamiltonianPath.prototype.getId = function()
{
    return "OlegSh.FindHamiltonianPath";
}

// @return message for user.
FindHamiltonianPath.prototype.getMessage = function(local)
{
    return this.message;
}

FindHamiltonianPath.prototype.result = function(resultCallback)
{
    this.outResultCallback = function (result ) { resultCallback(result); };
    self = this;
    this.CalculateAlgorithm("hampath=cgiInput&report=xml", function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    
    return true;
}

FindHamiltonianPath.prototype.resultCallback = function(pathObjects, properties, results)
{
    result  = results.length > 0 && results[0].value > 0 && results[0].type == 1;
    
    var outputResult = {};
    outputResult["version"] = 1;
    
    this.message = result > 0 ? g_hasHamiltonianPath : g_hasNotHamiltonianPath;
    if (result > 0)
    {
        var nodesEdgesPath = this.GetNodesEdgesPath(results, 1, results.length - 1);
        var nodesPath      = this.GetNodesPath(results, 1, results.length - 1);

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
        this.selectedObjects = [];
        
        for (var i = 0; i < pathObjects.length; i++)
        {
            this.selectedObjects[pathObjects[i].id] = 1;
        }
        
        this.message = this.message + ": ";
        for (var i = 0; i < nodesPath.length; i++)
        {
            this.message = this.message + this.graph.FindVertex(nodesPath[i]).mainText + ((i < nodesPath.length - 1) ? "&rArr;" : "");
        }
    }
    
    this.outResultCallback(outputResult);
}

FindHamiltonianPath.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

FindHamiltonianPath.prototype.getPriority = function()
{
    return -5;
}

FindHamiltonianPath.prototype.IsSupportMultiGraph = function()
{
    return true;
}

// Factory for connected components.
function CreateFindHamiltonianPath(graph, app)
{
    return new FindHamiltonianPath(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFindHamiltonianPath);
