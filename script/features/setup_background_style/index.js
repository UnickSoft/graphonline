doInclude ([
    include ("features/base_handler/index.js")
])

/**
 * Setup Background Style rename vertices.
 *
 */
function SetupBackgroundStyle(app)
{
  BaseHandler.apply(this, arguments);
  this.message = "";	
  this.maxImageSize = 2048;
}

// inheritance.
SetupBackgroundStyle.prototype = Object.create(BaseHandler.prototype);


SetupBackgroundStyle.prototype.handleImportBackgroundFile = function(files, updateBackgroundCallback) {
    var graphFileToLoad = files[0];
    var re = /(?:\.([^.]+))?$/;
    var imageExtension = re.exec(graphFileToLoad.name)[1].toLowerCase();

    if (!(imageExtension == "png" || imageExtension == "jpg" || imageExtension == "jpeg")) {
        $("#UploadBackgroundImageError").html(g_wrongImageFormatPNGAndJPEG);
        $("#UploadBackgroundImageError").show();
        return;
    }

    let self = this;
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;        
        var image = new Image();
        image.onload = function() {
            console.log(this.width + 'x' + this.height);
            if (this.width > self.maxImageSize || this.height > self.maxImageSize) {
                $("#UploadBackgroundImageError").html(formatString(g_wrongImageSizeP1, [self.maxImageSize]));
                $("#UploadBackgroundImageError").show();
                return;
            }
            updateBackgroundCallback(image);
          }
        image.src = 'data:image/' + imageExtension + ';base64' + textFromFileLoaded;
        ImportBackgroundImage.value = "";
    };

    fileReader.readAsDataURL(graphFileToLoad);
}

SetupBackgroundStyle.prototype.show = function()
{
	var handler = this;
	var dialogButtons = {};
    var graph = this.app.graph;
    var app   = this.app;
    var style = FullObjectCopy(app.style.backgroundCommonStyle);
    
    var fillFields = function()
    {
        $( "#backgroundColor" ).val(style.commonColor);
        $( "#backgroundTransporent" ).val(style.commonOpacity);
    }
    
    var redrawVertex = function()
    {
        style.commonColor     = $( "#backgroundColor" ).val();
        style.commonOpacity   = $( "#backgroundTransporent" ).val();
        
        var canvas  = document.getElementById( "BackgroundPreview" );
        var context = canvas.getContext('2d');    
        
        context.save();
        let bestScale = 1.0;
        if (style.image != null) {
            let wScale = canvas.width / style.image.width;
            let hScale = canvas.height / style.image.height;
            bestScale = Math.min(wScale, hScale);         
            context.scale(bestScale, bestScale);
        }
        var backgroundDrawer = new BaseBackgroundDrawer(context);
        backgroundDrawer.Draw(style, canvas.width, canvas.height, new Point(0, 0), bestScale);
        
        context.restore();

        if (style.image != null) {
            $( "#RemoveBackgroundFile" ).show();
        } else {
            $( "#RemoveBackgroundFile" ).hide();
        }
    }

    var loadFile = function() {
        userAction("background_loadFromFile");
        
        if (ImportBackgroundImage) {
            ImportBackgroundImage.click();
        }
    }

    var updateBackgroundImage = function(image) {
        style.image = image;
        $("#UploadBackgroundImageError").hide();
        redrawVertex();
    }

    var clearBackgroundImage = function() {
        style.image = null;
        $("#UploadBackgroundImageError").hide();
        redrawVertex();
    }    
    
	dialogButtons[g_default] = 
           {
               text    : g_default,
               class   : "MarginLeft",
               click   : function() {

                    app.PushToStack("ChangeBackground");

                    app.ResetBackgroundStyle();
                    app.redrawGraph();
                    $( this ).dialog( "close" );
               }
           };
    
	dialogButtons[g_save] = function() {
                app.PushToStack("ChangeBackground");
                app.SetBackgroundStyle(style);    
                app.redrawGraph();
				$( this ).dialog( "close" );
			};
	dialogButtons[g_cancel] = function() {
				$( this ).dialog( "close" );
			};
    
    fillFields();
        
	$( "#SetupBackgroundStyleDialog" ).dialog({
		resizable: false,
        height: "auto",
        width:  "auto",
		modal: true,
		title: g_backgroundStyle,
		buttons: dialogButtons,
		dialogClass: 'EdgeDialog'
	});
    
    try {
        redrawVertex();
    } catch (error) {
        console.error(error);
    }

    $( "#backgroundColor" ).unbind();
    $( "#backgroundTransporent" ).unbind();
    $( "#LoadBackgroundFile" ).unbind();
    $( "#ImportBackgroundImage" ).unbind();    
    $( "#RemoveBackgroundFile" ).unbind();    
    
    $( "#backgroundColor" ).change(redrawVertex);
    $( "#backgroundTransporent" ).change(redrawVertex);
    $( "#LoadBackgroundFile" ).click(loadFile);
    $( "#ImportBackgroundImage" ).change( function ()  {handler.handleImportBackgroundFile(this.files, updateBackgroundImage);});
    $( "#RemoveBackgroundFile" ).click(clearBackgroundImage);
}
