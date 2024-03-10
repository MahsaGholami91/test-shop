var Atlasweb = function () {
    var $this = this;
    var loader=$('<div class="loader"><div class="loader_status"><div class="loader_position"><div class="loader1"><span class="dot dot1"></span> <span class="dot dot2"></span> <span class="dot dot2"></span> <span class="dot dot4"></span> </div> </div> </div></div>');
    var placeHolders=[];
    this.mainUrl = '/';

    this.systemErrors= {
        404: 'Page not found.',
        405:'Method not allowed',
        500: 'Internal server error',
        403: 'Request is not valid',
        401: 'Request is forbidden',
        419:'Unknown status'
    };

    this.formMessageContainer=$(document.body).find('.message_style1:not(.attention)').hide();

    this.favoriteCounter=$(document.body).find('.no.fav');

    this.cartCounter=$(document.body).find('.no.cart');

    this.selectAutoFill = function (select) {
        var url = select.data('url') + '/' + select.val(), child = $(select.data('to-fill')),
            loading = "<option value=''>" + child.data('loading') + "</option>";
        child.html(loading);
        $('select').niceSelect('update');
        $.getJSON(url, function (response) {
            var options = "<option value=''>" + child.data('default') + "</option>"
            $.each(response, function () {
                options += "<option value='" + this.id + "'>" + this.title + "</option>"
            });
            child.html(options);
            $('select').niceSelect('update');
        }).fail(function (error) {
            child.html('');
            $('select').niceSelect('update');
            console.log(error.status);
        });
    };

    this.refreshCapctha = function () {
        var captchaImg = $('.captcha-img');
        captchaImg.animate({
            opacity: 0.8
        });
        $.getJSON($this.mainUrl + 'refresh-captcha', function (captcha) {
            captchaImg.attr('src', captcha.src);
        }).fail(function (error) {
            console.log(error.status);
        }).always(function () {
            captchaImg.animate({
                opacity: 1
            });
        });
    };

    this.sendAjaxRequest=function(form){
        var data = new FormData(form), url = $(form).attr('action');
        var ajaxOptions = {
            type: $(form).attr('method'),
            data: data,
            url: url,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $this.setPlaceholders($(form));
                //block
                $(form).css('position','relative').prepend(loader);
                $this.formMessageContainer.hide();
                $(form).clearErrorClass();
            },
            success: function (response) {
                $this.runIfSuccess($(form), response);
                //clearForm
                if ($(form).data('clear')) {
                    $(form).clearForm();
                }
                $(document.body).find('.icon.close_icon').trigger('click');
            }, error: function (error) {
                $this.showFormErrorMessages($(form),error);
            }, complete: function () {
                //unblock
                $(form).find(loader).remove();
                $(form).clearSecurityInputs();
                $this.refreshCapctha();
                $this.clearPlaceholders($(form));
            }
        };
        $.ajax(ajaxOptions);
    };

    this.runIfSuccess = function (form, response) {
        if (!form.data('on-success')) {
            return false;
        }
        if(response.url){
            form.data('on-success','redirect');
        }
        switch (form.data('on-success')){
            case 'inline-message':
                $this.formMessageContainer.removeClass('error').addClass('success').show().find('p').html(response.message);
                break;
            case 'popup-message':
                try{
                    swal("Success", response.message, "success");
                }catch (exception){
                   alert(exception.message);
                }
                break;
            case 'redirect':
                $(location).attr('href', response.url);
                break;
            case 'add-node':
                var container=$($(form).data('container'));
                container.prepend(response.view);
               break;
            case 'remove-node':
                  $(document.body).find(response.deletedItem).fadeOut(200);
                  if(response.counter){
                      $(response.counter).html(response.count);
                  }
        }
    };

    this.runIfSuccessDelete = function (form, deleteAble) {

    };

    this.showFormErrorMessages = function (form, error) {
        var jsonError=error.responseJSON;
        if(error.status==429){
            swal('Error',jsonError.error.message,'error');
            return false;
        }
        if(jsonError.errors){
            switch (form.data('on-error')){
                case 'inline-message':
                    $.each(jsonError.errors,function (index,value) {
                        if(index=='auth'){
                            swal(index,value,'error');
                            return false;
                        }
                        var input=$(form).find('*[name='+index+']');
                        input.addClass('error').val('').attr('placeholder',value);
                        if(input.siblings('.nice-select').exist()){
                            input.siblings('.nice-select').addClass('error').find('.current').html(value);
                        }
                    });
                    break;
                case 'popup-message':
                    var errorsList=""
                    $.each(jsonError.errors,function (index,error) {
                        errorsList+=error;
                    });
                    swal({
                        title: "Error!",
                        text: errorsList,
                        icon: "error",
                        content:errorsList
                    });
                    break;
            }
        }else{
            $this.formMessageContainer.removeClass('success').addClass('error').show().find('p').html($this.showSystemError(error));
        }

    };

    this.showSystemError=function (error) {
        return $this.systemErrors[error.status];
    };

    this.logout=function () {
      $('#frm-logout').submit();
    };

    this.addToFavorite=function (button) {
        var url=button.attr('href');
        button.parent().css('position','relative').prepend(loader);
        $.getJSON(url,function (response) {
           $this.favoriteCounter.html(response.count);
           if(response.active){
               button.addClass('active liked')
           }else{
               button.removeClass('active liked')
           }
        }).error(function (error) {
            var jsonError=error.responseJSON;
            if(jsonError.errors){
                var errorsList='';
                $.each(jsonError.errors,function (index,error) {
                    errorsList+=error;
                });
                swal({
                    title: "Error!",
                    text: errorsList,
                    icon: "error"
                });
            }else{
                swal({
                    title: "Error!",
                    text: $this.showSystemError(error),
                    icon: "error",
                });
            }
        }).always(function () {
            button.parent().find('.loader').remove();
        });
    };

    this.removeFavorite=function (button) {
        var url=button.attr('href');
        $.getJSON(url,function (response) {
            $this.favoriteCounter.html(response.count);
            $(response.productId).fadeOut(200);
        }).error(function (error) {
            var jsonError=error.responseJSON;
            if(jsonError.errors){
                var errorsList='';
                $.each(jsonError.errors,function (index,error) {
                    errorsList+=error;
                });
                swal({
                    title: "Error!",
                    text: errorsList,
                    icon: "error"
                });
            }else{
                swal({
                    title: "Error!",
                    text: $this.showSystemError(error),
                    icon: "error",
                });
            }
        });
    };

    this.changeCartCount=function (button) {
     var url=button.attr('href'),
      input=button.siblings('input'),count=input.val(),productPrice=$(button.parent('form').data('to-change'));
     if(button.hasClass('minus')){
         if(count>1){
            input.val(parseInt(count)-1);
         }else{
             return false;
         }
     }else if(button.hasClass('plus')){
         input.val(parseInt(count)+1);
     }
      count=input.val();
     button.closest('td').css('position','relative').prepend(loader);

      $.getJSON(url,{
          'count':count
      },function (response) {
          if(response.message){
              swal(response.header,response.message,response.type);
          }
          input.val(response.count);
          productPrice.html(response.product_price);
          $('#total-price').html(response.total);
      }).fail(function (error) {

      }).always(function () {
          button.closest('td').find('.loader').remove();
      });
    };

    this.changeCartCountInput=function (input) {
        var url=input.data('url'),count=input.val(),productPrice=$(input.parent('form').data('to-change'));
        if(count<=0){
            input.val(1);
            return false;
        }
        input.closest('td').css('position','relative').prepend(loader);
        $.getJSON(url,{
            'count':count
        },function (response) {
            if(response.message){
                swal(response.header,response.message,response.type);
            }
            input.val(response.count);
            productPrice.html(response.product_price);
            $('#total-price').html(response.total);
        }).fail(function (error) {

        }).always(function () {
            input.closest('td').find('.loader').remove();
        });
    }

    this.addToCart=function (button) {
        var url=button.attr('href');
        button.parent().css('position','relative').prepend(loader);
        $.getJSON(url,function (response) {
            $this.cartCounter.html(response.count);
            if(response.active){
                if(button.hasClass('btn_style5')){
                    button.html("remove from cart");
                }
                button.addClass('active')
            }else{
                if(button.hasClass('btn_style5')){
                    button.html("add to cart");
                }
                button.removeClass('active')
            }
        }).error(function (error) {
            var jsonError=error.responseJSON;
            if(jsonError.errors){
                var errorsList='';
                $.each(jsonError.errors,function (index,error) {
                    errorsList+=error;
                });
                swal({
                    title: "Error!",
                    text: errorsList,
                    icon: "error"
                });
            }else{
                swal({
                    title: "Error!",
                    text: $this.showSystemError(error),
                    icon: "error",
                });
            }
        }).always(function () {
            button.parent().find('.loader').remove();
        });
    };

    this.setPlaceholders=function (form) {
        placeHolders=[];
       var inputs=form.find('input:not(:hidden),textarea');
       $.each(inputs,function (index,input) {
           var placeholder=$(input).attr('placeholder');
           placeHolders.push(placeholder)
       });
    };

    this.clearPlaceholders=function (form) {
        var inputs=form.find('input:not(:hidden),textarea');
        $.each(inputs,function (index,input) {
            var placeholder=$(input).attr('placeholder',placeHolders[index]);
        });
    }
};

/**********************************/
/* Helpers
 /*********************************/
$.fn.clearForm = function () {
   this.find('select,input,textarea').val('');
    if ($.niceSelect) {
        $('select').niceSelect('update');
    }
};
$.fn.clearSecurityInputs=function () {
  this.find('input[type="password"],input[name="captcha"]').val('');
};
$.fn.clearErrorClass=function () {
    this.find('*').removeClass('error');
}
$.fn.exist=function () {
    return this.length>0;
}