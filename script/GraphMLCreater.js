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
