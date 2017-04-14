<?php
/**
 * Auxilary class.
 * It performs all work with notification catching.
 */
class Debug_ErrorHook_Catcher
{
    private $_notifiers = array();
    private $_active = true;
    private $_prevHdl = null;
    private $_types = array(
        "E_ERROR", "E_WARNING", "E_PARSE", "E_NOTICE", "E_CORE_ERROR",
        "E_CORE_WARNING", "E_COMPILE_ERROR", "E_COMPILE_WARNING",
        "E_USER_ERROR", "E_USER_WARNING", "E_USER_NOTICE", "E_STRICT",
        "E_RECOVERABLE_ERROR", "E_DEPRECATED", "E_USER_DEPRECATED",
    );
        
    public function __construct()
    {
        $this->_prevHdl = set_error_handler(array($this, "_handleNotice"));
        register_shutdown_function(array($this, "_handleFatal"));
    }
    
    public function remove()
    {
        restore_error_handler();
        $this->_prevHdl = null;
        // There is no unregister_shutdown_function(), so we emulate it via flag.
        $this->_active = false;
    }

    public function addNotifier(Debug_ErrorHook_INotifier $notifier)
    {
        $this->_notifiers[] = $notifier;
    }
    
    public function _handleNotice($errno, $errstr, $errfile, $errline)
    {
        if (!($errno & error_reporting())) {
            return $this->_callPrevHdl($errno, $errstr, $errfile, $errline);
        }
        $trace = debug_backtrace();
        array_shift($trace);
        if ($this->_notify($errno, $errstr, $errfile, $errline, $trace) === false) {
            return $this->_callPrevHdl($errno, $errstr, $errfile, $errline, $trace);
        }
    }
    
    public function _handleFatal()
    {
        $error = error_get_last();
        if (!$this->_active || !is_array($error) || !in_array($error['type'], array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR))) {
            return;
        }
        $this->_notify($error['type'], $error['message'], $error['file'], $error['line'], null);
    }
    
    /**
     * Processes a notification.
     *
     * @param mixed $errno
     * @param string $errstr
     * @param string $errfile
     * @param int $errline
     * @param array $trace
     * @return bool  True if we need to stop the processing.
     */
    private function _notify($errno, $errstr, $errfile, $errline, $trace)
    {
        // Translate error number to error name.
        if (is_numeric($errno)) {
            foreach ($this->_types as $t) {
                if (defined($t)) {
                    $e = constant($t);
                    if ($errno == $e) {
                        $errno = $t;
                        break;
                    }
                }
            }
        }
        // Send data to all notifiers.
        foreach ($this->_notifiers as $notifier) {
            if ($notifier->notify($errno, $errstr, $errfile, $errline, $trace) === true) {
                return true;
            }
        }
        return false;
    }
    
    private function _callPrevHdl()
    {
        if ($this->_prevHdl) {
            $args = func_get_args();
            return call_user_func_array($this->_prevHdl, $args);
        }
        return false;
    }
}
