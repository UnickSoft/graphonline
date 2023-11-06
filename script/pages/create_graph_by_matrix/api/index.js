
// Global version needs to force reload scripts from server.
globalVersion = 75;

{
    let modulDir = "pages/create_graph_by_matrix/";

    doInclude ([
        include ("entities/graph/api/index.js"),
        include ("model/createByMatrixMain.js", modulDir),
	include ("model/main.js", modulDir)
	]);
}