/**
 * Find short path.
 *
 */
function FindLongestPath(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_selectStartVertex;
    this.selectedObjects = {};
    this.foundSubGraphs  = {};
    this.nSubgraphIndex  = 0;
    this.nSubGraphCount  = 0;
    this.foundPaths      = {};
    this.maxPathLength   = 0;
}


// inheritance.
FindLongestPath.prototype = Object.create(BaseAlgorithmEx.prototype);
// First selected.
FindLongestPath.prototype.firstObject = null;
// Second selected.
FindLongestPath.prototype.secondObject = null;
// Path
FindLongestPath.prototype.pathObjects = null;
// Infinity
FindLongestPath.prototype.infinityValue = 1E9 - 1;

FindLongestPath.prototype.getName = function(local)
{
    return g_findLongestPath;
}

FindLongestPath.prototype.getId = function()
{
    return "OlegSh.FindLongestPath";
}

// @return message for user.
FindLongestPath.prototype.getMessage = function(local)
{
    return this.message;
}

FindLongestPath.prototype.getCategory = function()
{
    return 1;
}

FindLongestPath.prototype.result = function(resultCallback)
{
    if (this.firstObject && this.secondObject)
    {
        this.outResultCallback = function (result ) { resultCallback(result); };
        self = this;
        this.CalculateAlgorithm("prnpaths",            [
            {name: "start", value: this.firstObject.id},
            {name: "finish", value: this.secondObject.id}
            ],
            function (pathObjects, properties, results)
            {
                self.resultCallback(pathObjects, properties, results);
            });
    }
    return null;
}

FindLongestPath.prototype.setResultMessage = function()
{
    if (this.nSubGraphCount > 0)
    {
        var currentPath = "";
        var first = true;
        this.foundPaths[this.nSubgraphIndex].forEach((nodeId) => {
            currentPath += (first ? "" : "⇒") + this.graph.FindVertex(nodeId).mainText;
            first = false;
        });

        this.message = g_LengthOfLongestPathFrom + this.firstObject.mainText + 
        g_to + this.secondObject.mainText + g_are + 
        this.maxPathLength + ": " + currentPath;
    }
    else
    {
        this.message = g_pathNotExists;
    }
}

FindLongestPath.prototype.resultCallback = function(pathObjects, properties, results)
{
    var outputResult = {};
    outputResult["version"] = 1;
    outputResult["minPath"] = true;
    
    this.pathObjects = pathObjects;
    this.properties = properties;
    
    var bFound = results.length > 0 && results[0].value < this.infinityValue && (results[0].type == 1 || results[0].type == 2);
    
    if (bFound)
    {
        this.nSubGraphCount = results.length > 0 && results[0].type == 1 ? results[0].value : 0;
      
        this.foundSubGraphs  = {};
        this.foundPaths     = {};
        this.maxPathLength = 0;
        var maxPathIndex  = 0;
        var currentLength = 0;
        for (var i = 0; i < this.nSubGraphCount; i++)
        {
          this.foundSubGraphs[i] = {};
          this.foundPaths[i]     = [];
        }
  
        var subGraphIndex = 0;
        var prevNodeId = -1;
        for (var i = 0; i < results.length; i++)
        {
          if (results[i].type == 6)
          {
            if (currentLength > this.maxPathLength) {
                this.maxPathLength = currentLength;
                maxPathIndex = subGraphIndex;
            }
            currentLength = 0;
            subGraphIndex++;
            prevNodeId = -1;
          }
  
          if (results[i].type == 4)
          {
            var nodeId = parseInt(results[i].value);
            var index  = subGraphIndex;
            var subgGraph = this.foundSubGraphs[index];
            subgGraph[nodeId] = true;

            this.foundPaths[index].push(nodeId);
  
            if (prevNodeId >= 0)
            {
              var edgeObject = this.graph.FindEdgeMax(prevNodeId, nodeId);
              subgGraph[edgeObject.id] = true;
              currentLength += edgeObject.GetWeight();
            }
            prevNodeId = nodeId;
          }
        }
        if (currentLength > this.maxPathLength) {
            this.maxPathLength = currentLength;
            maxPathIndex = subGraphIndex;
        }        
        this.nSubgraphIndex = maxPathIndex;

        this.setResultMessage();        

        this.firstObject = null;
        this.secondObject = null;
    }
    else
    {
        this.secondObject = null;
        this.firstObject = null;
        this.message = g_pathNotExists;
    }
    
    this.outResultCallback(outputResult);
}

FindLongestPath.prototype.selectVertex = function(vertex)
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
        this.deselectAll();
        this.firstObject = vertex;
        this.secondObject = null;
        this.selectedObjects = {};
        this.message = g_selectFinishVertex;
    }

    return true;
}

FindLongestPath.prototype.deselectAll = function()
{
    this.firstObject  = null;
    this.secondObject = null;
    this.selectedObjects = {};
    this.foundSubGraphs  = {};
    this.nSubgraphIndex  = 0;
    this.nSubGraphCount  = 0;      
    this.message = g_selectStartVertex;
    this.maxPathLength = 0;
    return true;
}

FindLongestPath.prototype.instance = function()
{
    return false;
}

FindLongestPath.prototype.getObjectSelectedGroup = function(object)
{
    return (this.nSubgraphIndex in this.foundSubGraphs && object.id in this.foundSubGraphs[this.nSubgraphIndex]) ? 1 :
            (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : ((object == this.firstObject || object == object.secondObject) ? 1 : 0);
}

FindLongestPath.prototype.getPriority = function()
{
    return -9.4;
}


// Factory for connected components.
function CreateFindLongestPath(graph, app)
{
    return new FindLongestPath(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFindLongestPath);
