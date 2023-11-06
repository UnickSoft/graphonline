/**
 * Graph drawer.
 */


 const lineDashTypes = [
          [],
          [4, 4],
          [12, 12],
          [16, 4, 4, 4],
        ];

// Common text position
const WeightTextCenter = 0,
      WeightTextUp     = 1;

 function BaseEdgeStyle()
 {
   this.baseStyles = [];
 }
 
 BaseEdgeStyle.prototype.GetStyle = function (baseStyle, object)
 {
   this.baseStyles.forEach(function(element) {
     var styleObject = globalApplication.GetStyle("edge", element, object);
     baseStyle       = styleObject.GetStyle(baseStyle, object);
   });
 
   if (this.hasOwnProperty('weightText'))
     baseStyle.weightText   = this.weightText;
   if (this.hasOwnProperty('strokeStyle'))
     baseStyle.strokeStyle = this.strokeStyle;
   if (this.hasOwnProperty('fillStyle'))
     baseStyle.fillStyle   = this.fillStyle;
   if (this.hasOwnProperty('textPadding'))
     baseStyle.textPadding = this.textPadding;
   if (this.hasOwnProperty('textStrokeWidth'))
     baseStyle.textStrokeWidth = this.textStrokeWidth;
   if (this.hasOwnProperty('lineDash'))
     baseStyle.lineDash = this.lineDash;
   if (this.hasOwnProperty('additionalTextColor'))
     baseStyle.additionalTextColor = this.additionalTextColor;
   if (this.hasOwnProperty('weightPosition'))
     baseStyle.weightPosition = this.weightPosition;
 
   return this.FixNewFields(baseStyle);
}
  
BaseEdgeStyle.prototype.FixNewFields = function (style)
{
  if (!style.hasOwnProperty('lineDash'))
    style.lineDash = 0;

  if (!style.hasOwnProperty('weightPosition'))
    style.weightPosition = WeightTextCenter;

  return style;
}

 BaseEdgeStyle.prototype.Clear = function ()
 {
    delete this.weightText;
    delete this.strokeStyle;
    delete this.fillStyle;
    delete this.textPadding;
    delete this.textStrokeWidth;
    delete this.lineDash;
    delete this.additionalTextColor;
    delete this.weightPosition;
 }

 BaseEdgeStyle.prototype.ShouldLoad = function (field)
 {
   return field != "baseStyles";
 }
 
function CommonEdgeStyle()
{
  BaseEdgeStyle.apply(this, arguments);

	this.strokeStyle = '#c7b7c7';
	this.weightText  = '#f0d543';
 	this.fillStyle   = '#68aeba';
 	this.textPadding = 4;
	this.textStrokeWidth = 2;
  this.lineDash = 0;
  this.additionalTextColor = '#c7b7c7';
  this.weightPosition = WeightTextCenter;
}

CommonEdgeStyle.prototype = Object.create(BaseEdgeStyle.prototype);

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

function SelectedEdgeStyle0()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#f0d543';
	this.weightText  = '#f0d543';
	this.fillStyle   = '#c7627a';

  this.baseStyles.push("common");
}
SelectedEdgeStyle0.prototype = Object.create(BaseEdgeStyle.prototype);

function SelectedEdgeStyle1()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#8FBF83';
	this.weightText  = '#8FBF83';
	this.fillStyle   = '#F9F9D5';

  this.baseStyles.push("selected");
}
SelectedEdgeStyle1.prototype = Object.create(BaseEdgeStyle.prototype);

function SelectedEdgeStyle2()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#8C4C86';
	this.weightText  = '#8C4C86';
	this.fillStyle   = '#253267';

  this.baseStyles.push("selected");
}
SelectedEdgeStyle2.prototype = Object.create(BaseEdgeStyle.prototype);


function SelectedEdgeStyle3()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#6188FF';
	this.weightText  = '#6188FF';
	this.fillStyle   = '#E97CF9';

  this.baseStyles.push("selected");
}
SelectedEdgeStyle3.prototype = Object.create(BaseEdgeStyle.prototype);


