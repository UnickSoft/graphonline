/**
 * Default handler.
 * Select using mouse, drag.
 *
 */
function Coloring(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
    this.connectedComponentNumber = 0;
    this.component = {};
    this.selectedObjects = [];
    this.MaxColor = 1000;
}


// inheritance.
Coloring.prototype = Object.create(BaseAlgorithm.prototype);


Coloring.prototype.getName = function(local)
{
    return g_ColoringName; //local == "ru" ? "Раскраска графа" : "Graph coloring";
}

Coloring.prototype.getId = function()
{
    return "OlegSh.GraphColoring";
}

// @return message for user.
Coloring.prototype.getMessage = function(local)
{
    return g_colorNumber + " " + this.connectedComponentNumber;
}

Coloring.prototype.result = function(resultCallback)
{
    this.calculate(true);
    
    var result = {};
    result["version"] = 1;
    this.selectedObjects = this.component;

    return result;
}

Coloring.prototype.calculate = function(fillUpText = false)
{
    this.connectedComponentNumber = 0;
    this.component = {};
    connectedVertex = getVertexToVertexArray(this.graph, true);
    
    var listOfOrders = [];
    this.addSimpleAndRandomOrders(listOfOrders);
    this.addBasedOnDegree(listOfOrders, connectedVertex);
    this.addForTree(listOfOrders, connectedVertex);
    
    this.connectedComponentNumber = this.MaxColor;
    
    // Find minimal variant.
    for (var i = 0; i < listOfOrders.length; i++)
    {
        var coloringComponent = this.makeColoring(listOfOrders[i], connectedVertex);
        if (coloringComponent["max"] < this.connectedComponentNumber)
        {
            this.component = coloringComponent;
            this.connectedComponentNumber = coloringComponent["max"];
        }
    }
    
    // Fill Up text
    for (var i = 0; i < this.graph.vertices.length; i++)
    {
        this.graph.vertices[i].upText = this.component[this.graph.vertices[i].id];
    }
    
    //var result = {};
    //result["version"] = 1;
    //this.selectedObjects = this.component;

    return this.connectedComponentNumber;
}

Coloring.prototype.makeColoring = function(vertexOrder, connectedVertex)
{
    var res = {};
    var maxColor = 0;
    
    for (var i = 0; i < vertexOrder.length; i++)
    {
        var id = this.graph.vertices[vertexOrder[i]].id;
        var hasColor = {};
        if (id in connectedVertex)
        {
            // find color of neighbors.
            for (var j = 0; j < connectedVertex[id].length; j++)
            {
                nearId = connectedVertex[id][j].id;
                if (nearId in res)
                {
                    hasColor[res[nearId]] = 1;
                }
            }
        }
        
        // find color for current vertex;
        var color = 0;
        for (var j = 1; j < this.MaxColor; j++)
        {
            if (!(j in hasColor))
            {
                color = j;
                break;
            }
        }
        res[id] = color;
        maxColor = Math.max(maxColor, color);
    }
    
    res["max"] = maxColor;
    return res;
}

Coloring.prototype.addSimpleAndRandomOrders = function(listOfOrders)
{
    var vertexOrder = [];
    for (var i = 0; i < this.graph.vertices.length; i++)
    {
        vertexOrder.push(i);
    }
    
    // As in graph
    listOfOrders.push(vertexOrder);
    // Push some randoms
    for (var i = 0; i < Math.floor(Math.sqrt(this.graph.vertices.length)); i++)
    {
        listOfOrders.push(this.shuffleArray(vertexOrder));
    }
}

Coloring.prototype.addBasedOnDegree = function(listOfOrders, connectedVertex)
{
    var vertexDegree = [];
    for (var i = 0; i < this.graph.vertices.length; i++)
    {
        var degree = 0;
        var id = this.graph.vertices[i].id;
        if (id in connectedVertex)
        {
            degree = connectedVertex[id].length;
        }
        
        vertexDegree.push({index : i, degree : degree});
    }
    
    // sort
    vertexDegree.sort(
        function(a, b) {
            return (a.degree > b.degree) ? -1 : 
                   ((b.degree > a.degree) ? 1 : 0);
        });
    
    var vertexOrder = [];
    for (var i = 0; i < vertexDegree.length; i++)
    {
        vertexOrder.push(vertexDegree[i].index);
    }
    
    //console.log(vertexDegree);
    
    // Sorted by degree.
    listOfOrders.push(vertexOrder);
    
    var shuffleLitle = vertexOrder.slice();
    for (var i = 0; i < shuffleLitle.length - 1; i +=2)
    {
        var t = shuffleLitle[i];
        shuffleLitle[i] = shuffleLitle[i + 1];
        shuffleLitle[i + 1] = t;
    }
    
    // Swap near.
    listOfOrders.push(shuffleLitle);
    
    // shufl by half
    if (vertexDegree.length > 1)
    {
        var pivotElement = Math.round(vertexOrder.length / 2);
        var randomByPart = this.shuffleArray(vertexOrder.slice(0, pivotElement)).concat(this.shuffleArray(vertexOrder.slice(pivotElement)));
        listOfOrders.push(randomByPart);
        
        // add with random pivots
        for (var i = 0; i < Math.floor(Math.sqrt(this.graph.vertices.length)); i++)
        {
            var pivot = Math.floor(Math.random() * (vertexOrder.length - 2)) + 1;
            
            var randomByPart = this.shuffleArray(vertexOrder.slice(0, pivot)).concat(this.shuffleArray(vertexOrder.slice(pivot)));
            listOfOrders.push(randomByPart);
            //console.log(randomByPart);
        }
    }
}

