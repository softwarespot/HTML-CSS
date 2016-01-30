/**
 * Base module
 *
 * Modified: YYYY/MM/DD
 * @author author
 */
(function baseModule(root, name, factory, undefined) {
    // UMD (Universal Module Definition), URL: https://github.com/umdjs/umd or http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailcommonjs
    // More info, URL: http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/

    // Store a 'define' reference
    var define = root.define;

    // Store a 'module' reference
    var module = root.module;

    if (typeof define === 'function' && define.amd) {
        // AMD Module
        root.define(name, [], factory(root, root.document, root.$));
    } else if (module !== undefined && module.exports) {
        // Node.js Module
        module.exports = factory(root, root.document, root.$);
    } else if (root[name] === undefined) {
        // root e.g. window
        root[name] = factory(root, root.document, root.$); // new factory() if an ES2015 class
    } else {
        throw new root.Error('factory appears to be already registered with the root object, therefore the module has not been registered.');
    }
}(window, 'moduleName', function baseInterface(window, document, $, undefined) {
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
    $(function baseInterfaceReady() {
        // init({});
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion,
    };
}));
