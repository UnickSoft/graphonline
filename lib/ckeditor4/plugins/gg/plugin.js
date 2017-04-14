//Google map plugin by zmmaj from zmajsoft-team
//blah... version 2.
//problems? write to zmajsoft@zmajsoft.com

// Register a new CKEditor plugin.
// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.resourceManager.html#add
CKEDITOR.plugins.add( 'gg',
{
	// The plugin initialization logic goes inside this method.
	// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.pluginDefinition.html#init
	init: function( editor )
	{
		// Create an editor command that stores the dialog initialization command.
		// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.command.html
		// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialogCommand.html
		editor.addCommand( 'simpleLinkDialog', new CKEDITOR.dialogCommand( 'simpleLinkDialog' ) );

		// Create a toolbar button that executes the plugin command defined above.
		// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.html#addButton
		editor.ui.addButton( 'gg',
		{
			// Toolbar button tooltip.
			label: 'Insert a ZS Google map',
			// Reference to the plugin command name.
			command: 'simpleLinkDialog',
			// Button's icon file path.
			icon: this.path + 'images/gg.png'
		} );

		// Add a new dialog window definition containing all UI elements and listeners.
		// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.html#.add
		// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.dialogDefinition.html
		CKEDITOR.dialog.add( 'simpleLinkDialog', function( editor )
		{
			return {
				// Basic properties of the dialog window: title, minimum size.
				// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.dialogDefinition.html
				title : 'ZmajSoft Google Map',
				minWidth : 400,
				minHeight : 200,
				// Dialog window contents.
				// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.definition.content.html
				contents :
				[
					{
						// Definition of the Settings dialog window tab (page) with its id, label and contents.
						// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.contentDefinition.html
						id : 'general',
						label : 'Settings',
						elements :
						[
							// Dialog window UI element: HTML code field.
							// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.dialog.html.html
							{
								type : 'html',
								// HTML code to be shown inside the field.
								// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.dialog.html.html#constructor
								html : 'This dialog window lets you create and embed into text simple Google Map picture. </br> click <a href="http://www.mapcoordinates.net/en" target="_blank"> -->HERE<--</a> to find Latitude/Longitude.'
							},
							// Dialog window UI element: a text input field for the Latitude.
							// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.dialog.textInput.html
							{
								type : 'text',
								id : 'lat',
								label : 'Latitude',
								validate : CKEDITOR.dialog.validate.notEmpty( 'The link must have LATITUDE.' ),
								required : true,
								commit : function( data )
								{
									data.lat = this.getValue();
								}
							},
                   // Again same thing, this time for Longitude
						{
								type : 'text',
								id : 'lon',
								label : 'Longitude ',
								validate : CKEDITOR.dialog.validate.notEmpty( 'The link must have a LONGITUDE.' ),
								required : true,
								commit : function( data )
								{
									data.lon = this.getValue();
								}
							},
						{
								type : 'text',
								id : 'hor',
								label : 'Map Horizontal size in px (default=512 max=640)',
								validate : CKEDITOR.dialog.validate.notEmpty( 'The link must have a horizontal size.' ),
								required : true,
								commit : function( data )
								{
									data.hor = this.getValue();
								}
							},
						{
								type : 'text',
								id : 'ver',
								label : 'Map vertical size in px (default=512 max=640)',
								validate : CKEDITOR.dialog.validate.notEmpty( 'The link must have a vertical size.' ),
								required : true,
								commit : function( data )
								{
									data.ver= this.getValue();
								}
							},
							// Dialog window UI element: a selection field with link styles.
							// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.dialog.select.html
							{
								type : 'select',
								id : 'style',
								label : 'map type (default=roadmap)',
								// Items that will appear inside the selection field, in pairs of displayed text and value.
								// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.dialog.select.html#constructor
								items :
								[
									[ 'roadmap', 'r' ],
									[ 'satellite', 's' ],
									[ 'hybrid', 'h' ],
                             [ 'terrain', 't' ]
								],
								commit : function( data )
								{
									data.style = this.getValue();
								}
							},

							{
								type : 'select',
								id : 'zoom',
								label : 'Zoom Map (default=10)',
								// Items that will appear inside the selection field, in pairs of displayed text and value.
								// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.dialog.select.html#constructor
								items :
								[
									[ '<none>', '10' ],[ '0', '0' ],[ '1', '1' ], ['2', '2' ], [ '3', '3' ], [ '4', '4' ], [ '5', '5' ], [ '6', '6' ],
                             [ '7', '7' ], [ '8', '8' ], [ '9', '9' ], [ '10', '10' ], [ '11', '11' ], [ '12', '12' ], [ '13', '13' ], [ '14', '14' ],
                             [ '15', '15' ], [ '16', '16' ], [ '17', '17' ], [ '18', '18' ], [ '19', '19' ], [ '20', '20' ], [ '21', '21' ]
								],
								commit : function( data )
								{
									data.zoom = this.getValue();
								}
							},

		                 // Dialog window UI element: HTML code field.
							// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.dialog.html.html
							{
								type : 'html',
								// HTML code to be shown inside the field.
								// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.dialog.html.html#constructor
								html : 'If you have problems Email to zmajsoft@zmajsoft.com </br> <a href="www.zmajsoft.com" target="_blank">zmmaj</a> from zmajSoft-team'
							}
						]
					}
				],
				onOk : function()
				{
					// Create a link element and an object that will store the data entered in the dialog window.
					// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dom.document.html#createElement
					var dialog = this,
						data = {},
						link = editor.document.createElement( 'a' );
					// Populate the data object with data entered in the dialog window.
					// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.html#commitContent
					this.commitContent( data );

					// Set the URL (href attribute) of the link element.
					// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dom.element.html#setAttribute
				//	link.setAttribute( 'href', data.url );
var tip="roadmap";
	 switch( data.style )
					{
						case 'r' :
							tip='roadmap';
						break;
						case 's' :
							tip='satellite';
						break;
						case 'h' :
							tip='hybrid';
						break;
					case 't' :
							tip='terrain';
						break;
					}

					// Insert the link element into the current cursor position in the editor.
					// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.editor.html#insertElement
					editor.insertHtml('<img src="http://maps.googleapis.com/maps/api/staticmap?zoom='+data.zoom+'&size='+data.hor+'x'+data.ver+'&maptype='+tip+'&markers=color:red%7Ccolor:red%7Clabel:C%7C'+data.lat+','+data.lon+'&sensor=false"/>');
				}
			};
		} );
	}
} );
