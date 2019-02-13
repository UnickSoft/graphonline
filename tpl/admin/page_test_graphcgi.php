
    <?php IncludeCom('dev/bootstrap3')?>

    <head>
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/home.css')?>" />
	<link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery-ui.theme.css')?>" />
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery-ui.css')?>" />
<!--
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery-ui.structure.css')?>" />
-->
        <link rel="stylesheet" type="text/css" href="<?= Root('i/css/jquery.feedback_me.css')?>" />
        <script src="<?= Root('i/js/admin/page_test_graphcgi.js')?>"></script>
        
    </head>

    <h1>Тестирование GraphCGI</h1>

    <div>
        <div>
            <label for="inputName" class="col-lg-2 control-label">CGI name</label>
            <input type="text" autocomplete="on" name="cginame" id="cginame" value="GraphCGI.exe">
        </div>
        
        <div>
            <label for="inputName" class="col-lg-2 control-label">Get parametrs</label>
            <input type="text" autocomplete="on" name="params" id="params" value="dsp=cgiInput&start=1&finish=3&report=xml" size="50" >
        </div>

        <div>
            <label for="inputName" class="col-lg-2 control-label">Graph</label>
            <input type="text" autocomplete="on" name="graph" id="graph" value="<?= Post("graph")?>" size="100">
        </div>
        
        <div>
            <div class="col-lg-offset-2 col-lg-6">
                <button type="submit" class="btn btn-primary" id="run_test">Test</button>
            </div>
        </div>
    </div>

    <div>
        <div id="response">
        </div>
    </div>

