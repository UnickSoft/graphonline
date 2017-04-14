CKEDITOR.plugins.add( 'backup',{
  lang:'ru,en',
	init:function(editor){
		editor.on( 'instanceReady', function(e) {
			var div = document.createElement('div'),
				select = 0,
				style =  'display:inline-block; margin-left:10px;position:relative;margin-top:-2px;overflow:hidden;float:right;',
				bname =  'backup_'+editor.name, init = true, oldtext = '';
			div.setAttribute('style',style);
			if( localStorage.getItem( bname) == undefined )
				localStorage.setItem( bname,'{}'); // создаем наше хранилище
			var format = function(_time){
				var n = new Date(parseInt(_time));
				var frm = function(dd){
					if ( dd < 10 ) dd = '0' + dd;
					return dd;
				};
				return n.getHours()+'.'+frm(n.getMinutes())+'.'+frm(n.getSeconds());
			};
			editor.backup = function(del){
				var chages = false,now = new Date().getTime(),bu = {};
				if(del!='del'){
					var text = editor.getSnapshot();
					if( text!='' ){
						if( localStorage.getItem( bname) && oldtext && text!=oldtext ){
							bu = JSON.parse(localStorage.getItem( bname));
							bu[now] = text;
							localStorage.setItem( bname,JSON.stringify(bu));
							chages = true;
						}
					}
				}else{
					if( confirm( editor.lang.backup.mess1 ) ){
						localStorage.setItem( bname,'{}');
						chages = true;
					}
				}
				if( chages || init){
					if(init&&localStorage.getItem( bname)){
						bu = JSON.parse(localStorage.getItem( bname));
					}
					var opt = '<option>---</option>';
					for(var r in bu)
						opt+='<option value="'+r+'">'+format(r)+'</option>';
					select.setHtml(opt);
					init = false;
				}
				oldtext = text;
			},
			editor.restore = function(){
				var text = editor.getSnapshot();
				var val = select.getValue();
				var bu = JSON.parse( localStorage.getItem( bname) );
				if( bu[val]!=undefined && (text==''||confirm( editor.lang.backup.mess)) ){
					editor.loadSnapshot( bu[val] );
				}
			};
			var mixer = 0;
			editor.on( 'change',function(){
				clearTimeout(mixer);
				mixer = setTimeout(function(){
					editor.backup();
				},3000);
			});
			div.innerHTML = '<select style=" padding:0px; min-height: 25px;display: inline-block;" id="backuper_'+editor.name+'"></select>&nbsp;<input type="image" value="del" onclick="CKEDITOR.instances[\''+editor.name+'\'].backup(\'del\'); return false;" src="'+CKEDITOR.basePath+'plugins/backup/clear.png"/>';
			div.onchange = editor.restore;
			CKEDITOR.document.getById( editor.ui.spaceId?editor.ui.spaceId("bottom"): 'cke_bottom_'+editor.name ).append(new CKEDITOR.dom.node(div));
			select = CKEDITOR.document.getById( 'backuper_'+editor.name );
			editor.backup();
		});
	}
});
