/**
 * Algorithm for reorder graph.
 *
 */
function GraphReorder(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
    if (graph != null)
    {
        this.edges = graph.edges;
        this.vertices = graph.vertices;
    }
}


// inheritance.
GraphReorder.prototype = Object.create(BaseAlgorithm.prototype);


GraphReorder.prototype.getName = function(local)
{
    return g_GraphReorder; //local == "ru" ? "Упорядочить граф" : "Arrange the graph";
}

GraphReorder.prototype.getId = function()
{
    return "OlegSh.GraphReorder";
}

// @return message for user.
GraphReorder.prototype.getMessage = function(local)
{
    return g_done;
}

GraphReorder.prototype.result = function(resultCallback)
{
    var result = {};
    result["version"] = 1;
    
    if (this.vertices.length == 0)
    {
        return result;
    }
    
    var velocityDamping    = 0.85;
    var diameter = (new VertexModel()).diameter;
    var maxDistance = diameter * 3;
    var gravityDistanceSqr =  10  * (maxDistance * maxDistance);
    var edgeGravityKof     =  10  / (maxDistance);
    var kCenterForce       =  10  / (maxDistance * 10);
    //var centerPoint = viewportSize.multiply(0.5);
    var velocityMax = maxDistance * 10;
    
    var centerPoint = new Point();
    for(i = 0; i < this.vertices.length; i++) // loop through vertices
    {
        centerPoint.add(this.vertices[i].position);
    }
    centerPoint.multiply(1.0 / this.vertices.length);

    var edgesMatrix = {};   
    for (var i = 0; i < this.edges.length; i++)
    {  
        edgesMatrix[this.edges[i].vertex1.id + this.edges[i].vertex2.id * 1000] = 1;
        edgesMatrix[this.edges[i].vertex2.id + this.edges[i].vertex1.id * 1000] = 1;
    }

    var k = 0;
    var bChanged = true;
    while (k < 1000 && bChanged)
    {
      var vertexData = [];
      for(i = 0; i < this.vertices.length; i++) // loop through vertices
      {
         // Has no in newVertices.
         var currentVertex = {};
         currentVertex.object    = this.vertices[i];
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
                    // countin the attraction
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


    this.app.OnAutoAdjustViewport();
    this.app.SetHandlerMode("default");
    // Looks like somthing going wrong and will use circle algorithm for reposition.
    //var bbox = this.getGraphBBox();

    return result;
}

GraphReorder.prototype.getObjectSelectedGroup = function(object)
{
    return 0;
}

GraphReorder.prototype.getPriority = function()
{
    return -8.5;
}

// Algorithm support multi graph
GraphReorder.prototype.IsSupportMultiGraph = function()
{
    return true;
}

// Factory for connected components.
function CreateAlgorithmGraphReorder(graph, app)
{
    return new GraphReorder(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateAlgorithmGraphReorder);
