/* global */

// Create an 'App' namespace if it doesn't already exist
var App = App || {};

/**
 * Base module
 *
 * Modified: YYYY/MM/DD
 * @author author
 */
App.base = (function ($, window, document, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = 'EBF09F7D-008B-4B56-8227-0B5378649968';

    // Fields

    // Methods

    /**
     * Initialisation function
     *
     * @return {undefined}
     */
    function init(config) {
        // Default config that can be overwritten by passing through the config variable
        var defaultConfig = {};

        // Combine the passed config
        $.extend(defaultConfig, config);

        cacheDom();
    }

    /**
     * Get the version number of the module
     *
     * @returns {number} Version number
     */
    function getVersion() {
        return VERSION;
    }

    /**
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    function cacheDom() {}

    // Invoked when the DOM has loaded
    $(function () {
        init({});
    });

    // Public API
    return {
        getVersion: getVersion
    };
})(jQuery, window, document);
