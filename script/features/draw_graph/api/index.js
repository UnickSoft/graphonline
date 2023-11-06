{
let modulDir = "features/draw_graph/";

doInclude ([
    include ("model/BaseBackgroundDrawer.js", modulDir),
    include ("model/BaseEdgeDrawer.js", modulDir),
    include ("model/BaseVertexDrawer.js", modulDir)
])

}