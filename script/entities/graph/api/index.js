
{
let modulDir = "entities/graph/";

doInclude ([
    include ("shared/point.js"),
    include ("entities/edge/api/index.js"),
    include ("entities/vertex/api/index.js"),
    include ("model/Graph.js", modulDir)
])
}