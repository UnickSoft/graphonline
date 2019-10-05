
function MinimumSpanningTree(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
    this.isNotConneted = false;
    this.MST = 0;
    this.edges = [];
}


// inheritance.
MinimumSpanningTree.prototype = Object.create(BaseAlgorithm.prototype);


MinimumSpanningTree.prototype.getName = function(local)
{
    return local == "ru" ? "Поиск минимального остовного дерева" : "Search of minimum spanning tree";
}

MinimumSpanningTree.prototype.getId = function()
{
    return "OlegSh.minimalSpanningTree";
}

// @return message for user.
MinimumSpanningTree.prototype.getMessage = function(local)
{
	if (!this.isNotConneted )
    {
    	return local == "ru" ? "Вес минимального оставного дерева равен " + this.MST : "Weight of minimum spanning tree is " + this.MST;
    }
    else
    {
    	return local == "ru" ? "Граф не является связным" : "Graph is disconnected";    
    }
}

MinimumSpanningTree.prototype.result = function(resultCallback)
{
    this.MST = 0;
    this.edges = [];
    this.isNotConneted = true;
    var tempVertexes = this.graph.vertices.slice();
    connectedVertex = getVertexToVertexArray(this.graph, false);

		if (!this.graph.hasDirectEdge())
    {
    	res = this.resultStartedFrom(tempVertexes[0], connectedVertex);
    	this.isNotConneted = res.isNotConneted;
    	if (!this.isNotConneted)
    	{
    		this.MST = res.MST;
    		this.edges = res.edges;  
    	}
    }
    else
    {
    	for (var i = 0; i < tempVertexes.length; i++)
      {
      	res = this.resultStartedFrom(tempVertexes[i], connectedVertex);
    		if (!res.isNotConneted)
    		{
          this.isNotConneted = res.isNotConneted;
    			if (this.MST == 0 || res.MST < this.MST)
          {
            console.log(res);
          	this.MST = res.MST;
    				this.edges = res.edges;  
          }
    		}
      }
    }
    
    var result = {};
    result["version"] = 1;

    return result;
}

MinimumSpanningTree.prototype.resultStartedFrom = function(vertex, connectedVertex)
{
    var res = {};
    res.MST = 0;
    res.edges = [];
    res.isNotConneted = false;
    
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
                    var connectedEdge    = this.graph.FindEdge(element.id, connectedElement.id);
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
    
    res.isNotConneted = (inTree.length < this.graph.vertices.length);
 
    return res;
}

MinimumSpanningTree.prototype.getObjectSelectedGroup = function(object)
{
	return this.isNotConneted ? 0 : 
    	(object instanceof  BaseVertex || this.edges.indexOf(object) >= 0) ? 1 : 0;
}

MinimumSpanningTree.prototype.getPriority = function()
{
    return -9.5;
}


// Factory for algorithm.
function CreateMinimumSpanningTree(graph, app)
{
    return new MinimumSpanningTree(graph)
}

// Register connected component.
RegisterAlgorithm (CreateMinimumSpanningTree);