function SelectedEdgeStyle4()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#C6B484';
	this.weightText  = '#C6B484';
	this.fillStyle   = '#E0DEE1';

  this.baseStyles.push("selected");
}
SelectedEdgeStyle4.prototype = Object.create(BaseEdgeStyle.prototype);

function SelectedEdgePrintStyle()
{
	BaseEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#AAAAAA';
	this.weightText  = '#000000';
	this.fillStyle   = '#AAAAAA';

  this.baseStyles.push("printed");
}
SelectedEdgePrintStyle.prototype = Object.create(BaseEdgeStyle.prototype);

var DefaultSelectedEdgeStyles      = [new SelectedEdgeStyle0(), new SelectedEdgeStyle1(), 
	new SelectedEdgeStyle2(), new SelectedEdgeStyle3(), new SelectedEdgeStyle4()];

var DefaultPrintSelectedEdgeStyles = [new SelectedEdgePrintStyle()];

function BaseEdgeDrawer(context, drawObjects)
{ 
  if (drawObjects === undefined) 
  {
    drawObjects = null;
  }
    
  this.context = context;
    
  this.drawObject = null;
  this.drawArc = null;
  this.startArrowDirection  = null;
  this.finishArrowDirection = null;
  this.textCenterObject    = null;
  this.getPointOnArc       = null;   
    
  if (drawObjects)
  {
    if (drawObjects.hasOwnProperty("drawObject"))
      this.drawObject = drawObjects.drawObject;
    if (drawObjects.hasOwnProperty("drawArc"))
      this.drawArc = drawObjects.drawArc;
    if (drawObjects.hasOwnProperty("startArrowDirection"))
      this.startArrowDirection = drawObjects.startArrowDirection;
    if (drawObjects.hasOwnProperty("finishArrowDirection"))
      this.finishArrowDirection = drawObjects.finishArrowDirection;
    if (drawObjects.hasOwnProperty("textCenterObject"))
      this.textCenterObject = drawObjects.textCenterObject;
    if (drawObjects.hasOwnProperty("getPointOnArc"))
      this.getPointOnArc = drawObjects.getPointOnArc;
  }
}

BaseEdgeDrawer.prototype.Draw = function(baseEdge, arcStyle) 
{
  if (this.drawObject && this.drawObject != this)
  {
    this.drawObject.Draw(baseEdge, arcStyle);
    return;
  }
    
  this.SetupStyle(baseEdge, arcStyle);
    
  var lengthArrow = Math.max(baseEdge.model.width * 4, 8);
  var widthArrow  =  Math.max(baseEdge.model.width * 2, 4);
  var position1 = baseEdge.vertex1.position;
  var position2 = baseEdge.vertex2.position;
  var direction = position1.subtract(position2); 
  direction.normalize(1.0);
  var positions = baseEdge.GetEdgePositionsShift();
  
  var hasStartStyle  = !position1.equals(position2) && baseEdge.GetStartEdgeStyle() != "";
  var hasFinishStyle = !position1.equals(position2) && baseEdge.GetFinishEdgeStyle() != "";
    
  var arcPos1 = positions[0];
  var arcPos2 = positions[1];

  if (hasStartStyle)
  {
    var dirArrow = this.GetStartArrowDirection(positions[0], positions[1], lengthArrow);
    arcPos1 = arcPos1.add(dirArrow.multiply(lengthArrow / 2));
  }

  if (hasFinishStyle)
  {
    var dirArrow = this.GetFinishArrowDirection(positions[0], positions[1], lengthArrow);
    arcPos2 = arcPos2.add(dirArrow.multiply(-lengthArrow / 2));
  }

  this.DrawArc (arcPos1, arcPos2, arcStyle);

  this.context.fillStyle = this.context.strokeStyle;
  this.context.lineWidth = 0;

  if (hasStartStyle)
  {
    this.DrawArrow(positions[0], this.GetStartArrowDirection(positions[0], positions[1], lengthArrow), lengthArrow, widthArrow);
  }
  if (hasFinishStyle)
  {
    this.DrawArrow(positions[1], this.GetFinishArrowDirection(positions[0], positions[1], lengthArrow), lengthArrow, widthArrow);
  }
    
  this.SetupStyle(baseEdge, arcStyle);

  if (arcStyle.weightPosition == WeightTextCenter)
  {
    if (baseEdge.GetText().length > 0)
    {
      this.DrawWeight(positions[0], positions[1], baseEdge.GetText(), arcStyle, false);
    }

    if (baseEdge.GetUpText().length > 0)
    {
      this.DrawUpText(positions[0], positions[1], baseEdge.GetUpText(), arcStyle, false, arcStyle.additionalTextColor, baseEdge.model.width / 2 + 20, null);
    }
  }
  else if (arcStyle.weightPosition == WeightTextUp)
  {
    if (baseEdge.GetText().length > 0)
    {
      this.DrawUpText(positions[0], positions[1], baseEdge.GetText(), arcStyle, false, arcStyle.weightText, baseEdge.model.width / 2 + 10, "16px");
    }
    
    if (baseEdge.GetUpText().length > 0)
    {
      this.DrawUpText(positions[0], positions[1], baseEdge.GetUpText(), arcStyle, false, arcStyle.additionalTextColor, - baseEdge.model.width / 2 - 15, null);
    }
  }
}


