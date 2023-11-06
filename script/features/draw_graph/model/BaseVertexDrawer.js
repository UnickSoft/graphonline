/**
 * Graph drawer.
 */

// Test graph: http://localhost:8080/?graph=oimDPgsdgiAjWGBHZZcst


// Vertex shape
const VertexCircleShape   = 0,
      VertexSquareShape   = 1,
      VertexTriangleShape = 2,
	  VertexPentagonShape = 3,
	  VertexHomeShape     = 4,
	  VertexTextboxShape = 5;
	  VertexSnowflakeShape = 6;

// Common text position
const CommonTextCenter = 0,
      CommonTextUp     = 1;

// Fonts
const DefaultFont = "px sans-serif",
	  MainTextFontSize = 16,
	  TopTextFontSize  = 12.0;

function GetSquarePoints(diameter)
{
  var res = [];

  var a = diameter;
  res.push(new Point(-a / 2, - a / 2));
  res.push(new Point(a / 2, -a / 2));
  res.push(new Point(a / 2, a / 2));
  res.push(new Point(-a / 2, a / 2));

  return res;
}

function GetTrianglePoints(diameter)
{
	var res = [];

  	var effectiveDiameter = diameter * 1.5;
  	var upOffset   = effectiveDiameter / 2;
  	var downOffset = effectiveDiameter / 4;
  	var lrOffset   = effectiveDiameter * 3 / (Math.sqrt(3) * 4);

  	res.push(new Point(0, - upOffset));
	res.push(new Point(lrOffset,   downOffset));
	res.push(new Point(- lrOffset, downOffset));

  	return res;
}

function GetPentagonPoints(diameter)
{
	var res = [];

	var baseValue = diameter / 2 * 1.2;

  	res.push(new Point(0, - baseValue));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72 * 2));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72 * 3));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72 * 4));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72 * 5));

  	return res;
}

function GetTextboxPoints(diameter, text)
{
	var res = [];
	var width = diameter;
	var height = diameter;	
	
	if (text)
	{
		var tempContext = document.createElement('canvas').getContext('2d');
		tempContext.font = "bold " + MainTextFontSize + DefaultFont;
		width = tempContext.measureText(text).width + diameter / 2;
	}

	res.push(new Point(-width / 2, -height / 2));
	res.push(new Point(width / 2, -height / 2));
	res.push(new Point(width / 2, height / 2));
	res.push(new Point(-width / 2, height / 2));

	return res;
}

function GetShowflakePoints(diameter) 
{
	var res = [];

	var superSmallRadius = diameter * 0.8 / 2;
	var smallRadius = diameter * 0.95 / 2;
	var bigRadius   = diameter * 1.5 / 2;
	let angel = 8;

	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), - angel));
	res.push(new Point(smallRadius, 0));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), angel));
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + angel));	
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60 + 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + angel));	
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60 + 60));	
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60));	
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + angel));	

	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60 + 60 + 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60));	
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 + angel));	
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60 + 60 + 60 + 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 + 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 + 60));	
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 + 60 + angel));	
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60 + 60 + 60 + 60 + 60));

	return res;
}

function GetPointsForShape(shape, diameter, text=null)
{
	switch (parseInt(shape))
	{
		case VertexSquareShape:   return GetSquarePoints(diameter); break;
		case VertexTriangleShape: return GetTrianglePoints(diameter); break;
		case VertexPentagonShape: return GetPentagonPoints(diameter); break;
		case VertexTextboxShape: return GetTextboxPoints(diameter, text); break;
		case VertexSnowflakeShape:   return GetShowflakePoints(diameter); break;
		default: return null; break;
	}
}

function GetSizeForShape(shape, diameter)
{
	switch (parseInt(shape))
	{
		case VertexSquareShape:   return diameter; break;
		case VertexTriangleShape: return diameter * 1.5; break;
		case VertexPentagonShape: return diameter * 1.2; break;
		case VertexTextboxShape: return diameter; break;
		case VertexSnowflakeShape: return diameter * 1.5; break;

		default: return diameter; break;
	}
}
 
function BaseVertexStyle()
{
  this.baseStyles = [];
}

BaseVertexStyle.prototype.GetStyle = function (baseStyle, object)
{
	this.baseStyles.forEach(function(element) {
		var styleObject = globalApplication.GetStyle("vertex", element, object);
		baseStyle       = styleObject.GetStyle(baseStyle, object);
	});

	if (this.hasOwnProperty('lineWidth'))
		baseStyle.lineWidth   = this.lineWidth;
	if (this.hasOwnProperty('strokeStyle'))
		baseStyle.strokeStyle = this.strokeStyle;
	if (this.hasOwnProperty('fillStyle'))
		baseStyle.fillStyle   = this.fillStyle;
	if (this.hasOwnProperty('mainTextColor'))
		baseStyle.mainTextColor = this.mainTextColor;
	if (this.hasOwnProperty('shape'))
		baseStyle.shape = this.shape;
	if (this.hasOwnProperty('upTextColor'))
		baseStyle.upTextColor = this.upTextColor;
	if (this.hasOwnProperty('commonTextPosition'))
		baseStyle.commonTextPosition = this.commonTextPosition;

	baseStyle.lineWidth = parseInt(baseStyle.lineWidth);

	return this.FixNewFields(baseStyle);
}

