/*global console*/

var request = (function request(document, setTimeout) {
    var api = {
        callbacks: {},
        jsonp: jsonp,
    };
    var _id = 0;

    return api;

    /**
     * Simple JSON-P implementation
     */
    function jsonp(url, options) {
        var noop = function noop() {};
        options.on.failure = options.on.failure || noop;
        options.on.success = options.on.success || noop;
        options.on.timeout = options.on.timeout || noop;

        var callback = 'req' + _id++;
        var params = options.params;
        params += '&callback=request.callbacks.' + callback;

        // Create script element
        var script = document.createElement('script');
        script.async = true;
        script.src = url + '?' + params;

        // Set callback functions
        script.addEventListener('error', function error() {
            options.on.failure();
            _destroy();
        });

        api.callbacks[callback] = function success(response) {
            options.on.success(response);
            _destroy();
        };

        setTimeout(function timeout() {
            options.on.timeout();
            _destroy();
        }, options.timeout || 10000);

        // Inject script
        setTimeout(function setTimeout() {
            document.head.appendChild(script);
        }, 5);

        // Clear the global callback function
        function _destroy() {
            api.callbacks[callback] = noop;
        }
    }
}(window.document, window.setTimeout));

request.jsonp('https://api.ipify.org', {
    params: 'format=jsonp',
    on: {
        success: function success(response) {
            console.log(response);
        },
    },
    timeout: 10000,
});
