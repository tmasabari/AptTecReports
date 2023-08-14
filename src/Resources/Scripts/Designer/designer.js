import { AptTecExporter as Exporter } from './Exporter.js';

//add list items for rulers
addTags($(document)[0], '.ruler-x', '<li></li>', 50);
addTags($(document)[0], '.ruler-y', '<li></li>', 50);
//UI event handlers==========================================================
window.onload = function () {
    window.SchemaFormHandler = new SchemaFormHandler('paramEditorDiv');
    if (window.self === window.top)
    {
        var reportId = null;
        //https://stackoverflow.com/questions/7731778/get-query-string-parameters-url-values-with-jquery-javascript-querystring
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('report')) {
            reportId = urlParams.get('report');
        }
        window.aptTecReports = new AptTecReports("reportIframe", reportId, "../Data/Schema/", 
            "../Data/Templates/", "../Data/Samples/");
        window.aptTecReports.initializeDesigner();
    }
}
window.initilizePreview = function (reportParams) {
    window.aptTecReports = new AptTecReports("reportIframe", reportParams.reportId, "Data/Schema/",
        reportParams.templatesLocation, "Data/Samples/", reportParams.sourceUrl,
        reportParams.closeAction, reportParams.dataGetter);
    window.aptTecReports.initializeDesigner(false);
}

$('.printMenu').click(function () { PrintReport(); return false; }); 
$('.editMenu').click(function () { showEditParamters(); return false; });
$('.exportMenu').click(function () { ToCanvas(); return false; });
const refreshData = () => {
    window.aptTecReports.refreshData('reportIframe'); };
$('.refreshMenu').click(function () { refreshData(); return false; } ); 
$('.optionsMenu').click(function () { ShowRulerPopup(); return false; });
$('.closeMenu').click(function () { window.aptTecReports.closeAction(); return false; });
function PrintReport(event) {
    document.getElementById('reportIframe').contentWindow.print();
}
function ShowRulerPopup(event) {
    ShowPopup('designerModal', 'Ruler Settings', '.ruleEditor');
}

const saveParameters = () => {
    window.SchemaFormHandler.saveParameters(); };

const resetParameters = () => {
    window.SchemaFormHandler.resetParameters(); };

const saveParametersPrint = () => {
    window.SchemaFormHandler.saveParameters();
    PrintReport();
};

function showEditParamters(event) {
    ShowPopup('designerModal', 'Report Designer', '#paramEditorDiv', 
        saveParameters, null, resetParameters );
}

function ToCanvas(event) {
    const sourceWindow = document.getElementById('reportIframe').contentWindow;
    const exporter = new Exporter();
    const options = exporter.getPdfOptions(aptTecReports.ReportParams);
    exporter.generatePDF(sourceWindow, `.pagedjs_page`, options);
}

$(document).on('input', '.ruleEditor', function (eventData) {
    const element = eventData.target;
    const value = element.type === 'checkbox' ? (element.checked ? 1 : 0) : element.value;
    document.body.style.setProperty(element.name, value + (element.dataset.suffix || ''));
});