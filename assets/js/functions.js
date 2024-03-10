//////////////////////////////////////////////////////////////////////////////////////
//show modal
function show_modal(overlay){
    var overlay = (typeof overlay != 'undefined')?overlay:".bg";
    var opacity = (overlay == ".bg")?"1":"0.3";
    $('.modal').fadeIn(200);
    $('.modal ' + overlay).css("opacity",opacity);
    $('body').css({'overflow':'hidden'});
}//show_modal

//////////////////////////////////////////////////////////////////////////////////////
//hide modal
function hide_modal(id){
    $('.modal').fadeOut(500);
    $('.modal .bg').css('opacity','0');
    $('body').css({'overflow':'auto'});


    setTimeout(function(){
        $('.modal_dynamic .window').remove();
        $('.modal_static '+id).css({'display':'none','opacity':'0'});
        //$('.modal video').get(0).pause();

    },500);
}//hide_modal

//////////////////////////////////////////////////////////////////////////////////////
//modal msg
function modal_msg(type,msg,btns){
    show_modal('.bg1');
    $('.modal_scroll .modal_dynamic').html("<div class='window'><i class='modal_close'>X</i><div class='modal_header "+type+" '><i class='modal_icon'></i></div><div class='modal_msg'><p>"+msg+"</p></div><div class='modal_action'><a href='#' class='modal_close_btn modal_btn'>Close</a>"+btns+"</div></div>");
    $('.modal_scroll .modal_dynamic .window').css({'display':'inline-block'}).stop(true,true).fadeTo(500,1);

    $('.modal_close, .modal_close_btn').click(function(){
        hide_modal();
    });
}//modal_msg


//////////////////////////////////////////////////////////////////////////////////////
//modal box
function modal_box(id,button){
    show_modal(".bg1");
    if(button){
        var url=button.attr('href');
        if(!url || url==undefined){
            url=$(button).data('url');
        }
        $.get(url,function (response) {
            $('.modal_static '+id).html(response).css({'display':'inline-block'}).stop(true,true).fadeTo(500,1,function(){
                $('.modal .bg').css("opacity",0);
            });
            $('select').niceSelect();
        });


    }else{
        $('.modal_static '+id).css({'display':'inline-block'}).stop(true,true).fadeTo(500,1,function(){
            $('.modal .bg').css("opacity",0);
        });
    }


    $('.modal_close, .modal_close_btn').click(function(){
        hide_modal(id);
    });
}//modal_box

//////////////////////////////////////////////////////////////////////////////////////
//show notif
function show_notif($title,$text,$type,$time){ 
    switch($type){
            case 's':
                    $type='success';
            break;

            case 'w':
                    $type='warning';
            break;

            case 'e':
                    $type='error';
            break;

            case 'i':
                    $type='info';
            break;

            default:
                $type=''
    }//switch

    $time = ($time==0)?false:$time;

    $.toast({
            heading: $title,
            text: $text,
            showHideTransition: 'fade',
            icon: $type,
            hideAfter: $time,
            stack:1,
    });
}//show_notif


//////////////////////////////////////////////////////////////////////////////////////
//show_result
function show_result($target,$msg,$type){
	$target.find('.result').removeClass('s e w i').addClass($type).fadeIn(300).find('.text').html($msg);
}//show_result


//////////////////////////////////////////////////////////////////////////////////////
//clean_reload
function clean_reload(){
	$('.clean_reload select option').removeAttr("selected");
	$('.clean_reload select option').first().prop("selected",true);
	$('.clean_reload input[type=text],textarea').val("");		
}


////////////////////////////////////////////////////////////////////////////
// ellipsis
// function ellipsis(){
// 	$(".ellipsis").dotdotdot({
// 		ellipsis	: '... ',
// 		wrap		: 'word',
// 		fallbackToLetter: true,
// 		after		: null,
// 		watch		: window,	
// 		height		: null,
// 		tolerance	: 0,
// 		callback	: function( isTruncated, orgContent ) {},
// 		lastCharacter	: {
// 			remove		: [ ' ', ',', ';', '.', '!', '?' ],
// 			noEllipsis	: []
// 		}
// 	});
// }


////////////////////////////////////////////////////////////////////////////////
// NUMBER FORMAT
function number_format(no){
    var num = no.toString().replace(/[^\d]/g,'');
    if(num.length>3)
        num = num.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
    return num;
}


////////////////////////////////////////////////////////////////////////////
//Cropper Image
function run_cropper(element,x,y){
	$(element+' .cropper_holder img').cropper({
		aspectRatio: x / y,
		autoCropArea: .9,
		viewMode: 1,
		dragMode:'move',
		preview:$(element+' .cropper_preview'),
		toggleDragModeOnDblclick:false,
		crop: function(e) {
			// Output the result data for cropping image.
			var x = e.x;
			var y = e.y;
			var w = e.width;
			var h = e.height;
			$(element+' [data-crop-x]').val(x);
			$(element+' [data-crop-y]').val(y);
			$(element+' [data-crop-w]').val(w);
			$(element+' [data-crop-h]').val(h);
		},
	});
}//func


////////////////////////////////////////////////////////////////////////////
//Preview Image Function
function preview($file,$target){
	//show image befor upload
	$($file).on("change", function(){
		var files = !!this.files ? this.files : [];
		if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
	
		if (/^image/.test( files[0].type)){ // only image file
			var reader = new FileReader(); // instance of the FileReader
			reader.readAsDataURL(files[0]); // read the local file
			reader.onloadend = function(){ // set image data as background of div
				$($target).html("<img src='"+this.result+"'>").show();
			}
		}
	});
}



////////////////////////////////////////////////////////////////////////////
//script loader
var Loader = function () { }
Loader.prototype = {
    require: function (scripts, callback) {
        this.loadCount      = 0;
        this.totalRequired  = scripts.length;
        this.callback       = callback;

        for (var i = 0; i < scripts.length; i++) {
            this.writeScript(scripts[i]);
        }
    },
    loaded: function (evt) {
        this.loadCount++;

        if (this.loadCount == this.totalRequired && typeof this.callback == 'function') this.callback.call();
    },
    writeScript: function (src) {
        var self = this;
        var s = document.createElement('script');
        s.type = "text/javascript";
        s.async = true;
        s.src = src;
        s.addEventListener('load', function (e) { self.loaded(e); }, false);
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }
}
