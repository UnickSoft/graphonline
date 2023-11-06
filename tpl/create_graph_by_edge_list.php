    <head>
	    <link rel="stylesheet" type="text/css" href="<?= Root('i/css/create_graph_by_pair.css')?>" />
        <script src="<?= RootCacheJS("script/shared/config.js")?>" ></script>
        <script src="<?= RootCacheJS("script/shared/loader.js")?>" ></script>

	    <script src="<?= RootCacheJS('script/pages/create_graph_by_edge_list/api/index.js')?>"></script>
    </head>

    <script>
    function checkFormat()
    {
        var graph = new Graph();
            
        if (!graph.TestPair($( "#PairFieldPage" ).val()))
        {
            $( "#BadFormatMessage" ).show();
        }
        else
        {
            $( "#BadFormatMessage" ).hide();
        }        
    }

    window.onload = function ()
    {        
        if (document.getElementById('CreateByPair'))
        {
            document.getElementById('CreateByPair').onclick = function ()
            {
                $("#pairForm").submit();
            }
        }

        $( "#PairFieldPage" ).on('keyup change', function (eventObject)
		{
            checkFormat();
		});

        checkFormat();
    }

</script>
    <h1><?= L('head_no_tags')?></h1>
    <p><?= L('text')?></p>

    <div>
        <div id="message" class="alert alert-success" role="alert" style="height:64px">
            <p id="TextDescription"><?= L('pair_description') ?></p>
        </div>
        <h4><?= L('edge_list') ?></h4>        
        <div class="row">
            <div class="col-md-4">
                <form action="./" method="post" id="pairForm">
                    <textarea name="pairs" id="PairFieldPage" wrap="off">
<?php if (!isset($_GET["pair"])): ?>
a-b
a-c
b-c
<?php else: ?>
<?= $_GET["pair"] ?>
<?php endif;?></textarea>
                </form>
            </div>
            <div class="col-md-4">
                <button type="button" class="btn btn-default btn-lg" id="CreateByPair"><span class="glyphicon glyphicon-ok"></span> <?= L('plot_graph_button')?></button>
                    <div id="BadFormatMessage" class="alert alert-warning" role="alert">
                        <?= L('pair_bad_format')?>
                    </div>
                    <div class="alert alert-info" role="alert">
                        <h4><?= L('ex_pair_format')?></h4>
                        <div>
                            <?= L('ex_pair_forma_description')?>
                        </div>
                    </div>                    
            </div>
        </div>
    </div>  