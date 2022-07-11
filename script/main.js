
var SiteDir           = "";
var DisableEmscripten = false;
var algorithmsVersion = 2;

var application = new Application(document, window);

var waitCounter = false;
var fullscreen  = false;
var userAction = function(str)
{
    if (typeof window.yaCounter25827098 !== "undefined")
    {
        console.log(g_language + "/" + str);
        window.yaCounter25827098.hit(window.location.protocol + "//" + window.location.hostname + (g_language != "ru" ? "/" + g_language : "") + "/UserAction#" + str);
    }
    else if (!waitCounter)
    {
        waitCounter = true;
        setTimeout(function()
                   {
                     userAction(str);
                   }, 2000);
    }
}

var isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 
           || navigator.userAgent.toLowerCase().indexOf("trident") != -1);

var buttonsList = ['AddGraph', 'ConnectGraphs', 'DeleteObject', 'Default'];
var g_ctrlPressed = false;

function restButtons (me)
{
    var needSetDefault = false;
	for (var i = 0; i < buttonsList.length; i ++)
	{
		if (buttonsList[i] != me)
		{
			document.getElementById(buttonsList[i]).className = "btn btn-default btn-sm";
		}
		else
		{
			if (document.getElementById(buttonsList[i]).className != "btn btn-default btn-sm")
			{
				needSetDefault = true;	
			}
		}
	}
	if (needSetDefault)
	{
		document.getElementById(buttonsList[i]).className = "btn btn-primary btn-sm";
	}
	else
	{
		document.getElementById(me).className = "btn btn-primary btn-sm";
	}
}

var single = 0;

function resizeCanvas()
{
  var adv = document.getElementById('bottom_info');
  var canvas    = document.getElementById('canvas');
  canvas.width  = document.getElementById('canvasSection').offsetWidth;
  var mainContainer = document.getElementById('mainContainer');
  var offset = (mainContainer.offsetTop + mainContainer.offsetHeight) - (canvas.offsetTop + canvas.offsetHeight) + ($("#footerContent").css("display") === 'block' ? 0 : 24);
        
  canvas.height = $(window).height() - document.getElementById('canvas').offsetTop - (adv && $("#bottom_info").css("display") === 'block' ? document.getElementById('bottom_info').offsetHeight : 0) - ($("#footer").css("display") === 'block' ? document.getElementById('footer').offsetHeight : 0) - offset;

  application.redrawGraph();
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

function preLoadPage()
{
	loadTexts();
	application.onLoad();
}

function createAlgorithmMenu()
{
    var algorithmBaseId = "Algo";
    var algorithms = application.getAlgorithmNames();
    var index = 0;

    for (var i = 0; i < algorithms.length; i++)
    {
        algorithm = algorithms[i];
        
        var list   = document.getElementById("algorithmCategoryElements" + algorithm.category);
        var item   = document.getElementById("algTopic" + algorithm.category);
        var clone  = item.cloneNode(true);
        var button   = clone.getElementsByTagName("button")[0];
        var textSpan = button.getElementsByTagName("span")[1];
        button.id = algorithm.id;
        textSpan.innerHTML = algorithm.name;
        clone.style.display = "block";
        
        buttonsList.push(algorithm.id);
        
        button.onclick = function (e)
        {
            e["closeThisMenu"] = true;
            userAction(this.id);
            restButtons (this.id);
            application.SetHandlerMode(this.id);
        }
        
        var eventData = {};
        eventData.index     = i;
        eventData.object    = clone;
        eventData.algorithm = algorithm;
        
        $("#openAlgorithmList").bind('click', eventData, function (_eventData) {
            var data      = _eventData.data;
            var algorithm = g_Algorithms[g_AlgorithmIds.indexOf(data.algorithm.id)](application.graph, application);
            
            if (application.graph.isMulti() && !algorithm.IsSupportMultiGraph())
              $(data.object).hide();
            else
              $(data.object).show();
          });
        
        list.insertBefore(clone, document.getElementById("insert" + algorithm.category));
        index++;
    }

}

    
function handelImportGraph(files) {
    var graphFileToLoad = files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        console.log(textFromFileLoaded);
        application.LoadGraphFromString(textFromFileLoaded);
        ImportGraphFiles.value = "";
    };

    fileReader.readAsText(graphFileToLoad, "UTF-8");
}

