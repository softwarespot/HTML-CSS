(function($, undefined) {

    // Plugin Logic
    $.fn.extend({

        myPlugin: function(options) {

            console.log('Plugin has been called');

            // Set our options from the defaults, overriding with the
            // parameter we pass into this function
            options = $.extend({}, $.fn.myPlugin.options, options);

            return this.each(function(index, element) {

                console.log(index);
                console.log($(element));

            });

        }

    });

    // Methods (Private)

    // Defaults
    $.fn.myPlugin.options = {

    };

})(jQuery);

// Initialise when the DOM is ready
$(function () {

  $('div').myPlugin();

});
