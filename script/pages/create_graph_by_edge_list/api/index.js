// Global version needs to force reload scripts from server.
globalVersion = 75;

{
    let modulDir = "pages/create_graph_by_edge_list/";

    doInclude ([
        include ("entities/graph/api/index.js")]);
}