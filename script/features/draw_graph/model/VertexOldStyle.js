/**
 * Old style.
 */

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


function GetOldCommonVertexStyle()
{
	return new CommonVertexStyle();
}

var OldSelectedGraphStyles = [new SelectedVertexStyle0(), new SelectedVertexStyle1(),
	new SelectedVertexStyle2(), new SelectedVertexStyle3(), new SelectedVertexStyle4()];

/*
function DefaultCommonVertexStyle()
{
	return new CommonVertexStyle();
}

var DefaultSelectedGraphStyles = [new SelectedVertexStyle0(), new SelectedVertexStyle1(),
	new SelectedVertexStyle2(), new SelectedVertexStyle3(), new SelectedVertexStyle4()];
*/
