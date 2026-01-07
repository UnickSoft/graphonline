/**
 * Print Edge style.
 */

function CommonPrintEdgeStyle()
{
	BaseEdgeStyle.apply(this, arguments);
    
	this.strokeStyle = '#000000';
	this.weightText  = '#000000';
 	this.fillStyle   = '#FFFFFF';
 	this.textPadding = 4;
	this.textStrokeWidth = 2;

    this.baseStyles.push("common");
}
CommonPrintEdgeStyle.prototype = Object.create(BaseEdgeStyle.prototype);

function SelectedEdgePrintStyle()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#AAAAAA';
	this.weightText  = '#000000';
	this.fillStyle   = '#AAAAAA';

  this.baseStyles.push("printed");
}
SelectedEdgePrintStyle.prototype = Object.create(BaseEdgeStyle.prototype);


function DefaultCommonPrintEdgeStyle()
{
  return new CommonPrintEdgeStyle();
}

var DefaultPrintSelectedEdgeStyles = [new SelectedEdgePrintStyle()];
