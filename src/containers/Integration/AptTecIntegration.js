'use strict';
import { getKendoSortedData, createButtonAtParent } from '@apttec/utils';

window.AptTecReporting = window.AptTecReporting || {};
window.AptTecReporting.Kendo = {};
window.AptTecReporting.Kendo.getSortedData = getKendoSortedData;
window.AptTecReporting.Integration = class AptTecIntegration {
    #designerHTMLPath = 'Designer/Designer.html';
    #templateToReplace ='{{SourceUrl}}';
    #defaultFrameStyle =`
                position: absolute;
                height: calc(100vh - 120px);
                border: 1px solid black;
                margin-left: -1px;
                margin-top: -1px;
                z-index: 1000;
                width: 99%;
                top: 92px;
                display:none;
                `;
    #allPreviewButtonSelector = '.AptTecPrintPreview';
    #frameElement = null;
    #isSourceUrlLoaded = false;
    #sourceUrl ='';
    #previewFrameId='';
    #templatesLocation='';
    #dataLocation='';
    /**
     * This integration is using the IFrame tag to avoid the css and scripts conflicts between the caller and library
     * There will be clear separation of concerns
     * @param {string} sourceUrl - The library can hosted on local or remote website.
     *      sample local path '/reports' remote path 'https://your.staticwebsite.com/reports'
     *      for remote website CORS must be enabled.
     * @param {string} previewFrameId -   Common preview form on the master layout or SPA or MPA pages
     *      There could be multiple data regions in a SPA or master layout
     *      However only one preview can be shown at a time.
     * @param {string} templatesLocation - Customize your templates folder path based on requirements.
     *      You can set different templatesLocation for different tenants/clients for multi-tenant scenarios.
     * @param {string} frameStyle - The styles to be applied for the preview frame.
     */
    constructor(sourceUrl, previewFrameId, templatesLocation, frameStyle, 
        isPreviewTypeDesigner = false, dataLocation = 'Data/Samples/'){
        this.aptTecData = { CommonData: {}, InstanceData: {}, Data: [] };

        this.designerWindow = null;
        this.isPreviewTypeDesigner = isPreviewTypeDesigner;

        this.#sourceUrl = sourceUrl.endsWith('/') ? sourceUrl : sourceUrl + '/' ;
        this.#previewFrameId = previewFrameId; 
        this.#addIFrameTag(frameStyle);
        this.#frameElement = document.getElementById(this.#previewFrameId);
        this.#templatesLocation = templatesLocation;
        this.#dataLocation = dataLocation;
        this.#loadSourceUrl();
        this.#windowZoomEventBind();
    }
    #windowZoomEventBind() {
        const aptIntegration = this;
        window.addEventListener('resize', function() {
            // Check if the zoom level has changed
            if (window.innerWidth !== window.outerWidth) {
                //console.log('Zoom event detected!');// Your code here to respond to the zoom event
                // ${ window.innerWidth } ${ window.outerWidth }
                // 100 % Zoom '1280 1280' 90 % Zoom '1422 1280' 80 % Zoom '1600 1280' 67 % Zoom '1920 1280'
                if (aptIntegration.designerWindow && aptIntegration.designerWindow.aptTecReports 
                    && window.getComputedStyle(aptIntegration.#frameElement, null).display !== 'none' ) {
                    aptIntegration.designerWindow.aptTecReports.refreshData('reportIframe');
                }
            }
        });
    }
    #addIFrameTag(frameStyle) {
        const style = (frameStyle) ? frameStyle : this.#defaultFrameStyle;
        const iFrameTag = `
        <style>
            #${this.#previewFrameId} { ${style} } 
        </style>
        <iframe id="${this.#previewFrameId}"></iframe>`;
        $('body').append(iFrameTag);
    }

    #loadSourceUrl() {
        const designerHTMLUrl = this.#sourceUrl + this.#designerHTMLPath;
        fetch(designerHTMLUrl)
            .then(response => response.text())       //response[0].text()
            .then(html_template => {
                var modified_html = html_template.replace(
                    new RegExp(this.#templateToReplace, 'ig'), this.#sourceUrl );
                this.#frameElement.srcdoc = modified_html;
                this.#frameElement.onload = () => { this.#frameLoaded(); };
            })
            .catch(error => {
                console.error('Error loading the preview designer:', error);
            });
    }

    #frameLoaded() {
        this.#isSourceUrlLoaded = true;
        $(this.#allPreviewButtonSelector).prop('disabled', false); //enable all printpreview buttons
        this.designerWindow = document.getElementById(this.#previewFrameId).contentWindow;
        this.designerWindow.initilizePreview({
            templatesLocation: this.#templatesLocation,
            dataLocation: this.#dataLocation,
            sourceUrl: this.#sourceUrl,
            closeAction: () => $('#' + this.#previewFrameId).hide()
        });
        this.designerWindow.aptTecReports.showHideDesigner(this.isPreviewTypeDesigner);
    }

    get aptTecReports() {
        return this.designerWindow.aptTecReports;
    }
    /**
     * Add the preview button
     * @param {string} reportId - specifies the report id to fetch the report template from the template location. The product will use the URL aptTecintegration.templatesLocation + '/' + reportId. For example '/Demo/reports/Templates/MyReport'
     * @param {string} buttonParent - the CSS selector to identify the parent within the page to place the preview button
     * @param {object} attributesObject - The object with the set of additional data attributes to be included in the button. It is an optional parameter
     * @param {string} buttonClass - The string to specify the CSS classes for the button. Optional.
     * @param {string} iconClass - The string to specify the CSS classes for the icon within the button. Optional.
     * @param {string} buttonText - You can leave this empty if you like to create tool bar button
     * @param {string} location - The value can be 'start, or 'end', to specify the location of the button within the parent
     * @returns {object} AlreadyExists - true if the button already exists and the add logic is skipped, false if it is newly added.
     */
    addPreviewButton(reportId, buttonParent, attributesObject = {}, dataSetter = null,
        buttonClass = 'btn btn-success', iconClass = 'fa fa-print', 
        buttonText = '', location = 'start', buttonid=null )  {
        var buttonResult = this.#addPreviewButton(buttonid, reportId, buttonParent, attributesObject,
            buttonClass, iconClass, buttonText, location);
        if (buttonResult.AlreadyExists)
            return buttonResult;
        this.#HandlePreviewButton(buttonResult, dataSetter);
        return buttonResult;
    }
    #addPreviewButton(buttonid, reportId, buttonParent, attributesObject, 
        buttonClass, iconClass, buttonText, location) {
        if (!(buttonid)) {
            buttonid = reportId.replace(/[^a-zA-Z]/g, '') + 'PreviewButton';
        }

        if (!(attributesObject)) attributesObject = {};
        attributesObject['render-target'] = this.#previewFrameId;
        attributesObject['report-id'] = reportId;
        buttonClass += ' AptTecPrintPreview';
        const disabledAttrib = this.#isSourceUrlLoaded ? '' : 'disabled';
        const result = createButtonAtParent(buttonid, buttonParent, buttonClass, iconClass, buttonText,
            location, attributesObject, disabledAttrib);
        // extraInformation =disabledAttrib,  preventDuplicate = true
        return { previewButton: result.ButtonObject, AlreadyExists: result.AlreadyExists };
    }

    /**
     * 
     * @param {*} buttonResult 
     * @param {Object} dataSetter - Anyof "function" or "string" 
     *      if it is a function, the function will be called while rendering the preview.
     *      'direct' - the JSON data will be read directly from the aptTecData property
     *      'kendoGrid' - the JSON data will be read directly from the Kendo grid using data-id set using button
     * @returns 
     */
    #HandlePreviewButton(buttonResult, dataSetter ) {
        const aptIntegration = this;
        buttonResult.previewButton.addEventListener('click', () => {
            //this is closure or inner function so it always rememebers the correct dataSetter
            if (typeof dataSetter === 'function') {
                aptIntegration.designerWindow.aptTecReports.dataGetter = dataSetter;
            }
            else {
                switch (dataSetter) {
                case 'direct':
                    aptIntegration.designerWindow.aptTecReports.dataGetter = () => { 
                        aptIntegration.aptTecData.Data = buttonResult.previewButton.printData;
                        return aptIntegration.aptTecData; 
                    };
                    break;
                case 'kendoGrid':
                    aptIntegration.designerWindow.aptTecReports.dataGetter = () => { 
                        aptIntegration.aptTecData.Data = 
                            getKendoSortedData(buttonResult.previewButton.dataset.gridId);
                        return aptIntegration.aptTecData; 
                    };
                    break;
                default:
                    aptIntegration.designerWindow.aptTecReports.dataGetter = null;
                    break;
                }
            }
            // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes note that dashes are converted to camel case
            aptIntegration.showPreview(buttonResult.previewButton.dataset.reportId);
        });
    }

    showPreview(reportId) {
        this.designerWindow.aptTecReports.reportId = reportId;
        $('#' + this.#previewFrameId).show();
        //this always loads the template from server and does entire refresh.
        this.designerWindow.aptTecReports.refreshReport();
    }

    //return aptTecintegration.sendTelerikData("#" + printableGridId, "/Office/Services/GetMaster.aspx?
    fetchData(Url, aptTecDataPropertyName, sourcePropertyName) {
        const thisIntegration = this;
        return new Promise(function (previewDataResolve, previewDataReject) {
            fetch(Url)
                .then(response => response.json())
                .then(data => {
                    thisIntegration.aptTecData[aptTecDataPropertyName] = 
                    (sourcePropertyName) ? data[sourcePropertyName] : data;
                    previewDataResolve(thisIntegration.aptTecData); // when successful
                }).catch(error => {
                    console.error('Error loading report parameters:', error);
                    previewDataReject();  // when error
                });
        }); 
    }

    print() {
        this.designerWindow.document.getElementById('reportIframe').contentWindow.print();
    }
    getPageCount() {
        // const contentWindow = this.designerWindow.document.getElementById('reportIframe').contentWindow;
        // const countString = contentWindow.getComputedStyle(
        //     contentWindow.document.querySelector(".pagedjs_pages"), null)
        //     .getPropertyValue("--pagedjs-page-count");
        // if (countString) {
        //     return parseInt(countString);
        // }
        // return -1;
        return this.designerWindow.aptTecReports.PagesCount;
    }
}; 