'use strict';
import { firstNCharacters } from '../Common/utilities.js';
export function appendJsonAsDataTable(aptTecReports, tableIndex, tableConfiguration, tableDataSource, contentDOMElement)
{
    var tableId = 'tblReport' + tableIndex;
    var tableTag = '<table id="' + tableId + '" class="dataTable display" width="100%"></table>';
  
    contentDOMElement.append(tableTag);
    const tableData = (tableDataSource) ? aptTecReports.reportData.Data[tableDataSource] 
        : aptTecReports.reportData.Data;

    //filter is equivalent to WHERE
    var colMaxLengthDefined = tableConfiguration.filter(function (colConfig) {
        return (colConfig.maxLength) && colConfig.maxLength > 0;
    });
    colMaxLengthDefined.forEach((colConfig) => {
        firstNCharacters(tableData, colConfig.field, colConfig.maxLength);
    });
  
    const dataTableConfig = {
        info: false, //hide footer Showing 1 to 79 of 79 entries
        ordering: false,
        paging: false,
        searching: false,
        data: tableData,
        columns: mapProperties(aptTecReports, tableConfiguration)
    };
    $('#' + tableId).DataTable(dataTableConfig);
}

// https://printjs.crabbly.com/#cdn
// taken from https://github.com/crabbly/Print.js/blob/master/src/js/json.js
function mapProperties(aptTecReports, properties)
{
    properties = properties.map(property =>
    {
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
    for (let i = 0; i < properties.length; i++)
    {
        //for data table https://datatables.net/manual/data/renderers#Functions
        const prop = properties[i];
        prop.data = prop.field;
        prop.title = prop.displayName;
        prop.width= prop.columnSize;
        if ((typeof prop) === 'object' && (prop.format))
        {
            const functionName = prop.format.toLowerCase();
            prop.render = aptTecReports.customFunctions[functionName]; //get member function pointer from key notation
            // switch (prop.format.toLowerCase())
            // {
            // case 'usshortdatetime':
            //     prop.render = aptTecReports.customFunctions[prop.format.toLowerCase()];
            //     break;
            // }
        }
    }

    return properties;
}