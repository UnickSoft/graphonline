/*
 Equation Editor Plugin for CKEditor v4
 Version 1.4

 This plugin allows equations to be created and edited from within CKEditor.
 For more information goto: http://www.codecogs.com/latex/integration/ckeditor_v4/install.php

 Copyright CodeCogs 2006-2013
 Written by Will Bateman.
*/
CKEDITOR.dialog.add( 'eqneditorDialog', function(editor)
{
	var http = ('https:' == document.location.protocol ? 'https://' : 'http://');

	return {
		title : editor.lang.eqneditor.title,
		minWidth : 550,
		minHeight : 380,
		resizable: CKEDITOR.DIALOG_RESIZE_NONE,
		contents : [
			{
				id : 'CCEquationEditor',
				label : 'EqnEditor',
				elements : [
	  			{
							type: 'html',
							html: '<div id="CCtoolbar"></div>',
							style: 'margin-top:-9px'
					},
					{
							type: 'html',
							html: '<label for="CClatex">Equation (LaTeX):</label>',
					},
					{
							type: 'html',
							html: '<textarea id="CClatex" rows="5"></textarea>',
							style:'border:1px solid #8fb6bd; width:540px; font-size:16px; padding:5px; background-color:#ffc',
					},
					{
						 	type: 'html',
							html: '<label for="CCequation">Preview:</label>'
					},
					{
							type :'html',
							html: '<div style="position:absolute; left:5px; bottom:0; z-index:999"><a href="http://www.codecogs.com" target="_blank"><img src="'+http+'codecogs.izyba.com/images/poweredbycodecogs.png" width="105" height="35" border="0" alt="Powered by CodeCogs" style="vertical-align:-4px"/></a> &nbsp; <a href="http://www.codecogs.com/latex/about.php" target="_blank">About</a> | <a href="http://www.codecogs.com/latex/popup.php" target="_blank">Install</a> | <a href="http://www.codecogs.com/pages/forums/forum_view.php?f=28" target="_blank">Forum</a> | <a href="http://www.codecogs.com" target="_blank">CodeCogs</a> &copy; 2007-2013</div><img id="CCequation" src="'+http+'www.codecogs.com/images/spacer.gif" />'
					}
				]
			}
		],

		onLoad : function() {
			EqEditor.embed('CCtoolbar','','efull');
 			EqEditor.add(new EqTextArea('CCequation', 'CClatex'),false);
		},

		onShow : function() {
			var dialog = this,
				  sel = editor.getSelection(),
				  image = sel.getStartElement().getAscendant('img',true);

			// has the users selected an equation. Make sure we have the image element, include itself
			if(image)
			{
				var sName = image.getAttribute('src').match( /(gif|svg)\.latex\?(.*)/ );
				if(sName!=null) EqEditor.getTextArea().setText(sName[2]);
				dialog.insertMode = true;
			}

			// set-up the field values based on selected or newly created image
			dialog.setupContent( dialog.image );
		},

		onOk : function() {
			var eqn = editor.document.createElement( 'img' );
			eqn.setAttribute( 'alt', EqEditor.getTextArea().getLaTeX());
			eqn.setAttribute( 'src', EqEditor.getTextArea().exportEquation('urlencoded'));
			editor.insertElement(eqn);
		}
	};
});
