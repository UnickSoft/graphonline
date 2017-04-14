CKEDITOR.plugins.add('pbckcode', {
	icons: 'pbckcode',
	lang : ['fr', 'en'],
	init: function(editor) {
		// load JS file
		var head = document.getElementsByTagName('HEAD').item(0);
		var script= document.createElement("script");
		script.type = "text/javascript";
		script.src = CKEDITOR.plugins.getPath('pbckcode') + "dialogs/ace/ace.js";
		head.appendChild(script);

		editor.addCommand('pbckcodeCommand', new CKEDITOR.dialogCommand('pbckcodeDialog'));

		editor.ui.addButton('pbckcode', {
			label: editor.lang.pbckcode.title,
			command: 'pbckcodeCommand'
		});

		CKEDITOR.dialog.add('pbckcodeDialog', this.path + 'dialogs/pbckcode.js' );
	}
});
