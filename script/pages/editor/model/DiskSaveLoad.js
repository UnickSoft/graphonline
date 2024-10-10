// Disk save load


var DiskSaveLoad = function () {};

DiskSaveLoad.LoadGraphFromDisk = function (graphName, callback)
{
	$.ajax({
	type: "GET",
	url: "/" + SiteDir + "backend/loadGraph.php?name=" + graphName
	})
	.done(callback);
}

DiskSaveLoad.SaveSVGGraphOnDisk = function (imageName, svgText, callback)
{
    $.ajax({
     type: "POST",
     url: "/" + SiteDir + "backend/saveSvg.php?name=" + imageName,
     data: {
           svgdata : svgText
     },
     dataType: "text",
     success: callback
     });
                          
    return imageName;
}

DiskSaveLoad.SaveGraphOnDisk = function (savedGraphName, graphAsString, callback)
{
	$.ajax({
	type: "POST",
	url: "/" + SiteDir + "backend/saveGraph.php?name=" + savedGraphName,
	data: graphAsString,
	dataType: "text"
	})
	.done(callback);
}

DiskSaveLoad.SaveGraphImageOnDisk = function (imageName, rectParams, imageBase64Data, callback)
{
    $.ajax({
     type: "POST",
     url: "/" + SiteDir + "backend/saveImage.php?name=" + imageName + rectParams,
     data: {
           base64data : imageBase64Data
     },
     dataType: "text",
     success: callback
     });
}