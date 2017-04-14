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

var g_processing = "Processing...";

var g_customEnumVertex = "Custom";
var g_addVertex = "Add vertex";

var g_renameVertex = "Rename vertex";
var g_rename = "Rename";

var g_language = "en";

var g_editWeight = "Edit weight";

var g_noWeight = "No weight";
var g_groupRename = "Group rename";

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
}
