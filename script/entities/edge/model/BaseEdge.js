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

    this.ownStyles = {};      
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

    this.ownStyles = FullObjectCopy(other.ownStyles);
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
           "text=\""       + gEncodeToHTML(this.text) + "\" " +
           "upText=\""     + gEncodeToHTML(this.upText) + "\" " +
           "arrayStyleStart=\""       + this.arrayStyleStart + "\" " +
           "arrayStyleFinish=\""       + this.arrayStyleFinish + "\" " +
           ((Object.keys(this.ownStyles).length > 0) ? "ownStyles = \"" + gEncodeToHTML(JSON.stringify(this.ownStyles)) + "\" ": "") +
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
    this.text      =    xml.attr("text") == null ? "" : gDecodeFromHTML(xml.attr("text"));
    this.arrayStyleStart      =   xml.attr("arrayStyleStart") == null ? "" : xml.attr("arrayStyleStart");
    this.arrayStyleFinish      =  xml.attr("arrayStyleFinish") == null ? "" : xml.attr("arrayStyleFinish");
	this.upText    = xml.attr('upText');
    if (typeof this.upText === 'undefined')
    {
        this.upText = "";        
    }
    else
    {
        this.upText = gDecodeFromHTML(this.upText);
    }

    var ownStyle = xml.attr('ownStyles');
    if (typeof ownStyle !== 'undefined')
    {
      var parsedSave = gDecodeFromHTML(JSON.parse(ownStyle));
    
      for(var indexField in parsedSave)
      {
        var index = parseInt(indexField);
        this.ownStyles[index] = FullObjectCopy(this.getStyleFor(index));
        for(var field in parsedSave[indexField])
        {
            if (this.ownStyles[index].ShouldLoad(field))
              this.ownStyles[index][field] = parsedSave[indexField][field];
        }
      }
    }    
    
    this.model.LoadFromXML(xml);
}

BaseEdge.prototype.GetPixelLength = function ()
{
    if (this.vertex1 == this.vertex2)
    {
        return this.model.GetLoopSize() * 2 * Math.PI;
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
    var res = [];

    if (this.vertex1 == this.vertex2)
    {
        res.push(this.vertex1.position);
        res.push(this.vertex2.position);
        return res;
    }
    
    var position1 = this.vertex1.position;
    var position2 = this.vertex2.position;
    var diameter1 = this.vertex1.model.diameter + parseInt(this.vertex1.currentStyle.GetStyle({}, this.vertex1).lineWidth);
    var diameter2 = this.vertex2.model.diameter + parseInt(this.vertex2.currentStyle.GetStyle({}, this.vertex2).lineWidth);

    var direction = position1.subtract(position2);
    
    var direction1 = direction;
    var direction2 = direction;
    var d1        = diameter1;
    var d2        = diameter2;
    
    if (this.model.type == EdgeModels.curve)
    {
        var dist   = position1.distance(position2);
        var point1  = this.model.GetCurvePoint(position1, position2, 10.0 / dist);
        direction1  = position1.subtract(point1);   
        
        var point2  = this.model.GetCurvePoint(position1, position2, 1.0 - 10.0 / dist);
        direction2  = position2.subtract(point2);
        
        d2         = diameter2;
    }
    else
    {
        direction2 = direction2.multiply(-1);
    }

    direction1.normalize(1.0);
    direction2.normalize(1.0);

    var vertices = [];
    vertices.push({vertex : this.vertex1, direction : direction1, position : position1, diameter : d1});
    vertices.push({vertex : this.vertex2, direction : direction2, position : position2, diameter : d2});

	vertices.forEach(function(data) 
        {
            var shape = data.vertex.currentStyle.GetStyle({}, data.vertex).shape;
            if (shape == VertexCircleShape)
            {
                var direction = data.direction.multiply(0.5);        
        
                res.push(data.position.subtract(direction.multiply(data.diameter)));
            }
            else
            {
                var lineFinish1 = data.direction.multiply(-1).multiply(1000.0);
            
                var pointsVertex1 = GetPointsForShape(shape, data.diameter, data.vertex.mainText);
                pointsVertex1.push(pointsVertex1[0]);
            
                for (var i = 0; i < pointsVertex1.length - 1; i ++)
                {
                    var hitText = Point.hitTest(new Point(0, 0), lineFinish1, pointsVertex1[i], pointsVertex1[i + 1]);
                    if (hitText != null)
                    {
                        res.push(data.position.add(hitText));
                        break;
                    }
                }
            }
        });    


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

BaseEdge.prototype.resetOwnStyle = function (index)
{
  if (this.ownStyles.hasOwnProperty(index))
  {
    delete this.ownStyles[index];
  }
}

BaseEdge.prototype.setOwnStyle = function (index, style)
{
  this.ownStyles[index] = style;
}

BaseEdge.prototype.getStyleFor = function (index)
{
  if (this.ownStyles.hasOwnProperty(index))
  {
    return this.ownStyles[index];
  }
  else
  {
    var style = null;

    if (index == 0)
      style = globalApplication.GetStyle("edge", "common");
    else
      style = globalApplication.GetStyle("edge", "selected", undefined, index - 1);

    return style;
  }
}

BaseEdge.prototype.hasOwnStyleFor = function (index)
{
  return this.ownStyles.hasOwnProperty(index);
}