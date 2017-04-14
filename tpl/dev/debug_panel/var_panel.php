
    <a href="javascript:DebugPanel_Toggle('<?= $link?>')"><?= $head?> <span>(<?= count($arr)?>)</span></a>

    <div id="<?= $link?>" style="display: none">
        <table cellpadding="0" cellspacing="0">
            <tr>
                <th>#</th>
                <th>key</th>
                <th>value</th>
            </tr>
            <?php if (count($arr)):?>
                <?php $i = 0; foreach ($arr as $k => $v):?>
                    <tr>
                        <td class="num"><?= ++$i?></td>
                        <td><?= $k?></td>
                        <td><?= VarDump($v)?></td>
                    </tr>
                <?php endforeach?>
            <?php else:?>
                <tr>
                    <td colspan="3" class="center">Empty</td>
                </tr>
            <?php endif?>
        </table>
    </div>