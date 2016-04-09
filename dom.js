var domElements = (function domElementsModule(Array, Element) {
    // Fields

    // Node types
    var _nodeTypeDocumentNode = Node.DOCUMENT_NODE;
    var _nodeTypeFragmentNode = Node.DOCUMENT_FRAGMENT_NODE;
    var _nodeTypeElementNode = Node.ELEMENT_NODE;

    // Polyfills

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
            while (el && el.nodeType !== _nodeTypeFragmentNode && !matches(el, selector)) {
                el = el.parentNode;
            }

            return el || null;
        };

    // URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    var _elementMatches =
        _elementPrototype.matches ||
        _elementPrototype.mozMatchesSelector ||
        _elementPrototype.msMatchesSelector ||
        _elementPrototype.webkitMatchesSelector ||
        function elementMatches(el, selector) {
            var els = el.ownerDocument.querySelectorAll(selector);

            var index = 0;
            while (els[index] && el !== els[index]) {
                index++;
            }

            return !!els[index];
        };

    // Public API
    return {
        after: after,
        append: append,
        around: wrap,
        before: before,
        children: children,
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
        siblings: siblings,
        start: prepend,
        toArray: _arrayFrom,
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
     * Get the children of a node
     *
     * @param {Node} node Node to get the children of
     * @param {boolean} elementsOnly Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {array} Array of nodes/elements; otherwise, an empty array on error
     */
    function children(node, elementsOnly) {
        var nodes = node.childNodes;

        return _arrayFilter.call(nodes, function filter(node) {
            // Enforce the default value
            return elementsOnly !== true || node.nodeType === _nodeTypeElementNode;
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
     * Get the siblings of a node
     *
     * @param {Node} node Node to get the siblings of
     * @param {boolean} elementsOnly Set to true to filter out those nodes which aren't elements (like jQuery). Default is false
     * @return {array} Array of nodes/elements; otherwise, an empty array on error
     */
    function siblings(node, elementsOnly) {
        var siblings = [];

        var sibling = node.parentNode;
        if (!sibling) {
            return siblings;
        }

        sibling = sibling.firstChild;
        while (sibling) {
            // Enforce the default value
            if (node !== sibling && (elementsOnly !== true || sibling.nodeType === _nodeTypeElementNode)) {
                siblings.push(sibling);
            }

            sibling = sibling.nextSibling;
        }

        return siblings;
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
}(window.Array, window.Element));
