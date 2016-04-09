var domElements = (function domElementsModule(document, Array, Element, Node, Object, Window) {
    // Fields

    // Parsing the native toString() return value e.g. [object Object]
    var _reTypeOf = /(?:^\[object\s(.*?)\]$)/;

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

            var index = 0;
            while (nodes[index] && node !== nodes[index]) {
                index++;
            }

            return !!nodes[index];
        };

    var _objectToString = Object.prototype.toString;

    // Public API
    return {
        $$: $$,
        $: $,
        after: after,
        append: append,
        around: wrap,
        before: before,
        children: children,
        closest: closest,
        contents: contents,
        empty: empty,
        inside: append,
        is: matches,
        matches: matches,
        next: next,
        nextAll: nextAll,
        parent: parent,
        parents: parents,
        prepend: prepend,
        prev: previous,
        previous: previous,
        prevAll: previousAll,
        previousAll: previousAll,
        remove: remove,
        renew: replace,
        replace: replace,
        siblings: siblings,
        start: prepend,
        styles: styles,
        unwrap: unwrap,
        wrap: wrap,

        // Helper functions not related to DOM traversal or manipulation
        toArray: _arrayFrom,
        type: type,
    };

    /**
     * Wrapper for *.querySelector
     * Idea by Bliss, URL: https://github.com/LeaVerou/bliss/blob/gh-pages/bliss.js
     *
     * @param {string} selector Selector string
     * @param {object|null|undefined} context Node to query on. Default is document if falsy
     * @return {Node|null} A node; otherwise, null on error
     */
    function $(selector, context) {
        return type(selector) === 'string' ?
            (context || document).querySelector(selector) :
            (selector || null);
    }

    /**
     * Wrapper for *.querySelectorAll
     * Idea by Bliss, URL: https://github.com/LeaVerou/bliss/blob/gh-pages/bliss.js
     *
     * @param {string} selector Selector string
     * @param {object|null|undefined} context Node to query on. Default is document if falsy
     * @return {array} An array of nodes; otherwise, an empty array on error
     */
    function $$(selector, context) {
        if (selector instanceof Node || selector instanceof Window) {
            return [selector];
        }

        return type(selector) === 'string' ?
            _arrayFrom((context || document).querySelectorAll(selector)) :
            (selector || []);
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
     * Insert a node after an node's content
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
        var nodes = node.childNodes;

        // Enforce the default value
        var allNodes = jQueryLike !== true;

        return _arrayFilter.call(nodes, function filter(node) {
            return allNodes || node.nodeType === _nodeTypeElementNode;
        });
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
     * Get the contents of a node
     *
     * @param {HTMLIFrameElement|Node} el HTMLIFrameElement/Node to get the contents of
     * @return {Document|array} A Document if an iFrame/an array of nodes; otherwise, an empty array on error
     */
    function contents(el) {
        var contents = el.documentContent;
        if (contents) {
            return contents;
        }

        return _arrayFrom(el.childNodes);
    }

    /**
     * Empty the contents of a node
     * Idea by dom.js, URL: https://github.com/component/dom/blob/master/dom.js#L2789
     *
     * @param {Node} node Node to empty
     * @return {undefined}
     */
    function empty(node) {
        node.textContent = '';
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
        return _sibling(node, jQueryLike, 'nextSibling');
    }

    /**
     * Get the next siblings of a node
     *
     * @param {Node} node Node to get the next siblings of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {array} Array of next sibling nodes; otherwise, an empty array on error
     */
    function nextAll(node, jQueryLike) {
        return _siblingAll(node, jQueryLike, 'nextSibling');
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
     * Insert a node before an node's content
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
        return _sibling(node, jQueryLike, 'previousSibling');
    }

    /**
     * Get the previous siblings of a node
     *
     * @param {Node} node Node to get the previous siblings of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {array} Array of previous sibling nodes; otherwise, an empty array on error
     */
    function previousAll(node, jQueryLike) {
        return _siblingAll(node, jQueryLike, 'previousSibling');
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
        var siblingNodes = [];

        var siblingNode = node.parentNode;
        if (!siblingNode) {
            return siblingNodes;
        }

        // Enforce the default value
        var allNodes = jQueryLike !== true;

        siblingNode = siblingNode.firstChild;
        while (siblingNode) {
            if (node !== siblingNode && (allNodes || siblingNode.nodeType === _nodeTypeElementNode)) {
                siblingNodes.push(siblingNode);
            }

            siblingNode = siblingNode.nextSibling;
        }

        return siblingNodes;
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
     * An advanced variation of typeOf, that returns the classname instead of the primitive datatype e.g. 'array', 'date', 'null', 'regexp', string'
     * Idea by JavaScript Weblog, URL: https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
     *
     * @param {mixed} value Variable to check
     * @return {string} Classname of the value
     */
    function type(value) {
        var tag = _objectToString
            .call(value)
            .replace(_reTypeOf, '$1')
            .toLowerCase();
        if (tag === 'number' && value !== value) { // eslint-disable-line
            // Override number if a NaN
            tag = 'nan';
        }

        return tag;
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

        // Idea by Bliss, URL: https://github.com/LeaVerou/bliss/blob/gh-pages/bliss.shy.js#L624
        var reIsTemplate = /(?:^template$)/i;
        if (reIsTemplate.test(nodeWrap.nodeName) && nodeWrap.content) {
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
     * Get the first sibling of a node based on a type e.g. next/previous
     *
     * @param {Node} node Node to get the sibling type of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @param {string} type Sibling type e.g. nextSibling or previousSibling
     * @return {Node} A sibling node; otherwise, null on error
     */
    function _sibling(node, jQueryLike, type) {
        // Enforce the default value
        var allNodes = jQueryLike !== true;

        var sibling = node[type];
        while (!allNodes && sibling && sibling.nodeType !== _nodeTypeElementNode) {
            sibling = sibling[type];
        }

        return sibling;
    }

    /**
     * Get all the siblings of a node based on a type e.g. next/previous
     *
     * @param {Node} node Node to get all the sibling types of
     * @param {boolean} jQueryLike Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @param {string} type Sibling type e.g. nextSibling or previousSibling
     * @return {array} An array of sibling nodes based on the type; otherwise, an empty array on error
     */
    function _siblingAll(node, jQueryLike, type) {
        // Enforce the default value
        var allNodes = jQueryLike !== true;
        var siblingNodes = [];

        var siblingNode = node[type];
        while (siblingNode) {
            if (allNodes || siblingNode.nodeType === _nodeTypeElementNode) {
                siblingNodes.push(siblingNode);
            }

            siblingNode = siblingNode[type];
        }

        return siblingNodes;
    }
}(window.document, window.Array, window.Element, window.Node, window.Object, window.Window));
