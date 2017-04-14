<?php

    /**
     * Валидатор html кода
     *
     * Сливает head-ы читит плохие символы и немножко валидирует код
     *
     * @author Zmi
     */
    class HtmlValidate
    {
        private $html;

        public function __construct($html)
        {
            $this->html = $this->HeadBodyMerge($html);
        }

        public function Get()
        {
            return $this->html;
        }

        /**
         * Убирает вложенные head-ы
         */
        private function DeleteInnerHtml($html)
        {
            preg_match('~<head(.*?)>~is', $html, $m);

            if (!isset($m[0]))
            {
                return $html;
            }

            $headAttrs = isset($m[1]) ? $m[1] : ''; // Атрибуты главного head-а если были
            $html      = $m[0] === '<head>' ? $html : str_ireplace($m[0], '<head>', $html); // Заменяем первый head с атрибутами на обычный что бы проще было искать

            do
            {
                $open = stripos($html, '<head>') + strlen('<head>');
                $end  = stripos($html, '</head>', $open); // Ищем где он закрывается
                $head = substr($html, $open, $end - $open + strlen('</head>')); // Берём этот подконтент

                // Есть ли в этом контенте подхеад?
                $open2 = strripos($head, '<head>');
                $end2  = $open2 + strlen('<head>');
                if ($open2 !== false) //  Если есть то он уже в хеаде, потому убираем его
                {
                    $headWithoutSub = substr($head, 0, $open2) . // От начала head до того где в нём нашли вложеный head
                                      substr($head, $end2, strlen($head) - $end2 - strlen('</head>'));
                    $html = str_ireplace($head, $headWithoutSub, $html);
                }
            } while ($open2 !== false); // Если в контенте все еще есть открывающийся head

            return _StrReplaceFirst('<head>', "<head{$headAttrs}>", $html);
        }

        /**
         * Сливает несколько разделов head в 1
         */
        private function HeadBodyMerge($html)
        {
            $html = $this->DeleteInnerHtml($html);

            preg_match_all('~<head(.*?)>(.*?)</head>~is', $html, $m);
            // Если <head>...</head> больше чем 1 тогда имеет смысл их объединять
            if (count($m[0]) > 1)
            {
                // Собираем общий head
                $head = '<head' . $m[1][0] . '>' . implode('', array_filter(array_unique($m[2]))) . '</head>';

                // Заменяем все <head>...</head> на 1 слитый
                $html = str_replace($m[0][0], $head, $html);
                $html = str_replace(array_splice($m[0], 1), '', $html);
            }
            return $html;
        }
    };
?>