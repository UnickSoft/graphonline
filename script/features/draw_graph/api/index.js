{
let modulDir = "features/draw_graph/";

doInclude ([
    include ("model/BaseBackgroundDrawer.js", modulDir),
    include ("model/EdgeStyle.js", modulDir),
    include ("model/BaseEdgeDrawer.js", modulDir),
    include ("model/VertexShape.js", modulDir),
    include ("model/VertexStyle.js", modulDir),
    include ("model/BaseVertexDrawer.js", modulDir),
    include ("model/GraphFullStyle.js", modulDir)
])

}