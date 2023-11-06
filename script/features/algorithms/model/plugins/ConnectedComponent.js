/**
 * Default handler.
 * Select using mouse, drag.
 *
 */
function FindConnectedComponentNew(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
    this.connectedComponentNumber = 0;    
    this.component = {};
    this.selectedObjects = [];
}


// inheritance.
FindConnectedComponentNew.prototype = Object.create(BaseAlgorithm.prototype);


FindConnectedComponentNew.prototype.getName = function(local)
{
    return g_findConnectedComponent; //local == "ru" ? "Найти компоненты связности" : "Find connected components";
}

FindConnectedComponentNew.prototype.getId = function()
{
    return "OlegSh.ConnectedComponent";
}

// @return message for user.
FindConnectedComponentNew.prototype.getMessage = function(local)
{
    return (this.graph.hasDirectEdge() ? g_sickConnectedComponent : g_connectedComponent) + this.connectedComponentNumber;
}

FindConnectedComponentNew.prototype.result = function(resultCallback)
{
    this.calculate(true);
    
    var result = {};
    result["version"] = 1;
    this.selectedObjects = this.component;

    return result;
}

FindConnectedComponentNew.prototype.calculate = function(fillUpText = false)
{
    this.connectedComponentNumber = 0;
    this.component = {};
    var tempVertices = this.graph.vertices.slice();
    connectedVertex = getVertexToVertexArray(this.graph, true);
    var connectedComponentNumber = 0;
    
    while (tempVertices.length > 0)
    {
        connectedComponentNumber++;
        
        var stack = [];
        stack.push(tempVertices[0]);
        
        tempVertices.splice(0, 1);
        
        indexInStack = 0;
        
        for (i = 0; i < stack.length; i++)
        {
            var stackElement = stack[i];
            this.component[stackElement.id]  = connectedComponentNumber;
            if (fillUpText)
            {
                stackElement.upText = connectedComponentNumber;
            }
            
            if (connectedVertex.hasOwnProperty(stackElement.id))
            {
                for (j = 0; j < connectedVertex[stackElement.id].length; j++)
                {
                    var nextVertex = connectedVertex[stackElement.id][j];
                    var connectedEdge = this.graph.FindEdgeAny(stackElement.id, nextVertex.id);
                    if (stack.indexOf(nextVertex) < 0)
                    {
                        stack.push(nextVertex);
                        tempVertices.splice(tempVertices.indexOf(nextVertex), 1);
                        if (connectedEdge)
                        {
                            this.component[connectedEdge.id]  = connectedComponentNumber;
                        }
                    }
                    else if (connectedEdge && !(connectedEdge.id in this.component))
                    {
                        this.component[connectedEdge.id]  = connectedComponentNumber;
                    }
                }
            }
        }
    }
    this.connectedComponentNumber = connectedComponentNumber;
    
    //var result = {};
    //result["version"] = 1;
    //this.selectedObjects = this.component;

    return this.connectedComponentNumber;
}

FindConnectedComponentNew.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

FindConnectedComponentNew.prototype.getPriority = function()
{
    return 0;
}

// Algorithm support multi graph
FindConnectedComponentNew.prototype.IsSupportMultiGraph = function()
{
    return true;
}


// Factory for connected components.
function CreateConnectedComponetsNew(graph, app)
{
    return new FindConnectedComponentNew(graph)
}

// Gerister connected component.
RegisterAlgorithm (CreateConnectedComponetsNew);
