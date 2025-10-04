/**
 * Find all shortest pathes.
 *
 */
function FindAllShortestPathes(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.message = g_selectStartVertex;
    this.selectedObjects = {};
    this.foundSubGraphs  = {};
    this.nSubgraphIndex  = 0;
    this.nSubGraphCount  = 0;
    this.foundPaths      = {};
    this.min_len = 1E10;
}


// inheritance.
FindAllShortestPathes.prototype = Object.create(BaseAlgorithmEx.prototype);
// First selected.
FindAllShortestPathes.prototype.firstObject = null;
// Second selected.
FindAllShortestPathes.prototype.secondObject = null;
// Path
FindAllShortestPathes.prototype.pathObjects = null;
// Infinity
FindAllShortestPathes.prototype.infinityValue = 1E9 - 1;

FindAllShortestPathes.prototype.getName = function(local)
{
    return g_FindAllShortestPathes;
}

FindAllShortestPathes.prototype.getId = function()
{
    return "OlegSh.FindAllShortestPathes";
}

// @return message for user.
FindAllShortestPathes.prototype.getMessage = function(local)
{
    return this.message;
}

FindAllShortestPathes.prototype.getCategory = function()
{
    return 1;
}

FindAllShortestPathes.prototype.MaxGraphSize = function()
{
    return 50;
}

FindAllShortestPathes.prototype.MaxEgdeNumber = function()
{
    return 40;
}

FindAllShortestPathes.prototype.result = function(resultCallback)
{
    if (this.firstObject && this.secondObject)
    {
        this.min_len = 1E10;

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

FindAllShortestPathes.prototype.setResultMessage = function()
{
    if (this.nSubGraphCount > 0)
    {
        var currentPath = "";
        var first = true;
        this.foundPaths[this.nSubgraphIndex].forEach((nodeId) => {
            currentPath += (first ? "" : "⇒") + this.graph.FindVertex(nodeId).mainText;
            first = false;
        });

        this.message = g_numberOfShortestPathesFrom + this.firstObject.mainText + 
            g_to + this.secondObject.mainText + g_are + 
            this.nSubGraphCount + " (" + g_length_is + this.min_len + ")" +". " + g_pathN + (1 + parseInt(this.nSubgraphIndex)) + ": " + currentPath + 
            " <select style=\"float:right\" id=\"enumSubgraphs\"></select>";
    }
    else
    {
        this.message = g_pathNotExists;
    }
}

FindAllShortestPathes.prototype.resultCallback = function(pathObjects, properties, results)
{
    var outputResult = {};
    outputResult["version"] = 1;
    outputResult["minPath"] = true;
    
    this.pathObjects = pathObjects;
    this.properties = properties;
    
    var bFound = results.length > 0 && results[0].value < this.infinityValue && (results[0].type == 1 || results[0].type == 2);
    
    if (bFound)
    {
        let patches_len = {};

        // Search minimal patches
        {
            let current_len = 0;

            var subGraphIndex = 0;
            let any_found = false;
            for (var i = 0; i < results.length; i++)
            {
                if (results[i].type == 6)
                {
                    patches_len[subGraphIndex] = current_len;
                    subGraphIndex++;
                    this.min_len = Math.min(this.min_len, current_len);
                    current_len = 0;
                }
        
                if (results[i].type == 5)
                {
                    any_found = true;
                    var edgeId = parseInt(results[i].value);
                    let edgeObject = this.graph.FindEdgeById(edgeId);
                    current_len = current_len + edgeObject.GetWeight();
                }
            }
            if (any_found)
            {
                patches_len[subGraphIndex] = current_len;
                this.min_len = Math.min(this.min_len, current_len);
            }
        }

        let min_pathes_count = 0;
        for (const [key, value] of Object.entries(patches_len)) {
            if (value == this.min_len)
            {
                min_pathes_count = min_pathes_count + 1;
            }
        }

        this.nSubGraphCount = min_pathes_count;
      
        this.foundSubGraphs  = {};
        this.foundPaths     = {};
        for (var i = 0; i < this.nSubGraphCount; i++)
        {
          this.foundSubGraphs[i] = {};
          this.foundPaths[i]     = [];
        }

        var subGraphIndex = 0;
        let skipGraphsCount = patches_len[subGraphIndex] > this.min_len ? 1 : 0;
        for (var i = 0; i < results.length; i++)
        {
          if (results[i].type == 6)
          {
            subGraphIndex++;
          }

          if (patches_len[subGraphIndex] > this.min_len)
          {
            if (results[i].type == 6)
            {
                skipGraphsCount++;
            }
            // Skip 
            continue;
          }
  
          if (results[i].type == 4)
          {
            var nodeId = parseInt(results[i].value);
            var index  = subGraphIndex - skipGraphsCount;
            var subgGraph = this.foundSubGraphs[index];
            subgGraph[nodeId] = true;
            this.foundPaths[index].push(nodeId);
          }

          if (results[i].type == 5)
          {
            var index  = subGraphIndex - skipGraphsCount;
            var subgGraph = this.foundSubGraphs[index];
            var edgeId = parseInt(results[i].value);
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

FindAllShortestPathes.prototype.messageWasChanged = function()
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

FindAllShortestPathes.prototype.selectVertex = function(vertex)
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

FindAllShortestPathes.prototype.deselectAll = function()
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

FindAllShortestPathes.prototype.instance = function()
{
    return false;
}

FindAllShortestPathes.prototype.getObjectSelectedGroup = function(object)
{
    return (this.nSubgraphIndex in this.foundSubGraphs && object.id in this.foundSubGraphs[this.nSubgraphIndex]) ? 1 :
            (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : ((object == this.firstObject || object == object.secondObject) ? 1 : 0);
}

FindAllShortestPathes.prototype.getPriority = function()
{
    return -9.46;
}

FindAllShortestPathes.prototype.IsSupportNegativeWeight = function()
{
    return true;
}

FindAllShortestPathes.prototype.IsSupportMultiGraph = function()
{
    return true;
}

// Factory for connected components.
function CreateFindAllShortestPathes(graph, app)
{
    return new FindAllShortestPathes(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFindAllShortestPathes);
