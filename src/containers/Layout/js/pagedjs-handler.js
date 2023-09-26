'use strict'; 
export class PagedJsHandler extends globalThis.Paged.Handler {
    constructor(chunker, polisher, caller) {
        super(chunker, polisher, caller);
    }

    /**
     * Before the content is parsed by Paged.js and given IDs, please do the follwing:
     * @param {*} content | → document-fragment made from the original DOM
     */
    beforeParsed(content) {
        globalThis.parent.aptTecReports.raiseEvent('beforePreviewParsed', content);
    }
 
    /**
     * Runs after all pages have finished rendering, please do the follwing:
     * @param {*} pages | → array that contains all page nodes
     */
    afterRendered(pages) {
        globalThis.parent.aptTecReports.raiseEvent('afterPreviewRendered', pages);
    }    
}