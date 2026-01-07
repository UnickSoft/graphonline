/**
 * New edge styles.
 */

 
function WhiteCommonEdgeStyle()
{
  	BaseEdgeStyle.apply(this, arguments);

	this.strokeStyle = '#1e88e5';
	this.weightText  = '#263238';
	this.fillStyle   = '#ffffff';
	this.textPadding = 4;
	this.textStrokeWidth = 2;
	this.lineDash = 0;
	this.additionalTextColor = '#263238';
	this.weightPosition = WeightTextCenter;
}

WhiteCommonEdgeStyle.prototype = Object.create(BaseEdgeStyle.prototype);

function WhiteSelectedEdgeStyle0()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#fb8c00';
	this.weightText  = '#e65100';
	this.fillStyle   = '#fffee0';
	this.additionalTextColor = '#e65100';

  	this.baseStyles.push("common");
}
WhiteSelectedEdgeStyle0.prototype = Object.create(BaseEdgeStyle.prototype);

function WhiteSelectedEdgeStyle1()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#43a047';
	this.weightText  = '#1b5e20';
	this.fillStyle   = '#e8f5e9';
	this.additionalTextColor = '#1b5e20';

 	this.baseStyles.push("selected");
}
WhiteSelectedEdgeStyle1.prototype = Object.create(BaseEdgeStyle.prototype);

function WhiteSelectedEdgeStyle2()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#8e24aa';
	this.weightText  = '#4a148c';
	this.fillStyle   = '#f3e5f5';
	this.additionalTextColor = '#4a148c';

  	this.baseStyles.push("selected");
}
WhiteSelectedEdgeStyle2.prototype = Object.create(BaseEdgeStyle.prototype);


function WhiteSelectedEdgeStyle3()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#c62828';
	this.weightText  = '#8e0000';
	this.fillStyle   = '#fdecea';
	this.additionalTextColor = '#8e0000';

 	this.baseStyles.push("selected");
}
WhiteSelectedEdgeStyle3.prototype = Object.create(BaseEdgeStyle.prototype);

function WhiteSelectedEdgeStyle4()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#6d4c41';
	this.weightText  = '#3e2723';
	this.fillStyle   = '#efebe9';
	this.additionalTextColor = '#3e2723';

	this.baseStyles.push("selected");
}
WhiteSelectedEdgeStyle4.prototype = Object.create(BaseEdgeStyle.prototype);

function GetWhiteCommonEdgeStyle()
{
	return new WhiteCommonEdgeStyle();
}

var WhiteSelectedEdgeStyles      = [new WhiteSelectedEdgeStyle0(), new WhiteSelectedEdgeStyle1(), 
	new WhiteSelectedEdgeStyle2(), new WhiteSelectedEdgeStyle3(), new WhiteSelectedEdgeStyle4()];

function DefaultCommonEdgeStyle()
{
  return GetWhiteCommonEdgeStyle();
}

var DefaultSelectedEdgeStyles = WhiteSelectedEdgeStyles;