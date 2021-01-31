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

// @return true, if you change resotry graph after use.
BaseAlgorithm.prototype.wantRestore = function()
{
    return false;
}

// calls this method if wantRestore return true.
BaseAlgorithm.prototype.restore = function()
{
}

// @return 0, if object is not selected, in other case return groupe of selection.
BaseAlgorithm.prototype.getObjectSelectedGroup = function(object)
{
    return 0;
}

// This methos is called, when messages was updated on html page.
BaseAlgorithm.prototype.messageWasChanged = function() {}

// Algorithm priority in menu
BaseAlgorithm.prototype.getPriority = function()
{
    return 0;
}

// Algorithm support multi graph
BaseAlgorithm.prototype.IsSupportMultiGraph = function()
{
    return false;
}

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
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
      console.log(queryString);

    var graph = this.graph;
    var creator = new GraphMLCreater(graph.vertices, graph.edges);
    var pathObjects = [];
    var properties = {};
    var result = [];
    
    var xml = creator.GetXMLString();
    console.log(xml);

    $.ajax({
         type: "POST",
         url: "/" + SiteDir + "cgi-bin/GraphCGI.exe?" + queryString,
         data: xml,
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
                        var edge = graph.FindEdge(source, target);
                        if (typeof $(this).attr('id') !== 'undefined')
                        {
                            edge = graph.FindEdgeById($(this).attr('id'));
                        }
                        pathObjects.push(edge);
            
                        $data = $(this).find("data");
                        $data.each(function(){
                            if (!properties[edge.id])
                            {
                                properties[edge.id] = {};
                            }
                            properties[edge.id][$(this).attr('key')] = $(this).text();
                        });
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
        if (array[index].type == 4)
        {
            res.push(array[index].value);
        }
    }
    return res;
}

BaseAlgorithmEx.prototype.GetNodesEdgesPath = function(array, start, count)
{
    var res = [];
    for (var index = start; index < start + count; index++)
    {
        if (array[index].type == 4 || array[index].type == 5)
        {
            res.push(array[index].value);
        }
    }
    return res;
}


