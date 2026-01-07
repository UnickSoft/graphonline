/**
 * Old edge styles.
 */
 
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

function GetOldCommonEdgeStyle()
{
  return new CommonEdgeStyle();
}

var OldSelectedEdgeStyles      = [new SelectedEdgeStyle0(), new SelectedEdgeStyle1(), 
	new SelectedEdgeStyle2(), new SelectedEdgeStyle3(), new SelectedEdgeStyle4()];

/*
function DefaultCommonEdgeStyle()
{
  return new CommonEdgeStyle();
}

var DefaultSelectedEdgeStyles      = [new SelectedEdgeStyle0(), new SelectedEdgeStyle1(), 
	new SelectedEdgeStyle2(), new SelectedEdgeStyle3(), new SelectedEdgeStyle4()];
*/