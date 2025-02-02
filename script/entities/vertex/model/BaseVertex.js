/**
 * Base node class.
 *
 */

/*
 Utility method to get text width
 without render.
*/
function GetTextWidth(text, font) 
{
  const canvas = GetTextWidth.canvas || (GetTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}
 
function BaseVertex(x, y, vertexEnumType)
{
    this.position = new Point(x, y);
    this.id       = 0;
    this.mainText = "";
    this.upText   = "";
    this.vertexEnumType = vertexEnumType;
    this.model    = new VertexModel();
    this.hasUndefinedPosition = false;
    this.ownStyles = {};
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
    this.ownStyles = FullObjectCopy(other.ownStyles);
}

BaseVertex.prototype.SaveToXML = function ()
{
	return "<node " + 
	       "positionX=\""  + this.position.x   + "\" " +
	       "positionY=\""  + this.position.y   + "\" " +
	       "id=\""         + this.id   + "\" " +
	       "mainText=\""   + gEncodeToHTML(this.mainText) + "\" " +
	       "upText=\""     + gEncodeToHTML(this.upText)   + "\" " +
         ((Object.keys(this.ownStyles).length > 0) ? "ownStyles = \"" + gEncodeToHTML(JSON.stringify(this.ownStyles)) + "\" ": "") +
         "size=\"" + this.model.diameter + "\" " +
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

    var size = xml.attr('size');
    if (typeof size !== 'undefined')
      this.model.diameter = parseInt(size);
}

BaseVertex.prototype.SetId = function (id)
{
    this.id       = id;
    if (this.vertexEnumType != null)
      this.mainText = this.vertexEnumType.GetVertexText(id);		                 
}

BaseVertex.prototype.IsUndefinedPosition = function ()
{
    return this.hasUndefinedPosition;
}

BaseVertex.prototype.HitTest = function (pos)
{
  var style = this.hasOwnProperty('currentStyle') ? this.currentStyle.GetStyle({}, this) : null;
  var shape = style != null ? style.shape : VertexCircleShape;
  var width = style != null ? style.lineWidth : 0;
  
  if (shape == VertexCircleShape)
  {
  	return this.position.distance(pos) < this.model.diameter / 2.0 + width;
  }
  else
  {
    var relativePos  = (new Point(pos.x, pos.y)).subtract(this.position);
    var lineFinish1 = relativePos.add(new Point(1000, 0));
    var lineFinish2 = relativePos.add(new Point(-1000, 0));
    if (style == null)
    {
      console.error("Some thing wrong with style");
    }
    var pointsVertex1 = GetPointsForShape(shape, this.model.diameter + width, 
      style != null ? {style: style, text: this.mainText} : null);
    pointsVertex1.push(pointsVertex1[0]);

    var hitNumber1 = 0;
    var hitNumber2 = 0;

    for (var i = 0; i < pointsVertex1.length - 1; i ++)
    {
        var hitTest = Point.hitTest(relativePos, lineFinish1, pointsVertex1[i], pointsVertex1[i + 1]);
        if (hitTest != null)
        {
          hitNumber1++;
        }
        hitTest = Point.hitTest(relativePos, lineFinish2, pointsVertex1[i], pointsVertex1[i + 1]);
        if (hitTest != null)
        {
          hitNumber2++;
        }
    }

    return hitNumber1 == 1 && hitNumber2 == 1;
  }

  return false;
}

BaseVertex.prototype.resetOwnStyle = function (index)
{
  if (this.ownStyles.hasOwnProperty(index))
  {
    delete this.ownStyles[index];
  }
}

BaseVertex.prototype.setOwnStyle = function (index, style)
{
  this.ownStyles[index] = FullObjectCopy(style);
}

BaseVertex.prototype.getStyleFor = function (index)
{
  if (this.ownStyles.hasOwnProperty(index))
  {
    return this.ownStyles[index];
  }
  else
  {
    var style = null;

    if (index == 0)
      style = globalApplication.GetStyle("vertex", "common");
    else
      style = globalApplication.GetStyle("vertex", "selected", undefined, index - 1);

    return style;
  }
}

BaseVertex.prototype.hasOwnStyleFor = function (index)
{
  return this.ownStyles.hasOwnProperty(index);
}

BaseVertex.prototype.getDefaultDiameterFactor = function (textSize)
{
    var textFactor = defaultVertexDiameter * 8.0 / (2.0 * textSize);
    return new Point(1.0 + (this.mainText.length ? this.mainText.length / textFactor : 0), 1.5);
}

BaseVertex.prototype.getBBox = function (style)
{
  var textSize = DefaultMainTextFontSize;
  if (style !== undefined && style.mainTextFontSize !== undefined)
  {
    textSize = style.mainTextFontSize;
  }
  var defaultDiameter = (new VertexModel()).diameter;
  var vertexDiameter = this.model.diameter;
  var factor = this.getDefaultDiameterFactor(textSize);
  // Devide by 1.5 to make it smaller, because it is too big.
  let textWidth = (GetTextWidth(this.mainText, textSize + "px sans-serif") + 8) / 1.5;
  let textHeight = textSize + 4;
  let isTextAbove = style.commonTextPosition == 1;

  return new Point(Math.max(factor.x * defaultDiameter, vertexDiameter, textWidth), 
                   Math.max(factor.y * defaultDiameter, vertexDiameter + (isTextAbove ? textHeight : 0), textHeight));
}