/**
 * Find Eulerian Path.
 *
 */
function FindEulerianPath(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_processing;
    this.selectedObjects = [];
}


// inheritance.
FindEulerianPath.prototype = Object.create(BaseAlgorithmEx.prototype);


FindEulerianPath.prototype.getName = function(local)
{
    return g_EulerinPath;//local == "ru" ? "Найти Эйлерову цепь" : "Find Eulerian path";
}

FindEulerianPath.prototype.getId = function()
{
    return "OlegSh.FindEulerianPath";
}

// @return message for user.
FindEulerianPath.prototype.getMessage = function(local)
{
    return this.message;
}

FindEulerianPath.prototype.getCategory = function()
{
    return 1;
}

FindEulerianPath.prototype.MaxGraphSize = function()
{
    return 50;
}

FindEulerianPath.prototype.MaxEgdeNumber = function()
{
    return 500;
}

FindEulerianPath.prototype.result = function(resultCallback)
{
    this.outResultCallback = function (result ) { resultCallback(result); };
    self = this;
    this.CalculateAlgorithm("elpath", [], function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    }, true);
    
    return true;
}

FindEulerianPath.prototype.resultCallback = function(pathObjects, properties, results)
{
    result  = results.length > 0 && results[0].value > 0 && results[0].type == 1;
    
    var outputResult = {};
    outputResult["version"] = 1;
    
    this.message = result > 0 ? g_hasEulerianPath : g_hasNotEulerianPath;
    if (result > 0)
    {
        var nodesPath = this.GetNodesPath(results, 1, results.length - 1);
        outputResult["paths"] = [];
        outputResult["paths"].push(nodesPath);
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

FindEulerianPath.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

FindEulerianPath.prototype.getPriority = function()
{
    return -7.5;
}

FindEulerianPath.prototype.IsSupportNegativeWeight = function()
{
    return true;
}

// Factory for connected components.
function CreateFindEulerianPath(graph, app)
{
    return new FindEulerianPath(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFindEulerianPath);
