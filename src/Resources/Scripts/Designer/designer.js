'use strict';
//css
import '../../css/Designer/designer.css';
import '../../css/Designer/ruler.css';
import DataTable from 'datatables.net-dt';

//scripts
import AptTecReports from './AptTecReports.js';
import SchemaFormHandler from './SchemaFormHandler.js';
import { ShowPopup } from './popup.js';
import { createUrlFromObject, autoDownloadUrl } from '@apttec/utils';

//add list items for rulers
addTags($(document)[0], '.ruler-x', '<li></li>', 50);
addTags($(document)[0], '.ruler-y', '<li></li>', 50);
function addTags(document, parentSelector, tag, pagesCount) {
    var content = '';
    for (var i = 1; i <= pagesCount; i++)
    {
        content += tag;
    }
    document.querySelector(parentSelector).innerHTML += content;
}
//UI event handlers==========================================================
window.onload = function ()
{
    window.SchemaFormHandler = new SchemaFormHandler('paramEditorDiv');
    if (window.self === window.top)
    {
        var reportId = null;
        //https://stackoverflow.com/questions/7731778/get-query-string-parameters-url-values-with-jquery-javascript-querystring
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('report')) {
            reportId = urlParams.get('report');
        }
        window.aptTecReports = new AptTecReports('reportIframe', reportId, '../Data/Schema/', 
            '../Data/Templates/', '../Data/Samples/');
        window.aptTecReports.initializeDesigner();
    }
};
window.initilizePreview = function (reportParams) {
    window.aptTecReports = new AptTecReports('reportIframe', reportParams.reportId, '',
        reportParams.templatesLocation, 'Data/Samples/', reportParams.sourceUrl,
        reportParams.closeAction, reportParams.dataGetter);
    window.aptTecReports.initializeDesigner(false);
};

$('.printMenu').click(function () { PrintReport(); return false; }); 
$('.editMenu').click(function () { showEditParamters(); return false; });
$('.exportMenu').click(function () { exportParameters(); return false; });
const refreshData = () => {
    window.aptTecReports.refreshData('reportIframe'); };
$('.refreshMenu').click(function () { refreshData(); return false; } ); 
$('.optionsMenu').click(function () { ShowRulerPopup(); return false; });
$('.closeMenu').click(function () { window.aptTecReports.closeAction(); return false; });
function PrintReport() {
    const isHandled = window.aptTecReports.raiseEvent('print', window.aptTecReports.PagesCount);
    if (!isHandled ) {
        document.getElementById('reportIframe').contentWindow.print();
    }
}
function ShowRulerPopup() {
    ShowPopup('designerModal', 'Ruler Settings', '.ruleEditor');
}

const saveParameters = () => {
    window.SchemaFormHandler.saveParameters();
};
    
const exportParameters = () => {
    var reportParams = window.SchemaFormHandler.getCurrentParameters();
    const url = createUrlFromObject(reportParams);
    autoDownloadUrl(url, 'Export - report template -' + window.aptTecReports.reportId + '.json');
    URL.revokeObjectURL(url);
};

const resetParameters = () => {
    window.SchemaFormHandler.resetParameters(); };

const toggleVariablesSection = (isHide) => {
    const element = $('#divVariablesSection');
    const isVariable = window.getComputedStyle(element[0], null).display;
    if (isVariable === 'block' || isHide === true) {
        element.hide();
        $('#paramEditorDiv').show();
    }
    else {
        buildVariablesSection();
        element.show();
        $('#paramEditorDiv').hide();
    }
};

function showEditParamters() {
    toggleVariablesSection(true);
    ShowPopup('designerModal', 'Report Designer', '#divReportDesigner', 
        saveParameters, null, resetParameters, toggleVariablesSection);
}

// function ToCanvas() {
//     const sourceWindow = document.getElementById('reportIframe').contentWindow;
//     const exporter = new Exporter();
//     const options = exporter.getPdfOptions(window.aptTecReports.ReportParams);
//     exporter.generatePDF(sourceWindow, '.pagedjs_page', options);
// }

$(document).on('input', '.ruleEditor', function (eventData) {
    const element = eventData.target;
    const value = element.type === 'checkbox' ? (element.checked ? 1 : 0) : element.value;
    document.body.style.setProperty(element.name, value + (element.dataset.suffix || ''));
});

function objectToArray(dataObject) {
    var dataArray = [];
    for (var property in dataObject) {
        //if (Object.prototype.hasOwnProperty.call(dataObject, property)  ) {
        dataArray.push({ property: property, value: dataObject[property] });
        //}
    }
    return dataArray;
}

function buildVariablesSection() {
    // eslint-disable-next-line quotes
    const tableTag = `<table id='templateVariableTable' class='dataTable display' style='width:100%'></table>`;
    document.querySelector('#divVariableContainer').innerHTML += tableTag;
    const mergedParams = {  
        ...window.aptTecReports.reportData.CommonData, 
        ...window.aptTecReports.reportData.InstanceData };
    const tableData = objectToArray(mergedParams);
    const dataTableConfig = {
        info: false, //hide footer Showing 1 to 79 of 79 entries
        ordering: false,
        paging: false,
        searching: false,
        data: tableData,
        columns: [
            { data: 'property', title: 'Property' },
            { data: 'value', title: 'Value' }
        ]
    };
    new DataTable('#templateVariableTable', dataTableConfig);    //let dataTable = 
    // https://stackoverflow.com/questions/18007630/how-to-disable-warning-datatables-warning-requested-unknown-parameter-from-the-d
    //dataTable.ext.errMode = 'none'; //to suppress the warnings from data table library in case if a property is missing.
    $('.dataTable').on('error.dt', function (e, settings, techNote, message) {
        console.error('An error has been reported by DataTables: ', message);
    });
    
}