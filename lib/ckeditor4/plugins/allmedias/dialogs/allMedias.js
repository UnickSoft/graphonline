/**
 * @license Copyright (c) 2003-2013, webmote - codeex.cn. All rights reserved.
 * For licensing, see http://codeex.cn/
 * 2013-2-18 v1.0
 */

(function() {
	// It is possible to set things in three different places.
	// 1. As attributes in the object tag.
	// 2. As param tags under the object tag.
	// 3. As attributes in the embed tag.
	// It is possible for a single attribute to be present in more than one place.
	// So let's define a mapping between a sementic attribute and its syntactic
	// equivalents.
	// Then we'll set and retrieve attribute values according to the mapping,
	// instead of having to check and set each syntactic attribute every time.
	//
	// Reference: http://kb.adobe.com/selfservice/viewContent.do?externalId=tn_12701
	var ATTRTYPE_OBJECT = 1,
		ATTRTYPE_PARAM = 2,
		ATTRTYPE_EMBED = 4;

		// object 与界面映射词典
	var attributesMap = {
		allowScriptAccess: [ {type: ATTRTYPE_PARAM, name: 'allowScriptAccess'}, {type: ATTRTYPE_EMBED, name: 'allowScriptAccess'}],
		allowFullScreen: [ {type: ATTRTYPE_PARAM, name: 'allowFullScreen'}, {type: ATTRTYPE_EMBED, name: 'allowFullScreen'}],
		align: [ {type: ATTRTYPE_OBJECT, name: 'align'}],
		bgcolor: [ {type: ATTRTYPE_PARAM, name: 'bgcolor'}, {type: ATTRTYPE_EMBED, name: 'bgcolor'}],
		base: [ {type: ATTRTYPE_PARAM, name: 'base'}, {type: ATTRTYPE_EMBED, name: 'base'}],
		'class': [ {type: ATTRTYPE_OBJECT, name: 'class'}, {type: ATTRTYPE_EMBED, name: 'class'}],
		classid: [ {type: ATTRTYPE_OBJECT, name: 'classid'}],
		codebase: [ {type: ATTRTYPE_OBJECT, name: 'codebase'}],
		flashvars: [ {type: ATTRTYPE_PARAM, name: 'flashvars'}, {type: ATTRTYPE_EMBED, name: 'flashvars'}], //add by webmote
		height: [ {type: ATTRTYPE_OBJECT, name: 'height'}, {type: ATTRTYPE_EMBED, name: 'height'}],
		hSpace: [ {type: ATTRTYPE_OBJECT, name: 'hSpace'}, {type: ATTRTYPE_EMBED, name: 'hSpace'}],
		id: [ {type: ATTRTYPE_OBJECT, name: 'id'}],
		loop: [ {type: ATTRTYPE_PARAM, name: 'loop'}, {type: ATTRTYPE_EMBED, name: 'loop'}],
		mtype: [ {type: ATTRTYPE_OBJECT, name: 'mtype'}, {type: ATTRTYPE_EMBED, name: 'mtype'}],	//add by webmote
		menu: [ {type: ATTRTYPE_PARAM, name: 'menu'}, {type: ATTRTYPE_EMBED, name: 'menu'}],
		name: [ {type: ATTRTYPE_EMBED, name: 'name'}],
		pluginspage: [ {type: ATTRTYPE_EMBED, name: 'pluginspage'}],
		play: [ {type: ATTRTYPE_PARAM, name: 'play'}, {type: ATTRTYPE_EMBED, name: 'autostart'}],
		quality: [ {type: ATTRTYPE_PARAM, name: 'quality'}, {type: ATTRTYPE_EMBED, name: 'quality'}],
		src: [ {type: ATTRTYPE_PARAM, name: 'movie'}, {type: ATTRTYPE_EMBED, name: 'rsrc'}, {type: ATTRTYPE_OBJECT, name: 'data'}],
		scale: [ {type: ATTRTYPE_PARAM, name: 'scale'}, {type: ATTRTYPE_EMBED, name: 'scale'}],
		style: [ {type: ATTRTYPE_OBJECT, name: 'style'}, {type: ATTRTYPE_EMBED, name: 'style'}],
		salign: [ {type: ATTRTYPE_PARAM, name: 'salign'}, {type: ATTRTYPE_EMBED, name: 'salign'}],
		seamlesstabbing: [ {type: ATTRTYPE_PARAM, name: 'seamlesstabbing'}, {type: ATTRTYPE_EMBED, name: 'seamlesstabbing'}],
		type: [ {type: ATTRTYPE_OBJECT, name: 'type'},{type: ATTRTYPE_EMBED, name: 'type'}],
		vSpace: [ {type: ATTRTYPE_OBJECT, name: 'vSpace'}, {type: ATTRTYPE_EMBED, name: 'vSpace'}],
		width: [ {type: ATTRTYPE_OBJECT, name: 'width'}, {type: ATTRTYPE_EMBED, name: 'width'}],
		wmode: [ {type: ATTRTYPE_PARAM, name: 'wmode'}, {type: ATTRTYPE_EMBED, name: 'wmode'}],
	};
	//赋默认值
	attributesMap[ 'mtype' ][ 0 ][ 'default' ] = attributesMap[ 'mtype' ][ 1 ][ 'default' ] = "allMedias";
	var names = [ 'allowFullScreen', 'play', 'loop', 'menu' ];
	for ( i = 0; i < names.length; i++ )
		attributesMap[ names[ i ] ][ 0 ][ 'default' ] = attributesMap[ names[ i ] ][ 1 ][ 'default' ] = true;
		attributesMap['seamlesstabbing'][0]['default'] = attributesMap['seamlesstabbing'][ 1 ][ 'default' ] = true;

	var mediaTypes = [  //video/x-ms-asf-plugin   application/x-mplayer2
			{player:'wmpvideo',idx:0,
				types: ['video/x-ms-asf-plugin','video/x-ms-asf-plugin','video/x-ms-asf-plugin','video/x-ms-asf-plugin'],
				 classid: 'clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6',
				 codebase: 'http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701',
				 pluginspage: 'http://activex.microsoft.com/',
				 exts:['wmv','mpeg','asf','avi']
			},
			{player:'wmpaudio',idx:0,
			     types: ['video/x-ms-asf-plugin','video/x-ms-asf-plugin','video/x-ms-asf-plugin','video/x-ms-asf-plugin','video/x-ms-asf-plugin','video/x-ms-asf-plugin'],
				 classid: 'clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6',
				 codebase: 'http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701',
				 pluginspage: 'http://activex.microsoft.com/',
		       exts:['wma','m4a','wav','mpg','mid','mp3']
			},
		    {player:'rpvideo',idx:0,
		         types: ['audio/x-pn-realaudio-plugin','audio/x-pn-realaudio-plugin','audio/x-pn-realaudio-plugin'],
				 classid: 'clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA',
				 codebase: 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0',
				 pluginspage: 'http://download.macromedia.com',
		         exts:['rm','rmvb','ra']
			},
		    {player:'qmvideo',idx:0,types: ['video/quicktime'],
				 classid: 'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B',
				 codebase: 'http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0',
				 pluginspage: 'http://www.apple.com/qtactivex',
		         exts:['qt']
			},
			{player:'flashvideo',idx:0,types: ['application/x-shockwave-flash','application/x-shockwave-flash','application/x-shockwave-flash',			'application/x-shockwave-flash','application/x-shockwave-flash'],
				 classid: 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
				 codebase: 'http://download.macroallMedias.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0',
				 pluginspage: 'http://www.macroallMedias.com/go/getflashplayer',
				 src: 'plugins/allmedias/jwplayer.swf', //相对插件路径
		         exts:['flv','mov','mp4','m4v','f4v']
			},/*
			{player:'flashaudio',idx:0,types: ['application/x-shockwave-flash'],
				 classid: 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
				 codebase: 'http://download.macroallMedias.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0',
				 pluginspage: 'http://www.macroallMedias.com/go/getflashplayer',
				 src: 'plugins/allmedias/player.swf', //相对插件路径
		         exts:['mp3']
			},*/
			{player:'pdfReader',idx:0,types: ['application/pdf'],
				 classid: 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
				 codebase: 'http://download.macroallMedias.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0',
				 pluginspage: 'http://www.macroallMedias.com/go/getflashplayer',
		         exts:['pdf']
			},
	];
	function getUriExt(uri){
		if(!uri)return "";
		return uri.substring(uri.lastIndexOf(".") + 1, uri.length).toLowerCase();
	}
	function getMediaType(ext) {
		var i,
			k,
			mediaPlayer,
			mp;
		if(!ext){return mediaTypes[0];}
		for (i=0; i<mediaTypes.length; i++) {
			mediaPlayer = mediaTypes[i];
			//0-video 1-audio
			if (mediaPlayer) {
				for(k=0; k<mediaPlayer.exts.length; k++)
				{
					if(ext == mediaPlayer.exts[k]){
						mediaPlayer.idx = k;
						return mediaPlayer;
					}
				}
			}
		}
		return mediaTypes[0];
	}

	//var names = [ 'play', 'loop', 'menu', 'quality', 'scale', 'salign', 'wmode', 'bgcolor', 'base', 'flashvars', 'allowScriptAccess', 'allowFullScreen','seamlesstabbing' ];
	//for ( var i = 0; i < names.length; i++ )
	//	attributesMap[ names[ i ] ] = [ {
	//	type: ATTRTYPE_EMBED, name: names[ i ]
	//}, {
	//	type: ATTRTYPE_PARAM, name: names[ i ]
	//}];
	var defaultToPixel = CKEDITOR.tools.cssLength;

	function loadValue( objectNode, embedNode, paramMap ) {
		var attributes = attributesMap[ this.id ];
		if ( !attributes )
			return;

		var isCheckbox = ( this instanceof CKEDITOR.ui.dialog.checkbox );
		for ( var i = 0; i < attributes.length; i++ ) {
			var attrDef = attributes[ i ];
			switch ( attrDef.type ) {
				case ATTRTYPE_OBJECT:
					if ( !objectNode )
						continue;
					if ( objectNode.getAttribute( attrDef.name ) !== null ) {
						var value = objectNode.getAttribute( attrDef.name );
						if ( isCheckbox )
							this.setValue( value.toLowerCase() == 'true' );
						else
							this.setValue( value );
						return;
					} else if ( isCheckbox )
						this.setValue( !!attrDef[ 'default' ] );
					break;
				case ATTRTYPE_PARAM:
					if ( !objectNode )
						continue;
					if ( attrDef.name in paramMap ) {
						value = paramMap[ attrDef.name ];
						if ( isCheckbox )
							this.setValue( value.toLowerCase() == 'true' );
						else
							this.setValue( value );
						return;
					} else if ( isCheckbox )
						this.setValue( !!attrDef[ 'default' ] );
					break;
				case ATTRTYPE_EMBED:
					if ( !embedNode )
						continue;
					if ( embedNode.getAttribute( attrDef.name ) ) {
						value = embedNode.getAttribute( attrDef.name );
						if ( isCheckbox )
							this.setValue( value.toLowerCase() == 'true' );
						else
							this.setValue( value );
						return;
					} else if ( isCheckbox )
						this.setValue( !!attrDef[ 'default' ] );
			}
		}
	}

	function commitValue( objectNode, embedNode, paramMap ) {
		var attributes = attributesMap[ this.id ];
		if ( !attributes )
			return;

		var isRemove = ( this.getValue() === '' ),
			isCheckbox = ( this instanceof CKEDITOR.ui.dialog.checkbox );

		for ( var i = 0; i < attributes.length; i++ ) {
			var attrDef = attributes[ i ];
			switch ( attrDef.type ) {
				case ATTRTYPE_OBJECT:
					// Avoid applying the data attribute when not needed (#7733)
					if ( !objectNode || ( attrDef.name == 'data' && embedNode && !objectNode.hasAttribute( 'data' ) ) )
						continue;
					var value = this.getValue();
					if ( isRemove )
						objectNode.removeAttribute( attrDef.name );
					else
						objectNode.setAttribute( attrDef.name, value );
					break;
				case ATTRTYPE_PARAM:
					if ( !objectNode )
						continue;
					value = this.getValue();
					if ( isRemove ) {
						if ( attrDef.name in paramMap )
							paramMap[ attrDef.name ].remove();
					} else {
						if ( attrDef.name in paramMap )
							paramMap[ attrDef.name ].setAttribute( 'value', value );
						else {
							var param = CKEDITOR.dom.element.createFromHtml( '<cke:param></cke:param>', objectNode.getDocument() );
							param.setAttributes({ name: attrDef.name, value: value } );
							if ( objectNode.getChildCount() < 1 )
								param.appendTo( objectNode );
							else
								param.insertBefore( objectNode.getFirst() );
						}
					}
					break;
				case ATTRTYPE_EMBED:
					if ( !embedNode )
						continue;
					value = this.getValue();
					if ( isRemove )
						embedNode.removeAttribute( attrDef.name );
					else
						embedNode.setAttribute( attrDef.name, value );
			}
		}
	}

	CKEDITOR.dialog.add( 'allMedias', function( editor ) {
		//此处更改为仅支持embed标签，简单跨浏览器
		//var makeObjectTag = !editor.config.allMediasEmbedTagOnly,
		//	makeEmbedTag = editor.config.allMediasAddEmbedTag || editor.config.allMediasEmbedTagOnly;
		var makeObjectTag = false,
			makeEmbedTag = true;

		var previewPreloader,
			previewAreaHtml = '<div>' + CKEDITOR.tools.htmlEncode( editor.lang.common.preview ) + '<br>' +
			'<div id="cke_FlashPreviewLoader' + CKEDITOR.tools.getNextNumber() + '" style="display:none"><div class="loading">&nbsp;</div></div>' +
			'<div id="cke_FlashPreviewBox' + CKEDITOR.tools.getNextNumber() + '" class="FlashPreviewBox" style="width:100%;"></div></div>';

		return {
			title: editor.lang.allMedias.title,
			minWidth: 420,
			minHeight: 310,
			onShow: function() {
				// Clear previously saved elements.
				this.fakeImage = this.objectNode = this.embedNode = null;
				previewPreloader = new CKEDITOR.dom.element( 'embed', editor.document );

				// Try to detect any embed or object tag that has allMedias parameters.
				var fakeImage = this.getSelectedElement();
				if ( fakeImage && fakeImage.data( 'cke-real-element-type' ) && fakeImage.data( 'cke-real-element-type' ) == 'allMedias' ) {
					this.fakeImage = fakeImage;

					var realElement = editor.restoreRealElement( fakeImage ),
						objectNode = null,
						embedNode = null,
						paramMap = {};
					if ( realElement.getName() == 'cke:object' ) {
						objectNode = realElement;
						var embedList = objectNode.getElementsByTag( 'embed', 'cke' );
						if ( embedList.count() > 0 )
							embedNode = embedList.getItem( 0 );
						var paramList = objectNode.getElementsByTag( 'param', 'cke' );
						for ( var i = 0, length = paramList.count(); i < length; i++ ) {
							var item = paramList.getItem( i ),
								name = item.getAttribute( 'name' ),
								value = item.getAttribute( 'value' );
							paramMap[ name ] = value;
						}
					} else if ( realElement.getName() == 'cke:embed' )
						embedNode = realElement;

					this.objectNode = objectNode;
					this.embedNode = embedNode;

					this.setupContent( objectNode, embedNode, paramMap, fakeImage );
				}
			},
			onOk: function() {
				// If there's no selected object or embed, create one. Otherwise, reuse the
				// selected object and embed nodes.
				var objectNode = null,
					embedNode = null,
					paramMap = null,
					myExtPlayer;
				myExtPlayer =　getMediaType(getUriExt(this.getValueOf('info',　'src')));
				if ( !this.fakeImage ) {
					if ( makeObjectTag ) {
						objectNode = CKEDITOR.dom.element.createFromHtml( '<cke:object></cke:object>', editor.document );
						var attributes = {
								classid: myExtPlayer.classid,
								type: myExtPlayer.types[myExtPlayer.idx],
								mtype: 'allMedias',
								codebase: myExtPlayer.codebase
							};
						objectNode.setAttributes( attributes );
					}
					if ( makeEmbedTag ) {
						embedNode = CKEDITOR.dom.element.createFromHtml( '<cke:embed></cke:embed>', editor.document );
						embedNode.setAttributes({
							type: myExtPlayer.types[myExtPlayer.idx],
							mtype: 'allMedias',
							pluginspage: myExtPlayer.pluginspage
						});
						if ( objectNode )
							embedNode.appendTo( objectNode );
					}
				} else {
					objectNode = this.objectNode;
					embedNode = this.embedNode;
					//如果更改文件，则有可能需要更改type
					embedNode.setAttributes({
							type: myExtPlayer.types[myExtPlayer.idx],
							pluginspage: myExtPlayer.pluginspage
						});
				}

				// Produce the paramMap if there's an object tag.
				if ( objectNode ) {
					paramMap = {};
					var paramList = objectNode.getElementsByTag( 'param', 'cke' );
					for ( var i = 0, length = paramList.count(); i < length; i++ )
						paramMap[ paramList.getItem( i ).getAttribute( 'name' ) ] = paramList.getItem( i );
				}

				// A subset of the specified attributes/styles
				// should also be applied on the fake element to
				// have better visual effect. (#5240)
				var extraStyles = {},
					extraAttributes = {};
				this.commitContent( objectNode, embedNode, paramMap, extraStyles, extraAttributes );
				//处理不同的文件类型
				var attributes = {};
				if(myExtPlayer.player == 'flashvideo'){
					attributes = {
						flashvars: 'file=' + CKEDITOR.tools.htmlEncode( this.getValueOf('info',　'src') || '') ,
						src: CKEDITOR.getUrl(myExtPlayer.src || '')
					};
				}else if(myExtPlayer.player =='wmpaudio'){
					attributes = {
						src: CKEDITOR.tools.htmlEncode( this.getValueOf('info',　'src') || ''),
						width: (this.getValueOf('info',　'width') || 400),
						height: 45
					};
				}/*else if(myExtPlayer.player == 'flashaudio'){
					attributes = {
						flashvars: 'soundFile=' + CKEDITOR.tools.htmlEncode( this.getValueOf('info',　'src') || '') ,
						src: CKEDITOR.getUrl(myExtPlayer.src || '') ,
						width: (this.getValueOf('info',　'width') || 50),
						height: 25
					};
				}*/
				else{
					attributes = {
						src: CKEDITOR.tools.htmlEncode( this.getValueOf('info',　'src') || '')
					};
				}
				embedNode.setAttributes(attributes);
				// Refresh the fake image.
				var newFakeImage = editor.createFakeElement( objectNode || embedNode, 'cke_allMedias', 'allMedias', true );
				newFakeImage.setAttributes( extraAttributes );
				newFakeImage.setStyles( extraStyles );
				if ( this.fakeImage ) {
					newFakeImage.replace( this.fakeImage );
					editor.getSelection().selectElement( newFakeImage );
				} else
					editor.insertElement( newFakeImage );
			},

			onHide: function() {
				if ( this.preview )
					this.preview.setHtml( '' );
			},

			contents: [
				{
				id: 'info',
				label: editor.lang.common.generalTab,
				accessKey: 'I',
				elements: [
					{
					type: 'vbox',
					padding: 0,
					children: [
						{
						type: 'hbox',
						widths: [ '280px', '110px' ],
						align: 'right',
						children: [
							{
							id: 'src',
							type: 'text',
							label: editor.lang.common.url,
							required: true,
							validate: CKEDITOR.dialog.validate.notEmpty( editor.lang.allMedias.validateSrc ),
							setup: loadValue,
							commit: commitValue,
							onLoad: function() {
								var dialog = this.getDialog(),
									updatePreview = function( src ) {
										var width = dialog.getValueOf('info',　'width');
										var height = dialog.getValueOf('info',　'height') ;
										// Query the preloader to figure out the url impacted by based href.
										previewPreloader.setAttribute( 'src', src );
										var mp =　getMediaType(getUriExt(previewPreloader.getAttribute('src') ));
										var objsrc ;
										if(mp.player == 'flashvideo')
										{
											width = (dialog.getValueOf('info',　'width') || 400);
										    height = (dialog.getValueOf('info',　'height') || 300);
											objsrc = ' flashvars="autostart=true&file=' + CKEDITOR.tools.htmlEncode( previewPreloader.getAttribute( 'src' )) +'" '
											 +' style="height:' + height + 'px;width:'+ width +'px"'
											 + 'pluginspage ="' + (mp.pluginspage || '') +'" '
											 + 'src ="' + CKEDITOR.getUrl((mp.src || '')) +'" ';
										}
										else if (mp.player == 'wmpaudio'){
											width = (dialog.getValueOf('info',　'width') || 350);
										    height = 45;
											objsrc = ' src="' + CKEDITOR.tools.htmlEncode( previewPreloader.getAttribute( 'src' )) +'" '
												+ 'pluginspage ="' + (mp.pluginspage || '') +'" '
												+' style="height:' + height + 'px;width:'+ width +'px"';
										}
										/*else if(mp.player == 'flashaudio'){
											width = (dialog.getValueOf('info',　'width') || 25);
										    height = (dialog.getValueOf('info',　'height') || 100);
											objsrc = ' flashvars="autostart=true&soundFile=' + CKEDITOR.tools.htmlEncode( previewPreloader.getAttribute( 'src' )) +'" '
											 //+'width="' + width +'" height="' + height +'" '
											 + 'soundFile="' + CKEDITOR.tools.htmlEncode( CKEDITOR.getUrl(previewPreloader.getAttribute( 'src' ))) + '" '
											 + 'src ="' + CKEDITOR.getUrl((mp.src || '')) +'" ';
										}*/
										else
										{
											width = (dialog.getValueOf('info',　'width') || 400);
										    height = (dialog.getValueOf('info',　'height') || 300);
											objsrc = ' src="' + CKEDITOR.tools.htmlEncode( previewPreloader.getAttribute( 'src' )) +'" '
												+ 'pluginspage ="' + (mp.pluginspage || '') +'" '
												+' style="height:' + height + 'px;width:'+ width +'px"';
										}
										dialog.preview.setHtml( '<embed ' + objsrc
											+ ' autostart="true'
											+ '" type="'+ mp.types[mp.idx] +'"></embed>' );
									};
								// Preview element
								dialog.preview = dialog.getContentElement( 'info', 'preview' ).getElement().getChild( 3 );

								// Sync on inital value loaded.
								this.on( 'change', function( evt ) {

									if ( evt.data && evt.data.value )
										updatePreview( evt.data.value );
								});
								// Sync when input value changed.
								this.getInputElement().on( 'change', function( evt ) {

									updatePreview( this.getValue() );
								}, this );
							}
						},
							{
							type: 'button',
							id: 'browse',
							filebrowser: {target:'info:src', //update span area
										 action : 'Browse',   //QuickUpload ,Upload,Browse
										 //url : '/ckfinder/ckfinder.html&amp;type=Images',
										 params : // optional
											{
												mediaType : 'allmedias',
												by : 'ck'
											}
								},
							hidden: true,
							// v-align with the 'src' field.
							// TODO: We need something better than a fixed size here.
							style: 'display:inline-block;margin-top:15px;',
							label: editor.lang.common.browseServer
						}
						]
					}
					]
				},
					{
					type: 'hbox',
					widths: [ '25%', '25%', '25%', '25%', '25%' ],
					children: [
						{
						type: 'text',
						id: 'width',
						style: 'width:95px',
						label: editor.lang.common.width,
						validate: CKEDITOR.dialog.validate.htmlLength( editor.lang.common.invalidHtmlLength.replace( '%1', editor.lang.common.width ) ),
						setup: loadValue,
						commit: commitValue
					},
						{
						type: 'text',
						id: 'height',
						style: 'width:95px',
						label: editor.lang.common.height,
						validate: CKEDITOR.dialog.validate.htmlLength( editor.lang.common.invalidHtmlLength.replace( '%1', editor.lang.common.height ) ),
						setup: loadValue,
						commit: commitValue
					},
						{
						type: 'text',
						id: 'hSpace',
						style: 'width:95px',
						label: editor.lang.allMedias.hSpace,
						validate: CKEDITOR.dialog.validate.integer( editor.lang.allMedias.validateHSpace ),
						setup: loadValue,
						commit: commitValue
					},
						{
						type: 'text',
						id: 'vSpace',
						style: 'width:95px',
						label: editor.lang.allMedias.vSpace,
						validate: CKEDITOR.dialog.validate.integer( editor.lang.allMedias.validateVSpace ),
						setup: loadValue,
						commit: commitValue
					}
					]
				},

					{
					type: 'vbox',
					children: [
						{
						type: 'html',
						id: 'preview',
						style: 'width:95%;',
						html: previewAreaHtml
					},
					{
						type: 'text',
						id: 'flashuri',
						label: 'hid1',
						'default': 'plugins/allmedias/jwplayer.swf',
						style: 'display : none;',
						setup: loadValue,
						commit: commitValue
					}
					]
				}
				]
			},
				{
				id: 'Upload',
				hidden: true,
				filebrowser: 'uploadButton',
				label: editor.lang.common.upload,
				elements: [
					{
					type: 'file',
					id: 'upload',
					label: editor.lang.common.upload,
					size: 38
				},
					{
					type: 'fileButton',
					id: 'uploadButton',
					label: editor.lang.common.uploadSubmit,
					filebrowser: 'info:src',
					'for': [ 'Upload', 'upload' ]
				}
				]
			},
				{
				id: 'properties',
				label: editor.lang.allMedias.propertiesTab,
				elements: [
					{
					type: 'hbox',
					widths: [ '50%', '50%' ],
					children: [
						{
						id: 'scale',
						type: 'select',
						label: editor.lang.allMedias.scale,
						'default': '',
						style: 'width : 100%;',
						items: [
							[ editor.lang.common.notSet, '' ],
							[ editor.lang.allMedias.scaleAll, 'showall' ],
							[ editor.lang.allMedias.scaleNoBorder, 'noborder' ],
							[ editor.lang.allMedias.scaleFit, 'exactfit' ]
							],
						setup: loadValue,
						commit: commitValue
					},
						{
						id: 'allowScriptAccess',
						type: 'select',
						label: editor.lang.allMedias.access,
						'default': '',
						style: 'width : 100%;',
						items: [
							[ editor.lang.common.notSet, '' ],
							[ editor.lang.allMedias.accessAlways, 'always' ],
							[ editor.lang.allMedias.accessSameDomain, 'samedomain' ],
							[ editor.lang.allMedias.accessNever, 'never' ]
							],
						setup: loadValue,
						commit: commitValue
					}
					]
				},
					{
					type: 'hbox',
					widths: [ '50%', '50%' ],
					children: [
						{
						id: 'wmode',
						type: 'select',
						label: editor.lang.allMedias.windowMode,
						'default': '',
						style: 'width : 100%;',
						items: [
							[ editor.lang.common.notSet, '' ],
							[ editor.lang.allMedias.windowModeWindow, 'window' ],
							[ editor.lang.allMedias.windowModeOpaque, 'opaque' ],
							[ editor.lang.allMedias.windowModeTransparent, 'transparent' ]
							],
						setup: loadValue,
						commit: commitValue
					},
						{
						id: 'quality',
						type: 'select',
						label: editor.lang.allMedias.quality,
						'default': 'high',
						style: 'width : 100%;',
						items: [
							[ editor.lang.common.notSet, '' ],
							[ editor.lang.allMedias.qualityBest, 'best' ],
							[ editor.lang.allMedias.qualityHigh, 'high' ],
							[ editor.lang.allMedias.qualityAutoHigh, 'autohigh' ],
							[ editor.lang.allMedias.qualityMedium, 'medium' ],
							[ editor.lang.allMedias.qualityAutoLow, 'autolow' ],
							[ editor.lang.allMedias.qualityLow, 'low' ]
							],
						setup: loadValue,
						commit: commitValue
					}
					]
				},
					{
					type: 'hbox',
					widths: [ '50%', '50%' ],
					children: [
						{
						id: 'align',
						type: 'select',
						label: editor.lang.common.align,
						'default': '',
						style: 'width : 100%;',
						items: [
							[ editor.lang.common.notSet, '' ],
							[ editor.lang.common.alignLeft, 'left' ],
							[ editor.lang.allMedias.alignAbsBottom, 'absBottom' ],
							[ editor.lang.allMedias.alignAbsMiddle, 'absMiddle' ],
							[ editor.lang.allMedias.alignBaseline, 'baseline' ],
							[ editor.lang.common.alignBottom, 'bottom' ],
							[ editor.lang.common.alignMiddle, 'middle' ],
							[ editor.lang.common.alignRight, 'right' ],
							[ editor.lang.allMedias.alignTextTop, 'textTop' ],
							[ editor.lang.common.alignTop, 'top' ]
							],
						setup: loadValue,
						commit: function( objectNode, embedNode, paramMap, extraStyles, extraAttributes ) {
							var value = this.getValue();
							commitValue.apply( this, arguments );
							value && ( extraAttributes.align = value );
						}
					},
						{
						type: 'html',
						html: '<div></div>'
					}
					]
				},
					{
					type: 'fieldset',
					label: CKEDITOR.tools.htmlEncode( editor.lang.allMedias.flashvars ),
					children: [
						{
						type: 'vbox',
						padding: 0,
						children: [
							/*{
							type: 'checkbox',
							id: 'menu',
							label: editor.lang.allMedias.chkMenu,
							'default': true,
							setup: loadValue,
							commit: commitValue
						},*/
							{
							type: 'checkbox',
							id: 'loop',
							label: editor.lang.allMedias.chkLoop,
							'default': true,
							setup: loadValue,
							commit: commitValue
						},
						{
							type: 'checkbox',
							id: 'play',
							label: editor.lang.allMedias.chkPlay,
							'default': true,
							setup: loadValue,
							commit: commitValue
						},

							{
							type: 'checkbox',
							id: 'allowFullScreen',
							label: editor.lang.allMedias.chkFull,
							'default': true,
							setup: loadValue,
							commit: commitValue
						}
						]
					}
					]
				}
				]
			} ,
				{
				id: 'advanced',
				label: editor.lang.common.advancedTab,
				elements: [
					{
					type: 'hbox',
					children: [
						{
						type: 'text',
						id: 'id',
						label: editor.lang.common.id,
						setup: loadValue,
						commit: commitValue
					}
					]
				},
					{
					type: 'hbox',
					widths: [ '45%', '55%' ],
					children: [
						{
						type: 'text',
						id: 'bgcolor',
						label: editor.lang.allMedias.bgcolor,
						setup: loadValue,
						commit: commitValue
					},
						{
						type: 'text',
						id: 'class',
						label: editor.lang.common.cssClass,
						setup: loadValue,
						commit: commitValue
					}
					]
				},
					{
					type: 'text',
					id: 'style',
					validate: CKEDITOR.dialog.validate.inlineStyle( editor.lang.common.invalidInlineStyle ),
					label: editor.lang.common.cssStyle,
					setup: loadValue,
					commit: commitValue
				}
				]
			}
			]
		};
	});
})();
