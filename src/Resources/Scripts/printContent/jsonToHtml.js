'use strict';
import { firstNCharacters } from '../Common/utilities.js';
export function appendJsonAsDataTable(aptTecReports, tableIndex, tableConfiguration, 
    tableDataSource, contentDOMElement) {

    //filter is equivalent to WHERE
    const printableColumns = tableConfiguration.filter(function (column) {
        return column.isPrint === true;
    });

    var tableId = 'tblReport' + tableIndex;
    var tableTag = '<table id="' + tableId + '" class="dataTable display" width="100%"></table>'; 
    contentDOMElement.append(tableTag);
    const tableData = (tableDataSource) ? aptTecReports.reportData.Data[tableDataSource] 
        : aptTecReports.reportData.Data;

    //filter is equivalent to WHERE
    var colMaxLengthDefined = printableColumns.filter(function (colConfig) {
        return (colConfig.maxLength) && colConfig.maxLength > 0;
    });
    colMaxLengthDefined.forEach((colConfig) => {
        firstNCharacters(tableData, colConfig.field, colConfig.maxLength);
    });
    const countableColumns = tableConfiguration.filter(function (column) {
        return column.TotalCount === true;
    });
    const dataTableConfig = {
        info: false, //hide footer Showing 1 to 79 of 79 entries
        ordering: false,
        paging: false,
        searching: false,
        data: tableData,
        columns: mapProperties(aptTecReports, printableColumns),
    };
    if (countableColumns && countableColumns.length > 0) {
        dataTableConfig.footerCallback =  function () {  //row, data, start, end, display
            let api = this.api();
    
            // Remove the formatting to get integer data for summation
            // https://cdn.datatables.net/plug-ins/1.12.1/api/sum().js
            let numValue = function (i) {
                return typeof i === 'string'
                    ? i.replace(/[^\d.-]/g, '') * 1     // /[\$,]/g, ''
                    : typeof i === 'number' ? i : 0;
            };
    
            // Total over all pages
            // total = api
            //     .column(4)
            //     .data()
            //     .reduce((a, b) => numValue(a) + numValue(b), 0);
            // // Total over this page
            // pageTotal = api
            //     .column(4, { page: 'current' })
            //     .data()
            //     .reduce((a, b) => numValue(a) + numValue(b), 0);

            // Sum each of 4 columns, beginning with col[0]:
            for (var i = 0; i < printableColumns.length; i++) {
                const columnConfig = printableColumns[i];
                if (columnConfig.TotalCount === true) {
                    let sum = api.column(i).data()
                        //.sum();
                        .reduce((a, b) => numValue(a) + numValue(b), 0);
                    api.column(i).footer().innerHTML = sum;
                    // Update footer api.column(4).footer().innerHTML = '$' + pageTotal + ' ( $' + total + ' total)';
                }
            }
        };
        const columnCell = '<th></th> ';
        const footerHtml = `<tfoot><tr> ${columnCell.repeat(printableColumns.length)}</tr></tfoot>`;
        $('#' + tableId).append(footerHtml);
    }
    var columnStylesTag = '<Style>';
    $('#' + tableId).DataTable(dataTableConfig);
    for (let index = 0; index < printableColumns.length; index++) {
        const columnConfig = printableColumns[index];

        var headerColumnStyle = 'cssTH-' + columnConfig.field;
        $(`#${tableId} tr th:nth-child(${index + 1})`).addClass(headerColumnStyle);
        columnStylesTag += `.${headerColumnStyle} { ${(columnConfig.TitleStyle) ? columnConfig.TitleStyle : '' } }\n`;

        var contentColumnStyle = 'cssTD-' + columnConfig.field;
        $(`#${tableId} tr td:nth-child(${index + 1})`).addClass(contentColumnStyle);
        columnStylesTag += `.${contentColumnStyle} { ${(columnConfig.ContentStyle) ? columnConfig.ContentStyle : '' } }\n`;
    }
    columnStylesTag += '</Style>';

    contentDOMElement.append(columnStylesTag);
}

// https://printjs.crabbly.com/#cdn
// taken from https://github.com/crabbly/Print.js/blob/master/src/js/json.js
function mapProperties(aptTecReports, properties) {
    properties = properties.map(property => {
        return {
            field: typeof property === 'object'
                ? property.field : property,
            displayName: typeof property === 'object'
                ? property.displayName : property,
            columnSize: typeof property === 'object' && property.columnSize
                ? property.columnSize  : 100 / properties.length + '%', 
            format: typeof property === 'object' && property.format
                ? property.format : ''
        };
    });
    for (let i = 0; i < properties.length; i++) {
        //for data table https://datatables.net/manual/data/renderers#Functions
        const prop = properties[i];
        prop.data = prop.field;
        prop.title = prop.displayName;
        prop.width= prop.columnSize;
        if ((typeof prop) === 'object' && (prop.format)) {
            const functionName = prop.format.toLowerCase();
            prop.render = aptTecReports.customFunctions[functionName]; //get member function pointer from key notation
        }
    }

    return properties;
}