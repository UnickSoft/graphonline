/**
 *  Place here all tests constans.
 *
 */


var g_textsSelectAndMove = "Drag objects";
var g_moveCursorForMoving = "Move cursor";
var g_clickToAddVertex = "Click to add vertex";
var g_selectFisrtVertexToConnect = "Select first vertex to connect";
var g_selectSecondVertexToConnect = "Select second vertex to connect";
var g_selectStartVertexForShortPath = "Select start vertex for shortest path";
var g_selectFinishVertexForShortPath = "Select finish vertex for shortest path";
var g_shortestPathResult = "Shortest path is %d";
var g_pathNotExists = "Path does not exists";
var g_selectObjectToDelete = "Select object to delete";


var g_addEdge = "Add edge";
var g_orintEdge = "Orient";
var g_notOrintEdge = "not Orient";

var g_adjacencyMatrixText = "Adjacency Matrix";
var g_save   = "Save";
var g_cancel = "Cancel";

var g_shortestDistance = "lowest-distance is ";
var g_incidenceMatrixText = "Incidence Matrix";

var g_save_dialog = "Save dialog";
var g_close       = "close";
var g_sickConnectedComponent = "Sick connected component is ";
var g_connectedComponent = "Connected component is ";


var g_what_do_you_think = "What do you think about site?";
var g_name = "Name";
var g_feedback = "Feedback";
var g_send = "Send";
var g_write_to_us = "Write to us";	        

var g_fixMatrix      = "Fix matrix";
var g_readMatrixHelp = "Matrix format help";
var g_matrixWrongFormat = "Matrix is wrong";

var g_save_image_dialog = "Save graph image";

var g_fullReport = "Full report";

var g_shortReport = "Short report";

var g_hasEulerianLoop = "Graph has Eulerian Loop";
var g_hasNotEulerianLoop  = "Graph has not Eulerian Loop";

var g_processing = "Processing...";

var g_customEnumVertex = "Custom";
var g_addVertex = "Add vertex";

var g_renameVertex = "Rename vertex";
var g_rename = "Rename";

var g_language = "en";

var g_editWeight = "Edit weight";

var g_noWeight = "No weight";
var g_groupRename = "Group rename";

function loadTexts()
{
	g_textsSelectAndMove  = document.getElementById("SelectAndMoveObject").innerHTML;
	g_moveCursorForMoving = document.getElementById("MoveCursorForMoving").innerHTML;
	g_clickToAddVertex = document.getElementById("clickToAddVertex").innerHTML;
	g_selectFisrtVertexToConnect = document.getElementById("selectFisrtVertextToConnect").innerHTML;
	g_selectSecondVertexToConnect = document.getElementById("selectSecondVertextToConnect").innerHTML;
	g_selectStartVertexForShortPath = document.getElementById("selectStartShortPathVertex").innerHTML;
	g_selectFinishVertexForShortPath = document.getElementById("selectFinishShortPathVertex").innerHTML;
	g_shortestPathResult = document.getElementById("shortPathResult").innerHTML;
	g_pathNotExists = document.getElementById("pathNotExists").innerHTML;
	g_selectObjectToDelete = document.getElementById("selectObjectToDelete").innerHTML;

	g_addEdge             = document.getElementById("AddEdge").innerHTML;
	g_orintEdge           = document.getElementById("OrintEdge").innerHTML;
	g_notOrintEdge        = document.getElementById("NotOrintdge").innerHTML;

	g_adjacencyMatrixText = document.getElementById("AdjacencyMatrixText").innerHTML;
	g_save   = document.getElementById("Save").innerHTML;
	g_cancel = document.getElementById("Cancel").innerHTML;

        g_shortestDistance = document.getElementById("shortestDist").innerHTML;

        g_incidenceMatrixText = document.getElementById("IncidenceMatrixText").innerHTML;
	
	g_save_dialog = document.getElementById("saveDialogTitle").innerHTML;
	g_close       = document.getElementById("closeButton").innerHTML;

	g_sickConnectedComponent = document.getElementById("sickConnectedComponentResult").innerHTML;
	g_connectedComponent     = document.getElementById("connectedComponentResult").innerHTML;

	g_what_do_you_think = document.getElementById("whatDoYouThink").innerHTML;
	g_name = document.getElementById("name").innerHTML;
	g_feedback = document.getElementById("feedback").innerHTML;
	g_send = document.getElementById("send").innerHTML;
	g_write_to_us = document.getElementById("writeToUs").innerHTML;


	g_fixMatrix      = document.getElementById("fixMatrixButton").innerHTML;
	g_readMatrixHelp = document.getElementById("matrixHelp").innerHTML;
	g_matrixWrongFormat = document.getElementById("wronMatrixTitle").innerHTML;
    
    g_save_image_dialog = document.getElementById("saveImageDialogTitle").innerHTML;
    
    g_fullReport = document.getElementById("fullReport").innerHTML;
    g_shortReport = document.getElementById("shortReport").innerHTML;
    
    
    g_hasEulerianLoop    = document.getElementById("hasEulerianLoop").innerHTML;
    g_hasNotEulerianLoop = document.getElementById("hasNotEulerianLoop").innerHTML;
    
    g_processing = document.getElementById("processing").innerHTML;
    
    g_customEnumVertex = document.getElementById("customEnumVertex").innerHTML;
    
    g_addVertex = document.getElementById("addVertexText").innerHTML;
    
    g_renameVertex = document.getElementById("renameVertex").innerHTML;
    g_rename = document.getElementById("renameText").innerHTML;
    
    g_language = document.getElementById("currentLanguage").innerHTML;
    
    g_editWeight = document.getElementById("editWeight").innerHTML;
    
    g_noWeight = document.getElementById("noWeight").innerHTML;
    g_groupRename = document.getElementById("groupeRenameText").innerHTML;
}
function Point(x, y){
    this.x = x || 0;
    this.y = y || 0;
};
Point.prototype.x = null;
Point.prototype.y = null;
Point.prototype.add = function(v){
    return new Point(this.x + v.x, this.y + v.y);
};
Point.prototype.addValue = function(v){
    return new Point(this.x + v, this.y + v);
};
Point.prototype.clone = function(){
    return new Point(this.x, this.y);
};
Point.prototype.degreesTo = function(v){
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var angle = Math.atan2(dy, dx); // radians
    return angle * (180 / Math.PI); // degrees
};
Point.prototype.distance = function(v){
    return Math.sqrt(this.distanceSqr(v));
};
Point.prototype.distanceSqr = function(v){
    var x = this.x - v.x;
    var y = this.y - v.y;
    return x * x + y * y;
};
Point.prototype.equals = function(toCompare){
    return this.x == toCompare.x && this.y == toCompare.y;
};
Point.prototype.interpolate = function(v, f){
    return new Point((this.x + v.x) * f, (this.y + v.y) * f);
};
Point.prototype.length = function(){
    return Math.sqrt(this.x * this.x + this.y * this.y);
};
Point.prototype.normalize = function(thickness){
    var l = this.length();
    this.x = this.x / l * thickness;
    this.y = this.y / l * thickness;
    return new Point(this.x, this.y);
};
Point.prototype.normalizeCopy = function(thickness){
    var l = this.length();
    return new Point(this.x / l * thickness, this.y / l * thickness);
};
Point.prototype.orbit = function(origin, arcWidth, arcHeight, degrees){
    var radians = degrees * (Math.PI / 180);
    this.x = origin.x + arcWidth * Math.cos(radians);
    this.y = origin.y + arcHeight * Math.sin(radians);
};
Point.prototype.rotate = function(center, degrees){
    var radians = degrees * (Math.PI / 180);
    offset = this.subtract(center);
    this.x = offset.x * Math.cos(radians) - offset.y * Math.sin(radians);
    this.y = offset.x * Math.sin(radians) + offset.y * Math.cos(radians);
    this.x = this.x + center.x;
    this.y = this.y + center.y;
};

Point.prototype.offset = function(dx, dy){
    this.x += dx;
    this.y += dy;
};
Point.prototype.subtract = function(v){
    return new Point(this.x - v.x, this.y - v.y);
};
Point.prototype.subtractValue = function(value){
    return new Point(this.x - value, this.y - value);
};
Point.prototype.multiply = function(value){
    return new Point(this.x * value, this.y * value);
};
Point.prototype.toString = function(){
    return "(x=" + this.x + ", y=" + this.y + ")";
};

Point.prototype.normal = function(){
    return new Point(-this.y, this.x);
};

Point.prototype.min = function(point)
{
    return new Point(Math.min(this.x, point.x), Math.min(this.y, point.y));
};

Point.prototype.max = function(point)
{
    return new Point(Math.max(this.x, point.x), Math.max(this.y, point.y));
};

Point.prototype.inverse = function()
{
    return new Point(-this.x, -this.y);
};
 
Point.interpolate = function(pt1, pt2, f){
    return new Point(pt1.x * (1.0 - f) + pt2.x * f, pt1.y * (1.0 - f) + pt2.y * f);
};
Point.polar = function(len, angle){
    return new Point(len * Math.cos(angle), len * Math.sin(angle));
};
Point.distance = function(pt1, pt2){
    var x = pt1.x - pt2.x;
    var y = pt1.y - pt2.y;
    return Math.sqrt(x * x + y * y);
};

Point.center = function(pt1, pt2){
    return new Point((pt1.x + pt2.x) / 2.0, (pt1.y + pt2.y) / 2.0);
};

Point.toString = function(){
	return x + " " + y;
}

function Rect(minPoint, maxPoint){
    this.minPoint = minPoint;
    this.maxPoint = maxPoint;
};

Rect.prototype.center = function()
{
    return Point.center(this.minPoint, this.maxPoint);
};

Rect.prototype.size = function()
{
    return this.maxPoint.subtract(this.minPoint);
};
/**
 * This is edge model
 *
 */

function EdgeModel()
{
    this.width = 4;
}
/**
 * This is graph model used for hit test and draw.
 *
 */


function VertexModel()
{
    this.diameter = 30;
}
/**
 * Base node class.
 *
 */

 
function BaseVertex(x, y, vertexEnumType)
{
    this.position = new Point(x, y);
    this.id       = 0;
    this.mainText = "";
    this.upText   = "";
    this.vertexEnumType = vertexEnumType;
};

BaseVertex.prototype.position = new Point(0, 0);
BaseVertex.prototype.model    = new VertexModel();

BaseVertex.prototype.SaveToXML = function ()
{
	return "<node " + 
	       "positionX=\""  + this.position.x   + "\" " +
	       "positionY=\""  + this.position.y   + "\" " +
	       "id=\""         + this.id   + "\" " +
	       "mainText=\""   + this.mainText + "\" " +
	       "upText=\""     + this.upText   + "\" " +
		"></node>";       
		                 
}

BaseVertex.prototype.LoadFromXML = function (xml)
{
    this.position = new Point(parseFloat(xml.attr('positionX')), parseFloat(xml.attr('positionY')));
    this.id       = parseInt(xml.attr('id'));
    this.mainText = xml.attr('mainText');
    this.upText   = xml.attr('upText');
}

BaseVertex.prototype.SetId = function (id)
{
    this.id       = id;
    this.mainText = this.vertexEnumType.GetVertexText(id);		                 
}

BaseVertex.prototype.diameterFactor = function ()
{
    return 1.0 + (this.mainText.length ? this.mainText.length / 8.0 : 0);
}
/**
 * This is base arc.
 *
 *
 */

function BaseEdge(vertex1, vertex2, isDirect, weight, useWeight)
{
    this.vertex1    = vertex1;
    this.vertex2    = vertex2;
    this.isDirect  = isDirect;
    this.weight    = Number(weight);
    // For direct graph, has pair edge or not.
    this.hasPair   = false;
    this.useWeight = useWeight;
    this.id        = 0;
}

BaseEdge.prototype.model = new EdgeModel();

BaseEdge.prototype.SaveToXML = function ()
{
	return "<edge " + 
	       "vertex1=\""     + this.vertex1.id   + "\" " +
	       "vertex2=\""     + this.vertex2.id   + "\" " +
	       "isDirect=\""   + this.isDirect + "\" " +
	       "weight=\""     + this.weight   + "\" " +
	       "useWeight=\""  + this.useWeight + "\" " +
	       "hasPair=\""    + this.hasPair + "\" " +
	       "id=\""         + this.id + "\" " +
		"></edge>";       
}

BaseEdge.prototype.LoadFromXML = function (xml, graph)
{
    var attr       =    xml.attr('vertex1');
	this.vertex1   =    graph.FindVertex(parseInt(typeof attr !== 'undefined' ? attr : xml.attr('graph1')));
    var attr       =    xml.attr('vertex2');
	this.vertex2   =    graph.FindVertex(parseInt(typeof attr !== 'undefined' ? attr : xml.attr('graph2')));
	this.isDirect  =    xml.attr('isDirect') == "true";
	this.weight    =    parseFloat(xml.attr('weight'));
	this.hasPair   =    xml.attr('hasPair') == "true";
	this.useWeight =    xml.attr('useWeight') == "true";
    this.id        =    parseInt(xml.attr('id'));
}

BaseEdge.prototype.GetPixelLength = function ()
{
    if (this.vertex1 == this.vertex2)
    {
        return (new CommonEdgeStyle()).sizeOfLoop * 2 * Math.PI;
    }
    else
    {
        return Point.distance(this.vertex1.position, this.vertex2.position);
    }
}
/**
 * Graph drawer.
 */
 
// Common style of Graphs.
function CommonVertexStyle()
{
  this.lineWidth   = 1;
  this.strokeStyle = '#c7b7c7';
  this.fillStyle   = '#68aeba';
  this.mainTextColor = '#f0d543';
}

// Selected style of Graphs.
function SelectedVertexStyle0()
{
	CommonVertexStyle.apply(this, arguments);

	this.strokeStyle = '#f0d543';
	this.mainTextColor  = '#f0d543';
	this.fillStyle   = '#c7627a';
}

SelectedVertexStyle0.prototype = Object.create(CommonVertexStyle.prototype);

function SelectedVertexStyle1()
{
	CommonVertexStyle.apply(this, arguments);

	this.strokeStyle = '#7a9ba0';
	this.mainTextColor  = '#7a9ba0';
	this.fillStyle   = '#534641';
}

SelectedVertexStyle1.prototype = Object.create(CommonVertexStyle.prototype);

function SelectedVertexStyle2()
{
	CommonVertexStyle.apply(this, arguments);

	this.strokeStyle = '#8C4C86';
	this.mainTextColor  = '#8C4C86';
	this.fillStyle   = '#253267';
}

SelectedVertexStyle2.prototype = Object.create(CommonVertexStyle.prototype);

