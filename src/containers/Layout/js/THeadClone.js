'use strict'
// https://github.com/pagedjs/pagedjs/issues/139 not working 
export class TableHeadClone extends globalThis.Paged.Handler {
    constructor(chunker, polisher, caller) {
        super(chunker, polisher, caller);
        this.styleSheet = polisher.styleSheet;
        this.theadElementsByTbodyKey = {};
    }

    afterParsed(parsed) {
        parsed.querySelectorAll('thead').forEach((elThead, idx) => {
        //parsed.firstElementChild.querySelectorAll('thead').forEach((elThead, idx) => {
        // this throws the same error 
            const nextElement = elThead.nextElementSibling;

            if (nextElement.tagName === 'TBODY') {
                const ref = nextElement.dataset.ref;

                this.theadElementsByTbodyKey[ref] = elThead;
            }
        });
    }

    afterPageLayout(pageElement, page, breakToken) {
        Object.entries(this.theadElementsByTbodyKey).forEach(([ref, theadElement]) => {
            pageElement.querySelectorAll(`tbody[data-ref="${ref}"]`).forEach((elTbody) => {
                if (!elTbody.previousElementSibling || elTbody.previousElementSibling.tagName !== 'THEAD') {
                    if (breakToken) {
                        breakToken.node = breakToken.node.previousElementSibling;
                    }
                    const clone = theadElement.cloneNode(true);
                    elTbody.parentNode.insertAdjacentElement("afterbegin", clone)
                }
            });
        });
    }
}