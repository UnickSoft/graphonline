doInclude ([
    include ("features/base_handler/index.js")
])

/**
 * Add Graph handler.
 *
 */
function AddGraphHandler(app)
{
  this.removeStack = true;
  BaseHandler.apply(this, arguments);
  this.message = g_clickToAddVertex;	
  this.addContextMenu();
}

// inheritance.
AddGraphHandler.prototype = Object.create(BaseHandler.prototype);

AddGraphHandler.prototype.MouseDown = function(pos) 
{
    this.app.PushToStack("Add");

	this.app.CreateNewGraph(pos.x, pos.y);
	this.needRedraw = true;
	this.inited = false;
}

AddGraphHandler.prototype.InitControls = function() 
{
    var enumVertexsText = document.getElementById("enumVertexsText");
    if (enumVertexsText)
    {
        var enumsList = this.app.GetEnumVerticesList();
        for (var i = 0; i < enumsList.length; i ++)
        {
            var option = document.createElement('option');
            option.text  = enumsList[i]["text"];
            option.value = enumsList[i]["value"];
            enumVertexsText.add(option, i);
            if (enumsList[i]["select"])
            {
                enumVertexsText.selectedIndex = i;
            }
        }
        
        var addGraphHandler = this;
        enumVertexsText.onchange = function () {
            addGraphHandler.ChangedType();
        };
    }
}

AddGraphHandler.prototype.ChangedType = function() 
{
	var enumVertexsText = document.getElementById("enumVertexsText");

	this.app.SetEnumVerticesType(enumVertexsText.options[enumVertexsText.selectedIndex].value);
}
