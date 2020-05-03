/**
 * Graph drawer.
 */
 
 
function CommonEdgeStyle()
{
	this.strokeStyle = '#c7b7c7';
	this.weightText  = '#f0d543';
 	this.fillStyle   = '#68aeba';
 	this.textPadding = 4;
	this.textStrockeWidth = 2;
 	this.sizeOfLoop = 24;
	this.loopShiftAngel = Math.PI / 6;
}

function CommonPrintEdgeStyle()
{
	CommonEdgeStyle.apply(this, arguments);
    
	this.strokeStyle = '#000000';
	this.weightText  = '#000000';
 	this.fillStyle   = '#FFFFFF';
}

function SelectedEdgeStyle0()
{
	CommonEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#f0d543';
	this.weightText  = '#f0d543';
	this.fillStyle   = '#c7627a';
}
SelectedEdgeStyle0.prototype = Object.create(CommonEdgeStyle.prototype);

function SelectedEdgeStyle1()
{
	CommonEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#8FBF83';
	this.weightText  = '#8FBF83';
	this.fillStyle   = '#F9F9D5';
}
SelectedEdgeStyle1.prototype = Object.create(CommonEdgeStyle.prototype);


function SelectedEdgeStyle2()
{
	CommonEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#8C4C86';
	this.weightText  = '#8C4C86';
	this.fillStyle   = '#253267';
}
SelectedEdgeStyle2.prototype = Object.create(CommonEdgeStyle.prototype);


function SelectedEdgeStyle3()
{
	CommonEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#6188FF';
	this.weightText  = '#6188FF';
	this.fillStyle   = '#E97CF9';
}
SelectedEdgeStyle3.prototype = Object.create(CommonEdgeStyle.prototype);


function SelectedEdgeStyle4()
{
	CommonEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#C6B484';
	this.weightText  = '#C6B484';
	this.fillStyle   = '#E0DEE1';
}
SelectedEdgeStyle4.prototype = Object.create(CommonEdgeStyle.prototype);

function SelectedEdgePrintStyle()
{
	CommonEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#AAAAAA';
	this.weightText  = '#000000';
	this.fillStyle   = '#AAAAAA';
}
SelectedEdgeStyle0.prototype = Object.create(CommonEdgeStyle.prototype);

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
  this.startArrowDiretion  = null;
  this.finishArrowDiretion = null;
  this.textCenterObject    = null;
  this.getPointOnArc       = null;   
    
  if (drawObjects)
  {
    if (drawObjects.hasOwnProperty("drawObject"))
      this.drawObject = drawObjects.drawObject;
    if (drawObjects.hasOwnProperty("drawArc"))
      this.drawArc = drawObjects.drawArc;
    if (drawObjects.hasOwnProperty("startArrowDiretion"))
      this.startArrowDiretion = drawObjects.startArrowDiretion;
    if (drawObjects.hasOwnProperty("finishArrowDiretion"))
      this.finishArrowDiretion = drawObjects.finishArrowDiretion;
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
    
  var lengthArrow = baseEdge.model.width * 4;
  var widthArrow  = baseEdge.model.width * 2;
  var position1 = baseEdge.vertex1.position;
  var position2 = baseEdge.vertex2.position;
  var direction = position1.subtract(position2); 
  direction.normalize(1.0);
  var positions = baseEdge.GetEdgePositionsShift();
  
  var hasStartStyle  = !position1.equals(position2) && baseEdge.GetStartEdgeStyle() != "";
  var hasFinishStyle = !position1.equals(position2) && baseEdge.GetFinishEdgeStyle() != "";
    
  this.DrawArc (positions[0], positions[1], arcStyle);

  this.context.fillStyle = this.context.strokeStyle;
  this.context.lineWidth = 0;

  if (hasStartStyle)
  {
    this.DrawArrow(positions[0], this.GetStartArrowDiretion(positions[0], positions[1], lengthArrow), lengthArrow, widthArrow);
  }
  if (hasFinishStyle)
  {
    this.DrawArrow(positions[1], this.GetFinishArrowDiretion(positions[0], positions[1], lengthArrow), lengthArrow, widthArrow);
  }
    
  this.SetupStyle(baseEdge, arcStyle);
    
  if (baseEdge.GetText().length > 0)
  {
	this.DrawWeight(positions[0], positions[1], baseEdge.GetText(), arcStyle, false);
  }

  if (baseEdge.GetUpText().length > 0)
  {
    this.DrawUpText(positions[0], positions[1], baseEdge.GetUpText(), arcStyle, false);
  }
}


BaseEdgeDrawer.prototype.SetupStyle = function(baseEdge, arcStyle)
{
  this.context.lineWidth   = baseEdge.model.width;
  this.context.strokeStyle = arcStyle.strokeStyle;
  this.context.fillStyle   = arcStyle.fillStyle;
  this.sizeOfLoop          = baseEdge.vertex1.model.diameter / 2;
}