BaseEdgeDrawer.prototype.SetupStyle = function(baseEdge, arcStyle)
{
  this.context.lineWidth   = baseEdge.model.width;
  this.context.strokeStyle = arcStyle.strokeStyle;
  this.context.fillStyle   = arcStyle.fillStyle;
  this.model               = baseEdge.model;
  this.style               = arcStyle;
}

BaseEdgeDrawer.prototype.DrawArc = function(position1, position2, arcStyle)
{
  if (this.drawArc && this.drawArc != this)
  {
      this.drawArc.DrawArc(position1, position2, arcStyle);
      return;
  }
   
  this.context.setLineDash(lineDashTypes[arcStyle.lineDash]);
  if (position1.equals(position2))
  {
    this.context.beginPath();
    this.context.arc(position1.x - Math.cos(this.model.GetLoopShiftAngel()) * this.model.GetLoopSize(), 
                     position1.y - Math.sin(this.model.GetLoopShiftAngel()) * this.model.GetLoopSize(), this.model.GetLoopSize(), 0, 2 * Math.PI);
    this.context.stroke();
  }
  else
  {
    this.context.beginPath();
    this.context.moveTo(position1.x, position1.y);
    this.context.lineTo(position2.x, position2.y);
    this.context.stroke();
  }
  this.context.setLineDash([]);  
}

BaseEdgeDrawer.prototype.DrawWeight = function(position1, position2, text, arcStyle, hasPair)
{ 
  var centerPoint = this.GetTextCenterPoint(position1, position2, hasPair, arcStyle);
        
  this.context.font         = "bold 16px sans-serif";
  this.context.textBaseline = "middle";
  this.context.lineWidth    = arcStyle.textStrokeWidth;
  this.context.fillStyle    = arcStyle.fillStyle;	

  var widthText = this.context.measureText(text).width;

  this.context.beginPath();
  this.context.rect(centerPoint.x - widthText / 2 - arcStyle.textPadding / 2, 
                    centerPoint.y - 8 - arcStyle.textPadding / 2, 
                    widthText + arcStyle.textPadding, 16 + arcStyle.textPadding);
  this.context.closePath();
  this.context.fill();
  this.context.stroke ();

  this.context.fillStyle = arcStyle.weightText;	
  this.context.fillText(text, centerPoint.x - widthText / 2, centerPoint.y);
}

