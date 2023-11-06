/*
   Main class for create by matrix page
*/


window.onload = function ()
{
	if (document.getElementById('CreateByAdjacencyMatrix'))
	{
		document.getElementById('CreateByAdjacencyMatrix').onclick = function ()
		{
			window.location = "./?matrix=" + $( "#AdjacencyMatrixFieldPage" ).val();
	  	}
        }
}
