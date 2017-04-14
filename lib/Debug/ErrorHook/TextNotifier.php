<?php
/**
 * Generic notifier wrapper. Converts notification
 * to a human-readable text representation.
 */

abstract class Debug_ErrorHook_TextNotifier implements Debug_ErrorHook_INotifier
{
	const LOG_SERVER = 1;
	const LOG_TRACE = 2;
	const LOG_COOKIE = 4;
	const LOG_GET = 8;
	const LOG_POST = 16;
    const LOG_SESSION = 32;	
    const LOG_ALL = 65535;
	
	private $_whatToLog;
    private $_bodySuffix;
	
	public function __construct($whatToLog)
	{
		$this->_whatToLog = $whatToLog;
	}
	
    public function setBodySuffixTest($text)
    {
        $this->_bodySuffix = $text;
    }
    	
    public function notify($errno, $errstr, $errfile, $errline, $trace)
    {
    	$body = array();
        $body[] = $this->_makeSection(
            "", 
            join("\n", array(
                (@$_SERVER['GATEWAY_INTERFACE']? "//{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}" : ""),
                "$errno: $errstr",
                "at $errfile on line $errline",
            ))
    	);
    	if ($this->_whatToLog & self::LOG_TRACE && $trace) {
        	$body[] = $this->_makeSection("TRACE", Debug_ErrorHook_Util::backtraceToString($trace));
        }
        if ($this->_whatToLog & self::LOG_SERVER) {
            $body[] = $this->_makeSection("SERVER", Debug_ErrorHook_Util::varExport($_SERVER));
        }
        if ($this->_whatToLog & self::LOG_COOKIE) {
            $body[] = $this->_makeSection("COOKIES", Debug_ErrorHook_Util::varExport($_COOKIE));
        }
        if ($this->_whatToLog & self::LOG_GET) {
            $body[] = $this->_makeSection("GET", Debug_ErrorHook_Util::varExport($_GET));
        }
        if ($this->_whatToLog & self::LOG_POST) {
            $body[] = $this->_makeSection("POST", Debug_ErrorHook_Util::varExport($_POST));
        }
        if ($this->_whatToLog & self::LOG_SESSION) {
            $body[] = $this->_makeSection("SESSION", Debug_ErrorHook_Util::varExport(@$_SESSION));
        }
        // Append body suffix?
        $suffix = $this->_bodySuffix && is_callable($this->_bodySuffix)? call_user_func($this->_bodySuffix) : $this->_bodySuffix;
        if ($suffix) {
        	$body[] = $this->_makeSection("ADDITIONAL INFO", $suffix);
        }
        // Remain only 1st line for subject.
        $errstr = preg_replace("/\r?\n.*/s", '', $errstr);
        $this->_notifyText("$errno: $errstr at $errfile on line $errline", join("\n", $body));
    }
    
    private function _makeSection($name, $body)
    {
    	$body = rtrim($body);
    	if ($name) $body = preg_replace('/^/m', '    ', $body);
    	$body = preg_replace('/^([ \t\r]*\n)+/s', '', $body);
    	return ($name? $name . ":\n" : "") . $body . "\n";
    }
    
    abstract protected function _notifyText($subject, $body);
}
