// Call the loadAndReplace function when the page loads
window.onload = function ()
{
    // JSON result in `data` variable
    var params = window.parent.aptTecReports.ReportParams;
    params.printable = window.parent.aptTecReports.reportData.Data;//table content

    if (params.Columns)
    {
        // Build the printable html data
        //$('.content')[0].innerHTML = jsonToHTML(params);
        params.Columns = mapProperties(params.Columns);
        jsonToHTMLAdvanced(params, '.content');
    }
    if (params.Content)
    {
        insertHtmlContents(params.Content, '.content');
    }

    window.PagedPolyfill.preview();
};