/**
 * White vertex style.
 */


// Common style of Graphs.
function WhiteCommonVertexStyle()
{
  BaseVertexStyle.apply(this, arguments);

  this.lineWidth   = 2;
  this.strokeStyle = '#1e88e5';
  this.fillStyle   = '#e3f2fd';
  this.mainTextColor = '#0d47a1';
  this.shape       = VertexCircleShape;
  this.upTextColor = '#455a64';
  this.commonTextPosition = CommonTextCenter;

  this.baseStyles = [];
}

WhiteCommonVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);

// Selected style of Graphs.
function WhiteSelectedVertexStyle0()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#fb8c00';
	this.mainTextColor  = '#e65100';
	this.fillStyle   = '#fff3e0';
	this.upTextColor = '#e65100';

	this.baseStyles.push("common");
}

WhiteSelectedVertexStyle0.prototype = Object.create(BaseVertexStyle.prototype);

function WhiteSelectedVertexStyle1()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#43a047';
	this.mainTextColor  = '#1b5e20';
	this.fillStyle   = '#e8f5e9';
	this.upTextColor = '#1b5e20';

	this.baseStyles.push("selected");
}

WhiteSelectedVertexStyle1.prototype = Object.create(BaseVertexStyle.prototype);

function WhiteSelectedVertexStyle2()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#8e24aa';
	this.mainTextColor = '#4a148c';
	this.fillStyle   = '#f3e5f5';
	this.upTextColor = '#4a148c';

	this.baseStyles.push("selected");
}

WhiteSelectedVertexStyle2.prototype = Object.create(BaseVertexStyle.prototype);

function WhiteSelectedVertexStyle3()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#c62828';
	this.mainTextColor  = '#8e0000';
	this.fillStyle   = '#fdecea';
	this.upTextColor = '#8e0000';

	this.baseStyles.push("selected");
}

WhiteSelectedVertexStyle3.prototype = Object.create(BaseVertexStyle.prototype);

function WhiteSelectedVertexStyle4()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#6d4c41';
	this.mainTextColor  = '#3e2723';
	this.fillStyle   = '#efebe9';
	this.upTextColor = '#3e2723';

	this.baseStyles.push("selected");
}

WhiteSelectedVertexStyle4.prototype = Object.create(BaseVertexStyle.prototype);

function GetWhiteCommonVertexStyle()
{
	return new WhiteCommonVertexStyle();
}

var WhiteSelectedGraphStyles = [new WhiteSelectedVertexStyle0(), new WhiteSelectedVertexStyle1(),
	new WhiteSelectedVertexStyle2(), new WhiteSelectedVertexStyle3(), new WhiteSelectedVertexStyle4()];


function DefaultCommonVertexStyle()
{
	return GetWhiteCommonVertexStyle();
}

var DefaultSelectedGraphStyles = WhiteSelectedGraphStyles;
