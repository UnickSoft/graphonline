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

function NightBackgroundStyle()
{
  CommonBackgroundStyle.apply(this, arguments);

	this.commonColor   = '#0f172a';
	this.commonOpacity = 1.0;
  this.image = null;
}

NightBackgroundStyle.prototype = Object.create(CommonBackgroundStyle.prototype);

function GetWhiteBackgroundStyle()
{
  return new CommonBackgroundStyle();
}

function GetNightBackgroundStyle()
{
  return new NightBackgroundStyle();
}

function DefaultCommonBackgroundStyle()
{
  return GetWhiteBackgroundStyle();
}

function DefaultPrintBackgroundStyle()
{
  return new PrintBackgroundStyle();
}