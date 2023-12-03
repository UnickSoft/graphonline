// Undo Stack



function UndoStack(maxUndoStackSize) {
    this.undoStack  = [];
    this.maxUndoStackSize = maxUndoStackSize;
}

UndoStack.prototype.PushToStack = function(actionName, dataToSave)
{
    var object        = {};
    object.actionName = actionName;
    object.data       = dataToSave;    
    
    this.undoStack.push(object);

    while (this.undoStack.length > this.maxUndoStackSize)
    {
        this.undoStack.shift();
    }
}

UndoStack.prototype.Undo = function()
{
    if (this.IsUndoStackEmpty())
        return null;
    
    var state  = this.undoStack.pop();
    return state.data;
}

UndoStack.prototype.ClearUndoStack = function()
{
    this.undoStack = [];
}

UndoStack.prototype.IsUndoStackEmpty = function()
{
    return (this.undoStack.length <= 0);
}