BaseEdgeDrawer.prototype.DrawUpText = function(position1, position2, text, arcStyle, hasPair, color, offset, fontSize)
{ 
  var centerPoint = this.GetTextCenterPoint(position1, position2, hasPair, arcStyle);
        
  this.context.font         = fontSize == null ? "bold 12px sans-serif" : "bold " + fontSize + " sans-serif";
  this.context.textBaseline = "middle";

  var widthText = this.context.measureText(text).width;

  this.context.fillStyle = color;	

  var vectorEdge   = new Point(position2.x - position1.x, position2.y - position1.y);
  var angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);
  if (angleRadians > Math.PI / 2 || angleRadians < -Math.PI / 2)
  {
    vectorEdge   = new Point(position1.x - position2.x, position1.y - position2.y);
    angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);          
  }
  var normalize    = vectorEdge.normal().normalizeCopy(offset);
  this.context.save();
  this.context.translate(centerPoint.x - normalize.x, centerPoint.y - normalize.y);
  this.context.rotate(angleRadians);
  this.context.textAlign = "center";
    
  this.context.fillText(text, 0, 0);

  this.context.restore();
}

BaseEdgeDrawer.prototype.DrawArrow = function(position, direction, length, width) 
{
  var normal = direction.normal();
  
  var pointOnLine = position.subtract(direction.multiply(length));
  var point1 = pointOnLine.add(normal.multiply(width));
  var point2 = pointOnLine.add(normal.multiply(-width));
  
  this.context.beginPath();
  this.context.moveTo(position.x, position.y);
  this.context.lineTo(point1.x, point1.y);
  this.context.lineTo(point2.x, point2.y);
  this.context.lineTo(position.x, position.y);
  this.context.closePath();
  this.context.fill();
}

BaseEdgeDrawer.prototype.GetStartArrowDirection = function(position1, position2, lengthArrow) 
{
    if (this.startArrowDirection && this.startArrowDirection != this)
    {
      return this.startArrowDirection.GetStartArrowDirection(position1, position2, lengthArrow);
    }
    
    var direction = position1.subtract(position2);
    direction.normalize(1.0);
    return direction;
}

BaseEdgeDrawer.prototype.GetFinishArrowDirection = function(position1, position2, lengthArrow) 
{
    if (this.finishArrowDirection && this.finishArrowDirection != this)
    {
      return this.finishArrowDirection.GetFinishArrowDirection(position1, position2, lengthArrow);
    }

    var direction = position2.subtract(position1);
    direction.normalize(1.0);
    return direction;
}

BaseEdgeDrawer.prototype.GetTextCenterPoint = function (position1, position2, hasPair, arcStyle)
{
  if (this.textCenterObject && this.textCenterObject != this)
  {
    return this.textCenterObject.GetTextCenterPoint(position1, position2, hasPair, arcStyle);
  }
    
  var textShift   = Math.min(12 / position1.subtract(position2).length(), 0.4);
  var centerPoint = Point.interpolate(position1, position2, 0.5);
  if (position1.equals(position2))
  {
      let sinVal = Math.sin(this.model.GetLoopShiftAngel());
      let cosVal = Math.cos(this.model.GetLoopShiftAngel());
      centerPoint.x = centerPoint.x - cosVal * this.model.GetLoopSize();
      centerPoint.y = centerPoint.y - (sinVal + Math.sign(sinVal) * 1.0)  * this.model.GetLoopSize();
  } 
    
  return centerPoint;
}

BaseEdgeDrawer.prototype.GetPointOnArc = function (position1, position2, percent)
{
    if (this.getPointOnArc && this.getPointOnArc != this)
    {
      return this.getPointOnArc.GetPointOnArc(position1, position2, percent);
    }
    
  return Point.interpolate(position1, position2, percent);
}

function ProgressArcDrawer(context, baseDrawer, progress)
{
    this.context    = context;
    this.baseDrawer = baseDrawer;
    this.progress   = progress;
}

ProgressArcDrawer.prototype = Object.create(BaseEdgeDrawer.prototype);


