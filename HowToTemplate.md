# Create Report Templates

* The business analysts and developers can configure the default layout for the reports using templates.
* Developers/BAs can enable or add multiple HTML sections and Tables using the template file
* The settings set on the template files will be the default settings applied for all the users.
* The users can **only** select the columns from the list set from the template file.
* If users click the Reset button on the report designer the settings will be reverted back to the templates file settings.

## Report template structure

* The report template is just a JSON file.

  * The developers/BAs can either configure the JSON file fully from the scratch or
  * they can use start with the base template and use the Report designer page
* "ReportTemplate" - string value. "paged.html" is the only supported value. This can be expanded to support more templates in future.
* "DataSource" -string value. Endpoint for the data. Leave it blank to specify the custom data using the client side code.
* "PageHeadersHtml", "PageFootersHtml", "ReportFootersHtml", "ReportHeadersHtml": HTML Code
* "Content" - **Array of content sections.** The section can be a "TableContent" or "ContentHtml". **This is powerful option to fully customize the reports. You can add multiple tables and html contents**

  * "TableContent" - indicates it is going to render the table data. The developer has to specify the list of column definitions.
    * "field" - string value that specify the "jsonPropertyName" to be associated with the datasource. This is not visible in the table designer.
    * "isPrint": boolean value that specify the column is to printed by default or not.
    * "displayName" -  string value that specify the "Column Title" to be printed on table headers.
    * "columnSize": string value that specify the "Column width" in css units. [CSS values and units - Learn web development | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
    * "format": string value that specify the "formatter function". This is case insensitive name.
      * ShortDateTime - The value can be either JS Date or MS Date time stamp. This will be shown as **M/D/YYYY HH:MM:ss**.
      * Decimal
      * Percent
      * Currency
      * DateTime24 - "12/19/2012, 19:00:00"
      * The developers can add their custom functions.
    * "maxLength":number value. To spcficy the maximum number of characters to be printed. To print only the first N characters from a column. The rest of of the characters will be ignored. Specify 0 to include all the characters.
    * "TitleStyle": list of css styles to format the column header cells
    * "ContentStyle": list of css styles to format the column content cells
    * "TotalCount": true/false to instruct the report engine to generate the report total row or not.

![Alt text](./diagrams/TableDesigner.drawio.svg?raw=true&sanitize=true "Table Designer")

## Base layout file

```json
{
    "ReportTemplate": "paged.html",
    "DataSource": "",
    "PageHeadersHtml": "<table style=\"border-collapse:collapse;width: 100%;\"><tbody>\n<tr>\n\t<td style=\"width: 20%;text-align:left;\">{{OrgAddress1}}<br/>{{OrgAddress2}}<br/>{{OrgAddress3}}</td>\n\t<td style=\"width: 60%; text-align: center;\"><strong>{{OrgTitle}}<br/>{{ReportTitle}}<br/>{{ReportSubTitle}}</strong><br></td>\n\t<td style=\"width: 20%;text-align:right;\">{@TodayDateUS@}<br/>Page{{PI}} of {{PC}}</td></tr></tbody></table>",
    "PageFootersHtml": "",
    "ReportFootersHtml": "",
    "ReportHeadersHtml": "",
    "Layout": {
        "PaperSize": "ledger",
        "PaperLayout": "landscape",
        "Report-Top-Margin": 10,
        "Report-Right-Margin": 10,
        "Report-Bottom-Margin": 10,
        "Report-Left-Margin": 10,
        "Page-Header-Height":30,
        "Page-Footer-Height": 20,
        "CustomStyle":""
    },
    "Content": [
        {
            "DataSource": "jobsData",
            "TableContent": 
		[
                	{
                    		"isPrint": true/false,
                    		"field": "jsonPropertyName",
                    		"displayName": "Column Title",
                    		"columnSize": "10ch/10em/10mm",
                    		"format": "USShortDateTime/ShortDateTime/Decimal/Percent/Currency/DateTime24",
                    		"maxLength": 0,
                    		"TitleStyle": "",
                   		"ContentStyle": "",
                    		"TotalCount": true/false
                	}  
		]
        },
        {
            "ContentHtml": "<br/>Section 1:  Extra formatted HTML content can be placed here. You can add as many content as you want"
        }
    ]
}
```
