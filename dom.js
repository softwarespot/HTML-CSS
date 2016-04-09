var domElements = (function domElementsModule() {
    // Fields

    // Node types
    var _nodeTypeDocumentNode = Node.DOCUMENT_NODE;
    var _nodeTypeFragmentNode = Node.DOCUMENT_FRAGMENT_NODE;

    // Polyfills

    // URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    var _elementClosest =
        Element.prototype.closest || function elementClosest(el, selector) {
            while (el && el.nodeType !== _nodeTypeFragmentNode && !matches(el, selector)) {
                el = el.parentNode;
            }

            return el || null;
        };

    // URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    var _elementMatches =
        Element.prototype.matches ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function elementMatches(el, selector) {
            var els = el.ownerDocument.querySelectorAll(selector);

            var index = 0;
            while (els[index] && el !== els[index]) {
                index++;
            }

            return !_isNil(els[index]);
        };

    // Public API
    return {
        after: after,
        append: append,
        around: wrap,
        before: before,
        closest: closest,
        contents: contents,
        empty: empty,
        getComputedStyles: getComputedStyles,
        inside: append,
        matches: matches,
        parent: parent,
        parents: parents,
        prepend: prepend,
        remove: remove,
        renew: replace,
        replace: replace,
        start: prepend,
        wrap: wrap,
        unwrap: unwrap,
    };

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
     * @param {Node} node Node to get the contents of
     * @return {NodeList} NodeList
     */
    function contents(node) {
        return node.contentDocument || node.childNodes;
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
     * Get the computed styles of a node
     *
     * @param {Node} node Node to retrieve the styles of
     * @return {object} Object of styles
     */
    function getComputedStyles(node) {
        return node.ownerDocument.defaultView.getComputedStyle(node, null);
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

        while (node.firstChild) {
            parentNode.insertBefore(node.firstChild, node);
        }

        parentNode.removeChild(node);
    }

    // Helper functions

    /**
     * Check if a variable is null or undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is null or undefined; otherwise, false
     */
    function _isNil(value) {
        return value === null || value === undefined;
    }
}());
