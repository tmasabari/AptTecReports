//https://gist.github.com/theinvensi/e1aacc43bb5a3d852e2e85b08cf85c8a
class PagedJsHooks extends window.Paged.Handler {
    constructor(chunker, polisher, caller) {
        super(chunker, polisher, caller);
    }

    /**
     * Before the content is parsed by Paged.js and given IDs, please do the follwing:
     * @param {*} content | → document-fragment made from the original DOM
     */
    beforeParsed(content) {
        window.parent.aptTecReports.raiseEvent('beforePreviewParsed', content);
    }
 
    /**
     * Runs after all pages have finished rendering, please do the follwing:
     * @param {*} pages | → array that contains all page nodes
     */
    afterRendered(pages) {
        window.parent.aptTecReports.raiseEvent('afterPreviewRendered', pages);
    }    
}

window.Paged.registerHandlers(PagedJsHooks);