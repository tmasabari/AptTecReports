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
        addPageNumbers();
    });
};

// https://stackoverflow.com/questions/20050939/print-page-numbers-on-pages-when-printing-html
function addPageNumbers()
{
    var totalPages = Math.ceil(document.body.scrollHeight / 1123);  
    //842px A4 pageheight for 72dpi, 1123px A4 pageheight for 96dpi, 
    for (var i = 1; i <= totalPages; i++) {
        var pageNumberDiv = document.createElement("div");
        var pageNumber = document.createTextNode("Page " + i + " of " + totalPages);
        pageNumberDiv.style.position = "absolute";
        pageNumberDiv.style.top = "calc((" + i + " * (297mm - 0.5px)) - 40px)"; //297mm A4 pageheight; 0,5px unknown needed necessary correction value; additional wanted 40px margin from bottom(own element height included)
        pageNumberDiv.style.height = "16px";
        pageNumberDiv.appendChild(pageNumber);
        document.body.insertBefore(pageNumberDiv, document.getElementById("content"));
        pageNumberDiv.style.left = "calc(100% - (" + pageNumberDiv.offsetWidth + "px + 20px))";
    }
}