/**
 * Graph class.
 *
 */

 
function Graph()
{
	// List of vertex.
	this.vertices = [];
	// List of arcs.
	this.edges   = [];
	// Unique Id of new graph.
	this.uidGraph = 0;
	// Unique Id of new edge.
	this.uidEdge = 10000;
	// Has direction edge.
	this.hasDirect = false;
    // Is graph multi
    this.isMultiGraph = false;
};

// infinity
Graph.prototype.infinity = 1E8;
// Max vertices
Graph.prototype.maxVertices = 1000;
// Offset for edges ids.
Graph.prototype.edgesOffset = 10000;

Graph.prototype.AddNewVertex = function(vertex)
{
	if (this.vertices.length <= this.maxVertices)
	{
		vertex.SetId (this.uidGraph);
		this.uidGraph = this.uidGraph + 1;
		this.vertices.push(vertex);
	}
	return this.vertices.length - 1;
}

Graph.prototype.ClearGraph = function() {
	// List of vertex.
	this.vertices = [];
	// List of arcs.
	this.edges   = [];
	// Unique Id of new graph.
	this.uidGraph = 0;
	// Unique Id of new edge.
	this.uidEdge = 10000;
	// Has direction edge.
	this.hasDirect = false;
    // Is graph multi
    this.isMultiGraph = false;
}

Graph.prototype.AddNewEdgeSafe = function(graph1, graph2, isDirect, weight, replaceIfExists = true)
{
	return this.AddNewEdge(new BaseEdge(graph1, graph2, isDirect, weight), replaceIfExists);
}

Graph.prototype.AddNewEdge = function(edge, replaceIfExists)
{
    edge.id = this.uidEdge;
    this.uidEdge = this.uidEdge + 1;
    
	var edge1      = this.FindEdgeAny(edge.vertex1.id, edge.vertex2.id);
	var edgeRevert = this.FindEdgeAny(edge.vertex2.id, edge.vertex1.id);
	if (!edge.isDirect)
	{
		if (edge1 != null && replaceIfExists)
			this.DeleteEdge(edge1);
		if (edgeRevert != null && replaceIfExists)
			this.DeleteEdge(edgeRevert);
        
		this.edges.push(edge);
	}
	else
	{
		if (edge1 != null && replaceIfExists)
			this.DeleteEdge(edge1);
		if (edgeRevert != null && !edgeRevert.isDirect && replaceIfExists)
			this.DeleteEdge(edgeRevert);
		
		this.edges.push(edge);
	}
    
    this.isMultiGraph = this.checkMutiGraph();
	
	return this.edges.length - 1;
}


Graph.prototype.DeleteEdge = function(edgeObject)
{
	var index = this.edges.indexOf(edgeObject);
	if (index > -1) 
	{
		this.edges.splice(index, 1);
	}
    
    this.isMultiGraph = this.checkMutiGraph();
}

Graph.prototype.DeleteVertex = function(vertexObject)
{
	var index = this.vertices.indexOf(vertexObject);
	if (index > -1) 
	{
 		for (var i = 0; i < this.edges.length; i++)
		{
			if (this.edges[i].vertex1 == vertexObject || this.edges[i].vertex2 == vertexObject)
			{
				this.DeleteEdge(this.edges[i]);
				i--;
			}
		}
		this.vertices.splice(index, 1);
	}
}

Graph.prototype.HasConnectedNodes = function(vertexObject)
{
	var res = false;

	var index = this.vertices.indexOf(vertexObject);
	if (index > -1) 
	{
 		for (var i = 0; i < this.edges.length; i++)
		{
			if (this.edges[i].vertex1 == vertexObject || this.edges[i].vertex2 == vertexObject)
			{
				res = true;
				break;
			}
		}
	}

	return res;
}

Graph.prototype.FindVertex = function(id)
{
	var res = null;
	for (var i = 0; i < this.vertices.length; i++)
	{
		if (this.vertices[i].id == id)
		{
			res = this.vertices[i];
			break;
		}
	}
	
	return res;
}

Graph.prototype.FindVertexByTitle = function(title)
{
	var res = null;
	for (var i = 0; i < this.vertices.length; i++)
	{
		if (this.vertices[i].mainText == title)
		{
			res = this.vertices[i];
			break;
		}
	}
	
	return res;
}

// deprecated
Graph.prototype.FindEdge = function(id1, id2)
{
	return this.FindEdgeAny(id1, id2);
}

Graph.prototype.FindEdgeById = function(edgeId)
{
    var res = null;
    for (var i = 0; i < this.edges.length; i++)
    {
        if (this.edges[i].id == edgeId)
        {
            res = this.edges[i];
            break;
        }
    }
	
    return res;
}

Graph.prototype.FindEdgeAny = function(id1, id2)
{
	var res = null;
	for (var i = 0; i < this.edges.length; i++)
	{
		if ((this.edges[i].vertex1.id == id1 && this.edges[i].vertex2.id == id2)
		     || (!this.edges[i].isDirect && this.edges[i].vertex1.id == id2 && this.edges[i].vertex2.id == id1))
		{
			res = this.edges[i];
			break;
		}
	}
	
	return res;
}

