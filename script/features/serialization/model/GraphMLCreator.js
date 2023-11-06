/**
 *  This class creates GraphML xml.
 *
 */


function GraphMLCreator(nodes, arcs, ignoreNodes = {})
{
	this.nodes = nodes;
	this.arcs = arcs;
	this.ignoreNodes = ignoreNodes;	
}


GraphMLCreator.prototype.GetXMLString = function()
{
	var mainHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><graphml>";
	var directedHeader   = "<graph id=\"Graph\" edgedefault=\"directed\">";	
	var undirectedHeader = "<graph id=\"Graph\" edgedefault=\"undirected\">";
	
	var defaultWeight = 1.0;
	var weightKeyId  = "\"d0\"";
	var weightNode = "<key id="+ weightKeyId + " for=\"node\" attr.name=\"weight\" attr.type=\"double\">" +
			"<default>" + defaultWeight + "</default>" +
			"</key>";
	
	var xmlBody = "";
	  
	for (var i = 0; i < this.nodes.length; i++)
	{
		if (!this.ignoreNodes.hasOwnProperty(this.nodes[i].id))
			xmlBody = xmlBody + "<node id=\"" + this.nodes[i].id + "\"/>";
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

		xmlBody = xmlBody + "<edge source=\"" + arc.vertex1.id + "\" target=\""
			+ arc.vertex2.id + "\" " +
			(arc.isDirect != hasDirected ? (hasDirected ? "directed=\"false\"" : "directed=\"true\"") : "") +
		    " id=\"" + arc.id + "\"";
			
		xmlBody = xmlBody +	((weightData != "") ? ">" + weightData + "</edge>" : "/>")
	}	
	xml = mainHeader + weightNode + (hasDirected ? directedHeader : undirectedHeader) + xmlBody + "</graph></graphml>"
	return xml;
}
