
function gEncodeToHTML(str)
{
    if (typeof str !== 'string')
      return str;
        
    return str.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
}

function gDecodeFromHTML(str)
{
   if (typeof str !== 'string')
     return str;
    
   return str.replace(/&apos;/g, "'")
               .replace(/&quot;/g, '"')
               .replace(/&gt;/g, '>')
               .replace(/&lt;/g, '<')
               .replace(/&amp;/g, '&'); 
}

function FullObjectCopy(obj)
{
  var newObj = Object.create(Object.getPrototypeOf(obj));

  return Object.assign(newObj, obj);
}

function FullArrayCopy(arr)
{
  var res = [];

	arr.forEach(function(element) {

    var copyElement = FullObjectCopy(element);
    res.push(copyElement);
	});  

  return res;
}

function formatString(string, params) {
    return string.replace(/{(\d+)}/g, (match, index) => {
      return typeof params[index] !== 'undefined' ? params[index] : match;
    });
  }

Array.prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

function InvertColor(hex) {
    // Remove '#' if present
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    let r = 255 - parseInt(hex.slice(0, 2), 16);
    let g = 255 - parseInt(hex.slice(2, 4), 16);
    let b = 255 - parseInt(hex.slice(4, 6), 16);

    // Convert back to hex and pad with 0s if necessary
    const toHex = (n) => n.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function setDPIForCanvas(canvas, width, height) {
    const dpr = window.devicePixelRatio || 1;

    canvas.width  = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    if (dpr != 1)
    {
      canvas.style.width  = Math.round(width) + "px";
      canvas.style.height = Math.round(height) + "px";
    }

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function getCanvasLogicWidth(canvas) {
    const dpr = window.devicePixelRatio || 1;
    return canvas.width / dpr;
}

function getCanvasLogicHeight(canvas) {
    const dpr = window.devicePixelRatio || 1;
    return canvas.height / dpr;
}