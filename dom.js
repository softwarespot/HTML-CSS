var domElements = (function domElementsModule(
    window,
    document,
    undefined,
    head,
    body,
    Array,
    Date,
    Element,
    Function,
    isFinite,
    isNaN,
    JSON,
    Node,
    Number,
    Object,
    parseFloat,
    Promise,
    Window
) {
    // Semver of the module
    var VERSION = '0.5.0';

    // Fields

    // Node types
    var _nodeTypeDocumentNode = Node.DOCUMENT_NODE;
    var _nodeTypeFragmentNode = Node.DOCUMENT_FRAGMENT_NODE;
    var _nodeTypeElementNode = Node.ELEMENT_NODE;

    // Polyfills and caching

    var _arrayPrototype = Array.prototype;

    var _arrayFilter = _arrayPrototype.filter;
    var _arraySlice = _arrayPrototype.slice;
    var _arrayFrom = Array.from || function arrayFrom(arrayLike) {
        return _arraySlice.call(arrayLike);
    };

    var _elementPrototype = Element.prototype;

    // URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    var _elementClosest =
        _elementPrototype.closest || function elementClosest(el, selector) {
            var parentNode = el;
            while (parentNode && parentNode.nodeType !== _nodeTypeFragmentNode && !matches(parentNode, selector)) {
                parentNode = parentNode.parentNode;
            }

            return parentNode || null;
        };

    // URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    var _elementMatches =
        _elementPrototype.matches ||
        _elementPrototype.mozMatchesSelector ||
        _elementPrototype.msMatchesSelector ||
        _elementPrototype.webkitMatchesSelector ||
        function elementMatches(node, selector) {
            var nodes = (node.ownerDocument || document).querySelectorAll(selector);

            var i = 0;
            while (nodes[i] && node !== nodes[i]) {
                i++;
            }

            // Coerce as a boolean datatype
            return !!nodes[i];
        };

    var _numberIsNaN = Number.isNaN || isNaN;
    var _numberParseFloat = Number.parseFloat || parseFloat;

    var _objectPrototype = Object.prototype;

    var _objectCreate = Object.create;
    var _objectHasOwnProperty = _objectPrototype.hasOwnProperty;
    var _objectKeys = Object.keys;
    var _objectGetPrototypeOf = Object.getPrototypeOf;
    var _objectToString = _objectPrototype.toString;
    var _objectEmpty = _objectCreate(null);

    // An object as a string
    var _createFnToString = _objectHasOwnProperty.toString;
    var _fnToString = _createFnToString.call(Object);

    // DOM ready related variables
    var _domReadyDefer = deferred();
    var _domReadyResolve = _domReadyDefer.resolve;

    // Idea by Bliss, URL: https://github.com/LeaVerou/bliss/blob/gh-pages/bliss.shy.js#L624
    var _reIsTemplate = /(?:^template$)/i;

    // Parsing the native toString() return value e.g. [object Object]
    var _reTypeOf = /(?:^\[object\s(.*?)\]$)/;

    // Cache the classname types
    var _types = _objectCreate(null);

    _domReady();

    // Make each ID a global variable on the global object
    // Many browsers do this anyway (it’s in the HTML5 specification)
    // Idea by PrismJS, URL: https://github.com/PrismJS/prism/blob/gh-pages/utopia.js#L39
    $$('[id]').filter(function filterId(el) {
        // Coerce as a boolean datatype
        return !!el.id;
    }).forEach(function forEachId(el) {
        window[el.id] = el;
    });

    // Public API
    return {
        $: $,
        $$: $$,
        after: after,
        append: append,
        around: wrap,
        before: before,
        children: children,
        clone: clone,
        closest: closest,
        contains: contains,
        contents: contents,
        detach: remove,
        empty: empty,
        html: html,
        inside: append,
        is: is,
        matches: matches,
        next: next,
        nextAll: nextAll,
        parent: parent,
        parents: parents,
        prepend: prepend,
        prev: previous,
        prevAll: previousAll,
        previous: previous,
        previousAll: previousAll,
        remove: remove,
        renew: replace,
        replace: replace,
        replaceWith: replace,
        siblings: siblings,
        start: prepend,
        styles: styles,
        text: text,
        unwrap: unwrap,
        wrap: wrap,

        // Helper functions not related to DOM traversal or manipulation
        arrayFrom: _arrayFrom,
        deferred: deferred,
        extend: extend,
        getScript: getScript,
        globalEval: globalEval,
        isArray: Array.isArray,
        isEmptyObject: isEmptyObject,
        isFunction: isFunction,
        isNumeric: isNumeric,
        isPlainObject: isPlainObject,
        isWindow: isWindow,
        makeArray: _arrayFrom,
        noop: noop,
        now: Date.now,
        parseHTML: parseHTML,
        parseJSON: JSON.parse,
        ready: ready,
        type: type,
        version: version,
    };

    // Public function(s)

    /**
     * Wrapper for *.querySelector
     * Idea by Bliss, URL: https://github.com/LeaVerou/bliss/blob/gh-pages/bliss.js
     *
     * @param {string} selector Selector string
     * @param {Node|null|undefined} context Node to query on. Default is document if left falsy i.e. undefined
     * @return {Node|null} A node; otherwise, null on error
     */
    function $(selector, context) {
        if (_isNode(selector) || selector instanceof Window) {
            return selector;
        }

        return type(selector) === 'string' ?
            (context || document).querySelector(selector) :
            null;
    }

    /**
     * Wrapper for *.querySelectorAll
     * Idea by Bliss, URL: https://github.com/LeaVerou/bliss/blob/gh-pages/bliss.js
     *
     * @param {string} selector Selector string
     * @param {Node|null|undefined} context Node to query on. Default is document if left falsy i.e. undefined
     * @return {array} An array of nodes; otherwise, an empty array on error
     */
    function $$(selector, context) {
        if (_isNode(selector) || selector instanceof Window) {
            return [selector];
        }

        return type(selector) === 'string' ?
            _arrayFrom((context || document).querySelectorAll(selector)) :
            [];
    }

    /**
     * Insert a node after another node
     *
     * @param {Node} node Node to insert after
     * @param {Node} nodeAfter Node to insert
     * @return {undefined}
     */
    function after(node, nodeAfter) {
        if (node.parentNode) {
            node.parentNode.insertBefore(nodeAfter, node.nextSibling);
        }
    }

    /**
     * Insert a node after a node's content
     *
     * @param {Node} node Node to append after
     * @param {Node} nodeAfter Node to append
     * @return {undefined}
     */
    function append(node, nodeAfter) {
        node.appendChild(nodeAfter);
    }

    /**
     * Insert a node before another node
     *
     * @param {Node} node Node to insert before
     * @param {Node} nodeAfter Node to insert
     * @return {undefined}
     */
    function before(node, nodeBefore) {
        if (node.parentNode) {
            node.parentNode.insertBefore(nodeBefore, node);
        }
    }

    /**
     * Get the children of a node
     *
     * @param {Node} node Node to get the children of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {array} Array of nodes/elements; otherwise, an empty array on error
     */
    function children(node, jQueryLike) {
        // Enforce the default value
        var allNodes = (jQueryLike !== true);

        return _arrayFilter.call(node.childNodes, function filter(node) {
            return allNodes || node.nodeType === _nodeTypeElementNode;
        });
    }

    /**
     * Clone a node
     *
     * @param {Node} node Node to clone
     * @param {boolean} deep Set as true to create a deep copy with all inner nodes. Default is false
     * @return {Node} Cloned node
     */
    function clone(node, deep) {
        // Enforce the default value
        deep = (deep === true);

        return node.cloneNode(deep);
    }

    /**
     * Get the closest element node using a selector string
     * Idea by jonathantneal, URL: https://github.com/jonathantneal/closest/blob/master/closest.js
     *
     * @param {Element} el Element node to start searching from
     * @param {string} selector Selector string
     * @return {Element|null} Closest element node; otherwise, null on error
     */
    function closest(el, selector) {
        return _elementClosest.call(el, selector);
    }

    /**
     * Check if a node contains another node i.e. is a descendant of its parent node
     *
     * @param {Node} node Node to use as the parent
     * @param {Node} nodeDescendant Node use as the descendant
     * @return {boolean} True, the descendant node is a descendant of the parent node; otherwise, false
     */
    function contains(node, nodeDescendant) {
        return node !== nodeDescendant && node.contains(nodeDescendant);
    }

    /**
     * Get the contents of a node
     *
     * @param {HTMLIFrameElement|Node} nodeEl HTMLIFrameElement/Node to get the contents of
     * @return {Document|array} A Document if an iFrame/an array of nodes; otherwise, an empty array on error
     */
    function contents(nodeEl) {
        var contents = nodeEl.documentContent;
        if (contents) {
            return contents;
        }

        return _arrayFrom(nodeEl.childNodes);
    }

    /**
     * Create a deferred
     *
     * @param {function|undefined} fn An optional function to call with deferred object
     * @return {object} An object with the property function 'promise, 'resolve' and 'reject'
     */
    function deferred(fn) {
        var defer = _objectCreate(null);

        var promise = new Promise(function promiseCreate(resolve, reject) {
            defer.resolve = resolve;
            defer.reject = reject;
        });

        defer.promise = function promiseDeferred() {
            return promise;
        };

        // Pass the deferred object to the callback function
        if (type(fn) === 'function') {
            fn(defer);
        }

        return defer;
    }

    /**
     * Empty the contents of a node
     * Idea by dom.js, URL: https://github.com/component/dom/blob/master/dom.js#L2789
     *
     * @param {Node} node Node to empty
     * @return {undefined}
     */
    function empty(node) {
        text(node, '');
    }

    /**
     * Extend a target object with a list of source objects
     * Idea by MDN, URL: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
     *
     * @param {object} target Target object to extend
     * @param {object0..objectN} ...sources Source objects to extend with
     * @return {object} Extended target object
     */
    function extend(target) {
        target = Object(target);
        _arrayFrom(arguments).filter(function filterArgs(source, index) {
            // Remove the target object and sources which are nil
            return index !== 0 || !_isNil(source);
        }).forEach(function extendTarget(source) {
            _objectKeys(source).forEach(function extendWithSource(key) {
                target[key] = source[key];
            });
        });

        return target;
    }

    /**
     * Load a script file
     * Idea by Liam Newmarch, URL: http://liamnewmarch.co.uk/promises/
     *
     * @param {string} sourceFile Script file to load
     * @param {Node|null|undefined} context Node to append to. Default is head if left falsy i.e. undefined
     * @return {promise} A promise that is resolved once the script has been loaded. The script file url is passed on success
     */
    function getScript(sourceFile, context) {
        var defer = deferred();
        var node = document.createElement('script');

        // Set the source attribute
        node.src = sourceFile;

        // Set script loading to be asynchronous
        node.async = true;

        // node.crossOrigin = 'anonymous';

        // On successful script load
        function onResolve() {
            defer.resolve(sourceFile);
            removeEvents();
        }

        // On script loading failure
        function onReject() {
            defer.reject(sourceFile);
            removeEvents();
        }

        // Remove the assigned event listeners and remove the promise function references
        function removeEvents() {
            node.removeEventListener('load', onResolve);
            node.removeEventListener('error', onReject);
        }

        node.addEventListener('load', onResolve);
        node.addEventListener('error', onReject);

        (context || head).appendChild(node);

        return defer.promise();
    }

    /**
     * Globally evaluate code
     *
     * @param {string} code Code to be evaluated
     * @return {undefined}
     */
    function globalEval(code) {
        // Similar to eval, but doesn't inherit the current scope, as it's an anonymous function
        var fn = Function(code); // eslint-disable-line no-new-func
        fn();
    }

    /**
     * Get the HTML of a node
     *
     * @param {Node} node Node to retrieve the HTML of
     * @param {string} htmlString HTML string to apply. If left undefined this is used as a getter
     * @return {string|undefined} HTML of the node; otherwise, undefined if used as a setter
     */
    function html(node, htmlString) {
        if (htmlString === undefined) {
            return node.innerHTML;
        }

        node.innerHTML = htmlString;

        return undefined;
    }

    /**
     * Check if two nodes are exactly the same reference
     *
     * @param {Node} node Node to check
     * @param {Node} nodeDup Other node to check
     * @return {boolean} True, both nodes point to the same reference; otherwise, false
     */
    function is(node, nodeOther) {
        return node === nodeOther;
    }

    /**
     * Check if an object is empty
     *
     * @param {object} object Object to check is empty
     * @return {boolean} True, the object is empty
     */
    function isEmptyObject(object) {
        return type(object) === 'object' && _objectKeys(object).length === 0;
    }

    /**
     * Check if a value is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        var type = type(value);

        return type === 'function' || type === 'generatorfunction';
    }

    /**
     * Check if a value is numerical
     * Idea from jQuery 3.0
     *
     * @param {mixed} value Value to check is numerical
     * @return {boolean} True, the value is numerical; otherwise, false
     */
    function isNumeric(value) {
        var type = type(value);

        return (type === 'number' || type === 'string') && !_numberIsNaN(value - _numberParseFloat(value));
    }

    /**
     * Check if an object is a plain object
     * Idea by jQuery, URL: https://github.com/jquery/jquery/blob/master/src/core.js#L233
     *
     * @param {mixed} object Object to check
     * @return {boolean} True, is a plain object; otherwise, false
     */
    function isPlainObject(object) {
        if (!object || type(object) !== 'object') {
            return false;
        }

        var prototype = _objectGetPrototypeOf(object);

        // Objects with no prototype (e.g. Object.create(null)) are plain objects
        if (!prototype) {
            return true;
        }

        // Objects with prototype are plain if they were constructed by a global Object function
        var cTor = _objectHasOwnProperty.call(prototype, 'constructor') && prototype.constructor;
        return type(cTor) === 'function' && _createFnToString.call(cTor) === _fnToString;
    }

    /**
     * Check if an object is a window
     *
     * @param {object} object Object to check
     * @return {boolean} True, the object is window; otherwise, false
     */
    function isWindow(object) {
        return object && object === object.window;
    }

    /**
     * Check if an element node matches a selector string
     * Idea by jonathantneal, URL: https://github.com/jonathantneal/closest/blob/master/closest.js
     *
     * @param {Element} el Element node to match on
     * @param {string} selector Selector string
     * @return {Element|null} True, the element node matches the selector string; otherwise, false
     */
    function matches(el, selector) {
        return _elementMatches.call(el, selector);
    }

    /**
     * Get the next sibling of a node
     *
     * @param {Node} node Node to get the next sibling of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {Node} Next sibling nodes; otherwise, null on error
     */
    function next(node, jQueryLike) {
        return _sibling(node, node, jQueryLike, 'nextSibling');
    }

    /**
     * Get the next siblings of a node
     *
     * @param {Node} node Node to get the next siblings of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {array} Array of next sibling nodes; otherwise, an empty array on error
     */
    function nextAll(node, jQueryLike) {
        return _siblingAll(node, node, jQueryLike, 'nextSibling');
    }

    /**
     * Create an empty function
     *
     * @return {function} Empty function
     */
    function noop() {
        return function noop() {};
    }
    /**
     * Get the parent of a node
     *
     * @param {Node} node Node to get the parent of
     * @return {Node|null} Node; otherwise, null
     */
    function parent(node) {
        var parentNode = node.parentNode;

        return parentNode && parentNode.nodeType !== _nodeTypeFragmentNode ? parentNode : null;
    }

    /**
     * Get the parents of a node
     *
     * @param {Node} node Node to get the parents of
     * @return {array} An array of nodes; otherwise, an empty array
     */
    function parents(node) {
        var parentNode = node.parentNode;

        var parentNodes = [];
        while (parentNode && parentNode.nodeType !== _nodeTypeDocumentNode) {
            parentNodes.push(parentNode);
            parentNode = parentNode.parentNode;
        }

        return parentNodes;
    }

    /**
     * Parse a HTML string to nodes
     *
     * @param {string} htmlString HTML string to parse
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {array} Array of nodes/elements; otherwise, an empty array on error
     */
    function parseHTML(htmlString, jQueryLike) {
        var context = document.implementation.createHTMLDocument();

        // Idea by jQuery, URL: https://github.com/jquery/jquery/blob/master/src/core/parseHTML.js#L36
        // Set the base href for the created document so any parsed elements with URLs
        // are based on the document's URL
        var base = context.createElement('base');
        base.href = document.location.href;
        context.head.appendChild(base);

        context.body.innerHTML = htmlString;

        return children(context.body, jQueryLike);
    }

    /**
     * Insert a node before a node's content
     *
     * @param {Node} node Node to prepend before
     * @param {Node} nodeAfter Node to prepend
     * @return {undefined}
     */
    function prepend(node, nodeBefore) {
        node.insertBefore(nodeBefore, node.firstChild);
    }

    /**
     * Get the previous sibling of a node
     *
     * @param {Node} node Node to get the previous sibling of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {Node} Previous sibling nodes; otherwise, null on error
     */
    function previous(node, jQueryLike) {
        return _sibling(node, node, jQueryLike, 'previousSibling');
    }

    /**
     * Get the previous siblings of a node
     *
     * @param {Node} node Node to get the previous siblings of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {array} Array of previous sibling nodes; otherwise, an empty array on error
     */
    function previousAll(node, jQueryLike) {
        return _siblingAll(node, node, jQueryLike, 'previousSibling');
    }

    /**
     * Invoke a function once the DOM has loaded
     *
     * @param {function} fn Callback function to invoke
     * @return {promise} A promise that is resolved once the DOM is ready
     */
    function ready(fn) {
        var promise = _domReadyDefer.promise();
        if (type(fn) === 'function') {
            promise.then(fn);
        }

        var defer = deferred();
        promise.then(function then() {
            defer.resolve();
        });

        return defer.promise();
    }

    /**
     * Remove a node
     *
     * @param {Node} node Node to remove
     * @return {undefined}
     */
    function remove(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }

    /**
     * Replace a node with another node
     *
     * @param {Node} node Node to replace
     * @param {Node} nodeReplacement Node to replace with
     * @return {undefined}
     */
    function replace(node, nodeReplacement) {
        if (node.parentNode) {
            node.parentNode.replaceChild(nodeReplacement, node);
        }
    }

    /**
     * Get the siblings of a node
     *
     * @param {Node} node Node to get the siblings of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {array} Array of nodes/elements; otherwise, an empty array on error
     */
    function siblings(node, jQueryLike) {
        // Could use node.parentNode.children if other node types are not required
        return _siblingAll(node, (node.parentNode || _objectEmpty).firstChild, jQueryLike, 'nextSibling');
    }

    /**
     * Get the computed styles of a node
     *
     * @param {Node} node Node to retrieve the styles of
     * @return {object} Object of styles
     */
    function styles(node) {
        return node.ownerDocument.defaultView.getComputedStyle(node, null);
    }

    /**
     * Get the text of a node
     *
     * @param {Node} node Node to retrieve the text of
     * @param {string} textString Text string to apply. If left undefined this is used as a getter
     * @return {string|undefined} Text of the node; otherwise, undefined if used as a setter
     */
    function text(node, textString) {
        if (type(textString) === 'undefined') {
            return node.textContent;
        }

        node.textContent = textString;

        return undefined;
    }

    /**
     * An advanced variation of typeOf, that returns the classname instead of the primitive datatype e.g. 'array', 'date', 'null', 'regexp', 'string'
     * Idea by JavaScript Weblog, URL: https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
     *
     * @param {mixed} value Variable to check
     * @return {string} Classname of the value
     */
    function type(value) {
        if (value === null || value === undefined) {
            return ('' + value);
        }

        var type = typeof value;
        if (type !== 'function' && type !== 'object') {
            return type;
        }

        var classString = _objectToString.call(value);

        // Check the internal cache
        type = _types[classString];
        if (type) {
            return type;
        }

        type = classString.replace(_reTypeOf, '$1').toLowerCase();

        // Set the internal cache
        _types[classString] = type;

        return type;
    }

    /**
     * Wrap a node with another node
     *
     * @param {Node} node Node to wrap around
     * @param {Node} nodeWrap Node to wrap with
     * @return {undefined}
     */
    function wrap(node, nodeWrap) {
        before(node, nodeWrap);

        if (_reIsTemplate.test(nodeWrap.nodeName) && nodeWrap.content) {
            nodeWrap = nodeWrap.content;
        }

        nodeWrap.appendChild(node);
    }

    /**
     * Unwrap a node
     * Idea by plainjs.com, URL: https://plainjs.com/javascript/manipulation/unwrap-a-dom-element-35/
     *
     * @param {Node} node Node to unwrap
     * @return {undefined}
     */
    function unwrap(node) {
        var parentNode = node.parentNode;
        if (!parentNode) {
            return;
        }

        while (node.firstChild) {
            parentNode.insertBefore(node.firstChild, node);
        }

        parentNode.removeChild(node);
    }

    /**
     * Get the semver of the module
     *
     * @return {string} Semver numver
     */
    function version() {
        return VERSION;
    }

    // Private function(s)

    /**
     * Register events for DOM ready
     *
     * @return {undefined}
     */
    function _domReady() {
        /**
         * Callback function for the DOM ready addEventListener calls
         *
         * @return {undefined}
         */
        function _domContentLoaded() {
            if (_domReadyResolve === null) {
                return;
            }

            _domReadyResolve();

            // Set to null to indicate the DOM is ready
            _domReadyResolve = null;

            // Clear up the event handlers
            document.removeEventListener('DOMContentLoaded', _domContentLoaded);
            window.removeEventListener('load', _domContentLoaded);
        }

        // Check if the DOM has completed loading or is not in a loading state
        if (document.readyState === 'complete' || document.readyState !== 'loading') {
            _domContentLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', _domContentLoaded);

            // Fallback to when the window has been fully loaded. This will always be called
            window.addEventListener('load', _domContentLoaded);
        }
    }

    /**
     * Check if a variable is null or undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is null or undefined; otherwise, false
     */
    function _isNil(value) {
        var type = type(value);

        return type === 'null' || type === 'undefined';
    }

    /**
     * Check if a variable is a node and optional type
     *
     * @param {Node} node Node to check
     * @param {number} type Optional Node.* type value to check
     * @return {boolean} True, is a node and optional node type; otherwise, false
     */
    function _isNode(node, type) {
        return node instanceof Node && (!type || node.nodeType === type);
    }

    /**
     * Get the first sibling of a node based on the type e.g. next/previous
     *
     * @param {Node} node Node that was initially provided
     * @param {Node} startNode Starting node to get the sibling type of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @param {string} type Sibling type e.g. nextSibling or previousSibling
     * @return {Node} A sibling node; otherwise, null on error
     */
    function _sibling(node, startNode, jQueryLike, type) {
        // Enforce the default value
        var allNodes = (jQueryLike !== true);

        var siblingNode = startNode[type];
        while (!allNodes && siblingNode && siblingNode.nodeType !== _nodeTypeElementNode) {
            if (node !== siblingNode) {
                siblingNode = siblingNode[type];
            }
        }

        return siblingNode;
    }

    /**
     * Get all the siblings of a node based on the type e.g. next/previous
     *
     * @param {Node} node Node that was initially provided
     * @param {Node} startNode Starting node to get the sibling types of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @param {string} type Sibling type e.g. nextSibling or previousSibling
     * @return {array} An array of sibling nodes based on the type; otherwise, an empty array on error
     */
    function _siblingAll(node, startNode, jQueryLike, type) {
        // Enforce the default value
        var allNodes = (jQueryLike !== true);
        var siblingNodes = [];

        var siblingNode = startNode[type];
        while (siblingNode) {
            if (node !== siblingNode && (allNodes || siblingNode.nodeType === _nodeTypeElementNode)) {
                siblingNodes.push(siblingNode);
            }

            siblingNode = siblingNode[type];
        }

        return siblingNodes;
    }
}(
    window,
    window.document,
    void 0,
    window.document.head,
    window.document.body,
    window.Array,
    window.Date,
    window.Element,
    window.Function,
    window.isFinite,
    window.isNaN,
    window.JSON,
    window.Node,
    window.Number,
    window.Object,
    window.parseFloat,
    window.Promise,
    window.Window
));
