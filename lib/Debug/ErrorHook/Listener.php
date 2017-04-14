<?php
/**
 * Class to catch notices, warnings and even fatal errors
 * and push them to a number of notifiers (e.g. - to email).
 * 
 * A Listener object is kind of a guard object. 
 * 
 * @version 1.00
 */

class Debug_ErrorHook_Listener
{
	private $_catcher = null;
	
	/**
	 * Creates a new listener object.
	 * When this object is destroyed, all hooks are removed.
	 * 
	 * @return Debug_ErrorHook_Listener
	 */
    public function __construct() 
    {
        $this->_catcher = new Debug_ErrorHook_Catcher();
    }

    /**
     * Destructor. Cancels all listenings.
     * 
     * @return void
     */
    public function __destruct() 
    {
        $this->_catcher->remove();
    }
    
    /**
     * Adds a new notifier to the list. Notifiers are called in case
     * of notices and even fatal errors.
     * 
     * @param Debug_ErrorHook_INotifier $notifier
     * @return void
     */
    public function addNotifier(Debug_ErrorHook_INotifier $notifier)
    {
    	$this->_catcher->addNotifier($notifier);
    }
}
