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

Rect.prototype.left = function()
{
    return this.minPoint.x;
};

Rect.prototype.top = function()
{
    return this.minPoint.y;
};

Rect.prototype.isIn = function(v)
{
    return this.minPoint.x <= v.x && this.minPoint.y <= v.y && 
           this.maxPoint.x > v.x  && this.maxPoint.y > v.y;
};
