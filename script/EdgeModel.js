/**
 * This is edge model
 *
 */

var EdgeModels = {"line": 0, "cruvled" : 1};
                
function EdgeModel()
{
    this.width = 4;
    this.type  = EdgeModels.line;
    this.curvedValue = EdgeModel.prototype.defaultCruved;
    this.default = true;
}

EdgeModel.prototype.defaultCruved = 0.1;

EdgeModel.prototype.copyFrom = function(other)
{
    this.width = other.width;
    this.type  = other.type;
    this.curvedValue = other.curvedValue;
    this.default     = other.default;
}

EdgeModel.prototype.SaveToXML = function ()
{
    return "model_width=\"" + this.width + "\" " +
	       "model_type=\""  + this.type   + "\" " +
	       "model_curvedValue=\""  + this.curvedValue + "\" "
           "model_default=\""  + this.default + "\" ";
}

EdgeModel.prototype.LoadFromXML = function (xml, graph)
{
	this.width = xml.attr('model_width') == null ? this.width : parseFloat(xml.attr("model_width"));
	this.type  = xml.attr('model_type')  == null ? this.type  : xml.attr("model_type");
	this.curvedValue  = xml.attr('model_curvedValue')  == null ? this.curvedValue : parseFloat(xml.attr("model_curvedValue"));
    this.default = xml.attr('model_default') == null ? this.default : parseFloat(xml.attr("model_default"));
}

EdgeModel.prototype.GetCurvedPoint = function(position1, position2, t)
{
    var points = this.GetBezierPoints(position1, position2);
    var firstBezierPoint  = points[0];  
    var secondBezierPoint = points[1];
    
    var B0_t = Math.pow(1-t, 3);
    var B1_t = 3 * t * Math.pow(1-t, 2);
    var B2_t = 3 * t*t * (1-t)
    var B3_t = t*t*t;
    
    var ax = position1.x;
    var ay = position1.y;
    var dx = position2.x;
    var dy = position2.y;
    var bx = firstBezierPoint.x;
    var by = firstBezierPoint.y;
    var cx = secondBezierPoint.x;
    var cy = secondBezierPoint.y;
    
    var px_t = (B0_t * ax) + (B1_t * bx) + (B2_t * cx) + (B3_t * dx);
    var py_t = (B0_t * ay) + (B1_t * by) + (B2_t * cy) + (B3_t * dy);
    
    return new Point(px_t, py_t);
}

EdgeModel.prototype.GetBezierPoints = function(position1, position2)
{
    var direction = position2.subtract(position1); 
    var delta     = direction.length();
    direction.normalize(1.0);  
    var normal = direction.normal();
    
    var deltaOffsetPixels = delta * this.curvedValue;
    var yOffset = normal.multiply(deltaOffsetPixels);
    var firstBezierPointShift  = (direction.multiply(delta * 0.2)).add(yOffset); 
    var secondBezierPointShift = (direction.multiply(-delta * 0.2)).add(yOffset); 
    var firstBezierPoint  = position1.add(firstBezierPointShift);  
    var secondBezierPoint = position2.add(secondBezierPointShift);
    
    return [firstBezierPoint, secondBezierPoint];
}


EdgeModel.prototype.HitTest = function(position1, position2, mousePos)
{
    if (this.type == EdgeModels.line)
        return this.HitTestLine(position1, position2, mousePos);
    else if (this.type == EdgeModels.cruvled)
        return this.HitTestCurved(position1, position2, mousePos);
    
    return false;
}


EdgeModel.prototype.HitTestLine = function(position1, position2, mousePos, factor)
{
    if (factor === undefined) 
    {
      factor = 1.0;
    }
    
    var pos1 = position1;
    var pos2 = position2;
    var pos0 = mousePos;
		
    var r1  = pos0.distance(pos1);
    var r2  = pos0.distance(pos2);
    var r12 = pos1.distance(pos2);
		
    if (r1 >= (new Point(r2, r12)).length() || r2 >= (new Point(r1,r12)).length())
    {
    }
    else		
    { 
        var distance = ((pos1.y - pos2.y) * pos0.x + (pos2.x - pos1.x) * pos0.y + (pos1.x * pos2.y - pos2.x * pos1.y)) / r12;

        if (Math.abs(distance) <= this.width * 1.5 * factor)
        {
            return true;
        }
    }
    
    return false;
}

EdgeModel.prototype.HitTestCurved = function(position1, position2, mousePos)
{
    var interval_count = position1.distance(position2) / 100 * 30;
    
    var start = position1;
    for (var i = 0; i < interval_count; i ++)
    {
        var finish = this.GetCurvedPoint(position1, position2, i / interval_count);
        
        if (this.HitTestLine(start, finish, mousePos, 2.0))
            return true;
        
        start = finish;
    }
    
    return false;
}

EdgeModel.prototype.ChangeCurvedValue = function (delta)
{
    if (this.type == EdgeModels.line)
    {
        this.type = EdgeModels.cruvled;
        this.curvedValue = 0.0;
    }

    this.curvedValue = this.curvedValue + delta;
    
    if (Math.abs(this.curvedValue) <= 0.01)
        this.type = EdgeModels.line;
    
    this.default = false;
}

EdgeModel.prototype.SetCurvedValue = function (value)
{
    if (this.type == EdgeModels.line)
    {
        this.type = EdgeModels.cruvled;
        this.curvedValue = 0.0;
    }

    this.curvedValue = value;
    
    if (Math.abs(this.curvedValue) <= 0.01)
        this.type = EdgeModels.line;
    
    this.default = false;
}
