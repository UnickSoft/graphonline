/**
 * Graph drawer.
 */
 
 
function CommonBackgroundStyle()
{
	this.commonColor   = '#ffffff';
	this.commonOpacity = 1.0;
}

function PrintBackgroundStyle()
{
	this.commonColor   = '#ffffff';
	this.commonOpacity = 1.0;
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
    
    if (style.commonOpacity > 0.0)
    {
        context.globalAlpha = style.commonOpacity;
        context.fillStyle   = style.commonColor;
        context.fillRect(-rect.minPoint.x, -rect.minPoint.y, rect.size().x + 1, rect.size().y + 1);
        context.globalAlpha = 1.0;
    }
}
