<?php

    /**
     * Вывод ошибки на экран и лог или только в лог в зависимоти от DEBUG_MODE
     *
     * @author Zmi
     */
    class MyDebug_ErrorHook_TextNotifier extends Debug_ErrorHook_TextNotifier
    {
        protected function _notifyText($subject, $body)
        {
            global $g_config;

            // Подготовка сообщения ошибки
            $msg = PHP_EOL .
                       "Text notification:" . PHP_EOL .
                       "\tsubject: {$subject}" . PHP_EOL .
                       "\t{$body}" .
                   PHP_EOL;

            // Запись ошибки в лог-файл
            $path       = $g_config['logErrors']['logFile'];
            $fileLogger = FileLogger::Create($path);
            $fileLogger->Error($msg);

            // Вывод ошибки на экран
            if ($g_config['phpIni']['display_errors'])
            {
                echo "<pre>$msg</pre>";
            }
            else
            {
                IncludeCom('500');
            }
        }
    };
?>