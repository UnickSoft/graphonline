{
let modulDir = "features/draw_graph/";

doInclude ([
    include ("model/BaseBackgroundDrawer.js", modulDir),
    include ("model/BackgroundStyle.js", modulDir),
    include ("model/EdgeStyle.js", modulDir),
    include ("model/BaseEdgeDrawer.js", modulDir),
    include ("model/VertexShape.js", modulDir),
    include ("model/VertexStyle.js", modulDir),
    include ("model/VertexOldStyle.js", modulDir),
    include ("model/VertexPrintStyle.js", modulDir),
    include ("model/OldEdgeStyle.js", modulDir),
    include ("model/PrintEdgeStyle.js", modulDir),
    include ("model/VertexNewWhiteStyle.js", modulDir),
    include ("model/EdgeNewWhiteStyle.js", modulDir),
    include ("model/BaseVertexDrawer.js", modulDir),
    include ("model/GraphFullStyle.js", modulDir)
])

}