ProgressArcDrawer.prototype.Draw = function(baseEdge, arcStyle)
{
    this.baseDrawer.Draw(baseEdge, arcStyle);
    
    this.context.lineWidth = 10;
    
    var positions = baseEdge.GetEdgePositionsShift();
    var progressSize = 10;
    
    if (positions[0].equals(positions[1]))
    {
        var sizeInRadian = progressSize / (2 * Math.PI * this.baseDrawer.model.GetLoopSize()) * 6;
        
        this.context.beginPath();
        this.context.arc(positions[0].x - Math.cos(this.baseDrawer.model.GetLoopShiftAngel()) * this.baseDrawer.model.GetLoopSize(),
                         positions[0].y - Math.sin(this.baseDrawer.model.GetLoopShiftAngel()) * this.baseDrawer.model.GetLoopSize(), this.baseDrawer.model.GetLoopSize(), this.progress * 2 * Math.PI, this.progress * 2 * Math.PI + sizeInRadian);
        this.context.stroke();
    }
    else
    {
        var startPosition  = this.baseDrawer.GetPointOnArc(positions[0], positions[1], this.progress);
        var vectorOffset   = positions[0].subtract(positions[1]).normalizeCopy(progressSize);
        var finishPosition = startPosition.add(vectorOffset);
        
        this.context.beginPath();
        this.context.moveTo(startPosition.x, startPosition.y);
        this.context.lineTo(finishPosition.x, finishPosition.y);
        this.context.stroke();
    }
}


function CurvedArcDrawer(context, model)
{
    this.context = context;
    this.model   = model;
}

CurvedArcDrawer.prototype = Object.create(BaseEdgeDrawer.prototype);

CurvedArcDrawer.prototype.DrawArc = function(position1, position2, arcStyle)
{
  this.context.setLineDash(lineDashTypes[arcStyle.lineDash]);
  if (position1.equals(position2))
  {
    this.context.beginPath();
    this.context.arc(position1.x - Math.cos(this.model.GetLoopShiftAngel()) * this.model.GetLoopSize(), 
                     position1.y - Math.sin(this.model.GetLoopShiftAngel()) * this.model.GetLoopSize(), this.model.GetLoopSize(), 0, 2 * Math.PI);
    this.context.closePath();
    this.context.stroke();
  }
  else
  {
    var points = this.model.GetBezierPoints(position1, position2);
    var firstBezierPoint  = points[0];  
    var secondBezierPoint = points[1];
    
    this.context.beginPath();
    this.context.moveTo(position1.x, position1.y);
    this.context.bezierCurveTo(firstBezierPoint.x, firstBezierPoint.y, secondBezierPoint.x, secondBezierPoint.y, position2.x, position2.y);
    this.context.stroke(); 
  }
  this.context.setLineDash([]);
}

CurvedArcDrawer.prototype.GetStartArrowDirection = function(position1, position2, lengthArrow) 
{
    var dist = position1.distance(position2);
    var direction = position1.subtract(this.model.GetCurvePoint(position1, position2, lengthArrow / dist));
    direction.normalize(1.0);
    return direction;
}

CurvedArcDrawer.prototype.GetFinishArrowDirection = function(position1, position2, lengthArrow) 
{
    var dist      = position1.distance(position2);
    var direction = position2.subtract(this.model.GetCurvePoint(position1, position2, 1.0 - lengthArrow / dist));
    direction.normalize(1.0);
    return direction;
}

CurvedArcDrawer.prototype.GetTextCenterPoint = function (position1, position2, hasPair, arcStyle)
{
  var centerPoint = this.model.GetCurvePoint(position1, position2, 0.5)
  if (position1.equals(position2))
  {
    let sinVal = Math.sin(this.model.GetLoopShiftAngel());
    let cosVal = Math.cos(this.model.GetLoopShiftAngel());
    centerPoint.x = centerPoint.x - cosVal * this.model.GetLoopSize();
    centerPoint.y = centerPoint.y - (sinVal + Math.sign(sinVal) * 1.0)  * this.model.GetLoopSize();
  } 
    
  return centerPoint;
}

CurvedArcDrawer.prototype.GetPointOnArc = function (position1, position2, percent)
{   
  return this.model.GetCurvePoint(position1, position2, percent);
}
