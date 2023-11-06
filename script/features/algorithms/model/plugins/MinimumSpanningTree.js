
function MinimumSpanningTree(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
    this.isNotConnected = false;
    this.MST = 0;
    this.edges = [];
}


// inheritance.
MinimumSpanningTree.prototype = Object.create(BaseAlgorithm.prototype);


MinimumSpanningTree.prototype.getName = function(local)
{
    return g_minimumSpanningTree; //local == "ru" ? "Поиск минимального остовного дерева" : "Search of minimum spanning tree";
}

MinimumSpanningTree.prototype.getId = function()
{
    return "OlegSh.minimalSpanningTree";
}

// @return message for user.
MinimumSpanningTree.prototype.getMessage = function(local)
{
	if (!this.isNotConnected )
    {
    	return g_SpanningTreeResult + this.MST + ". " + 
          (this.graph.hasDirectEdge() ? g_SpanningTreeIgnoreDir : "");
    }
    else
    {
    	return g_SpanningTreeNotConnected;    
    }
}

MinimumSpanningTree.prototype.result = function(resultCallback)
{
    this.MST = 0;
    this.edges = [];
    this.isNotConnected = true;
    var tempVertices = this.graph.vertices.slice();
    connectedVertex = getVertexToVertexArray(this.graph, true);

    // We ignore orientation for this algorithm.
    //if (!this.graph.hasDirectEdge())
    {
    	res = this.resultStartedFrom(tempVertices[0], connectedVertex);
    	this.isNotConnected = res.isNotConnected;
    	if (!this.isNotConnected)
    	{
    		this.MST = res.MST;
    		this.edges = res.edges;  
    	}
    }
    /*else
    {
    	for (var i = 0; i < tempVertices.length; i++)
      {
      	res = this.resultStartedFrom(tempVertices[i], connectedVertex);
    		if (!res.isNotConnected)
    		{
          this.isNotConnected = res.isNotConnected;
    			if (this.MST == 0 || res.MST < this.MST)
          {
            console.log(res);
          	this.MST = res.MST;
    				this.edges = res.edges;  
          }
    		}
      }
    }*/
    
    var result = {};
    result["version"] = 1;
    result["minPath"] = true;

    return result;
}

MinimumSpanningTree.prototype.resultStartedFrom = function(vertex, connectedVertex)
{
    var res = {};
    res.MST = 0;
    res.edges = [];
    res.isNotConnected = false;
    
    var inTree = [];
    inTree.push(vertex);
    var vertecesInTree = 0;
    
	  // Will break in end of loop
    while (true)
    {
        vertecesInTree++;
        var minVert = null;
        var minEdge = null;

        for (i = 0; i < inTree.length; i++)
        {
            var element = inTree[i];

            if (connectedVertex.hasOwnProperty(element.id))
            {
                for (j = 0; j < connectedVertex[element.id].length; j++)
                {
                    var connectedElement = connectedVertex[element.id][j];
                    var connectedEdge    = this.graph.FindEdgeMinIgnoreDirection(element.id, connectedElement.id);
                    
                    if (inTree.indexOf(connectedElement) < 0)
                    {
						if (minEdge == null || minEdge.weight > connectedEdge.weight)
                        {
                        	minEdge = connectedEdge;
                            minVert = connectedElement;
                        }
                    }
                }
            }
        }
        
        if (minVert == null)
        {
        	break;
        }
        else
        {
        	res.MST = res.MST + Number(minEdge.weight);
        	inTree.push(minVert);
          res.edges.push(minEdge);
        }
    }
    
    res.isNotConnected = (inTree.length < this.graph.vertices.length);
 
    return res;
}

MinimumSpanningTree.prototype.getObjectSelectedGroup = function(object)
{
	return this.isNotConnected ? 0 : 
    	(object instanceof  BaseVertex || this.edges.indexOf(object) >= 0) ? 1 : 0;
}

MinimumSpanningTree.prototype.getPriority = function()
{
    return -9.3;
}

// Algorithm support multi graph
MinimumSpanningTree.prototype.IsSupportMultiGraph = function ()
{
    return true;
}


// Factory for algorithm.
function CreateMinimumSpanningTree(graph, app)
{
    return new MinimumSpanningTree(graph)
}

// Register connected component.
RegisterAlgorithm (CreateMinimumSpanningTree);

