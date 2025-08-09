/**
 * Find Eulerian Loop.
 *
 */
function MaxIndependentSet(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_processing;
    this.selectedObjects = [];
}


// inheritance.
MaxIndependentSet.prototype = Object.create(BaseAlgorithmEx.prototype);


MaxIndependentSet.prototype.getName = function(local)
{
    return g_MaxIndependentSet;
}

MaxIndependentSet.prototype.getId = function()
{
    return "AbdallaE.MaxIndependentSet";
}

// @return message for user.
MaxIndependentSet.prototype.getMessage = function(local)
{
    return this.message;
}

MaxIndependentSet.prototype.result = function(resultCallback)
{
    this.outResultCallback = function (result ) { resultCallback(result); };
    self = this;
    this.CalculateAlgorithm("mis", [], function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    
    return true;
}

MaxIndependentSet.prototype.resultCallback = function(pathObjects, properties, results)
{
    result  = results.length > 0 && results[0].value > 0 && results[0].type == 1;
    
    var outputResult = {};
    outputResult["version"] = 1;
    
    this.message = result > 0 ? "" : g_MaxIndependentSetNotFound;
    if (result > 0)
    {
        let size = results[0].value;
        this.message = g_MaxIndependentSetSizeIs + size;

        this.selectedObjects = [];
        
        this.message = this.message + g_MaxIndependentSetContains;

        var vertexIndex = 0;
        for (var i = 1; i < results.length; i++)
        {
            let objectId = results[i].value;
            if (results[i].type == 8) 
            {
                let mainText = this.graph.FindVertex(objectId).mainText;
                this.message = this.message + mainText + ((vertexIndex < size - 1) ? ", " : ".");
                vertexIndex++;
            }
            this.selectedObjects[objectId] = 1;
        }
    }
    
    this.outResultCallback(outputResult);
}

MaxIndependentSet.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

MaxIndependentSet.prototype.getPriority = function()
{
    return -5;
}

MaxIndependentSet.prototype.IsSupportNegativeWeight = function()
{
    return true;
}

function CreateMaxIndependentSet(graph, app)
{
    return new MaxIndependentSet(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateMaxIndependentSet);
