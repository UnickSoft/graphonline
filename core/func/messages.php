<?php

    /**
     * Стилистически оформленные сообщения
     *
     * @author Zmi
     */


    function Msg($message, $css = 'msg')
    {
        ob_start();
            IncludeCom('dev/msg', array('message' => $message, 'css' => $css));
        return ob_get_clean();
    }

    function MsgOk($message)
    {
        return Msg($message, 'msg-ok');
    }

    function MsgErr($message)
    {
        return Msg($message, 'msg-err');
    }
?>