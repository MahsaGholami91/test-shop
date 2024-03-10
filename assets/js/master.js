$(document).ready(function() {

    ////////////////////////////////////////////////////////////////////////////
    //disable # anchors
    $('body').on('click',"a[href='#']",function(e){e.preventDefault();});
    $("a[href='#']").click(function(e){e.preventDefault();});
    
    
    ////////////////////////////////////////////////////////////////////////////
    //back to prev page
    $('[data-backurl]').click(function(e){
        e.preventDefault();
        parent.history.back();
        return false;
    });
    
    
    ////////////////////////////////////////////////////////////////////////////
	/*remain chars*/
	$("[data-remain-chars]").each(function() {
        var no = $(this).attr("data-remain-chars");
        $(this).remaining_char(no);
    });


    ////////////////////////////////////////////////////////////////////////////
    //text direction
    $('input[type=text]').keypress(function(){
        $this = $(this);
        if($this.val().length == 1){
            var x =  new RegExp("[\x00-\x80]+"); // is ascii
            var isAscii = x.test($this.val());

            if(isAscii){$this.css("direction", "ltr");}
            else{$this.css("direction", "rtl");}
        }
    });
    
    
    //////////////////////////////////////////////////////////////////////////////	
    //go_to_top
    $(window).scroll(function(){
        var topscroll = $(window).scrollTop();
        if(topscroll >= 700){
            $('.gototop_style1').addClass('show');
        }else {
            $('.gototop_style1').removeClass('show');
        }
    });

    $('.gototop_style1').click(function(){
        $('html,body').animate({scrollTop:0},1000);
    });
    
    ////////////////////////////////////////////////////////////////////////////
    //number_format inputs
    $("input.number_format").keyup(function(){
        var num = this.value.replace(/[^\d]/g, '');
        if(num.length>3)
            num = num.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        this.value = num;
    });		


    //////////////////////////////////////////////////////////////////////
    // refresh captcha
    $('[data-refresh-captcha]').click(function(){
        var $this = $(this);
        var src_captcha = "_includes/captcha.php?"+Date.now();
        $this.closest('.captcha_wrapper').find('img.captcha_pic').attr('src',src_captcha);
    });


    ///////////////////////////////////////////////////////////////////
	//cropper
//	$('[data-run-cropper]').change(function(){
//		var x = $(this).attr('data-x');
//		var y = $(this).attr('data-y');	
//        var element = $(this).attr('data-element');	
//
//        $(element).find('.cropper_preview').css('background-image','none');
//        $(element).find('.rmv_file').show();
//        $(element).find('.rmv_file').attr('data-filename','1');
//        
//		setTimeout(function(){run_cropper(element,x,y);},500);
//	});  
    
    ////////////////////////////////////////////////////////////////////////////
    //ellipsis
    // ellipsis();
    
    
    ////////////////////////////////////////////////////////////////////////////1
    //textarea autosize
	if($('.autosize').length != 0){
        autosize($('.autosize'));
	}
    
    
    ////////////////////////////////////////////////////////////////////////////1
    //lazy img
	if($('[data-lazy-img]').length != 0){
    	$('[data-lazy-img]').lazy();
	}


    ////////////////////////////////////////////////////////////////////////////
    // get image info
    $('[data-image-info]').change(function(){
        var $this = $(this);
        var $form = $this.closest('form');
        var files = !!this.files ? this.files : [];
        var image = new Image();
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        
        reader.onloadend = function() {
          image.src = this.result;
          image.onload = function() {
            $this.attr('data-width',image.width);
            $this.attr('data-height',image.height);
            $form.valid();
          };
        };
    });


    ////////////////////////////////////////////////////////////////////////////
    //tooltip
    $('.tooltip').parent().hover(function(){
        $(this).find('.tooltip').stop(true,true).fadeIn(200);
    },function(){
        $(this).find('.tooltip').stop(true,true).fadeOut(200);
    });
    
    
    ////////////////////////////////////////////////////////////////////////////
    //Select With Select Style
    $('select[data-select-style]').each(function(){
        var label = $(this).find('option:selected').text();
        $(this).siblings('.select_label').text(label);
    });

    $('select[data-select-style]').change(function(){
        var label = $(this).find('option:selected').text();
        $(this).siblings('.select_label').text(label);
    });//change


    // ////////////////////////////////////////////////////////////////////////////
    // //Change State
    // $("select[name=state_id]").change(function(){
    //     var $this = $(this);
    //     var state_id = $(this).val();
    //     $this.closest("form").find("select[name=city_id]").closest(".select_style").addClass("loading_ajax");

    //     $.post("_includes/ajax-process.php",{
    //         state_id:state_id,
    //         go_change_state:""
    //     },function(response){
    //         $this.closest("form").find("select[name=city_id]").html(response);
    //         $this.closest("form").find("select[name=city_id]").closest(".select_style").find(".select_label").text("--انتخاب شهر--");
    //         $this.closest("form").find("select[name=area_id]").html("<option value=''>--انتخاب منطقه--</option>");
    //         $this.closest("form").find("select[name=area_id]").closest(".select_style").find(".select_label").text("--انتخاب منطقه--");
    //         $this.closest("form").find("select[name=region_id]").html("<option value=''>--انتخاب محدوده--</option>");
    //         $this.closest("form").find("select[name=region_id]").closest(".select_style").find(".select_label").text("--انتخاب محدوده--");
    //         $this.closest("form").find("select[name=city_id]").closest(".select_style").removeClass("loading_ajax");
    //     });
    // });//Change State & City

    //Change City
    $("select[name=city_id]").change(function(){
        var $this = $(this);
        var city_id = $(this).val();
        $this.closest("form").find("select[name=area_id]").closest(".select_style").addClass("loading_ajax");

        $.post("_includes/ajax-process.php",{
            city_id:city_id,
            go_change_city:""
        },function(response){
            var data = $.parseJSON(response);
            $this.closest("form").find("select[name=area_id]").html(data.area);
            $this.closest("form").find("select[name=area_id]").closest(".select_style").find(".select_label").text("--انتخاب منطقه--");
            $this.closest("form").find("select[name=region_id]").html("<option value=''>--انتخاب محدوده--</option>");
            $this.closest("form").find("select[name=region_id]").closest(".select_style").find(".select_label").text("--انتخاب محدوده--");
            $this.closest("form").find("select[name=area_id]").closest(".select_style").removeClass("loading_ajax");
        });
    });//Change State & City

    //Change Area
    $("select[name=area_id]").change(function(){
        var $this = $(this);
        var area_id = $(this).val();
        $this.closest("form").find("select[name=region_id]").closest(".select_style").addClass("loading_ajax");

        $.post("_includes/ajax-process.php",{
            area_id:area_id,
            go_change_area:""
        },function(response){
            var data = $.parseJSON(response);
            $this.closest("form").find("select[name=region_id]").html(data.region);
            $this.closest("form").find("select[name=region_id]").closest(".select_style").find(".select_label").text("--انتخاب محدوده--");	
            $this.closest("form").find("select[name=region_id]").closest(".select_style").removeClass("loading_ajax");		
        });
    });//Change State & City

    ////////////////////////////////////////////////////////////////////////////    
    //Scrolls Y
//	$(".have_scroll_y").mCustomScrollbar({
//		snapAmount:40,
//		scrollButtons:{enable:true},
//		keyboard:{scrollAmount:40},
//		mouseWheel:{deltaFactor:40},
//		scrollInertia:400,
//		theme:"dark-thin"
//		/*autoHideScrollbar:true*/
//	});
//
//	//Scrolls X
//	$(".have_scroll_x").mCustomScrollbar({
//		axis:"x",
//		theme:"dark-thin",
//		advanced:{autoExpandHorizontalScroll:true},
//		//scrollbarPosition:"outside",
//		snapAmount:40,
//		scrollButtons:{enable:true},
//		keyboard:{scrollAmount:40},
//		mouseWheel:{deltaFactor:40},
//		scrollInertia:400,
//		autoHideScrollbar:true
//	});


	//////////////////////////////////////////////////////////////////////////////	
	//NewsLetter   
	$('[data-go-newsletter]').click(function(e){
		e.preventDefault();
        var $form = $(this).closest("form");	
		var $this = $(this);
		var email = $form.find('input[name=email]').val();
		
		if(email.trim() != ''){
			if($form.valid()){
				show_modal();
				$.post("_includes/ajax-process.php",{
					go_newsletter:'',
					email:email,
				},function(response){
					hide_modal();
					var data = $.parseJSON(response);
					if(data.error == ""){
						show_notif("","شما با موفقیت به خبرنامه سایت پیوستید.",'s',5000);
						$form.find('input[name=email]').val("");
					}else{
						show_notif("خطا",data.error,'e',5000);
					}
				});
			}//email ok
			else{
				show_notif("خطا","ایمیل وارد شده معتبر نمی باشد",'e',5000);
			}
		}//required ok
		else{
			show_notif("خطا","ابتدا ایمیل خود را وارد نمایید...",'e',5000);
		}
	});//NewsLetter	
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        // modal_style1
        $('.user_enter_part .link3.login , .nav_style4 .link2.login').click(function(){
            show_modal('.bg1');
            $('.modal_style1').addClass('bounce');
            modal_box('#popup_box');
        });
        $('.modal_style1 .close_icon').click(function(){
            hide_modal('.bg1');
            $('.modal_style1').fadeOut();
        });
        // modal_style1
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        // modal_style1 product_authentication
        $('.product_auth .link').click(function(){
            show_modal('.bg1');
            $('.modal_style1').addClass('bounce');
            modal_box('#popup_box2');
        });
        $('.modal_style1 .close_icon').click(function(){
            hide_modal('.bg1');
            $('.modal_style1').fadeOut();
        });
        // modal_style1 product_authentication
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        // modal_style2
        /*$('.share_style2 .icon1.email').click(function(){
            show_modal('.bg1');
            $('.modal_style2.email_share').addClass('bounce');
            modal_box('#popup_box3');
        });*/
        $('.modal_style2.email_share .close_icon').click(function(){
            hide_modal('.bg1');
            $('.modal_style2').fadeOut();
        });
        // modal_style2

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        // modal_style2
        $(document.body).on('click','.share_style1 .item1_bustani.email,.share_style2 .icon1.email',function(e){
            e.preventDefault();
            $('.close_icon').trigger('click');
            var $this=$(this);
            setTimeout(function () {
                show_modal('.bg1');
                $('#frm_share').find('input[name="id"]').val($this.data('id'));
                $('#frm_share').find('input[name="model"]').val($this.data('model'));
                $('#frm_share').find('input[name="image_size"]').val($this.data('image-size'));
                $('.modal_style2.email_share').addClass('bounce');
                modal_box('#popup_box3');
            },300);
        });
        $('.modal_style2.email_share .close_icon').click(function(){
            hide_modal('.bg1');
            $('.modal_style2').fadeOut();
        });
        // modal_style1

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        // modal_style6
        // show_modal('.bg1');
        // modal_box('#popup_box10');
        // $('.modal_style6 .close_icon').click(function(){
        //     hide_modal('.bg1');
        //     $('.modal_style6').fadeOut();
        // });
        // modal_style6
        
        ////////////////////////////////////////////////////////////////////////////
        // submenu     
        $('.nav_style3 .item1_bustani').hover(function(){
            $(this).find('.submenu').fadeIn(50).addClass('hovered');
        },(function(){
            $(this).find('.submenu').fadeOut(50).removeClass('hovered');
        }));// submenu
        
        ///////////////////////////////////////////////////////////////////
        // responsive panel menu
        $('.panel_style1 .menu1 .item1_bustani.user.responsive').click(function(){
           $('.panel_style1 .panel_part2 .leftside.responsive_menu1').fadeIn();
        });

        $('.leftside.responsive_menu1').click(function(e){
           e.stopPropagation();
        });

        $('body').click(function(){
            $('.sub').fadeOut(10);
            $('.panel_style1 .panel_part2 .leftside.responsive_menu1').fadeOut(10);
        });// responsive panel menu
        
        ////////////////////////////////////////////////////////////////////////////
        // fixed menu
        $(window).scroll(function(){
           var header_height = $('.header').height(); 
           var window_scroll = $(window).scrollTop();
           if(window_scroll>= header_height * 1.2){
               $('.nav_style4').fadeIn(150);
           }else{
               $('.nav_style4').fadeOut(10);
           }
        });// fixed menu

        ////////////////////////////////////////////////////////////////////////////
        // responsve_menu
        $('.burger_menu_style1').click(function(){
            if($('.responsive_menu').hasClass('active')){
                $('.responsive_menu').removeClass('active');
                $('.burger_menu_style1').removeClass('close');
            }else{
                $('.responsive_menu').addClass('active');
                $('.burger_menu_style1').addClass('close');
            }
        });// responsve_menu

        $('body').click(function(){
            $('.responsive_menu').removeClass('active');
            $('.burger_menu_style1').removeClass('close');
        })

        $('.burger_menu_style1 , .responsive_menu').click(function(e){
            e.stopPropagation();
        });

    
});//document ready
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	