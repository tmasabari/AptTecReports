
// getComputedStyle will give you the actual width of the div, not the width specified in the style sheet.
// identify the originally defined css style. But this is not fully working in case of ! important.
// Do NOT return there could be a override at the bottom of the style sheet.
//DOES NOT MATCH properly at all getStylesheetPropertyForElement
// https://stackoverflow.com/questions/63649514/how-to-get-defined-width-of-element-via-js

// https://stackoverflow.com/questions/20050939/print-page-numbers-on-pages-when-printing-html
//DOES NOT WORK with Page break css settings
// another does not work https://jsfiddle.net/5u4nvs2a/4/
function addPageNumbers(totalPages)
{
    //pageWidth = window.getComputedStyle(document.querySelector(":root"), null).getPropertyValue("--page-width");
    for (var i = 1; i <= totalPages; i++)
    {
        var pageNumberDiv = document.createElement("div");
        pageNumberDiv.className = 'pageNumberDiv';
        var pageNumber = document.createTextNode("Page " + i + " of " + totalPages);
        pageNumberDiv.style.position = "absolute";
        pageNumberDiv.style.zIndex = "999999";
        pageNumberDiv.style.top = "calc((" + i + " * (" + window.htmlHeight + "mm + 8px)) - 40px)";
        pageNumberDiv.style.right = "20mm";
        //not needed
        //left = "calc(100% - (" + pageNumberDiv.offsetWidth + "px + 20px))";
        //297mm A4 pageheight; 0,5px unknown needed necessary correction value; additional wanted 40px margin from bottom(own element height included)
        pageNumberDiv.style.height = "16px";
        pageNumberDiv.appendChild(pageNumber);
        document.body.appendChild(pageNumberDiv);
        //document.body.insertBefore(pageNumberDiv, document.getElementById("content"));
    }
}


function getPageCount()
{
    const mmToInch = 0.0393701;
    const pageHeightPixels = window.htmlHeight * mmToInch * getDeviceDPI();
    //headerTotalHeight = $(".header-space").height();
    //footerTotalHeight = $(".footer-space").height();
    var pageContentHeight = pageHeightPixels - headerTotalHeight - footerTotalHeight;
    var totalContentHeight = document.body.scrollHeight;
    const totalPages = Math.ceil(totalContentHeight / pageContentHeight);
    //842px A4 pageheight for 72dpi, 1123px A4 pageheight for 96dpi, WRONG
    return totalPages;
}

function removeLastChars(text, n)
{
    n *= -1;
    return text.slice(0, n);
}