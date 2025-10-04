/**
 * Find short path.
 *
 */
function FindAllPathes(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_selectStartVertex;
    this.selectedObjects = {};
    this.foundSubGraphs  = {};
    this.nSubgraphIndex  = 0;
    this.nSubGraphCount  = 0;
    this.foundPaths      = {};
}


// inheritance.
FindAllPathes.prototype = Object.create(BaseAlgorithmEx.prototype);
// First selected.
FindAllPathes.prototype.firstObject = null;
// Second selected.
FindAllPathes.prototype.secondObject = null;
// Path
FindAllPathes.prototype.pathObjects = null;
// Infinity
FindAllPathes.prototype.infinityValue = 1E9 - 1;

FindAllPathes.prototype.getName = function(local)
{
    return g_findAllPathes;
}

FindAllPathes.prototype.getId = function()
{
    return "Abin.FindAllPathes";
}

// @return message for user.
FindAllPathes.prototype.getMessage = function(local)
{
    return this.message;
}

FindAllPathes.prototype.getCategory = function()
{
    return 1;
}

FindAllPathes.prototype.MaxGraphSize = function()
{
    return 50;
}

FindAllPathes.prototype.MaxEgdeNumber = function()
{
    return 40;
}

FindAllPathes.prototype.result = function(resultCallback)
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

FindAllPathes.prototype.setResultMessage = function()
{
    if (this.nSubGraphCount > 0)
    {
        var currentPath = "";
        var first = true;
        this.foundPaths[this.nSubgraphIndex].forEach((nodeId) => {
            currentPath += (first ? "" : "⇒") + this.graph.FindVertex(nodeId).mainText;
            first = false;
        });

        this.message = g_numberOfPathesFrom + this.firstObject.mainText + 
        g_to + this.secondObject.mainText + g_are + 
        this.nSubGraphCount + ". " + g_pathN + (1 + parseInt(this.nSubgraphIndex)) + ": " + currentPath + 
        " <select style=\"float:right\" id=\"enumSubgraphs\"></select>";
    }
    else
    {
        this.message = g_pathNotExists;
    }
}

FindAllPathes.prototype.resultCallback = function(pathObjects, properties, results)
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
        for (var i = 0; i < this.nSubGraphCount; i++)
        {
          this.foundSubGraphs[i] = {};
          this.foundPaths[i]     = [];
        }
  
        var subGraphIndex = 0;
        for (var i = 0; i < results.length; i++)
        {
          if (results[i].type == 6)
          {
            subGraphIndex++;
          }
  
          if (results[i].type == 4)
          {
            var nodeId = parseInt(results[i].value);
            var index  = subGraphIndex;
            var subgGraph = this.foundSubGraphs[index];
            subgGraph[nodeId] = true;

            this.foundPaths[index].push(nodeId);  
          }

          if (results[i].type == 5)
          {
            var edgeId = parseInt(results[i].value);
            var index  = subGraphIndex;
            var subgGraph = this.foundSubGraphs[index];
            subgGraph[edgeId] = true;
          }
        }

        this.setResultMessage();        
    }
    else
    {
        this.secondObject = null;
        this.firstObject = null;
        this.message = g_pathNotExists;
    }
    
    this.outResultCallback(outputResult);
}

FindAllPathes.prototype.messageWasChanged = function()
{
   var self = this;
    
   if ($('#enumSubgraphs'))
   {
      for (var i = 0; i < this.nSubGraphCount; i++)
      {
          $('#enumSubgraphs').append("<option value=\"" + i + "\"" + (self.nSubgraphIndex==i ? "selected": "") + ">" + 
                                       g_pathN + (i + 1)  +
                                  "</option>");
      }

      $('#enumSubgraphs').change(function () {
          self.nSubgraphIndex = $('#enumSubgraphs').val();
          self.setResultMessage();
          self.app.redrawGraph();
          self.app.updateMessage();          
      });
   }
}

FindAllPathes.prototype.selectVertex = function(vertex)
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
        this.firstObject = vertex;
        this.secondObject = null;
        this.selectedObjects = {};
        this.message = g_selectFinishVertex;
    }

    return true;
}

FindAllPathes.prototype.deselectAll = function()
{
    this.firstObject  = null;
    this.secondObject = null;
    this.selectedObjects = {};
    this.foundSubGraphs  = {};
    this.nSubgraphIndex  = 0;
    this.nSubGraphCount  = 0;      
    this.message = g_selectStartVertex;
    return true;
}

FindAllPathes.prototype.instance = function()
{
    return false;
}

FindAllPathes.prototype.getObjectSelectedGroup = function(object)
{
    return (this.nSubgraphIndex in this.foundSubGraphs && object.id in this.foundSubGraphs[this.nSubgraphIndex]) ? 1 :
            (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : ((object == this.firstObject || object == object.secondObject) ? 1 : 0);
}

FindAllPathes.prototype.getPriority = function()
{
    return -9.4;
}

FindAllPathes.prototype.IsSupportNegativeWeight = function()
{
    return true;
}

FindAllPathes.prototype.IsSupportMultiGraph = function()
{
    return true;
}

// Factory for connected components.
function CreateFindAllPathes(graph, app)
{
    return new FindAllPathes(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFindAllPathes);
