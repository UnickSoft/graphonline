/**
 * Find short path.
 *
 */

function IsomorphismCheck(graph, app)          
{
    BaseAlgorithmEx.apply(this, arguments);

    if (graph && app)
    {
        this.connectedComponent = new FindConnectedComponentNew(graph, app);
        this.connectedComponent.calculate();
    }

    this.setFirstMessage();
    this.prevCalculated  = false;
    this.searchSubGraphs = false;
    this.foundSubGraphs  = {};
    this.nSubgraphIndex  = 0;
    this.nSubGraphCount  = 0;
    this.bIsomorph       = false;
}


// inheritance.
IsomorphismCheck.prototype = Object.create(BaseAlgorithmEx.prototype);
// First selected.
IsomorphismCheck.prototype.firstGraph = null;
// Second selected.
IsomorphismCheck.prototype.secondGraph = null;


IsomorphismCheck.prototype.getName = function(local)
{
    return g_IsomorphismCheck;
}

IsomorphismCheck.prototype.getId = function()
{
    return "OlegSh.IsomorphismCheck";
}

// @return message for user.
IsomorphismCheck.prototype.getMessage = function(local)
{
    return this.message;
}

IsomorphismCheck.prototype.result = function(resultCallback)
{
    if (this.firstGraph && this.secondGraph)
    {
        this.outResultCallback = function (result ) { resultCallback(result); };
        self = this;
        var params = [
          {name : "graph1", value: this.getGraphEdges(this.firstGraph)},
          {name : "graph2", value: this.getGraphEdges(this.secondGraph)},          
        ];
        if (this.searchSubGraphs) {
          params.push({name: "searchSubgraphs", value: true});          
        }
        this.CalculateAlgorithm("isocheck", params, function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    }
    return null;
}

IsomorphismCheck.prototype.getGraphEdges = function(nodesAndEdges)
{
    var res = ""
    for (var key in nodesAndEdges) 
    {
      var edgeObject = this.graph.FindEdgeById(key);
      if (edgeObject)
      {
         if (res != "")
          res = res + ","
         res = res + edgeObject.vertex1.id + "-" + edgeObject.vertex2.id;
      }
    }

    return res;
}

IsomorphismCheck.prototype.resultCallback = function(pathObjects, properties, results)
{
    var outputResult = {};
    outputResult["version"] = 1;
    
    if (!this.searchSubGraphs)
    {
      this.bIsomorph = results.length > 0 && results[0].type == 1 && results[0].value == 1;
    
      this.setResultMessage();
    }
    else
    {
      this.nSubGraphCount = results.length > 0 && results[0].type == 1 ? results[0].value : 0;
      
      this.setResultMessage();

      this.foundSubGraphs  = {};
      for (var i = 0; i < this.nSubGraphCount; i++)
      {
        this.foundSubGraphs[i] = {};
      }

      var subGraphIndex = 0;
      for (var i = 0; i < results.length; i++)
      {
        if (results[i].type == 6)
        {
          subGraphIndex++;
        }

        if (results[i].type == 5)
        {
          var edgeId = parseInt(results[i].value);
          var index  = subGraphIndex;
          var subgGraph = this.foundSubGraphs[index];
          subgGraph[edgeId] = true;
          var edgeObject = this.graph.FindEdgeById(edgeId);
          subgGraph[edgeObject.vertex1.id] = true;
          subgGraph[edgeObject.vertex2.id] = true;
        }
      }
    }
    
    this.prevCalculated = true;
    this.outResultCallback(outputResult);
}

IsomorphismCheck.prototype.selectVertex = function(vertex)
{
    if (this.connectedComponent && this.connectedComponent.connectedComponentNumber <= 1)
      return true;

    if (this.firstGraph && !this.prevCalculated && (!this.firstGraph || !(vertex.id in this.firstGraph)))
    {
        this.message      = g_processing;
        this.secondGraph  = this.getGraphWithNode(vertex);
    }
    else
    {
        this.deselectAll();
        
        this.firstGraph  = this.getGraphWithNode(vertex);
        this.secondGraph = null;
        this.setSecondMessage();
        this.app.updateMessage();
    }

    return true;
}

IsomorphismCheck.prototype.deselectAll = function()
{
    this.firstGraph  = null;
    this.secondGraph = null;
    this.prevCalculated = false;
    this.setFirstMessage();
    this.restore();
    this.foundSubGraphs  = {};
    this.nSubgraphIndex  = 0;
    this.nSubGraphCount  = 0;
    this.bIsomorph       = false;

    this.app.updateMessage();

    return true;
}

IsomorphismCheck.prototype.instance = function()
{
    return false;
}

IsomorphismCheck.prototype.getObjectSelectedGroup = function(object)
{
    return (this.nSubgraphIndex in this.foundSubGraphs && object.id in this.foundSubGraphs[this.nSubgraphIndex]) ? 3 : 
           (this.firstGraph && object.id in this.firstGraph) ? 1 : ((this.secondGraph && object.id in this.secondGraph) ? 2 : 0);
}

IsomorphismCheck.prototype.getPriority = function()
{
    return -8.0;
}

IsomorphismCheck.prototype.getGraphWithNode = function(node)
{
  var res = {}
  if (node.id in this.connectedComponent.component)
  {
    var componentNumber = this.connectedComponent.component[node.id];
    for (var key in this.connectedComponent.component) 
    {
      if (this.connectedComponent.component[key] == componentNumber)
      {
        res[key] = true;
      }
    } 
  }

  return res;
}

IsomorphismCheck.prototype.setFirstMessage = function()
{
    if (this.connectedComponent && this.connectedComponent.connectedComponentNumber <= 1)
    {
      this.message = g_graphHasNoAtleast2Graphs;
      return;
    }

    if (!this.searchSubGraphs)
      this.message = g_selectFirstGraphIsomorphismCheck + "<input id=\"searchSubGraph\" type=\"checkbox\" " + (this.searchSubGraphs ? "checked": "")+  " style=\"float:right\">" + "<label style=\"margin-bottom: 0px;float:right\">" + g_searchIsomorphSubgraph + "&nbsp; </label>";
    else
      this.message = g_selectFirstGraphPatternCheck + "<input id=\"searchSubGraph\" type=\"checkbox\" " + (this.searchSubGraphs ? "checked": "")+  " style=\"float:right\">" + "<label style=\"margin-bottom: 0px;float:right\">" + g_searchIsomorphSubgraph + "&nbsp; </label>";
}

IsomorphismCheck.prototype.setSecondMessage = function()
{
    if (!this.searchSubGraphs)
      this.message = g_selectSecondGraphIsomorphismCheck + "<input id=\"searchSubGraph\" type=\"checkbox\" " + (this.searchSubGraphs ? "checked": "")+  " style=\"float:right\">"  + "<label style=\"margin-bottom: 0px;float:right\">" + g_searchIsomorphSubgraph + "&nbsp; </label>";
    else
      this.message = g_selectSecondGraphForSearchSubgraph + "<input id=\"searchSubGraph\" type=\"checkbox\" " + (this.searchSubGraphs ? "checked": "")+  " style=\"float:right\">"  + "<label style=\"margin-bottom: 0px;float:right\">" + g_searchIsomorphSubgraph + "&nbsp; </label>";
}

IsomorphismCheck.prototype.setResultMessage = function()
{
    if (!this.searchSubGraphs)
    {
      if (this.bIsomorph)
      {
        this.message = g_graphsIsomorph;
      }
      else
      {
        this.message = g_graphsNotIsomorph;
      }
    }
    else
    {
      if (this.nSubGraphCount > 0)
      {
        this.message = g_numberOfIsomorphSubgraphIs + this.nSubGraphCount + " <select style=\"float:right\" id=\"enumSubgraphs\"></select>";
      }
      else
      {
        this.message = g_graphHasNoIsomorphSubgraph;
      }
    }
}

IsomorphismCheck.prototype.messageWasChanged = function()
{
   var self = this;

   if ($('#searchSubGraph'))
   {
     $('#searchSubGraph').change(function() {
         self.searchSubGraphs = this.checked;
         if (self.firstGraph && !self.prevCalculated)
           self.setSecondMessage();
         else
           self.setFirstMessage();

         self.app.updateMessage();
     });
   }
    
   if ($('#enumSubgraphs'))
   {
      for (var i = 0; i < this.nSubGraphCount; i++)
      {
          $('#enumSubgraphs').append("<option value=\"" + i + "\"" + (self.nSubgraphIndex==i ? "selected": "") + ">" + 
                                       g_subgraphNo + (i + 1)  +
                                  "</option>");
      }

      $('#enumSubgraphs').change(function () {
          self.nSubgraphIndex = $('#enumSubgraphs').val();
          self.app.redrawGraph();
          self.setResultMessage();
      });
   }
}

IsomorphismCheck.prototype.IsSupportNegativeWeight = function()
{
    return true;
}

// Factory for connected components.
function CreateIsomorphismCheck(graph, app)
{
    return new IsomorphismCheck(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateIsomorphismCheck);
