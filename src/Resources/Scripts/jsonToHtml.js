function capitalizePrint(obj)
{
  return obj.charAt(0).toUpperCase() + obj.slice(1);
}
//https://stackoverflow.com/questions/206384/how-do-i-format-a-microsoft-json-date
//nowDate.format("mm/dd/yyyy hh:mm:ss tt")
function msDateToJsDate(msDate, format)
{
  var date = new Date(parseInt(msDate.substr(6)));
  date = (format) ? dateFormat(date, format) : dateFormat(date);
  return date;
}

function TodayDate(format)
{
  return (format) ? dateFormat(Date.now(), format) : dateFormat(Date.now());
}
function jsonToHTMLAdvanced(params,selector)
{
  var tableTag = '<table id="tblReport" class="display" width="100%"></table>';
  window.parent.addTags($(document)[0], selector, tableTag, 1);

  var properties = mapProperties(params.properties);
  var oTblReport = $("#tblReport");
  oTblReport.DataTable({

    info: false, //hide footer Showing 1 to 79 of 79 entries
    ordering: false,
    paging: false,
    searching: false,
    data: params.printable,
    columns: properties
  });
}

function usShortDateTime(value)
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
        ? property.columnSize + ';' : 100 / properties.length + '%;', 
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

function jsonToHTML(params)
{
  // Get the row and column data
  const data = params.printable;

  // We will format the property objects to keep the JSON api compatible with older releases
  var properties = mapProperties(params.properties);

  // Create a html table
  let htmlData = '<table>'

  // Check if the header should be repeated
  if (params.repeatTableHeader)
  {
    htmlData += '<thead>'
  }

  // Add the table header row
  htmlData += '<tr>'

  // Add the table header columns
  for (let a = 0; a < properties.length; a++)
  {
    htmlData += '<th style="width:' + properties[a].columnSize + ';' + params.gridHeaderStyle + '">' + capitalizePrint(properties[a].displayName) + '</th>'
  }

  // Add the closing tag for the table header row
  htmlData += '</tr>'

  // If the table header is marked as repeated, add the closing tag
  if (params.repeatTableHeader)
  {
    htmlData += '</thead>'
  }

  // Create the table body
  htmlData += '<tbody>'

  // Add the table data rows
  for (let i = 0; i < data.length; i++)
  {
    // Add the row starting tag
    htmlData += '<tr>'

    // Print selected properties only
    for (let n = 0; n < properties.length; n++)
    {
      let stringData = data[i]

      // Support nested objects
      const property = properties[n].field.split('.')
      if (property.length > 1)
      {
        for (let p = 0; p < property.length; p++)
        {
          stringData = stringData[property[p]]
        }
      } else
      {
        stringData = stringData[properties[n].field]
      }
      //report can use custom render function
      if (properties[n].render)
      {
        let functionObj = window[properties[n].render];
        stringData = functionObj(stringData);
        //if format in not defined then undefined will be passed.
      }
      if (!(stringData)) stringData = "";

      // Add the row contents and styles
      htmlData += '<td style="width:' + properties[n].columnSize + params.gridStyle + '">' + stringData + '</td>'
    }

    // Add the row closing tag
    htmlData += '</tr>'
  }

  // Add the table and body closing tags
  htmlData += '</tbody></table>'

  return htmlData
}