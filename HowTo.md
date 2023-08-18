# How-To use AptTec Reports

**Step 1:** Include the library in your page or master layout or index page depending upon your application design.

1. You can download the source code directly from the repository and include it as part of our website. OR
2. You can host this module as a separate static website. All the requests to this library are marked with crossorigin="anonymous" so that it will support anonymous CORS.

```html
    <script src="<HostedLocation>/Resources/Scripts/Integration/AptTecIntegration.js" type="module" crossorigin="anonymous"></script>
```

Please note that AptTecIntegration.js is just a starter. It will download additional supporting files whenever required.

**Step 2:** The AptTecIntegration.js module will create a namespace object window.AptTecReporting. It would be used to further communicate with the module. The Js modules are loaded asynchronously by default. So listen for DOMContentLoaded and once the module is loaded further continue the setup.

**Step 3:** Create an object for the window.AptTecReporting.Integration class. The constructor parameters are below

1. The first parameter tells where to access the module "HostedLocation". For example, if you placed the library in the reports subfolder on your website, use '/reports'. If you hosted as as a separate website use the full path 'https://yoursite.com/reports'
2. The preview will be rendered as a separate IFrame. The second parameter is to provide an id to this IFrame element.
3. Specify the locations of the default report templates using the third parameter. It can be a static folder location or any endpoint that supports GET requests. *It is recommended to use the separate location to store the template files and not to be combined with the code.*

```javascript
        var aptTecintegration;
        document.addEventListener('DOMContentLoaded',  () => {
            //this executes after all modules/deferred scripts are loaded
            aptTecintegration = new window.AptTecReporting.Integration (
               '/reports', 
               'aptTecReportsPreviewFrame',  
               '/Demo/reports/Templates/' );

            aptTecintegration.aptTecData.CommonData = {
               "Parameter1" : 'Value1',
               "Parameter2" : 'Value2',
               "ParameterN" : 'Value3'
            };
        } );
```

**Step 4:** The object aptTecintegration.aptTecData provides the option to specify the data to be printed.

The developers can load the common data that will be static for all the reports like product name, client name, client address, etc using aptTecintegration.aptTecData.CommonData property. It is just a set of Key-Value pairs. The Keys will be replaced by the values using the template engine.

**Step 5:** Include the common code to create the print preview buttons in your master page or index page. You can call this function from your individual pages/modules to show the buttons on a particular location.

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

## Parameters

1. reportId - specifies the report id to fetch the report template from the template location. The product will use the URL aptTecintegration.templatesLocation + '/' + reportId. For example '/Demo/reports/Templates/MyReport'
2. buttonParent - the CSS selector to identify the parent within the page to place the preview button
3. attributesObject - The object with the set of additional data attributes to be included in the button. It is an optional parameter
4. integrationMethod - Please refer below.
5. buttonClass - The string to specify the CSS classes for the button. Optional.
6. iconClass - The string to specify the CSS classes for the icon within the button. Optional.
7. buttonText - You can leave this empty if you like to create tool bar button
8. location - The value can be 'start, or 'end', to specify the location of the button within the parent

### **The integration method parameter**

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
