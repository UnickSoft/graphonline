/**
 * Graph drawer.
 */

// Test graph: http://localhost/?graph=IEktYqMyJaYYyLufZZcst_test

function BaseVertexDrawer(context)
{ 
  this.context = context;
}

BaseVertexDrawer.prototype.Draw = function(baseGraph, graphStyle)
{
  this.SetupStyle(graphStyle);
  this.DrawShape(baseGraph);

  if (this.currentStyle.lineWidth != 0)
  	this.context.stroke();

  this.context.fill();

  var shapeSize = GetSizeForShape(graphStyle.shape, baseGraph.model.diameter + graphStyle.lineWidth);
  
  if (graphStyle.commonTextPosition == CommonTextCenter)
  {
  	this.DrawCenterText(baseGraph.position, baseGraph.mainText, graphStyle.mainTextColor, 
						graphStyle.fillStyle, true, true, graphStyle.mainTextFontSize);  
  	// Top text
  	this.DrawCenterText(baseGraph.position.add(new Point(0, - shapeSize / 2.0 - graphStyle.mainTextFontSize / 2.2)), baseGraph.upText, 
						graphStyle.upTextColor, graphStyle.strokeStyle, false, false,
						graphStyle.mainTextFontSize + TopTextFontSizeDelta);
  }
  else if (graphStyle.commonTextPosition == CommonTextUp)
  {
	this.DrawCenterText(baseGraph.position.add(new Point(0, - shapeSize / 2.0 - graphStyle.mainTextFontSize / 2.2)), baseGraph.mainText, 
						graphStyle.mainTextColor, graphStyle.fillStyle, true, false,
						graphStyle.mainTextFontSize);  
	// Top text
	this.DrawCenterText(baseGraph.position.add(new Point(0, shapeSize / 2.0 + graphStyle.mainTextFontSize / 1.7)), baseGraph.upText, 
						graphStyle.upTextColor, graphStyle.strokeStyle, false, false, 
						graphStyle.mainTextFontSize + TopTextFontSizeDelta);
  }
/*	
  // Bottom text
  this.DrawCenterText(baseGraph.position.add(new Point(0, + baseGraph.model.diameter / 2.0 + 7.0)), 
	"Text 2", graphStyle.fillStyle, false, 12.0);
*/
}

BaseVertexDrawer.prototype.SetupStyle = function(style)
{
  this.currentStyle = style;
  this.context.lineWidth   = style.lineWidth;
  this.context.strokeStyle = style.strokeStyle;
  this.context.fillStyle   = style.fillStyle;
}

BaseVertexDrawer.prototype.DrawShape = function(baseGraph)
{
  this.context.beginPath();
  if (this.currentStyle.shape == VertexCircleShape)
  {
  	this.context.arc(baseGraph.position.x, baseGraph.position.y, baseGraph.model.diameter / 2.0, 0, 2 * Math.PI);
  }
  else
  {
	var points = GetPointsForShape(this.currentStyle.shape, baseGraph.model.diameter, 
		{style:  this.currentStyle, text: baseGraph.mainText});

	this.context.moveTo(baseGraph.position.x + points[points.length - 1].x, baseGraph.position.y + points[points.length - 1].y);

	var context = this.context;

	points.forEach(function(point) {
		context.lineTo(baseGraph.position.x + point.x, baseGraph.position.y + point.y);
	  });
  }

  this.context.closePath();
}

BaseVertexDrawer.prototype.DrawText = function(position, text, color, outlineColor, outline, font)
{
	this.context.fillStyle = color;
	this.context.font = font;
    this.context.lineWidth = 4;
    this.context.strokeStyle = outlineColor;

    if (outline)
    {
        this.context.save();
        this.context.lineJoin = 'round';
        this.context.strokeText(text, position.x, position.y);
        this.context.restore();
    }
    
    this.context.fillText(text, position.x, position.y);
}

BaseVertexDrawer.prototype.DrawCenterText = function(position, text, 
	color, outlineColor, bold, outline, size)
{
	this.context.textBaseline="middle";
	this.context.font = (bold ? "bold " : "") + size + DefaultFont;
	var textWidth  = this.context.measureText(text).width;	
	this.DrawText(new Point(position.x - textWidth / 2, position.y), text, color, outlineColor, outline, this.context.font);
}

