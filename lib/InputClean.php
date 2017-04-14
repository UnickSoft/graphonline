<?php

    /**
     * Класс очистки входных данных взят из CodeIgniter
     */
    class InputClean
    {
        private $use_xss_clean      = true;
        private $xss_hash           = '';
        private $charset            = 'UTF-8';

        private $never_allowed_str = array(
                                            'document.cookie'   => '[removed]',
                                            'document.write'    => '[removed]',
                                            '.parentNode'       => '[removed]',
                                            '.innerHTML'        => '[removed]',
                                            'window.location'   => '[removed]',
                                            '-moz-binding'      => '[removed]',
                                            '<!--'              => '&lt;!--',
                                            '-->'               => '--&gt;',
                                            '<![CDATA['         => '&lt;![CDATA['
                                          );

        private $never_allowed_regex = array(
                                                "javascript\s*:"            => '[removed]',
                                                "expression\s*(\(|&\#40;)"  => '[removed]',
                                                "vbscript\s*:"              => '[removed]',
                                                "Redirect\s+302"            => '[removed]'
                                            );

        public function __construct($charset)
        {
            $this->charset = $charset;
        }

        public function _clean_input_data($str)
        {
            if (is_array($str))
            {
                $new_array = array();
                foreach ($str as $key => $val)
                {
                    $new_array[$this->_clean_input_keys($key)] = $this->_clean_input_data($val);
                }
                return $new_array;
            }

            // We strip slashes if magic quotes is on to keep things consistent
            if (get_magic_quotes_gpc())
            {
                $str = stripslashes($str);
            }

            // Should we filter the input data?
            if ($this->use_xss_clean === TRUE)
            {
                $str = $this->xss_clean($str);
            }

            // Standardize newlines
            if (strpos($str, "\r") !== FALSE)
            {
                $str = str_replace(array("\r\n", "\r"), "\n", $str);
            }

            return $str;
        }

        private function _clean_input_keys($str)
        {
            if (!preg_match("/^[a-z0-9:_\/-]+$/i", $str))
            {
                exit('Disallowed Key Characters.');
            }

            return $str;
        }


        public function filename_security($str)
        {
            $bad = array(
                            "../",
                            "./",
                            "<!--",
                            "-->",
                            "<",
                            ">",
                            "'",
                            '"',
                            '&',
                            '$',
                            '#',
                            '{',
                            '}',
                            '[',
                            ']',
                            '=',
                            ';',
                            '?',
                            "%20",
                            "%22",
                            "%3c",      // <
                            "%253c",    // <
                            "%3e",      // >
                            "%0e",      // >
                            "%28",      // (
                            "%29",      // )
                            "%2528",    // (
                            "%26",      // &
                            "%24",      // $
                            "%3f",      // ?
                            "%3b",      // ;
                            "%3d"       // =
                        );

            return stripslashes(str_replace($bad, '', $str));
        }

        public function xss_clean($str, $is_image = false)
        {
            /*
            * Is the string an array?
            *
            */
            if (is_array($str))
            {
                while (list($key) = each($str))
                {
                    $str[$key] = $this->xss_clean($str[$key]);
                }

                return $str;
            }

            /*
            * Remove Invisible Characters
            */
            $str = $this->_remove_invisible_characters($str);

            /*
            * Protect GET variables in URLs
            */

            // 901119URL5918AMP18930PROTECT8198

            $str = preg_replace('|\&([a-z\_0-9]+)\=([a-z\_0-9]+)|i', $this->xss_hash()."\\1=\\2", $str);

            /*
            * Validate standard character entities
            *
            * Add a semicolon if missing.  We do this to enable
            * the conversion of entities to ASCII later.
            *
            */
            $str = preg_replace('#(&\#?[0-9a-z]{2,})([\x00-\x20])*;?#i', "\\1;\\2", $str);

            /*
            * Validate UTF16 two byte encoding (x00)
            *
            * Just as above, adds a semicolon if missing.
            *
            */
            $str = preg_replace('#(&\#x?)([0-9A-F]+);?#i',"\\1\\2;",$str);

            /*
            * Un-Protect GET variables in URLs
            */
            $str = str_replace($this->xss_hash(), '&', $str);

            /*
            * URL Decode
            *
            * Just in case stuff like this is submitted:
            *
            * <a href="http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D">Google</a>
            *
            * Note: Use rawurldecode() so it does not remove plus signs
            *
            */
            $str = rawurldecode($str);

            /*
            * Convert character entities to ASCII
            *
            * This permits our tests below to work reliably.
            * We only convert entities that are within tags since
            * these are the ones that will pose security problems.
            *
            */

            $str = preg_replace_callback("/[a-z]+=([\'\"]).*?\\1/si", array($this, '_convert_attribute'), $str);

            $str = preg_replace_callback("/<\w+.*?(?=>|<|$)/si", array($this, '_html_entity_decode_callback'), $str);

            /*
            * Remove Invisible Characters Again!
            */
            $str = $this->_remove_invisible_characters($str);

            /*
            * Convert all tabs to spaces
            *
            * This prevents strings like this: ja	vascript
            * NOTE: we deal with spaces between characters later.
            * NOTE: preg_replace was found to be amazingly slow here on large blocks of data,
            * so we use str_replace.
            *
            */

            if (strpos($str, "\t") !== FALSE)
            {
                $str = str_replace("\t", ' ', $str);
            }

            /*
            * Capture converted string for later comparison
            */
            $converted_string = $str;

            /*
            * Not Allowed Under Any Conditions
            */

            foreach ($this->never_allowed_str as $key => $val)
            {
                $str = str_replace($key, $val, $str);
            }

            foreach ($this->never_allowed_regex as $key => $val)
            {
                $str = preg_replace("#".$key."#i", $val, $str);
            }

            /*
            * Makes PHP tags safe
            *
            *  Note: XML tags are inadvertently replaced too:
            *
            *	<?xml
            *
            * But it doesn't seem to pose a problem.
            *
            */
            if ($is_image === TRUE)
            {
                // Images have a tendency to have the PHP short opening and closing tags every so often
                // so we skip those and only do the long opening tags.
                $str = str_replace(array('<?php', '<?PHP'),  array('&lt;?php', '&lt;?PHP'), $str);
            }
            else
            {
                $str = str_replace(array('<?php', '<?PHP', '<?', '?'.'>'),  array('&lt;?php', '&lt;?PHP', '&lt;?', '?&gt;'), $str);
            }

            /*
            * Compact any exploded words
            *
            * This corrects words like:  j a v a s c r i p t
            * These words are compacted back to their correct state.
            *
            */
            $words = array('javascript', 'expression', 'vbscript', 'script', 'applet', 'alert', 'document', 'write', 'cookie', 'window');
            foreach ($words as $word)
            {
                $temp = '';

                for ($i = 0, $wordlen = strlen($word); $i < $wordlen; $i++)
                {
                    $temp .= substr($word, $i, 1)."\s*";
                }

                // We only want to do this when it is followed by a non-word character
                // That way valid stuff like "dealer to" does not become "dealerto"
                $str = preg_replace_callback('#('.substr($temp, 0, -3).')(\W)#is', array($this, '_compact_exploded_words'), $str);
            }

            /*
            * Remove disallowed Javascript in links or img tags
            * We used to do some version comparisons and use of stripos for PHP5, but it is dog slow compared
            * to these simplified non-capturing preg_match(), especially if the pattern exists in the string
            */
            do
            {
                $original = $str;

                if (preg_match("/<a/i", $str))
                {
                    $str = preg_replace_callback("#<a\s+([^>]*?)(>|$)#si", array($this, '_js_link_removal'), $str);
                }

                if (preg_match("/<img/i", $str))
                {
                    $str = preg_replace_callback("#<img\s+([^>]*?)(\s?/?>|$)#si", array($this, '_js_img_removal'), $str);
                }

                if (preg_match("/script/i", $str) OR preg_match("/xss/i", $str))
                {
                    $str = preg_replace("#<(/*)(script|xss)(.*?)\>#si", '[removed]', $str);
                }
            }
            while($original != $str);

            unset($original);

            /*
            * Remove JavaScript Event Handlers
            *
            * Note: This code is a little blunt.  It removes
            * the event handler and anything up to the closing >,
            * but it's unlikely to be a problem.
            *
            */
            $event_handlers = array('[^a-z_\-]on\w*','xmlns');

            if ($is_image === TRUE)
            {
                /*
                * Adobe Photoshop puts XML metadata into JFIF images, including namespacing,
                * so we have to allow this for images. -Paul
                */
                unset($event_handlers[array_search('xmlns', $event_handlers)]);
            }

            $str = preg_replace("#<([^><]+?)(".implode('|', $event_handlers).")(\s*=\s*[^><]*)([><]*)#i", "<\\1\\4", $str);

            /*
            * Sanitize naughty HTML elements
            *
            * If a tag containing any of the words in the list
            * below is found, the tag gets converted to entities.
            *
            * So this: <blink>
            * Becomes: &lt;blink&gt;
            *
            */
            $naughty = 'alert|applet|audio|basefont|base|behavior|bgsound|blink|body|embed|expression|form|frameset|frame|head|html|ilayer|iframe|input|isindex|layer|link|meta|object|plaintext|style|script|textarea|title|video|xml|xss';
            $str = preg_replace_callback('#<(/*\s*)('.$naughty.')([^><]*)([><]*)#is', array($this, '_sanitize_naughty_html'), $str);

            /*
            * Sanitize naughty scripting elements
            *
            * Similar to above, only instead of looking for
            * tags it looks for PHP and JavaScript commands
            * that are disallowed.  Rather than removing the
            * code, it simply converts the parenthesis to entities
            * rendering the code un-executable.
            *
            * For example:	eval('some code')
            * Becomes:		eval&#40;'some code'&#41;
            *
            */
            $str = preg_replace('#(alert|cmd|passthru|eval|exec|expression|system|fopen|fsockopen|file|file_get_contents|readfile|unlink)(\s*)\((.*?)\)#si', "\\1\\2&#40;\\3&#41;", $str);

            /*
            * Final clean up
            *
            * This adds a bit of extra precaution in case
            * something got through the above filters
            *
            */
            foreach ($this->never_allowed_str as $key => $val)
            {
                $str = str_replace($key, $val, $str);
            }

            foreach ($this->never_allowed_regex as $key => $val)
            {
                $str = preg_replace("#".$key."#i", $val, $str);
            }

            /*
            *  Images are Handled in a Special Way
            *  - Essentially, we want to know that after all of the character conversion is done whether
            *  any unwanted, likely XSS, code was found.  If not, we return TRUE, as the image is clean.
            *  However, if the string post-conversion does not matched the string post-removal of XSS,
            *  then it fails, as there was unwanted XSS code found and removed/changed during processing.
            */

            if ($is_image === TRUE)
            {
                if ($str == $converted_string)
                {
                    return TRUE;
                }
                else
                {
                    return FALSE;
                }
            }

            return $str;
        }

        public function xss_hash()
        {
            if ($this->xss_hash == '')
            {
                if (phpversion() >= 4.2)
                    mt_srand();
                else
                    mt_srand(hexdec(substr(md5(microtime()), -8)) & 0x7fffffff);

                $this->xss_hash = md5(time() + mt_rand(0, 1999999999));
            }

            return $this->xss_hash;
        }

        private function _remove_invisible_characters($str)
        {
            static $non_displayables;

            if (!isset($non_displayables))
            {
                // every control character except newline (dec 10), carriage return (dec 13), and horizontal tab (dec 09),
                $non_displayables = array(
                                            '/%0[0-8bcef]/',			// url encoded 00-08, 11, 12, 14, 15
                                            '/%1[0-9a-f]/',				// url encoded 16-31
                                            '/[\x00-\x08]/',			// 00-08
                                            '/\x0b/', '/\x0c/',			// 11, 12
                                            '/[\x0e-\x1f]/'				// 14-31
                                        );
            }

            do
            {
                $cleaned = $str;
                $str = preg_replace($non_displayables, '', $str);
            }
            while ($cleaned != $str);

            return $str;
        }

        private function _compact_exploded_words($matches)
        {
            return preg_replace('/\s+/s', '', $matches[1]).$matches[2];
        }

        private function _sanitize_naughty_html($matches)
        {
            // encode opening brace
            $str = '&lt;'.$matches[1].$matches[2].$matches[3];

            // encode captured opening or closing brace to prevent recursive vectors
            $str .= str_replace(array('>', '<'), array('&gt;', '&lt;'), $matches[4]);

            return $str;
        }

        private function _js_link_removal($match)
        {
            $attributes = $this->_filter_attributes(str_replace(array('<', '>'), '', $match[1]));
            return str_replace($match[1], preg_replace("#href=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\s*,)#si", "", $attributes), $match[0]);
        }

        private function _js_img_removal($match)
        {
            $attributes = $this->_filter_attributes(str_replace(array('<', '>'), '', $match[1]));
            return str_replace($match[1], preg_replace("#src=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\s*,)#si", "", $attributes), $match[0]);
        }

        private function _convert_attribute($match)
        {
            return str_replace(array('>', '<', '\\'), array('&gt;', '&lt;', '\\\\'), $match[0]);
        }

        private function _html_entity_decode_callback($match)
        {
            return $this->_html_entity_decode($match[0], strtoupper($this->charset));
        }

        private function _html_entity_decode($str, $charset='UTF-8')
        {
            if (stristr($str, '&') === FALSE) return $str;

            // The reason we are not using html_entity_decode() by itself is because
            // while it is not technically correct to leave out the semicolon
            // at the end of an entity most browsers will still interpret the entity
            // correctly.  html_entity_decode() does not convert entities without
            // semicolons, so we are left with our own little solution here. Bummer.

            if (function_exists('html_entity_decode') && (strtolower($charset) != 'utf-8' OR version_compare(phpversion(), '5.0.0', '>=')))
            {
                $str = html_entity_decode($str, ENT_COMPAT, $charset);
                $str = preg_replace('~&#x(0*[0-9a-f]{2,5})~ei', 'chr(hexdec("\\1"))', $str);
                return preg_replace('~&#([0-9]{2,4})~e', 'chr(\\1)', $str);
            }

            // Numeric Entities
            $str = preg_replace('~&#x(0*[0-9a-f]{2,5});{0,1}~ei', 'chr(hexdec("\\1"))', $str);
            $str = preg_replace('~&#([0-9]{2,4});{0,1}~e', 'chr(\\1)', $str);

            // Literal Entities - Slightly slow so we do another check
            if (stristr($str, '&') === FALSE)
            {
                $str = strtr($str, array_flip(get_html_translation_table(HTML_ENTITIES)));
            }

            return $str;
        }

        private function _filter_attributes($str)
        {
            $out = '';

            if (preg_match_all('#\s*[a-z\-]+\s*=\s*(\042|\047)([^\\1]*?)\\1#is', $str, $matches))
            {
                foreach ($matches[0] as $match)
                {
                    $out .= preg_replace("#/\*.*?\*/#s", '', $match);
                }
            }

            return $out;
        }
    };
?>