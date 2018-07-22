// Agency Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 54)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '#mainNav',
        offset: 54
    });

    // Closes the Responsive Menu on Menu Item Click
    $('#navbarResponsive>ul>li>a').click(function() {
        $('#navbarResponsive').collapse('hide');
    });

    // jQuery to collapse the navbar on scroll
    $(window).scroll(function() {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    });

    // BEGIN: collagePlus JQuery plugin

    $(document).ready(function(){
        var collagePlusElemSelector = '.portfolio-collage'
        // Here we apply the actual CollagePlus plugin
        function collage() {
            $(collagePlusElemSelector).collagePlus(
                {
                    // change this to adjust the height of the rows
                    'targetHeight' : 200,
                    // change this to try different effects
                    // valid effets = effect-1 to effect-6
                    'effect' : "effect-1"
                }
            );
        };
        // This is just for the case that the browser window is resized
        var resizeTimer = null;
        $(window).bind('resize', function() {
            // set a timer to re-apply the plugin
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(collage, 200);
        });

        collage();
    });
    // END: collagePlus JQuery plugin

})(jQuery); // End of use strict
