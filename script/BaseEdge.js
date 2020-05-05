/**
 * This is base arc.
 *
 *
 */

function BaseEdge(vertex1, vertex2, isDirect, weight, upText)
{
    this.vertex1    = vertex1;
    this.vertex2    = vertex2;
    this.arrayStyleStart  = "";
    this.arrayStyleFinish = "";
    
    this.isDirect  = isDirect;
    this.weight    = 0;
    this.text      = "";
    this.useWeight = false;
    this.id        = 0;
    this.model = new EdgeModel();
    
    if (upText === undefined)
        this.upText    = "";
    else
        this.upText    = upText;
    
    if (weight !== undefined)
      this.SetWeight(weight);
}

BaseEdge.prototype.copyFrom = function(other)
{
    this.vertex1    = other.vertex1;
    this.vertex2    = other.vertex2;
    this.arrayStyleStart  = other.arrayStyleStart;
    this.arrayStyleFinish = other.arrayStyleFinish;
    
    this.isDirect  = other.isDirect;
    this.weight    = other.weight;
    this.text      = other.text;
    this.useWeight = other.useWeight;
    this.id        = other.id;
    this.model     = new EdgeModel();
    this.model.copyFrom(other.model);
    
    this.upText    = other.upText;
}

BaseEdge.prototype.SaveToXML = function ()
{
	return "<edge " + 
	       "source=\""     + this.vertex1.id   + "\" " +
	       "target=\""     + this.vertex2.id   + "\" " +
	       "isDirect=\""   + this.isDirect + "\" " +
	       "weight=\""     + this.weight   + "\" " +
	       "useWeight=\""  + this.useWeight + "\" " +
	       "id=\""         + this.id + "\" " +
           "text=\""       + this.text + "\" " +
           "upText=\""     + this.upText + "\" " +
           "arrayStyleStart=\""       + this.arrayStyleStart + "\" " +
           "arrayStyleFinish=\""       + this.arrayStyleFinish + "\" " +
           this.model.SaveToXML() + 
		"></edge>";       
}

BaseEdge.prototype.LoadFromXML = function (xml, graph)
{
    var attr       =    xml.attr('vertex1');
    if (typeof attr === 'undefined')
    {
        attr = xml.attr('source');
    }
	this.vertex1   =    graph.FindVertex(typeof attr !== 'undefined' ? attr : xml.attr('graph1'));
    var attr       =    xml.attr('vertex2');
    if (typeof attr === 'undefined')
    {
        attr = xml.attr('target');
    }
	this.vertex2   =    graph.FindVertex(typeof attr !== 'undefined' ? attr : xml.attr('graph2'));
	this.isDirect  =    xml.attr('isDirect') == "true";
	this.weight    =    parseFloat(xml.attr('weight'));
    if (isNaN(this.weight))
    {
        this.weight = 1;        
    }
	this.hasPair   =    xml.attr('hasPair') == "true";
	this.useWeight =    xml.attr('useWeight') == "true";
    this.id        =    xml.attr('id');
    this.text      =    xml.attr("text") == null ? "" : xml.attr("text");
    this.arrayStyleStart      =   xml.attr("arrayStyleStart") == null ? "" : xml.attr("arrayStyleStart");
    this.arrayStyleFinish      =  xml.attr("arrayStyleFinish") == null ? "" : xml.attr("arrayStyleFinish");
	this.upText    = xml.attr('upText');
    if (typeof this.upText === 'undefined')
    {
        this.upText = "";        
    }
    
    this.model.LoadFromXML(xml);
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

BaseEdge.prototype.GetUpText = function ()
{
    return this.upText;
}

BaseEdge.prototype.GetStartEdgeStyle = function ()
{
    return this.arrayStyleStart;
}

BaseEdge.prototype.GetFinishEdgeStyle = function ()
{
    return (this.arrayStyleFinish != "" ? this.arrayStyleFinish : (this.isDirect ? "arrow" : ""));
}

BaseEdge.prototype.HitTest = function (pos)
{
    var positions = this.GetEdgePositionsShift();
    return this.model.HitTest(positions[0], positions[1], pos);
}

BaseEdge.prototype.GetEdgePositionsShift = function()
{
    return this.GetEdgePositions();
}

BaseEdge.prototype.GetEdgePositions = function()
{
    var position1 = this.vertex1.position;
    var position2 = this.vertex2.position;
    var diameter1 = this.vertex1.model.diameter;
    var diameter2 = this.vertex2.model.diameter;

    var direction = position1.subtract(position2);
    
    var direction1 = direction;
    var direction2 = direction;
    var d1        = diameter1;
    var d2        = -diameter2;
    
    if (this.model.type == EdgeModels.cruvled)
    {
        var dist   = position1.distance(position2);
        var point1  = this.model.GetCurvedPoint(position1, position2, 10.0 / dist);
        direction1  = position1.subtract(point1);
        
        var point2  = this.model.GetCurvedPoint(position1, position2, 1.0 - 10.0 / dist);
        direction2  = position2.subtract(point2);
        
        d2         = diameter2;
    }

    direction1.normalize(1.0);
    direction1 = direction1.multiply(0.5);
    direction2.normalize(1.0);
    direction2 = direction2.multiply(0.5);

    var res = [];
    res.push(position1.subtract(direction1.multiply(d1)));
    res.push(position2.subtract(direction2.multiply(d2)));
    return res;
}

BaseEdge.prototype.SetWeight = function(weight)
{
	var useWeight = false;
	if (!isNaN(parseInt(weight, 10)))
	{
		useWeight = true;
	}
	weight = (!isNaN(parseInt(weight, 10)) && weight >= 0) ? weight : 1;
    
    this.weight    = Number(weight);
    this.useWeight = useWeight;
}

BaseEdge.prototype.SetUpText = function(text)
{
    this.upText = text;
}