function postLoadPage()
{
    application.userAction = userAction;
    
	application.canvas.onmousemove = function (e)
		{
			return application.CanvasOnMouseMove(e);
		};

	application.canvas.onmousedown = function (e)
		{
			return application.CanvasOnMouseDown(e);
		};
		
	application.canvas.onmouseup   = function (e)
		{
			return application.CanvasOnMouseUp(e);
		}
    
    application.canvas.onmousewheel = function (e)
    {
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta > 0)
        {
            application.multCanvasScale(1.3, e);
        }
        else
        {
            application.multCanvasScale(1.0 / 1.3, e);
        }
    }
    
    function getCharCode(event) {
      if (event.which == null) { // IE
        return event.keyCode;
      }

      if (event.which != 0 && event.charCode != 0) { // все кроме IE
        return event.which; // остальные
      }

      return null; // спец. символ
    }
    
    function getChar(event) {
        return String.fromCharCode(getCharCode(event)); // остальные
    }
    
    function selectHandler(buttonName, handlerName)
    {
            userAction(buttonName + "_shortcut");
			restButtons (buttonName);
			application.SetHandlerMode(handlerName);  
    }
    
    document.onkeypress   = function (e)
    {
        if (event.defaultPrevented
            || ($('#addVertex').hasClass('ui-dialog-content') && $('#addVertex').dialog('isOpen'))
            || ($('#adjacencyMatrix').hasClass('ui-dialog-content') && $('#adjacencyMatrix').dialog('isOpen'))
            || ($('#addEdge').hasClass('ui-dialog-content') && $('#addEdge').dialog('isOpen'))
            || ($('#incidenceMatrix').hasClass('ui-dialog-content') && $('#incidenceMatrix').dialog('isOpen'))
            || ($('#saveDialog').hasClass('ui-dialog-content') && $('#saveDialog').dialog('isOpen'))
            || ($('#saveImageDialog').hasClass('ui-dialog-content') && $('#saveImageDialog').dialog('isOpen'))
            || ($('#GroupRenameDialog').hasClass('ui-dialog-content') && $('#GroupRenameDialog').dialog('isOpen'))
            || $('#developerTools').css("display") != "none"
            || ($('#NeedAlgorithm').hasClass('ui-dialog-content') && $('#NeedAlgorithm').dialog('isOpen')))
        {
            console.log("prevent");
            return; // Should do nothing if the default action has been cancelled
        }
        
        
        var key = getChar(event);
        var code = getCharCode(event);
        console.log(key + " code=" + code);
        var evtobj = window.event ? event : e;
        var isCtrl = evtobj ? evtobj.ctrlKey : false;
        
        var moveValue = 10;
        if (code == 61 || code == 43) // +
        {
            application.multCanvasScale(1.5);
        }
        else if (code == 45) // -
        {
            application.multCanvasScale(1 / 1.5);
        }
        else if (key == 'w' || key == 'ц') // up
        {
            application.onCanvasMove(new Point(0, moveValue));
        }
        else if (key == 's' || key == 'ы') // down
        {
            application.onCanvasMove(new Point(0, -moveValue));
        }
        else if (key == 'a' || key == 'ф') // left
        {
            application.onCanvasMove(new Point(moveValue, 0));
        }
        else if (key == 'd' || key == 'в') // right
        {
            application.onCanvasMove(new Point(-moveValue, 0));
        }
        else if (key == 'v' || key == 'м') // vertex
        {
            selectHandler('AddGraph', 'addGraph');
        }
        else if (key == 'e' || key == 'у') // edge
        {
            selectHandler('ConnectGraphs', 'addArc');
        }
        else if (key == 'r' || key == 'к') // delete
        {
            selectHandler('DeleteObject', 'delete');
        }
        // Disabled because it is easy to lose graph, when you press miss letter.
        //else if (key == 'n' || key == 'т') // new
        //{
        //    userAction('NewGraph_shortcut');
		//	application.SetHandlerMode("deleteAll");
        //    application.SetDefaultTransformations();
        //}
        else if (key == 'm' || key == 'ь') // move
        {
            selectHandler('Default', 'default');
        }
        else if (code == 26 && isCtrl)
        {
            userAction("Key_GraphUndo");
            application.SetHandlerMode("graphUndo");        
        }
    }
 
    $(document).keydown(function(event) {
        if (event.which == "17" || event.which == "91")
          g_ctrlPressed = true;
    });

    $(document).keyup(function() {
      g_ctrlPressed = false;
    });

	document.getElementById('ShowAdjacencyMatrix').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("showAdjacencyMatrix");
		}		
	document.getElementById('ShowIncidenceMatrix').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("showIncidenceMatrix");
		}
	document.getElementById('ShowDistanceMatrix').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("showDistanceMatrix");
		}
    
	document.getElementById('GroupRename').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("GroupRename");
		}
	document.getElementById('groupRenameButton').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("GroupRename");
		}
    
		
	document.getElementById('Default').onclick = function ()
		{
            userAction(this.id);
			restButtons ('Default');
			application.SetHandlerMode("default");
			document.getElementById('Default').className = "btn btn-primary btn-sm";			
		}		
		
	document.getElementById('AddGraph').onclick = function ()
		{
            userAction(this.id);
			restButtons ('AddGraph');
			application.SetHandlerMode(document.getElementById('AddGraph').className != "" ? "addGraph" : "default");
		}
	
	document.getElementById('ConnectGraphs').onclick = function ()
		{
            userAction(this.id);
			restButtons ('ConnectGraphs');
			application.SetHandlerMode(document.getElementById('ConnectGraphs').className != "" ? "addArc" : "default");
		}	
	
	document.getElementById('DeleteObject').onclick = function ()
		{
            userAction(this.id);
			restButtons ('DeleteObject');
			application.SetHandlerMode(document.getElementById('DeleteObject').className != "" ? "delete" : "default");
		}

	document.getElementById('DeleteAll').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("deleteAll");
		}


	document.getElementById('SaveGraph').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("saveDialog");
		}

	document.getElementById('NewGraph').onclick = function ()
		{
            userAction(this.id);
			application.SetHandlerMode("deleteAll");
            application.SetDefaultTransformations();
		}
    
    document.getElementById('SaveGraphImage').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("saveDialogImage");
    }
    
    document.getElementById('SaveFullGraphImage').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("saveDialogFullImage");
    }

    document.getElementById('SavePrintGraphImage').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("savePrintGraphImage");
    }

    document.getElementById('SaveSvgGraphImage').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("saveSvgGraphImage");
    }
    
    document.getElementById('Zoom100').onclick = function ()
    {
        userAction(this.id);
        application.setCanvasScale(1.0);
    }
    
    document.getElementById('Zoom50').onclick = function ()
    {
        userAction(this.id);
        application.setCanvasScale(50 / 100);
    }
    
    document.getElementById('Zoom25').onclick = function ()
    {
        userAction(this.id);
        application.setCanvasScale(25 / 100);
    }
  
    document.getElementById('ZoomFit').onclick = function ()
    {
        userAction(this.id);
        application.OnAutoAdjustViewport();
    }
    
    document.getElementById('ZoomIn').onclick = function ()
    {
        userAction(this.id);
        application.multCanvasScale(1.5);
    }
    
    document.getElementById('ZoomOut').onclick = function ()
    {
        userAction(this.id);
        application.multCanvasScale(1.0 / 1.5);
    }
    
    document.getElementById('MoveWorspace').onclick = function ()
    {
        userAction(this.id);
        restButtons ('Default');
        application.SetHandlerMode("default");
        document.getElementById('Default').className = "btn btn-primary btn-sm";
    }
    document.getElementById('SetupVertexStyle').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("setupVertexStyle");
    }
    document.getElementById('SetupVertexStyleSelected').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("setupVertexStyleSelected");
    }
    document.getElementById('SetupEdgeStyle').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("setupEdgeStyle");
    }
    document.getElementById('SetupEdgeStyleSelected').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("setupEdgeStyleSelected");
    }
    document.getElementById('SetupBackgroundStyle').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("setupBackgroundStyle");
    }

    document.getElementById('GraphUndo').onclick = function ()
    {
        userAction(this.id);
        application.SetHandlerMode("graphUndo");
    }    
    
    document.getElementById('runUserScript').onclick = function ()
    {
        var el = document.getElementById('userScript');
        
        var oldScript = document.getElementById("userScriptSource");
        if (oldScript)
        {
            document.head.removeChild(oldScript);
        }
        
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.innerHTML = el.value;
        script.id = "userScriptSource";
        document.head.appendChild(script);
        
        application.SetHandlerMode("user.algorithm");
    }
    
    document.getElementById('submitUserScript').onclick = function ()
    {
        var script = document.getElementById('userScript');
        var data = "message=" + script.value + "&";
    
        $.ajax({
            type: "POST",
            url: "/feedback",
            data: data
        });
        
        $( "#sentAlgorithm" ).dialog({
                                     resizable: false,
                                     height: "auto",
                                     width:  400,
                                     modal: true,
                                     dialogClass: 'EdgeDialog'
                                     });
    }
    
    document.getElementById('devToolsZoom').onclick = function ()
    {
        var devTools = document.getElementById('developerTools');
        if (devTools.hasOwnProperty("isMin") && !devTools["isMin"])
        {
            devTools["isMin"] = true;
            devTools.style.width = "30%";
        }
        else
        {
            devTools["isMin"] = false;
            devTools.style.width = "100%";
        }
    }
    
    document.getElementById('ExportGraph').onclick = function ()
    {
        userAction(this.id);
        
        var graphAsString  = application.graph.SaveToXML("");
        var savedGraphName = application.GetNewGraphName();
        
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(graphAsString));
        element.setAttribute('download', "graph_" + savedGraphName + ".graphml");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    
    document.getElementById('ImportGraph').onclick = function ()
    {
        userAction(this.id);
        
        if (ImportGraphFiles) {
            ImportGraphFiles.click();
        }
    }
    
    document.getElementById('openAlgorithmList').onclick = function()
    {
        // Show menu first
        setTimeout(function() 
                   {
                        var button = document.getElementById('openAlgorithmList');
                        var buttonRect = button.getBoundingClientRect();
                        var algorithmList = document.getElementById('algorithmList');
            
                        var delta = buttonRect.right - algorithmList.offsetWidth;
                        if (delta < 0)
                        {
                            var value = (delta - 4) + "px";
                            algorithmList.style.right = value;
                        }
                        else
                        {
                             algorithmList.style.right = "0";   
                        }
                   }, 1);
    }
    
    document.getElementById('Fullscreen').onclick = function()
    {
        var idList = ["h1Header", "h1Text", "navigation", "footerContent", "bottom_adv"];
        
        fullscreen = !fullscreen
        
        userAction(fullscreen ? "fullscreen_on" : "fullscreen_off");
        
        for (var i = 0; i < idList.length; i++) {
            let element = document.getElementById(idList[i]);
            if (!element) continue;

            if (fullscreen)
                element.style.display = "none";    
            else
                element.style.display = "block";
        }
                
        document.getElementById("mainContainer").className = fullscreen ? "container-fluid page-wrap" : "container page-wrap";
        
        document.getElementById("FullscreenIcon").className = fullscreen ? "glyphicon glyphicon-resize-small fa-fw" : "glyphicon glyphicon-resize-full fa-fw";

        resizeCanvas();
    }
    
    if (document.getElementById('VoteButton') !== null)
    document.getElementById('VoteButton').onclick = function ()
    {
        var dialogButtons = {};
        
        for (var i = 0; i < 6 && document.getElementById('vote' + i) !== null; i++)
        {
            document.getElementById('vote' + i)["voteIndex"] = i;
            document.getElementById('vote' + i).onclick = function ()
            {
                console.log("Vote" + this["voteIndex"]);
                $.ajax({
                type: "GET",
                url: "/" + SiteDir + "cgi-bin/vote.php?index=" + this["voteIndex"],
                dataType: "text"
                });
                $("#voteDialog").dialog('close');
                $("#VoteButton").hide();
            }
        }

        dialogButtons[g_close] = function() {
                $( this ).dialog( "close" );					
            }; 

        $( "#voteDialog" ).dialog({
            resizable: false,
            title: g_vote,
            width: 400,
            modal: true,
            dialogClass: 'EdgeDialog',
            buttons: dialogButtons,
        });
    }
    
    // Get algorithms list and load it.
    $.get( "/" + SiteDir + "cgi-bin/getPluginsList.php",
            function( data )
            {
                var scriptList = JSON.parse(data);
          
                var loadOneScript = function()
                {
                    if (scriptList.length == 0)
                    {
                        createAlgorithmMenu();
                    }
                    else
                    {
                        var script = document.createElement('script');
                        script.src = "/" + SiteDir + "script/" + scriptList[0] + "?v=" + algorithmsVersion;
                        scriptList.shift();
                        script.onload  = loadOneScript;
                        script.onerror = loadOneScript;
                        document.head.appendChild(script);
                    }
                }
          
                loadOneScript();
          
            });

    var devTools = document.getElementById('developerTools');
    devTools.style.left = 0;
	resizeCanvas();
	application.onPostLoadEvent();

    $(function() {
        $('#algorithmList').on('click', function(event) {
            if (!event.originalEvent.closeThisMenu) {
                event.stopPropagation();
            }
        });      
        $(window).on('click', function() {
          $('#algorithmList').slideUp();
        });      
      });    


    let showHideCategory = function(button, elementsListName){
        let width     = $( button ).width();
        let elementsList = $(elementsListName);
        var hideMark = button.querySelector('span[name="hideMark"]')
        var showMark = button.querySelector('span[name="showMark"]')
        if (elementsList.is(":visible")) {
            elementsList.hide();
            $(hideMark).show();
            $(showMark).hide();
        } else {
            elementsList.show();
            $(hideMark).hide();
            $(showMark).show();
        }            
        $( button ).width(width);

        userAction("algCategory_" + elementsListName);
    }

    $(document.getElementById("algorithmCategoryBtn1").querySelector('span[name="hideMark"]')).hide();
    $(document.getElementById("algorithmCategoryBtn0").querySelector('span[name="hideMark"]')).hide();

    $('#algorithmCategoryBtn1').click(function(){
        showHideCategory(this, "#algorithmCategoryElements1");
    });

    $('#algorithmCategoryBtn0').click(function(){
        showHideCategory(this, "#algorithmCategoryElements0");
    });
}

//window.onload = function ()
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
      const jsScript = document.createElement('script');
      jsScript.src   = '/script/Graphoffline.Emscripten.js';
      document.body.appendChild(jsScript);      
      jsScript.addEventListener('load', () => {
        Module['onRuntimeInitialized'] = onRuntimeInitialized;
        var process = Module.cwrap('ProcessAlgorithm', 'string', ['string']);
        function onRuntimeInitialized() {
          application.setEmscripten(process);
        }
      });
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

Array.prototype.swap = function (x,y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}
