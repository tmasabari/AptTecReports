var aptTecReports = window.parent.aptTecReports;
// Call the loadAndReplace function when the page loads
window.onload = function ()
{   
    if (aptTecReports.ReportParams.Columns) {
        // Build the printable html data
        aptTecReports.ReportParams.Columns = mapProperties(aptTecReports.ReportParams.Columns);
        jsonToHTMLAdvanced(aptTecReports.ReportParams, '.content');
    }
    if (aptTecReports.ReportParams.Content) {
        insertHtmlContents(aptTecReports.ReportParams.Content, '.content');
    }
    window.PagedPolyfill.preview();
};