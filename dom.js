var dom = (function domModule(Object) {
    // Fields
    var _nativeObjectToString = Object.prototype.toString;

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

    // URL: https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
    var _elementRemove =
        Element.prototype.remove ||
        function elementRemove(el) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        };


    // Public API
    return {
        after: after,
        append: append,
        around: wrap,
        before: before,
        closest: closest,
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
        unwrap: unwrap
    };

    /**
     * Insert an element after an element node
     *
     * @param {HTMLElement} el Element node to insert after
     * @param {HTMLElement} elAfter Element node to insert
     * @return {undefined}
     */
    function after(el, elAfter) {
        if (el.parentNode) {
            el.parentNode.insertBefore(elAfter, el.nextSibling);
        }
    }

    /**
     * Insert an element after an element node's content
     *
     * @param {HTMLElement} el Element node to insert after
     * @param {HTMLElement} elAfter Element node to insert
     * @return {undefined}
     */
    function append(el, elAfter) {
        el.appendChild(elAfter);
    }

    /**
     * Insert an element before an element node
     *
     * @param {HTMLElement} el Element node to insert before
     * @param {HTMLElement} elAfter Element node to insert
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
     * @param {HTMLElement} el Element node to start from
     * @param {string} selector Selector string
     * @return {HTMLElement|null} Closest element node; otherwise, null on error
     */
    function closest(el, selector) {
        return _elementClosest.call(el, selector);
    }

    /**
     * Empty the contents of an element node
     * Idea by dom.js, URL: https://github.com/component/dom/blob/master/dom.js#L2789
     *
     * @param {HTMLElement} elAfter Element node to empty
     * @return {undefined}
     */
    function empty(el) {
        el.textContent = '';
    }

    /**
     * Get the computed styles of an element
     *
     * @param {HTMLElement} el Element node to get the styles of
     * @return {undefined}
     */
    function getComputedStyles(el) {
        el.ownerDocument.defaultView.getComputedStyle(el, null);
    }

    /**
     * Check if an element node matches a selector string
     * Idea by jonathantneal, URL: https://github.com/jonathantneal/closest/blob/master/closest.js
     *
     * @param {HTMLElement} el Element node to match on
     * @param {string} selector Selector string
     * @return {HTMLElement|null} True, the element node matches the selector; otherwise, false
     */
    function matches(el, selector) {
        return _elementMatches.call(el, selector);
    }

    /**
     * Get the parent of an element node
     *
     * @param {HTMLElement} el Element node to get the parent of
     * @return {HTMLElement|null} Element node; otherwise, null
     */
    function parent(el) {
        var parent = el.parentNode;

        return parent && parent.nodeType !== _nodeTypeFragmentNode ? parent : null;
    }

    /**
     * Get the parents of an element node
     *
     * @param {HTMLElement} el Element node to get the parents of
     * @return {array} An array of element nodes; otherwise, an empty array
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
     * Insert an element before an element node's content
     *
     * @param {HTMLElement} el Element node to insert before
     * @param {HTMLElement} elAfter Element node to insert
     * @return {undefined}
     */
    function prepend(el, elBefore) {
        el.insertBefore(elBefore, el.firstChild);
    }

    /**
     * Remove an element
     *
     * @param {HTMLElement} el Element node to remove
     * @return {undefined}
     */
    function remove(el) {
        return _elementRemove.call(el);
    }

    /**
     * Replace an element node with another element node
     *
     * @param {HTMLElement} el Element node to replace
     * @param {HTMLElement} elReplacement Element node to replace with
     * @return {undefined}
     */
    function replace(el, elReplacement) {
        if (el.parentNode) {
            el.parentNode.replaceChild(elReplacement, el);
        }

        // before(el, elReplacement);
        // remove(el);
    }

    /**
     * Wrap an element node with another element node
     *
     * @param {HTMLElement} el Element node to wrap around
     * @param {HTMLElement} elWrap Element node to wrap with
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
     * Unwrap an element node
     * Idea by plainjs.com, URL: https://plainjs.com/javascript/manipulation/unwrap-a-dom-element-35/
     *
     * @param {HTMLElement} el Element node to unwrap
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
}(window.Object));
