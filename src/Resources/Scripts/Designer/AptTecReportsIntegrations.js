class AptTecReportsIntegrations {

    constructor(integrationType, renderTarget, reportId){
        this.integrationType = integrationType;
        this.gridSelector = ''; //used only for telerik so it is optional

        this.renderTarget = renderTarget;
        this.reportId = reportId;
    }

    //parentSelector can be #Grid secondSelector can be ".k-grid-toolbar"
    addPreviewButton(printPreviewClickHandler, parentSelector, secondSelector,
        buttonClass = 'btn btn-success', iconClass = 'fa fa-print', buttonText = '') {
        var element;
        if (secondSelector)
            element = $(secondSelector, parentSelector);
        else
            element = $(parentSelector);
        if (element.length === 0) throw "Could not add a preview button. Please check selectors";

        //data attributes must be lower case
        element.prepend(
            "<button data-parent-selector='" + parentSelector + 
            "' data-second-selector='" + secondSelector + 
            "' data-report-id='" + reportId + 
            "' data-render-target='" + renderTarget + 
            "' 'class=" + buttonClass + "' printPreview' type='button'>" +
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

    showPrintPreview() {
        if ($(this.renderTarget).length === 0)
            throw "Could not find the Preview target element. Please check renderTarget selector";

        childWindow = $(this.renderTarget)[0].contentWindow;
        childWindow.aptTecReports.templatesLocation = '/Home/ReportsData/Templates/';
        childWindow.aptTecReports.ReportId = this.reportId;
        childWindow.aptTecReports.closeAction = () => $(this.renderTarget).hide();
        childWindow.aptTecReports.dataGetter = this.sendData;
        childWindow.aptTecReports.refreshReport();
        $(this.renderTarget).show();
    }

    sendData()  {
        let previewDataPromise = new Promise(function (previewDataResolve, previewDataReject) {
            // "Producing Data" (May take some time)
            var reportParamsUrl = "/Office/Services/GetMaster.aspx?Type=reportParameters";
            // Load the HTML template and parameters using fetch API (you can also use XMLHttpRequest)
            //https://developer.mozilla.org/en-US/docs/Web/API/fetch
            fetch(reportParamsUrl)
                .then(response => response.json())
                .then(serverParams => {
                    aptTecData= this.getTelerikSortedData();
                    aptTecData.CommonData = serverParams.CommonData;
                    previewDataResolve(aptTecData); // when successful
                }) .catch(error => {
                    console.error('Error loading report parameters:', error);
                    previewDataReject();  // when error
                });
        });
        return previewDataPromise;
    };

    getTelerikSortedData() {
        var aptTecData = { CommonData: null, Data: null };
        if ($(this.gridSelector).length === 0) 
            return aptTecData;  //if it is not a kendo grid return empty 
        // https://www.telerik.com/forums/get-sorted-items-without-paging
        var grid = $(this.gridSelector).data("kendoGrid");
        if (!(grid)) 
            return aptTecData;  //if it is not a kendo grid return empty 
            
        var dataSource = grid.dataSource;
        var data = dataSource.data();
        var sort = dataSource.sort();
        if (data.length > 0 && sort) {  //sort throws error in case data length =0
            var query = new kendo.data.Query(data);
            var sortedData = query.sort(sort).data;
            aptTecData.Data = sortedData;
        }
        else {
            aptTecData.Data = data;
        }

        return aptTecData;
    }
}