/*global console, Promise*/

var jsonp = (function jsonpModule(document, Object, Promise, encodeURIComponent, setTimeout) {
    var _api = {
        callbacks: {},
        get: get,
    };
    var _id = 0;
    var _noop = function noop() {};

    return _api;

    /**
     * Simple JSON-P implementation
     */
    function get(url, params) {
        params = params || {};

        var error = _noop;
        var success = _noop;

        var promise = new Promise(function promise(resolve, reject) {
            success = resolve;
            error = reject;
        });

        var callback = 'get' + _id++;

        // Extend with the (optional) callback function parameter
        var extend = {};
        extend[params.callback || 'callback'] = 'jsonp.callbacks.' + callback;

        params = Object.assign(params, extend);

        // Create the query parameter string
        var queryString = '?' + Object.keys(params).map(function mapKeys(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');

        // Create script element
        var script = document.createElement('script');
        script.async = true;
        script.src = url + queryString;

        // Set callback function(s)
        script.addEventListener('error', function errorEvent() {
            _destroy();
            error();
        });

        _api.callbacks[callback] = function successEvent(response) {
            _destroy();
            success(response);
        };

        // Inject script
        setTimeout(function setTimeout() {
            document.head.appendChild(script);
        }, 0);

        return promise;

        // Destroy the JSON-P callback function and script element node
        function _destroy() {
            _api.callbacks[callback] = _noop;
            script.parentNode.removeChild(script);
        }
    }
}(
    document,
    Object,
    Promise,
    encodeURIComponent,
    setTimeout
));

jsonp.get('https://api.ipify.org', {
    format: 'jsonp',
}).then(function success(response) {
    console.log(response);
}).catch(function error() {
    console.log('An error occurred. As to what that error was, it\'s hard to determine using JSON-P');
});
