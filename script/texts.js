/**
 *  Place here all tests constans.
 *
 */


var g_textsSelectAndMove = "Drag objects";
var g_moveCursorForMoving = "Move cursor";
var g_clickToAddVertex = "Click to add vertex";
var g_selectFisrtVertexToConnect = "Select first vertex to connect";
var g_selectSecondVertexToConnect = "Select second vertex to connect";
var g_selectStartVertexForShortPath = "Select start vertex for shortest path";
var g_selectFinishVertexForShortPath = "Select finish vertex for shortest path";
var g_shortestPathResult = "Shortest path is %d";
var g_pathNotExists = "Path does not exists";
var g_selectObjectToDelete = "Select object to delete";


var g_addEdge = "Add edge";
var g_orintEdge = "Orient";
var g_notOrintEdge = "not Orient";

var g_adjacencyMatrixText = "Adjacency Matrix";
var g_save   = "Save";
var g_cancel = "Cancel";
var g_save_graph = "Save Graph";

var g_shortestDistance = "lowest-distance is ";
var g_incidenceMatrixText = "Incidence Matrix";

var g_save_dialog = "Save dialog";
var g_close       = "close";
var g_sickConnectedComponent = "Sick connected component is ";
var g_connectedComponent = "Connected component is ";


var g_what_do_you_think = "What do you think about site?";
var g_name = "Name";
var g_feedback = "Feedback";
var g_send = "Send";
var g_write_to_us = "Write to us";	        

var g_fixMatrix      = "Fix matrix";
var g_readMatrixHelp = "Matrix format help";
var g_matrixWrongFormat = "Matrix is wrong";

var g_save_image_dialog = "Save graph image";

var g_fullReport = "Full report";

var g_shortReport = "Short report";

var g_hasEulerianLoop = "Graph has Eulerian Loop";
var g_hasNotEulerianLoop  = "Graph has not Eulerian Loop";

var g_hasEulerianPath = "Graph has Eulerian Path";
var g_hasNotEulerianPath = "Graph has not Eulerian Path";

var g_processing = "Processing...";

var g_customEnumVertex = "Custom";
var g_addVertex = "Add vertex";

var g_renameVertex = "Rename vertex";
var g_rename = "Rename";

var g_language = "en";

var g_editWeight = "Edit weight";

var g_noWeight = "No weight";
var g_groupRename = "Group rename";
var g_vote = "Vote";

var g_recommendAlgorithm = "Recommend algorithm";

var g_graphOfMinDist = "Graph of minimal distances.";
var g_checkToSave    = "Check to save";
var g_showDistMatrix = "Show Distance matrix";
var g_minDistMatrixText = "Minimal distances matrix";

var g_selectStartVertexForMaxFlow  = "Select source vertex for max flow";
var g_selectFinishVertexForMaxFlow = "Select sink vertex for max flow";
var g_maxFlowResult = "Maximum flow from %2 to %3 is %1";
var g_flowNotExists = "Flow from %1 to %2 does not exists";

var g_sourceVertex = "Source";
var g_sinkVertex   = "Sink";

var g_hasHamiltonianLoop = "Graph has Hamiltonian Loop";
var g_hasNotHamiltonianLoop  = "Graph has not Hamiltonian Loop";

var g_hasHamiltonianPath = "Graph has Hamiltonian Path";
var g_hasNotHamiltonianPath = "Graph has not Hamiltonian Path";

var g_startTraversal = "Select start traversal vector";
var g_traversalOrder = "Traversal order: ";

var g_curveEdge      = "Curved edge";

var g_Undo           = "Undo";
var g_default        = "default";
var g_vertexDraw     = "Vertex draw style";
var g_edgeDraw       = "Edge draw style";
var g_backgroundStyle = "Bacgkround style";

var g_GrapsIsMultiMessage   = "Graph is multigraph";
var g_GrapsIsGeneralMessage = "";
var g_DefaultWeightPreset   = "no weight";
var g_dragGroupText         = "Drag group.";
var g_selectGroupText       = "Select using ctrl";
var g_copyGroupeButton      = "Dublicate";
var g_removeGroupeButton    = "Remove objects";

