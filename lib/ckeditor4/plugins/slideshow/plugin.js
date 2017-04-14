/**
 * Plugin inserting Slide Shows elements into CKEditor editing area.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 *
 * Copyright (c) 2003-2013, Cricri042. All rights reserved.
 * Targeted for "ad-gallery" JavaScript : http://adgallery.codeplex.com/
 * And "Fancybox" : http://fancyapps.com/fancybox/
 *
 */

// Register the plugin within the editor.
( function() {

CKEDITOR.plugins.add( 'slideshow', {
	// Translations, available at the end of this file, without extra requests
	//lang : [ 'en', 'fr' ],
	lang: 'en,fr,ru',

	getSlideShowDialogCss : function()
	{
		return 'img.cke_slideShow' +
				'{' +
					'background-image: url(' + CKEDITOR.getUrl( this.path + 'icons/placeholder.png' ) + ');' +
					'background-position: center center;' +
					'background-repeat: no-repeat;' +
					'background-color:Azure;'+
					'border: 1px solid #a9a9a9;' +
					'width: 100px;' +
					'height:100px;' +
					'margin: 5px;';
				'}'
	},

	// Register the icons.
	icons: 'slideshow',

	onLoad : function()
	{
		// v4
		if (CKEDITOR.addCss)
			CKEDITOR.addCss( this.getSlideShowDialogCss() );

	},

	// The plugin initialization logic goes inside this method.
	init: function( editor ) {
		var lang = editor.lang.slideshow;

		// Check for CKEditor 3.5
		if (typeof editor.element.data == 'undefined')
		{
			alert('The "Slide Show" plugin requires CKEditor 3.5 or newer');
			return;
		}

		allowed = '';
		allowed += ' html head title; style [media,type]; body (*)[id]; meta link [*]',
		allowed += '; img[*]{*}(*)';
		allowed += '; div[*]{*}(*)';
		allowed += '; script[*]{*}(*)';
		allowed += '; ul[*]{*}(*)';
		allowed += '; li[*]{*}(*)';

		// Register the command.
		editor.addCommand( 'slideshow', new CKEDITOR.dialogCommand( 'slideshowDialog', {
			allowedContent: allowed,
			requires: ['fakeobjects'],
		} ) );

		// Create a toolbar button that executes the above command.
		editor.ui.addButton( 'Slideshow', {
			// The text part of the button (if available) and tooptip.
			label: lang.insertSlideShow,
			command: 'slideshow',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'insert'
		});

		editor.on( 'load', function( evt ) {
		});

		editor.on( 'doubleclick', function( evt )
				{
					var element = evt.data.element;
					if ( element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'slideShow' )
						evt.data.dialog = 'slideshowDialog';
				});

		editor.on( 'instanceReady', function() {
			//console.log('START --------------------------');
		    //console.log( editor.filter.allowedContent );
			//console.log('END ----------------------------');
		} );
		CKEDITOR.on('instanceReady', function(event) {
			  event.editor.on('dialogShow', function(dialogShowEvent) {
			    if(CKEDITOR.env.ie) {
			      $(dialogShowEvent.data._.element.$).find('a[href*="void(0)"]').removeAttr('href');
			    }
			  });
			});

		if ( editor.contextMenu ) {
			editor.addMenuGroup( 'slideshowGroup' );
			editor.addMenuItem( 'slideshowItem', {
				label: lang.editSlideShow,
				icon: this.path + 'icons/slideshow.png',
				command: 'slideshow',
				group: 'slideshowGroup'
			});

			editor.contextMenu.addListener( function( element, selection )
					{
				if ( element && element.is( 'img' ) && !element.isReadOnly()
						&& element.data( 'cke-real-element-type' ) == 'slideShow' ) {
				//if ( element && element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'slideShow' ) {
							editor.contextMenu.removeAll(); // this line removes all entries from the context menu
							return { slideshowItem : CKEDITOR.TRISTATE_OFF };
						} else {
							 return null;
						}
					});
		}

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add( 'slideshowDialog', this.path + 'dialogs/slideshow.min.js' );

		// v3
		if (editor.addCss)
			editor.addCss( this.getSlideShowDialogCss() );

		// Add special handling for these items
		CKEDITOR.dtd.$empty['cke:source']=1;
		CKEDITOR.dtd.$empty['source']=1;
		editor.lang.fakeobjects.slideShow = lang.fakeObject;

	}, // Init

	afterInit: function( editor )
	{
		var dataProcessor = editor.dataProcessor,
		htmlFilter = dataProcessor && dataProcessor.htmlFilter,
		dataFilter = dataProcessor && dataProcessor.dataFilter;

		if ( dataFilter ) {
			dataFilter.addRules({
				elements: {
					div : function( realElement )
					{
						if (realElement.attributes['class'] == 'slideshowPlugin') {
							//alert("dataFilter : " + realElement.attributes['class']);
							var fakeElement = editor.createFakeParserElement( realElement, 'cke_slideShow', 'slideShow', false ),
							fakeStyle = fakeElement.attributes.style || '';
							var imgSrc = CKEDITOR.getUrl('plugins/slideshow/icons/placeholder.png' );
							var foundOne = false;
							realElement.forEach( function( node ) {
								//console.log( "---------> " + node.name );

								if (node.name == 'img') {
									if (!foundOne) {
										//console.log( node );
										imgSrc = node.attributes.src;
										foundOne = true;
									}
								}
							} );
							fakeStyle = fakeElement.attributes.style = fakeStyle + ' background-image:url("' + imgSrc + '"); ';
							fakeStyle = fakeElement.attributes.style = fakeStyle + ' background-size:50%; ';
							fakeStyle = fakeElement.attributes.style = fakeStyle + ' display:block; ';
							//console.log( fakeStyle );

							return fakeElement;
						}
					}
				}
			}, 3);
		}
		if ( htmlFilter ) {
			htmlFilter.addRules({
				elements: {
					$ : function( realElement )
					{
					}
				}
			});
		}

	} // afterInit

});
	// v3
	if (CKEDITOR.skins)
	{
		en = { slideshow : en} ;
		fr = { slideshow : fr} ;
		ru = { slideshow : ru} ;
	}
// Translations
//CKEDITOR.plugins.setLang( 'slideshow', 'fr', fr );
//CKEDITOR.plugins.setLang( 'slideshow', 'en', en );

})();
