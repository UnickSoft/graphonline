<?php

    $g_lang['head_no_tags'] = 'Creating graph by Edge List';
    $g_lang['text'] = '<p>On this page you can enter&nbsp;edge list and plot graph</p>';
    $g_lang['pair_description'] = 'Enter edge list. Each edge should be placed on a new line. Use "<b>-</b>" as separator between vertices. E.g. <b>1-2</b>. <small>Read about extended format below.</small>';    
    $g_lang['plot_graph_button'] = 'Plot graph';
    $g_lang['pair_bad_format'] = 'Edge list format is incorrect. Format of edge should be like: vertex1-vertex2. <small>Read about extension format below.</small>';
    $g_lang['ex_pair_format'] = "Extended format";
    $g_lang['ex_pair_forma_description'] ="Using extended format you may set up directed and weighted edges. Разные варианты использования:
        <ul>
            <li><b>a-b</b> - edge between <b>a</b> and <b>b</b>.</li>                                
            <li><b>a>b</b> - directed edge from <b>a</b> to <b>b</b>.</li>
            <li><b>a&lt;b</b> - directed edge from <b>a</b> to <b>b</b>. </li>
            <li><b>a-(8)-b</b> - weighted edge between <b>a</b> and <b>b</b> with weigth <b>8</b>.</li>
            <li><b>a-(3.5)>b</b> - directed edge from <b>a</b> to <b>b</b> with weight <b>3.5</b>.</li>
            <li><b>a<(1)-b</b> - directed edge from <b>b</b> to <b>a</b> with weight <b>1</b>.</li>
        </ul>";
    $g_lang['edge_list'] = 'Edge List';
?>