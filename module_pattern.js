/* global App */

// Create an 'App' namespace if it doesn't already exist
App = App || {};

/**
 * Base module
 *
 * Modified: YYYY/MM/DD
 * @author author
 */
App.base = (function baseModule(window, document, $, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = '27AB85AB-3AD5-42C6-A086-30FF65668693';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

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

        _cacheDom();

        _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        _isInitialised = false;
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
    function _cacheDom() {
        // Empty
    }

    // Invoked when the DOM has loaded
    $(function baseModuleReady() {
        // init({});
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion,
    };
})(window, window.document, window.jQuery);
