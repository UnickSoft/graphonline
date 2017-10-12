var application = new Application(document, window);

var waitCounter = false;
var userAction = function(str)
{
    if (typeof window.yaCounter25827098 !== "undefined")
    {
        console.log(str);
        window.yaCounter25827098.hit("http://" + window.location.hostname + "/UserAction#" + str);
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
        var adv = document.getElementById('adv');
        var canvas    = document.getElementById('canvas');
        canvas.width  = document.getElementById('canvasSection').offsetWidth;
        
            //canvas.height = document.getElementById('footer').offsetTop - document.getElementById('canvasSection').offsetTop - (adv && $("#adv").css("display") === 'block' ? document.getElementById('adv').offsetHeight : 0);
    canvas.height = $(window).height() - document.getElementById('canvas').offsetTop - (adv && $("#adv").css("display") === 'block' ? document.getElementById('adv').offsetHeight : 0) - ($("#footer").css("display") === 'block' ? document.getElementById('footer').offsetHeight : 0) - (document.documentElement.clientWidth < 650 ? 20 : 0);

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
    var algorihtmsBaseId = "Algo";
    var algorithms = application.getAlgorithmNames();
    var index = 0;

    for (var i = 0; i < algorithms.length; i++)
    {
        algorithm = algorithms[i];
        
        var list   = document.getElementById("algorithmList");
        var item   = list.lastElementChild;
        var clone  = item.cloneNode(true);
        var button   = clone.getElementsByTagName("button")[0];
        var textSpan = button.getElementsByTagName("span")[1];
        button.id = algorithm.id;
        textSpan.innerHTML = algorithm.name;
        clone.style.display = "block";
        
        buttonsList.push(algorithm.id);
        
        button.onclick = function ()
        {
            userAction(this.id);
            restButtons (this.id);
            application.SetHandlerMode(this.id);
        }
        
        list.appendChild(clone);
        index++;
    }

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
            application.multCanvasScale(1.3);
        }
        else
        {
            application.multCanvasScale(1.0 / 1.3);
        }
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
        
        
        var key = 0;
        
        if(window.event)
        {
            key = event.keyCode;
        }
        else if(event.which)
        {
            key = event.which;
        }
        console.log(key);
        
        var moveValue = 10;
        if (key == 61 || key == 43) // +
        {
            application.multCanvasScale(1.5);
        }
        else if (key == 45) // -
        {
            application.multCanvasScale(1 / 1.5);
        }
        else if (key == 119 || key == 1094) // up
        {
            application.onCanvasMove(new Point(0, moveValue));
        }
        else if (key == 115 || key == 1099) // down
        {
            application.onCanvasMove(new Point(0, -moveValue));
        }
        else if (key == 97 || key == 1092) // left
        {
            application.onCanvasMove(new Point(moveValue, 0));
        }
        else if (key == 100 || key == 1074) // right
        {
            application.onCanvasMove(new Point(-moveValue, 0));
        }
    }

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
                url: "/cgi-bin/vote.php?index=" + this["voteIndex"],
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
    $.get( "/cgi-bin/getPluginsList.php",
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
                        script.src = scriptList[0];
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
