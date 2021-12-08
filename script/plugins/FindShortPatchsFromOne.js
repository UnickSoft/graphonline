/**
 * Find short path.
 *
 */
function FindShortPatchsFromOne(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_selectStartVertex;
    this.selectedObjects = {};
    this.foundSubGraphs  = {};
    this.nSubgraphIndex  = 0;
    this.nSubGraphCount  = 0; 
    this.lastVertexInPath  = [];
    this.lengthOfPath      = [];
}


// inheritance.
FindShortPatchsFromOne.prototype = Object.create(BaseAlgorithmEx.prototype);
// First selected.
FindShortPatchsFromOne.prototype.firstObject = null;
// Path
FindShortPatchsFromOne.prototype.pathObjects = null;
// Infinity
FindShortPatchsFromOne.prototype.infinityValue = 1E9 - 1;

FindShortPatchsFromOne.prototype.getName = function(local)
{
    return g_findAllPathesFromVertex;
}

FindShortPatchsFromOne.prototype.getId = function()
{
    return "Abin.FindShortPatchsFromOne";
}

// @return message for user.
FindShortPatchsFromOne.prototype.getMessage = function(local)
{
    return this.message;
}

FindShortPatchsFromOne.prototype.result = function(resultCallback)
{
    if (this.firstObject)
    {
        this.outResultCallback = function (result ) { resultCallback(result); };
        self = this;
        this.CalculateAlgorithm("blf", [
            {name: "start", value : this.firstObject.id}   
            ], function (pathObjects, properties, results)
            {
                self.resultCallback(pathObjects, properties, results);
            });
    }
    return null;
}

FindShortPatchsFromOne.prototype.setResultMessage = function()
{
    if (this.nSubGraphCount > 0)
    {
        this.message = g_distanceFrom + this.firstObject.mainText + 
        g_to + this.lastVertexInPath[this.nSubgraphIndex] + g_are + 
        this.lengthOfPath[this.nSubgraphIndex] + " <select style=\"float:right\" id=\"enumSubgraphs\"></select>";        
    }
    else
    {
        this.message = g_pathNotExists;
    }
}

FindShortPatchsFromOne.prototype.resultCallback = function(pathObjects, properties, results)
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
        for (var i = 0; i < this.nSubGraphCount; i++)
        {
          this.foundSubGraphs[i] = {};
          this.lengthOfPath.push(0);
          this.lastVertexInPath.push(0);
        }
  
        var subGraphIndex = 0;
        var prevNodeId = -1;
        for (var i = 0; i < results.length; i++)
        {
          if (results[i].type == 6)
          {
            subGraphIndex++;
            prevNodeId = -1;
          }
  
          if (results[i].type == 4)
          {
            var nodeId = parseInt(results[i].value);
            var index  = subGraphIndex;
            var subgGraph = this.foundSubGraphs[index];
            subgGraph[nodeId] = true;
            var vertex = this.graph.FindVertex(nodeId);
            this.lastVertexInPath[index] = vertex != null ? vertex.mainText : "";
  
            if (prevNodeId >= 0)
            {
              var edgeObject = this.graph.FindEdgeMin(prevNodeId, nodeId);
              subgGraph[edgeObject.id] = true;
              this.lengthOfPath[index] += edgeObject.GetWeight();
            }
            prevNodeId = nodeId;
          }
        }

        this.setResultMessage();
    }
    else
    {
        this.firstObject = null;
        this.message = g_pathNotExists;
    }
    
    this.outResultCallback(outputResult);
}

FindShortPatchsFromOne.prototype.messageWasChanged = function()
{
   var self = this;
    
   if ($('#enumSubgraphs'))
   {
      for (var i = 0; i < this.nSubGraphCount; i++)
      {
          $('#enumSubgraphs').append("<option value=\"" + i + "\"" + (self.nSubgraphIndex==i ? "selected": "") + ">" + 
                                       g_pathTo + this.lastVertexInPath[i]  +
                                  "</option>");
      }

      $('#enumSubgraphs').change(function () {
          self.nSubgraphIndex = $('#enumSubgraphs').val();
          self.app.redrawGraph();
          self.setResultMessage();
      });
   }
}

FindShortPatchsFromOne.prototype.selectVertex = function(vertex)
{
	this.pathObjects = null;
	this.shortDist = null;
    
    this.deselectAll();

    this.firstObject = vertex;
    this.selectedObjects = {};
    this.message = "Processing...";

    return true;
}

FindShortPatchsFromOne.prototype.deselectAll = function()
{
    this.firstObject  = null;
    this.selectedObjects = {};
    this.foundSubGraphs  = {};
    this.nSubgraphIndex  = 0;
    this.nSubGraphCount  = 0;      
    this.message = g_selectStartVertex;
    this.lastVertexInPath  = [];
    this.lengthOfPath      = [];

    return true;
}

FindShortPatchsFromOne.prototype.instance = function()
{
    return false;
}

FindShortPatchsFromOne.prototype.getObjectSelectedGroup = function(object)
{
    return (this.nSubgraphIndex in this.foundSubGraphs && object.id in this.foundSubGraphs[this.nSubgraphIndex]) ? 1 :
            (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : ((object == this.firstObject || object == object.secondObject) ? 1 : 0);
}

FindShortPatchsFromOne.prototype.getPriority = function()
{
    return -9.4;
}

// Algorithm support multi graph
FindShortPatchsFromOne.prototype.IsSupportMultiGraph = function()
{
    return true;
}

// Factory for connected components.
function CreateFindShortPatchsFromOne(graph, app)
{
    return new FindShortPatchsFromOne(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFindShortPatchsFromOne);
