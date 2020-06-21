/**
 * Find Eulerian Loop.
 *
 */
function FindEulerianLoop(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_processing;
    this.selectedObjects = [];
}


// inheritance.
FindEulerianLoop.prototype = Object.create(BaseAlgorithmEx.prototype);


FindEulerianLoop.prototype.getName = function(local)
{
    return g_EulerinLoopName;//local == "ru" ? "Найти Эйлеров цикл" : "Find Eulerian cycle";
}

FindEulerianLoop.prototype.getId = function()
{
    return "OlegSh.FindEulerianCycle";
}

// @return message for user.
FindEulerianLoop.prototype.getMessage = function(local)
{
    return this.message;
}

FindEulerianLoop.prototype.result = function(resultCallback)
{
    this.outResultCallback = function (result ) { resultCallback(result); };
    self = this;
    this.CalculateAlgorithm("elloop=cgiInput&report=xml", function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    
    return true;
}

FindEulerianLoop.prototype.resultCallback = function(pathObjects, properties, results)
{
    result  = results.length > 0 && results[0].value > 0 && results[0].type == 1;
    
    var outputResult = {};
    outputResult["version"] = 1;
    
    this.message = result > 0 ? g_hasEulerianLoop : g_hasNotEulerianLoop;
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

FindEulerianLoop.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

FindEulerianLoop.prototype.getPriority = function()
{
    return -7.5;
}

// Factory for connected components.
function CreateFindEulerianLoop(graph, app)
{
    return new FindEulerianLoop(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFindEulerianLoop);
