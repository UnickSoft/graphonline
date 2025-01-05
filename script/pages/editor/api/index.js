{
    function onloadEditor() {
        console.log("onload() call");
        doIncludeAsync ([            
            include ("shared/canvas2svg.js"),
            include ("features/group_rename_handler/index.js"),
            include ("features/saved_graph_handler/index.js"),
            include ("features/saved_graph_image_handler/index.js"),
            include ("features/show_adjacency_matrix/index.js"),
            include ("features/show_distance_matrix/index.js"),
            include ("features/show_incidence_matrix/index.js"),
            include ("features/setup_background_style/index.js"),
            include ("features/setup_edge_style/index.js"),
            include ("features/setup_vertex_style/index.js"),
        ]);
        postLoadPage();
    }

    let modulDir = "pages/editor/";

    doInclude ([
        include ("shared/utils.js"),
        include ("shared/gzip.js"),
        
        include ("entities/graph/api/index.js"),
        include ("features/draw_graph/api/index.js"),
        include ("features/algorithms/api/index.js"),

        include ("features/base_handler/index.js"),
        include ("features/default_handler/index.js"),
        include ("features/add_vertices_handler/index.js"),
        include ("features/connect_vertices_handler/index.js"),
        include ("features/delete_objects_handler/index.js"),
        include ("features/algorithm_handler/index.js"),
        include ("features/select_auto_save_graph_or_not/index.js"),

        include ("features/serialization/api/index.js"),

        include ("features/enum_vertices/EnumVertices.js"),

        include ("model/texts.js", modulDir),
        include ("model/UndoStack.js", modulDir),
        include ("model/DiskSaveLoad.js", modulDir),
        include ("model/Application.js", modulDir),
        include ("ui/ya_metrika.js", modulDir),
        include ("ui/editor.js", modulDir),
        include ("ui/main.js", modulDir)],
    onloadEditor);

}