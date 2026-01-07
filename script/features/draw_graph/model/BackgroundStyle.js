/**
 * Graph drawer.
 */
 
 
function CommonBackgroundStyle()
{
  BaseBackgroundStyle.apply(this, arguments);

	this.commonColor   = '#ffffff';
	this.commonOpacity = 1.0;
  this.image = null;
}

CommonBackgroundStyle.prototype = Object.create(BaseBackgroundStyle.prototype);

function PrintBackgroundStyle()
{
  CommonBackgroundStyle.apply(this, arguments);

	this.commonColor   = '#ffffff';
	this.commonOpacity = 1.0;
  this.image = null;
}

PrintBackgroundStyle.prototype = Object.create(CommonBackgroundStyle.prototype);

function GetWhiteBackgroundStyle()
{
  return new CommonBackgroundStyle();
}

function DefaultCommonBackgroundStyle()
{
  return GetWhiteBackgroundStyle();
}

function DefaultPrintBackgroundStyle()
{
  return new PrintBackgroundStyle();
}