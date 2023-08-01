// Call the loadAndReplace function when the page loads
window.onload = function ()
{
    // JSON result in `data` variable
    var params = window.parent.ReportParams;
    params.printable = window.parent.reportData.Data;//table content
    // Build the printable html data
    //$('.content')[0].innerHTML = jsonToHTML(params);
    params.Columns = mapProperties(params.Columns);
    jsonToHTMLAdvanced(params, '.content');

    //const inchTomm = 25.4; 
    //window.htmlWidth = Math.ceil($("html").width() / getDeviceDPI() * inchTomm); 
    //window.htmlHeight = $("html").height() / getDeviceDPI() * inchTomm; 
    //do not use Math.ceil creates problem in page detection
    //document.querySelector(":root").style.setProperty('--report-width', htmlWidth + 'mm');
    //window.TotalPages = getPageCount();  
    //document.querySelector(":root").style.setProperty('--total-pages', window.TotalPages);
    //addPageNumbers(window.TotalPages);

    //window.parent.addTags($(document)[0], 'body', '<div class="empty-page-div">&nbsp;</div>', 50);

    window.PagedPolyfill.preview();
};

// Function to get the device DPI
function getDeviceDPI() {
    const dpiDiv = document.createElement("div");
    dpiDiv.style.width = "1in";
    document.body.appendChild(dpiDiv);
    const dpi = dpiDiv.offsetWidth;
    document.body.removeChild(dpiDiv);
    return dpi;
}