doInclude ([
    include ("features/base_handler/index.js")
])

/**
 * Setup Vertex Style rename vertices.
 *
 */
function SetupVertexStyle(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
SetupVertexStyle.prototype = Object.create(BaseHandler.prototype);

SetupVertexStyle.prototype.show = function(index, selectedVertices)
{
	var handler = this;
	var dialogButtons = {};
    var graph = this.app.graph;
    var app   = this.app;
    this.forAll = selectedVertices == null;
    var forAll = this.forAll;
    var self = this;

    var applyIndex = function(index)
    {
        self.index = index;
        self.originStyle = (self.index == 0 ? app.vertexCommonStyle : app.vertexSelectedVertexStyles[self.index - 1]);
        if (!forAll)
        {
            self.originStyle = selectedVertices[0].getStyleFor(self.index);
        }
        self.style = FullObjectCopy(self.originStyle);    
    }

    applyIndex(index);

    var fillFields = function()
    {
        var fullStyle = self.style.GetStyle({}, forAll ? undefined : selectedVertices[0]);

        $( "#vertexFillColor" ).val(fullStyle.fillStyle);
        $( "#vertexStrokeColor" ).val(fullStyle.strokeStyle);
        $( "#vertexTextColor" ).val(fullStyle.mainTextColor);
        $( "#upVertexTextColor" ).val(fullStyle.upTextColor);
        $( "#vertexStrokeSize" ).val(fullStyle.lineWidth);
        $( "#vertexShape" ).val(fullStyle.shape);
        $( "#vertexSize" ).val(forAll ? app.GetDefaultVertexSize() : selectedVertices[0].model.diameter);
        $( "#commonTextPosition" ).val(fullStyle.commonTextPosition);
        $( "#textSize" ).val(fullStyle.mainTextFontSize);

        if (self.index > 0 || self.index == "all")
        {
            $( "#VertexSelectedIndexForm" ).show();
            $( "#vertexSelectedIndex" ).val(self.index);        
        }
        else
        {
            $( "#VertexSelectedIndexForm" ).hide();        
        }

        // Fill color presets.
        var stylesArray = [];
        stylesArray.push(app.vertexCommonStyle);

        for (i = 0; i < app.vertexSelectedVertexStyles.length; i ++)
            stylesArray.push(app.vertexSelectedVertexStyles[i]);

        var colorSet = {};
        for (i = 0; i < stylesArray.length; i ++)
        {
            var style = stylesArray[i];
            if (style.hasOwnProperty('strokeStyle'))
                colorSet[style.strokeStyle] = 1;
            if (style.hasOwnProperty('fillStyle'))
                colorSet[style.fillStyle] = 1;
            if (style.hasOwnProperty('mainTextColor'))
                colorSet[style.mainTextColor] = 1;
            if (style.hasOwnProperty('upTextColor'))
                colorSet[style.upTextColor] = 1;
        }

        $("#vertexFillColorPreset").find('option').remove();
        $("#upVertexTextColorPreset").find('option').remove();
        $("#vertexTextColorPreset").find('option').remove();
        $("#vertexStrokeColorPreset").find('option').remove();
        for (const property in colorSet)
        {
            $("#vertexFillColorPreset").append(new Option(property));
            $("#upVertexTextColorPreset").append(new Option(property));
            $("#vertexTextColorPreset").append(new Option(property));
            $("#vertexStrokeColorPreset").append(new Option(property));
        }
    }
    
    var redrawVertex = function()
    {
        var fullStyle = self.style.GetStyle({}, forAll ? undefined : selectedVertices[0]);

        if (fullStyle.fillStyle != $( "#vertexFillColor" ).val())
            self.style.fillStyle     = $( "#vertexFillColor" ).val();

        if (fullStyle.strokeStyle != $( "#vertexStrokeColor" ).val())
            self.style.strokeStyle   = $( "#vertexStrokeColor" ).val();

        if (fullStyle.mainTextColor != $( "#vertexTextColor" ).val())
            self.style.mainTextColor = $( "#vertexTextColor" ).val();

        if (fullStyle.lineWidth != $( "#vertexStrokeSize" ).val())
            self.style.lineWidth     = parseInt($( "#vertexStrokeSize" ).val());

        if (fullStyle.shape != $( "#vertexShape" ).val())
            self.style.shape    = parseInt($( "#vertexShape" ).val());

        if (fullStyle.upTextColor != $( "#upVertexTextColor" ).val())
            self.style.upTextColor = $( "#upVertexTextColor" ).val(); 

        if (fullStyle.commonTextPosition != $( "#commonTextPosition" ).val())
            self.style.commonTextPosition = $( "#commonTextPosition" ).val(); 

        if (fullStyle.mainTextFontSize != $( "#textSize" ).val())
            self.style.mainTextFontSize = parseInt($( "#textSize" ).val()); 

        var diameter = parseInt($( "#vertexSize" ).val());
        
        var canvas  = document.getElementById( "VertexPreview" );
        var context = canvas.getContext('2d');    
        
        context.save();

        var backgroundDrawer = new BaseBackgroundDrawer(context);
        backgroundDrawer.Draw(app.backgroundCommonStyle, canvas.width, canvas.height, new Point(0, 0), 1.0);
        
        var graphDrawer = new BaseVertexDrawer(context);
        var baseVertex  = new BaseVertex(canvas.width / 2, canvas.height / 2, new BaseEnumVertices(this));
        baseVertex.mainText = "1";
        baseVertex.upText   = "Up Text";
        baseVertex.model.diameter = diameter;

        if (!forAll)
            baseVertex.ownStyles = selectedVertices[0].ownStyles;
        
        graphDrawer.Draw(baseVertex, self.style.GetStyle({}, baseVertex));
        
        context.restore();
    }
    
    var changeIndex = function()
    {
        var val   = $( "#vertexSelectedIndex" ).val();
        if (val == "all")
        {
            applyIndex(1);
            self.index = "all";
            fillFields();
        }
        else
        {
            var index = parseInt(val);
            self.index = index;
            applyIndex(index);
            fillFields();
        }
        redrawVertex();
    }

    var applyDiameter = function(diameter)
        {
            if (forAll)
            {
                app.SetDefaultVertexSize(diameter);
            }
            else
            {
                selectedVertices.forEach(function(vertex) {
                    vertex.model.diameter = diameter;
                });
            }
        };
    
	dialogButtons[g_default] = 
           {
               text    : g_default,
               class   : "MarginLeft",
               click   : function() {

                    app.PushToStack("ChangeStyle");

                    applyDiameter(forAll ? (new VertexModel()).diameter : app.GetDefaultVertexSize());

                    var indexes = [];
                    if (self.index == "all")
                    {
                        for (i = 0; i < app.vertexSelectedVertexStyles.length; i ++)
                            indexes.push(i + 1);
                    }
                    else
                        indexes.push(self.index);
                    

                    if (forAll)
                    {
                        indexes.forEach(function(index) {
                        	app.ResetVertexStyle(index);
                        });
                    }
                    else
                    {
                        selectedVertices.forEach(function(vertex) {
                        	indexes.forEach(function(index) {
                            	vertex.resetOwnStyle(index);
                            });
                          });
                    }
                    app.redrawGraph();
                    $( this ).dialog( "close" );
               }
           };
    
	dialogButtons[g_save] = function() {

                app.PushToStack("ChangeStyle");

                applyDiameter(parseInt($( "#vertexSize" ).val()));

                var indexes = [];
                if (self.index == "all")
                {
                    indexes.push({index : 1, style : self.style});
                    for (i = 1; i < app.vertexSelectedVertexStyles.length; i ++)
                    {
                        var style = (new BaseVertexStyle());
                        style.baseStyles.push("selected");
                        indexes.push({index : i + 1, style : style});
                    }

                    self.style.baseStyles = [];
                    self.style.baseStyles = self.style.baseStyles.concat((new SelectedVertexStyle0()).baseStyles);
                }
                else
                    indexes.push({index : self.index, style : self.style});

                if (forAll)
                {
                	indexes.forEach(function(index) {
                    	app.SetVertexStyle(index.index, index.style);
                    });
                }
                else
                {
                    if (JSON.stringify(self.originStyle) !== JSON.stringify(self.style))
                    {
                        selectedVertices.forEach(function(vertex) {
                        	indexes.forEach(function(index) {
                            	vertex.setOwnStyle(index.index, index.style);
                            });
                        });
                    }
                }
                app.redrawGraph();
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};
    
    fillFields();
        
	$( "#SetupVertexStyleDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_vertexDraw,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
    
    redrawVertex();

    $( "#vertexFillColor" ).unbind();
    $( "#vertexStrokeColor" ).unbind();
    $( "#vertexTextColor" ).unbind();
    $( "#upVertexTextColor" ).unbind();
    $( "#vertexStrokeSize" ).unbind();
    $( "#vertexShape" ).unbind();
    $( "#vertexSize" ).unbind();
    $( "#commonTextPosition" ).unbind();
    $( "#vertexSelectedIndex" ).unbind();
    $( "#textSize" ).unbind();
    
    $( "#vertexFillColor" ).change(redrawVertex);
    $( "#vertexStrokeColor" ).change(redrawVertex);
    $( "#vertexTextColor" ).change(redrawVertex);
    $( "#vertexStrokeSize" ).change(redrawVertex);
    $( "#vertexShape" ).change(redrawVertex);
    $( "#vertexSize" ).change(redrawVertex);
    $( "#upVertexTextColor" ).change(redrawVertex);
    $( "#commonTextPosition" ).change(redrawVertex);
    $( "#vertexSelectedIndex" ).change(changeIndex);
    $( "#textSize" ).change(redrawVertex);
}