function SelectedVertexStyle3()
{
	CommonVertexStyle.apply(this, arguments);

	this.strokeStyle = '#6188FF';
	this.mainTextColor  = '#6188FF';
	this.fillStyle   = '#E97CF9';
}

SelectedVertexStyle3.prototype = Object.create(CommonVertexStyle.prototype);

function SelectedVertexStyle4()
{
	CommonVertexStyle.apply(this, arguments);

	this.strokeStyle = '#C6B484';
	this.mainTextColor  = '#C6B484';
	this.fillStyle   = '#E0DEE1';
}

SelectedVertexStyle4.prototype = Object.create(CommonVertexStyle.prototype);

var selectedGraphStyles = [new SelectedVertexStyle0(), new SelectedVertexStyle1(),
	new SelectedVertexStyle2(), new SelectedVertexStyle3(), new SelectedVertexStyle4()];
                   
function BaseVertexDrawer(context)
{ 
  this.context = context;
}

BaseVertexDrawer.prototype.Draw = function(baseGraph, graphStyle)
{
  this.SetupStyle(graphStyle);
  this.DrawShape(baseGraph);
  this.context.stroke();
  this.context.fill();
  
  this.DrawCenterText(baseGraph.position, baseGraph.mainText, graphStyle.mainTextColor, graphStyle.fillStyle, true, true, 16);
  
  // Top text
  this.DrawCenterText(baseGraph.position.add(new Point(0, - baseGraph.model.diameter / 2.0 - 9.0)), 
	baseGraph.upText, graphStyle.fillStyle, graphStyle.strokeStyle, false, false, 12.0);
/*	
  // Bottom text
  this.DrawCenterText(baseGraph.position.add(new Point(0, + baseGraph.model.diameter / 2.0 + 7.0)), 
	"Text 2", graphStyle.fillStyle, false, 12.0);
*/
}

BaseVertexDrawer.prototype.SetupStyle = function(style)
{
  this.context.lineWidth   = style.lineWidth;
  this.context.strokeStyle = style.strokeStyle;
  this.context.fillStyle   = style.fillStyle;
}

BaseVertexDrawer.prototype.DrawShape = function(baseGraph)
{
  this.context.lineWidth    = 2;
  this.context.beginPath();
  this.context.arc(baseGraph.position.x, baseGraph.position.y, baseGraph.model.diameter / 2.0, 0, 2 * Math.PI);
  this.context.closePath();
}

BaseVertexDrawer.prototype.DrawText = function(position, text, color, outlineColor, outline, font)
{
	this.context.fillStyle = color;
	this.context.font = font;
    this.context.lineWidth = 4;
    this.context.strokeStyle = outlineColor;

    if (outline)
    {
        this.context.save();
        this.context.lineJoin = 'round';
        this.context.strokeText(text, position.x, position.y);
        this.context.restore();
    }
    
    this.context.fillText(text, position.x, position.y);
}

BaseVertexDrawer.prototype.DrawCenterText = function(position, text, color, outlineColor, bold, outline, size)
{
	this.context.textBaseline="middle";
	this.context.font = (bold ? "bold " : "") + size + "px sans-serif";
	var textWidth  = this.context.measureText(text).width;	
	this.DrawText(new Point(position.x - textWidth / 2, position.y), text, color, outlineColor, outline, this.context.font);
}

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






/**
 * File for algorithms.
 *
 */

// Return list of vertex with connected vertex.
function getVertexToVertexArray(graph, ignoryDirection)
{
	res = {};

	for (var i = 0; i < graph.edges.length; i ++)
	{
		edge = graph.edges[i];		
		if (!res.hasOwnProperty(edge.vertex1.id))
		{
			res[edge.vertex1.id] = [];
		}
		res[edge.vertex1.id].push(edge.vertex2);
		if (!edge.isDirect || ignoryDirection)
		{
			if (!res.hasOwnProperty(edge.vertex2.id))
			{
				res[edge.vertex2.id] = [];
			}

			res[edge.vertex2.id].push(edge.vertex1);
		}
	}

	return res;
}

// Global array of all algorithms.
var g_Algorithms   = [];
var g_AlgorithmIds = [];

// Call this function to register your factory algoritm.
function RegisterAlgorithm (factory)
{
    g_Algorithms.push(factory);
    g_AlgorithmIds.push(factory(null).getId());
}

// Base algorithm class.
function BaseAlgorithm (graph, app)
{
    this.graph = graph;
    this.app = app;
}

// @return name of algorthm. For now we supports only 2 locals: "ru" and "en"
BaseAlgorithm.prototype.getName = function(local)
{
    return "unknown_name_" + local;
}

// @return id of algorthm. Please use format: "your id"."algorithm id". Ex. "OlegSh.ConnectedComponent"
BaseAlgorithm.prototype.getId = function()
{
    return "unknown.unknown";
}

// @return message for user.
BaseAlgorithm.prototype.getMessage = function(local)
{
    return "unknown_message_" + local;
}

// calls when user select vertex.
// @return true if you allow to select this object or false.
BaseAlgorithm.prototype.selectVertex = function(vertex)
{
    return false;
}

// calls when user select edge.
// @return true if you allow to select this object or false.
BaseAlgorithm.prototype.selectEdge = function(edge)
{
    return false;
}

// user click to workspace.
// @return true if you allow to deselect all
BaseAlgorithm.prototype.deselectAll = function()
{
    return true;
}

// get result of algorithm.
// If result if not ready, please return null.
// It will be called after each user action.
// Please return true, if you done.
BaseAlgorithm.prototype.result = function(resultCallback)
{
    return null;
}

// If you no need to get feedback from user, return true.
// In this case result will calls once.
BaseAlgorithm.prototype.instance = function()
{
    return true;
}

// @return false, if you change up text and do not want to restore it back.
BaseAlgorithm.prototype.needRestoreUpText = function()
{
    return true;
}

// @return 0, if object is not selected, in other case return groupe of selection.
BaseAlgorithm.prototype.getObjectSelectedGroup = function(object)
{
    return 0;
}

// This methos is called, when messages was updated on html page.
BaseAlgorithm.prototype.messageWasChanged = function() {}


/**
 * Default handler.
 * Select using mouse, drag.
 *
 */
function BaseAlgorithmEx(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
}

// inheritance.
BaseAlgorithmEx.prototype = Object.create(BaseAlgorithm.prototype);

BaseAlgorithmEx.prototype.CalculateAlgorithm = function(queryString, resultCallback)
{
    var graph = this.graph;
    var creator = new GraphMLCreater(graph.vertices, graph.edges);
    var pathObjects = [];
    var properties = {};
    var result = [];

    $.ajax({
         type: "POST",
         url: "/cgi-bin/GraphCGI.exe?" + queryString,
         data: creator.GetXMLString(),
         dataType: "text",
         })
    .done(function( msg )
        {
        console.log(msg);
        $('#debug').text(msg);
        xmlDoc = $.parseXML( msg );
        var $xml = $( xmlDoc );
        
        $results = $xml.find( "result" );
        
        $results.each(function(){
                      $values = $(this).find( "value" );
                      
                      $values.each(function(){
                                   var type  = $(this).attr('type');
                                   var value = $(this).text();
                                   var res = {};
                                   res.type = type;
                                   res.value = value;
                                   result.push(res);
                                   });
                      });
        
        $nodes = $xml.find( "node" );
        
          $nodes.each(function(){
                      var id = $(this).attr('id');
                      $data = $(this).find("data");
                      $data.each(function(){
                                 if ("hightlightNode" == $(this).attr('key') && $(this).text() == "1")
                                 {
                                 pathObjects.push(graph.FindVertex(id));
                                 }
                                 else
                                 {
                                 if (!properties[id])
                                 {
                                 properties[id] = {};
                                 }
                                 properties[id][$(this).attr('key')] = $(this).text();
                                 }
                                 });
                      });
        
        $edges = $xml.find( "edge" );
        
        $edges.each(function(){
                    var source = $(this).attr('source');
                    var target = $(this).attr('target');
                    pathObjects.push(graph.FindEdge(source, target));
                    });
        
        console.log(result);
        
        resultCallback(pathObjects, properties, result);
        });

    return true;
}


BaseAlgorithmEx.prototype.GetNodesPath = function(array, start, count)
{
    var res = [];
    for (var index = start; index < start + count; index++)
    {
        res.push(array[index].value);
    }
    return res;
}


/**
 *
 *  This event handlers.
 *
 *
 */

/**
 * Base Handler.
 *
 */
 
function BaseHandler(app)
{
	this.app = app;
    this.app.setRenderPath([]);
}

// Need redraw or nor.
BaseHandler.prototype.needRedraw = false;
BaseHandler.prototype.objects    = [];
BaseHandler.prototype.message    = "";


BaseHandler.prototype.IsNeedRedraw = function(object)
{
	return this.needRedraw;
}

BaseHandler.prototype.RestRedraw = function(object)
{
	this.needRedraw = false;
}

BaseHandler.prototype.SetObjects = function(objects)
{
	this.objects = objects;
}

BaseHandler.prototype.GetSelectedGraph = function(pos)
{
	// Selected Graph.
    for (var i = 0; i < this.app.graph.vertices.length; i ++)
    {
		if (this.app.graph.vertices[i].position.distance(pos) < this.app.graph.vertices[i].model.diameter / 2.0)
		{
            return this.app.graph.vertices[i];
		}
	}

	
	return null;
}

BaseHandler.prototype.GetSelectedArc = function(pos)
{
	// Selected Arc.
    for (var i = 0; i < this.app.graph.edges.length; i ++)
    {
		var pos1 = this.app.graph.edges[i].vertex1.position;
		var pos2 = this.app.graph.edges[i].vertex2.position;
		var pos0 = new Point(pos.x, pos.y);
		
		var r1  = pos0.distance(pos1);
		var r2  = pos0.distance(pos2);
		var r12 = pos1.distance(pos2);
		
		if (r1 >= (new Point(r2, r12)).length() || r2 >= (new Point(r1,r12)).length())
		{
		}
		else		
		{ 
			var distance = ((pos1.y - pos2.y) * pos0.x + (pos2.x - pos1.x) * pos0.y + (pos1.x * pos2.y - pos2.x * pos1.y)) / r12;

			if (Math.abs(distance) <= this.app.graph.edges[i].model.width * 1.5)
			{
				return this.app.graph.edges[i];
			}
		}
	}

	
	return null;
}

BaseHandler.prototype.GetSelectedObject = function(pos)
{
	var graphObject = this.GetSelectedGraph(pos);
	if (graphObject)
	{
		return graphObject;
	}
	
	var arcObject = this.GetSelectedArc(pos);
	if (arcObject)
	{
		return arcObject;
	}
	
	return null;
}


BaseHandler.prototype.GetUpText = function(object)
{
	return "";
}


BaseHandler.prototype.GetMessage = function()
{
	return this.message;
}


BaseHandler.prototype.MouseMove = function(pos) {;}

BaseHandler.prototype.MouseDown = function(pos) {;}

BaseHandler.prototype.MouseUp   = function(pos) {;}

BaseHandler.prototype.GetSelectedGroup = function(object) 
{
	return 0;
}

BaseHandler.prototype.InitControls = function() 
{
}

BaseHandler.prototype.GetNodesPath = function(array, start, count)
{
    var res = [];
    for (var index = start; index < start + count; index++)
    {
        res.push(this.app.graph.FindVertex(array[index].value));
    }
    return res;
}

BaseHandler.prototype.RestoreAll = function()
{
}

/**
 * Default handler.
 * Select using mouse, drag.
 *
 */
function DefaultHandler(app)
{
	BaseHandler.apply(this, arguments);
	this.message = g_textsSelectAndMove;
}


// inheritance.
DefaultHandler.prototype = Object.create(BaseHandler.prototype);
// Current drag object.
DefaultHandler.prototype.dragObject     = null;
// Selected object.
DefaultHandler.prototype.selectedObject = null;
// Is pressed
DefaultHandler.prototype.pressed = false;
// Prev position.
DefaultHandler.prototype.prevPosition = false;
// Is binded event for rename
DefaultHandler.prototype.bindedRename = false;
// Is binded event for edit edge
DefaultHandler.prototype.editEdgeRename = false;

DefaultHandler.prototype.MouseMove = function(pos) 
{
	if (this.dragObject)
	{
        this.dragObject.position.x = pos.x;
        this.dragObject.position.y = pos.y;
		this.needRedraw = true;
	}
    else if (this.pressed)
    {
        this.app.onCanvasMove((new Point(pos.x, pos.y)).subtract(this.prevPosition).multiply(this.app.canvasScale));
        this.needRedraw = true;
        //this.prevPosition = pos;
    }
}

DefaultHandler.prototype.MouseDown = function(pos)
{
	this.selectedObject = null;
	this.dragObject     = null;
	var selectedObject = this.GetSelectedObject(pos);
	if (selectedObject != null)
	{
		this.selectedObject = selectedObject;
	}	
	if ((selectedObject instanceof BaseVertex) && selectedObject != null)
	{
		this.dragObject = selectedObject;
		this.message = g_moveCursorForMoving;		
	}	
	this.needRedraw = true;
    this.pressed    = true;
    this.prevPosition = pos;
    this.app.canvas.style.cursor = "move";
}

DefaultHandler.prototype.RenameVertex = function(text)
{
    if (this.selectedObject != null && (this.selectedObject instanceof BaseVertex))
    {
        this.selectedObject.mainText = text;
        this.app.redrawGraph();
    }
}

