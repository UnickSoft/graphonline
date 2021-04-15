/**
 * Base node class.
 *
 */

 
function BaseVertex(x, y, vertexEnumType)
{
    this.position = new Point(x, y);
    this.id       = 0;
    this.mainText = "";
    this.upText   = "";
    this.vertexEnumType = vertexEnumType;
    this.model    = new VertexModel();
    this.hasUndefinedPosition = false;
};

BaseVertex.prototype.position = new Point(0, 0);

BaseVertex.prototype.copyFrom = function (other)
{
    this.position = new Point(other.position.x, other.position.y);
    this.id       = other.id;
    this.mainText = other.mainText;
    this.upText   = other.upText;
    this.vertexEnumType = other.vertexEnumType;
    this.model    = new VertexModel();
    this.hasUndefinedPosition = other.hasUndefinedPosition;
}

BaseVertex.prototype.SaveToXML = function ()
{
	return "<node " + 
	       "positionX=\""  + this.position.x   + "\" " +
	       "positionY=\""  + this.position.y   + "\" " +
	       "id=\""         + this.id   + "\" " +
	       "mainText=\""   + gEncodeToHTML(this.mainText) + "\" " +
	       "upText=\""     + gEncodeToHTML(this.upText)   + "\" " +
		"></node>";       
		                 
}

BaseVertex.prototype.LoadFromXML = function (xml)
{
    var xmlX = xml.attr('positionX');
    var xmlY = xml.attr('positionY');
    this.hasUndefinedPosition = (typeof xmlX === 'undefined') || (typeof xmlY === 'undefined');
    this.position = new Point(parseFloat(xmlX), parseFloat(xmlY));
    this.id       = xml.attr('id');
    this.mainText = xml.attr('mainText');
    this.upText   = xml.attr('upText');
    
    if (typeof this.mainText === 'undefined')
      this.mainText = this.id;
    else
      this.mainText = gDecodeFromHTML(this.mainText);
    
    if (typeof this.upText === 'undefined')
      this.upText = "";
    else
      this.upText = gDecodeFromHTML(this.upText);
}

BaseVertex.prototype.SetId = function (id)
{
    this.id       = id;
    if (this.vertexEnumType != null)
      this.mainText = this.vertexEnumType.GetVertexText(id);		                 
}

BaseVertex.prototype.diameterFactor = function ()
{
    return 1.0 + (this.mainText.length ? this.mainText.length / 8.0 : 0);
}

BaseVertex.prototype.IsUndefinedPosition = function ()
{
    return this.hasUndefinedPosition;
}

BaseVertex.prototype.HitTest = function (pos)
{
  var shape = this.hasOwnProperty('currentStyle') ? this.currentStyle.GetStyle({}).shape : VertexCircleShape;
  var width = this.hasOwnProperty('currentStyle') ? this.currentStyle.GetStyle({}).lineWidth : 0;
  
  if (shape == VertexCircleShape)
  {
  	return this.position.distance(pos) < this.model.diameter / 2.0 + width;
  }
  else if (shape == VertexSquareShape || shape == VertexTriangleShape)
  {
    var relativPos  = (new Point(pos.x, pos.y)).subtract(this.position);
    var lineFinish1 = relativPos.add(new Point(1000, 0));
    var lineFinish2 = relativPos.add(new Point(-1000, 0));

    var pointsVertex1 = shape == VertexSquareShape ? GetSquarePoints(this.model.diameter + width) : GetTrianglePoints(this.model.diameter + width);
    pointsVertex1.push(pointsVertex1[0]);

    var hitNumber1 = 0;
    var hitNumber2 = 0;

    console.log("Points");
    for (var i = 0; i < pointsVertex1.length - 1; i ++)
    {
        console.log(pointsVertex1[i] + " " + pointsVertex1[i + 1]);
        var hitTest = Point.hitTest(relativPos, lineFinish1, pointsVertex1[i], pointsVertex1[i + 1]);
        if (hitTest != null)
        {
          hitNumber1++;
        }
        hitTest = Point.hitTest(relativPos, lineFinish2, pointsVertex1[i], pointsVertex1[i + 1]);
        if (hitTest != null)
        {
          hitNumber2++;
        }
    }

    return hitNumber1 == 1 && hitNumber2 == 1;
  }

  return false;
}