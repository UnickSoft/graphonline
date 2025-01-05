doInclude ([
  include ("features/base_handler/index.js")
])

/**
 * Delete Graph handler.
 *
 */
function DeleteGraphHandler(app)
{
  this.removeStack = true;
  BaseHandler.apply(this, arguments);
  this.message = g_selectObjectToDelete;
  this.addContextMenu();
}

// inheritance.
DeleteGraphHandler.prototype = Object.create(BaseHandler.prototype);

DeleteGraphHandler.prototype.MouseDown = function(pos) 
{
	var selectedObject = this.GetSelectedObject(pos);
        
    if (!this.app.IsCorrectObject(selectedObject))
        return;
    
    this.app.PushToStack("Delete");
    this.app.DeleteObject(selectedObject);
	this.needRedraw = true;
}

/**
 * Delete Graph handler.
 *
 */
function DeleteAllHandler(app)
{
  BaseHandler.apply(this, arguments);  
}

// inheritance.
DeleteAllHandler.prototype = Object.create(BaseHandler.prototype);

DeleteAllHandler.prototype.clear = function() 
{	
    this.app.PushToStack("DeleteAll");

	  // Selected Graph.
    this.app.CreateNewGraphObject();
    this.needRedraw = true;
}
