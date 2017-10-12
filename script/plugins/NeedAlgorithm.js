/**
 * Default handler.
 * Select using mouse, drag.
 *
 */
function NeedAlgorithm(graph, app)
{
    BaseAlgorithm.apply(this, arguments);
}


// inheritance.
NeedAlgorithm.prototype = Object.create(BaseAlgorithm.prototype);


NeedAlgorithm.prototype.getName = function(local)
{
    return local == "ru" ? "Не нашли нужный алгоритм?" : "Didn't find needed algorithm?";
}

NeedAlgorithm.prototype.getId = function()
{
    return "OlegSh.NeedAlgorithm";
}

// @return message for user.
NeedAlgorithm.prototype.getMessage = function(local)
{
    return local == "ru" ? "Спасибо" : "Thank you";
}

NeedAlgorithm.prototype.result = function(resultCallback)
{
    var dialogButtons = {};

    dialogButtons[g_send] = function() {
            console.log("Message" + $( "#NeedAlgorithmMessage" ).val());
            $.ajax({
            type: "GET",
            url: "/cgi-bin/sendEmail.php?text=" + $( "#NeedAlgorithmMessage" ).val(),
            dataType: "text"
            });
        
            $( this ).dialog( "close" );					
        }; 

    dialogButtons[g_close] = function() {
            $( this ).dialog( "close" );					
        }; 

    $( "#NeedAlgorithm" ).dialog({
        resizable: false,
        title: g_recommendAlgorithm,
        width: 400,
        modal: true,
        dialogClass: 'EdgeDialog',
        buttons: dialogButtons,
    });

    var result = {};
    result["version"] = 1;

    return result;
}

NeedAlgorithm.prototype.getObjectSelectedGroup = function(object)
{
    return 0;
}

NeedAlgorithm.prototype.getPriority = function()
{
    return 100;
}


// Factory for connected components.
function CreateNeedAlgorithm(graph, app)
{
    return new NeedAlgorithm(graph)
}

// Gerister connected component.
RegisterAlgorithm (CreateNeedAlgorithm);
