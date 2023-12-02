
var g_ctrlPressed = false;

function Editor(document, window) {
    let self = this;
    this.application = new Application(document, window, self);
    this.fullscreen  = false;
    this.buttonsList = ['AddGraph', 'ConnectGraphs', 'DeleteObject', 'Default'];
}

Editor.prototype.initMouseActions = function() {
    let self = this;

    this.application.canvas.onmousemove = function (e)
    {
        return self.application.CanvasOnMouseMove(e);
    };

    this.application.canvas.onmousedown = function (e)
    {
        return self.application.CanvasOnMouseDown(e);
    };

    this.application.canvas.onmouseup   = function (e)
    {
        return self.application.CanvasOnMouseUp(e);
    }

    this.application.canvas.onwheel = function (e)
    {
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta > 0)
        {
            self.application.multCanvasScale(1.3, e);
        }
        else
        {
            self.application.multCanvasScale(1.0 / 1.3, e);
        }
    }
}

Editor.prototype.initKeyActions = function() {
    let self = this;

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
              self.restButtons (buttonName);
              self.application.SetHandlerMode(handlerName);  
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
              self.application.multCanvasScale(1.5);
          }
          else if (code == 45) // -
          {
              self.application.multCanvasScale(1 / 1.5);
          }
          else if (key == 'w' || key == 'ц') // up
          {
              self.application.onCanvasMove(new Point(0, moveValue));
          }
          else if (key == 's' || key == 'ы') // down
          {
              self.application.onCanvasMove(new Point(0, -moveValue));
          }
          else if (key == 'a' || key == 'ф') // left
          {
              self.application.onCanvasMove(new Point(moveValue, 0));
          }
          else if (key == 'd' || key == 'в') // right
          {
              self.application.onCanvasMove(new Point(-moveValue, 0));
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
          // self.application.SetHandlerMode("deleteAll");
          //    self.application.SetDefaultTransformations();
          //}
          else if (key == 'm' || key == 'ь') // move
          {
              selectHandler('Default', 'default');
          }
          else if (code == 26 && isCtrl)
          {
              userAction("Key_GraphUndo");
              self.application.SetHandlerMode("graphUndo");        
          }
      }
   
      $(document).keydown(function(event) {
          if (event.which == "17" || event.which == "91")
          g_ctrlPressed = true;
      });
  
      $(document).keyup(function() {
        g_ctrlPressed = false;
      });
}

