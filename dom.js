(function domModule(Object) {
    // Fields
    var _nativeObjectToString = Object.prototype.toString;

    // Public API
    return {
        after: after,
        append: append,
        around: wrap,
        before: before,
        empty: empty,
        getComputedStyles: getComputedStyles,
        inside: append,
        parent: parent,
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
        if (!_isNil(el.parentNode)) {
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
        if (!_isNil(el.parentNode)) {
            el.parentNode.insertBefore(elBefore, el);
        }
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
     * Get the parent of an element node
     *
     * @param {HTMLElement} el Element node to get the parent of
     * @return {HTMLElement|null} Element node; otherwise, null
     */
    function parent(el) {
        var parent = el.parentNode;
        if (_isNil(parent) || parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            return null;
        }

        return parent;
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
        if (_isFunction(el.remove)) {
            el.remove();
        } else if (!_isNil(el.parentNode)) {
            el.parentNode.removeChild(el);
        }
    }

    /**
     * Replace an element node with another element node
     *
     * @param {HTMLElement} el Element node to replace
     * @param {HTMLElement} elReplacement Element node to replace with
     * @return {undefined}
     */
    function replace(el, elReplacement) {
        before(el, elReplacement);
        remove(el);
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
        if (reIsTemplate.test(elWrap.nodeName) && !_isNil(elWrap.content)) {
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

        while (!_isNil(el.firstChild)) {
            parent.insertBefore(el.firstChild, el);
        }

        parent.removeChild(el);
    }

    // Helper functions

    /**
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a function datatype; otherwise, false
     */
    function _isFunction(value) {
        var tag = _nativeObjectToString.call(value);
        return tag === '[object Function]' || tag === '[object GeneratorFunction]';
    }

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
