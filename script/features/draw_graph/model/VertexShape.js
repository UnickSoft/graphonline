/**
 * Graph drawer.
 */

// Vertex shape
const VertexCircleShape   = 0,
      VertexSquareShape   = 1,
      VertexTriangleShape = 2,
	  VertexPentagonShape = 3,
	  VertexHomeShape     = 4,
	  VertexTextboxShape = 5;
	  VertexSnowflakeShape = 6;

function GetSquarePoints(diameter)
{
  var res = [];

  var a = diameter;
  res.push(new Point(-a / 2, - a / 2));
  res.push(new Point(a / 2, -a / 2));
  res.push(new Point(a / 2, a / 2));
  res.push(new Point(-a / 2, a / 2));

  return res;
}

function GetTrianglePoints(diameter)
{
	var res = [];

  	var effectiveDiameter = diameter * 1.5;
  	var upOffset   = effectiveDiameter / 2;
  	var downOffset = effectiveDiameter / 4;
  	var lrOffset   = effectiveDiameter * 3 / (Math.sqrt(3) * 4);

  	res.push(new Point(0, - upOffset));
	res.push(new Point(lrOffset,   downOffset));
	res.push(new Point(- lrOffset, downOffset));

  	return res;
}

function GetPentagonPoints(diameter)
{
	var res = [];

	var baseValue = diameter / 2 * 1.2;

  	res.push(new Point(0, - baseValue));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72 * 2));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72 * 3));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72 * 4));
	res.push((new Point(0, - baseValue)).rotate(new Point(0, 0), 72 * 5));

  	return res;
}

function GetTextboxPoints(diameter, additional_data)
{
	var res = [];
	var width = diameter;
	var height = diameter;	
	
	if (additional_data)
	{
		var tempContext = document.createElement('canvas').getContext('2d');
		tempContext.font = "bold " + additional_data.style.mainTextFontSize + 
		DefaultFont;
		let metrics = tempContext.measureText(additional_data.text);
		width = metrics.width + diameter / 2;
		let actualHeight = metrics.actualBoundingBoxAscent * 1.6;
		height = Math.max(height, actualHeight);
	}

	res.push(new Point(-width / 2, -height / 2));
	res.push(new Point(width / 2, -height / 2));
	res.push(new Point(width / 2, height / 2));
	res.push(new Point(-width / 2, height / 2));

	return res;
}

function GetShowflakePoints(diameter) 
{
	var res = [];

	var superSmallRadius = diameter * 0.8 / 2;
	var smallRadius = diameter * 0.95 / 2;
	var bigRadius   = diameter * 1.5 / 2;
	let angel = 8;

	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), - angel));
	res.push(new Point(smallRadius, 0));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), angel));
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + angel));	
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60 + 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + angel));	
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60 + 60));	
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60));	
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + angel));	

	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60 + 60 + 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60));	
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 + angel));	
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60 + 60 + 60 + 60));
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 + 60 - angel));	
	res.push(new Point(smallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 + 60));	
	res.push(new Point(superSmallRadius, 0).rotate(new Point(0, 0), 60 + 60 + 60 + 60 + 60 + angel));	
	res.push(new Point(bigRadius, 0).rotate(new Point(0, 0), 30 + 60 + 60 + 60 + 60 + 60));

	return res;
}

function GetPointsForShape(shape, diameter, additional_data=null)
{
	switch (parseInt(shape))
	{
		case VertexSquareShape:   return GetSquarePoints(diameter); break;
		case VertexTriangleShape: return GetTrianglePoints(diameter); break;
		case VertexPentagonShape: return GetPentagonPoints(diameter); break;
		case VertexTextboxShape: return GetTextboxPoints(diameter, additional_data); break;
		case VertexSnowflakeShape:   return GetShowflakePoints(diameter); break;
		default: return null; break;
	}
}

function GetSizeForShape(shape, diameter)
{
	switch (parseInt(shape))
	{
		case VertexSquareShape:   return diameter; break;
		case VertexTriangleShape: return diameter * 1.5; break;
		case VertexPentagonShape: return diameter * 1.2; break;
		case VertexTextboxShape: return diameter; break;
		case VertexSnowflakeShape: return diameter * 1.5; break;

		default: return diameter; break;
	}
}