Editor.prototype.initButtonActions = function()
{
    let self = this;

	document.getElementById('ShowAdjacencyMatrix').onclick = function ()
		{
            userAction(this.id);
		 self.application.SetHandlerMode("showAdjacencyMatrix");
		}
	document.getElementById('ShowIncidenceMatrix').onclick = function ()
		{
            userAction(this.id);
		 self.application.SetHandlerMode("showIncidenceMatrix");
		}
	document.getElementById('ShowDistanceMatrix').onclick = function ()
		{
            userAction(this.id);
		 self.application.SetHandlerMode("showDistanceMatrix");
		}
    
	document.getElementById('GroupRename').onclick = function ()
		{
            userAction(this.id);
		 self.application.SetHandlerMode("GroupRename");
		}
	document.getElementById('groupRenameButton').onclick = function ()
		{
            userAction(this.id);
		 self.application.SetHandlerMode("GroupRename");
		}    
		
	document.getElementById('Default').onclick = function ()
		{
            userAction(this.id);
			self.restButtons ('Default');
		 self.application.SetHandlerMode("default");
			document.getElementById('Default').className = "btn btn-primary btn-sm";			
		}		
		
	document.getElementById('AddGraph').onclick = function ()
		{
            userAction(this.id);
			self.restButtons ('AddGraph');
		 self.application.SetHandlerMode(document.getElementById('AddGraph').className != "" ? "addGraph" : "default");
		}
	
	document.getElementById('ConnectGraphs').onclick = function ()
		{
            userAction(this.id);
			self.restButtons ('ConnectGraphs');
		 self.application.SetHandlerMode(document.getElementById('ConnectGraphs').className != "" ? "addArc" : "default");
		}	
	
	document.getElementById('DeleteObject').onclick = function ()
		{
            userAction(this.id);
			self.restButtons ('DeleteObject');
		 self.application.SetHandlerMode(document.getElementById('DeleteObject').className != "" ? "delete" : "default");
		}

	document.getElementById('DeleteAll').onclick = function ()
		{
            userAction(this.id);
		 self.application.SetHandlerMode("deleteAll");
		}

	document.getElementById('SaveGraph').onclick = function ()
		{
            userAction(this.id);
		 self.application.SetHandlerMode("saveDialog");
		}

	document.getElementById('NewGraph').onclick = function ()
		{
            userAction(this.id);
		 self.application.SetHandlerMode("deleteAll");
            self.application.SetDefaultTransformations();
		}
    
    document.getElementById('SaveGraphImage').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("saveDialogImage");
    }
    
    document.getElementById('SaveFullGraphImage').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("saveDialogFullImage");
    }

    document.getElementById('SavePrintGraphImage').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("savePrintGraphImage");
    }

    document.getElementById('SaveSvgGraphImage').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("saveSvgGraphImage");
    }
    
    document.getElementById('Zoom100').onclick = function ()
    {
        userAction(this.id);
        self.application.setCanvasScale(1.0);
    }
    
    document.getElementById('Zoom50').onclick = function ()
    {
        userAction(this.id);
        self.application.setCanvasScale(50 / 100);
    }
    
    document.getElementById('Zoom25').onclick = function ()
    {
        userAction(this.id);
        self.application.setCanvasScale(25 / 100);
    }
  
    document.getElementById('ZoomFit').onclick = function ()
    {
        userAction(this.id);
        self.application.OnAutoAdjustViewport();
    }
    
    document.getElementById('ZoomIn').onclick = function ()
    {
        userAction(this.id);
        self.application.multCanvasScale(1.5);
    }
    
    document.getElementById('ZoomOut').onclick = function ()
    {
        userAction(this.id);
        self.application.multCanvasScale(1.0 / 1.5);
    }
    
    document.getElementById('MoveWorspace').onclick = function ()
    {
        userAction(this.id);
        self.restButtons ('Default');
        self.application.SetHandlerMode("default");
        document.getElementById('Default').className = "btn btn-primary btn-sm";
    }
    document.getElementById('SetupVertexStyle').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("setupVertexStyle");
    }
    document.getElementById('SetupVertexStyleSelected').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("setupVertexStyleSelected");
    }
    document.getElementById('SetupEdgeStyle').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("setupEdgeStyle");
    }
    document.getElementById('SetupEdgeStyleSelected').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("setupEdgeStyleSelected");
    }
    document.getElementById('SetupBackgroundStyle').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("setupBackgroundStyle");
    }

    document.getElementById('GraphUndo').onclick = function ()
    {
        userAction(this.id);
        self.application.SetHandlerMode("graphUndo");
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
        
        self.application.SetHandlerMode("user.algorithm");
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
        
        var graphAsString  = self.application.graph.SaveToXML("");
        var savedGraphName = self.application.GetNewGraphName();
        
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
        
        self.fullscreen = !self.fullscreen
        
        userAction(self.fullscreen ? "fullscreen_on" : "fullscreen_off");
        
        for (var i = 0; i < idList.length; i++) {
            let element = document.getElementById(idList[i]);
            if (!element) continue;

            if (self.fullscreen)
                element.style.display = "none";    
            else
                element.style.display = "block";
        }
                
        document.getElementById("mainContainer").className = self.fullscreen ? "container-fluid page-wrap" : "container page-wrap";
        
        document.getElementById("FullscreenIcon").className = self.fullscreen ? "glyphicon glyphicon-resize-small fa-fw" : "glyphicon glyphicon-resize-full fa-fw";

        resizeCanvas();
    }
}

