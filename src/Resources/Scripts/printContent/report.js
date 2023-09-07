'use strict';
//css
import '../../css/printContent/pagedjsTable.css';
import '../../css/printContent/paper.css';
//scripts
import { appendJsonAsDataTable } from './jsonToHtml.js';
var aptTecReports = window.parent.aptTecReports;
// Call the loadAndReplace function when the page loads
window.onload = function () {
    // https://stackoverflow.com/questions/18007630/how-to-disable-warning-datatables-warning-requested-unknown-parameter-from-the-d
    $.fn.dataTable.ext.errMode = 'none'; //to suppress the warnings from data table library in case if a property is missing.
    $('.content .dataTable').on('error.dt', function (e, settings, techNote, message) {
        console.error('An error has been reported by DataTables: ', message);
    });
    
    const contentSelector = '.content';
    const contentDOMElement = $(contentSelector);
    var tableIndex = 1;
    if (aptTecReports.ReportParams.Content) {
        for (let contentIndex = 0; contentIndex < aptTecReports.ReportParams.Content.length; contentIndex++) {
            const contentElement = aptTecReports.ReportParams.Content[contentIndex];
            if ( Object.prototype.hasOwnProperty.call(contentElement, 'ContentHtml')  ) {
                var htmlContent = aptTecReports.replacePlaceholders(contentElement.ContentHtml, 
                    aptTecReports.reportData.CommonData);
                htmlContent = aptTecReports.replacePlaceholders(htmlContent, 
                    aptTecReports.reportData.InstanceData);
                //append/insert at the end template replaced content to contents
                contentDOMElement.append(htmlContent);
            }
            else {

                if ( Object.prototype.hasOwnProperty.call(contentElement, 'TableContent') && 
                    Array.isArray(contentElement.TableContent)) {
                    const tableDataSource = contentElement.DataSource;
                    //Build the printable html data append/insert at the end template replaced content to contents
                    appendJsonAsDataTable(aptTecReports, tableIndex, contentElement.TableContent, tableDataSource, contentDOMElement);
                    tableIndex++;
                }
            }
        }
    }

    window.PagedPolyfill.preview(); //render the print preview
};