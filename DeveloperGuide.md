# How-To use AptTec Reports

![Alt text](https://file+.vscode-resource.vscode-cdn.net/d%3A/GitHub/HTML%20Report%20Generator/diagrams/ClientReportingFlow.drawio.svg?raw=true&sanitize=true "Solution")

**Step 1:** Include the library in your page or master layout or index page depending upon your application design.

1. You can directly use the CDN. (**preferred**)
   ```
   <script src='https://cdn.jsdelivr.net/npm/@apttec/reports@2.0.8/dist/AptTecIntegration.bundle.js' type="module" crossorigin="anonymous"></script>
   ```
2. You can download the source code directly from the repository and include it as part of our website or as a separate static website.

```html
<script src="<HostedLocation>/dist/AptTecIntegration.bundle.js" type="module" crossorigin="anonymous"></script>
```

Please note that /dist/AptTecIntegration.bundle.js is just a starter. It will download additional supporting files whenever required.

**Step 2:** The /dist/AptTecIntegration.bundle.js module will create a namespace object window.AptTecReporting. It would be used to further communicate with the module. The Js modules are loaded asynchronously by default. So listen for DOMContentLoaded and once the module is loaded further continue the setup.

```js
        var aptTecintegration;
        document.addEventListener('DOMContentLoaded',  () => {
            //this executes after all modules/deferred scripts are loaded

            aptTecIntegration = new window.AptTecReporting.Integration(
                baseLocation + 'dist/', 'builtinLocalDataFrame', 
                dataLocation + 'Templates/', null , true,
                dataLocation + 'Samples/');
/* assign the CommonData either directly or from the REST URL
            aptTecintegration.aptTecData.CommonData = {
               "Parameter1" : 'Value1',
               "Parameter2" : 'Value2',
               "ParameterN" : 'Value3'
            };
*/
            aptTecIntegration.fetchData("<ServiceEndPoint>", 'CommonData', 'CommonData');

        } );
```

**Step 3:** Create an object for the window.AptTecReporting.Integration class. The constructor parameters are below

1. The first parameter tells where to access the module "HostedLocation". For example, if you placed the library in the reports subfolder on your website, use '/reports'. If you hosted as as a separate website use the full path 'https://yoursite.com/reports'
2. The preview will be rendered as a separate IFrame. The second parameter is to provide an id to this IFrame element.
3. Specify the locations of the default report templates using the third parameter. It can be a static folder location or any endpoint that supports GET requests.
   *It is recommended to use the separate location to store the template files and not to be combined with the code.*
4. The fourth paramter allows the developer to apply the CSS styles to the IFrame. You can leave it as null.
5. The fifth paramter allows the developer to enable or disable the designer for the end users. If developer set this value to false the designer button will not be visible for the end users.

The JSON response for the aptTecIntegration.fetchData should be similar to the below. The object returned under "CommonData" property will be assigned to CommonData of the reports. This data can be used to replace placeholders/mailmerge fields.

```json
{
    "CommonData": {
        "User.FirstName": "First Name",
        "User.LastName": "Last Name",
        "User.Initials": "FL",
        "User.Email": "Support@Domain.Com"
    }
}
```


## Print Report

**Step 4:** Whenever you want to invoke and show the report just assign the method to the

```
window.aptTecIntegration.designerWindow.aptTecReports.dataGetter= () => { your logic here };
```

 and call the

```
aptTecIntegration.showPreview('<reportId>').
```

reportId - specifies the report id to fetch the report template from the template location. The product will use the URL aptTecintegration.templatesLocation + '/' + reportId. For example '/Demo/reports/Templates/MyReport'

The dataGetter method can return any one of the following

1. returns an object which contains the data to be printed or
2. returns a promise that returns the data in following format.

```
{ CommonData: {}, InstanceData: {}, Data: [] }
```

* Data property - the actual data to be bound to the table.
* CommonData property (optional) - The developers can load the common data that will be static for all the reports like product name, client name, client address, etc. It is just a set of Key-Value pairs. The Keys will be replaced by the values using the template engine.
* InstanceData property - Similar to CommonData. It is a set of Key-Value pairs. To provide the template paramters specific to the report.

## Alternate approach: Create a custom print preview button

The object aptTecintegration.aptTecData provides the option to specify the data to be printed.

Include the common code to create the print preview buttons in your master page or index page. You can call this function from your individual pages/modules to show the buttons on a particular location.

```javascript
        function enableAddPrintPreview(reportId, buttonParent, integrationMethod, 
        position = 'start', dataAttributes={}) {
            const previewButtonResult = aptTecintegration.addPreviewButton(
               reportId, 
               buttonParent, 
               dataAttributes, 
               integrationMethod, 
               'btn btn-success', 
               'fa fa-print', 
               '', 
               position);

            return previewButtonResult.previewButton[0];
        }
```

### Parameters

1. buttonParent - the CSS selector to identify the parent within the page to place the preview button
2. attributesObject - The object with the set of additional data attributes to be included in the button. It is an optional parameter
3. integrationMethod - Please refer below.
4. buttonClass - The string to specify the CSS classes for the button. Optional.
5. iconClass - The string to specify the CSS classes for the icon within the button. Optional.
6. buttonText - You can leave this empty if you like to create tool bar button
7. location - The value can be 'start, or 'end', to specify the location of the button within the parent

#### **The integration method parameter**

This parameter provides an option for the developer to specify how the data is to be retrieved when the user clicks the print preview button.

**'direct'** - If the page already fetched the data and is available as a Js object, use this value. You can assign the value to the printData property of the button element.

```javascript

   const previewButton = enableAddPrintPreview(
      'DailyTotals', 
      '#shellContentContainer > div ', 
      'direct',
      'end');

   previewButton.printData=listDailyTotals;
```

**'kendoGrid'** - If you have a kendo grid and would like to print all the data associated with it, use this value. This requires a CSS selector for the kendo grids needs to be passed as the data attributes parameter

```javascript

    document.addEventListener('DOMContentLoaded', () => { 
        var previewButton = enableAddPrintPreview(
        'publicSearchResults', 
        '#Grid .k-grid-toolbar', 
        'kendoGrid', 
        'start'
        , { grid-id: '#Grid'} );
    });

```

**function** - If you like to do custom logic to populate the print data you can pass a function to as a integration method.

```javascript

    const previewButton = enableAddPrintPreview(
        'DailyTotals', 
        '#shellContentContainer > div ', 
        () => { 
            // do you custom logic here and populate the listDailyTotals
            aptTecintegration.aptTecData.Data = listDailyTotals; 
            return aptTecintegration.aptTecData;
        }, 
        'end'
    );

```

**function with promise** - To retrieve the data from the server before showing the print preview, you can return the **Promise** from your function.

```javascript

    const previewButton = enableAddPrintPreview(
        'DailyTotals', 
        '#shellContentContainer > div ', 
        () => { 
        return new Promise(function (previewDataResolve, previewDataReject) {
            service.getDailyTotal({
                currentPage: 1,
                pageSize: 100000,
                sortOrder: sortFiledName(),
                beginDate: startDate(),
                endDate: endDate()
            })
            .done ( listDailyTotals => { 
                    aptTecintegration.aptTecData.Data = listDailyTotals;
                    // resolve the promise and return the data
                    previewDataResolve(aptTecintegration.aptTecData);
                })
            .fail ( data => { previewDataReject(); } );
        } );
        }, 
        'end'
    );

```
