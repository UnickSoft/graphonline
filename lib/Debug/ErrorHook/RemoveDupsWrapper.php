<?php
/**
 * Wrapper which denies duplicated notifications to be
 * processed again and again. It is needed to lower the
 * traffic to mail server in case the site is down. 
 * 
 * This class stores meta-informations in filesystem.
 * It takes care about garbage collecting.
 */

class Debug_ErrorHook_RemoveDupsWrapper implements Debug_ErrorHook_INotifier
{
	const DEFAULT_PERIOD = 300;
	const ERROR_FILE_SUFFIX = ".error";
	const GC_PROBABILITY = 0.01;
	
	private $_notifier;
	private $_tmpPath;
	private $_period;
	private $_gcExecuted = false;
	
	public function __construct(Debug_ErrorHook_INotifier $notifier, $tmpPath = null, $period = null)
	{
		$this->_tmpPath = $tmpPath? $tmpPath : $this->_getDefaultTmpPath();
		$this->_period = $period? $period : self::DEFAULT_PERIOD;
		$this->_notifier = $notifier;
		if (!@is_dir($this->_tmpPath)) {
			if (!@mkdir($this->_tmpPath, 0777, true)) {
				$error = error_get_last();
				throw new Exception("Cannot create '{$this->_tmpPath}': {$error['message']}");
			}
		}
	}
	
    public function notify($errno, $errstr, $errfile, $errline, $trace)
    {
    	$hash = md5(join(":", array($errno, $errfile, $errline)));
    	if ($this->_isExpired($hash)) {
    		$this->_notifier->notify($errno, $errstr, $errfile, $errline, $trace);
    	}
    	// Touch always, even if we did not send anything. Else same errors will 
    	// be mailed again and again after $period (e.g. once per 5 minutes).
        $this->_touch($hash, $errfile, $errline);
    }
    
    protected function _getDefaultTmpPath()
    {
    	return sys_get_temp_dir() . "/" . get_class($this);
    }
    
    protected function _getGcProbability()
    {
    	return self::GC_PROBABILITY;
    }
    
    private function _getLockFname($hash)
    {
    	return $this->_tmpPath . '/' . $hash . self::ERROR_FILE_SUFFIX;
    }
    
    private function _isExpired($hash)
    {
    	$file = $this->_getLockFname($hash);
    	return !file_exists($file) || filemtime($file) < time() - $this->_period;
    }
    
    private function _touch($hash, $errfile, $errline)
    {
        $file = $this->_getLockFname($hash);
    	file_put_contents($file, "$errfile:$errline");
    	@chmod($file, 0666);
    	$this->_gc();
    }
    
    private function _gc()
    {
    	if ($this->_gcExecuted || mt_rand(0, 10000) >= $this->_getGcProbability() * 10000) {
    		return;
    	}
    	foreach (glob("{$this->_tmpPath}/*" . self::ERROR_FILE_SUFFIX) as $file) {
    		if (filemtime($file) <= time() - $this->_period * 2) {
    			@unlink($file);
    		}
    	}
    	$this->_gcExecuted = true;
    }
}
