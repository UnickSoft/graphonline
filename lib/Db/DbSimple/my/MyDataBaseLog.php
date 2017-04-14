<?php

    /**
     * Для вывода лога запросов к БД (использовать совместно с DbSimple)
     *
     * @author Zmi
     */
    class MyDataBaseLog
    {
        private static $dbLog = array();
        private static $pFuncOnError = NULL;

        /**
         * Устанавливает функцию на ошибку запроса
         */
        public static function SetFuncOnError($func)
        {
            self::$pFuncOnError = $func;
        }

        /**
         * Определить функцию на получение ошибки в $info наиболее полезные параметры [query, message, code, context]
         */
        public static function Error($message, $info)
        {
            if (!error_reporting())
            {
                return;
            }

            if (!empty(self::$pFuncOnError))
            {
                call_user_func(self::$pFuncOnError, $message, $info);
            }
        }

        /**
         * Функция логирования запроса
         */
        public static function Log($db, $sql)
        {
            $caller          = $db->findLibraryCaller();
            $log             = array();
            $log['q']        = $sql;
            $log['file']     = $caller['file'];
            $log['line']     = $caller['line'];
            $log['time']     = $caller['object']->_statistics['time'];
            $log['count']    = $caller['object']->_statistics['count'];
            $log['error']    = $caller['object']->error;
            $log['errorMsg'] = $caller['object']->errmsg;

            self::$dbLog[]   = $log;
        }

        /**
         * Показывает лог-табличку
         */
        public static function Render()
        {
            ob_start();
                ?>
                    <table id='iDbLogger' cellpadding="0" cellspacing="0">
                        <tr>
                            <th>№</th>
                            <th>query</th>
                            <th>time</th>
                        </tr>
                        <?php
                            $totalTime = 0;
                            $curElem   = 0;
                            $maxLen    = 125;
                            for ($i = 0, $j = count(self::$dbLog); $i < $j; $i+=2)
                            {
                                $log1    = self::$dbLog[$i];
                                $log2    = isset(self::$dbLog[$i+1]) ? self::$dbLog[$i+1] : array();
                                $isError = empty($log2['error']) ? false : true;

                                $execTime   =  $log2['time'] - $log1['time'];
                                $totalTime +=  $execTime;
                                $color      =  $isError ? 'red' : 'green';
                                $error      =  $log2['error'];
                                $query      =  $log1['q'];
                                $time       =  number_format($execTime , 5, '.', ' ');
                                $count      =  $log1['count'];
                        ?>
                                <tr>
                                    <td class="num"><?= (int)(++$curElem)?></td>
                                    <td style='color: <?= $color?>'>
                                        <pre><?= wordwrap($query, $maxLen, PHP_EOL)?></pre>
                                        <?php if ($isError):?>
                                            <div id='iDataBaseLog_<?= $i?>'><pre><?= wordwrap(print_r($error, true), $maxLen, PHP_EOL)?></pre></div>
                                        <?php endif?>
                                    </td>
                                    <td><?= $time?></td>
                                </tr>
                        <?php
                                if ($isError)
                                {
                                    $i++;
                                }
                            }
                        ?>
                            <tr class="total">
                                <td colspan='2' class="center"><?= $curElem?> <span>queries</span></td>
                                <td><?= number_format($totalTime, 5, '.', ' ')?></td>
                            </tr>
                    </table>
                <?php
            return ob_get_clean();
        }
    };
?>
