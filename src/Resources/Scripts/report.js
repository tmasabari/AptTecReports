// Call the loadAndReplace function when the page loads
window.onload = function ()
{
    $.getJSON(window.parent.ReportParams.DataSource, function (data)
    { 
        // JSON result in `data` variable
        var params = window.parent.ReportParams.TableParams;
        params.printable = data.Data;
        // Build the printable html data
        $('.content')[0].innerHTML = jsonToHTML(params);

        window.htmlWidth = Math.ceil($("html").width() / getDeviceDPI() * 25.4); 
        window.htmlHeight = $("html").height() / getDeviceDPI() * 25.4; 
        //do not use Math.ceil creates problem in page detection
        document.querySelector(":root").style.setProperty('--report-width', htmlWidth + 'mm');
        //window.TotalPages = getPageCount();  
        //document.querySelector(":root").style.setProperty('--total-pages', window.TotalPages);
        //addPageNumbers(window.TotalPages);
        addPages(100);

        window.PagedPolyfill.preview();
    });
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


//Test ===================================================
function addPages(pagesCount) {
    for (var i = 1; i <= pagesCount; i++)
    {
        var pageBreak = document.createElement("div");
        pageBreak.style.pageBreakAfter = 'always';
        document.body.appendChild(pageBreak);
    }
}