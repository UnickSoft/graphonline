/**
 * Graph drawer.
 */

// Common text position
const CommonTextCenter = 0,
      CommonTextUp     = 1;

// Fonts
const DefaultFont = "px sans-serif",
	  DefaultMainTextFontSize = 13,
	  TopTextFontSizeDelta    = -2; // 2 less then main.


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

function CommonPrintVertexStyle()
{
  BaseVertexStyle.apply(this, arguments);
  
  this.strokeStyle = '#000000';
  this.fillStyle   = '#FFFFFF';
  this.mainTextColor = '#000000';

  this.baseStyles.push("common");
}

CommonPrintVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);


function SelectedPrintVertexStyle()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle   = '#000000';
	this.mainTextColor = '#000000';
	this.fillStyle     = '#AAAAAA';

	this.baseStyles.push("printed");
}

SelectedPrintVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);

