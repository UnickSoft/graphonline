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
	       "mainText=\""   + this.mainText + "\" " +
	       "upText=\""     + this.upText   + "\" " +
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
    if (typeof this.upText === 'undefined')
      this.upText = "";
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
