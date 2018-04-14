/**
 * Find short path.
 *
 */
function FindMaxFlow(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_selectStartVertexForMaxFlow;
    this.selectedObjects = {};
    this.selectedEdges = [];
    this.resetUpText = [];
}


// inheritance.
FindMaxFlow.prototype = Object.create(BaseAlgorithmEx.prototype);
// First selected.
FindMaxFlow.prototype.firstObject = null;
// Second selected.
FindMaxFlow.prototype.secondObject = null;
// Path
FindMaxFlow.prototype.selectedEdges = null;


FindMaxFlow.prototype.getName = function(local)
{
    return local == "ru" ? "Поиск максимального потока" : "Find Maximum flow";
}

FindMaxFlow.prototype.getId = function()
{
    return "OlegSh.FindMaxFlow";
}

// @return message for user.
FindMaxFlow.prototype.getMessage = function(local)
{
    return this.message;
}

FindMaxFlow.prototype.result = function(resultCallback)
{
    if (this.firstObject && this.secondObject)
    {
        this.outResultCallback = function (result ) { resultCallback(result); };
        self = this;
        this.CalculateAlgorithm("mfpr=cgiInput&source=" + this.firstObject.id + "&drain=" + this.secondObject.id + "&report=xml", function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    }
    return null;
}

FindMaxFlow.prototype.resultCallback = function(pathObjects, properties, results)
{
    var outputResult = {};
    outputResult["version"] = 1;
    
    this.pathObjects = pathObjects;
    this.properties = properties;
    
    var bFound = results.length > 0 && results[0].value < 1E5 && (results[0].type == 1 || results[0].type == 2) && results[0].value * 1 > 0.0;
    
    if (bFound)
    {
        this.selectedObjects = {};

        for (var i = 0; i < pathObjects.length; i++)
        {
            if (pathObjects[i] instanceof BaseEdge)
            {
                this.selectedObjects[pathObjects[i].id] = 1;
                if (pathObjects[i].useWeight)
                {
                    pathObjects[i].text = properties[pathObjects[i].id]["flowValue"] + " / " + pathObjects[i].GetWeight();
                }
            }
        }
        this.selectedEdges = pathObjects;
    
        this.message = g_maxFlowResult.replace("%1", (results[0].value * 1).toString()).replace("%2", this.firstObject.mainText).replace("%3", this.secondObject.mainText);
        
        this.selectedObjects[this.secondObject.id] = 3;
        this.selectedObjects[this.firstObject.id]  = 1;
        
        this.secondObject.upText = g_sinkVertex;
        this.resetUpText.push(this.secondObject);
    }
    else
    {
        this.message = g_flowNotExists.toString().replace("%1", this.firstObject.mainText).replace("%2", this.secondObject.mainText);
    }
    this.secondObject = null;
    this.firstObject = null;
    
    this.outResultCallback(outputResult);
}

FindMaxFlow.prototype.selectVertex = function(vertex)
{
	this.pathObjects = null;
	this.shortDist = null;
    
    if (this.firstObject)
    {
        this.message      = g_processing;
        this.secondObject = vertex;
        this.selectedObjects = [];
    }
    else
    {
        this.restore();
        
        this.firstObject = vertex;
        this.secondObject = null;
        this.selectedObjects = {};
        this.message = g_selectFinishVertexForMaxFlow;
        this.firstObject.upText  = g_sourceVertex;
        this.resetUpText.push(this.firstObject);
    }

    return true;
}

FindMaxFlow.prototype.deselectAll = function()
{
    this.firstObject  = null;
    this.secondObject = null;
    this.selectedObjects = {};
    this.message = g_selectStartVertexForMaxFlow;
    this.restore();
    return true;
}

FindMaxFlow.prototype.instance = function()
{
    return false;
}

FindMaxFlow.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : ((object == this.firstObject || object == object.secondObject) ? 1 : 0);
}

FindMaxFlow.prototype.getPriority = function()
{
    return -9.7;
}

// @return true, if you change resotry graph after use.
BaseAlgorithm.prototype.wantRestore = function()
{
    return true;
}

// calls this method if wantRestore return true.
BaseAlgorithm.prototype.restore = function()
{
    if (this.selectedEdges != null)
    {
        for (var i = 0; i < this.selectedEdges.length; i++)
        {
            if (this.selectedEdges[i] instanceof BaseEdge)
            {
                this.selectedEdges[i].text = "";
            }
        }
        
        for (var i = 0; i < this.resetUpText.length; i++)
        {
            this.resetUpText[i].upText = "";
        }
    }
}


// Factory for connected components.
function CreateFindMaxFlow(graph, app)
{
    return new FindMaxFlow(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFindMaxFlow);
