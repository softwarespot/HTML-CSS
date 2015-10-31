; // jshint ignore:line
(function jQueryMyPluginNamespace(window, $, undefined) {

    // Plugin Logic

    $.fn.extend({

        myPlugin: function myPluginExtended(options) {
            window.console.log('Plugin has been called');

            // Set our options from the defaults, overriding with the
            // parameter we pass into this function
            options = $.extend({}, $.fn.myPlugin.options, options);

            return this.each(function forEachElement(index, element) {
                window.console.log(index);
                window.console.log($(element));
            });
        },

    });

    // Methods (Private)

    // Defaults
    $.fn.myPlugin.options = {

    };

})(window, window.jQuery);

// Initialise when the DOM is ready
$(function myPluginReady() {
    // $('div').myPlugin();
});