Graph.prototype.FindEdgeMin = function(id1, id2)
{
	var res       = null;
    var minWeight = this.infinity;
	for (var i = 0; i < this.edges.length; i++)
	{
        var edge = this.edges[i];
		if ((edge.vertex1.id == id1 && edge.vertex2.id == id2)
		     || (!edge.isDirect && edge.vertex1.id == id2 && edge.vertex2.id == id1))
		{
            if (edge.weight < minWeight)
            {
                res       = edge;
                minWeight = edge.weight;
            }
		}
	}
	
	return res;
}

Graph.prototype.FindEdgeMax = function(id1, id2)
{
	var res       = null;
    var maxWeight = 0;
	for (var i = 0; i < this.edges.length; i++)
	{
        var edge = this.edges[i];
		if ((edge.vertex1.id == id1 && edge.vertex2.id == id2)
		     || (!edge.isDirect && edge.vertex1.id == id2 && edge.vertex2.id == id1))
		{
            if (edge.weight > maxWeight)
            {
                res       = edge;
                maxWeight = edge.weight;
            }
		}
	}
	
	return res;
}

Graph.prototype.FindEdgeMinIgnoreDirection = function(id1, id2)
{
	var res       = null;
    var minWeight = this.infinity;
	for (var i = 0; i < this.edges.length; i++)
	{
        var edge = this.edges[i];
		if ((edge.vertex1.id == id1 && edge.vertex2.id == id2)
		     || (edge.vertex1.id == id2 && edge.vertex2.id == id1))
		{
            if (edge.weight < minWeight)
            {
                res       = edge;
                minWeight = edge.weight;
            }
		}
	}
	
	return res;
}

Graph.prototype.FindAllEdges = function(id1, id2)
{
	var res       = [];
	for (var i = 0; i < this.edges.length; i++)
	{
        var edge = this.edges[i];
		if ((edge.vertex1.id == id1 && edge.vertex2.id == id2)
		     || (!edge.isDirect && edge.vertex1.id == id2 && edge.vertex2.id == id1))
		{
			res.push(edge);
		}
	}
	
	return res;
}

Graph.prototype.GetAdjacencyMatrixStr = function ()
{
	var matrix = "";
	for (var i = 0; i < this.vertices.length; i++)
	{
		for (var j = 0; j < this.vertices.length; j++)
		{	
			var edge = this.FindEdgeMin (this.vertices[i].id, this.vertices[j].id);
			if (edge != null)
			{
				matrix += edge.weight;
			}
			else
			{
				matrix += "0";
			}
			
			if (j != this.vertices.length)
			{
				matrix += ", ";
			}
			
		}
		matrix = matrix + "\n";
	}
	
	return matrix;
}

Graph.prototype.GetAdjacencyMatrix = function ()
{
    var matrix = [];
    
    for (var i = 0; i < this.vertices.length; i ++)
    {
        matrix.push([]);
        var v1 = this.vertices[i];
        for (var j = 0; j < this.vertices.length; j ++)
        {
            var v2 = this.vertices[j];
            var edge = this.FindEdgeMin(v1.id, v2.id);
            if (edge != null)
            {
                matrix[i][j] = edge.GetWeight();
            }
            else
            {
                matrix[i][j] = this.infinity;               
            }
        }
    }
    
    return matrix;
}

Graph.prototype.TestAdjacencyMatrix = function (matrix, rowsObj, colsObj, separator)
{
    if(separator === undefined) 
    {
      separator = ",";
    }
    
	var bGoodFormat = true;
	rowsObj.rows = [];
	rowsObj.rows = matrix.split ("\n");
	for (j = 0; j < rowsObj.rows.length; ++j)
	{
		//rowsObj.rows[j] = rowsObj.rows[j].replace(/ /g,'');
		if (rowsObj.rows[j] === "")
		{
			rowsObj.rows.splice(j--, 1);
		}
	}
	
	colsObj.cols = [];
	for (var i = 0; i < rowsObj.rows.length; i++)
	{
		colsObj.cols[i] = this.SplitMatrixString(rowsObj.rows[i], separator);//rowsObj.rows[i].split (",");
		for (j = 0; j < colsObj.cols[i].length; ++j)
		{
			if (colsObj.cols[i][j] === "")
			{
				colsObj.cols[i].splice(j--, 1);
			}
		}
		if (colsObj.cols[i].length != rowsObj.rows.length)
		{
			bGoodFormat = false;
			break;
		}
	}

	return bGoodFormat;
}

