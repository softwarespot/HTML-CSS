/**
 * Base module
 *
 * Modified: YYYY/MM/DD
 * @author author
 */
(function (global, name, iModule, undefined) {
    // Module related logic, URL: http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailcommonjs

    // Store a 'module' reference
    var module = global.module;

    // Store a 'define' reference
    var define = global.define;

    if (module !== undefined && module.exports) {
        // Node.js Module
        module.exports = iModule;
    } else if (typeof define === 'function' && define.amd) {
        // AMD Module
        global.define(name, [], iModule);
    } else if (global[name] === undefined) {
        global[name] = iModule; // new iModule() if an ES2015 class
    } else {
        throw new Error('iModule appears to be already registered with the global object, therefore the module has not been registered.');
    }

})(this, 'moduleName', (function (window, document, $, undefined) {
    // Interface related logic

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
    $(function () {
        // init({});
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion
    };
})(this, this.document, this.jQuery));