BaseVertexStyle.prototype.FixNewFields = function (style)
{
	if (!style.hasOwnProperty('shape'))
		style.shape = VertexCircleShape;

	if (!style.hasOwnProperty('commonTextPosition'))
		style.commonTextPosition = CommonTextCenter;

	return style;
}

BaseVertexStyle.prototype.Clear = function ()
{
	delete this.lineWidth;
	delete this.strokeStyle;
	delete this.fillStyle;
	delete this.mainTextColor;
	delete this.shape;
	delete this.upTextColor;
	delete this.commonTextPosition;
	delete this.lineWidth;
}

BaseVertexStyle.prototype.ShouldLoad = function (field)
{
	return field != "baseStyles";
}

// Common style of Graphs.
function CommonVertexStyle()
{
  BaseVertexStyle.apply(this, arguments);

  this.lineWidth   = 2;
  this.strokeStyle = '#c7b7c7';
  this.fillStyle   = '#68aeba';
  this.mainTextColor = '#f0d543';
  this.shape       = VertexCircleShape;
  this.upTextColor = '#68aeba';
  this.commonTextPosition = CommonTextCenter;

  this.baseStyles = [];
}

CommonVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);

function CommonPrintVertexStyle()
{
  BaseVertexStyle.apply(this, arguments);
  
  this.strokeStyle = '#000000';
  this.fillStyle   = '#FFFFFF';
  this.mainTextColor = '#000000';

  this.baseStyles.push("common");
}

CommonPrintVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);

// Selected style of Graphs.
function SelectedVertexStyle0()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#f0d543';
	this.mainTextColor  = '#f0d543';
	this.fillStyle   = '#c7627a';

	this.baseStyles.push("common");
}

SelectedVertexStyle0.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedVertexStyle1()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#7a9ba0';
	this.mainTextColor  = '#c3d2d5';
	this.fillStyle   = '#534641';

	this.baseStyles.push("selected");
}

SelectedVertexStyle1.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedVertexStyle2()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#8C4C86';
	this.mainTextColor  = '#dbbdd8';
	this.fillStyle   = '#253267';

	this.baseStyles.push("selected");
}

SelectedVertexStyle2.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedVertexStyle3()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#6188FF';
	this.mainTextColor  = '#6188FF';
	this.fillStyle   = '#E97CF9';

	this.baseStyles.push("selected");
}

SelectedVertexStyle3.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedVertexStyle4()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#C6B484';
	this.mainTextColor  = '#C6B484';
	this.fillStyle   = '#E0DEE1';

	this.baseStyles.push("selected");
}

SelectedVertexStyle4.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedPrintVertexStyle()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle   = '#000000';
	this.mainTextColor = '#000000';
	this.fillStyle     = '#AAAAAA';

	this.baseStyles.push("printed");
}

SelectedPrintVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);

var DefaultSelectedGraphStyles = [new SelectedVertexStyle0(), new SelectedVertexStyle1(),
	new SelectedVertexStyle2(), new SelectedVertexStyle3(), new SelectedVertexStyle4()];

var DefaultPrintSelectedGraphStyles = [new SelectedPrintVertexStyle()];

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
						graphStyle.fillStyle, true, true, MainTextFontSize);  
  	// Top text
  	this.DrawCenterText(baseGraph.position.add(new Point(0, - shapeSize / 2.0 - 9.0)), baseGraph.upText, 
						graphStyle.upTextColor, graphStyle.strokeStyle, false, false, TopTextFontSize);
  }
  else if (graphStyle.commonTextPosition == CommonTextUp)
  {
	this.DrawCenterText(baseGraph.position.add(new Point(0, - shapeSize / 2.0 - 7.0)), baseGraph.mainText, 
						graphStyle.mainTextColor, graphStyle.fillStyle, true, false, MainTextFontSize);  
	// Top text
	this.DrawCenterText(baseGraph.position.add(new Point(0, shapeSize / 2.0 + 9.0)), baseGraph.upText, 
						graphStyle.upTextColor, graphStyle.strokeStyle, false, false, TopTextFontSize);
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
	var points = GetPointsForShape(this.currentStyle.shape, baseGraph.model.diameter, baseGraph.mainText);

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

BaseVertexDrawer.prototype.DrawCenterText = function(position, text, color, outlineColor, bold, outline, size)
{
	this.context.textBaseline="middle";
	this.context.font = (bold ? "bold " : "") + size + DefaultFont;
	var textWidth  = this.context.measureText(text).width;	
	this.DrawText(new Point(position.x - textWidth / 2, position.y), text, color, outlineColor, outline, this.context.font);
}

