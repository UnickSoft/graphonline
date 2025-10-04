/**
 * File for algorithms.
 *
 */

// Return list of 'vertex = [connected vertices]'
function getVertexToVertexArray(graph, ignoreDirection)
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
		if (!edge.isDirect || ignoreDirection)
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

// Call this function to register your factory algorithm.
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

// @return name of algorithm. For now we supports only 2 locals: "ru" and "en"
BaseAlgorithm.prototype.getName = function(local)
{
    return "unknown_name_" + local;
}

// @return id of algorithm. Please use format: "your id"."algorithm id". Ex. "OlegSh.ConnectedComponent"
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

// @return true, if you change restore graph after use.
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

// This method is called, when messages was updated on html page.
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

BaseAlgorithm.prototype.getCategory = function()
{
    return 0;
}

// Algorithm support negative edge weight
BaseAlgorithm.prototype.IsSupportNegativeWeight = function()
{
    return false;
}

// Limit by number of vertexes for the algorithm.
BaseAlgorithm.prototype.MaxGraphSize = function()
{
    return 1000;
}

BaseAlgorithm.prototype.MaxEgdeNumber = function()
{
    return 10000;
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

/* This class add animation during processing algorithm. Add animation for ...*/
class ProcessingMessage 
{
    constructor(algorithm_object) {
      this.algorithm_object = algorithm_object;
      this.processing_index = 0;
      this.original_message = this.algorithm_object.message;
      this.processing_timer = setInterval(function() 
      {
          this.processing_index = (this.processing_index + 1) % 3;
          this.algorithm_object.message = this.original_message + ".".repeat(this.processing_index);
          this.algorithm_object.app.updateMessage();
      }.bind(this), 500);
    }

    stop() {
        this.algorithm_object.message = this.original_message;
        this.algorithm_object.app.updateMessage();
        clearInterval(this.processing_timer);
    }
}

BaseAlgorithmEx.prototype.CalculateAlgorithm = function(algorithmName, otherParams, resultCallback, ignoreSeparateNodes = false)
{
    // Setup processing message
    let processing_message = new ProcessingMessage(this);
    
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
      console.log(algorithmName + " " + otherParams);

    var graph = this.graph;
    var ignoreNodes = {};

    if (ignoreSeparateNodes)
        for (var i = 0; i < graph.vertices.length; i++)
            if (!graph.HasConnectedNodes(graph.vertices[i]))
                ignoreNodes[graph.vertices[i].id] = 1;

    var creator = new GraphMLCreator(graph.vertices, graph.edges, ignoreNodes);
    var pathObjects = [];
    var properties = {};
    var result = [];
    
    var xml = creator.GetXMLString();
    console.log(xml);

    var processResult = function (msg) {
        console.log(msg);
        $('#debug').text(msg);
        xmlDoc = $.parseXML( msg );
        var $xml = $( xmlDoc );
        
        $results = $xml.find( "result" );

        // Use native because jqueary hangs for results with 10000+ nodes.
        let values = $results[0].getElementsByTagName("value");
        for (var j = 0; j < values.length; j++) 
        {
            var type = values[j].getAttribute('type');
            var value = values[j].textContent;
            result.push({ type: type, value: value });
        }

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
        
        processing_message.stop();
        resultCallback(pathObjects, properties, result);
    };

    var callCGIAlgorithms = function ()
    {
        var queryString = algorithmName + "=cgiInput&report=xml";
        otherParams.forEach ( (param) => queryString += "&" + param.name + "=" + param.value);
        $.ajax({
            type: "POST",
            url: "/" + SiteDir + "cgi-bin/GraphCGI.exe?" + queryString,
            data: xml,
            dataType: "text",
            })
        .done(function( msg )
            {
                processResult(msg);
            });
    };

    if (this.app.isSupportEmscripten()) {
        console.log("Use Emscripten");
        var delimiter = "<s\\emscript_split\\s>";
        var processData = algorithmName + delimiter + xml + 
                          delimiter + "report" + delimiter + "xml";
        otherParams.forEach ( (param) => processData += delimiter + param.name + delimiter + param.value);
        var res = {};
        try {
            res = this.app.processEmscripten(processData);
        }
        catch (error) {
            userAction("emscripten_error_" + algorithmName);
            console.log("Error on Emscripten: " + error + "\n" + error.stack);
            callCGIAlgorithms();
            return true;
        }
        processResult(res);
    } else {
        console.log("Use new CGI");
        callCGIAlgorithms();
    }

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