BaseEdgeDrawer.prototype.DrawArc = function(position1, position2, arcStyle)
{
  if (this.drawArc && this.drawArc != this)
  {
      this.drawArc.DrawArc(position1, position2, arcStyle);
      return;
  }
    
  if (position1.equals(position2))
  {
    this.context.beginPath();
    this.context.arc(position1.x - Math.cos(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop, 
                     position1.y - Math.sin(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop, arcStyle.sizeOfLoop, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.stroke();
  }
  else
  {
    this.context.beginPath();
    this.context.moveTo(position1.x, position1.y);
    this.context.lineTo(position2.x, position2.y);
    this.context.closePath();
    this.context.stroke();  
  }
}

BaseEdgeDrawer.prototype.DrawWeight = function(position1, position2, text, arcStyle, hasPair)
{ 
  var centerPoint = this.GetTextCenterPoint(position1, position2, hasPair, arcStyle);
        
  this.context.font         = "bold 16px sans-serif";
  this.context.textBaseline = "middle";
  this.context.lineWidth    = arcStyle.textStrockeWidth;
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

BaseEdgeDrawer.prototype.DrawUpText = function(position1, position2, text, arcStyle, hasPair)
{ 
  var centerPoint = this.GetTextCenterPoint(position1, position2, hasPair, arcStyle);
        
  this.context.font         = "bold 12px sans-serif";
  this.context.textBaseline = "middle";

  var widthText = this.context.measureText(text).width;

  this.context.fillStyle = arcStyle.strokeStyle;	

  var vectorEdge   = new Point(position2.x - position1.x, position2.y - position1.y);
  var angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);
  if (angleRadians > Math.PI / 2 || angleRadians < -Math.PI / 2)
  {
    vectorEdge   = new Point(position1.x - position2.x, position1.y - position2.y);
    angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);          
  }
  var normalize    = vectorEdge.normal().normalizeCopy(20);
  this.context.save();
  this.context.translate(centerPoint.x - normalize.x, centerPoint.y - normalize.y);
  this.context.rotate(angleRadians);
  this.context.textAlign = "center";
  //context.textAlign = "center";
  //context.fillText("Your Label Here", labelXposition, 0);
    
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

BaseEdgeDrawer.prototype.GetStartArrowDiretion = function(position1, position2, lengthArrow) 
{
    if (this.startArrowDiretion && this.startArrowDiretion != this)
    {
      return this.startArrowDiretion.GetStartArrowDiretion(position1, position2, lengthArrow);
    }
    
    var direction = position1.subtract(position2);
    direction.normalize(1.0);
    return direction;
}

BaseEdgeDrawer.prototype.GetFinishArrowDiretion = function(position1, position2, lengthArrow) 
{
    if (this.finishArrowDiretion && this.finishArrowDiretion != this)
    {
      return this.finishArrowDiretion.GetFinishArrowDiretion(position1, position2, lengthArrow);
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
    centerPoint.y = centerPoint.y - Math.cos(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop * 2;
    centerPoint.x = centerPoint.x - Math.sin(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop * 2;
  } 
    
  return centerPoint;
}

BaseEdgeDrawer.prototype.GetPointOnArc = function (position1, position2, procent)
{
    if (this.getPointOnArc && this.getPointOnArc != this)
    {
      return this.getPointOnArc.GetPointOnArc(position1, position2, procent);
    }
    
  return Point.interpolate(position1, position2, procent);
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
        var sizeInRadian = progressSize / (2 * Math.PI * arcStyle.sizeOfLoop) * 6;
        
        this.context.beginPath();
        this.context.arc(positions[0].x - Math.cos(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop,
                         positions[0].y - Math.sin(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop, arcStyle.sizeOfLoop, this.progress * 2 * Math.PI, this.progress * 2 * Math.PI + sizeInRadian);
        this.context.closePath();
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
        this.context.closePath();
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
  if (position1.equals(position2))
  {
    this.context.beginPath();
    this.context.arc(position1.x - Math.cos(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop, 
                     position1.y - Math.sin(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop, arcStyle.sizeOfLoop, 0, 2 * Math.PI);
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
}

CurvedArcDrawer.prototype.GetStartArrowDiretion = function(position1, position2, lengthArrow) 
{
    var dist = position1.distance(position2);
    var direction = position1.subtract(this.model.GetCurvedPoint(position1, position2, lengthArrow / dist));
    direction.normalize(1.0);
    return direction;
}

CurvedArcDrawer.prototype.GetFinishArrowDiretion = function(position1, position2, lengthArrow) 
{
    var dist      = position1.distance(position2);
    var direction = position2.subtract(this.model.GetCurvedPoint(position1, position2, 1.0 - lengthArrow / dist));
    direction.normalize(1.0);
    return direction;
}

CurvedArcDrawer.prototype.GetTextCenterPoint = function (position1, position2, hasPair, arcStyle)
{
  var centerPoint = this.model.GetCurvedPoint(position1, position2, 0.5)
  if (position1.equals(position2))
  {
    centerPoint.y = centerPoint.y - Math.cos(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop * 2;
    centerPoint.x = centerPoint.x - Math.sin(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop * 2;
  } 
    
  return centerPoint;
}

CurvedArcDrawer.prototype.GetPointOnArc = function (position1, position2, procent)
{   
  return this.model.GetCurvedPoint(position1, position2, procent);
}
