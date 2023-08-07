class AptTecIntegration {

    constructor(sourceUrl, previewFrameId, reportId, integrationType){
        this.integrationType = integrationType;
        this.previewFrameId = previewFrameId;
        this.reportId = reportId;
        this.addIFrameTag(sourceUrl);
    }

    addIFrameTag(sourceUrl) {
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
        <iframe src="${sourceUrl}" id="${this.previewFrameId}"></iframe>`;
        $('body').append(iFrameTag);
    }

    //parentSelector can be #Grid secondSelector can be ".k-grid-toolbar"
    addPreviewButton(parentSelector, secondSelector,
        buttonClass = 'btn btn-success', iconClass = 'fa fa-print', buttonText = '') {
        secondSelector = (secondSelector) ? secondSelector : ""
        var element = $(parentSelector + ' ' + secondSelector);
        if (element.length === 0) throw "Could not add a preview button. Please check selectors";

        //data attributes must be lower case
        element.prepend(`
            <button data-parent-selector='${parentSelector}' data-second-selector='${secondSelector}' 
            data-report-id='${this.reportId}' data-render-target='${this.previewFrameId}' 
            class='${buttonClass} printPreview' type='button'>
                <i class='${iconClass}'></i>${buttonText}</button>`);
        const buttonElement = $(parentSelector + ' ' + secondSelector + ' .printPreview'); 
        return buttonElement;
    }

    showPrintPreview(templatesLocation, dataGetter) {
        var childWindow = $('#' + this.previewFrameId)[0].contentWindow;
        childWindow.aptTecReports.templatesLocation = templatesLocation;
        childWindow.aptTecReports.ReportId = this.reportId;
        childWindow.aptTecReports.closeAction = () => $('#' + this.previewFrameId).hide();
        childWindow.aptTecReports.dataGetter = dataGetter;
        childWindow.aptTecReports.refreshReport();
        $('#' + this.previewFrameId).show();
    }

    sendTelerikData(gridSelector, reportParamsUrl) { // "Producing Data" (May take some time)
        var aptTecData = { CommonData: null, Data: null };
        aptTecData.Data = this.getTelerikSortedData(gridSelector);
        let previewDataPromise = new Promise(function (previewDataResolve, previewDataReject) {
            fetch(reportParamsUrl)
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