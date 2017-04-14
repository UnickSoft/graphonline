<?php

    // Required: anonymous function reference number as explained above.
    $funcNum = $_GET['CKEditorFuncNum'] ;
    // Optional: instance name (might be used to load a specific configuration file or anything else).
    $CKEditor = $_GET['CKEditor'] ;
    // Optional: might be used to provide localized messages.
    $langCode = $_GET['langCode'] ;
     
    // Check the $_FILES array and save the file. Assign the correct path to a variable ($url).
    $url = '';
    // Usually you will only assign something here if the file could not be uploaded.
    $message = '';


    //xmp($_FILES); exit(0);

    if (isset($_FILES) && isset($_FILES['upload']) && isset($_FILES['upload']['tmp_name']))
    {
        $err = true;
        if (is_uploaded_file(realpath($_FILES['upload']["tmp_name"])))
        {
            $e   = explode(".", $_FILES['upload']['name']);
            $end = end($e);
            $ext = strtolower($end);
            $string = md5(uniqid(mt_rand())) . "." . $ext;

            $subdir = "upl/ckeditor4_files/";
            FileSys::MakeDir(BASEPATH . $subdir);

            $path = BASEPATH . $subdir . $string;
            $link = Root($subdir . $string);


            $allowedTypes = array('bmp', 'gif', 'jpeg', 'jpe', 'jpg', 'png', 'tiff');

            if (!in_array($ext, $allowedTypes))
            {    
                $message = "Invalid file type";
            }
            else
            {
                move_uploaded_file($_FILES['upload']["tmp_name"], $path);
               
                if (is_file($path))
                {                        
                    $url = $link;
                    $err = false;
               
                    // Уменьшаем размер файла путем ресайза картинки
                    $wImg = WideImage::load($path);
                    if ($wImg->getWidth()  > $g_config['ckeditor4']['resize_down_width'] ||
                        $wImg->getHeight() > $g_config['ckeditor4']['resize_down_height']) // Если просто делать resizeDown то gif пересохранится и у него пропадет анимация
                    {
                        $wImg->resizeDown($g_config['ckeditor4']['resize_down_width'], 
                                          $g_config['ckeditor4']['resize_down_height'])->saveToFile($path);
                    }
                }
            }
        }
        if ($err)
        {
            $message = "Cant upload file " . (isset($_FILES['upload']['error']) ? ("(Error: " . $_FILES['upload']['error'] . ")") : "");
        }
    }

    echo "<script type='text/javascript'>" . (empty($message) ? "" : ("alert('" . $message . "'); ")) . "window.parent.CKEDITOR.tools.callFunction($funcNum, '$url', '$message');</script>";
    exit(0);

?>
