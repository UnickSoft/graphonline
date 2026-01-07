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
	  DefaultMainTextFontSizeEdge = 13,
	  TopTextFontSizeDeltaEdge    = -2; // 2 less then main.

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

