<?php

    function __FilesCmpByDate($f1, $f2)
    {
        $m1 = filemtime($f1);
        $m2 = filemtime($f2);
        if ($m1 == $m2)
        {
            return 0;
        }
        return ($m1 < $m2) ? 1 : -1;
    }

    function OrderFilesByDate($list)
    {
        if (count($list))
        {
            usort($list, "__FilesCmpByDate");
        }
        return $list;
    }
?>