DefaultHandler.prototype.MouseUp = function(pos) 
{
	this.message = g_textsSelectAndMove;
	this.dragObject = null;
    this.pressed    = false;
    this.app.canvas.style.cursor = "auto";
    if (this.selectedObject != null && (this.selectedObject instanceof BaseVertex))
    {
        this.message = g_textsSelectAndMove + " <button type=\"button\" id=\"renameButton\" class=\"btn btn-default btn-xs\" style=\"float:right;z-index:1;position: relative;\">" + g_renameVertex + "</button>";
        
        var handler = this;
        if (!this.bindedRename)
        {
            var callback = function (enumType) {
                    handler.RenameVertex(enumType.GetVertexText(0));
                    userAction("RenameVertex");
            };
            $('#message').on('click', '#renameButton', function(){
                            var customEnum =  new TextEnumVertexsCustom();
                            customEnum.ShowDialog(callback, g_rename,  g_renameVertex, handler.selectedObject.mainText);
                         });
            this.bindedRename = true;
        }
    }
    else if (this.selectedObject != null && (this.selectedObject instanceof BaseEdge))
    {
        this.message = g_textsSelectAndMove + " <button type=\"button\" id=\"editEdge\" class=\"btn btn-default btn-xs\" style=\"float:right;z-index:1;position: relative;\">" + g_editWeight + "</button>";
        var handler = this;
        if (!this.editEdgeRename)
        {
            $('#message').on('click', '#editEdge', function(){
                             var direct = false;
                             var dialogButtons = {};
                             
                             dialogButtons[g_save] = function() {
                             
                                handler.app.DeleteObject(handler.selectedObject);
                                handler.selectedObject = handler.app.graph.edges[handler.app.CreateNewArc(handler.selectedObject.vertex1, handler.selectedObject.vertex2, handler.selectedObject.isDirect, document.getElementById('EdgeWeight').value)];
                             
                                handler.needRedraw = true;
                                handler.app.redrawGraph();
                             
                                userAction("ChangeWeight");
                                $( this ).dialog( "close" );
                             };
   
                             document.getElementById('EdgeWeight').value = handler.selectedObject.useWeight ? handler.selectedObject.weight : g_noWeight;
                             document.getElementById('EdgeWeightSlider').value = handler.selectedObject.useWeight ? handler.selectedObject.weight : 0;
                             
                             $( "#addEdge" ).dialog({
                                                    resizable: false,
                                                    height: "auto",
                                                    width:  "auto",
                                                    modal: true,
                                                    title: g_editWeight,
                                                    buttons: dialogButtons,
                                                    dialogClass: 'EdgeDialog',
                                                    open: function () {
                                                    $(handler).off('submit').on('submit', function () {
                                                                             return false;
                                                                             });
                                                    }
                                                    });
                             });
            
            this.editEdgeRename = true;
        }
    }
}

DefaultHandler.prototype.GetSelectedGroup = function(object)
{
	return (object == this.dragObject) || (object == this.selectedObject) ? 1 : 0;
}


/**
 * Add Graph handler.
 *
 */
function AddGraphHandler(app)
{
  BaseHandler.apply(this, arguments);
  this.message = g_clickToAddVertex;	
}

// inheritance.
AddGraphHandler.prototype = Object.create(BaseHandler.prototype);

AddGraphHandler.prototype.MouseDown = function(pos) 
{
	this.app.CreateNewGraph(pos.x, pos.y);
	this.needRedraw = true;
	this.inited = false;
}

AddGraphHandler.prototype.InitControls = function() 
{
    var enumVertexsText = document.getElementById("enumVertexsText");
    if (enumVertexsText)
    {
        var enumsList = this.app.GetEnumVertexsList();
        for (var i = 0; i < enumsList.length; i ++)
        {
            var option = document.createElement('option');
            option.text  = enumsList[i]["text"];
            option.value = enumsList[i]["value"];
            enumVertexsText.add(option, i);
            if (enumsList[i]["select"])
            {
                enumVertexsText.selectedIndex = i;
            }
        }
        
        var addGraphHandler = this;
        enumVertexsText.onchange = function () {
            addGraphHandler.ChangedType();
        };
    }
}

AddGraphHandler.prototype.ChangedType = function() 
{
	var enumVertexsText = document.getElementById("enumVertexsText");

	this.app.SetEnumVertexsType(enumVertexsText.options[enumVertexsText.selectedIndex].value);
}



/**
 * Connection Graph handler.
 *
 */
function ConnectionGraphHandler(app)
{
  BaseHandler.apply(this, arguments);
  this.message = g_selectFisrtVertexToConnect;	
}

// inheritance.
ConnectionGraphHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
ConnectionGraphHandler.prototype.firstObject = null;

ConnectionGraphHandler.prototype.AddNewEdge = function(selectedObject, isDirect)
{
	this.app.CreateNewArc(this.firstObject, selectedObject, isDirect, document.getElementById('EdgeWeight').value);
	this.firstObject = null;
	this.message = g_selectFisrtVertexToConnect;						
	this.app.NeedRedraw();
}

ConnectionGraphHandler.prototype.MouseDown = function(pos) 
{
	var selectedObject = this.GetSelectedGraph(pos);
	if (selectedObject && (selectedObject instanceof BaseVertex))
	{
		if (this.firstObject)
		{
			var direct = false;
			var handler = this;
			var dialogButtons = {};
			dialogButtons[g_orintEdge] = function() {
						handler.AddNewEdge(selectedObject, true);						
						$( this ).dialog( "close" );					
					};
			dialogButtons[g_notOrintEdge] = function() {
						handler.AddNewEdge(selectedObject, false);
						$( this ).dialog( "close" );						
					};					
			$( "#addEdge" ).dialog({
				resizable: false,
				height: "auto",
				width:  "auto",
				modal: true,
				title: g_addEdge,
				buttons: dialogButtons,
				dialogClass: 'EdgeDialog',
				open: function () {
            				$(this).off('submit').on('submit', function () {
                			    return false;
            				});
        			}
			});
		}
		else
		{
			this.firstObject = selectedObject;
			this.message = g_selectSecondVertexToConnect;	
		}
		this.needRedraw = true;
	}	
}

ConnectionGraphHandler.prototype.GetSelectedGroup = function(object)
{
	return (object == this.firstObject) ? 1 : 0;
}


/**
 * Delete Graph handler.
 *
 */
function DeleteGraphHandler(app)
{
  BaseHandler.apply(this, arguments);
  this.message = g_selectObjectToDelete;	
}

// inheritance.
DeleteGraphHandler.prototype = Object.create(BaseHandler.prototype);

DeleteGraphHandler.prototype.MouseDown = function(pos) 
{
	var selectedObject = this.GetSelectedObject(pos);
	
	this.app.DeleteObject(selectedObject);
	
	this.needRedraw = true;
}

/**
 * Delete Graph handler.
 *
 */
function DeleteAllHandler(app)
{
  BaseHandler.apply(this, arguments);  
}

// inheritance.
DeleteAllHandler.prototype = Object.create(BaseHandler.prototype);

DeleteAllHandler.prototype.clear = function() 
{	
	// Selected Graph.
    this.app.graph = new Graph(); 
    this.app.savedGraphName = "";
    this.needRedraw = true;
}


/**
 * Save/Load graph from matrix.
 *
 */
function ShowAdjacencyMatrix(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
ShowAdjacencyMatrix.prototype = Object.create(BaseHandler.prototype);
// First selected.
ShowAdjacencyMatrix.prototype.firstObject = null;
// Path
ShowAdjacencyMatrix.prototype.pathObjects = null;

ShowAdjacencyMatrix.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};

	$( "#AdjacencyMatrixField" ).on('keyup change', function (eventObject)
		{
			if (!handler.app.TestAdjacencyMatrix($( "#AdjacencyMatrixField" ).val(), [], []))
			{
				$( "#BadMatrixFormatMessage" ).show();
			}
			else
			{
				$( "#BadMatrixFormatMessage" ).hide();
			}
		});

	dialogButtons[g_save] = function() {
				handler.app.SetAdjacencyMatrixSmart($( "#AdjacencyMatrixField" ).val());					
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};

	$( "#AdjacencyMatrixField" ).val(this.app.GetAdjacencyMatrix());	
	$( "#BadMatrixFormatMessage" ).hide();
		
	$( "#adjacencyMatrix" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_adjacencyMatrixText,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
}


/**
 * Save/Load graph from Incidence matrix.
 *
 */
function ShowIncidenceMatrix(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
ShowIncidenceMatrix.prototype = Object.create(BaseHandler.prototype);
// First selected.
ShowIncidenceMatrix.prototype.firstObject = null;
// Path
ShowIncidenceMatrix.prototype.pathObjects = null;

ShowIncidenceMatrix.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};

	$( "#IncidenceMatrixField" ).on('keyup change', function (eventObject)
		{
			if (!handler.app.TestIncidenceMatrix($( "#IncidenceMatrixField" ).val(), [], []))
			{
				$( "#BadIncidenceMatrixFormatMessage" ).show();
			}
			else
			{
				$( "#BadIncidenceMatrixFormatMessage" ).hide();
			}
		});

	dialogButtons[g_save] = function() {
				handler.app.SetIncidenceMatrixSmart($( "#IncidenceMatrixField" ).val());					
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};

	$( "#IncidenceMatrixField" ).val(this.app.GetIncidenceMatrix());	
	$( "#BadIncidenceMatrixFormatMessage" ).hide();
				
	$( "#incidenceMatrix" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_incidenceMatrixText,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
}


/**
 * Save dialog Graph handler.
 *
 */
function SavedDialogGraphHandler(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";
}

// inheritance.
SavedDialogGraphHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
SavedDialogGraphHandler.prototype.firstObject = null;
// Path
SavedDialogGraphHandler.prototype.pathObjects = null;
// Objects.
SavedDialogGraphHandler.prototype.objects    = null;

