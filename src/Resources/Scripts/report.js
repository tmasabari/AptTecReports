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

        var htmlWidth = getStylesheetPropertyForElement('html', 'width');
        //change the root variable using the javascript
        document.querySelector(":root").style.setProperty('--report-width', htmlWidth);
        //addPageNumbers();
    });
};
// getComputedStyle will give you the actual width of the div, not the width specified in the style sheet.
// identify the originally defined css style. But this is not fully working in case of ! important.
// https://stackoverflow.com/questions/63649514/how-to-get-defined-width-of-element-via-js
const cssRules = Array.from(document.styleSheets[0].cssRules); //the 3 styles youve set
function getStylesheetPropertyForElement(selector, property)
{ 
    let element = document.querySelector(selector), appliedStyle = "";
    if (!element) return false;
    // prefer inline style if available!
    if (element.style[property]) return element.style[property];//
    // reverse the order of the rules. 
    // naively assumes the most recent rule is the one thats applied
    // makes no attempt to handle priority and !important
    cssRules.reverse().some(rule =>
    {
        // does the selector for this rule match?
        if ((rule.selectorText) && element.matches(rule.selectorText))
        {
            //yes. is there a rule for the required property?
            if (Array.from(rule.style).some(el => el === property))
            {
                // great
                appliedStyle = rule.style[property];
                return true;
            }
        }
    });
    return appliedStyle;
}
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