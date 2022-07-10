/*
  Classes for creating text for vertices.
*/


/**
 * Base Enum Vertices.
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
function TextEnumVertices(app)
{
	BaseEnumVertices.apply(this, arguments);
	this.pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
}


// inheritance.
TextEnumVertices.prototype = Object.create(BaseEnumVertices.prototype);

TextEnumVertices.prototype.GetVertexText = function(id)
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


TextEnumVertices.prototype.GetText = function()
{
	return "A, B, ... Z";
}

TextEnumVertices.prototype.GetValue = function()
{
	return "Latin";
}

/**
 * Text Enum
 *
 */
function TextEnumVerticesCyr(app)
{
	TextEnumVertices.apply(this, arguments);
	this.pattern = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
}


// inheritance.
TextEnumVerticesCyr.prototype = Object.create(TextEnumVertices.prototype);

TextEnumVerticesCyr.prototype.GetText = function()
{
	return "А, Б, ... Я";
}

TextEnumVerticesCyr.prototype.GetValue = function()
{
	return "Cyrillic";
}


/**
 * Text Enum
 *
 */
function TextEnumVerticesGreek(app)
{
	TextEnumVertices.apply(this, arguments);
	this.pattern = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
}


// inheritance.
TextEnumVerticesGreek.prototype = Object.create(TextEnumVertices.prototype);

TextEnumVerticesGreek.prototype.GetText = function()
{
	return "Α, Β, ... Ω";
}

TextEnumVerticesGreek.prototype.GetValue = function()
{
	return "Greek";
}

/**
 * Text Enum
 *
 */
function TextEnumVerticesCustom(app)
{
    BaseEnumVertices.apply(this, arguments);
    this.pattern = "";
}



// inheritance.
TextEnumVerticesCustom.prototype = Object.create(BaseEnumVertices.prototype);

TextEnumVerticesCustom.prototype.GetText = function()
{
    return g_customEnumVertex;
}

TextEnumVerticesCustom.prototype.GetValue = function()
{
    return "Custom";
}

TextEnumVerticesCustom.prototype.GetVertexTextAsync = function(callback)
{
    this.ShowDialog(callback, g_addVertex, g_addVertex, "A");
}


TextEnumVerticesCustom.prototype.ShowDialog = function(callback, buttonText, titleTitle, title)
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
