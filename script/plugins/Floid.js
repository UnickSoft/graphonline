/**
 * Find short path.
 *
 */
function FloidAlgorithm(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.selectedObjects = {};
    this.matrix  = [];
    this.updateMessage(false);
    this.edgesCopy = [];
}


// inheritance.
FloidAlgorithm.prototype = Object.create(BaseAlgorithmEx.prototype);
// First selected.
FloidAlgorithm.prototype.firstObject = null;
// Second selected.
FloidAlgorithm.prototype.secondObject = null;
// Path
FloidAlgorithm.prototype.pathObjects = null;
// infinity
FloidAlgorithm.prototype.infinity = 1E8;

FloidAlgorithm.prototype.getName = function(local)
{
    return local == "ru" ? "Алгоритм Флойда — Уоршелла" : "Floyd–Warshall algorithm";
}

FloidAlgorithm.prototype.getId = function()
{
    return "OlegSh.FloidAlgorithm";
}

// @return message for user.
FloidAlgorithm.prototype.getMessage = function(local)
{
    return this.message;
}

FloidAlgorithm.prototype.result = function(resultCallback)
{
    var result = {};
    result["version"] = 1;
    
    this.matrix = [];
    
    this.resultMatrix();
    
    //console.log(this.matrix);
    
    // Remove all edges.
    this.egdesCopy = this.graph.edges.slice();
    this.removeAllEdges();
    
    this.graph.hasDirect = false;
    
    // Added new edges
    for (var i = 0; i < this.graph.vertices.length; i ++)
    {
        for (var j = 0; j < this.graph.vertices.length; j ++)
        {
            if (i != j)
            {
                var directed = (this.matrix[i][j] != this.matrix[j][i]);
                if (this.matrix[i][j] < this.infinity && (directed || i < j))
                {
                    this.graph.AddNewEdgeSafe(this.graph.vertices[i], this.graph.vertices[j], directed, this.matrix[i][j]);
                }
            }
        }
    }
    
    this.app.redrawGraph();
    
    return result;
    
    /*
    if (this.firstObject && this.secondObject)
    {
        this.outResultCallback = function (result ) { resultCallback(result); };
        self = this;
        this.CalculateAlgorithm("dsp=cgiInput&start=" + this.firstObject.id + "&finish=" + this.secondObject.id + "&report=xml", function (pathObjects, properties, results)
                                                                    {
                                                                        self.resultCallback(pathObjects, properties, results);
                                                                    });
    }
    return null;
    */
}


FloidAlgorithm.prototype.resultMatrix = function()
{
    this.matrix = [];
    
    for (var i = 0; i < this.graph.vertices.length; i ++)
    {
        this.matrix.push([]);
        var v1 = this.graph.vertices[i];
        var str = "";
        for (var j = 0; j < this.graph.vertices.length; j ++)
        {
            var v2 = this.graph.vertices[j];
            var edge = this.graph.FindEdge(v1.id, v2.id);
            if (edge != null)
            {
                this.matrix[i][j] = edge.GetWeight();
            }
            else
            {
                this.matrix[i][j] = this.infinity;               
            }
        }
    }
    
    for (var k = 0; k < this.graph.vertices.length; k ++)
        for (var i = 0; i < this.graph.vertices.length; i ++)
            for (var j = 0; j < this.graph.vertices.length; j ++)
                {
                    if (this.matrix[i][j] > this.matrix[i][k] + this.matrix[k][j])
                    {
                        this.matrix[i][j] = this.matrix[i][k] + this.matrix[k][j];
                    }
                }
    
    return this.matrix;
}


FloidAlgorithm.prototype.getObjectSelectedGroup = function(object)
{
    return 0;
}

FloidAlgorithm.prototype.messageWasChanged = function()
{
    var self = this;
    
    var matrixButton = document.getElementById("showFloidMatrix");
    if (matrixButton)
    {
        matrixButton.onclick = function () {
            var dialogButtons = {};
            dialogButtons[g_close] = function() {
				$( this ).dialog( "close" );						
			};
            $( "#FloidMatrixField" ).val(self.GetFloidMatrix());	
            $( "#floidMatrix" ).dialog({
		        resizable: false,
                height: "auto",
                width:  "auto",
		        modal: true,
		        title: g_minDistMatrixText,
                buttons: dialogButtons,
                dialogClass: 'EdgeDialog'
	       });
        };
    }
    
    $('#saveFloidGraph').change(function() {
        self.updateMessage(this.checked);
    });
}

FloidAlgorithm.prototype.GetFloidMatrix = function()
{
    return this.graph.GetAdjacencyMatrixStr();
}


FloidAlgorithm.prototype.changedType = function()
{
    var enumReport = document.getElementById("enumReport");
    
    this.app.SetCurrentValue("findShortPathReportType", enumReport.options[enumReport.selectedIndex].value);
    this.updateUpText();
}

FloidAlgorithm.prototype.getPriority = function()
{
    return -9.5;
}

FloidAlgorithm.prototype.removeAllEdges = function()
{
    while (this.graph.edges.length > 0)
    {
        this.graph.DeleteEdge(this.graph.edges[0]);
    }
}

FloidAlgorithm.prototype.wantRestore = function()
{
    console.log($("#saveFloidGraph").is(':checked'));
    return !$("#saveFloidGraph").is(':checked');
}

FloidAlgorithm.prototype.restore = function()
{
    this.removeAllEdges();
    
    this.graph.hasDirect = false;
    console.log(this.egdesCopy);
    
    for (var i = 0; i < this.egdesCopy.length; i ++)
    {
        this.graph.AddNewEdgeSafe(this.egdesCopy[i].vertex1, this.egdesCopy[i].vertex2, this.egdesCopy[i].isDirect, this.egdesCopy[i].weight);
    }
}

FloidAlgorithm.prototype.updateMessage = function(save)
{
    this.message = g_graphOfMinDist + " <label style=\"margin-bottom: 0px\">" + g_checkToSave + " <input id=\"saveFloidGraph\" type=\"checkbox\"" + (save ? "checked" : "") + "></label>" +
        "<button type=\"button\" class=\"btn btn-default btn-xs\" id=\"showFloidMatrix\" style=\"float:right\">" + g_showDistMatrix + "</button>"
}

// Factory for connected components.
function CreateFloidAlgorithm(graph, app)
{
    return new FloidAlgorithm(graph, app)
}

// Gerister connected component.
RegisterAlgorithm (CreateFloidAlgorithm);
