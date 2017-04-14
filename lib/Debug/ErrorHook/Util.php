<?php
class Debug_ErrorHook_Util
{
    /**
     * var_export clone, without using output buffering.
     * (For calls in ob_handler)
     *
     * @param mixed $var to be exported
     * @param integer $maxLevel (recursion protect)
     * @param integer $level of current indent
     * @return string
     */
    public static function varExport($var, $maxLevel = 10, $level = 0)
    {
        $escapes = "\"\r\t\x00\$";
        $tab = '    ';
 
        if (is_bool($var)) {
            return $var ? 'TRUE' : 'FALSE';
        } elseif (is_string($var)) {
            return '"' . addcslashes($var, $escapes) . '"';
        } elseif (is_float($var) || is_int($var)) {
            return $var;
        } elseif (is_null($var)) {
            return 'NULL';
        } elseif (is_resource($var)) {
            return 'NULL /* ' . $var . ' */';
        }
 
        if ($maxLevel < $level) {
            return 'NULL /* ' . (string) $var . ' MAX LEVEL ' . $maxLevel . " REACHED*/";
        }
 
        if (is_array($var)) {
            $return = "array(\n";
        } else {
            $return = get_class($var) . "::__set_state(array(\n";
        }
 
        $offset = str_repeat($tab, $level + 1);
 
        foreach ((array) $var as $key => $value) {
            $return .= $offset;
            if (is_int($key)) {
                $return .= $key;
            } else {
                $return .= '"' . addcslashes($key, $escapes). '"';
            }
            $return .= ' => ' . self::varExport($value, $maxLevel, $level + 1) . ",\n";
        }
 
        return $return
            . str_repeat($tab, $level)
            . (is_array($var) ? ')' : '))');
    }    
    
    /**
     * Analog for debug_print_backtrace(), but returns string.
     *
     * @return string
     */
    public static function backtraceToString($backtrace)
    {
        // Iterate backtrace
        $calls = array();
        foreach ($backtrace as $i => $call) {
            if (!isset($call['file'])) {
                $call['file'] = '(null)';
            }
            if (!isset($call['line'])) {
                $call['line'] = '0';
            }
            $location = $call['file'] . ':' . $call['line'];
            $function = (isset($call['class'])) ?
                $call['class'] . (isset($call['type']) ? $call['type'] : '.') . $call['function'] :
                $call['function'];
    
            $params = '';
            if (isset($call['args']) && is_array($call['args'])) {
                $args = array();
                foreach ($call['args'] as $arg) {
                    if (is_array($arg)) {
                        $args[] = "Array(...)";
                    } elseif (is_object($arg)) {
                        $args[] = get_class($arg);
                    } else {
                        $args[] = $arg;
                    }
                }
                $params = implode(', ', $args);
            }
    
            $calls[] = sprintf('#%d  %s(%s) called at [%s]',
                $i,
                $function,
                $params,
                $location);
        }
    
        return implode("\n", $calls) . "\n";
    }	
}