Coloring.prototype.addForTree = function(listOfOrders, connectedVertex)
{
    var vertexDegree = [];
    var idToIndex = {};
    var idToDegree = {};
    for (var i = 0; i < this.graph.vertices.length; i++)
    {
        var degree = 0;
        var id = this.graph.vertices[i].id;
        if (id in connectedVertex)
        {
            degree = connectedVertex[id].length;
        }
        
        vertexDegree.push({index : i, degree : degree});
        idToIndex[id] = i;
        idToDegree[id] = degree;
    }
    
    // sort
    vertexDegree.sort(
        function(a, b) {
            return (a.degree > b.degree) ? -1 : 
                   ((b.degree > a.degree) ? 1 : 0);
        });
    
    var vertexDegreeOrder = [];
    for (var i = 0; i < vertexDegree.length; i++)
    {
        vertexDegreeOrder.push(vertexDegree[i].index);
    }
    
    {
        var wasAdded = {};
        var resSimple = [];

        //------ simple near ------
        for (var i = 0; i < vertexDegreeOrder.length; i++)
        {
            var vertex = this.graph.vertices[vertexDegreeOrder[i]].id;
            if (!(vertex in wasAdded))
            {
                wasAdded[vertex] = 1;
                resSimple.push(idToIndex[vertex]);

                var queue = [];
                queue.push(vertex);

                while (true)
                {
                     var needBreak = true;
                     for (var j = 0; j < queue.length; j++)
                     {
                        var vertexId = queue[j];
                        if (vertexId in connectedVertex)
                        {
                            for (var k = 0; k < connectedVertex[vertexId].length; k++)
                            {
                                if (!(connectedVertex[vertexId][k].id in wasAdded))
                                {
                                    var id = connectedVertex[vertexId][k].id;
                                    wasAdded[id] = 1;
                                    queue.push(id);
                                    resSimple.push(idToIndex[id]);
                                    needBreak = false;
                                }
                            }
                        }
                     }

                     if (needBreak)
                     {
                         break;
                     }
                }
            }
        }

        listOfOrders.push(resSimple);
    }
    //-------------------------------
    
    
    //------ simple near with max degree
    {
        var wasAdded = {};
        var resMaxDegree = [];
        for (var i = 0; i < vertexDegreeOrder.length; i++)
        {
            var vertex = this.graph.vertices[vertexDegreeOrder[i]].id;
            if (!(vertex in wasAdded))
            {
                wasAdded[vertex] = 1;
                resMaxDegree.push(idToIndex[vertex]);

                var queue = [];
                queue.push(vertex);

                while (true)
                {
                     var needBreak = true;
                     for (var j = 0; j < queue.length; j++)
                     {
                        var vertexId = queue[j];
                        if (vertexId in connectedVertex)
                        {
                            var maxDegree = -1;
                            var vertexMaxId  = -1;

                            for (var k = 0; k < connectedVertex[vertexId].length; k++)
                            {
                                if (!(connectedVertex[vertexId][k].id in wasAdded))
                                {
                                    var id = connectedVertex[vertexId][k].id;

                                    if (idToDegree[id] > maxDegree)
                                    {
                                        maxDegree = idToDegree[id];
                                        vertexMaxId = id;
                                    }
                                }
                            }

                            if (vertexMaxId >= 0)
                            {
                                wasAdded[vertexMaxId] = 1;
                                queue.push(vertexMaxId);
                                resMaxDegree.push(idToIndex[vertexMaxId]);
                                needBreak = false;
                            }
                        }
                     }

                     if (needBreak)
                     {
                         break;
                     }
                }
            }
        }

        listOfOrders.push(resMaxDegree);
    }
    //-------------------------------
}

Coloring.prototype.shuffleArray = function(a) 
{
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

Coloring.prototype.getObjectSelectedGroup = function(object)
{
    return (object.id in this.selectedObjects) ? this.selectedObjects[object.id] : 0;
}

Coloring.prototype.getPriority = function()
{
    return -9.0;
}

// Algorithm support multi graph
Coloring.prototype.IsSupportMultiGraph = function()
{
    return true;
}


// Factory for connected components.
function CreateColoring(graph, app)
{
    return new Coloring(graph)
}

// Gerister connected component.
RegisterAlgorithm (CreateColoring);
