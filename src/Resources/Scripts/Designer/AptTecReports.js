'use strict';
import { mergeExistingProperties } from '@apttec/utils';
import * as dayjs from 'dayjs';
// https://jsonformatter.curiousconcept.com/ to convert js code to json object
export default class AptTecReports
{
    #previewPageUrl = '';
    #closeAction = null;

    #templateToReplace = '{{SourceUrl}}';
    #internalCommonData = {
        'PI': '<span class=\'pageIndex\'>&nbsp;</span>',
        'PC': '<span class=\'pageCount\'>&nbsp;</span>',
    };
    #dateOnly = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };
    #dateTime24 = {     // "12/19/2012, 19:00:00"
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        //timeZone: 'America/Los_Angeles',
    };
    constructor(iFrameId, reportId, schemaLocation, templatesLocation, dataLocation,
        sourceUrl = '', closeAction = null, dataGetter = null, locale = 'en-US', currency= 'USD', dateOptions= null)
    {
        this.schemaLocation = schemaLocation;
        this.templatesLocation = templatesLocation;
        this.dataLocation = dataLocation;

        this.sourceUrl = sourceUrl;
        this.#previewPageUrl = (sourceUrl) ? sourceUrl + 'Pages/' : null;
        this.closeAction = closeAction;
        this.dataGetter = dataGetter;
        this.reportId = reportId;
        this.reportFrameId = iFrameId;

        this.PagesCount = -1;
        this.ReportSchema = null;
        this.ReportParams = null;
        this.ServerParams = null;
        this.ReportTemplateSource = null;
        this.htmlTemplate = null;
        this.htmlTemplate = null;
        
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale#examples
        this.Locale = new Intl.Locale(locale);
        var dateOptionsUsed = (dateOptions) ? dateOptions : this.#dateTime24;
        // todo explore the performance improvements
        // this.Formats = {
        //     'decimal': new Intl.NumberFormat(locale, { style: 'decimal' }),
        //     'percent': new Intl.NumberFormat(locale, { style: 'percent' }),
        //     'currency': new Intl.NumberFormat(locale, { style: 'currency', currency: currency }),
        //     'date': new Intl.DateTimeFormat(locale, dateOptionsUsed),
        //     'dateTime24': new Intl.DateTimeFormat(locale, this.#dateTime24),
        //     'shortdatetime': { format: (value) => this.shortDateTime(value) }
        // };
        //this.unitFormat = new Intl.NumberFormat(locale, { style: 'unit', unit: 'liter' });

        this.customFunctions = {};
        this.customFunctions.decimal = (value) => new Intl.NumberFormat(locale, { style: 'decimal' }).format(value);
        this.customFunctions.percent = (value) => new Intl.NumberFormat(locale, { style: 'percent' }).format(value);
        this.customFunctions.currency = (value) => new Intl.NumberFormat(locale, 
            { style: 'currency', currency: currency }).format(value);
        this.customFunctions.date = (value) => new Intl.DateTimeFormat(locale, dateOptionsUsed).format(value);
        this.customFunctions.dateonly = (value) => new Intl.DateTimeFormat(locale, this.#dateOnly).format(value);
        this.customFunctions.dateTime24 = (value) => new Intl.DateTimeFormat(locale, this.#dateTime24).format(value);
        this.customFunctions.shortdatetime = (value) => this.shortDateTime(value);
        //this.customFunctions.todaydate = () => this.getFormattedDate(); //deprecated
    }

    getFormattedDate(date, format) {
        date = date ?? Date.now();
        format = format ?? 'MM-DD-YYYY';
        return dayjs(date).format(format);
    }
    //https://stackoverflow.com/questions/206384/how-do-i-format-a-microsoft-json-date
    //nowDate.format("mm/dd/yyyy hh:mm:ss tt")
    msDateToJsDate(msDate, format) {
        var date = msDate;
        if (Object.prototype.toString.call(msDate) !== '[object Date]')
            date = new Date(parseInt(msDate.substr(6)));
            
        return this.getFormattedDate(date, format);
    }

    shortDateTime(value) {
        if (!(value)) return '';
        return this.msDateToJsDate(value, 'M/D/YYYY HH:MM:ss');
    }

    get closeAction() {
        return this.#closeAction;
    }
    set closeAction(x) {
        this.#closeAction = x;
        $('.closeMenu').show();
    }

    showHideDesigner(isShow) {
        const value = isShow ? 'inline-block': 'none';
        document.querySelector("#stickyRow > button.btn.btn-primary.editMenu").style.display = value;
        document.querySelector("#stickyRow > button.btn.btn-primary.exportMenu").style.display = value;
        document.querySelector("#stickyRow > button.btn.btn-secondary.optionsMenu").style.display = value;
    }

    raiseEvent(eventName, eventData) {
        const event = new Event(eventName, { "cancelable": true });
        event.details = {
            reportId: this.reportId,
            eventData: eventData
        };

        switch (eventName) {
        case 'beforePreviewParsed':
            this.PagesCount = -1;
            $('.printMenu').attr('disabled', 'disabled');
            break;
        case 'afterPreviewRendered':
            this.PagesCount = eventData.length;
            $('.printMenu').removeAttr('disabled');
            break;
    
        default:
            break;
        }
        window.parent.document.dispatchEvent(event);
        return event.defaultPrevented;
    }

    #reportData = null;
    get reportData() {
        return this.#reportData;
    }
    set reportData(data) {
        this.#reportData = data;
        //the values from caller will always override internal variables.
        this.#reportData.CommonData = { ...this.#internalCommonData , ...this.#reportData.CommonData } ;
    }

    //methods
    //custom code to load the reports==========================================================

    initializeDesigner(isRefreshReport) {
        //convert json to schema https://codebeautify.org/json-to-json-schema-generator
        const schemaParamsUrl = this.sourceUrl + this.schemaLocation + 'ReportParametersSchema.json';
        fetch(schemaParamsUrl)
            .then(response => response.json())
            .then(reportSchema => {
                this.ReportSchema = reportSchema;
                if (isRefreshReport)
                    this.refreshReport();
            })
            .catch(error => {
                console.error('Error loading reports schema:', error);
            });
    }

    // Function to fetch the HTML template and JSON data and perform the replacement
    refreshReport() {
        if (!(this.reportId)) //if report id does not exist can't perform anything more.
            return;

        var reportParamsUrl = this.templatesLocation + this.reportId + '.json';
        // Load the HTML template and parameters using fetch API (you can also use XMLHttpRequest)
        //https://developer.mozilla.org/en-US/docs/Web/API/fetch
        fetch(reportParamsUrl)
            .then(response => response.json())
            .then(serverParams => {
                this.ServerParams = serverParams;
                const paramsString = localStorage.getItem(this.reportId);
                if (paramsString) {
                    const localParams = JSON.parse(paramsString);
                    var finalParams = mergeExistingProperties(serverParams, localParams);
                    //localStorage.setItem(this.reportId, JSON.stringify(finalParams)); store only if user clicks save button
                    this.ReportParams = finalParams;
                }
                else {
                    this.ReportParams = serverParams;
                }
                this.refreshData();
            })
            .catch(error => {
                console.error('Error loading report data paramters:', error);
            });
    }

    // Function to fetch the JSON data and perform the replacement
    refreshData() {
        if (typeof this.dataGetter === 'function') {
            var response = this.dataGetter(this.ReportParams.DataSource);
            if (response && typeof response.then === 'function' && typeof response.catch === 'function') {
                // It's a native Promise or a custom Promise-like object
                response.then((result) => {
                    console.log('Promise resolved with result:', result);
                    // Continue further operations here using the result value
                    this.reportData = result;     //assume it is a direct data.
                    this.onReportParametersChanged();
                }).catch((error) => {
                    console.error('Promise rejected with error:', error);
                    // Handle errors or perform fallback actions here
                });
            }
            else {
                this.reportData = response;     //assume it is a direct data.
                this.onReportParametersChanged();
            }
        }
        else {
            if (this.ReportParams.DataSource) {
                this.ReportParams.DataSource = this.ReportParams.DataSource.replace(
                    '{{dataLocation}}', this.sourceUrl + this.dataLocation);
                fetch(this.ReportParams.DataSource)
                    .then(response => response.json())
                    .then(data => {
                        this.reportData = data;
                        this.onReportParametersChanged();
                    })
                    .catch(error => {
                        console.error('Error loading report data:', error);
                    });
            }
        }
    }

    onReportParametersChanged(forceRefresh) {
        if (forceRefresh || !(this.ReportTemplateSource) 
            || this.ReportTemplateSource !== this.ReportParams.ReportTemplate) {
            // Load the JSON data using fetch API (you can also use XMLHttpRequest)
            fetch(this.#previewPageUrl + this.ReportParams.ReportTemplate)
                .then(response => response.text())
                .then(html_template => {
                    this.htmlTemplate = html_template;
                    this.ReportTemplateSource = this.#previewPageUrl + this.ReportParams.ReportTemplate;
                    this.loadReportTemplate();
                })
                .catch(error => {
                    console.error('Error loading report template:', error);
                });
        }
        else {
            this.loadReportTemplate();
        }
    }
    #refreshCommonParameters() {
        this.reportData.CommonData.CurrentDateTime = this.getFormattedDate();
    }

    loadReportTemplate() {
        //Always refresh certain common parameters
        this.#refreshCommonParameters();

        // Perform the replacements
        var modified_html = this.replacePlaceholders(this.htmlTemplate, this.ReportParams);
        modified_html = this.replacePlaceholders(modified_html, this.ReportParams.Layout);
        modified_html = this.replacePlaceholders(modified_html, this.reportData.CommonData);
        modified_html = this.replacePlaceholders(modified_html, this.reportData.InstanceData);
        //final replacements with server data
        modified_html = modified_html.replace(
            new RegExp(this.#templateToReplace, 'ig'), this.sourceUrl);

        // Insert the modified HTML into the DOM
        document.getElementById(this.reportFrameId).srcdoc = modified_html;  //set .innerHTML for div eleement

        //finally init the json editor
        window.SchemaFormHandler.initJsoneditor();
    }
    // Function to replace placeholders in the HTML template with JSON data
    replacePlaceholders(html_template, reportDataParams) {
        for (const key in reportDataParams) {
            try {
                const placeholder = new RegExp('{{' + key + '}}', 'g');
                var value = reportDataParams[key];
                if (typeof value === 'object')
                    continue;

                //value = value.replace("{PageNumber}", "<span class='currentPageNumber'></span>");
                if (typeof value === 'string') {
                    const functionStart = '{@', functionEnd = '@}';
                    var indexToSearch = 0;
                    var nextIndex = value.indexOf(functionStart, indexToSearch);
                    while (nextIndex >= 0) {
                        var endIndex = value.indexOf(functionEnd, nextIndex);
                        if (endIndex >= 0) {
                            const stringFound = value.substring(nextIndex + functionStart.length, endIndex);
                            try {
                                // https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string/359910#359910
                                //todo convert only function name to lower case if paramters are to be included
                                var codeToExecute = 'return window.aptTecReports.customFunctions.' + stringFound.toLowerCase();
                                if (!stringFound.endsWith(')')) codeToExecute += '();';
                                const tempFunction = new Function(codeToExecute);
                                const returnValue = tempFunction();
                                value = value.replace(functionStart + stringFound + functionEnd, returnValue);
                                //if succeeded start from the same location again
                                indexToSearch = nextIndex;
                            } catch (error) {
                                console.error(`Error while evaluating the template function ${stringFound}: ${error}`);
                                indexToSearch = endIndex + functionEnd.length;
                            }
                        }
                        nextIndex = value.indexOf(functionStart, indexToSearch);
                    }
                }
                html_template = html_template.replace(placeholder, value);
                
            } catch (error) {
                console.error(`Error while replacing the template variable ${key}: ${error}`);
            }
        }
        return html_template;
    }
}