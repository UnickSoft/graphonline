/**
 * New night edge styles.
 */

 
function NightCommonEdgeStyle()
{
  	BaseEdgeStyle.apply(this, arguments);

	this.strokeStyle = '#cbd5e1';
	this.weightText  = '#f8fafc';
	this.fillStyle   = '#020617';
	this.textPadding = 4;
	this.textStrokeWidth = 2;
	this.lineDash = 0;
	this.additionalTextColor = '#cbd5e1';
	this.weightPosition = WeightTextCenter;
}

NightCommonEdgeStyle.prototype = Object.create(BaseEdgeStyle.prototype);

function NightSelectedEdgeStyle0()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#fdba74';
	this.weightText  = '#fff7ed';
	this.fillStyle   = '#7c2d12';
	this.additionalTextColor = '#fff7ed';

  	this.baseStyles.push("common");
}

NightSelectedEdgeStyle0.prototype = Object.create(BaseEdgeStyle.prototype);

function NightSelectedEdgeStyle1()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#34d399';
	this.weightText  = '#ecfdf5';
	this.fillStyle   = '#064e3b';
	this.additionalTextColor = '#ecfdf5';

 	this.baseStyles.push("selected");
}
NightSelectedEdgeStyle1.prototype = Object.create(BaseEdgeStyle.prototype);

function NightSelectedEdgeStyle2()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#a5b4fc';
	this.weightText  = '#ecfeff';
	this.fillStyle   = '#312e81';
	this.additionalTextColor = '#ecfeff';

  	this.baseStyles.push("selected");
}
NightSelectedEdgeStyle2.prototype = Object.create(BaseEdgeStyle.prototype);


function NightSelectedEdgeStyle3()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#fca5a5';
	this.weightText  = '#fef2f2';
	this.fillStyle   = '#7f1d1d';
	this.additionalTextColor = '#fef2f2';

 	this.baseStyles.push("selected");
}
NightSelectedEdgeStyle3.prototype = Object.create(BaseEdgeStyle.prototype);

function NightSelectedEdgeStyle4()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#d4d4d8';
	this.weightText  = '#fafafa';
	this.fillStyle   = '#3f3f46';
	this.additionalTextColor = '#fafafa';

	this.baseStyles.push("selected");
}
NightSelectedEdgeStyle4.prototype = Object.create(BaseEdgeStyle.prototype);

function GetNightCommonEdgeStyle()
{
	return new NightCommonEdgeStyle();
}

var NightSelectedEdgeStyles      = [new NightSelectedEdgeStyle0(), new NightSelectedEdgeStyle1(), 
	new NightSelectedEdgeStyle2(), new NightSelectedEdgeStyle3(), new NightSelectedEdgeStyle4()];
