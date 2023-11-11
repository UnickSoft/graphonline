{
    let modulDir = "pages/create_graph_by_matrix/";

    doInclude ([
        include ("entities/graph/api/index.js"),
        include ("model/createByMatrixMain.js", modulDir),
	include ("model/main.js", modulDir)
	]);
}