function capitalizePrint(obj)
{
  return obj.charAt(0).toUpperCase() + obj.slice(1);
}
//https://stackoverflow.com/questions/206384/how-do-i-format-a-microsoft-json-date
//nowDate.format("mm/dd/yyyy hh:mm:ss tt")
function msDateToJsDate(msDate, format)
{
  var date = msDate;
  if (Object.prototype.toString.call(msDate) !== "[object Date]")
    date = new Date(parseInt(msDate.substr(6)));

  date = (format) ? dateFormat(date, format) : dateFormat(date);
  return date;
}

function TodayDate(format)
{
  return (format) ? dateFormat(Date.now(), format) : dateFormat(Date.now());
}
function appendJsonAsDataTable(tableIndex, tableConfiguration, tableDataSource, contentDOMElement)
{
  var tableId = 'tblReport' + tableIndex;
  var tableTag = '<table id="' + tableId + '" class="dataTable display" width="100%"></table>';
  
  contentDOMElement.append(tableTag);
  const tableData = (tableDataSource) ? aptTecReports.reportData.Data[tableDataSource] 
    : aptTecReports.reportData.Data;
  const dataTableConfig = {
    info: false, //hide footer Showing 1 to 79 of 79 entries
    ordering: false,
    paging: false,
    searching: false,
    data: tableData,
    columns: mapProperties(tableConfiguration)
  };
  $("#" + tableId).DataTable(dataTableConfig);
}

//https://datatables.net/manual/data/renderers#Functions
function usShortDateTime(value, type, row)
{
  if (value === null) return "";
  return msDateToJsDate(value, 'm/d/yyyy HH:MM:ss');
}
// https://printjs.crabbly.com/#cdn
// taken from https://github.com/crabbly/Print.js/blob/master/src/js/json.js


function mapProperties(properties)
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

    }
  });
  for (let i = 0; i < properties.length; i++)
  {
    //for data table 
    const prop = properties[i];
    prop.data = prop.field;
    prop.title = prop.displayName;
    prop.width= prop.columnSize;
    if ((typeof prop) === 'object' && (prop.format))
    {
      switch (prop.format.toLowerCase())
      {
        case 'usshortdatetime':
          prop.render = usShortDateTime;
          break;
      }
    }
  }

  return properties;
}