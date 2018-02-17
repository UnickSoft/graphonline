/**
 * Algorithm for reorder graph.
 *
 */
function RadiusAndDiameter(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
    this.diameter = 0;
    this.radius   = 0;
    this.diameterSelectedObjects = [];
    this.radiusSelectedObjects = [];
    this.centerVertexes = [];
    this.peripheralVertexes = [];
    this.isNotConnected = false;  
    this.isOneVertex = false;  
}


// inheritance.
RadiusAndDiameter.prototype = Object.create(BaseAlgorithm.prototype);


RadiusAndDiameter.prototype.getName = function(local)
{
    return local == "ru" ? "Поиск радиуса и диаметра графа": "Search graph radius and diameter";
}

RadiusAndDiameter.prototype.getId = function()
{
    return "OlegSh.RadiusAndDiameter";
}

// @return message for user.
RadiusAndDiameter.prototype.getMessage = function(local)
{
    if (this.isNotConnected)
    {
        return (local == "ru" ? "Граф не является связным" : "Graph is disconnected");
    }
    
    if (this.isOneVertex)
    {
        return (local == "ru" ? "Граф содержит только одну вершину" : "Graph contains only one vertex");
    }
    
    var text = (local == "ru" ? "Радуис граф: " : "Graph radius: ") + this.radius;
    
    text = text + " (";
    for (i = 0; i < this.radiusSelectedObjects.length; i++)
    {
        if (this.radiusSelectedObjects[i] instanceof BaseVertex)
        {
            text = text + this.radiusSelectedObjects[i].mainText + ((i < this.radiusSelectedObjects.length - 1) ? "&rArr;" : "");   
        }
    }
    text = text + ").";
         
    text = text + (local == "ru" ? " Диаметр граф: " : "Graph diameter: ") + this.diameter;
    
    text = text + " (";
    for (i = 0; i < this.diameterSelectedObjects.length; i++)
    {
        if (this.diameterSelectedObjects[i] instanceof BaseVertex)
        {
            text = text + this.diameterSelectedObjects[i].mainText + ((i < this.diameterSelectedObjects.length - 1) ? "&rArr;" : "");   
        }
    }
    text = text + ").";
    
    return text;
}

RadiusAndDiameter.prototype.result = function(resultCallback)
{
    var result = {};
    result["version"] = 1;
    
    if (this.graph.vertices.length == 1)
    {
        this.isOneVertex = true;
        return;
    }
    
    var connectedComponents = new FindConnectedComponentNew(this.graph, this.app);
    var connectedComponentNumber = connectedComponents.calculate();
    if (connectedComponentNumber == 1)
    {
        var floid = new FloidAlgorithm(this.graph, this.app);
        var matrix = floid.resultMatrix();
        this.diameter = -1;
        var diameterStart  = 0;
        var diameterFinish = 0;

        this.radius = 1E10;
        var radiusStart  = 0;
        var radiusFinish = 0;

        var eccentricity = [];

        for (var i = 0; i < matrix.length; i++)
        {
            var vertex = -1;//(i == 0 ? 1 : 0);
            var vertexEccentricity = -1;//matrix[i][vertex];

            for (var j = 0; j < matrix[i].length; j++)
            {
                if (vertexEccentricity < matrix[i][j] && i != j && matrix[i][j] != floid.infinity)
                {
                    vertexEccentricity = matrix[i][j];
                    vertex = j;       
                }
            }

            var res = {value: vertexEccentricity, vertex: vertex};
            eccentricity.push(res);
        }

        for (var i = 0; i < eccentricity.length; i++)
        {
            var vertexEccentricity = eccentricity[i].value;
            if (vertexEccentricity < 0)
            {
                    continue;
            }

            if (this.radius > vertexEccentricity)
            {
                this.radius = vertexEccentricity;
                radiusStart  = i;
                radiusFinish = eccentricity[i].vertex;
            }

            if (this.diameter < vertexEccentricity)
            {
                this.diameter  = vertexEccentricity;
                diameterStart  = i;
                diameterFinish = eccentricity[i].vertex;
            }
        }

        for (var i = 0; i < eccentricity.length; i++)
        {
            var vertexEccentricity = eccentricity[i].value;
            if (vertexEccentricity < 0)
            {
                    continue;
            }

            if (eccentricity[i].value == this.radius)
            {
                this.centerVertexes.push(this.graph.vertices[i].id);
                this.graph.vertices[i].upText = (g_language == "ru" ? "Центральная" : "Central");
            }
            if (eccentricity[i].value == this.diameter)
            {
                this.peripheralVertexes.push(this.graph.vertices[i].id);
                this.graph.vertices[i].upText = (g_language == "ru" ? "Периферийная" : "Peripheral");
            }
        }

        this.diameterSelectedObjects = this.getPathByMatrix(this.graph.GetAdjacencyMatrix(), matrix,    diameterStart, diameterFinish, this.diameter);

        this.radiusSelectedObjects = this.getPathByMatrix(this.graph.GetAdjacencyMatrix(), matrix,    radiusStart, radiusFinish, this.radius);

    }
    else
    {
        this.isNotConnected = true;    
    }

    
    return result;
}

RadiusAndDiameter.prototype.getPathByMatrix = function(adjacencyMatrix, minPathMatrix, startNode, finishNode, length)
{
    var res = [];
    vertices = this.graph.vertices;
    while (length != adjacencyMatrix[startNode][finishNode])
    {
        for (var i = 0; i < adjacencyMatrix.length; i ++)
        {
            if (minPathMatrix[i][finishNode] == length - adjacencyMatrix[startNode][i] && i != startNode)
            {
                res.push(vertices[startNode]);
                res.push(this.graph.FindEdge(vertices[startNode].id, vertices[i].id));
                
                length -= adjacencyMatrix[startNode][i];
                startNode = i;
                break;
            }
        }
    }
    
    res.push(vertices[startNode]);
    res.push(this.graph.FindEdge(vertices[startNode].id, vertices[finishNode].id));
    res.push(vertices[finishNode]);
    
    return res;
}

RadiusAndDiameter.prototype.getObjectSelectedGroup = function(object)
{
    var res = (this.diameterSelectedObjects.includes(object)) ? 1 : 0;
    res = (this.radiusSelectedObjects.includes(object)) ? 2 : res;
    //res = (this.centerVertexes.includes(object.id)) ? 3 : res;
    //res = (this.peripheralVertexes.includes(object.id)) ? 4 : res;
    
    
    return res;
}

RadiusAndDiameter.prototype.getPriority = function()
{
    return -8.5;
}

// Factory for connected components.
function CreateAlgorithmRadiusAndDiameter(graph, app)
{
    return new RadiusAndDiameter(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateAlgorithmRadiusAndDiameter);
