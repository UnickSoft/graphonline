
    <script type="text/javascript">
        function DebugPanel_Toggle(id)
        {
            var e = document.getElementById(id);
            e.style.display = (e.style.display == 'none' ? 'block' : 'none');
        }

        function DebugPanel_ShowHidePanel()
        {
            DebugPanel_Toggle('i-debug-panel-all-panels');
            DebugPanel_Toggle('i-debug-panel-list');
            DebugPanel_Toggle('i-show-profile');
        }

        function DebugPanel_ShowExtensionFuncs(id)
        {
            var e = document.getElementById(id);
            document.getElementById('i-ext-show').innerHTML = e.innerHTML;
        }
    </script>
    <link rel="stylesheet" type="text/css" href="<?= Root('i/css/dev/debug_panel.css')?>" />


    <div style="clear: both"></div>
    <div id="i-debug-panel">
        <span class="icon show-profile" id="i-show-profile" onclick="DebugPanel_ShowHidePanel()"></span>

        <ul id="i-debug-panel-list" style="display: none">
            <li class="show-hide-elem">
                <span class="icon hide-profile" onclick="DebugPanel_ShowHidePanel()"></span>
            </li>
            <li>
                <span class="icon time"></span>
                <?= number_format(floatval(microtime(true) - $g_config['startExecTime']), 3);?> s
            </li>
            <li>
                <span class="icon mem"></span>
                <?= $debug->MemoryUsage()?>
            </li>
            <li>
                <span class="icon db"></span>
                <a href="javascript:DebugPanel_Toggle('i-databasa-log')">sql</a>
            </li>
            <li>
                <span class="icon vars"></span>
                <a href="javascript:DebugPanel_Toggle('i-vars-log')">vars <span class="small">(G: <?= count($_GET)?> / P: <?= count($_POST)?> / C: <?= count($_COOKIE)?> / F: <?= count($_FILES)?>)</span></a>
            </li>
            <li>
                <span class="icon files"></span>
                <a href="javascript:DebugPanel_Toggle('i-files')">files <span class="small">(<?= count($debug->Files())?>)</span></a>
            </li>
            <li>
                <span class="icon engine"></span>
                <a href="javascript:DebugPanel_Toggle('i-engine')">engine</a>
            </li>
            <li>
                <span class="icon ini-values"></span>
                <a href="javascript:DebugPanel_Toggle('i-ini-values')">ini + exts</a>
            </li>
        </ul>

        <div id="i-debug-panel-all-panels" style="display: none">
            <div id="i-databasa-log" class="panel" style="display: none">
                <?= $debug->Db()?>
            </div>

            <div id="i-vars-log" class="panel" style="display: none">
                <ul>
                    <li>
                        <?php IncludeCom('dev/debug_panel/var_panel', array('head' => '$_GET', 'link' => 'i-get-log', 'arr' => $_GET))?>
                    </li>
                    <li>
                        <?php IncludeCom('dev/debug_panel/var_panel', array('head' => '$_POST', 'link' => 'i-post-log', 'arr' => $_POST))?>
                    </li>
                    <li>
                        <?php IncludeCom('dev/debug_panel/var_panel', array('head' => '$_COOKIE', 'link' => 'i-cookie-log', 'arr' => $_COOKIE))?>
                    </li>
                    <?php if (session_id()):?>
                        <li>
                            <?php IncludeCom('dev/debug_panel/var_panel', array('head' => '$_SESSION', 'link' => 'i-session-log', 'arr' => $_SESSION))?>
                        </li>
                    <?php endif?>
                    <li>
                        <?php IncludeCom('dev/debug_panel/var_panel', array('head' => '$_SERVER', 'link' => 'i-server-log', 'arr' => $_SERVER))?>
                    </li>
                    <li>
                        <a href="javascript:DebugPanel_Toggle('i-files-log')">$_FILES <span>(<?= count($_FILES)?>)</span></a>
                        <div id="i-files-log" style="display: none">
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <th>№</th>
                                    <th>field name</th>
                                    <th>name</th>
                                    <th>type</th>
                                    <th>tmp_name</th>
                                    <th>error</th>
                                    <th>size</th>
                                </tr>
                                <?php if (count($_FILES)):?>
                                    <?php $i = 0; foreach ($_FILES as $k => $v):?>
                                        <tr>
                                            <td class="num"><?= ++$i?></td>
                                            <td><?= $k?></td>
                                            <td><?= $v['name']?></td>
                                            <td><?= $v['type']?></td>
                                            <td><?= $v['tmp_name']?></td>
                                            <td><?= $v['error']?></td>
                                            <td><?= $v['size']?></td>
                                        </tr>
                                    <?php endforeach?>
                                <?php else:?>
                                    <tr>
                                        <td colspan="7" class="center">Empty</td>
                                    </tr>
                                <?php endif?>
                            </table>
                        </div>
                    </li>
                </ul>
            </div>

            <div id="i-files" class="panel" style="display: none">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <th>№</th>
                        <th>file</th>
                        <th>size</th>
                        <th>lines</th>
                    </tr>
                    <?php $i = 0; foreach ($debug->Files() as $f):?>
                        <tr>
                            <td class="num"><?= ++$i?></td>
                            <td><?= str_replace(BASEPATH, '<span>' . BASEPATH . '</span>', $f['file'])?></td>
                            <td><?= $f['size']?></td>
                            <td><?= $f['lines']?></td>
                        </tr>
                    <?php endforeach?>
                    <tr class="total">
                        <td></td>
                        <td class="center"><span>Total</span> <?= count($debug->Files())?> <span>files</span></td>
                        <td><?= $debug->TotalFileSize()?></td>
                        <td><?= $debug->TotalFileLines()?></td>
                    </tr>
                </table>
            </div>

            <div id="i-engine" class="panel" style="display: none">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <td>language</td>
                        <td><?= $g_arrLangs[LANG]['name']?> <strong>(<?= LANG?>)</strong></td>
                    </tr>
                    <tr>
                        <td>current url</td>
                        <td><?= GetCurUrl()?></td>
                    </tr>
                    <tr>
                        <td>query</td>
                        <td><?= GetQuery()?></td>
                    </tr>
                    <?php foreach ($g_config['phpIni'] as $k => $v):?>
                        <tr>
                            <td><?= $k?></td>
                            <td><?= VarDump($v)?></td>
                        </tr>
                    <?php endforeach?>
                </table>
            </div>

            <div id="i-ini-values" class="panel" style="display: none">
                <h3>Load extensions</h3>
                <ul class="exts">
                    <?php foreach (get_loaded_extensions() as $v):?>
                        <li>
                            <a href="javascript:DebugPanel_ShowExtensionFuncs('i-ext-<?= md5($v)?>')">
                                <?= $v?>
                            </a>
                            <div style="display:none" id="i-ext-<?= md5($v)?>">
                                <h3>Function in extension: <?= $v?></h3>
                                <?php
                                    $funcs = get_extension_funcs($v);
                                    $funcs = empty($funcs) ? array() : $funcs;

                                    if ($funcs):
                                ?>
                                    <table cellpadding="0" cellspacing="0">
                                        <?php foreach (get_extension_funcs($v) as $k => $func):?>
                                            <tr>
                                                <td><?= $k++?></td>
                                                <td><?= $func?></td>
                                            </tr>
                                        <?php endforeach?>
                                    </table>
                                <?php
                                    endif;
                                ?>
                            </div>
                        </li>
                    <?php endforeach?>
                </ul>
                <div style="clear: both"></div>
                <div id="i-ext-show"></div>

                <h3>Php.ini</h3>
                <table cellpadding='0' cellspacing='0'>
                    <tr>
                        <th>name </th>
                        <th>global val</th>
                        <th>local val</th>
                        <th>access</th>
                    </tr>
                    <?php
                        foreach (ini_get_all() as $k => $v)
                        {
                            ?>
                                <tr>
                                    <td><?= $k?></td>
                                    <td><?= VarDump($v['global_value'])?></td>
                                    <td><?= VarDump($v['local_value'])?></td>
                                    <td><?= DebugPanel::ShowPhpIniAccess($v['access'])?></td>
                                </tr>
                            <?php
                        }
                    ?>
                </table>
            </div>
        </div>

        <div style="clear: both"></div>
    </div>