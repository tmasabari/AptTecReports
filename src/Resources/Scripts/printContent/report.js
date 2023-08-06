var aptTecReports = window.parent.aptTecReports;
window.PagedConfig = {
    auto: false
    //, after: (flow) => { console.log("after", flow) },
};

// Call the loadAndReplace function when the page loads
window.onload = function ()
{
    const contentSelector = '.content';
    const contentDOMElement = $(contentSelector);
    var tableIndex = 1;
    if (aptTecReports.ReportParams.Content) {
        for (let contentIndex = 0; contentIndex < aptTecReports.ReportParams.Content.length; contentIndex++) {
            const contentElement = aptTecReports.ReportParams.Content[contentIndex];
            if (contentElement.hasOwnProperty('ContentHtml')) {
                const htmlContent = replacePlaceholders(contentElement.ContentHtml, 
                    aptTecReports.reportData.CommonData);
                //append/insert at the end template replaced content to contents
                contentDOMElement.append(htmlContent);
            }
            else {

                if (contentElement.hasOwnProperty('TableContent')  && 
                    Array.isArray(contentElement.TableContent)) {
                    const tableDataSource = contentElement.DataSource;
                    const tableConfiguration = contentElement.TableContent;
                    //Build the printable html data append/insert at the end template replaced content to contents
                    appendJsonAsDataTable(tableIndex, tableConfiguration, tableDataSource, contentDOMElement);
                    tableIndex++;
                }
            }
        }
    }

    window.PagedPolyfill.preview(); //render the print preview
};