Graph.prototype.TestPair = function (pair)
{
	let lines = pair.split ("\n");
	// Check:
	// a - b
	// a > b
    // a < b
	// a-(1)-b
	// a-(1)>b
	// a<(1)-b
	let regExp = [
		/^.+-.+$/g,
		/^.+\>.+$/g,
		/^.+<.+$/g,
		/^.+-\(\d+\.?\d+\)-.+$/g,
		/^.+-\(\d+\.?\d+\)\>.+$/g,
		/^.+<\(\d+\.?\d+\)\-.+$/g
	];
	let res = true;
	for (let i = 0; i < lines.length; ++i)
	{
		let resLine = false;
		let line = lines[i];
		if (line == "") {
			continue;
		}
		for (let j = 0; j < regExp.length; ++j) {
			if (line.match(regExp[j])) {
				resLine = true;
			}
		}
		res = resLine && res;
	}

	return res;
}


Graph.prototype.IsVerticesHaveSamePosition = function (position, vertexCount)
{
	var res = false;

	for (var j = 0; j < Math.min(this.vertices.length, vertexCount); j++)
	{
		if (position.distance(this.vertices[j].position) < this.vertices[j].model.diameter * 2)
		{
			res = true;
			break;
		}
	}

	return res;
}

Graph.prototype.GetRandomPosition = function (viewportSize) {
	return new Point(Math.random() * viewportSize.x, Math.random() * viewportSize.y);
}

Graph.prototype.GetRandomPositionOfVertex = function (matrix, vertexIndex, viewportSize)
{
	var point = new Point(0, 0);

	var relatedVertex = [];

	for (var j = 0; j < matrix.length; j++)
	{
		if (j < this.vertices.length && (cols[vertexIndex][j] > 0 || cols[j][vertexIndex] > 0) && j != vertexIndex)
		{
			relatedVertex.push(this.vertices[j]);
		}
	}


	var diameter = (new VertexModel()).diameter;

	if (relatedVertex.length > 1)
	{
		for (var j = 0; j < relatedVertex.length; j++)
		{
			point = point.add(relatedVertex[j].position);
		}

		point = point.multiply(1 / relatedVertex.length);

		point.offset (Math.random() * diameter + (Math.random() ? -1 : 1) * 2 * diameter, Math.random() * diameter + (Math.random() ? -1 : 1) * 2 * diameter);
	}
	else
	{
		point = new Point(Math.random() * viewportSize.x, Math.random() * viewportSize.y);
	}

	if (this.IsVerticesHaveSamePosition (point, matrix.length))
	{ 
		point.offset (Math.random() * diameter + + (Math.random() ? -1 : 1) * 4 * diameter, 
			Math.random() * diameter + + (Math.random() ? -1 : 1) * 4 * diameter);
	}

	// Clamp
	point.x = Math.min(Math.max(point.x, diameter), viewportSize.x);
	point.y = Math.min(Math.max(point.y, diameter), viewportSize.y);

	return point;
}