Editor.prototype.initVoteButton = function()
{
    let self = this;

    if (document.getElementById('VoteButton') !== null)
    document.getElementById('VoteButton').onclick = function ()
    {
        var dialogButtons = {};
        
        for (var i = 0; i < 6 && document.getElementById('vote' + i) !== null; i++)
        {
            document.getElementById('vote' + i)["voteIndex"] = i;
            document.getElementById('vote' + i).onclick = function ()
            {
                console.log("Vote" + self["voteIndex"]);
                $.ajax({
                type: "GET",
                url: "/" + SiteDir + "cgi-bin/vote.php?index=" + self["voteIndex"],
                dataType: "text"
                });
                $("#voteDialog").dialog('close');
                $("#VoteButton").hide();
            }
        }

        dialogButtons[g_close] = function() {
                $( self ).dialog( "close" );					
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
}

Editor.prototype.initAlgorithmList = function()
{
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

Editor.prototype.init = function()
{
	this.application.onLoad();

    this.initMouseActions();
    this.initKeyActions();
    this.initButtonActions();    
    this.initVoteButton();
    
    // Get algorithms list and load it.
    let self = this;
    loadAsyncAlgorithms(function () {self.createAlgorithmMenu(); });

    var devTools = document.getElementById('developerTools');
    devTools.style.left = 0;

	resizeCanvas();
 this.application.onPostLoadEvent();

    this.initAlgorithmList();
}

Editor.prototype.redraw = function() {
    this.application.redrawGraph();
}

Editor.prototype.createAlgorithmMenu = function()
{
    let self = this;
    var algorithmBaseId = "Algo";
    var algorithms = this.application.getAlgorithmNames();
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
        
        this.buttonsList.push(algorithm.id);
        
        button.onclick = function (e)
        {
            e["closeThisMenu"] = true;
            userAction(this.id);
            self.restButtons (this.id);
            self.application.SetHandlerMode(this.id);
        }
        
        var eventData = {};
        eventData.index     = i;
        eventData.object    = clone;
        eventData.algorithm = algorithm;
        
        $("#openAlgorithmList").bind('click', eventData, function (_eventData) {
            var data      = _eventData.data;
            var algorithm = g_Algorithms[g_AlgorithmIds.indexOf(data.algorithm.id)](self.application.graph, self.application);
            
            if (self.application.graph.isMulti() && !self.algorithm.IsSupportMultiGraph())
              $(data.object).hide();
            else
              $(data.object).show();
          });
        
        list.insertBefore(clone, document.getElementById("insert" + algorithm.category));
        index++;
    }
}

Editor.prototype.restButtons = function(me)
{
    var needSetDefault = false;
	for (let i = 0; i < this.buttonsList.length; i ++)
	{
		if (this.buttonsList[i] != me)
		{
			document.getElementById(this.buttonsList[i]).className = "btn btn-default btn-sm";
		}
		else
		{
			if (document.getElementById(this.buttonsList[i]).className != "btn btn-default btn-sm")
			{
				needSetDefault = true;	
			}
		}
	}
	if (needSetDefault)
	{
		document.getElementById(me).className = "btn btn-primary btn-sm";
	}
	else
	{
		document.getElementById(me).className = "btn btn-primary btn-sm";
	}
}

Editor.prototype.ShowIncidenceMatrixErrorDialog = function(matrix)
{
	var dialogButtons = {};

	matrixRes = matrix.replace(/\n/g,'%0A');
	dialogButtons[g_readMatrixHelp] = function() {
			window.location.assign(g_language == "ru" ? "./wiki/Справка/МатрицаИнцидентности#matrixFormat" : "./wiki/Help/IncidenceMatrix#matrixFormat");
		};
	dialogButtons[g_fixMatrix] = function() {
			window.location.assign("./create_graph_by_incidence_matrix?incidenceMatrix=" + matrixRes);
		};
	dialogButtons[g_close] = function() {
			$( this ).dialog( "close" );					
		}; 

	$( "#matrixErrorInc" ).dialog({
		resizable: false,
		title: g_matrixWrongFormat,
		width: 400,
		modal: true,
		dialogClass: 'EdgeDialog',
		buttons: dialogButtons,
	});
}

Editor.prototype.ShowPairErrorDialog = function(pair)
{
	var dialogButtons = {};

	pair = pair.replaceAll(/\n/g,'%0A');
    pair = pair.replaceAll('>', '&gt;');
    pair = pair.replaceAll('<', '&lt;');

	dialogButtons[g_readMatrixHelp] = function() {
			window.location.assign(g_language == "ru" ? "./wiki/Справка/СписокРебер" : "./wiki/Help/EdgeList");
		};
	dialogButtons[g_fix] = function() {
			window.location.assign("./create_graph_by_edge_list?pair=" + pair);
		};
	dialogButtons[g_close] = function() {
			$( this ).dialog( "close" );					
		}; 

	$( "#pairErrorInc" ).dialog({
		resizable: false,
		title: g_pairWrongFormat,
		width: 400,
		modal: true,
		dialogClass: 'EdgeDialog',
		buttons: dialogButtons,
	});
}

Editor.prototype.ShowAdjacencyMatrixErrorDialog = function(matrix)
{
	var dialogButtons = {};

	matrixRes = matrix.replace(/\n/g,'%0A');
	dialogButtons[g_readMatrixHelp] = function() {
			window.location.assign(g_language == "ru" ? "./wiki/Справка/МатрицаСмежности#matrixFormat" : "./wiki/Help/AdjacencyMatrix#matrixFormat");
		};
	dialogButtons[g_fixMatrix] = function() {
			window.location.assign("./create_graph_by_matrix?matrix=" + matrixRes);
		};
	dialogButtons[g_close] = function() {
			$( this ).dialog( "close" );					
		}; 

	$( "#matrixError" ).dialog({
		resizable: false,
		title: g_matrixWrongFormat,
		width: 400,
		modal: true,
		dialogClass: 'EdgeDialog',
		buttons: dialogButtons,
	});
}