function loadTexts()
{
	g_textsSelectAndMove  = document.getElementById("SelectAndMoveObject").innerHTML;
	g_moveCursorForMoving = document.getElementById("MoveCursorForMoving").innerHTML;
	g_clickToAddVertex = document.getElementById("clickToAddVertex").innerHTML;
	g_selectFisrtVertexToConnect = document.getElementById("selectFisrtVertextToConnect").innerHTML;
	g_selectSecondVertexToConnect = document.getElementById("selectSecondVertextToConnect").innerHTML;
	g_selectStartVertexForShortPath = document.getElementById("selectStartShortPathVertex").innerHTML;
	g_selectFinishVertexForShortPath = document.getElementById("selectFinishShortPathVertex").innerHTML;
	g_shortestPathResult = document.getElementById("shortPathResult").innerHTML;
	g_pathNotExists = document.getElementById("pathNotExists").innerHTML;
	g_selectObjectToDelete = document.getElementById("selectObjectToDelete").innerHTML;

	g_addEdge             = document.getElementById("AddEdge").innerHTML;
	g_orintEdge           = document.getElementById("OrintEdge").innerHTML;
	g_notOrintEdge        = document.getElementById("NotOrintdge").innerHTML;

	g_adjacencyMatrixText = document.getElementById("AdjacencyMatrixText").innerHTML;
	g_save   = document.getElementById("Save").innerHTML;
	g_cancel = document.getElementById("Cancel").innerHTML;

    g_shortestDistance = document.getElementById("shortestDist").innerHTML;

    g_incidenceMatrixText = document.getElementById("IncidenceMatrixText").innerHTML;
	
	g_save_dialog = document.getElementById("saveDialogTitle").innerHTML;
	g_close       = document.getElementById("closeButton").innerHTML;

	g_sickConnectedComponent = document.getElementById("sickConnectedComponentResult").innerHTML;
	g_connectedComponent     = document.getElementById("connectedComponentResult").innerHTML;

	g_what_do_you_think = document.getElementById("whatDoYouThink").innerHTML;
	g_name = document.getElementById("name").innerHTML;
	g_feedback = document.getElementById("feedback").innerHTML;
	g_send = document.getElementById("send").innerHTML;
	g_write_to_us = document.getElementById("writeToUs").innerHTML;


	g_fixMatrix      = document.getElementById("fixMatrixButton").innerHTML;
	g_readMatrixHelp = document.getElementById("matrixHelp").innerHTML;
	g_matrixWrongFormat = document.getElementById("wronMatrixTitle").innerHTML;
    
    g_save_image_dialog = document.getElementById("saveImageDialogTitle").innerHTML;
    
    g_fullReport = document.getElementById("fullReport").innerHTML;
    g_shortReport = document.getElementById("shortReport").innerHTML;
    
    
    g_hasEulerianLoop    = document.getElementById("hasEulerianLoop").innerHTML;
    g_hasNotEulerianLoop = document.getElementById("hasNotEulerianLoop").innerHTML;
    
    g_processing = document.getElementById("processing").innerHTML;
    
    g_customEnumVertex = document.getElementById("customEnumVertex").innerHTML;
    
    g_addVertex = document.getElementById("addVertexText").innerHTML;
    
    g_renameVertex = document.getElementById("renameVertex").innerHTML;
    g_rename = document.getElementById("renameText").innerHTML;
    
    g_language = document.getElementById("currentLanguage").innerHTML;
    
    g_editWeight = document.getElementById("editWeight").innerHTML;
    
    g_noWeight = document.getElementById("noWeight").innerHTML;
    g_groupRename = document.getElementById("groupeRenameText").innerHTML;
    g_vote = document.getElementById("voteText").innerHTML;
    
    g_recommendAlgorithm = document.getElementById("recommend_algorithm").innerHTML;
    
    g_hasEulerianPath    = document.getElementById("hasEulerianPath").innerHTML;
    g_hasNotEulerianPath = document.getElementById("hasNotEulerianPath").innerHTML;
    
    g_graphOfMinDist = document.getElementById("graphOfMinDist").innerHTML;
    g_checkToSave    = document.getElementById("checkToSave").innerHTML;
    g_showDistMatrix = document.getElementById("showDistMatrix").innerHTML;
    g_minDistMatrixText = document.getElementById("distMatrixText").innerHTML;
    
    g_selectStartVertexForMaxFlow  = document.getElementById("selectStartVertexForMaxFlow").innerHTML;
    g_selectFinishVertexForMaxFlow = document.getElementById("selectFinishVertexForMaxFlow").innerHTML;
    g_maxFlowResult = document.getElementById("maxFlowResult").innerHTML;
    g_flowNotExists = document.getElementById("flowNotExists").innerHTML;
    
    g_sourceVertex = document.getElementById("sourceVertex").innerHTML;
    g_sinkVertex   = document.getElementById("sinkVertex").innerHTML;
    
    g_hasHamiltonianLoop    = document.getElementById("hasHamiltonianLoop").innerHTML;
    g_hasNotHamiltonianLoop = document.getElementById("hasNotHamiltonianLoop").innerHTML;

    g_hasHamiltonianPath    = document.getElementById("hasHamiltonianPath").innerHTML;
    g_hasNotHamiltonianPath = document.getElementById("hasNotHamiltonianPath").innerHTML;
    
    g_startTraversal = document.getElementById("startTraversal").innerHTML;
    g_traversalOrder = document.getElementById("traversalOrder").innerHTML;
    
    g_curveEdge = document.getElementById("curveEdge").innerHTML;
    
    g_Undo       = document.getElementById("undoTranslate").innerHTML;
    g_save_graph = document.getElementById("saveGraph").innerHTML;
    g_default    = document.getElementById("default").innerHTML;
    g_vertexDraw = document.getElementById("vertexDrawStyle").innerHTML;
    g_edgeDraw   = document.getElementById("edgeDrawStyle").innerHTML;
    
    g_backgroundStyle = document.getElementById("backgroundStyle").innerHTML;
    
    g_GrapsIsMultiMessage   = document.getElementById("graphIsMultiMessage").innerHTML;
    g_GrapsIsGeneralMessage = document.getElementById("graphIsGeneralMessage").innerHTML;
    g_DefaultWeightPreset   = document.getElementById("defaultWeightPreset").innerHTML;
    
    var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
    if (isMac)
        g_selectGroupText       = document.getElementById("selectGroupMac").innerHTML;
    else
        g_selectGroupText       = document.getElementById("selectGroupWin").innerHTML;
    
    g_dragGroupText         = document.getElementById("dragSelectedGroup").innerHTML;
    g_copyGroupeButton      = document.getElementById("copySelectedGroup").innerHTML;
    g_removeGroupeButton    = document.getElementById("removeSelectedGroup").innerHTML;
}