Graph.prototype.VerticesReposition = function (viewportSize, newVertices)
{
   var maxGravityDistanceSqr = Math.max(viewportSize.x, viewportSize.y) / 5.0;
   maxGravityDistanceSqr  = maxGravityDistanceSqr * maxGravityDistanceSqr;
   //Math.min(viewportSize.x, viewportSize.y) / 2.0;
   var velocityDamping    = 0.85;
   var diameter = (new VertexModel()).diameter;
   var maxDistance = diameter * 3;
   var gravityDistanceSqr =  10  * (maxDistance * maxDistance);
   var edgeGravityKof     =  10  / (maxDistance);
   var kCenterForce       =  10  / (maxDistance * 10);
   var centerPoint = viewportSize.multiply(0.5);
   var velocityMax = maxDistance * 10;
    
   var edgesMatrix = {};   
   for (var i = 0; i < this.edges.length; i++)
   {  
        edgesMatrix[this.edges[i].vertex1.id + this.edges[i].vertex2.id * 1000] = 1;
        edgesMatrix[this.edges[i].vertex2.id + this.edges[i].vertex1.id * 1000] = 1;
   }
   
   var startAngel = Math.random() * 180.0;
   for(i = 0; i < newVertices.length; i++) // loop through vertices
   {
      newVertices[i].position.orbit(new Point(viewportSize.x / 2, viewportSize.y / 2), (viewportSize.x - diameter * 2) / 2, 
					(viewportSize.y - diameter * 2) / 2, 360 * i / newVertices.length + startAngel);
   }
    
   var k = 0;
   var bChanged = true;
   while (k < 1000 && bChanged)
   {
      var vertexData = [];
      for(i = 0; i < newVertices.length; i++) // loop through vertices
      {
         // Has no in newVertices.
         var currentVertex = {};
         currentVertex.object    = newVertices[i];
         currentVertex.net_force = new Point (0, 0);
         currentVertex.velocity   = new Point (0, 0);
         vertexData.push(currentVertex);

         for(j = 0; j < this.vertices.length; j++) // loop through other vertices
         {
            otherVertex = this.vertices[j];
      
            if (otherVertex == currentVertex.object) continue;
             
            // squared distance between "u" and "v" in 2D space
            var rsq = currentVertex.object.position.distanceSqr(otherVertex.position);
            
            
            {
              // counting the repulsion between two vertices
              var force = (currentVertex.object.position.subtract(otherVertex.position)).normalize(gravityDistanceSqr / rsq);
              currentVertex.net_force = currentVertex.net_force.add(force);
            }
         }

         for(j = 0; j < this.vertices.length; j++) // loop through edges
         {
            otherVertex = this.vertices[j];
            if (edgesMatrix.hasOwnProperty(currentVertex.object.id + 1000 * otherVertex.id))
            {
                var distance = currentVertex.object.position.distance(otherVertex.position);
                
                if (distance > maxDistance)
                {
                    // counting the attraction
                    var force = (otherVertex.position.subtract(currentVertex.object.position)).normalize(edgeGravityKof * (distance - maxDistance));
                    currentVertex.net_force = currentVertex.net_force.add(force);
                }
            }
         }
          
         // Calculate force to center of world.
         var distanceToCenter = centerPoint.distance(currentVertex.object.position);
         var force = centerPoint.subtract(currentVertex.object.position).normalize(distanceToCenter * kCenterForce);
         currentVertex.net_force = currentVertex.net_force.add(force);
          
         // counting the velocity (with damping 0.85)
         currentVertex.velocity = currentVertex.velocity.add(currentVertex.net_force);
     }

     bChanged = false;

     for(i = 0; i < vertexData.length; i++) // set new positions
     {
        var v = vertexData[i];
        var velocity = v.velocity;
        if (velocity.length() > velocityMax)
        {
            velocity = velocity.normalize(velocityMax);
        }
        v.object.position = v.object.position.add(velocity);
        if (velocity.length() >= 1)
        {
		  bChanged = true;
        }
     }
     k++;
   }
    
    
   // Looks like something going wrong and will use circle algorithm for reposition.
   var bbox = this.getGraphBBox();
   if (bbox.size().length() > viewportSize.length() * 1000)
   {
       for(i = 0; i < newVertices.length; i++) // loop through vertices
       {
           newVertices[i].position.orbit(new Point(viewportSize.x / 2, viewportSize.y / 2), (viewportSize.x - diameter * 2) / 2,
                                         (viewportSize.y - diameter * 2) / 2, 360 * i / newVertices.length + startAngel);
       }
   }
   else
   {
       // Try to rotate graph to fill small area.
       var count = 10;
       var angle  = 360.0 / count;
       var viewportAspect = viewportSize.x / viewportSize.y;
       var bestIndex = 0;
       var graphSize  = bbox.size();
       var bestAspect = graphSize.x / graphSize.y;
       var center     = bbox.center();
       
       for (var i = 1; i < count; i++)
       {
           for(j = 0; j < newVertices.length; j++) // loop through vertices
           {
               newVertices[j].position.rotate(center, angle);
           }
           
           var newBBox   = this.getGraphBBox();
           var newAspect = newBBox.size().x / newBBox.size().y;
           if (Math.abs(newAspect - viewportAspect) < Math.abs(bestAspect - viewportAspect))
           {
               bestAspect = newAspect;
               bestIndex = i;
           }
       }
       
       // Rotate to best aspect.
       for(j = 0; j < newVertices.length; j++) // loop through vertices
       {
           newVertices[j].position.rotate(center, - angle * (count - bestIndex - 1));
       }
   }
}

Graph.prototype.SetAdjacencyMatrix = function (matrix, viewportSize, currentEnumVerticesType, separator)
{
    if (separator === undefined) 
    {
      separator = ",";
    }
    
	var rowsObj = {};
	var colsObj = {};

	//ViewportSize = viewportSize.subtract(new Point((new VertexModel()).diameter * 2, (new VertexModel()).diameter * 2));

	if (this.TestAdjacencyMatrix(matrix, rowsObj, colsObj, separator))
	{
		rows = rowsObj.rows;
		cols = colsObj.cols;
        
        var clonedEdge = this.edges.slice(0);
		for (var i = 0; i < clonedEdge.length; i++)
		{
			this.DeleteEdge (clonedEdge[i]);
		}
		
		var newVertices = [];
        var bWeightGraph = false;
        
		for (var i = 0; i < rows.length; i++)
		{
			for (var j = 0; j < rows.length; j++)
			{
				if (j >= this.vertices.length)
				{
					var newPos = this.GetRandomPositionOfVertex (matrix, j, viewportSize);
                    newVertices.push(new BaseVertex(newPos.x, newPos.y, currentEnumVerticesType));
					this.AddNewVertex(newVertices[newVertices.length - 1]);
				}
				
				if (cols[i][j] > 0)
				{
					var nEdgeIndex = this.AddNewEdgeSafe(this.vertices[i], this.vertices[j], cols[i][j] != cols[j][i], cols[i][j], true);
					this.FixEdgeCurve(nEdgeIndex);
                    if (nEdgeIndex >= 0)
                    {
                        bWeightGraph = bWeightGraph || this.edges[nEdgeIndex].weight != 1;
                    }
				}
			}
		}
        
        // Set use weight false, because we have unweighted graph.
        if (!bWeightGraph)
        {
            this.edges.forEach(function(part, index, theArray) {
                               theArray[index].useWeight = false;
                               });
        }

		for (var i = rows.length; i < Math.max(this.vertices.length, rows.length); i++)
		{
			this.DeleteVertex(this.vertices[i]);
			i--;
		}                        

        this.VerticesReposition(viewportSize, newVertices);
	}	
}

