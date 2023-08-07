//add list items for rulers
addTags($(document)[0], '.ruler-x', '<li></li>', 50);
addTags($(document)[0], '.ruler-y', '<li></li>', 50);
//UI event handlers==========================================================
window.onload = function ()
{
    window.SchemaFormHandler = new SchemaFormHandler('paramEditorDiv')
    window.aptTecReports = new AptTecReports(
        "reportIframe", "../Data/Schema/", "../Data/Templates/", "../Data/Samples/");
    window.aptTecReports.initializeDesigner();
}

$('.printMenu').click(function () { PrintReport(); return false; }); 
$('.editMenu').click(function () { showEditParamters(); return false; }); 
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
    childWindow = document.getElementById('reportIframe').contentWindow;
    childWindow.html2canvas(document.querySelector("html")).then(canvas => {
        document.body.appendChild(canvas)
    });
}

$(document).on('input', '.ruleEditor', function (eventData) {
    const element = eventData.target;
    const value = element.type === 'checkbox' ? (element.checked ? 1 : 0) : element.value;
    document.body.style.setProperty(element.name, value + (element.dataset.suffix || ''));
});