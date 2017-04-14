<?php
/**
 * Notifier interface.
 * Should be implemented by all notifiers in the stack.
 */
interface Debug_ErrorHook_INotifier
{
	/**
	 * Called when an error occurred.
	 * 
	 * @param string $errno
	 * @param string $errstr
	 * @param string $errfile
	 * @param string $errline
	 * @param array $trace
	 * @return void
	 */
    public function notify($errno, $errstr, $errfile, $errline, $trace);
}
