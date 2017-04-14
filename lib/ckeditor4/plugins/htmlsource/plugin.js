
plugInName = 'htmlsource';

CKEDITOR.plugins.add(plugInName,
{  
  init: function (editor) {

    editor.addCommand('htmlDialog', new CKEDITOR.dialogCommand('htmlDialog'));
    editor.ui.addButton(plugInName, {
        label: 'Html Source',
        icon: 'http://www.example.com/images/btn_html.png',
        command: 'htmlDialog'
    });

    CKEDITOR.dialog.add('htmlDialog', function (editor) {
        return {
            title: 'Fuente Html',
            minWidth: 600,
            minHeight: 400,
            contents: [
                        {
                            id: 'general',
                            label: 'Settings',
                            elements:
                            [
                            // UI elements of the Settings tab.
                                {
                                type: 'textarea',
                                id: 'contents',
                                rows: 25,
                                onShow: function () {
                                    this.setValue(editor.container.$.innerHTML);

                                },
                                commit: function (data) {              //--I get only the body part in case I paste a complete html
                                    data.contents = this.getValue().replace(/^[\S\s]*<body[^>]*?>/i, "").replace(/<\/body[\S\s]*$/i, "");
                                }

                            }
                                ]
                        }
                    ],

            onOk: function () {
                var data = {};
                this.commitContent(data);
                $(editor.container.$).html(data.contents);
            },
            onCancel: function () {
                //  console.log('Cancel');
            }
        };
    });
}


});