Graph.prototype.SetPair = function (pairs, viewportSize, currentEnumVerticesType)
{
	if (this.TestPair(pairs))
	{
		this.ClearGraph();
		
		let lines = pairs.split ("\n");
		// Extract:
		// a - b
		// a > b
		// a < b
		// a-(1)-b
		// a-(1)>b
		// a<(1)-b
		let regExp = [
			/^(.+)-(.+)$/g,
			/^(.+)\>(.+)$/g,
			/^(.+)<(.+)$/g,
			/^(.+)-\((\d+|\d+\.?\d+)\)-(.+)$/g,
			/^(.+)-\((\d+|\d+\.?\d+)\)\>(.+)$/g,
			/^(.+)<\((\d+|\d+\.?\d+)\)\-(.+)$/g,
		];

		let bWeightGraph = false;
		var newVertices = [];

		for (var i = 0; i < lines.length; i++)
		{
			let line = lines[i];
			if (line == "") {
				continue;
			}

			for (let j = regExp.length - 1; j >= 0; --j) {
				if (!line.match(regExp[j])) {
					continue;
				}

				let groupes = Array.from(line.matchAll(regExp[j]));
				let groupe  = groupes[0];
				let vetext1Title = groupe[1];
				let vertex1 = this.FindVertexByTitle(vetext1Title);
				if (vertex1 == null) {
					let newPosition = this.GetRandomPosition(viewportSize);
					vertex1 = this.vertices[this.AddNewVertex(new BaseVertex(newPosition.x, newPosition.y, currentEnumVerticesType))];
					vertex1.mainText = vetext1Title;
					newVertices.push(vertex1);
				}
				let vetext2Title = groupe[j <= 2 ? 2 : 3];
				let vertex2 = this.FindVertexByTitle(vetext2Title);
				if (vertex2 == null) {
					let newPosition = this.GetRandomPosition(viewportSize);
					vertex2 = this.vertices[this.AddNewVertex(new BaseVertex(newPosition.x, newPosition.y, currentEnumVerticesType))];
					vertex2.mainText = vetext2Title;
					newVertices.push(vertex2);
				}
				let isDirect = j == 1 || j == 2 ||  j == 4 || j == 5;
				let weight = 1;
				if (j > 2) {
					weight = groupe[2];
					bWeightGraph = true;
				}
				let isRevertEdge = j == 2 || j == 5;

				let nEdgeIndex = this.AddNewEdgeSafe(isRevertEdge ? vertex2 : vertex1, isRevertEdge ? vertex1 : vertex2, isDirect, weight, false);
				this.FixEdgeCurve(nEdgeIndex);
				break;
			}
		}
		
        // Set use weight false, because we have unweighted graph.
        if (!bWeightGraph)
        {
            this.edges.forEach(function(part, index, theArray) {
                               theArray[index].useWeight = false;
                               });
        }
		
		this.VerticesReposition(viewportSize, newVertices);
	}	
}


Graph.prototype.TestIncidenceMatrix = function (matrix, rowsObj, colsObj, separator)
{
    if (separator === undefined) 
    {
      separator = ",";
    }
    
	var bGoodFormat = true;
	rowsObj.rows = [];
	rowsObj.rows = matrix.split ("\n");
	for (j = 0; j < rowsObj.rows.length; ++j)
	{
		if (rowsObj.rows[j] === "")
		{
			rowsObj.rows.splice(j--, 1);
		}
	}
	colsObj.cols = [];
	var columnCount = 0;
	for (var i = 0; i < rowsObj.rows.length; i++)
	{
		colsObj.cols[i] = this.SplitMatrixString(rowsObj.rows[i], separator);//rowsObj.rows[i].split (",");
		for (j = 0; j < colsObj.cols[i].length; ++j)
		{
			if (colsObj.cols[i][j] === "")
			{
				colsObj.cols[i].splice(j--, 1);
			}
		}
		if (i == 0)
		{
			columnCount = colsObj.cols[i].length;
		}
		if (colsObj.cols[i].length != columnCount)
		{
			bGoodFormat = false;
			break;
		}
	}


	if (bGoodFormat)
	{
		for (var i = 0; i < colsObj.cols[0].length; i++)
		{
			var values = [];
			for (j = 0; j < colsObj.cols.length; ++j)
			{
				if (colsObj.cols[j][i] != 0)
				{
					values.push(colsObj.cols[j][i]);
				}
			}

			if (!(values.length <= 1 ||  (values.length == 2 && (values[0] == values[1] || values[0] == -values[1]))))
			{
				bGoodFormat = false;
				break;
			}
		}
	}

	return bGoodFormat;
}

