
var waitCounter = false;
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