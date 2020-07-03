$(document).ready(function ()
{
    document.getElementById('run_test').onclick = function ()
    {
        $('#response').text("start");
        
        var xml = $('#graph').val();
        console.log(xml);

        $.ajax({
             type: "POST",
             url: "/cgi-bin/" + $('#cginame').val() + "?" + $('#params').val(),
             data: xml,
             dataType: "text",
             })
        .done(function( msg )
            {
                console.log(msg);
                $('#response').text(msg);
            });

        return true;
    }    
});
