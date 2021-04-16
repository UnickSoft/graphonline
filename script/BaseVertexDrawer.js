/**
 * Graph drawer.
 */

// Test graph: http://localhost:8080/?graph=oimDPgsdgiAjWGBHZZcst


// Vertex shape
const VertexCircleShape = 0,
      VertexSquareShape = 1,
      VertexTriangleShape = 2;

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
 
function BaseVertexStyle()
{
  this.baseStyles = [];
}

BaseVertexStyle.prototype.GetStyle = function (baseStyle)
{
	this.baseStyles.forEach(function(element) {
		var styleObject = globalApplication.GetStyle("vertex", element);
		baseStyle       = styleObject.GetStyle(baseStyle);
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

	baseStyle.lineWidth = parseInt(baseStyle.lineWidth);
	return baseStyle;
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
  this.shape       = VertexCircleShape;//VertexSquareShape;

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

function SelectedVertexStyle5()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#FF6200';
	this.mainTextColor  = '#FF6200';
	this.fillStyle   = '#0F4FA8';

	this.baseStyles.push("selected");
}

SelectedVertexStyle5.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedVertexStyle6()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle   = '#8CA336';
	this.mainTextColor = '#8CA336';
	this.fillStyle     = '#9C344C';

	this.baseStyles.push("selected");
}

SelectedVertexStyle6.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedVertexStyle7()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle   = '#B59E22';
	this.mainTextColor = '#B59E22';
	this.fillStyle     = '#22387A';

	this.baseStyles.push("selected");
}

SelectedVertexStyle7.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedVertexStyle8()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle   = '#08806C';
	this.mainTextColor = '#08806C';
	this.fillStyle     = '#CA980D';

	this.baseStyles.push("selected");
}

SelectedVertexStyle8.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedVertexStyle9()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle   = '#AA8134';
	this.mainTextColor = '#AA8134';
	this.fillStyle     = '#492A73';

	this.baseStyles.push("selected");
}

SelectedVertexStyle9.prototype = Object.create(BaseVertexStyle.prototype);

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
	new SelectedVertexStyle2(), new SelectedVertexStyle3(), new SelectedVertexStyle4(), new SelectedVertexStyle5(), new SelectedVertexStyle6(), new SelectedVertexStyle7(), new SelectedVertexStyle8(), new SelectedVertexStyle9()];

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
  
  this.DrawCenterText(baseGraph.position, baseGraph.mainText, graphStyle.mainTextColor, graphStyle.fillStyle, true, true, 16);
  
  // Top text
  this.DrawCenterText(baseGraph.position.add(new Point(0, - baseGraph.model.diameter / 2.0 - 9.0)), 
	baseGraph.upText, graphStyle.fillStyle, graphStyle.strokeStyle, false, false, 12.0);
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
  else if (this.currentStyle.shape == VertexSquareShape)
  {
	var points = GetSquarePoints(baseGraph.model.diameter);

	this.context.moveTo(baseGraph.position.x + points[points.length - 1].x, baseGraph.position.y + points[points.length - 1].y);

	var context = this.context;
	
	points.forEach(function(point) {
		context.lineTo(baseGraph.position.x + point.x, baseGraph.position.y + point.y);
	  });
  }
  else if (this.currentStyle.shape == VertexTriangleShape)
  {
	var points = GetTrianglePoints(baseGraph.model.diameter)

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
	this.context.font = (bold ? "bold " : "") + size + "px sans-serif";
	var textWidth  = this.context.measureText(text).width;	
	this.DrawText(new Point(position.x - textWidth / 2, position.y), text, color, outlineColor, outline, this.context.font);
}

