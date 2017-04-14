<?php
/**
 * Sends all notifications to a specified email.
 * 
 * Consider using this class together with Debug_ErrorHook_RemoveDupsWrapper
 * to avoid mail server flooding when a lot of errors arrives. 
 */

class Debug_ErrorHook_MailNotifier extends Debug_ErrorHook_TextNotifier
{
	private $_to;
	private $_charset;
	private $_whatToSend;
	private $_subjPrefix;
	
	public function __construct($to, $whatToSend, $subjPrefix = "[ERROR] ", $charset = "UTF-8")
	{
        parent::__construct($whatToSend);
		$this->_to = $to;
		$this->_subjPrefix = $subjPrefix;
		$this->_charset = $charset;
	}
	
    protected function _notifyText($subject, $body)
    {
    	$this->_mail(
    	   $this->_to, 
    	   $this->_encodeMailHeader($this->_subjPrefix . $subject), 
    	   $body,
    	   join("\r\n", array(
    	       "From: {$this->_to}",
    	       "Content-Type: text/plain; charset={$this->_charset}"
    	   ))
    	);
    }
    
    protected function _mail()
    {
    	$args = func_get_args();
    	@call_user_func_array("mail", $args);
    }
    
    private function _encodeMailHeader($header) 
    {
        return preg_replace_callback(
            '/((?:^|>)\s*)([^<>]*?[^\w\s.][^<>]*?)(\s*(?:<|$))/s',
            array(__CLASS__, '_encodeMailHeaderCallback'),
            $header
        );
    }

    private function _encodeMailHeaderCallback($p) 
    {
    	$encoding = $this->_charset;
        return $p[1] . "=?$encoding?B?" . base64_encode($p[2]) . "?=" . $p[3];
    }    
}
