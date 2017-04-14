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


function SelectedEdgeStyle0()
{
	CommonEdgeStyle.apply(this, arguments);  

	this.strokeStyle = '#f0d543';
	this.weightText  = '#f0d543';
	this.fillStyle   = '#c7627a';
}
SelectedEdgeStyle0.prototype = Object.create(CommonEdgeStyle.prototype);

function ProgressEdgeStyle()
{
    CommonEdgeStyle.apply(this, arguments);
    
    var selectedStyle = new SelectedEdgeStyle0();
    this.strokeStyle = selectedStyle.fillStyle;
    this.weightText  = '#000000';
    this.fillStyle   = '#000000';
}
ProgressEdgeStyle.prototype = Object.create(CommonEdgeStyle.prototype);

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

var selectedEdgeStyles = [new SelectedEdgeStyle0(), new SelectedEdgeStyle1(), 
	new SelectedEdgeStyle2(), new SelectedEdgeStyle3(), new SelectedEdgeStyle4()];


function BaseEdgeDrawer(context)
{ 
  this.context = context;
}

BaseEdgeDrawer.prototype.Draw = function(baseEdge, arcStyle) 
{
  this.SetupStyle(baseEdge, arcStyle);

  var positions = this.GetArcPositions(baseEdge.vertex1.position, baseEdge.vertex2.position, baseEdge.vertex1.model.diameter);
  
  this.DrawArc (positions[0], positions[1], arcStyle);
  if (baseEdge.useWeight)
  {
	this.DrawWeight(positions[0], positions[1], baseEdge.weight, arcStyle, baseEdge.hasPair);
  }
}


BaseEdgeDrawer.prototype.SetupStyle = function(baseEdge, arcStyle)
{
  this.context.lineWidth   = baseEdge.model.width;
  this.context.strokeStyle = arcStyle.strokeStyle;
  this.context.fillStyle   = arcStyle.fillStyle;
}

BaseEdgeDrawer.prototype.DrawArc = function(position1, position2, arcStyle)
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
    this.context.beginPath();
    this.context.moveTo(position1.x, position1.y);
    this.context.lineTo(position2.x, position2.y);
    this.context.closePath();
    this.context.stroke();  
  }
}

BaseEdgeDrawer.prototype.DrawWeight = function(position1, position2, text, arcStyle, hasPair)
{ 
  var textShift  = Math.min(12 / position1.subtract(position2).length(), 0.4);
  var centerPoint = Point.interpolate(position1, position2, 0.5 + (hasPair ? textShift : 0));
  if (position1.equals(position2))
  {
    centerPoint.y = centerPoint.y - Math.cos(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop * 2;
    centerPoint.x = centerPoint.x - Math.sin(arcStyle.loopShiftAngel) * arcStyle.sizeOfLoop * 2;
  }
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

BaseEdgeDrawer.prototype.GetArcPositions = function(position1, position2, diameter)
{
  var direction = position1.subtract(position2); 
  direction.normalize(1.0);
  direction = direction.multiply(0.5);
  
  var res = [];
  res.push(position1.subtract(direction.multiply(diameter)));
  res.push(position2.subtract(direction.multiply(-diameter)));
  return res;
}

BaseEdgeDrawer.prototype.GetArcPositionsShift = function(position1, position2, diameter, shift)
{
    if (shift == 0)
    {
        return this.GetArcPositions(position1, position2, diameter);
    }
    else
    {
        var direction = position1.subtract(position2);
        direction.normalize(1.0);
        var normal = direction.normal();
        direction = direction.multiply(0.5);
        position1 = position1.subtract(normal.multiply(shift));
        position2 = position2.subtract(normal.multiply(shift));
        diameter = Math.sqrt(diameter * diameter - shift * shift);
        var res = [];
        res.push(position1.subtract(direction.multiply(diameter)));
        res.push(position2.subtract(direction.multiply(-diameter)));
        return res;
    }  
}


/**
 * Direct Arc drawer.
 */
function DirectArcDrawer(context)
{ 
  this.context = context;
}

DirectArcDrawer.prototype = Object.create(BaseEdgeDrawer.prototype);

DirectArcDrawer.prototype.Draw = function(baseEdge, arcStyle) 
{
  baseDrawer = this.CreateBase();
  baseDrawer.SetupStyle(baseEdge, arcStyle);
  
  var length = baseEdge.model.width * 4;
  var width  = baseEdge.model.width * 2;
  var position1 = baseEdge.vertex1.position;
  var position2 = baseEdge.vertex2.position;
  var direction = position1.subtract(position2); 
  var pairShift = baseEdge.vertex1.model.diameter * 0.25;
  var realShift = (baseEdge.hasPair ? pairShift : 0);
  direction.normalize(1.0);
  var positions = this.GetArcPositionsShift(baseEdge.vertex1.position,
	baseEdge.vertex2.position, baseEdge.vertex1.model.diameter, realShift);
  
  baseDrawer.DrawArc (positions[0], positions[1].subtract(direction.multiply(-length / 2)), arcStyle);

  this.context.fillStyle = this.context.strokeStyle;
  this.context.lineWidth   = 0;
  this.DrawArrow(positions[0], positions[1], length, width);

  if (baseEdge.useWeight)
  {
	baseDrawer.DrawWeight(positions[0], positions[1], baseEdge.weight, arcStyle, baseEdge.hasPair);
  } 
}

DirectArcDrawer.prototype.DrawArrow = function(position1, position2, length, width) 
{
  var direction = position2.subtract(position1); 
  direction.normalize(1.0);
  var normal = direction.normal();
  
  var pointOnLine = position2.subtract(direction.multiply(length));
  var point1 = pointOnLine.add(normal.multiply(width));
  var point2 = pointOnLine.add(normal.multiply(-width));
  
  this.context.beginPath();
  this.context.moveTo(position2.x, position2.y);
  this.context.lineTo(point1.x, point1.y);
  this.context.lineTo(point2.x, point2.y);
  this.context.lineTo(position2.x, position2.y);
  this.context.closePath();
  this.context.fill();
}

DirectArcDrawer.prototype.CreateBase = function() 
{
	return new BaseEdgeDrawer(this.context);
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
    
    this.SetupStyle(baseEdge, new ProgressEdgeStyle());
    
    this.context.lineWidth = 10;
    
    var pairShift = baseEdge.vertex1.model.diameter * 0.25;
    var realShift = (baseEdge.hasPair ? pairShift : 0);
    var positions = this.GetArcPositionsShift(baseEdge.vertex1.position,
                                              baseEdge.vertex2.position, baseEdge.vertex1.model.diameter, realShift);
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
        var startPosition = Point.interpolate(positions[0], positions[1], this.progress);
        var vectorOffset = positions[0].subtract(positions[1]).normalizeCopy(progressSize);
        var finishPosition = startPosition.add(vectorOffset);
        
        this.context.beginPath();
        this.context.moveTo(startPosition.x, startPosition.y);
        this.context.lineTo(finishPosition.x, finishPosition.y);
        this.context.closePath();
        this.context.stroke();
    }
}






