/**
 * Find Eulerian Loop.
 *
 */
function MaxClique(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_processing;
    this.selectedObjects = [];
}


// inheritance.
MaxClique.prototype = Object.create(BaseAlgorithmEx.prototype);


MaxClique.prototype.getName = function(local)
{
    return g_MaxClique;
}

MaxClique.prototype.getId = function()
{
    return "OlegSh.MaxClique";
}

// @return message for user.
MaxClique.prototype.getMessage = function(local)
{
    return this.message;
}

MaxClique.prototype.result = function(resultCallback)
{
    this.outResultCallback = function (result ) { resultCallback(result); };
    self = this;
    this.CalculateAlgorithm("mc", [], function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    
    return true;
}

MaxClique.prototype.resultCallback = function(pathObjects, properties, results)
{
    result  = results.length > 0 && results[0].value > 0 && results[0].type == 1;
    
    var outputResult = {};
    outputResult["version"] = 1;

    console.log("properties");
    console.log(properties);
    console.log("results");
    console.log(results);
    console.log("pathObjects");
    console.log(pathObjects);
    
    this.message = result > 0 ? "" : g_MaxCliqueNotFound;
    if (result > 0)
    {
        let size = results[0].value;
        this.message = g_MaxCliqueSizeIs + size;

        this.selectedObjects = [];
        
        this.message = this.message + g_MaxCliqueContains;

        var vertexIndex = 0;
        for (var i = 0; i < pathObjects.length; i++)
        {
            let object = pathObjects[i];
            if (object instanceof BaseVertex) {
                this.message = this.message + object.mainText + ((vertexIndex < size - 1) ? ", " : ".");
                vertexIndex++;
            }
            this.selectedObjects[object.id] = 1;
        }
    }
    
    this.outResultCallback(outputResult);
}

MaxClique.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

MaxClique.prototype.getPriority = function()
{
    return -5;
}

MaxClique.prototype.IsSupportNegativeWeight = function()
{
    return true;
}

function CreateMaxClique(graph, app)
{
    return new MaxClique(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateMaxClique);
