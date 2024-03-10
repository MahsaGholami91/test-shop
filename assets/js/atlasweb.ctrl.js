$(function () {
    var atlasWeb=new Atlasweb();
    /**********************************************************/
    /* Auto fill select box when the other one is being changed
    /**********************************************************/
    $(document.body).on('change','.select-auto-fill',function () {
        atlasWeb.selectAutoFill($(this));
    });


    /**********************************************************/
    /* Refresh the captcha
     /**********************************************************/

    $(document.body).on('click','.btn-refresh-captcha',function (e) {
       e.preventDefault();
       atlasWeb.refreshCapctha();
    });

    /**********************************************************/
    /* Send form request via ajax if it has data-ajax attribute
     /**********************************************************/

    $(document.body).on('submit','form[data-ajax]',function (e) {
        e.preventDefault();
        atlasWeb.sendAjaxRequest(this);
    });

    /**********************************************************/
    /* Do logout
     /**********************************************************/

    $(document.body).on('click','.btn-logout',function (e) {
        e.preventDefault();
        atlasWeb.logout();
    })

    /**********************************************************/
    /* Add to favorite
     /**********************************************************/
    $(document.body).on('click','.btn-favorite',function (e) {
       e.preventDefault();
       atlasWeb.addToFavorite($(this));
    });

    /**********************************************************/
    /* Remove from favorites
     /**********************************************************/

    $(document.body).on('click','.btn-remove-favorite',function (e) {
        e.preventDefault();
        atlasWeb.removeFavorite($(this));
    });

    /**********************************************************/
    /* Change cart count
     /**********************************************************/

    $(document.body).on('click','.btn_change_cart_count',function(e){
        e.preventDefault();
        atlasWeb.changeCartCount($(this));
    });

    $(document.body).on('change','.frm-cart-count > input',function () {
       atlasWeb.changeCartCountInput($(this));
    });

    /**********************************************************/
    /* Add to cart
     /**********************************************************/

    $(document.body).on('click','.btn_add_to_cart',function(e){
        e.preventDefault();
        atlasWeb.addToCart($(this));
    });
});
