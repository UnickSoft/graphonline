/**
 * Night vertex style.
 */


// Common style of Graphs.
function NightCommonVertexStyle()
{
  BaseVertexStyle.apply(this, arguments);

  this.lineWidth   = 2;
  this.strokeStyle = '#38bdf8';
  this.fillStyle   = '#334155';
  this.mainTextColor = '#e5e7eb';
  this.shape       = VertexCircleShape;
  this.upTextColor = '#94a3b8';
  this.commonTextPosition = CommonTextCenter;

  this.baseStyles = [];
}

NightCommonVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);

// Selected style of Graphs.

function NightSelectedVertexStyle0()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#fdba74';
	this.mainTextColor = '#fff7ed';
	this.fillStyle   = '#7c2d12';
	this.upTextColor = '#fff7ed';

	this.baseStyles.push("common");
}

NightSelectedVertexStyle0.prototype = Object.create(BaseVertexStyle.prototype);

function NightSelectedVertexStyle1()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#34d399';
	this.mainTextColor  = '#ecfdf5';
	this.fillStyle   = '#064e3b';
	this.upTextColor = '#ecfdf5';

	this.baseStyles.push("selected");
}

NightSelectedVertexStyle1.prototype = Object.create(BaseVertexStyle.prototype);

function NightSelectedVertexStyle2()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#a5b4fc';
	this.mainTextColor  = '#ffffff';
	this.fillStyle   = '#312e81';
	this.upTextColor = '#ffffff';

	this.baseStyles.push("selected");
}

NightSelectedVertexStyle2.prototype = Object.create(BaseVertexStyle.prototype);

function NightSelectedVertexStyle3()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#fca5a5';
	this.mainTextColor  = '#fef2f2';
	this.fillStyle   = '#7f1d1d';
	this.upTextColor = '#fef2f2';

	this.baseStyles.push("selected");
}

NightSelectedVertexStyle3.prototype = Object.create(BaseVertexStyle.prototype);

function NightSelectedVertexStyle4()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#d4d4d8';
	this.mainTextColor  = '#fafafa';
	this.fillStyle   = '#3f3f46';
	this.upTextColor = '#fafafa';

	this.baseStyles.push("selected");
}

NightSelectedVertexStyle4.prototype = Object.create(BaseVertexStyle.prototype);

function GetNightCommonVertexStyle()
{
	return new NightCommonVertexStyle();
}

var NightSelectedGraphStyles = [new NightSelectedVertexStyle0(), new NightSelectedVertexStyle1(),
	new NightSelectedVertexStyle2(), new NightSelectedVertexStyle3(), new NightSelectedVertexStyle4()];

