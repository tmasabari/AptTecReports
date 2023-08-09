class AptTecIntegration
{
    #designerHTMLPath = 'Preview/main.html';
    #sourceUrl;
    #isSourceUrlLoaded=false;
    #previewButtonSelector='';
    #templateToReplace ='"../Resources/';
    #designerWindow = null;
    #frameElement=null;

    constructor(sourceUrl, previewFrameId, reportId, 
        templatesLocation, dataGetter=null, integrationType='', isCors = true){
        this.integrationType = integrationType;
        this.previewFrameId = previewFrameId;
        this.reportId = reportId;
        this.isCors = isCors;
        this.#sourceUrl = sourceUrl.endsWith('/') ? sourceUrl : sourceUrl + '/' ;
        this.#addIFrameTag();
        this.#loadSourceUrl(templatesLocation, dataGetter);
    }

    #addIFrameTag() {
        const iFrameTag = `
        <style>
            #${this.previewFrameId} {
                position: absolute;
                height: calc(100vh - 120px);
                border: 1px solid black;
                margin-left: -1px;
                margin-top: -1px;
                z-index: 1000;
                width: 99%;
                top: 92px;
                display:none;
            }
        </style>
        <iframe id="${this.previewFrameId}"></iframe>`;
        $('body').append(iFrameTag);
    }

    #loadSourceUrl(templatesLocation, dataGetter) {
        const designerHTMLUrl = this.#sourceUrl + this.#designerHTMLPath;
        fetch(designerHTMLUrl)  //new Downloader().download([designerHTMLUrl], this.isCors)
        .then(response => response.text())       //response[0].text()
        .then(html_template =>
        {
            var modified_html = html_template.replace(
                new RegExp(this.#templateToReplace, "ig"), '"' + this.#sourceUrl + 'Resources/');
            this.#frameElement = document.getElementById(this.previewFrameId);
            this.#frameElement.srcdoc = modified_html;
            this.#frameElement.onload = () => { 
                this.#isSourceUrlLoaded = true;
                if (this.#previewButtonSelector)
                    $(this.#previewButtonSelector).prop('disabled', false); //enable the preview button
                this.#designerWindow = document.getElementById(this.previewFrameId).contentWindow;
                this.#designerWindow.initilizePreview({
                    reportId: this.reportId,
                    templatesLocation: templatesLocation,
                    sourceUrl: this.#sourceUrl,
                    closeAction: () => $('#' + this.previewFrameId).hide(),
                    dataGetter: dataGetter
                });
            }
            
        })
        .catch(error =>
        {
            console.error('Error loading report template:', error);
        });
    }

    //parentSelector can be #Grid secondSelector can be ".k-grid-toolbar"
    addPreviewButton(parentSelector, secondSelector,
        buttonClass = 'btn btn-success', iconClass = 'fa fa-print', buttonText = '') {
        secondSelector = (secondSelector) ? secondSelector : ""
        var element = $(parentSelector + ' ' + secondSelector);
        if (element.length === 0) throw "Could not add a preview button. Please check selectors";

        const disabledAttrib = this.#isSourceUrlLoaded ? '' : 'disabled';
        //data attributes must be lower case
        element.prepend(`
            <button data-parent-selector='${parentSelector}' data-second-selector='${secondSelector}' 
            data-report-id='${this.reportId}' data-render-target='${this.previewFrameId}' 
            class='${buttonClass} printPreview' type='button' ${disabledAttrib}>
                <i class='${iconClass}'></i>${buttonText}</button>`);
        this.#previewButtonSelector = parentSelector + ' ' + secondSelector + ' .printPreview';
        return $(this.#previewButtonSelector);
    }

    showPrintPreview() {
        $('#' + this.previewFrameId).show();
        this.#designerWindow.aptTecReports.refreshReport();
    }

    sendTelerikData(gridSelector, reportParamsUrl) { // "Producing Data" (May take some time)
        var aptTecData = { CommonData: null, Data: null };
        aptTecData.Data = this.getTelerikSortedData(gridSelector);
        const isCors = this.isCors;
        let previewDataPromise = new Promise(function (previewDataResolve, previewDataReject) {
            fetch(reportParamsUrl) // new Downloader.download([reportParamsUrl], isCors)
            .then(response => response.json())
            .then(serverParams => {
                aptTecData.CommonData = serverParams.CommonData;
                previewDataResolve(aptTecData); // when successful
            }) .catch(error => {
                console.error('Error loading report parameters:', error);
                previewDataReject();  // when error
            });
        });
        return previewDataPromise;
    };

    getTelerikSortedData(gridSelector) {
         if ($(gridSelector).length === 0) 
             return null;  //if it is not a kendo grid return empty 
        // https://www.telerik.com/forums/get-sorted-items-without-paging
        var grid = $(gridSelector).data("kendoGrid");
        if (!(grid)) 
            return null;  //if it is not a kendo grid return empty 
        
        var result = null
        var dataSource = grid.dataSource;
        var data = dataSource.data();
        var sort = dataSource.sort();
        if (data.length > 0 && sort) {  //sort throws error in case data length =0
            var query = new kendo.data.Query(data);
            var sortedData = query.sort(sort).data;
            result = sortedData;
        }
        else {
            result = data;
        }

        return result;
    }
}