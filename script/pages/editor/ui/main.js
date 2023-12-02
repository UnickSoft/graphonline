
let DisableEmscripten = false;

let editor = new Editor(document, window);

function resizeCanvas()
{
  var adv = document.getElementById('bottom_info');
  var canvas    = document.getElementById('canvas');
  canvas.width  = document.getElementById('canvasSection').offsetWidth;
  var mainContainer = document.getElementById('mainContainer');
  var offset = (mainContainer.offsetTop + mainContainer.offsetHeight) - (canvas.offsetTop + canvas.offsetHeight) + 
               ($("#footerContent").css("display") === 'block' ? 0 : 24);
        
  canvas.height = $(window).height() - document.getElementById('canvas').offsetTop - 
    (adv && $("#bottom_info").css("display") === 'block' ? document.getElementById('bottom_info').offsetHeight : 0) - 
    ($("#footer").css("display") === 'block' ? document.getElementById('footer').offsetHeight : 0) - offset;

  editor.redraw();
}

function touchHandler(event)
{
  var touches = event.changedTouches,
      first = touches[0],
      type = "";
  switch(event.type)
  {
      case "touchstart": type = "mousedown"; break;
      case "touchmove":  type="mousemove"; break;        
      case "touchend":   type="mouseup"; break;
      default: return;
  }

  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                            first.screenX, first.screenY, 
                            first.clientX, first.clientY, false, 
                            false, false, false, 0/*left*/, null);

  first.target.dispatchEvent(simulatedEvent);
  event.preventDefault();
}
    
function handelImportGraph(files) {
    var graphFileToLoad = files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        console.log(textFromFileLoaded);
        editor.application.LoadGraphFromString(textFromFileLoaded);
        ImportGraphFiles.value = "";
    };

    fileReader.readAsText(graphFileToLoad, "UTF-8");
}

function postLoadPage()
{
    loadTexts();
    editor.init();
}

$(document).ready(function ()
{
	window.onresize = function(event) 
    {
        resizeCanvas();
    }

    document.getElementById('canvas').addEventListener("touchstart", touchHandler, true);
    document.getElementById('canvas').addEventListener("touchmove", touchHandler, true);
    document.getElementById('canvas').addEventListener("touchend", touchHandler, true);
    document.getElementById('canvas').addEventListener("touchcancel", touchHandler, true);

    // Try load emscripten implementation
    var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
    if (!isMobile && !DisableEmscripten) {
      let fullPathToGraphffoline = "features/graphoffline/Graphoffline.Emscripten.js";
      doIncludeAsync ([
    	include (fullPathToGraphffoline),
      ], () => {
        Module['onRuntimeInitialized'] = onRuntimeInitialized;
        var process = Module.cwrap('ProcessAlgorithm', 'string', ['string']);
        function onRuntimeInitialized() {
          editor.application.setEmscripten(process);
        }
      })
    }
/*
	$(document).ready(function(){
	    //set up some basic options for the feedback_me plugin
	    fm_options = {
	        position: "left-bottom",
	        message_placeholder: g_what_do_you_think,
	        message_required: true,
	        name_label: g_name,
	        message_label: g_feedback,
	        trigger_label: g_feedback,
	        submit_label: g_send,
	        title_label: g_write_to_us,	        
	        feedback_url: "/feedback",
	    };
	    //init feedback_me plugin
	    fm.init(fm_options);
	});
*/
});
