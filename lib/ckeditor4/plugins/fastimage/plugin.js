
(function() {
    CKEDITOR.plugins.add('fastimage', {
        lang: 'en,fr',
        requires: 'dialog',
        icons: 'fastimage',
        init: function(editor) {
        	CKEDITOR.dialog.add('fastimage', function(editor) {
                return {
                	data: null,
                	ratio: 0,
                	dialog: null,
                	originalCanvas: null,
                    title: editor.lang.fastimage.title,
					resizable: CKEDITOR.DIALOG_RESIZE_NONE,
					height: 530,
                    contents: [
                        {
                            id: 'main_uploadimage',
                            elements: [
                               {
                                  type: 'vbox',
                                  align: 'center',
                                  children: [
                                      {
                                          type: 'file',
                                          id : 'uploadimage',
                                          size : 85,
                                          onChange : function(data) {
                                        	var f = this.getInputElement().$.files[0];
                                        	if ( (f.size > 0) && (editor.config.maxImageSizeUpload != undefined) && ((f.size / 1024 / 1024) > editor.config.maxImageSizeUpload)) {
                                        		alert(editor.lang.fastimage.maxSizeMessage.replace('%', editor.config.maxImageSizeUpload));
                                        	}
                                          	 else {
                                      	    	var canvas = document.getElementById('canvas_' + editor.id);
                                      	    	// IE init
                                      	    	if (typeof G_vmlCanvasManager != 'undefined') {
                                      	    		G_vmlCanvasManager.initElement(canvas);
                                      	    	}
                                      	    	var ctx = canvas.getContext('2d');
                                      	        var url = window.URL || window.webkitURL;
                                      	        var src = url.createObjectURL(f);

                                      	        var img = new Image();
                                      	        img.src = src;
                                      	        img.onload = function() {
                                      	        	canvas.width = img.width;
                                    	            canvas.height = img.height;
											       	canvas.style.width = canvas.width + 'px';
											       	canvas.style.height = canvas.height + 'px';
                                    	            ctx.drawImage(img, 0, 0);
                                      	            editor.data = canvas.toDataURL('image/png');
                                      	            dialog.getContentElement( 'main_uploadimage', 'width' ).setValue(img.width, true);
                                      	            dialog.getContentElement( 'main_uploadimage', 'width' ).enable();
                                      	            dialog.getContentElement( 'main_uploadimage', 'height' ).setValue(img.height, true);
                                      	            dialog.getContentElement( 'main_uploadimage', 'height' ).enable();
                                      	            editor.ratio = img.width / img.height;
                                      	            url.revokeObjectURL(src);

                                      	            editor.originalCanvas = document.createElement('canvas');
  	                                      	    	editor.originalCanvas.width = canvas.width;
	  	                                      	    editor.originalCanvas.height = canvas.height;
	  	                                      	    editor.originalCanvas.style.width = editor.originalCanvas.width + 'px';
	  	                                      	    editor.originalCanvas.style.height = editor.originalCanvas.height + 'px';
	  	                                      	    // IE init
	                                        	    if (typeof G_vmlCanvasManager != 'undefined') {
	                                        	    	G_vmlCanvasManager.initElement(editor.originalCanvas);
	                                        	    }
	  	                                      	    editor.originalCanvas.getContext('2d').drawImage(canvas, 0, 0);
                                      	        };
                                          	}
                                         }
                                      },
									  {
										  type: 'html',
										  style: 'overflow: auto; width: 640px; height: 480px; text-align: center; vertical-align: middle;',
										  html: '<div><p style="height: 480px; line-height:480px; text-align: center;"><canvas id="canvas_' + editor.id + '" style="vertical-align: middle;"></canvas></p></div>'
									  },
									  {
		                                  type: 'hbox',
		                                  align: 'center',
		                                  children: [
											{
												  type: 'text',
												  id: 'width',
												  label: editor.lang.common.width,
												  maxLength: 4,
												  onChange: function(ev) {
													  var canvas = document.getElementById('canvas_' + editor.id);
													  if(!new RegExp("^[1-9][0-9]+$").test(this.getValue())) {
														  alert(editor.lang.fastimage.invalidWidth);
														  dialog.getContentElement( 'main_uploadimage', 'width' ).setValue(canvas.width, true);
														  return false;
													  }
													  canvas.width = ev.data.value;
											       	  canvas.height = canvas.width / editor.ratio;
											       	  canvas.style.width = canvas.width + 'px';
											       	  canvas.style.height = canvas.height + 'px';
											          dialog.getContentElement( 'main_uploadimage', 'height' ).setValue(canvas.height, true);
											          if (typeof G_vmlCanvasManager != 'undefined') {
		                                      	    		G_vmlCanvasManager.initElement(canvas);
												      }
												      canvas.getContext('2d').drawImage(editor.originalCanvas, 0, 0, editor.originalCanvas.width, editor.originalCanvas.height, 0, 0, canvas.width, canvas.height);
												      editor.data = canvas.toDataURL('image/png');
												  }
											},
											{
												  type: 'text',
												  id: 'height',
												  label: editor.lang.common.height,
												  maxLength: 4,
												  onChange: function(ev) {
													  var canvas = document.getElementById('canvas_' + editor.id);
													  if(!new RegExp("^[1-9][0-9]+$").test(this.getValue())) {
														  alert(editor.lang.fastimage.invalidHeight);
														  dialog.getContentElement( 'main_uploadimage', 'height' ).setValue(canvas.height, true);
														  return false;
													  }
													  canvas.height = ev.data.value;
													  canvas.width = canvas.height * editor.ratio;
											       	  canvas.style.width = canvas.width + 'px';
											       	  canvas.style.height = canvas.height + 'px';
													  dialog.getContentElement( 'main_uploadimage', 'width' ).setValue(canvas.width, true);
												      if (typeof G_vmlCanvasManager != 'undefined') {
		                                      	    		G_vmlCanvasManager.initElement(canvas);
												      }
												      canvas.getContext('2d').drawImage(editor.originalCanvas, 0, 0, editor.originalCanvas.width, editor.originalCanvas.height, 0, 0, canvas.width, canvas.height);
												      editor.data = canvas.toDataURL('image/png');
												  }
											}
		                                  ]
									  }
                                  ]
                               }
                            ]
                        }
                    ],
                    onShow: function(event) {
                    	editor.data = null;
                    	editor.originalCanvas = null;
                    	editor.ratio = 0;
                    	var canvas = document.getElementById('canvas_' + editor.id);
                    	canvas.width = 0;
                    	canvas.height = 0;
				        canvas.style.width = canvas.width + 'px';
				        canvas.style.height = canvas.height + 'px';
                    	dialog.getContentElement( 'main_uploadimage', 'width' ).disable();
                    	dialog.getContentElement( 'main_uploadimage', 'height' ).disable();
                    },
                    onLoad: function() {
                    	dialog = this;
                    },
                    onOk: function(event) {
                    	if(editor.data != null) {
                    		var img = CKEDITOR.dom.element.createFromHtml('<img src="' + editor.data + '">');
                    	    editor.insertElement(img);
                    	    return true;
                    	}
                    	alert(editor.lang.fastimage.noFileSelected);
                    	return false;
                    }
                };
            });
            editor.addCommand('uploadimage', new CKEDITOR.dialogCommand('fastimage', {
				allowedContent: 'img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}',
				requiredContent: 'img[alt,src]',
				contentTransformations: [
					[ 'img{width}: sizeToStyle', 'img[width]: sizeToAttribute' ],
					[ 'img{float}: alignmentToStyle', 'img[align]: alignmentToAttribute' ]
				]
			} ) );
            editor.ui.addButton('fastimage', {
                label: editor.lang.common.image,
                command: 'uploadimage',
                toolbar: 'fastimage'
            });
        }
    });

})();

CKEDITOR.config.image_removeLinkByEmptyURL = true;

CKEDITOR.on('dialogDefinition', function(dialogDefinitionEvent) {
    var dialogDefinition = dialogDefinitionEvent.data.definition;
    dialogDefinition.dialog.on('cancel', function(cancelEvent) {
        return false;
    }, this, null, -1);
});
