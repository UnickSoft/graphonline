<?php

    require_once BASEPATH . 'lib/CI_Upload.php';


    /**
     * Класс для загрузки файлов и изображений
     *
     * @author Zmi and Guul
     */
    class Uploader extends CI_Upload
    {
        const FORM_LOAD = 'enctype="multipart/form-data" method="post"';

        protected $thumbPaths = array();


        public function Upload($field, $config = array())
        {
            global $g_config;

            $cfg = $g_config['uploader']['default_config'];
            foreach($config as $k => $v)
            {
                $cfg[$k] = $v;
            }

            FileSys::MakeDir($cfg['upload_path']);
            $this->initialize($cfg);

            $ret = $this->do_upload($field);
            $inf = $this->data();

            // Уменьшаем
            if ($ret && $inf['is_image'] && ($cfg['resize_down_width'] || $cfg['resize_down_height']))
            {
                $w = $cfg['resize_down_width'];
                $h = $cfg['resize_down_height'];
                $w = $w ? $w : null;
                $h = $h ? $h : null;

                if (($w && $inf['image_width']  > $w) ||
                    ($h && $inf['image_height'] > $h))
                {
                    $wImg = WideImage::load($inf['full_path']);
                    $wImg = $wImg->resizeDown($w, $h, 'inside', 'down');

                    if ($inf['image_type'] == "jpeg")
                    {
                        $wImg->saveToFile($inf['full_path'], 82); // в разы уменьшаем размер изображения / + без этого хака jpg изображение может не сохранится
                    }
                    else
                    {
                        $wImg->saveToFile($inf['full_path']);
                    }
                    $this->set_image_properties($this->upload_path.$this->file_name); // Обновляем данные аплоадера
                    $inf = $this->data();
                }
            }

            // Генерируем превьюшки
            if ($ret && $inf['is_image'] && is_array($cfg['thumbs']))
            {
                foreach ($cfg['thumbs'] as $v)
                {
                    $newDir = "";
                    if (!isset($v['path']))
                    {
                        $newDir = $cfg['upload_path'] . $v['width'] . '_' . $v['height'] . '/';
                    }
                    else
                    {
                        $newDir = $v['path'];
                    }

                    FileSys::MakeDir($newDir);
                    $image = WideImage::load($inf['full_path']);
                    $image->resize($v['width'], $v['height'])->saveToFile($newDir . $inf['file_name']);

                    $this->thumbPaths[] = $newDir . $inf['file_name'];
                }
            }

            return $ret;
        }

        public function HasUpload($field)
        {
            return isset($_FILES[$field]) && isset($_FILES[$field]["tmp_name"]) && $_FILES[$field]["tmp_name"];
        }

        public function Errors()
        {
            return $this->error_msg;
        }

        public function GetInf($par = NULL)
        {
            $inf = $this->data();
            if (is_null($par))
            {
                return $inf;
            }
            return isset($inf[$par]) ? $inf[$par] : NULL;
        }
    };
?>
