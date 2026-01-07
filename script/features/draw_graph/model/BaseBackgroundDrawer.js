/**
 * Graph drawer.
 */
 
 
function BaseBackgroundStyle()
{
	this.commonColor   = '#ffffff';
	this.commonOpacity = 1.0;
  this.image = null;
}

BaseBackgroundStyle.prototype.Clear = function ()
{
  delete this.commonColor;
  delete this.commonOpacity;
  delete this.image;
}

BaseBackgroundStyle.prototype.ShouldLoad = function (field)
{
  return true;
}

BaseBackgroundStyle.prototype.saveToJson = function (field)
{
  return JSON.stringify({commonColor: this.commonColor, commonOpacity: this.commonOpacity, image: this.image != null ? this.image.src : null});
}

BaseBackgroundStyle.prototype.loadFromJson = function (json, callbackOnLoaded)
{
  this.commonColor   = json["commonColor"];
  this.commonOpacity = json["commonOpacity"];
  this.image = null;
  if (typeof json["image"] === 'string') {
    this.image = new Image();
    this.image.onload = function() {
      callbackOnLoaded();
    }
    this.image.src = json["image"];
  }
}

function BaseBackgroundDrawer(context)
{   
  this.context = context;
}

BaseBackgroundDrawer.prototype.Draw = function(style, width, height, position, scale) 
{
    var context = this.context;
    
    var rect = new Rect(position, position.add(new Point(width / scale, height / scale)));
    
    context.clearRect(-rect.minPoint.x, -rect.minPoint.y, rect.size().x + 1, rect.size().y + 1);
    
    var oldOpacity = context.globalAlpha;
    if (style.commonOpacity > 0.0)
    {
        context.globalAlpha = style.commonOpacity;
        context.fillStyle   = style.commonColor;
        context.fillRect(-rect.minPoint.x, -rect.minPoint.y, rect.size().x + 1, rect.size().y + 1);    
        this.DrawImage(style, width, height, position, scale);        
    }
    context.globalAlpha = oldOpacity;    
}

BaseBackgroundDrawer.prototype.DrawImage = function(style, width, height, position, scale) 
{
    if (style.image == null) {
        return;
    }

    var context = this.context;
    
    context.clearRect(0, 0, style.image.width, style.image.height);    
    context.drawImage(style.image, 0, 0)
}