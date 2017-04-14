    $(document).ready(function()
    {
        if(typeof CKEDITOR != 'undefined')
        {
            CKEDITOR.disableAutoInline = true;

            $(".js-ckeditor4").each(function()
            {
                $(this).attr("contentEditable", 'true'); // иначе панелька будет в режиме readonly        
                var config = 
                {
                    scayt_autoStartup:    true, // включаем проверку орфографии по умолчанию                                                                                                                                          
                    autoGrow_onStartup:   true, // Whether to have the auto grow happen on editor creation.                                                                                                                    
                    filebrowserUploadUrl: "/?q=admin/ckeditor4_uploader", // The location of the script that handles file uploads. If set, the Upload tab will appear in the Link, Image, and Flash dialog windows.
                
                    readOnly: false,
                };
                if (typeof g_ckeditor4_contentCss !== "undefined" && g_ckeditor4_contentCss != "")
                {
                    config.contentsCss = g_ckeditor4_contentCss; // Подменяем css файл чтобы всё было в стилистике сайта
                }
                if ($(this).attr("mode") == "short")
                {
                    config.toolbarGroups = 
                    [
                        { name: 'clipboard',   groups: [ 'undo' ] },
                        { name: 'basicstyles', groups: [ 'basicstyles' ] },
                        '/',
                        { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
                        { name: 'links'  },
                    ];
                }
                else
                {
                    config.toolbarGroups = 
                    [
                        { name: 'document',    groups: [ 'mode' ] },
                        '/',
                        { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
                        { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
                        
                        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                        '/',
                        { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
                        
                        { name: 'links'  },
                        { name: 'insert' },
                        '/',                    
                        { name: 'styles' },
                        { name: 'colors' },
                        
                        { name: 'others' },
                    ];
                }
                var id = $(this).attr("id");
                if (!CKEDITOR.dom.element.get(id).getEditor())
                {
                    CKEDITOR.replace(id, config);
                }
            });
        }
    });
