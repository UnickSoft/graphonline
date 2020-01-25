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
	    var arc = this.arcs[i];

		if (this.arcs[i].weight != defaultWeight)
		{
		    weightData = "<data key=" + weightKeyId + ">" + arc.weight + "</data>";
		}

		xmlBoby = xmlBoby + "<edge source=\"" + arc.vertex1.id + "\" target=\""
			+ arc.vertex2.id + "\" " +
			(arc.isDirect != hasDirected ? (hasDirected ? "directed=\"false\"" : "directed=\"true\"") : "") +
		    " id=\"" + arc.id + "\"";
			
		xmlBoby = xmlBoby +	((weightData != "") ? ">" + weightData + "</edge>" : "/>")
	}	
	xml = mainHeader + weightNode + (hasDirected ? directedHeader : undirectedHeader) + xmlBoby + "</graph></graphml>"
	return xml;
}
