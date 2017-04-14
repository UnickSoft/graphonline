<?php

    /**
     * Обработка текста перед сохранением. Действия:
     *
     * 1) Преобразовать все внешние img ссылки во внутренние (соответственно скопировав все изображения на сервер)
     * 2) Удалить лишний мусор, который добавляет CKEditor (например при проверке грамматики).
     *
     * @author GYL
     */
    function CKEditor4PreSave($text, $uploadImgs = true, &$uncopiedImgs = array(), $serverName = NULL) 
    {
        global $g_config;

        // когда включена проверка орфографии ckeditor добавляет в html много мусора (лишние спаны). Эта штука его убирает.
        $text = preg_replace('/<span data-scayt_word="[^"]+" data-scaytid="[0-9]*">([^<]+)<\/span>/', '$1', $text);
        $text = preg_replace('/<span data-scaytid="[0-9]*" data-scayt_word="[^"]+">([^<]+)<\/span>/', '$1', $text);

        if (empty($serverName) && isset($_SERVER['SERVER_NAME'])) // на всякий случай преобразуем все ссылки вида http://наш_сайт/img/1.png в /img/1.png
        {
            $serverName = $_SERVER['SERVER_NAME'];
        }
        else
        {
            trigger_error("Invalid server name", E_USER_ERROR);
        }
        
        require_once BASEPATH . 'lib/simple_html_dom.php';
                                               
        $html = str_get_html($text);

        if ($html == NULL) return "";

        foreach ($html->find("img") as $img)
        {
            $img->removeAttribute("data-cke-saved-src");

            $src    = $img->src;
            $alt    = $img->alt;
            $style  = $img->style;

            $parsed = parse_url($src);
            $params = array();

            if (isset($parsed['query']))
            {
                foreach (explode('&', $parsed['query']) as $elem)
                {
                    if (strpos($elem, '=') !== false)
                    {
                        $elem = explode('=', $elem);
                        $params[$elem[0]] = isset($elem[1]) ? $elem[1] : NULL;
                    }
                }
            }
            $isLocal = empty($parsed["host"]) || (!empty($parsed["host"]) && $parsed["host"] == $serverName); // если нет имени сервера или оно равно имени нашего сервера
                            
            if ($isLocal && strpos($parsed["path"], "/upl/ckeditor_files/") === 0) // http://oursite.ru/upl/ckeditor_files/abc.jpg -> /upl/ckeditor_files/abc.jpg
            {
                $src = "/upl/ckeditor_files/" . basename($src);
            }
            else if ($isLocal && !empty($params["file"]) && strpos($parsed["path"], "/dev/ckeditor_preview/") === 0) // http://oursite.ru/dev/ckeditor_preview?file=abc.jpg -> /upl/ckeditor_files/abc.jpg
            {
                $src = "/upl/ckeditor_files/" . $params["file"];
            }
            else if ($isLocal && !empty($params["file"]) && strpos($params["path"], "dev/ckeditor_preview") === 0) // http://oursite.ru/?q=dev/ckeditor_preview?file=abc.jpg -> /upl/ckeditor_files/abc.jpg
            {
                $src = "/upl/ckeditor_files/" . $params["file"];
            }
            else if ($uploadImgs && pathinfo($src, PATHINFO_EXTENSION) == "webp" && !function_exists("imagecreatefromwebp")) // small hack
            {
                // do nothing
            }
            else if ($uploadImgs)
            {
                $info = @getimagesize($src);
                $ext  = @image_type_to_extension($info[2], false);
                if (empty($ext)) $ext = @pathinfo(@basename($src), PATHINFO_EXTENSION);
                
                if (!empty($ext))
                {
                    $ext  = strtolower($ext);
                    $name = md5(uniqid(mt_rand())) . "." . $ext;
                    $path = BASEPATH . 'upl/ckeditor_files/' . $name;
                    FileSys::MakeDir(BASEPATH . 'upl/ckeditor_files/');
                   
                    //xmp(get_loaded_extensions());

                    if (copy($src, $path))
                    {
                        // Уменьшаем размер файла путем ресайза картинки
                        $wImg = WideImage::load($path);
                        $wImg->resizeDown($g_config['ckeditor4']['resize_down_width'], 
                                          $g_config['ckeditor4']['resize_down_height'])->saveToFile($path);
                       
                        $src = '/upl/ckeditor_files/' . $name;
                    }
                    else
                    {
                        $uncopiedImgs[] = $src;
                    }
                }
                else
                {
                    $uncopiedImgs[] = $src;
                }
            }
            
            $img->src = $src;
        }
        return $html->save();
    }
?>
