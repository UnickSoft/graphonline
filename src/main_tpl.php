<?php

    AutoTDKW($content);
    $title          = L('m_title');
    $description    = L('m_description');
    $keyWords       = L('m_keyWords');

    $menu = array();
    $menu[] = array
    (
        "title" => L("menu_0"),
        "link"  => SiteRoot(),
    );

    $menu[] = array
    (
        "title" => L("menu_1"),
	"link"  => "",
        "list"  => array(
        		array(    			
        		"title" => L("menu_4"),
        		"link"  => SiteRoot("create_graph_by_matrix"),),
			array(
        		"title" => L("menu_5"),
        		"link"  => SiteRoot("create_graph_by_incidence_matrix"),),
			array(
        		"title" => L("menu_9"),
        		"link"  => SiteRoot("graphs_examples"),)
			),
    );

    $menu[] = array
    (
        "title" => L("menu_2"),
        "link"  => "",
     "list"  => array(
                      array(
                            "title" => L("menu_7"),
                            "link"  => SiteRoot("help"),),
                      array(
                            "title" => L("menu_6"),
                            "link"  => SiteRoot("wiki"),),
                      array(
                            "title" => L("menu_10"),
                            "link"  => SiteRoot("opensource"),)
                      ),
    ); 
    $menu[] = array
    (
        "title" => L("menu_8"),
        "link"  => SiteRoot("news"),
    ); 
    $menu[] = array
    (
        "title" => L("menu_3"),
        "link"  => SiteRoot("contacts"),
    );

    // Помечаем текущую страницу если она есть среди пунктов меню:
    foreach ($menu as $k => $v)
    {
        $v["is_active"] = SiteRoot(GetQuery()) == $v["link"];
        $menu[$k] = $v;
    }

    // redirect to new domen.
//    header("HTTP/1.1 301 Moved Permanently"); 
//    header("Location: http://graphonline.ru" . $_SERVER['REQUEST_URI']); 
//    return;
?>