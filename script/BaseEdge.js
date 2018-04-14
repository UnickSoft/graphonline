/**
 * This is base arc.
 *
 *
 */

function BaseEdge(vertex1, vertex2, isDirect, weight, useWeight)
{
    this.vertex1    = vertex1;
    this.vertex2    = vertex2;
    this.isDirect  = isDirect;
    this.weight    = Number(weight);
    this.text      = "";
    // For direct graph, has pair edge or not.
    this.hasPair   = false;
    this.useWeight = useWeight;
    this.id        = 0;
    this.model = new EdgeModel();
}

BaseEdge.prototype.SaveToXML = function ()
{
	return "<edge " + 
	       "vertex1=\""     + this.vertex1.id   + "\" " +
	       "vertex2=\""     + this.vertex2.id   + "\" " +
	       "isDirect=\""   + this.isDirect + "\" " +
	       "weight=\""     + this.weight   + "\" " +
	       "useWeight=\""  + this.useWeight + "\" " +
	       "hasPair=\""    + this.hasPair + "\" " +
	       "id=\""         + this.id + "\" " +
           "text=\""       + this.text + "\" " +
		"></edge>";       
}

BaseEdge.prototype.LoadFromXML = function (xml, graph)
{
    var attr       =    xml.attr('vertex1');
	this.vertex1   =    graph.FindVertex(parseInt(typeof attr !== 'undefined' ? attr : xml.attr('graph1')));
    var attr       =    xml.attr('vertex2');
	this.vertex2   =    graph.FindVertex(parseInt(typeof attr !== 'undefined' ? attr : xml.attr('graph2')));
	this.isDirect  =    xml.attr('isDirect') == "true";
	this.weight    =    parseFloat(xml.attr('weight'));
	this.hasPair   =    xml.attr('hasPair') == "true";
	this.useWeight =    xml.attr('useWeight') == "true";
    this.id        =    parseInt(xml.attr('id'));
    this.text      =    xml.attr("text") == null ? "" : xml.attr("text");
}

BaseEdge.prototype.GetPixelLength = function ()
{
    if (this.vertex1 == this.vertex2)
    {
        return (new CommonEdgeStyle()).sizeOfLoop * 2 * Math.PI;
    }
    else
    {
        return Point.distance(this.vertex1.position, this.vertex2.position);
    }
}

BaseEdge.prototype.GetWeight = function ()
{
    return this.useWeight ? this.weight : 1;
}

BaseEdge.prototype.GetText = function ()
{
    return this.text.length > 0 ? this.text : (this.useWeight ? this.weight.toString() : "");
}