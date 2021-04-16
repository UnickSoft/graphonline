
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