Graph.prototype.SetIncidenceMatrix = function (matrix, viewportSize, currentEnumVerticesType)
{
	var rowsObj = {};
	var colsObj = {};

	//ViewportSize = viewportSize.subtract(new Point((new VertexModel()).diameter * 2, (new VertexModel()).diameter * 2));
	if (this.TestIncidenceMatrix(matrix, rowsObj, colsObj))
	{
		rows = rowsObj.rows;
		cols = colsObj.cols;
        var clonedEdge = this.edges.slice(0);
		for (var i = 0; i < clonedEdge.length; i++)
		{
			this.DeleteEdge (clonedEdge[i]);
		}
		var newVertices = [];
        var bWeightGraph = false;
		for (var i = 0; i < cols[0].length; i++)
		{
			var edgeValue = [];
			var edgeIndex = [];
			for (var j = 0; j < cols.length; j++)
			{
				if (j >= this.vertices.length)
				{

					var newPos = new Point(0, 0);//this.GetRandomPositionOfVertex (matrix, j, viewportSize);
                    newVertices.push(new BaseVertex(newPos.x, newPos.y, currentEnumVerticesType));
					this.AddNewVertex(newVertices[newVertices.length - 1]);
				}				

				if (cols[j][i] != 0)
				{
				  edgeValue.push(cols[j][i]);
				  edgeIndex.push(j);
				}
			}

			if (edgeIndex.length == 1)
			{
				edgeValue.push(edgeValue[0]);
				edgeIndex.push(edgeIndex[0]);
			}

			if (edgeIndex.length == 2)
			{       
				if (edgeValue[0] != edgeValue[1])
				{
					if (edgeValue[1] > 0)
					{
						edgeValue = edgeValue.swap(0, 1);
						edgeIndex = edgeIndex.swap(0, 1);
                	}
				}
                
                var nEdgeIndex = this.AddNewEdgeSafe(this.vertices[edgeIndex[0]], this.vertices[edgeIndex[1]],
                                                     edgeValue[0] != edgeValue[1], Math.abs(edgeValue[1]), false);

                this.FixEdgeCurve(nEdgeIndex);
                if (nEdgeIndex >= 0)
                {
                    bWeightGraph = bWeightGraph || this.edges[nEdgeIndex].weight != 1;
                }
			}
		}
        
        // Set use weight false, because we have unweighted graph.
        if (!bWeightGraph)
        {
            this.edges.forEach(function(part, index, theArray) {
                               theArray[index].useWeight = false;
                               });
        }

		for (var i = cols.length; i < Math.max(this.vertices.length, cols.length); i++)
		{
			this.DeleteVertex(this.vertices[i]);
			i--;             
		}                        

          	this.VerticesReposition(viewportSize, newVertices);
	}	
}

Graph.prototype.GetIncidenceMatrix = function ()
{
	var matrix = "";
	for (var i = 0; i < this.vertices.length; i++)
	{
		for (var j = 0; j < this.edges.length; j++)
		{	
			if (this.edges[j].vertex1 == this.vertices[i])
			{
				matrix += this.edges[j].weight;
			}
			else if (this.edges[j].vertex2 == this.vertices[i] && !this.edges[j].isDirect)
			{
				matrix += this.edges[j].weight;
			}
			else if (this.edges[j].vertex2 == this.vertices[i] && this.edges[j].isDirect)
			{
				matrix += -this.edges[j].weight;
			}
			else
			{
				matrix += "0";
			}
			
			if (j != this.edges.length - 1)
			{
				matrix += ", ";
			}
			
		}
		matrix = matrix + "\n";
	}
	
	return matrix;
}

Graph.prototype.SplitMatrixString = function (line, separator)
{
  if (separator === undefined) 
  {
    separator = ",";
  }
    
  var res = [];
  var i = 0;

  // For case: 00110101101
  var isZeroOneLine = true;

  for (i = 0; i < line.length; i++)
  {
    if (line.charAt(i) != '0' && line.charAt(i) != '1')
    {
      isZeroOneLine = false;
      break;
    }
  } 

  if (!isZeroOneLine)
  {
    if (separator != ",")
    {
        line = line.replace(/,/g, ".");
    }
    for (i = 0; i < line.length; i++)
    {
      // add , if we use space as separator
      if (("0123456789.-e").indexOf(line.charAt(i)) < 0 )
      {
        if (i > 0)
        { 
          res.push(line.substr(0, i));
        }
        if (i == 0) 
        {
          i = 1;
        }
        line = line.substr(i, line.length - i);
        i = -1;
      }
    }
    if (line.length > 0)
    {
      res.push(line);
    }
  }
  else
  {
    for (i = 0; i < line.length; i++)
    {
      res.push(line.charAt(i));
    }
  }

  console.log(res);
  return res;
}


