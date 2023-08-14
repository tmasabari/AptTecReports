// https://jsonformatter.curiousconcept.com/ to convert js code to json object
class AptTecReports {
    #previewPageUrl='';
    #closeAction = null;
    #templateToReplace = '{{SourceUrl}}';
    #internalCommonData = {
        "PI": "<span class='pageIndex'>&nbsp;</span>",
        "PC": "<span class='pageCount'>&nbsp;</span>",
    };
    constructor(iFrameId, reportId, schemaLocation, templatesLocation, dataLocation, 
        sourceUrl='', closeAction=null, dataGetter=null) {
        this.schemaLocation = schemaLocation;
        this.templatesLocation = templatesLocation;
        this.dataLocation = dataLocation;

        this.sourceUrl = sourceUrl;
        this.#previewPageUrl = (sourceUrl) ? sourceUrl + 'Preview/': null;
        this.closeAction = closeAction;
        this.dataGetter = dataGetter;
        this.reportId = reportId;
        this.reportFrameId = iFrameId;

        this.ReportSchema = null;
        this.ReportParams = null;
        this.ServerParams = null;
        this.ReportTemplateSource = null;
        this.htmlTemplate = null;
    } 

    get closeAction() {
        return this.#closeAction;
    }
    set closeAction(x) {
        this.#closeAction = x;
        $('.closeMenu').show();
    }

    enableExport(isVisible) {
        if (isVisible)
            $('.exportMenu').show();
        else
            $('.exportMenu').hide();
    }

    #reportData = null;
    get reportData() {
        return this.#reportData;
    }
    set reportData(data) {
        this.#reportData = data;
        this.#reportData.CommonData = mergeAllProperties(this.#reportData.CommonData, this.#internalCommonData);
    }

    //methods
    //custom code to load the reports==========================================================

    initializeDesigner(isRefreshReport) {
        //convert json to schema https://codebeautify.org/json-to-json-schema-generator
        const schemaParamsUrl = this.sourceUrl + this.schemaLocation + "ReportParametersSchema.json";
        fetch(schemaParamsUrl)
            .then(response => response.json())
            .then(reportSchema =>
            {
                this.ReportSchema = reportSchema;
                if (isRefreshReport)
                    this.refreshReport();
            })
            .catch(error =>
            {
                console.error('Error loading reports schema:', error);
            });
    }

    // Function to fetch the HTML template and JSON data and perform the replacement
    refreshReport() {
        if (!(this.reportId)) //if report id does not exist can't perform anything more.
            return;
        var reportParamsUrl = this.templatesLocation + this.reportId + ".json";
        // Load the HTML template and parameters using fetch API (you can also use XMLHttpRequest)
        //https://developer.mozilla.org/en-US/docs/Web/API/fetch
        fetch(reportParamsUrl)
            .then(response => response.json())
            .then(serverParams =>
            {
                this.ServerParams = serverParams;
                const paramsString = localStorage.getItem(this.reportId);
                if (paramsString)
                {
                    const localParams = JSON.parse(paramsString);
                    var finalParams = mergeExistingProperties(serverParams, localParams);
                    //localStorage.setItem(this.reportId, JSON.stringify(finalParams)); store only if user clicks save button
                    this.ReportParams = finalParams;
                }
                else
                {
                    this.ReportParams = serverParams;
                }
                this.refreshData();
            })
            .catch(error =>
            {
                console.error('Error loading report settings:', error);
            });
    }

    // Function to fetch the JSON data and perform the replacement
    refreshData() {
        if (typeof this.dataGetter === "function")
        {
            var response = this.dataGetter(this.ReportParams.DataSource);
            if (response && typeof response.then === 'function' && typeof response.catch === 'function')
            {
                // It's a native Promise or a custom Promise-like object
                response.then((result) => {
                    console.log("Promise resolved with result:", result);
                    // Continue further operations here using the result value
                    this.reportData = result;     //assume it is a direct data.
                    this.onReportParametersChanged();
                }) .catch((error) => {
                    console.error("Promise rejected with error:", error);
                    // Handle errors or perform fallback actions here
                });
            }
            else
            {
                this.reportData = response;     //assume it is a direct data.
                this.onReportParametersChanged();
            }
        }
        else
        {
            if (this.ReportParams.DataSource)
            {
                this.ReportParams.DataSource = this.ReportParams.DataSource.replace(
                    '{{dataLocation}}', this.sourceUrl + this.dataLocation);
                fetch(this.ReportParams.DataSource)
                    .then(response => response.json())
                    .then(data =>
                    {
                        this.reportData = data;
                        this.onReportParametersChanged();
                    })
                    .catch(error =>
                    {
                        console.error('Error loading report data:', error);
                    });
            }
        }
    }

    onReportParametersChanged(forceRefresh) {
        if (forceRefresh || !(this.ReportTemplateSource) || this.ReportTemplateSource !== this.ReportParams.ReportTemplate)
        {
            // Load the JSON data using fetch API (you can also use XMLHttpRequest)
            fetch(this.#previewPageUrl + this.ReportParams.ReportTemplate)
                .then(response => response.text())
                .then(html_template =>
                {
                    this.htmlTemplate = html_template;
                    this.ReportTemplateSource = this.#previewPageUrl + this.ReportParams.ReportTemplate;
                    this.loadReportTemplate();
                })
                .catch(error =>
                {
                    console.error('Error loading report template:', error);
                });
        }
        else
        {
            this.loadReportTemplate();
        }
    }

    loadReportTemplate() {
        // Perform the replacements
        var modified_html = replacePlaceholders(this.htmlTemplate, this.ReportParams);
        modified_html = replacePlaceholders(modified_html, this.ReportParams.Layout);
        modified_html = replacePlaceholders(modified_html, this.reportData.CommonData);
        //final replacements with server data
        modified_html = modified_html.replace(
            new RegExp(this.#templateToReplace, "ig"), this.sourceUrl );

        // Insert the modified HTML into the DOM
        document.getElementById(this.reportFrameId).srcdoc = modified_html;  //set .innerHTML for div eleement

        //finally init the json editor
        window.SchemaFormHandler.initJsoneditor();
    }
}