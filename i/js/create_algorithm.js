

var devTools = document.getElementById("developerTools");
var userScript = document.getElementById("userScript");
devTools.style.display = "block";

var canvasRect = document.getElementById("canvas").getBoundingClientRect();
devTools.style.top  = canvasRect.top + "px";
devTools.style.left = (canvasRect.right - devTools.offsetWidth) + "px";

$.ajax({
       type: "GET",
       url: "/i/js/userAlgorithm.jstmpl",
       })
.done(function( msg )
      {
        userScript.innerHTML = msg;
      });