Graph.prototype.SaveToXML = function (additionalData)
{
	var mainHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><graphml>";
	var header   = "<graph id=\"Graph\" uidGraph=\"" + this.uidGraph + "\"" + " uidEdge=\"" + this.uidEdge + "\">";

	var xmlBody = "";
	  
	for (var i = 0; i < this.vertices.length; i++)
	{
		xmlBody = xmlBody + this.vertices[i].SaveToXML();
	}

	xmlBody = xmlBody + "";

	for (var i = 0; i < this.edges.length; i++)
	{
		xmlBody = xmlBody + this.edges[i].SaveToXML();
	}

	xmlBody = xmlBody + "";
    
    additionalField = "";
    if (additionalData.length > 0)
    {
        additionalField = "<additional data=\"" + additionalData + "\"/>"
    }

	return mainHeader + header + xmlBody + "</graph>" + additionalField + "</graphml>";
}

Graph.prototype.LoadFromXML = function (xmlText, additionalData)
{
	xmlDoc = $.parseXML( xmlText );
	var $xml = $( xmlDoc );

	$graphs = $xml.find( "graph" );	

	var loadedGraphId = 0;
	var loadedEdgeId = 0;
    
	$graphs.each(function(){
		loadedGraphId = parseInt($(this).attr('uidGraph'));
		loadedEdgeId  = parseInt($(this).attr('uidEdge'));
	});
    
    // Backward compatibility
    if (isNaN(loadedEdgeId))
    {
        loadedEdgeId = this.edgesOffset;
    } else if (loadedEdgeId < this.edgesOffset)
	{
		loadedEdgeId = this.edgesOffset;
	}

	this.uidGraph = loadedGraphId;
	this.uidEdge  = loadedEdgeId;

	$nodes = $xml.find( "node" );	

	var vertices = [];
    
	$nodes.each(function(){
		var vertex = new BaseVertex();
		vertex.LoadFromXML($(this));
        vertices.push(vertex);
	});
	this.vertices = vertices;

	$edges = $xml.find( "edge" );

	var edges = [];	
	var graph = this;
	$edges.each(function(){
		var edge = new BaseEdge();
		edge.LoadFromXML($(this), graph);
		// Fix case with wrong id.
		if (edge.id < graph.uidEdge) {
			edge.id = graph.uidEdge;
			graph.uidEdge++;
		}
		edges.push(edge);
	});

	this.edges = edges;
    
    $additional = $xml.find( "additional" );
    if ($additional.length != 0 && additionalData != null)
    {
        additionalData["data"] = $additional.attr('data');
    }
    
    this.isMultiGraph = this.checkMutiGraph();
}

Graph.prototype.hasDirectEdge = function ()
{
	var res = false;
	for (var i = 0; i < this.edges.length; i++)
	{
		if(this.edges[i].isDirect)
		{
			res = true;
			break;
		}
	}
	
	return res;
}

Graph.prototype.hasUndirectEdge = function ()
{
	var res = false;
	for (var i = 0; i < this.edges.length; i++)
	{
		if(!this.edges[i].isDirect)
		{
			res = true;
			break;
		}
	}
	
	return res;
}

Graph.prototype.hasEdges = function ()
{
	return this.edges.length > 0;
}

Graph.prototype.clampPositions = function (viewportSize)
{
	var diameter = (new VertexModel()).diameter;

     	for(i = 0; i < this.vertices.length; i++) // set new positions
     	{
       		this.vertices[i].position.x = Math.min(Math.max(this.vertices[i].position.x, diameter), viewportSize.x - diameter);
        	this.vertices[i].position.y = Math.min(Math.max(this.vertices[i].position.y, diameter), viewportSize.y - diameter);
        }
}

// Use to setup scaling.
Graph.prototype.getGraphBBox = function (viewportSize)
{
    var pointMin = new Point(1e5, 1e5);
    var pointMax = new Point(-1e5, -1e5);
    var diameter = (new VertexModel()).diameter;
    
    for(i = 0; i < this.vertices.length; i++)
    {
        var vertex = this.vertices[i];
		var factor = vertex.diameterFactor();
        var deltaVector = new Point(factor.x * diameter, factor.y * diameter);
        pointMin = pointMin.min(vertex.position.subtract(deltaVector));
        pointMax = pointMax.max(vertex.position.add(deltaVector));
    }
    
    var max_curve_length = 32;
    
    for(i = 0; i < this.edges.length; i++)
    {
        var edge = this.edges[i];
        
        if (edge.model.type == EdgeModels.curve)
        {
            var max_curve = edge.vertex2.position.subtract(edge.vertex1.position).length() / max_curve_length;
            
            for (j = 0; j < max_curve; j++)
            {
              var point = edge.model.GetCurvePoint(edge.vertex1.position, edge.vertex2.position, j / max_curve);
              var deltaVector = new Point(max_curve_length, max_curve_length);
              pointMin = pointMin.min(point.subtract(deltaVector));
              pointMax = pointMax.max(point.add(deltaVector));
            }
        }
    }
    
    return new Rect(pointMin, pointMax);
}

