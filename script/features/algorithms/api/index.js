{
let modulDir = "features/algorithms/";

doInclude ([
    include ("model/Algorithms.js", modulDir),
    include ("model/BaseTraversal.js", modulDir)
])

function loadAsyncAlgorithms(onFinish) {
    let modulDir = "features/algorithms/";
    let pluginsList = ["BFS.js",
                    "Coloring.js",
                    "ConnectedComponent.js",
                    "DFS.js",
                    "EulerianLoop.js",
                    "EulerianPath.js",
                    "FindAllPatches.js",
                    "FindLongestPath.js",
                    "FindShortPatchsFromOne.js",
                    "Floid.js",
                    "GraphReorder.js",
                    "HamiltonianLoop.js",
                    "HamiltonianPath.js",
                    "IsomorphismCheck.js",
                    "MaxClique.js",
                    "MaxFlow.js",
                    "MinimumSpanningTree.js",
                    "ModernGraphStyle.js",
                    "RadiusAndDiameter.js",
                    "ShortestPath.js",
                    "VerticesDegree.js",
                    "MaxIndependentSet.js",
                    "FindAllShortestPatches.js",
                    "SalesmanProblem.js",
                    "SalesmanProblemPath.js"];

    doIncludeAsync (pluginsList.map((plugin) =>  include ("model/plugins/" + plugin, modulDir)), onFinish);
}

}