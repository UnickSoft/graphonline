/**
 * Contrast vertex style.
 */

// Common style of Graphs.
function ContrastCommonVertexStyle()
{
  BaseVertexStyle.apply(this, arguments);

  this.lineWidth   = 4;
  this.strokeStyle = '#000000';
  this.fillStyle   = '#ffffff';
  this.mainTextColor = '#000000';
  this.shape       = VertexCircleShape;
  this.upTextColor = '#000000';
  this.commonTextPosition = CommonTextCenter;
  this.mainTextFontSize = 16;

  this.baseStyles = [];
}

ContrastCommonVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);

// Selected style of Graphs.

function ContrastSelectedVertexStyle0()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle = '#000000';
	this.mainTextColor = '#ffffff';
	this.fillStyle   = '#000000';
	this.upTextColor = '#ffffff';

	this.baseStyles.push("common");
}

ContrastSelectedVertexStyle0.prototype = Object.create(BaseVertexStyle.prototype);

function GetContrastCommonVertexStyle()
{
	return new ContrastCommonVertexStyle();
}

var ContrastSelectedGraphStyles = [new ContrastSelectedVertexStyle0(), new ContrastSelectedVertexStyle0(),
	new ContrastSelectedVertexStyle0(), new ContrastSelectedVertexStyle0(), new ContrastSelectedVertexStyle0()];