Graph.prototype.hasPair = function (edge)
{
	return this.FindPairFor(edge) != null;
}

Graph.prototype.FindPairFor = function (edge)
{
    var res = this.getNeighborEdges(edge);
	
	return res.length == 1 ? res[0] : null;
}

Graph.prototype.getNeighborEdges = function (edge)
{
	var res = [];
    
	for (var i = 0; i < this.edges.length; i++)
	{
        var curEdge = this.edges[i];
        if (curEdge == edge)
            continue;
            
		if ((curEdge.vertex1.id == edge.vertex1.id  && 
             curEdge.vertex2.id == edge.vertex2.id) ||
            (curEdge.vertex1.id == edge.vertex2.id  && 
             curEdge.vertex2.id == edge.vertex1.id))
		{
			res.push(curEdge);
		}
	}
	
	return res;
}

Graph.prototype.checkMutiGraph = function ()
{
	var res = false;
    
    var start  = {};
    
	for (var i = 0; i < this.edges.length; i++)
	{
        var edge = this.edges[i];
        if (start.hasOwnProperty(edge.vertex1.id) && 
            start[edge.vertex1.id] == edge.vertex2.id)
        {
            res = true;
            break;
        }
        
        start[edge.vertex1.id] = edge.vertex2.id;
        if (!edge.isDirect)
        {
            if (start.hasOwnProperty(edge.vertex2.id) && 
                start[edge.vertex2.id] == edge.vertex1.id)
            {
                res = true;
                break;
            }
            
            start[edge.vertex2.id] = edge.vertex1.id;
        }
	}
	
	return res;
}

Graph.prototype.isMulti = function ()
{
	return this.isMultiGraph;
}

Graph.prototype.isNeedReposition = function ()
{
    var res = false;
	for (var i = 0; i < this.vertices.length; i++)
	{
		res = res || this.vertices[i].IsUndefinedPosition();
	}
    return res;
}

Graph.prototype.FixEdgeCurve = function (edgeIndex)
{
    var edgeObject = this.edges[edgeIndex];
    var hasPair    = this.hasPair(edgeObject);
    var neighborEdges = this.getNeighborEdges(edgeObject);
    
    if (hasPair)
    {
        if (edgeObject.model.default)
            edgeObject.model.type = EdgeModels.curve; 
        
        var pairEdge = this.FindPairFor(edgeObject);
        if (pairEdge.model.default)
        {
            pairEdge.model.type = EdgeModels.curve;
            if (pairEdge.vertex1 == edgeObject.vertex1 && pairEdge.vertex2 == edgeObject.vertex2)
                pairEdge.model.curveValue = -pairEdge.model.curveValue;
        }
    }
    else if (neighborEdges.length >= 2)
    {
        var curve = this.GetAvailableCurveValue(neighborEdges, edgeObject);
        if (edgeObject.model.default)
        {
            edgeObject.model.type        = EdgeModels.curve;
            edgeObject.model.curveValue = curve;
        }
    }
}

Graph.prototype.GetAvailableCurveValue = function(neighborEdges, originalEdge)
{
    var values = [];
    
    for (var i = 0; i < neighborEdges.length; i ++)
    {
      var edge          = neighborEdges[i];
      var sameDirection = (originalEdge.vertex1.id == edge.vertex1.id);
      if (edge.model.type == EdgeModels.curve)
      {
        values[(sameDirection ? edge.model.curveValue : -edge.model.curveValue)] = true;
      }
    }
    
    var changeValue  = DefaultHandler.prototype.curveValue;
    var defaultValue = 0.0;
    var maxSearch    = 10;
    
    for (var i = 1; i < maxSearch; i ++)
    {
        value = i * changeValue;
        if (!values.hasOwnProperty(value))
            return value;

        value = - i * changeValue;
        if (!values.hasOwnProperty(value))
            return value;
    }
    
    return defaultValue;
}

Graph.prototype.reverseAllEdges = function ()
{
	for (var i = 0; i < this.edges.length; i++)
	{
		if(this.edges[i].isDirect)
		{
			let v1 = this.edges[i].vertex1;
			this.edges[i].vertex1 = this.edges[i].vertex2;
			this.edges[i].vertex2 = v1;
		}
	}

	this.isMultiGraph = this.checkMutiGraph();
}

Graph.prototype.makeAllEdgesDirected = function ()
{
	for (var i = 0; i < this.edges.length; i++)
	{
		if(!this.edges[i].isDirect)
		{
			this.edges[i].isDirect = true;
		}
	}

	this.isMultiGraph = this.checkMutiGraph();
}

Graph.prototype.makeAllEdgesUndirected = function ()
{
	for (var i = 0; i < this.edges.length; i++)
	{
		if(this.edges[i].isDirect)
		{
			this.edges[i].isDirect = false;
		}
	}

	this.isMultiGraph = this.checkMutiGraph();
}
