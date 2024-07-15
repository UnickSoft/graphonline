doInclude ([
    include ("features/base_handler/index.js")
])

/**
 * Setup Vertex Style rename vertices.
 *
 */
function SetupEdgeStyle(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
}

// inheritance.
SetupEdgeStyle.prototype = Object.create(BaseHandler.prototype);

SetupEdgeStyle.prototype.show = function(index, selectedEdges)
{
	var handler = this;
	var dialogButtons = {};
    var graph = this.app.graph;
    var app   = this.app;
    this.forAll = selectedEdges == null;
    var forAll = this.forAll;

    var self = this;

    var applyIndex = function(index)
    {
        self.index = index;
        var originStyle = (self.index == 0 ? app.edgeCommonStyle : app.edgeSelectedStyles[self.index - 1]);
        if (!forAll)
        {
            originStyle = selectedEdges[0].getStyleFor(self.index);
        }
        self.style = FullObjectCopy(originStyle);    
    }

    applyIndex(index);

    var fillFields = function()
    {
        var fullStyle = self.style.GetStyle({}, forAll ? undefined : selectedEdges[0]);

        $( "#edgeFillColor" ).val(fullStyle.fillStyle);
        $( "#edgeStrokeColor" ).val(fullStyle.strokeStyle);
        $( "#edgeTextColor" ).val(fullStyle.weightText);
        $( "#edgeStyle" ).val(fullStyle.lineDash);
        $( "#edgeWidth" ).val(forAll ? app.GetDefaultEdgeWidth() : selectedEdges[0].model.width);

        $( "#weightEdgeTextColor" ).val(fullStyle.additionalTextColor);
        $( "#weightTextPosition" ).val(fullStyle.weightPosition);
        $( "#edgeTextSize" ).val(fullStyle.mainTextFontSize);

        if (self.index > 0 || self.index == "all")
        {
            $( "#EdgeSelectedIndexForm" ).show();
            $( "#edgeSelectedIndex" ).val(self.index);        
        }
        else
        {
            $( "#EdgeSelectedIndexForm" ).hide();        
        }

        // Fill color presets.
        var stylesArray = [];
        stylesArray.push(app.edgeCommonStyle);

        for (i = 0; i < app.edgeSelectedStyles.length; i ++)
            stylesArray.push(app.edgeSelectedStyles[i]);

        var colorSet = {};
        for (i = 0; i < stylesArray.length; i ++)
        {
            var style = stylesArray[i];
            if (style.hasOwnProperty('strokeStyle'))
                colorSet[style.strokeStyle] = 1;
            if (style.hasOwnProperty('fillStyle'))
                colorSet[style.fillStyle] = 1;
            if (style.hasOwnProperty('additionalTextColor'))
                colorSet[style.additionalTextColor] = 1;
        }

        $("#edgeFillColorPreset").find('option').remove();
        $("#weightEdgeTextColorPreset").find('option').remove();
        $("#edgeTextColorPreset").find('option').remove();
        $("#edgeStrokeColorPreset").find('option').remove();
        for (const property in colorSet)
        {
            $("#edgeFillColorPreset").append(new Option(property));
            $("#weightEdgeTextColorPreset").append(new Option(property));
            $("#edgeTextColorPreset").append(new Option(property));
            $("#edgeStrokeColorPreset").append(new Option(property));
        }        
    }
    
    var redrawVertex = function()
    {
        var fullStyle = self.style.GetStyle({}, forAll ? undefined : selectedEdges[0]);

        if (fullStyle.fillStyle != $( "#edgeFillColor" ).val())
            self.style.fillStyle     = $( "#edgeFillColor" ).val();

        if (fullStyle.strokeStyle != $( "#edgeStrokeColor" ).val())
            self.style.strokeStyle   = $( "#edgeStrokeColor" ).val();

        if (fullStyle.weightText != $( "#edgeTextColor" ).val())
            self.style.weightText    = $( "#edgeTextColor" ).val();

        if (fullStyle.lineDash != $( "#edgeStyle" ).val())
            self.style.lineDash    = $( "#edgeStyle" ).val();

        if (fullStyle.additionalTextColor != $( "#weightEdgeTextColor" ).val())
            self.style.additionalTextColor    = $( "#weightEdgeTextColor" ).val();

        if (fullStyle.weightPosition != $( "#weightTextPosition" ).val())
            self.style.weightPosition    = $( "#weightTextPosition" ).val();

        if (fullStyle.mainTextFontSize != $( "#edgeTextSize" ).val())
            self.style.mainTextFontSize = parseInt($( "#edgeTextSize" ).val());

        var edgeWidth = parseInt($( "#edgeWidth" ).val());
        
        var canvas  = document.getElementById( "EdgePreview" );
        var context = canvas.getContext('2d');    
        
        context.save();
        
        var backgroundDrawer = new BaseBackgroundDrawer(context);
        backgroundDrawer.Draw(app.backgroundCommonStyle, canvas.width, canvas.height, new Point(0, 0), 1.0);
        
        var graphDrawer  = new BaseEdgeDrawer(context);
        var baseVertex1  = new BaseVertex(0, canvas.height / 2, new BaseEnumVertices(this));
        var baseVertex2  = new BaseVertex(canvas.width, canvas.height / 2, new BaseEnumVertices(this));

        baseVertex1.currentStyle = baseVertex1.getStyleFor(0);
        baseVertex2.currentStyle = baseVertex2.getStyleFor(0);

        var baseEdge     = new BaseEdge(baseVertex1, baseVertex2, true, 10, "Text");
        
        if (!forAll)
            baseEdge.ownStyles = selectedEdges[0].ownStyles;

        baseEdge.model.width = edgeWidth;

        graphDrawer.Draw(baseEdge, self.style.GetStyle({}, baseEdge));
        
        context.restore();
    }

    var changeIndex = function()
    {
        var val = $( "#edgeSelectedIndex" ).val();
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
    
    var applyWidth = function(width)
        {
            if (forAll)
            {
                app.SetDefaultEdgeWidth(width);
            }
            else
            {
                selectedEdges.forEach(function(edge) {
                        edge.model.width = width;
                    });
            }
        };    

	dialogButtons[g_default] = 
           {
               text    : g_default,
               class   : "MarginLeft",
               click   : function() {
                    app.PushToStack("ChangeStyle");

                    applyWidth(forAll ? (new EdgeModel()).width : app.GetDefaultEdgeWidth());
                    var indexes = [];
                    if (self.index == "all")
                    {
                        for (i = 0; i < app.edgeSelectedStyles.length; i ++)
                            indexes.push(i + 1);
                    }
                    else
                        indexes.push(self.index);

                    if (forAll)
                    {                        
                        indexes.forEach(function(index) {
                                app.ResetEdgeStyle(index);
                            });
                    }
                    else
                    {
                        selectedEdges.forEach(function(edge) {
                            indexes.forEach(function(index) {
                                edge.resetOwnStyle(index);
                            });                            
                        });
                    }
                    
                    app.redrawGraph();
                    $( this ).dialog( "close" );
               }
           };
    
	dialogButtons[g_save] = function() {

                app.PushToStack("ChangeStyle");

                applyWidth(parseInt($( "#edgeWidth" ).val()));

                var indexes = [];
                if (self.index == "all")
                {
                    indexes.push({index : 1, style : self.style});

                    for (i = 1; i < app.edgeSelectedStyles.length; i ++)
                    {
                        var style = (new BaseEdgeStyle());
                        style.baseStyles.push("selected");
                        indexes.push({index : i + 1, style : style});
                    }

                    self.style.baseStyles = [];
                    self.style.baseStyles = self.style.baseStyles.concat((new SelectedEdgeStyle0()).baseStyles);
                }
                else
                    indexes.push({index : self.index, style : self.style});

                if (forAll)
                {
                    indexes.forEach(function(index) {
                        app.SetEdgeStyle(index.index, index.style);
                    });
                }
                else
                {
                    selectedEdges.forEach(function(edge) {
                        indexes.forEach(function(index) {
                                edge.setOwnStyle(index.index, index.style);
                            });
                    });
                }                
                app.redrawGraph();
				$( this ).dialog( "close" );					
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );						
			};
    
    fillFields();
        
	$( "#SetupEdgeStyleDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_edgeDraw,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});

    redrawVertex();

    $( "#edgeFillColor" ).unbind();
    $( "#edgeStrokeColor" ).unbind();
    $( "#edgeTextColor" ).unbind();
    $( "#edgeStyle" ).unbind();
    $( "#edgeWidth" ).unbind();
    $( "#weightEdgeTextColor" ).unbind();
    $( "#weightTextPosition" ).unbind();
    $( "#edgeSelectedIndex" ).unbind();    
    $( "#edgeTextSize" ).unbind();    
    
    $( "#edgeFillColor" ).change(redrawVertex);
    $( "#edgeStrokeColor" ).change(redrawVertex);
    $( "#edgeTextColor" ).change(redrawVertex);
    $( "#edgeStyle" ).change(redrawVertex);
    $( "#edgeWidth" ).change(redrawVertex);
    $( "#weightEdgeTextColor" ).change(redrawVertex);
    $( "#weightTextPosition" ).change(redrawVertex);    
    $( "#edgeSelectedIndex" ).change(changeIndex);        
    $( "#edgeTextSize" ).change(redrawVertex);
}
