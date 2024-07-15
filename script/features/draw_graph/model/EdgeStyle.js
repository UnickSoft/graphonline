/**
 * Graph drawer.
 */


 const lineDashTypes = [
          [],
          [4, 4],
          [12, 12],
          [16, 4, 4, 4],
        ];

// Common text position
const WeightTextCenter = 0,
      WeightTextUp     = 1;

// Fonts
const DefaultFontEdge = "px sans-serif",
	  DefaultMainTextFontSizeEdge = 16,
	  TopTextFontSizeDeltaEdge    = -4; // 4 less then main.

 function BaseEdgeStyle()
 {
   this.baseStyles = [];
 }
 
 BaseEdgeStyle.prototype.GetStyle = function (baseStyle, object)
 {
   this.baseStyles.forEach(function(element) {
     var styleObject = globalApplication.GetStyle("edge", element, object);
     baseStyle       = styleObject.GetStyle(baseStyle, object);
   });
 
   if (this.hasOwnProperty('weightText'))
     baseStyle.weightText   = this.weightText;
   if (this.hasOwnProperty('strokeStyle'))
     baseStyle.strokeStyle = this.strokeStyle;
   if (this.hasOwnProperty('fillStyle'))
     baseStyle.fillStyle   = this.fillStyle;
   if (this.hasOwnProperty('textPadding'))
     baseStyle.textPadding = this.textPadding;
   if (this.hasOwnProperty('textStrokeWidth'))
     baseStyle.textStrokeWidth = this.textStrokeWidth;
   if (this.hasOwnProperty('lineDash'))
     baseStyle.lineDash = this.lineDash;
   if (this.hasOwnProperty('additionalTextColor'))
     baseStyle.additionalTextColor = this.additionalTextColor;
   if (this.hasOwnProperty('weightPosition'))
     baseStyle.weightPosition = this.weightPosition;
   if (this.hasOwnProperty('mainTextFontSize'))
		baseStyle.mainTextFontSize = this.mainTextFontSize;
 
   return this.FixNewFields(baseStyle);
}
  
BaseEdgeStyle.prototype.FixNewFields = function (style)
{
  if (!style.hasOwnProperty('lineDash'))
    style.lineDash = 0;

  if (!style.hasOwnProperty('weightPosition'))
    style.weightPosition = WeightTextCenter;

	if (!style.hasOwnProperty('mainTextFontSize'))
		style.mainTextFontSize = DefaultMainTextFontSizeEdge;

  return style;
}

 BaseEdgeStyle.prototype.Clear = function ()
 {
    delete this.weightText;
    delete this.strokeStyle;
    delete this.fillStyle;
    delete this.textPadding;
    delete this.textStrokeWidth;
    delete this.lineDash;
    delete this.additionalTextColor;
    delete this.weightPosition;
    delete this.mainTextFontSize;
 }

 BaseEdgeStyle.prototype.ShouldLoad = function (field)
 {
   return field != "baseStyles";
 }
 
function CommonEdgeStyle()
{
  BaseEdgeStyle.apply(this, arguments);

	this.strokeStyle = '#c7b7c7';
	this.weightText  = '#f0d543';
 	this.fillStyle   = '#68aeba';
 	this.textPadding = 4;
	this.textStrokeWidth = 2;
  this.lineDash = 0;
  this.additionalTextColor = '#c7b7c7';
  this.weightPosition = WeightTextCenter;
}

CommonEdgeStyle.prototype = Object.create(BaseEdgeStyle.prototype);

function CommonPrintEdgeStyle()
{
	BaseEdgeStyle.apply(this, arguments);
    
	this.strokeStyle = '#000000';
	this.weightText  = '#000000';
 	this.fillStyle   = '#FFFFFF';
 	this.textPadding = 4;
	this.textStrokeWidth = 2;

    this.baseStyles.push("common");
}
CommonPrintEdgeStyle.prototype = Object.create(BaseEdgeStyle.prototype);

function SelectedEdgeStyle0()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#f0d543';
	this.weightText  = '#f0d543';
	this.fillStyle   = '#c7627a';

  this.baseStyles.push("common");
}
SelectedEdgeStyle0.prototype = Object.create(BaseEdgeStyle.prototype);

function SelectedEdgeStyle1()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#8FBF83';
	this.weightText  = '#8FBF83';
	this.fillStyle   = '#F9F9D5';

  this.baseStyles.push("selected");
}
SelectedEdgeStyle1.prototype = Object.create(BaseEdgeStyle.prototype);

function SelectedEdgeStyle2()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#8C4C86';
	this.weightText  = '#8C4C86';
	this.fillStyle   = '#253267';

  this.baseStyles.push("selected");
}
SelectedEdgeStyle2.prototype = Object.create(BaseEdgeStyle.prototype);


function SelectedEdgeStyle3()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#6188FF';
	this.weightText  = '#6188FF';
	this.fillStyle   = '#E97CF9';

  this.baseStyles.push("selected");
}
SelectedEdgeStyle3.prototype = Object.create(BaseEdgeStyle.prototype);


function SelectedEdgeStyle4()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#C6B484';
	this.weightText  = '#C6B484';
	this.fillStyle   = '#E0DEE1';

  this.baseStyles.push("selected");
}
SelectedEdgeStyle4.prototype = Object.create(BaseEdgeStyle.prototype);

function SelectedEdgePrintStyle()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#AAAAAA';
	this.weightText  = '#000000';
	this.fillStyle   = '#AAAAAA';

  this.baseStyles.push("printed");
}
SelectedEdgePrintStyle.prototype = Object.create(BaseEdgeStyle.prototype);

var DefaultSelectedEdgeStyles      = [new SelectedEdgeStyle0(), new SelectedEdgeStyle1(), 
	new SelectedEdgeStyle2(), new SelectedEdgeStyle3(), new SelectedEdgeStyle4()];

var DefaultPrintSelectedEdgeStyles = [new SelectedEdgePrintStyle()];