SavedDialogGraphHandler.prototype.show = function(object)
{
	this.app.SaveGraphOnDisk();

	var dialogButtons = {};

	dialogButtons[g_close] = function() {
				$( this ).dialog( "close" );					
			};

	document.getElementById('GraphName').value = "http://" + window.location.host + window.location.pathname + 
							"?graph=" + this.app.GetGraphName();

 	document.getElementById('GraphName').select();

        document.getElementById("ShareSavedGraph").innerHTML = 
		document.getElementById("ShareSavedGraph").innerHTML.replace(/graph=([A-Za-z]*)/g, "graph=" + this.app.GetGraphName());

	$( "#saveDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_save_dialog,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});

}

/**
 * Save dialog Graph handler.
 *
 */
function SavedDialogGraphImageHandler(app)
{
    BaseHandler.apply(this, arguments);
    this.message = "";
}

// inheritance.
SavedDialogGraphImageHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
SavedDialogGraphImageHandler.prototype.firstObject = null;
// Path
SavedDialogGraphImageHandler.prototype.pathObjects = null;
// Objects.
SavedDialogGraphImageHandler.prototype.objects    = null;

SavedDialogGraphImageHandler.prototype.show = function(object)
{
    var imageName = this.app.SaveGraphImageOnDisk();
    
    var dialogButtons = {};
    
    dialogButtons[g_close] = function() {
        $( this ).dialog( "close" );
    };
    
    var fileLocation = "tmp/saved/" + imageName.substr(0, 2) + "/"+ imageName + ".png"
    
    
    document.getElementById("ShareSavedImageGraph").innerHTML =
    document.getElementById("ShareSavedImageGraph").innerHTML.replace(/tmp\/saved\/([A-Za-z]*)\/([A-Za-z]*).png/g, fileLocation);
    
    document.getElementById("SaveImageLinks").innerHTML =
    document.getElementById("SaveImageLinks").innerHTML.replace(/tmp\/saved\/([A-Za-z]*)\/([A-Za-z]*).png/g, fileLocation);
    
    $( "#saveImageDialog" ).dialog({
                              resizable: false,
                              height: "auto",
                              width:  "auto",
                              modal: true,
                              title: g_save_image_dialog,
                              buttons: dialogButtons,
                              dialogClass: 'EdgeDialog'
                              });
    
}


/**
 * Algorithm Graph handler.
 *
 */
function AlgorithmGraphHandler(app, algorithm)
{
    BaseHandler.apply(this, arguments);
    this.algorithm = algorithm;
    this.SaveUpText();
    
    this.UpdateResultAndMesasge();
}

// inheritance.
AlgorithmGraphHandler.prototype = Object.create(BaseHandler.prototype);

// Rest this handler.
AlgorithmGraphHandler.prototype.MouseMove = function(pos) {}

AlgorithmGraphHandler.prototype.MouseDown = function(pos)
{
    this.app.setRenderPath([]);
 
    if (this.algorithm.instance())
    {
        this.app.SetDefaultHandler();
    }
    else
    {
        var selectedObject = this.GetSelectedGraph(pos);
        if (selectedObject && (selectedObject instanceof BaseVertex))
        {
            if (this.algorithm.selectVertex(selectedObject))
            {
                this.needRedraw = true;
            }
            
            this.UpdateResultAndMesasge();
        }
        else  if (selectedObject && (selectedObject instanceof BaseEdge))
        {
            if (this.algorithm.selectEdge(selectedObject))
            {
                this.needRedraw = true;
            }
            
            this.UpdateResultAndMesasge();
        }
        else
        {
            if (this.algorithm.deselectAll())
            {
                this.needRedraw = true;
                this.UpdateResultAndMesasge();
            }
        }
    }
}

AlgorithmGraphHandler.prototype.MouseUp   = function(pos) {}

AlgorithmGraphHandler.prototype.GetSelectedGroup = function(object)
{
	return this.algorithm.getObjectSelectedGroup(object);
}

AlgorithmGraphHandler.prototype.RestoreAll = function()
{
    this.app.setRenderPath([]);
 
    if (this.algorithm.needRestoreUpText())
    {
        this.RestoreUpText();
    }
}

AlgorithmGraphHandler.prototype.SaveUpText = function()
{
    this.vertexUpText = {};
    var graph = this.app.graph;
    for (i = 0; i < graph.vertices.length; i ++)
    {
        this.vertexUpText[graph.vertices[i].id] = graph.vertices[i].upText;
    }
}

AlgorithmGraphHandler.prototype.RestoreUpText = function()
{
    var graph = this.app.graph;

    for (i = 0; i < graph.vertices.length; i ++)
    {
        if (graph.vertices[i].id in this.vertexUpText)
        {
            graph.vertices[i].upText = this.vertexUpText[graph.vertices[i].id];
        }
    }
}

AlgorithmGraphHandler.prototype.UpdateResultAndMesasge = function()
{
    var self = this;
    result = this.algorithm.result(function (result)
                                   {
                                        self.message = self.algorithm.getMessage(g_language);
                                        self.app.resultCallback(result);
                                   });
    
    this.app.resultCallback(result);
    
    this.message = this.algorithm.getMessage(g_language);
}

AlgorithmGraphHandler.prototype.InitControls = function()
{
    this.algorithm.messageWasChanged();
}


/**
 * Groupe rename vertices.
 *
 */
function GroupRenameVertices(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
GroupRenameVertices.prototype = Object.create(BaseHandler.prototype);
// First selected.
GroupRenameVertices.prototype.firstObject = null;
// Path
GroupRenameVertices.prototype.pathObjects = null;

GroupRenameVertices.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};
    var graph = this.app.graph;
    var app = this.app;
    
	dialogButtons[g_save] = function() {
                var titlesList = $( "#VertextTitleList" ).val().split('\n');
                for (i = 0; i < Math.min(graph.vertices.length, titlesList.length); i ++)
                {
                    graph.vertices[i].mainText = titlesList[i];
                }
                app.redrawGraph();
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};

    var titleList = "";
    for (i = 0; i < graph.vertices.length; i ++)
    {
        titleList = titleList + graph.vertices[i].mainText + "\n";
    }
    
	$( "#VertextTitleList" ).val(titleList);
		
	$( "#GroupRenameDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_groupRename,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
}
/**
 *  This class creates GraphML xml.
 *
 */


function GraphMLCreater(nodes, arcs)
{
	this.nodes = nodes;
	this.arcs = arcs;
}


GraphMLCreater.prototype.GetXMLString = function()
{
	var mainHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><graphml>";
	var directedHeader   = "<graph id=\"Graph\" edgedefault=\"directed\">";	
	var undirectedHeader = "<graph id=\"Graph\" edgedefault=\"undirected\">";
	
	var defaultWeight = 1.0;
	var weightKeyId  = "\"d0\"";
	var weightNode = "<key id="+ weightKeyId + " for=\"node\" attr.name=\"weight\" attr.type=\"double\">" +
			"<default>" + defaultWeight + "</default>" +
			"</key>";
	
	var xmlBoby = "";
	  
	for (var i = 0; i < this.nodes.length; i++)
	{
		xmlBoby = xmlBoby + "<node id=\"" + this.nodes[i].id + "\"/>";
	}
	var hasDirected = false;
	for (var i = 0; i < this.arcs.length; i++)
	{
		if (this.arcs[i].isDirect)
		{
			hasDirected = true;
			break;
		}
	}		
	for (var i = 0; i < this.arcs.length; i++)
	{
		var weightData = "";
		if (this.arcs[i].weight != defaultWeight)
		{
			weightData = "<data key="+ weightKeyId + ">"+ this.arcs[i].weight + "</data>";
		}

		xmlBoby = xmlBoby + "<edge source=\"" + this.arcs[i].vertex1.id + "\" target=\""
			+ this.arcs[i].vertex2.id + "\" "+
			(this.arcs[i].isDirect != hasDirected ? (hasDirected ? "directed=\"false\"" : "directed=\"true\"") : "");
			
		xmlBoby = xmlBoby +	((weightData != "") ? ">" + weightData + "</edge>" : "/>")
	}	
	xml = mainHeader + weightNode + (hasDirected ? directedHeader : undirectedHeader) + xmlBoby + "</graph></graphml>"
	return xml;
}
/**
 * Graph class.
 *
 */

 
function Graph()
{
	// List of vertex.
	this.vertices = [];
	// List of arcs.
	this.edges   = [];
	// Unique Id of new graph.
	this.uidGraph = 0;
	// Unique Id of new edge.
	this.uidEdge = 10000;
	// Has direction edge.
	this.hasDirect = false;
};


Graph.prototype.AddNewVertex = function(vertex)
{
	if (this.vertices.length < 300)
	{
		vertex.SetId (this.uidGraph);
		this.uidGraph = this.uidGraph + 1;
		this.vertices.push(vertex);
	}
	return this.vertices.length - 1;
}

Graph.prototype.AddNewEdgeSafe = function(graph1, graph2, isDirect, weight)
{
	var useWeight = false;
	if (!isNaN(parseInt(weight, 10)))
	{
		useWeight = true;
	}
	weight = (!isNaN(parseInt(weight, 10)) && weight >= 0) ? weight : 1;
	return this.AddNewEdge(new BaseEdge(graph1, graph2, isDirect, weight, useWeight, 0));
}

Graph.prototype.AddNewEdge = function(edge)
{
    edge.id = this.uidEdge;
    this.uidEdge = this.uidEdge + 1;
    
	var edge1      = this.FindEdge(edge.vertex1.id, edge.vertex2.id);
	var edgeRevert = this.FindEdge(edge.vertex2.id, edge.vertex1.id);
	if (!edge.isDirect)
	{
		if (edge1 != null)
		{
			this.DeleteEdge(edge1);
		}
		if (edgeRevert != null)
		{
			this.DeleteEdge(edgeRevert);
		}
		this.edges.push(edge);
	}
	else
	{
		if (edge1 != null)
		{
			this.DeleteEdge(edge1);
		}
		if (edgeRevert != null && !edgeRevert.isDirect)
		{
			this.DeleteEdge(edgeRevert);
		}
		else if (edgeRevert != null)		
		{
			edgeRevert.hasPair = true;
			edge.hasPair = true;
		}
		
		this.edges.push(edge);
	}
	
	return this.edges.length - 1;
}


Graph.prototype.DeleteEdge = function(edgeObject)
{
	var index = this.edges.indexOf(edgeObject);
	if (index > -1) 
	{
		var edgeRevert = this.FindEdge(edgeObject.vertex2, edgeObject.vertex1);
		if (edgeRevert != null && edgeRevert.isDirect)
		{
			edgeRevert.isPair = false;
		}
		this.edges.splice(index, 1);
	}
}


Graph.prototype.DeleteVertex = function(vertexObject)
{
	var index = this.vertices.indexOf(vertexObject);
	if (index > -1) 
	{
		for (var i = 0; i < this.edges.length; i++)
		{
			if (this.edges[i].vertex1 == vertexObject || this.edges[i].vertex2 == vertexObject)
			{
				this.DeleteEdge(this.edges[i]);
				i--;
			}
		}
		this.vertices.splice(index, 1);
	}
}

Graph.prototype.FindVertex = function(id)
{
	var res = null;
	for (var i = 0; i < this.vertices.length; i++)
	{
		if (this.vertices[i].id == id)
		{
			res = this.vertices[i];
			break;
		}
	}
	
	return res;
}

Graph.prototype.FindEdge = function(id1, id2)
{
	var res = null;
	for (var i = 0; i < this.edges.length; i++)
	{
		if ((this.edges[i].vertex1.id == id1 && this.edges[i].vertex2.id == id2)
		     || (!this.edges[i].isDirect && this.edges[i].vertex1.id == id2 && this.edges[i].vertex2.id == id1))
		{
			res = this.edges[i];
			break;
		}
	}
	
	return res;
}

Graph.prototype.GetAdjacencyMatrix = function ()
{
	var matrix = "";
	for (var i = 0; i < this.vertices.length; i++)
	{
		for (var j = 0; j < this.vertices.length; j++)
		{	
			var edge = this.FindEdge (this.vertices[i].id, this.vertices[j].id);
			if (edge != null)
			{
				matrix += edge.weight;
			}
			else
			{
				matrix += "0";
			}
			
			if (j != this.vertices.length)
			{
				matrix += ", ";
			}
			
		}
		matrix = matrix + "\n";
	}
	
	return matrix;
}

Graph.prototype.TestAdjacencyMatrix = function (matrix, rowsObj, colsObj, separator = ",")
{
	var bGoodFormat = true;
	rowsObj.rows = [];
	rowsObj.rows = matrix.split ("\n");
	for (j = 0; j < rowsObj.rows.length; ++j)
	{
		//rowsObj.rows[j] = rowsObj.rows[j].replace(/ /g,'');
		if (rowsObj.rows[j] === "")
		{
			rowsObj.rows.splice(j--, 1);
		}
	}
	
	colsObj.cols = [];
	for (var i = 0; i < rowsObj.rows.length; i++)
	{
		colsObj.cols[i] = this.SplitMatrixString(rowsObj.rows[i], separator);//rowsObj.rows[i].split (",");
		for (j = 0; j < colsObj.cols[i].length; ++j)
		{
			if (colsObj.cols[i][j] === "")
			{
				colsObj.cols[i].splice(j--, 1);
			}
		}
		if (colsObj.cols[i].length != rowsObj.rows.length)
		{
			bGoodFormat = false;
			break;
		}
	}

	return bGoodFormat;
}


Graph.prototype.IsVertexesHasSamePosition = function (position, vertexCount)
{
	var res = false;

	for (var j = 0; j < Math.min(this.vertices.length, vertexCount); j++)
	{
		if (position.distance(this.vertices[j].position) < this.vertices[j].model.diameter * 2)
		{
			res = true;
			break;
		}
	}

	return res;
}

Graph.prototype.GetRandomPositionOfVertex = function (matrix, vertexIndex, viewportSize)
{
	var point = new Point(0, 0);

	var relatedVertex = [];

	for (var j = 0; j < matrix.length; j++)
	{
		if (j < this.vertices.length && (cols[vertexIndex][j] > 0 || cols[j][vertexIndex] > 0) && j != vertexIndex)
		{
			relatedVertex.push(this.vertices[j]);
		}
	}


	var diameter = (new VertexModel()).diameter;

	if (relatedVertex.length > 1)
	{
		for (var j = 0; j < relatedVertex.length; j++)
		{
			point = point.add(relatedVertex[j].position);
		}

		point = point.multiply(1 / relatedVertex.length);

		point.offset (Math.random() * diameter + (Math.random() ? -1 : 1) * 2 * diameter, Math.random() * diameter + (Math.random() ? -1 : 1) * 2 * diameter);
	}
	else
	{
		point = new Point(Math.random() * viewportSize.x, Math.random() * viewportSize.y);
	}

	if (this.IsVertexesHasSamePosition (point, matrix.length))
	{ 
		point.offset (Math.random() * diameter + + (Math.random() ? -1 : 1) * 4 * diameter, 
			Math.random() * diameter + + (Math.random() ? -1 : 1) * 4 * diameter);
	}

	// Clamp
	point.x = Math.min(Math.max(point.x, diameter), viewportSize.x);
	point.y = Math.min(Math.max(point.y, diameter), viewportSize.y);

	return point;
}

Graph.prototype.VertexesReposition = function (viewportSize, newVertexes)
{
   var maxGravityDistanceSqr = Math.max(viewportSize.x, viewportSize.y) / 5.0;
   maxGravityDistanceSqr  = maxGravityDistanceSqr * maxGravityDistanceSqr;
   //Math.min(viewportSize.x, viewportSize.y) / 2.0;
   var velocityDamping    = 0.85;
   var diameter = (new VertexModel()).diameter;
   var maxDistance = diameter * 3;
   var gravityDistanceSqr =  10  * (maxDistance * maxDistance);
   var edgeGravityKof     =  10  / (maxDistance);
   var kCenterForce       =  10  / (maxDistance * 10);
   var centerPoint = viewportSize.multiply(0.5);
   var velocityMax = maxDistance * 10;
    
   var edgesMatrix = {};   
   for (var i = 0; i < this.edges.length; i++)
   {  
        edgesMatrix[this.edges[i].vertex1.id + this.edges[i].vertex2.id * 1000] = 1;
        edgesMatrix[this.edges[i].vertex2.id + this.edges[i].vertex1.id * 1000] = 1;
   }
   
   var startAngel = Math.random() * 180.0;
   for(i = 0; i < newVertexes.length; i++) // loop through vertices
   {
      newVertexes[i].position.orbit(new Point(viewportSize.x / 2, viewportSize.y / 2), (viewportSize.x - diameter * 2) / 2, 
					(viewportSize.y - diameter * 2) / 2, 360 * i / newVertexes.length + startAngel);
   }
    
   var k = 0;
   var bChanged = true;
   while (k < 1000 && bChanged)
   {
      var vertexData = [];
      for(i = 0; i < newVertexes.length; i++) // loop through vertices
      {
         // Has no in newVertexes.
         var currentVertex = {};
         currentVertex.object    = newVertexes[i];
         currentVertex.net_force = new Point (0, 0);
         currentVertex.velocity   = new Point (0, 0);
         vertexData.push(currentVertex);

         for(j = 0; j < this.vertices.length; j++) // loop through other vertices
         {
            otherVertex = this.vertices[j];
      
            if (otherVertex == currentVertex.object) continue;
             
            // squared distance between "u" and "v" in 2D space
            var rsq = currentVertex.object.position.distanceSqr(otherVertex.position);
            
            
            {
              // counting the repulsion between two vertices
              var force = (currentVertex.object.position.subtract(otherVertex.position)).normalize(gravityDistanceSqr / rsq);
              currentVertex.net_force = currentVertex.net_force.add(force);
            }
         }

         for(j = 0; j < this.vertices.length; j++) // loop through edges
         {
            otherVertex = this.vertices[j];
            if (edgesMatrix.hasOwnProperty(currentVertex.object.id + 1000 * otherVertex.id))
            {
                var distance = currentVertex.object.position.distance(otherVertex.position);
                
                if (distance > maxDistance)
                {
                    // countin the attraction
                    var force = (otherVertex.position.subtract(currentVertex.object.position)).normalize(edgeGravityKof * (distance - maxDistance));
                    currentVertex.net_force = currentVertex.net_force.add(force);
                }
            }
         }
          
         // Calculate force to center of world.
         var distanceToCenter = centerPoint.distance(currentVertex.object.position);
         var force = centerPoint.subtract(currentVertex.object.position).normalize(distanceToCenter * kCenterForce);
         currentVertex.net_force = currentVertex.net_force.add(force);
          
         // counting the velocity (with damping 0.85)
         currentVertex.velocity = currentVertex.velocity.add(currentVertex.net_force);
     }

     bChanged = false;

     for(i = 0; i < vertexData.length; i++) // set new positions
     {
        var v = vertexData[i];
        var velocity = v.velocity;
        if (velocity.length() > velocityMax)
        {
            velocity = velocity.normalize(velocityMax);
        }
        v.object.position = v.object.position.add(velocity);
        if (velocity.length() >= 1)
        {
		  bChanged = true;
        }
     }
     k++;
   }
    
    
   // Looks like somthing going wrong and will use circle algorithm for reposition.
   var bbox = this.getGraphBBox();
   if (bbox.size().length() > viewportSize.length() * 1000)
   {
       for(i = 0; i < newVertexes.length; i++) // loop through vertices
       {
           newVertexes[i].position.orbit(new Point(viewportSize.x / 2, viewportSize.y / 2), (viewportSize.x - diameter * 2) / 2,
                                         (viewportSize.y - diameter * 2) / 2, 360 * i / newVertexes.length + startAngel);
       }
   }
   else
   {
       // Try to rotate graph to fill small area.
       var count = 10;
       var agnle  = 360.0 / count;
       var viewportAspect = viewportSize.x / viewportSize.y;
       var bestIndex = 0;
       var graphSize  = bbox.size();
       var bestAspect = graphSize.x / graphSize.y;
       var center     = bbox.center();
       
       for (var i = 1; i < count; i++)
       {
           for(j = 0; j < newVertexes.length; j++) // loop through vertices
           {
               newVertexes[j].position.rotate(center, agnle);
           }
           
           var newBBox   = this.getGraphBBox();
           var newAspect = newBBox.size().x / newBBox.size().y;
           if (Math.abs(newAspect - viewportAspect) < Math.abs(bestAspect - viewportAspect))
           {
               bestAspect = newAspect;
               bestIndex = i;
           }
       }
       
       // Rotate to best aspect.
       for(j = 0; j < newVertexes.length; j++) // loop through vertices
       {
           newVertexes[j].position.rotate(center, - agnle * (count - bestIndex - 1));
       }
   }
}

Graph.prototype.SetAdjacencyMatrix = function (matrix, viewportSize, currentEnumVertesType, separator = ",")
{
	var rowsObj = {};
	var colsObj = {};

	//ViewportSize = viewportSize.subtract(new Point((new VertexModel()).diameter * 2, (new VertexModel()).diameter * 2));

	if (this.TestAdjacencyMatrix(matrix, rowsObj, colsObj, separator))
	{
		rows = rowsObj.rows;
		cols = colsObj.cols;
		for (var i = 0; i < this.edges.length; i++)
		{
			this.DeleteEdge (this.edges[i]);
		}
		
		var newVertexes = [];
        var bWeightGraph = false;
        
		for (var i = 0; i < rows.length; i++)
		{
			for (var j = 0; j < rows.length; j++)
			{
				if (j >= this.vertices.length)
				{
					var newPos = this.GetRandomPositionOfVertex (matrix, j, viewportSize);
                    newVertexes.push(new BaseVertex(newPos.x, newPos.y, currentEnumVertesType));
					this.AddNewVertex(newVertexes[newVertexes.length - 1]);
				}
				
				if (cols[i][j] > 0)
				{
					var nEdgeIndex = this.AddNewEdgeSafe(this.vertices[i], this.vertices[j], cols[i][j] != cols[j][i], cols[i][j]);
                    if (nEdgeIndex >= 0)
                    {
                        bWeightGraph = bWeightGraph || this.edges[nEdgeIndex].weight != 1;
                    }
				}
			}
		}
        
        // Set use weight false, because we have unwieghts graph.
        if (!bWeightGraph)
        {
            this.edges.forEach(function(part, index, theArray) {
                               theArray[index].useWeight = false;
                               });
        }

		for (var i = rows.length; i < Math.max(this.vertices.length, rows.length); i++)
		{
			this.DeleteVertex(this.vertices[i]);
			i--;
		}                        

        this.VertexesReposition(viewportSize, newVertexes);
	}	
}


Graph.prototype.TestIncidenceMatrix = function (matrix, rowsObj, colsObj, separator = ",")
{
	var bGoodFormat = true;
	rowsObj.rows = [];
	rowsObj.rows = matrix.split ("\n");
	for (j = 0; j < rowsObj.rows.length; ++j)
	{
		if (rowsObj.rows[j] === "")
		{
			rowsObj.rows.splice(j--, 1);
		}
	}
	colsObj.cols = [];
	var columnCount = 0;
	for (var i = 0; i < rowsObj.rows.length; i++)
	{
		colsObj.cols[i] = this.SplitMatrixString(rowsObj.rows[i], separator);//rowsObj.rows[i].split (",");
		for (j = 0; j < colsObj.cols[i].length; ++j)
		{
			if (colsObj.cols[i][j] === "")
			{
				colsObj.cols[i].splice(j--, 1);
			}
		}
		if (i == 0)
		{
			columnCount = colsObj.cols[i].length;
		}
		if (colsObj.cols[i].length != columnCount)
		{
			bGoodFormat = false;
			break;
		}
	}


	if (bGoodFormat)
	{
		for (var i = 0; i < colsObj.cols[0].length; i++)
		{
			var values = [];
			for (j = 0; j < colsObj.cols.length; ++j)
			{
				if (colsObj.cols[j][i] != 0)
				{
					values.push(colsObj.cols[j][i]);
				}
			}

			if (!(values.length <= 1 ||  (values.length == 2 && (values[0] == values[1] || values[0] == -values[1]))))
			{
				bGoodFormat = false;
				break;
			}
		}
	}

	return bGoodFormat;
}

Graph.prototype.SetIncidenceMatrix = function (matrix, viewportSize, currentEnumVertesType)
{
	var rowsObj = {};
	var colsObj = {};

	//ViewportSize = viewportSize.subtract(new Point((new VertexModel()).diameter * 2, (new VertexModel()).diameter * 2));

	if (this.TestIncidenceMatrix(matrix, rowsObj, colsObj))
	{
		rows = rowsObj.rows;
		cols = colsObj.cols;
		for (var i = 0; i < this.edges.length; i++)
		{
			this.DeleteEdge (this.edges[i]);
		}
		var newVertexes = [];
        var bWeightGraph = false;
		for (var i = 0; i < cols[0].length; i++)
		{
			var edgeValue = [];
			var edgeIndex = [];
			for (var j = 0; j < cols.length; j++)
			{
				if (j >= this.vertices.length)
				{

					var newPos = new Point(0, 0);//this.GetRandomPositionOfVertex (matrix, j, viewportSize);
                                        newVertexes.push(new BaseVertex(newPos.x, newPos.y, currentEnumVertesType));
					this.AddNewVertex(newVertexes[newVertexes.length - 1]);
				}				

				if (cols[j][i] != 0)
				{
				  edgeValue.push(cols[j][i]);
				  edgeIndex.push(j);
				}
			}

			if (edgeIndex.length == 1)
			{
				edgeValue.push(edgeValue[0]);
				edgeIndex.push(edgeIndex[0]);
			}

			if (edgeIndex.length == 2)
			{       
				if (edgeValue[0] != edgeValue[1])
				{
					if (edgeValue[1] > 0)
					{
						edgeValue = edgeValue.swap(0, 1);
						edgeIndex = edgeIndex.swap(0, 1);
                			} 
				}
                
                var nEdgeIndex = this.AddNewEdgeSafe(this.vertices[edgeIndex[0]], this.vertices[edgeIndex[1]],
                                                     edgeValue[0] != edgeValue[1], Math.abs(edgeValue[1]));
                if (nEdgeIndex >= 0)
                {
                    bWeightGraph = bWeightGraph || this.edges[nEdgeIndex].weight != 1;
                }
			}
		}
        
        // Set use weight false, because we have unwieghts graph.
        if (!bWeightGraph)
        {
            this.edges.forEach(function(part, index, theArray) {
                               theArray[index].useWeight = false;
                               });
        }

		for (var i = cols.length; i < Math.max(this.vertices.length, cols.length); i++)
		{
			this.DeleteVertex(this.vertices[i]);
			i--;             
		}                        

          	this.VertexesReposition(viewportSize, newVertexes);
	}	
}

Graph.prototype.GetIncidenceMatrix = function ()
{
	var matrix = "";
	for (var i = 0; i < this.vertices.length; i++)
	{
		for (var j = 0; j < this.edges.length; j++)
		{	
			if (this.edges[j].vertex1 == this.vertices[i])
			{
				matrix += this.edges[j].weight;
			}
			else if (this.edges[j].vertex2 == this.vertices[i] && !this.edges[j].isDirect)
			{
				matrix += this.edges[j].weight;
			}
			else if (this.edges[j].vertex2 == this.vertices[i] && this.edges[j].isDirect)
			{
				matrix += -this.edges[j].weight;
			}
			else
			{
				matrix += "0";
			}
			
			if (j != this.edges.length - 1)
			{
				matrix += ", ";
			}
			
		}
		matrix = matrix + "\n";
	}
	
	return matrix;
}

Graph.prototype.SplitMatrixString = function (line, separator = ",")
{
  var res = [];
  var i = 0;

  // For case: 00110101101
  var isZeroOneLine = true;

  for (i = 0; i < line.length; i++)
  {
    if (line.charAt(i) != '0' && line.charAt(i) != '1')
    {
      isZeroOneLine = false;
      break;
    }
  } 

  if (!isZeroOneLine)
  {
    if (separator != ",")
    {
        line = line.replace(/,/g, ".");
    }
    for (i = 0; i < line.length; i++)
    {
      // add , if we use space as separator
      if (("0123456789.-e").indexOf(line.charAt(i)) < 0 )
      {
        if (i > 0)
        { 
          res.push(line.substr(0, i));
        }
        if (i == 0) 
        {
          i = 1;
        }
        line = line.substr(i, line.length - i);
        i = -1;
      }
    }
    if (line.length > 0)
    {
      res.push(line);
    }
  }
  else
  {
    for (i = 0; i < line.length; i++)
    {
      res.push(line.charAt(i));
    }
  }

  console.log(res);
  return res;
}


Graph.prototype.SaveToXML = function ()
{
	var mainHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><graphml>";
	var header   = "<graph id=\"Graph\" uidGraph=\"" + this.uidGraph + "\"" + " uidEdge=\"" + this.uidEdge + "\">";

	var xmlBoby = "<nodes>";
	  
	for (var i = 0; i < this.vertices.length; i++)
	{
		xmlBoby = xmlBoby + this.vertices[i].SaveToXML();
	}

	xmlBoby = xmlBoby + "</nodes><edges>";

	for (var i = 0; i < this.edges.length; i++)
	{
		xmlBoby = xmlBoby + this.edges[i].SaveToXML();
	}		

	xmlBoby = xmlBoby + "</edges>";

	return mainHeader + header + xmlBoby + "</graph></graphml>";
}

Graph.prototype.LoadFromXML = function (xmlText)
{
	xmlDoc = $.parseXML( xmlText );
	var $xml = $( xmlDoc );

	$graphs = $xml.find( "graph" );	

	var loadedGraphId = 0;
	var loadedEdgeId = 0;
    
	$graphs.each(function(){
		loadedGraphId = parseInt($(this).attr('uidGraph'));
		loadedEdgeId  = parseInt($(this).attr('uidEdge'));
	});
    
    // Back comportebility.
    if (isNaN(loadedEdgeId))
    {
        loadedEdgeId = 10000;
    }

	this.uidGraph = loadedGraphId;
	this.uidEdge  = loadedEdgeId;

	$nodes = $xml.find( "node" );	

	var vertexs = [];
	
	$nodes.each(function(){
		var vertex = new BaseVertex();
		vertex.LoadFromXML($(this));
		vertexs.push(vertex);
	});
	this.vertices = vertexs;

	$edges = $xml.find( "edge" );

	var edges = [];	
	var graph = this;
	$edges.each(function(){
		var edge = new BaseEdge();
		edge.LoadFromXML($(this), graph);
		edges.push(edge);
	});

	this.edges = edges;
}

Graph.prototype.hasDirectEdge = function ()
{
	var res = false;
	for (var i = 0; i < this.edges.length; i++)
	{
		if(this.edges[i].isDirect)
		{
			res = true;
			break;
		}
	}
	
	return res;
}

Graph.prototype.clampPositions = function (viewportSize)
{
	var diameter = (new VertexModel()).diameter;

     	for(i = 0; i < this.vertices.length; i++) // set new positions
     	{
       		this.vertices[i].position.x = Math.min(Math.max(this.vertices[i].position.x, diameter), viewportSize.x - diameter);
        	this.vertices[i].position.y = Math.min(Math.max(this.vertices[i].position.y, diameter), viewportSize.y - diameter);
        }
}

// Use to setup scaling.
Graph.prototype.getGraphBBox = function (viewportSize)
{
    var pointMin = new Point(1e5, 1e5);
    var pointMax = new Point(-1e5, -1e5);
    var diameter = (new VertexModel()).diameter;
    
    for(i = 0; i < this.vertices.length; i++)
    {
        var vertex = this.vertices[i];
        var deltaVector = new Point(vertex.diameterFactor() * diameter, diameter);
        pointMin = pointMin.min(vertex.position.subtract(deltaVector));
        pointMax = pointMax.max(vertex.position.add(deltaVector));
    }
    
    return new Rect(pointMin, pointMax);
}
/*
  Classes for create text for vertexs.
*/


/**
 * Base Enum Vertexs.
 *
 */ 
function BaseEnumVertices(app)
{
    this.app = app;
}

BaseEnumVertices.prototype.GetVertexText = function(id)
{
	return id;
}

BaseEnumVertices.prototype.GetVertexTextAsync = function(callback)
{
    callback (this);
}

BaseEnumVertices.prototype.GetText = function()
{
	return "1, 2, 3...";
}

BaseEnumVertices.prototype.GetValue = function()
{
	return "Numbers";
}

function TextEnumTitle(app, title)
{
    BaseEnumVertices.apply(this, arguments);
    this.pattern = "";
    this.title = title;
}


// inheritance.
TextEnumTitle.prototype = Object.create(BaseEnumVertices.prototype);

TextEnumTitle.prototype.GetVertexText = function(id)
{
    return this.title;
}



/**
 * Text Enum
 *
 */
function TextEnumVertexs(app)
{
	BaseEnumVertices.apply(this, arguments);
	this.pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
}


// inheritance.
TextEnumVertexs.prototype = Object.create(BaseEnumVertices.prototype);

TextEnumVertexs.prototype.GetVertexText = function(id)
{
	var res = "";

    res = this.pattern[id % this.pattern.length] + res;

	while (id >= this.pattern.length)
	{
	   id  = Math.floor(id / this.pattern.length) - 1;
	   res = this.pattern[id % this.pattern.length] + res;
	}

	return res;
}


TextEnumVertexs.prototype.GetText = function()
{
	return "A, B, ... Z";
}

TextEnumVertexs.prototype.GetValue = function()
{
	return "Latin";
}

/**
 * Text Enum
 *
 */
function TextEnumVertexsCyr(app)
{
	TextEnumVertexs.apply(this, arguments);
	this.pattern = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
}


// inheritance.
TextEnumVertexsCyr.prototype = Object.create(TextEnumVertexs.prototype);

TextEnumVertexsCyr.prototype.GetText = function()
{
	return "А, Б, ... Я";
}

TextEnumVertexsCyr.prototype.GetValue = function()
{
	return "Cyrillic";
}


/**
 * Text Enum
 *
 */
function TextEnumVertexsGreek(app)
{
	TextEnumVertexs.apply(this, arguments);
	this.pattern = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
}


// inheritance.
TextEnumVertexsGreek.prototype = Object.create(TextEnumVertexs.prototype);

TextEnumVertexsGreek.prototype.GetText = function()
{
	return "Α, Β, ... Ω";
}

TextEnumVertexsGreek.prototype.GetValue = function()
{
	return "Greek";
}

/**
 * Text Enum
 *
 */
function TextEnumVertexsCustom(app)
{
    BaseEnumVertices.apply(this, arguments);
    this.pattern = "";
}



// inheritance.
TextEnumVertexsCustom.prototype = Object.create(BaseEnumVertices.prototype);

TextEnumVertexsCustom.prototype.GetText = function()
{
    return g_customEnumVertex;
}

TextEnumVertexsCustom.prototype.GetValue = function()
{
    return "Custom";
}

TextEnumVertexsCustom.prototype.GetVertexTextAsync = function(callback)
{
    this.ShowDialog(callback, g_addVertex, g_addVertex, "A");
}


TextEnumVertexsCustom.prototype.ShowDialog = function(callback, buttonText, titleTitle, title)
{
    var dialogButtons = {};
    app = this.app;
    dialogButtons[buttonText] = function() {
        callback(new TextEnumTitle(app, $("#VertexTitle").val()));
        $( this ).dialog( "close" );
    };
    
    $( "#addVertex" ).dialog({
                             resizable: false,
                             height: "auto",
                             width:  "auto",
                             modal: true,
                             title: titleTitle,
                             buttons: dialogButtons,
                             dialogClass: 'EdgeDialog',
                             open: function () {
                                        $(this).off('submit').on('submit', function () {
                                                      return false;
                                                      });
                                        $("#VertexTitle").val(title);
                                        $("#VertexTitle").focus();
                                }
                             });
}
/**
 * This is main application class.
 *
 */
 
var globalApplication = null;
 
function Application(document, window)
{
    this.document = document;
    this.canvas  = this.document.getElementById('canvas');
    this.handler = new AddGraphHandler(this);
    this.savedGraphName = "";
    this.currentEnumVertesType = new BaseEnumVertices(this);//this.enumVertexesTextList[0];
    this.findPathReport = 1;
    this.isTimerRender = false;
    globalApplication  = this;
    this.renderPath = [];
    this.renderTimer = 0;
    this.renderPathLength  = 0;
    this.renderPathCounter = 0;
    this.renderPathLoops = 0;
    this.enumVertexesTextList = [new BaseEnumVertices(this), new TextEnumVertexs(this), new TextEnumVertexsCyr(this), new TextEnumVertexsGreek(this), new TextEnumVertexsCustom(this)];
    this.SetDefaultTransformations();
    this.algorithmsValues = {};
    this.userAction = function(){};
};

// List of graph.
//Application.prototype.graph.vertices     = [];
// Current draged object.
Application.prototype.graph = new Graph();
Application.prototype.dragObject = -1;
// List of graph.edges.
//Application.prototype.graph.edges       = [];
// User handler.
Application.prototype.handler = null;
// Hold status.
Application.prototype.status = {};
// Graph name length
Application.prototype.graphNameLength = 16;


Application.prototype.getMousePos = function(canvas, e)
{
    /// getBoundingClientRect is supported in most browsers and gives you
    /// the absolute geometry of an element
    var rect = canvas.getBoundingClientRect();

    /// as mouse event coords are relative to document you need to
    /// subtract the element's left and top position:
    return {x: (e.clientX - rect.left) / this.canvasScale - this.canvasPosition.x, y: (e.clientY - rect.top) / this.canvasScale - this.canvasPosition.y};
}

Application.prototype.redrawGraph = function()
{
    if (!this.isTimerRender)
    {
        this._redrawGraph();
    }
}

Application.prototype.redrawGraphTimer = function()
{
    if (this.isTimerRender)
    {
        var context = this._redrawGraph();
        
        // Render path
        if (this.renderPath.length > 1)
        {
            context.save();
            context.scale(this.canvasScale, this.canvasScale);
            context.translate(this.canvasPosition.x, this.canvasPosition.y);
            
            var movePixelStep = 16;
            var currentLength = 0;
            
            var i = 0
            for (i = 0; i < this.renderPath.length - 1; i++)
            {
                var edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
                currentLength += edge.GetPixelLength();
                if (currentLength > this.renderPathCounter)
                {
                    currentLength -= edge.GetPixelLength();
                    break;
                }
            }
            
            if (i >= this.renderPath.length - 1)
            {
                i = 0;
                this.renderPathCounter = 0;
                currentLength = 0;
                this.renderPathLoops += 1;
            }
            
            var edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
            
            var progress = (this.renderPathCounter - currentLength) / edge.GetPixelLength();
            
            this.RedrawEdgeProgress(context, edge, edge.vertex1.id == this.renderPath[i] ? progress : 1.0 - progress);

            this.renderPathCounter += movePixelStep;
            
            context.restore();
        }
    }
    
    if (this.renderPathLoops >= 5)
    {
        this.stopRenderTimer();
    }
}

Application.prototype._redrawGraph = function()
{
    var context = this.canvas.getContext('2d');
    
    context.save();
    context.clearRect(0, 0, Math.max(this.canvas.width, this.GetRealWidth()), Math.max(this.canvas.height, this.GetRealHeight()));
    context.scale(this.canvasScale, this.canvasScale);
    context.translate(this.canvasPosition.x, this.canvasPosition.y);
    
    this.RedrawEdges(context);
    this.RedrawNodes(context);
    
    context.restore();
    
    return context;
}

Application.prototype.updateRenderPathLength = function()
{
    this.renderPathLength = 0;
    this.renderPathCounter = 0;
    if (this.renderPath.length > 1)
    {
        for (var i = 0; i < this.renderPath.length - 1; i++)
        {
            var edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
            this.renderPathLength += edge.GetPixelLength();
        }
    }
}

Application.prototype.startRenderTimer = function()
{
    this.updateRenderPathLength();
    this.renderTimer = window.setInterval(function(){globalApplication.redrawGraphTimer();}, 50);
    this.isTimerRender = true;
    this.renderPathLoops = 0;
}

Application.prototype.stopRenderTimer = function()
{
    if (this.isTimerRender)
    {
        window.clearInterval(this.renderTimer);
        this.isTimerRender = false;
        this.renderPathLoops = 0;
    }
}

Application.prototype.setRenderPath = function(renderPath)
{
    this.renderPath = renderPath;
    
    if (this.renderPath.length > 0)
    {
        this.startRenderTimer();
    }
    else
    {
        this.stopRenderTimer();
    }
}

Application.prototype.RedrawEdge = function(context, edge)
{
    var arcDrawer = new BaseEdgeDrawer(context);
    var directArcDrawer  = new DirectArcDrawer(context);
    var commonStyle      = new CommonEdgeStyle(context);
    var selectedStyles   = selectedEdgeStyles;
    
    this._RedrawEdge(edge, arcDrawer, directArcDrawer, commonStyle, selectedStyles);
}

Application.prototype._RedrawEdge = function(edge, arcDrawer, directArcDrawer, commonStyle, selectedStyles)
{
    var selectedGroup = this.handler.GetSelectedGroup(edge);
    var currentStyle  = selectedGroup > 0 ?
        selectedStyles[(selectedGroup - 1) % selectedStyles.length] : commonStyle;
    
    this._RedrawEdgeWithStyle(edge, currentStyle, arcDrawer, directArcDrawer, commonStyle, selectedStyles);
}

Application.prototype._RedrawEdgeWithStyle = function(edge, style, arcDrawer, directArcDrawer, commonStyle, selectedStyles)
{
    if (!edge.isDirect)
    {
        arcDrawer.Draw(edge, style);
    }
    else
    {
        directArcDrawer.Draw(edge, style);
    }
}

Application.prototype.RedrawEdgeProgress = function(context, edge, progress)
{
    var arcDrawer        = new ProgressArcDrawer(context, new BaseEdgeDrawer(context), progress);
    var directArcDrawer  = new ProgressArcDrawer(context, new DirectArcDrawer(context), progress);
    var commonStyle      = new CommonEdgeStyle(context);
    var selectedStyles   = selectedEdgeStyles;

    this._RedrawEdge(edge, arcDrawer, directArcDrawer, commonStyle, selectedStyles);
}

Application.prototype.RedrawEdges = function(context)
{
    for (i = 0; i < this.graph.edges.length; i ++)
    {
        this.RedrawEdge(context, this.graph.edges[i]);
    }
}


Application.prototype.RedrawNodes = function(context)
{
    var graphDrawer = new BaseVertexDrawer(context);
    var commonGraphDrawer = new CommonVertexStyle();
    var selectedGraphDrawer = selectedGraphStyles;

    for (i = 0; i < this.graph.vertices.length; i ++)
    {
		var selectedGroup = this.handler.GetSelectedGroup(this.graph.vertices[i]);
		var currentStyle  = selectedGroup > 0 ?
				selectedGraphDrawer[(selectedGroup - 1) % selectedGraphDrawer.length] : commonGraphDrawer;

		//this.graph.vertices[i].upText = this.handler.GetUpText(this.graph.vertices[i]);

		graphDrawer.Draw(this.graph.vertices[i], currentStyle);
    }	
}


Application.prototype.updateMessage = function()
{
	this.document.getElementById('message').innerHTML = this.handler.GetMessage(); 
	this.handler.InitControls();
}

Application.prototype.CanvasOnMouseMove  = function(e)
{
	// X,Y position.
	var pos = this.getMousePos(this.canvas, e);

	this.handler.MouseMove(pos);
	if (this.handler.IsNeedRedraw())
	{
		this.handler.RestRedraw();
		this.redrawGraph();
	}

    this.updateMessage();
}

Application.prototype.CanvasOnMouseDown = function(e)
{
    var pos = this.getMousePos(this.canvas, e); /// provide this canvas and event

	this.handler.MouseDown(pos);
	if (this.handler.IsNeedRedraw())
	{
		this.handler.RestRedraw();
		this.redrawGraph();
	}

    this.updateMessage();
}

Application.prototype.CanvasOnMouseUp = function(e)
{
//	this.dragObject = -1;
	var pos = this.getMousePos(this.canvas, e);

	this.handler.MouseUp(pos);
	if (this.handler.IsNeedRedraw())
	{
		this.handler.RestRedraw();
		this.redrawGraph();
	}

    this.updateMessage();
}

Application.prototype.multCanvasScale = function(factor)
{
    var oldRealWidth = this.GetRealWidth();
    var oldRealHeight = this.GetRealHeight();
    
    this.canvasScale *= factor;
    
    this.canvasPosition = this.canvasPosition.add(new Point((this.GetRealWidth()  - oldRealWidth) / 2.0,
                                                            (this.GetRealHeight() - oldRealHeight) / 2.0));
    
    this.redrawGraph();
}

Application.prototype.setCanvasScale = function(factor)
{
    var oldRealWidth = this.GetRealWidth();
    var oldRealHeight = this.GetRealHeight();
    
    this.canvasScale = factor;
    
    this.canvasPosition = this.canvasPosition.add(new Point((this.GetRealWidth()  - oldRealWidth) / 2.0,
                                                            (this.GetRealHeight() - oldRealHeight) / 2.0));
    
    this.redrawGraph();
}

Application.prototype.onCanvasMove = function(point)
{
    this.canvasPosition = this.canvasPosition.add(point.multiply(1 / this.canvasScale));
    this.redrawGraph();
}

Application.prototype.AddNewVertex = function(vertex)
{
	return this.graph.AddNewVertex(vertex);
}

Application.prototype.AddNewEdge = function(edge)
{
	return this.graph.AddNewEdge(edge);
}

Application.prototype.CreateNewGraph = function(x, y)
{
    var app = this;
    
    this.currentEnumVertesType.GetVertexTextAsync(
                        function (enumType)
                        {
                            app.graph.AddNewVertex(new BaseVertex(x, y, enumType));
                            app.redrawGraph();
                                                  });
}

Application.prototype.CreateNewGraphEx = function(x, y, vertexEnume)
{
    return this.graph.AddNewVertex(new BaseVertex(x, y, vertexEnume));
}

Application.prototype.CreateNewArc = function(graph1, graph2, isDirect, weight)
{
	var useWeight = false;
	if (!isNaN(parseInt(weight, 10)))
	{
		useWeight = true;
	}
	weight = (!isNaN(parseInt(weight, 10)) && weight >= 0) ? weight : 1;
	return this.AddNewEdge(new BaseEdge(graph1, graph2, isDirect, weight, useWeight));
}

Application.prototype.DeleteEdge = function(edgeObject)
{
	this.graph.DeleteEdge(edgeObject);
}

Application.prototype.DeleteVertex = function(graphObject)
{
	this.graph.DeleteVertex(graphObject);
}

Application.prototype.DeleteObject = function(object)
{
	if (object instanceof BaseVertex)
	{
		this.DeleteVertex(object);
	}
	else if (object instanceof BaseEdge)
	{
		this.DeleteEdge(object);
	}
}

Application.prototype.FindVertex = function(id)
{
	return this.graph.FindVertex(id);
}

Application.prototype.FindEdge = function(id1, id2)
{
	return this.graph.FindEdge(id1, id2);
}

Application.prototype.FindPath = function(graph1, graph2)
{
	var creator = new GraphMLCreater(this.graph.vertices, this.graph.edges);
	var app = this;

	$.ajax({
	type: "POST",
	url: "/cgi-bin/GraphCGI.exe?dsp=cgiInput&start=" + graph1.id + "&finish=" + graph2.id + "&report=xml",
	data: creator.GetXMLString(),
	dataType: "text"
	})
	.done(function( msg ) 
	{		
		$('#debug').text(msg);
		xmlDoc = $.parseXML( msg );
		var $xml = $( xmlDoc );
		
		$nodes = $xml.find( "node" );	
		
		var pathObjects = new Array();
		var shortDistObjects = {};
		
		$nodes.each(function(){
			var id = $(this).attr('id');
			$data = $(this).find("data");
			$data.each(function(){
				if ("hightlightNode" == $(this).attr('key') && $(this).text() == "1")
				{
					pathObjects.push(app.FindVertex(id));  
				}
				if ("lowestDistance" == $(this).attr('key'))
				{
					shortDistObjects[id] = $(this).text();
				}
			});
		});
		
		$edges = $xml.find( "edge" );
		
		$edges.each(function(){
			var source = $(this).attr('source');
			var target = $(this).attr('target');
			pathObjects.push(app.FindEdge(source, target));
		});
		
		var $graph = $xml.find( "graph" );
		$graph.each(function(){
			var shortPathResult = $(this).attr('result');
			app.handler.SetShortPath(shortPathResult);
		});
		
		app.handler.SetObjects(pathObjects);
		app.handler.SetShortDist(shortDistObjects);

		app.redrawGraph();
		app.updateMessage();
	});
  
    // return empty, will set later.
	return [];
}

Application.prototype.SetHandlerMode = function(mode)
{
    if (this.handler)
    {
        this.handler.RestoreAll();
    }
	if (mode == "default")
	{
		this.handler = new DefaultHandler(this);
	}
	else if (mode == "addGraph")
	{
		this.handler = new AddGraphHandler(this);
	}
	else if (mode == "addArc")
	{
		this.handler = new ConnectionGraphHandler(this);
	}
	else if (mode == "delete")
	{
		this.handler = new DeleteGraphHandler(this);
	}
	else if (mode == "deleteAll")
	{
		var removeAll = new DeleteAllHandler(this);
		removeAll.clear();
	}	
	else if (mode == "findPath")
	{
		this.handler = new FindPathGraphHandler(this);
	}
	else if (mode == "showAdjacencyMatrix")
	{
		var showAdjacencyMatrix = new ShowAdjacencyMatrix(this);
		showAdjacencyMatrix.show();
	}
	else if (mode == "showIncidenceMatrix")
	{
		var showIncidenceMatrix = new ShowIncidenceMatrix(this);
		showIncidenceMatrix.show();
	}
	else if (mode == "connectedComponent")
	{
		this.handler = new ConnectedComponentGraphHandler(this);
	}  
	else if (mode == "saveDialog")
	{
		var savedDialogGraphHandler = new SavedDialogGraphHandler(this);
		savedDialogGraphHandler.show();
	}
    else if (mode == "saveDialogImage")
    {
        var savedDialogGraphImageHandler = new SavedDialogGraphImageHandler(this);
        savedDialogGraphImageHandler.show();
    }
    else if (mode == "eulerianLoop")
    {
		this.handler = new EulerianLoopGraphHandler(this);
    }
    else if (mode == "GroupRename")
    {
		var groupRenameVertices = new GroupRenameVertices(this);
		groupRenameVertices.show();
    }
    else if (g_AlgorithmIds.indexOf(mode) >= 0)
    {
        this.handler = new AlgorithmGraphHandler(this, g_Algorithms[g_AlgorithmIds.indexOf(mode)](this.graph, this));
    }
    
    console.log(mode);

    this.setRenderPath([]);
	this.updateMessage();
	this.redrawGraph();
}


Application.prototype.getParameterByName = function (name)
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

Application.prototype.onPostLoadEvent = function()
{
    this.SetEnumVertexsType(document.cookie.replace(/(?:(?:^|.*;\s*)enumType\s*\=\s*([^;]*).*$)|^.*$/, "$1"));

    var wasLoad = false;
    var matrix  = document.getElementById("inputMatrix").innerHTML;
    var separator = document.getElementById("separator").innerHTML == "space" ? " " : ",";
    
    console.log(matrix);
    console.log("separator: \"" + separator + "\"");
    
    matrix  = (matrix.length <= 0) ? this.getParameterByName("matrix") : matrix;
    if (matrix.length > 0)
    {   
	    if (!this.SetAdjacencyMatrixSmart(matrix, separator))
	    {
           this.userAction("AdjacencyMatrix.Failed");
		   this.ShowAdjacencyMatrixErrorDialog(matrix);
	    }
        else
        {
           this.userAction("AdjacencyMatrix.Success");
        }

    	this.updateMessage();
    	this.redrawGraph();
        wasLoad = true;
    }

    var matrix  = document.getElementById("inputIncidenceMatrix").innerHTML;
    matrix  = (matrix.length <= 0) ? this.getParameterByName("incidenceMatrix") : matrix;
    
    if (matrix.length > 0)
    {    
	    if (!this.SetIncidenceMatrixSmart(matrix))
	    {
            this.userAction("IncidenceMatrix.Failed");
		    this.ShowIncidenceMatrixErrorDialog(matrix);
	    }
        else
        {
            this.userAction("IncidenceMatrix.Success");
        }

    	this.updateMessage();
    	this.redrawGraph();
	    wasLoad = true;
    }

    if (!wasLoad)
    {
    	var graphName  = this.getParameterByName("graph");
	    if (graphName.length <= 0)
	    {
           graphName = document.cookie.replace(/(?:(?:^|.*;\s*)graphName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	    }
                          
       	if (graphName.length > 0)
	    {
            this.userAction("LoadGraphFromDisk");
    		this.LoadGraphFromDisk(graphName);
	    }
    }

    this.updateMessage();
    this.redrawGraph();
}

Application.prototype.onLoad = function()
{
    this.canvas = this.document.getElementById('canvas');

    this.handler = new AddGraphHandler(this);

    this.updateMessage();
    this.redrawGraph();
}

Application.prototype.NeedRedraw = function()
{
	//TODO
	this.updateMessage();
	this.redrawGraph();
}

Application.prototype.SetStatus = function(name, value)
{
	this.status[name] = value;
}

Application.prototype.GetStatus = function()
{
	return this.status[name];
}


Application.prototype.GetAdjacencyMatrix = function ()
{
	return this.graph.GetAdjacencyMatrix();
}

Application.prototype.TestAdjacencyMatrix = function (matrix, rowsObj, colsObj, separator = ",")
{
	return this.graph.TestAdjacencyMatrix(matrix, rowsObj, colsObj, separator);
}

Application.prototype.SetAdjacencyMatrix = function (matrix, separator = ",")
{
	var res = true;
        var r = {};
	var c = {};
	if (!this.TestAdjacencyMatrix(matrix, r, c, separator))
	{
		$.get( "/cgi-bin/addFailedMatrix.php?text=adjacency&matrix=" + encodeURIComponent(matrix), function( data ) {;});
		res = false;
	}

	this.graph.SetAdjacencyMatrix(matrix, new Point(this.GetRealWidth(), this.GetRealHeight()), this.currentEnumVertesType, separator);
    this.AutoAdjustViewport();
	this.redrawGraph();
	return res;
}


Application.prototype.GetIncidenceMatrix = function ()
{
	return this.graph.GetIncidenceMatrix();
}

Application.prototype.TestIncidenceMatrix = function (matrix, rowsObj, colsObj)
{
	return this.graph.TestIncidenceMatrix(matrix, rowsObj, colsObj);
}

Application.prototype.SetIncidenceMatrix = function (matrix)
{
	var res = true;
        var r = {};
	var c = {};
	if (!this.TestIncidenceMatrix(matrix, r, c))
	{
		$.get( "/cgi-bin/addFailedMatrix.php?text=incidence&matrix=" + encodeURIComponent(matrix), function( data ) {;});
		res = false;
	}

	this.graph.SetIncidenceMatrix(matrix, new Point(this.GetRealWidth(), this.GetRealHeight()), this.currentEnumVertesType);
    this.AutoAdjustViewport();
	this.redrawGraph();
	return res;
}

Application.prototype.Test = function ()
{
	this.graph.VertexesReposition(new Point(this.GetRealWidth(), this.GetRealHeight()), this.graph.vertices);
	this.redrawGraph();
}



Application.prototype.SetAdjacencyMatrixSmart = function (matrix, separator = ",")
{
	var res = false;
	if (this.TestAdjacencyMatrix(matrix, {}, {}, separator))
        {
    		res = this.SetAdjacencyMatrix(matrix, separator);
	}
        else if (this.TestIncidenceMatrix(matrix, {}, {}))
	{
    		res = this.SetIncidenceMatrix(matrix);
        }
	else
	{
    		res = this.SetAdjacencyMatrix(matrix);
	}
	return res;
}

Application.prototype.SetIncidenceMatrixSmart = function (matrix)
{
	var res = false;

        if (this.TestIncidenceMatrix(matrix, {}, {}))
	{
    		res = this.SetIncidenceMatrix(matrix);
        }
	else if (this.TestAdjacencyMatrix(matrix, {}, {})) 	
        {
    		res = this.SetAdjacencyMatrix(matrix);
	}
	else
	{
    		res = this.SetIncidenceMatrix(matrix);
	}

	return res;
}


Application.prototype.SaveGraphOnDisk = function ()
{
	var graphAsString = this.graph.SaveToXML();
	
	if (this.savedGraphName.length <= 0)
	{
		this.savedGraphName = this.GetNewGraphName();
	}

	var app = this;
	$.ajax({
	type: "POST",
	url: "/cgi-bin/saveGraph.php?name=" + this.savedGraphName,
	data: graphAsString,
	dataType: "text"
	})
	.done(function( msg ) 
	{
	        document.cookie = "graphName=" + app.savedGraphName;
	});
}
                          
Application.prototype.SaveGraphImageOnDisk = function ()
{
    var imageName = this.GetNewGraphName();
                          
    this.stopRenderTimer();
    this.redrawGraph();
                          
    var bbox = this.graph.getGraphBBox();
    
    var rectParams = "";
    if (this.IsGraphFitOnViewport())
    {
        var canvasWidth  = this.GetRealWidth();
        var canvasHeight = this.GetRealHeight();
        var canvasPositionInverse = this.canvasPosition.inverse();

        var pos = bbox.minPoint.subtract(canvasPositionInverse);
        
        rectParams = "&x=" + Math.round(pos.x * this.canvasScale) + "&y=" + Math.round(pos.y * this.canvasScale)
            + "&width=" + Math.round(bbox.size().x * this.canvasScale) + "&height=" + Math.round(bbox.size().y * this.canvasScale);
        
        //console.log(rectParams);
    }

    var imageBase64Data = this.canvas.toDataURL();

    $.ajax({
     type: "POST",
     url: "/cgi-bin/saveImage.php?name=" + imageName + rectParams,
     data: {
           base64data : imageBase64Data
     },
     dataType: "text"
     });
                          
    return imageName;
}
                          
                          


Application.prototype.LoadGraphFromDisk = function (graphName)
{
	var  app = this;

	$.ajax({
	type: "GET",
	url: "/cgi-bin/loadGraph.php?name=" + graphName
	})
	.done(function( msg ) 
	{
		var graph = new Graph();
		graph.LoadFromXML(msg);
        app.SetDefaultTransformations();
		app.graph = graph;
        app.AutoAdjustViewport();
        app.updateMessage();
        app.redrawGraph();
	});
}


Application.prototype.GetNewGraphName = function()
{
    var name = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < this.graphNameLength; i++ )
    {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return name;
}

Application.prototype.GetGraphName = function()
{
    return this.savedGraphName;
}


Application.prototype.SetDefaultHandler = function()
{
	restButtons ('Default');
	this.SetHandlerMode("default");
}

Application.prototype.GetEnumVertexsList = function()
{
	var res = [];

	for (var i = 0; i < this.enumVertexesTextList.length; i ++)
	{
		var one = {};
		one["text"]  = this.enumVertexesTextList[i].GetText();
		one["value"] = this.enumVertexesTextList[i].GetValue();

		one["select"] = this.enumVertexesTextList[i].GetValue() == this.currentEnumVertesType.GetValue();

		res.push(one);
	}

	return res;
}

Application.prototype.SetEnumVertexsType = function(value)
{
	for (var i = 0; i < this.enumVertexesTextList.length; i ++)
	{
		if (this.enumVertexesTextList[i].GetValue() == value)
		{
			this.currentEnumVertesType = this.enumVertexesTextList[i];
			document.cookie = "enumType=" + value;
			break;
		}
	}

}


Application.prototype.ShowAdjacencyMatrixErrorDialog = function(matrix)
{
	var dialogButtons = {};

	matrixRes = matrix.replace(/\n/g,'%0A');
	dialogButtons[g_readMatrixHelp] = function() {
			window.location.assign(g_language == "ru" ? "./wiki/Справка/МатрицаСмежности#matrixFormat" : "./wiki/Help/AdjacencyMatrix#matrixFormat");
		};
	dialogButtons[g_fixMatrix] = function() {
			window.location.assign("./create_graph_by_matrix?matrix=" + matrixRes);
		};
	dialogButtons[g_close] = function() {
			$( this ).dialog( "close" );					
		}; 

	$( "#matrixError" ).dialog({
		resizable: false,
		title: g_matrixWrongFormat,
		width: 400,
		modal: true,
		dialogClass: 'EdgeDialog',
		buttons: dialogButtons,
	});
}

Application.prototype.ShowIncidenceMatrixErrorDialog = function(matrix)
{
	var dialogButtons = {};

	matrixRes = matrix.replace(/\n/g,'%0A');
	dialogButtons[g_readMatrixHelp] = function() {
			window.location.assign(g_language == "ru" ? "./wiki/Справка/МатрицаИнцидентности#matrixFormat" : "./wiki/Help/IncidenceMatrix#matrixFormat");
		};
	dialogButtons[g_fixMatrix] = function() {
			window.location.assign("./create_graph_by_incidence_matrix?incidenceMatrix=" + matrixRes);
		};
	dialogButtons[g_close] = function() {
			$( this ).dialog( "close" );					
		}; 

	$( "#matrixErrorInc" ).dialog({
		resizable: false,
		title: g_matrixWrongFormat,
		width: 400,
		modal: true,
		dialogClass: 'EdgeDialog',
		buttons: dialogButtons,
	});
}
                          
Application.prototype.SetFindPathReport = function (value)
{
    this.findPathReport = value;
}
                          
Application.prototype.GetFindPathReport = function ()
{
    return this.findPathReport;
}
                          
                          
Application.prototype.CalculateAlgorithm = function(queryString, callbackObject)
{
    var app = this;
    var creator = new GraphMLCreater(app.graph.vertices, app.graph.edges);
    var pathObjects = [];
    var properties = {};
    var result = [];

    $.ajax({
         type: "POST",
         url: "/cgi-bin/GraphCGI.exe?" + queryString,
         data: creator.GetXMLString(),
         dataType: "text",
         })
    .done(function( msg )
        {
        console.log(msg);
        $('#debug').text(msg);
        xmlDoc = $.parseXML( msg );
        var $xml = $( xmlDoc );
        
        $results = $xml.find( "result" );
        
        $results.each(function(){
                      $values = $(this).find( "value" );
                      
                      $values.each(function(){
                                   var type  = $(this).attr('type');
                                   var value = $(this).text();
                                   var res = {};
                                   res.type = type;
                                   res.value = value;
                                   result.push(res);
                                   });
                      });
        
        $nodes = $xml.find( "node" );
        
        $nodes.each(function(){
                    var id = $(this).attr('id');
                    $data = $(this).find("data");
                    $data.each(function(){
                               if ("hightlightNode" == $(this).attr('key') && $(this).text() == "1")
                               {
                               pathObjects.push(app.FindVertex(id));
                               }
                               else
                               {
                               if (!properties[id])
                               {
                               properties[id] = {};
                               }
                               properties[id][$(this).attr('key')] = $(this).text();
                               }
                               });
                    });
        
        $edges = $xml.find( "edge" );
        
        $edges.each(function(){
                    var source = $(this).attr('source');
                    var target = $(this).attr('target');
                    pathObjects.push(app.FindEdge(source, target));
                    });
        
        console.log(result);
        
        callbackObject.CalculateAlgorithmCallback(pathObjects, properties, result);
        });

    return true;
}
                          
Application.prototype.GetRealWidth = function ()
{
    return this.canvas.width / this.canvasScale;
}
                          
Application.prototype.GetRealHeight = function ()
{
    return this.canvas.height / this.canvasScale;
}
                          
Application.prototype.SetDefaultTransformations = function()
{
    this.canvasScale = 1.0;
    this.canvasPosition = new Point(0, 0);
}

Application.prototype.AutoAdjustViewport = function()
{
    graphBBox  = this.graph.getGraphBBox();
    bboxCenter = graphBBox.center();
    bboxSize   = graphBBox.size();
                          
    if (bboxSize.length() > 0)
    {
        // Setup size
        if (bboxSize.x > this.GetRealWidth() || bboxSize.y > this.GetRealHeight())
        {
            this.canvasScale = Math.min(this.GetRealWidth() / bboxSize.x, this.GetRealHeight() / bboxSize.y);
        }
                          
        // Setup position.
        if (graphBBox.minPoint.x < 0.0 || graphBBox.minPoint.y < 0.0 ||
            graphBBox.maxPoint.x > this.GetRealWidth() || graphBBox.maxPoint.y > this.GetRealHeight())
        {
            // Move center.
            this.canvasPosition  = graphBBox.minPoint.inverse();
        }
    }
}
                          
Application.prototype.OnAutoAdjustViewport = function()
{
    this.SetDefaultTransformations();
    this.AutoAdjustViewport();
    this.redrawGraph();
}
                          
Application.prototype.getAlgorithmNames = function()
{
    var res = [];
    for (var i = 0; i < g_Algorithms.length; i++)
    {
        factory = g_Algorithms[i];
        var obj = {};
        oneFactory = factory(this.graph);
        obj.name = oneFactory.getName(g_language);
        obj.id   = oneFactory.getId();
        res.push(obj);
    }
    
    return res;
}
   
Application.prototype.resultCallback = function(paths)
{
    console.log(paths);
    if ((paths instanceof Object) && "paths" in paths)
    {
        this.setRenderPath(paths["paths"][0]);
    }
    this.updateMessage();
    this.redrawGraph();
}

Application.prototype.GetCurrentValue = function(paramName, defaultValue)
{
    return (paramName in this.algorithmsValues) ? this.algorithmsValues[paramName] : defaultValue;
}

Application.prototype.SetCurrentValue = function(paramName, value)
{
    this.algorithmsValues[paramName] = value;
}

Application.prototype.IsGraphFitOnViewport = function()
{
    res = true;
    graphBBox  = this.graph.getGraphBBox();
    var canvasWidth  = this.GetRealWidth();//  * this.canvasScale;
    var canvasHeight = this.GetRealHeight();// * this.canvasScale;
    var canvasPositionInverse = this.canvasPosition./*multiply(this.canvasScale).*/inverse();
    //console.log("BBox_min = " + graphBBox.minPoint.toString() + " - BBox_max = " + graphBBox.maxPoint.toString()
    //    + " Position" + canvasPositionInverse.toString() + " - cw = " + canvasWidth + " ch = " + canvasHeight);
    
    return (Math.floor(canvasPositionInverse.x) <= Math.floor(graphBBox.minPoint.x) &&
        Math.floor(canvasPositionInverse.y) <= Math.floor(graphBBox.minPoint.y) && Math.floor(canvasPositionInverse.x + canvasWidth) >= Math.floor(graphBBox.maxPoint.x)
        && Math.floor(canvasPositionInverse.y + canvasHeight) >= Math.floor(graphBBox.maxPoint.y));
}

                          
var application = new Application(document, window);

var waitCounter = false;
var userAction = function(str)
{
    if (typeof window.yaCounter25827098 !== "undefined")
    {
        console.log(str);
        window.yaCounter25827098.hit("http://" + window.location.hostname + "/UserAction#" + str);
    }
    else if (!waitCounter)
    {
        waitCounter = true;
        setTimeout(function()
                   {
                     userAction(str);
                   }, 2000);
    }
}

var isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 
           || navigator.userAgent.toLowerCase().indexOf("trident") != -1);

var buttonsList = ['AddGraph', 'ConnectGraphs', 'DeleteObject', 'Default'];

function restButtons (me)
{
    var needSetDefault = false;
	for (var i = 0; i < buttonsList.length; i ++)
	{
		if (buttonsList[i] != me)
		{
			document.getElementById(buttonsList[i]).className = "btn btn-default btn-sm";
		}
		else
		{
			if (document.getElementById(buttonsList[i]).className != "btn btn-default btn-sm")
			{
				needSetDefault = true;	
			}
		}
	}
	if (needSetDefault)
	{
		document.getElementById(buttonsList[i]).className = "btn btn-primary btn-sm";
	}
	else
	{
		document.getElementById(me).className = "btn btn-primary btn-sm";
	}
}

var single = 0;

function resizeCanvas()
{
        var adv = document.getElementById('adv');
        var canvas    = document.getElementById('canvas');
        canvas.width  = document.getElementById('canvasSection').offsetWidth;
        
            //canvas.height = document.getElementById('footer').offsetTop - document.getElementById('canvasSection').offsetTop - (adv && $("#adv").css("display") === 'block' ? document.getElementById('adv').offsetHeight : 0);
    canvas.height = $(window).height() - document.getElementById('canvas').offsetTop - (adv && $("#adv").css("display") === 'block' ? document.getElementById('adv').offsetHeight : 0) - ($("#footer").css("display") === 'block' ? document.getElementById('footer').offsetHeight : 0) - (document.documentElement.clientWidth < 650 ? 20 : 0);

   application.redrawGraph();
}

function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);

	first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function preLoadPage()
{
	loadTexts();
	application.onLoad();
}

function createAlgorithmMenu()
{
    var algorihtmsBaseId = "Algo";
    var algorithms = application.getAlgorithmNames();
    var index = 0;

    for (var i = 0; i < algorithms.length; i++)
    {
        algorithm = algorithms[i];
        
        var list   = document.getElementById("algorithmList");
        var item   = list.lastElementChild;
        var clone  = item.cloneNode(true);
        var button   = clone.getElementsByTagName("button")[0];
        var textSpan = button.getElementsByTagName("span")[1];
        button.id = algorithm.id;
        textSpan.innerHTML = algorithm.name;
        clone.style.display = "block";
        
        buttonsList.push(algorithm.id);
        
        button.onclick = function ()
        {
            userAction(this.id);
            restButtons (this.id);
            application.SetHandlerMode(this.id);
        }
        
        list.appendChild(clone);
        index++;
    }

}

function postLoadPage()
{
    application.userAction = userAction;
    
	application.canvas.onmousemove = function (e)
		{
			return application.CanvasOnMouseMove(e);
		};

	application.canvas.onmousedown = function (e)
		{
			return application.CanvasOnMouseDown(e);
		};
		
	application.canvas.onmouseup   = function (e)
		{
			return application.CanvasOnMouseUp(e);
		}
    
    application.canvas.onmousewheel = function (e)
    {
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta > 0)
        {
            application.multCanvasScale(1.3);
        }
        else
        {
            application.multCanvasScale(1.0 / 1.3);
        }
    }
    
    document.onkeypress   = function (e)
    {
        if (event.defaultPrevented
            || ($('#addVertex').hasClass('ui-dialog-content') && $('#addVertex').dialog('isOpen'))
            || ($('#adjacencyMatrix').hasClass('ui-dialog-content') && $('#adjacencyMatrix').dialog('isOpen'))
            || ($('#addEdge').hasClass('ui-dialog-content') && $('#addEdge').dialog('isOpen'))
            || ($('#incidenceMatrix').hasClass('ui-dialog-content') && $('#incidenceMatrix').dialog('isOpen'))
            || ($('#saveDialog').hasClass('ui-dialog-content') && $('#saveDialog').dialog('isOpen'))
            || ($('#saveImageDialog').hasClass('ui-dialog-content') && $('#saveImageDialog').dialog('isOpen'))
            || ($('#GroupRenameDialog').hasClass('ui-dialog-content') && $('#GroupRenameDialog').dialog('isOpen'))
            || $('#developerTools').css("display") != "none")
        {
            console.log("prevent");
            return; // Should do nothing if the default action has been cancelled
        }
        
        
        var key = 0;
        
        if(window.event)
        {
            key = event.keyCode;
        }
        else if(event.which)
        {
            key = event.which;
        }
        console.log(key);
        
        var moveValue = 10;
        if (key == 61 || key == 43) // +
        {
            application.multCanvasScale(1.5);
        }
        else if (key == 45) // -
        {
            application.multCanvasScale(1 / 1.5);
        }
        else if (key == 119 || key == 1094) // up
        {
            application.onCanvasMove(new Point(0, moveValue));
        }
        else if (key == 115 || key == 1099) // down
        {
            application.onCanvasMove(new Point(0, -moveValue));
        }
        else if (key == 97 || key == 1092) // left
        {
            application.onCanvasMove(new Point(moveValue, 0));
        }
        else if (key == 100 || key == 1074) // right
        {
            application.onCanvasMove(new Point(-moveValue, 0));
        }
    }

	document.getElementById('ShowAdjacencyMatrix').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("showAdjacencyMatrix");
		}		
	document.getElementById('ShowIncidenceMatrix').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("showIncidenceMatrix");
		}
    
	document.getElementById('GroupRename').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("GroupRename");
		}
	document.getElementById('groupRenameButton').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("GroupRename");
		}
    
		
	document.getElementById('Default').onclick = function ()
		{
            userAction(this.id);
			restButtons ('Default');
			application.SetHandlerMode("default");
			document.getElementById('Default').className = "btn btn-primary btn-sm";			
		}		
		
	document.getElementById('AddGraph').onclick = function ()
		{
            userAction(this.id);
			restButtons ('AddGraph');
			application.SetHandlerMode(document.getElementById('AddGraph').className != "" ? "addGraph" : "default");
		}
	
	document.getElementById('ConnectGraphs').onclick = function ()
		{
            userAction(this.id);
			restButtons ('ConnectGraphs');
			application.SetHandlerMode(document.getElementById('ConnectGraphs').className != "" ? "addArc" : "default");
		}	
	
	document.getElementById('DeleteObject').onclick = function ()
		{
            userAction(this.id);
			restButtons ('DeleteObject');
			application.SetHandlerMode(document.getElementById('DeleteObject').className != "" ? "delete" : "default");
		}

	document.getElementById('DeleteAll').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("deleteAll");
		}


	document.getElementById('SaveGraph').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("saveDialog");
		}

	document.getElementById('NewGraph').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("deleteAll");
            application.SetDefaultTransformations();
		}
    
    document.getElementById('SaveGraphImage').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("saveDialogImage");
    }
    
    document.getElementById('Zoom100').onclick = function ()
    {
        userAction(this.id);
        application.setCanvasScale(1.0);
    }
    
    document.getElementById('Zoom50').onclick = function ()
    {
        userAction(this.id);
        application.setCanvasScale(50 / 100);
    }
    
    document.getElementById('Zoom25').onclick = function ()
    {
        userAction(this.id);
        application.setCanvasScale(25 / 100);
    }
  
    document.getElementById('ZoomFit').onclick = function ()
    {
        userAction(this.id);
        application.OnAutoAdjustViewport();
    }
    
    document.getElementById('ZoomIn').onclick = function ()
    {
        userAction(this.id);
        application.multCanvasScale(1.5);
    }
    
    document.getElementById('ZoomOut').onclick = function ()
    {
        userAction(this.id);
        application.multCanvasScale(1.0 / 1.5);
    }
    
    document.getElementById('MoveWorspace').onclick = function ()
    {
        userAction(this.id);
        restButtons ('Default');
        application.SetHandlerMode("default");
        document.getElementById('Default').className = "btn btn-primary btn-sm";
    }

    document.getElementById('runUserScript').onclick = function ()
    {
        var el = document.getElementById('userScript');
        
        var oldScript = document.getElementById("userScriptSource");
        if (oldScript)
        {
            document.head.removeChild(oldScript);
        }
        
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.innerHTML = el.value;
        script.id = "userScriptSource";
        document.head.appendChild(script);
        
        application.SetHandlerMode("user.algorithm");
    }
    
    document.getElementById('submitUserScript').onclick = function ()
    {
        var script = document.getElementById('userScript');
        var data = "message=" + script.value + "&";
    
        $.ajax({
            type: "POST",
            url: "/feedback",
            data: data
        });
        
        $( "#sentAlgorithm" ).dialog({
                                     resizable: false,
                                     height: "auto",
                                     width:  400,
                                     modal: true,
                                     dialogClass: 'EdgeDialog'
                                     });
    }
    
    document.getElementById('devToolsZoom').onclick = function ()
    {
        var devTools = document.getElementById('developerTools');
        if (devTools.hasOwnProperty("isMin") && !devTools["isMin"])
        {
            devTools["isMin"] = true;
            devTools.style.width = "30%";
        }
        else
        {
            devTools["isMin"] = false;
            devTools.style.width = "100%";
        }
    }
    
    
    
    // Get algorithms list and load it.
    $.get( "/cgi-bin/getPluginsList.php",
            function( data )
            {
                var scriptList = JSON.parse(data);
          
                var loadOneScript = function()
                {
                    if (scriptList.length == 0)
                    {
                        createAlgorithmMenu();
                    }
                    else
                    {
                        var script = document.createElement('script');
                        script.src = scriptList[0];
                        scriptList.shift();
                        script.onload  = loadOneScript;
                        script.onerror = loadOneScript;
                        document.head.appendChild(script);
                    }
                }
          
                loadOneScript();
          
            });



    var devTools = document.getElementById('developerTools');
    devTools.style.left = 0;
	resizeCanvas();
	application.onPostLoadEvent();
}

//window.onload = function ()
$(document).ready(function ()
{

	window.onresize = function(event) 
		{
			resizeCanvas();
		}


    document.getElementById('canvas').addEventListener("touchstart", touchHandler, true);
    document.getElementById('canvas').addEventListener("touchmove", touchHandler, true);
    document.getElementById('canvas').addEventListener("touchend", touchHandler, true);
    document.getElementById('canvas').addEventListener("touchcancel", touchHandler, true);

/*
	$(document).ready(function(){
	    //set up some basic options for the feedback_me plugin
	    fm_options = {
	        position: "left-bottom",
	        message_placeholder: g_what_do_you_think,
	        message_required: true,
	        name_label: g_name,
	        message_label: g_feedback,
	        trigger_label: g_feedback,
	        submit_label: g_send,
	        title_label: g_write_to_us,	        
	        feedback_url: "/feedback",
	    };
	    //init feedback_me plugin
	    fm.init(fm_options);
	});
*/
});

Array.prototype.swap = function (x,y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}
