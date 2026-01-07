/**
 * Print style.
 */

function CommonPrintVertexStyle()
{
  BaseVertexStyle.apply(this, arguments);
  
  this.strokeStyle = '#000000';
  this.fillStyle   = '#FFFFFF';
  this.mainTextColor = '#000000';

  this.baseStyles.push("common");
}

CommonPrintVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);

function SelectedPrintVertexStyle()
{
	BaseVertexStyle.apply(this, arguments);

	this.strokeStyle   = '#000000';
	this.mainTextColor = '#000000';
	this.fillStyle     = '#AAAAAA';

	this.baseStyles.push("printed");
}

SelectedPrintVertexStyle.prototype = Object.create(BaseVertexStyle.prototype);

function DefaultCommonPrintVertexStyle()
{
	return new CommonPrintVertexStyle();
}

var DefaultPrintSelectedGraphStyles = [new SelectedPrintVertexStyle()];
