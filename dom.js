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

        // contents: contents,
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
     * @param {Node} el Node to insert after
     * @param {Node} elAfter Node to insert
     * @return {undefined}
     */
    function after(el, elAfter) {
        if (el.parentNode) {
            el.parentNode.insertBefore(elAfter, el.nextSibling);
        }
    }

    /**
     * Insert a node after an node's content
     *
     * @param {Node} el Node to append after
     * @param {Node} elAfter Node to append
     * @return {undefined}
     */
    function append(el, elAfter) {
        el.appendChild(elAfter);
    }

    /**
     * Insert a node before another node
     *
     * @param {Node} el Node to insert before
     * @param {Node} elAfter Node to insert
     * @return {undefined}
     */
    function before(el, elBefore) {
        if (el.parentNode) {
            el.parentNode.insertBefore(elBefore, el);
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

    // function contents(el) {
    //     return el.contentDocument || el.childNodes;
    // }

    /**
     * Empty the contents of a node
     * Idea by dom.js, URL: https://github.com/component/dom/blob/master/dom.js#L2789
     *
     * @param {Node} el Node to empty
     * @return {undefined}
     */
    function empty(el) {
        el.textContent = '';
    }

    /**
     * Get the computed styles of a node
     *
     * @param {Node} el Node to retrieve the styles of
     * @return {object} Object of styles
     */
    function getComputedStyles(el) {
        return el.ownerDocument.defaultView.getComputedStyle(el, null);
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
     * @param {Node} el Node to get the parent of
     * @return {Node|null} Node; otherwise, null
     */
    function parent(el) {
        var parent = el.parentNode;

        return parent && parent.nodeType !== _nodeTypeFragmentNode ? parent : null;
    }

    /**
     * Get the parents of a node
     *
     * @param {Node} el Node to get the parents of
     * @return {array} An array of nodes; otherwise, an empty array
     */
    function parents(el) {
        var parent = el.parentNode;

        var parents = [];
        while (parent && parent.nodeType !== _nodeTypeDocumentNode) {
            parents.push(parent);
            parent = parent.parentNode;
        }

        return parents;
    }

    /**
     * Insert a node before an node's content
     *
     * @param {Node} el Node to prepend before
     * @param {Node} elAfter Node to prepend
     * @return {undefined}
     */
    function prepend(el, elBefore) {
        el.insertBefore(elBefore, el.firstChild);
    }

    /**
     * Remove a node
     *
     * @param {Node} el Node to remove
     * @return {undefined}
     */
    function remove(el) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }

    /**
     * Replace a node with another node
     *
     * @param {Node} el Node to replace
     * @param {Node} elReplacement Node to replace with
     * @return {undefined}
     */
    function replace(el, elReplacement) {
        if (el.parentNode) {
            el.parentNode.replaceChild(elReplacement, el);
        }
    }

    /**
     * Wrap a node with another node
     *
     * @param {Node} el Node to wrap around
     * @param {Node} elWrap Node to wrap with
     * @return {undefined}
     */
    function wrap(el, elWrap) {
        before(el, elWrap);

        // Idea by Bliss, URL: https://github.com/LeaVerou/bliss/blob/gh-pages/bliss.shy.js#L624
        var reIsTemplate = /(?:^template$)/i;
        if (reIsTemplate.test(elWrap.nodeName) && elWrap.content) {
            elWrap = elWrap.content;
        }

        elWrap.appendChild(el);
    }

    /**
     * Unwrap a node
     * Idea by plainjs.com, URL: https://plainjs.com/javascript/manipulation/unwrap-a-dom-element-35/
     *
     * @param {Node} el Node to unwrap
     * @return {undefined}
     */
    function unwrap(el) {
        var parent = el.parentNode;

        while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
        }

        parent.removeChild(el);
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
