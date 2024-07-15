/**
 * Graph drawer.
 */

// Common text position
const CommonTextCenter = 0,
      CommonTextUp     = 1;

// Fonts
const DefaultFont = "px sans-serif",
	  DefaultMainTextFontSize = 16,
	  TopTextFontSizeDelta    = -4; // 4 less then main.


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
	if (this.hasOwnProperty('mainTextFontSize'))
		baseStyle.mainTextFontSize = this.mainTextFontSize;

	baseStyle.lineWidth = parseInt(baseStyle.lineWidth);

	return this.FixNewFields(baseStyle);
}

BaseVertexStyle.prototype.FixNewFields = function (style)
{
	if (!style.hasOwnProperty('shape'))
		style.shape = VertexCircleShape;

	if (!style.hasOwnProperty('commonTextPosition'))
		style.commonTextPosition = CommonTextCenter;

	if (!style.hasOwnProperty('mainTextFontSize'))
		style.mainTextFontSize = DefaultMainTextFontSize;

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
	delete this.mainTextFontSize;
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

