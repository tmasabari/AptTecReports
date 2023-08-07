class AptTecIntegration {

    constructor(renderTarget, reportId, integrationType){
        this.integrationType = integrationType;
        this.renderTarget = renderTarget;
        this.reportId = reportId;
    }

    //parentSelector can be #Grid secondSelector can be ".k-grid-toolbar"
    addPreviewButton(printPreviewClickHandler, parentSelector, secondSelector,
        buttonClass = 'btn btn-success', iconClass = 'fa fa-print', buttonText = '') {
        secondSelector = (secondSelector) ? secondSelector : ""
        var element = $(parentSelector + ' ' + secondSelector);
        if (element.length === 0) throw "Could not add a preview button. Please check selectors";

        //data attributes must be lower case
        element.prepend(
            "<button data-parent-selector='" + parentSelector + 
            "' data-second-selector='" + secondSelector + 
            "' data-report-id='" + this.reportId + 
            "' data-render-target='" + this.renderTarget + 
            "' class='" + buttonClass + " printPreview' type='button'>" +
            "<i class='" + iconClass + "'></i>" + buttonText + "</button>");
        $(parentSelector + ' ' + secondSelector + ' .printPreview').click(printPreviewClickHandler);
    }

    // printPreviewClickHandler(button) {
    //     const renderTarget = $(button).data('render-target');
    //     const reportId = $(button).data('report-id');
    //     const parentSelector = $(button).data('parent-selector');
    //     this.showPrintPreview(renderTarget, reportId, parentSelector);
    //     return false;
    // }

    showPrintPreview(templatesLocation, dataGetter) {
        if ($(this.renderTarget).length === 0)
            throw "Could not find the Preview target element. Please check renderTarget selector";

        var childWindow = $(this.renderTarget)[0].contentWindow;
        childWindow.aptTecReports.templatesLocation = templatesLocation;
        childWindow.aptTecReports.ReportId = this.reportId;
        childWindow.aptTecReports.closeAction = () => $(this.renderTarget).hide();
        childWindow.aptTecReports.dataGetter = dataGetter;
        childWindow.aptTecReports.refreshReport();
        $(this.renderTarget).show();
    }

    // var reportParamsUrl = "/Office/Services/GetMaster.aspx?Type=reportParameters";
    sendTelerikData(gridSelector, reportParamsUrl) { // "Producing Data" (May take some time)
        var aptTecData = { CommonData: null, Data: null };
        let previewDataPromise = new Promise(function (previewDataResolve, previewDataReject) {
            fetch(reportParamsUrl)
                .then(response => response.json())
                .then(serverParams => {
                    aptTecData.Data = this.getTelerikSortedData(gridSelector);
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