/*
  Classes for create text for vertexs.
*/


/**
 * Base Enum Vertexs.
 *
 */ 
function BaseEnumVertices(app, startNumber)
{
    this.app = app;
    this.startNumber = startNumber;
}

BaseEnumVertices.prototype.GetVertexText = function(id)
{
	return this.startNumber + id;
}

BaseEnumVertices.prototype.GetVertexTextAsync = function(callback)
{
    callback (this);
}

BaseEnumVertices.prototype.GetText = function()
{
	return this.startNumber + ", " + (this.startNumber + 1) + ", " + (this.startNumber + 2) + "...";
}

BaseEnumVertices.prototype.GetValue = function()
{
	return "Numbers" + this.startNumber;
}

function TextEnumTitle(app, title)
{
    BaseEnumVertices.apply(this, arguments);
    this.pattern = "";
    this.title = title;
}


// inheritance.
TextEnumTitle.prototype = Object.create(BaseEnumVertices.prototype);

TextEnumTitle.prototype.GetVertexText = function(id)
{
    return this.title;
}



/**
 * Text Enum
 *
 */
function TextEnumVertexs(app)
{
	BaseEnumVertices.apply(this, arguments);
	this.pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
}


// inheritance.
TextEnumVertexs.prototype = Object.create(BaseEnumVertices.prototype);

TextEnumVertexs.prototype.GetVertexText = function(id)
{
	var res = "";

    res = this.pattern[id % this.pattern.length] + res;

	while (id >= this.pattern.length)
	{
	   id  = Math.floor(id / this.pattern.length) - 1;
	   res = this.pattern[id % this.pattern.length] + res;
	}

	return res;
}


TextEnumVertexs.prototype.GetText = function()
{
	return "A, B, ... Z";
}

TextEnumVertexs.prototype.GetValue = function()
{
	return "Latin";
}

/**
 * Text Enum
 *
 */
function TextEnumVertexsCyr(app)
{
	TextEnumVertexs.apply(this, arguments);
	this.pattern = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
}


// inheritance.
TextEnumVertexsCyr.prototype = Object.create(TextEnumVertexs.prototype);

TextEnumVertexsCyr.prototype.GetText = function()
{
	return "А, Б, ... Я";
}

TextEnumVertexsCyr.prototype.GetValue = function()
{
	return "Cyrillic";
}


/**
 * Text Enum
 *
 */
function TextEnumVertexsGreek(app)
{
	TextEnumVertexs.apply(this, arguments);
	this.pattern = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
}


// inheritance.
TextEnumVertexsGreek.prototype = Object.create(TextEnumVertexs.prototype);

TextEnumVertexsGreek.prototype.GetText = function()
{
	return "Α, Β, ... Ω";
}

TextEnumVertexsGreek.prototype.GetValue = function()
{
	return "Greek";
}

/**
 * Text Enum
 *
 */
function TextEnumVertexsCustom(app)
{
    BaseEnumVertices.apply(this, arguments);
    this.pattern = "";
}



// inheritance.
TextEnumVertexsCustom.prototype = Object.create(BaseEnumVertices.prototype);

TextEnumVertexsCustom.prototype.GetText = function()
{
    return g_customEnumVertex;
}

TextEnumVertexsCustom.prototype.GetValue = function()
{
    return "Custom";
}

TextEnumVertexsCustom.prototype.GetVertexTextAsync = function(callback)
{
    this.ShowDialog(callback, g_addVertex, g_addVertex, "A");
}


TextEnumVertexsCustom.prototype.ShowDialog = function(callback, buttonText, titleTitle, title)
{
    var dialogButtons = {};
    app = this.app;
    dialogButtons[buttonText] = function() {
        app.PushToStack("RenameVertex");

        callback(new TextEnumTitle(app, $("#VertexTitle").val()));
        $( this ).dialog( "close" );
    };
    
    $( "#addVertex" ).dialog({
                             resizable: false,
                             height: "auto",
                             width:  "auto",
                             modal: true,
                             title: titleTitle,
                             buttons: dialogButtons,
                             dialogClass: 'EdgeDialog',
                             open: function () {
                                        $(this).off('submit').on('submit', function () {
                                                      return false;
                                                      });
                                        $("#VertexTitle").val(title);
                                        $("#VertexTitle").focus();
                                }
                             });
}
