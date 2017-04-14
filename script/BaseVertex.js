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
};

BaseVertex.prototype.position = new Point(0, 0);
BaseVertex.prototype.model    = new VertexModel();

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
    this.position = new Point(parseFloat(xml.attr('positionX')), parseFloat(xml.attr('positionY')));
    this.id       = parseInt(xml.attr('id'));
    this.mainText = xml.attr('mainText');
    this.upText   = xml.attr('upText');
}

BaseVertex.prototype.SetId = function (id)
{
    this.id       = id;
    this.mainText = this.vertexEnumType.GetVertexText(id);		                 
}

BaseVertex.prototype.diameterFactor = function ()
{
    return 1.0 + (this.mainText.length ? this.mainText.length / 8.0 : 0);
}
