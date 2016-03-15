(function( $ ){

    var methods = {
        init : function(options) {

            var defaults = {
                img_path: 'nsProgress/img'
            };

            options = $.extend(defaults, options);
            height_without_text = 60;
            height_with_text = 80;

            $(this).addClass('nsProgress_container');
            $('body').append('<div class="nsProgress_block"></div>');

            $(this).append('<img class="nsProgress_img" data-src="' + options.img_path + '" src="' + options.img_path + '/nsLoader.gif" /><div class="nsProgress_text">Loading&hellip;</div>');
        },
        show : function( ) { 
            $(this).show();
        },
        showWithMaskType : function( type ) {

            switch(type) {
                case 'none':
                    break;
                case 'clear':
                    $('.nsProgress_block').show();
                    break;yep
                case 'black':
                    $('.nsProgress_block').show();
                    $('.nsProgress_block').css('background', 'rgba(0, 0, 0, 0.5)');
                    break;
                default:
                    break;
            }

            $(this).nsProgress('show');
        },
        showWithStatus : function( status ) {

            $(this).css('height', height_with_text + 'px');
            $(this).find('.nsProgress_text').html( status ).show();;
            $(this).nsProgress('show');

        },
        showWithStatusAndMaskType : function ( status, type ) {

            $(this).nsProgress('showWithMaskType', type);
            $(this).nsProgress('showWithStatus', status);

        },
        showWithImage : function( image_name ) {

            $(this).find('.nsProgress_img').attr('src', $(this).find('.nsProgress_img').attr('data-src') + '/' + image_name);
            $(this).nsProgress('show');

        },
        showSuccessWithStatus : function ( status ) {

            $(this).nsProgress('showWithImage', 'nsSuccess.png');
            $(this).nsProgress('showWithStatus', status);

        },
        showErrorWithStatus : function ( status ) {

            $(this).nsProgress('showWithImage', 'nsError.png');
            $(this).nsProgress('showWithStatus', status);

        },
        showSuccessWithStatusAndMaskType : function ( status, type ) {

            $(this).nsProgress('showWithImage', 'nsSuccess.png');
            $(this).nsProgress('showWithStatusAndMaskType', status, type);

        },
        showErrorWithStatusAndMaskType : function ( status, type ) {

            $(this).nsProgress('showWithImage', 'nsError.png');
            $(this).nsProgress('showWithStatusAndMaskType', status, type);

        },
        showWithImageAndStatus : function ( image, status ) {

            $(this).nsProgress('showWithImage', image);
            $(this).nsProgress('showWithStatus', status);

        },
        showWithImageAndStatusAndMaskType : function ( image, status, type ) {

            $(this).nsProgress('showWithImage', image);
            $(this).nsProgress('showWithStatusAndMaskType', status, type);

        },
        showWithImageAndMaskType : function ( image, type ) {

            $(this).nsProgress('showWithImage', image);
            $(this).nsProgress('showWithMaskType', type);

        },
        dismiss : function() {

            // Flush the styles out
            $('.nsProgress_block').attr('style', '');
            $(this).find('.nsProgress_text').attr('style', '').html('').hide();
            $(this).attr('style', '');

            $(this).find('.nsProgress_img').attr('src', $(this).find('.nsProgress_img').attr('data-src') + '/nsLoader.gif');

            $(this).hide();
            $('.nsProgress_block').hide();
        }
    };

    $.fn.nsProgress = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.nsProgress' );
        }    
    };


})( jQuery );