/**
 * New Contrast edge styles.
 */

 function ContrastCommonEdgeStyle()
{
  	BaseEdgeStyle.apply(this, arguments);

	this.strokeStyle = '#000000';
	this.weightText  = '#000000';
	this.fillStyle   = '#ffffff';
	this.textPadding = 4;
	this.textStrokeWidth = 2;
	this.lineDash = 0;
	this.additionalTextColor = '#000000';
	this.weightPosition = WeightTextCenter;
	this.mainTextFontSize = 16;
}

ContrastCommonEdgeStyle.prototype = Object.create(BaseEdgeStyle.prototype);

function ContrastSelectedEdgeStyle0()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#000000';
	this.weightText  = '#000000';
	this.fillStyle   = '#ffffff';
	this.additionalTextColor = '#000000';
	this.lineDash = 1

  	this.baseStyles.push("common");
}

ContrastSelectedEdgeStyle0.prototype = Object.create(BaseEdgeStyle.prototype);

function GetContrastCommonEdgeStyle()
{
	return new ContrastCommonEdgeStyle();
}

var ContrastSelectedEdgeStyles      = [new ContrastSelectedEdgeStyle0(), new ContrastSelectedEdgeStyle0(), 
	new ContrastSelectedEdgeStyle0(), new ContrastSelectedEdgeStyle0(), new ContrastSelectedEdgeStyle0()];