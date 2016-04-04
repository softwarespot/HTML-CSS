(function domModule() {
    // Public API
    return {
        after: after,
        before: before,
        append: append,
        preappend: preappend
    };

    /**
     * Insert an element after an element node
     *
     * @param {HTMLElement} el Element node to insert after
     * @param {HTMLElement} elAfter Element node to insert
     * @return {undefined}
     */
    function after(el, elAfter) {
        el.parentNode.insertBefore(elAfter, el.nextSibling);
    }

    /**
     * Insert an element before an element node
     *
     * @param {HTMLElement} el Element node to insert before
     * @param {HTMLElement} elAfter Element node to insert
     * @return {undefined}
     */
    function before(el, elBefore) {
        el.parentNode.insertBefore(elBefore, el);
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
     * Insert an element before an element node's content
     *
     * @param {HTMLElement} el Element node to insert before
     * @param {HTMLElement} elAfter Element node to insert
     * @return {undefined}
     */
    function preappend(el, elBefore) {
        el.insertBefore(elBefore, el.firstChild);
    }
}());
