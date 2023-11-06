/**
 * Find short path.
 *
 */
function BaseTraversal(graph, app)
{
    BaseAlgorithmEx.apply(this, arguments);
    this.visited = [];
    this.edges   = [];
    this.timer   = null;
}

// inheritance.
BaseTraversal.prototype = Object.create(BaseAlgorithmEx.prototype);
// timer interval
BaseTraversal.prototype.timerInterval = 500;

BaseTraversal.prototype.result = function(resultCallback)
{
    var result = {};
    result["version"] = 1;
    
    return result;
}

BaseTraversal.prototype.selectVertex = function(vertex)
{
	this.visited = [];
    this.edges   = [];

    if (this.timer)
        clearTimeout(this.timer);
    this.timer   = null;
    
    this.visited.push(vertex);

    var context = this;
    this.timer  = setInterval(function()
                             {
                               context.step();
                             }, this.timerInterval);

    this.message = this.getMainMessage();

    return true;
}

BaseTraversal.prototype.getObjectSelectedGroup = function(object)
{
    return (this.visited.includes(object) ? 1 : (this.edges.includes(object) ? 1 : 0));
}

BaseTraversal.prototype.instance = function()
{
    return false;
}
