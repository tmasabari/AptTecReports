// https://jsonformatter.curiousconcept.com/ to convert js code to json object


//UI event handlers==========================================================
function PrintReport(event)
{
    document.getElementById('reportIframe').contentWindow.print();
}
function ShowRuler(event)
{
    ShowPopup('designerModal', 'Ruler Settings', '.ruleEditor');
}
function showEditParamters(event)
{
    ShowPopup('designerModal', 'Edit Parameters', '#paramEditorDiv', saveParameters);
}

function ToCanvas(event)
{
    childWindow = document.getElementById('reportIframe').contentWindow;
    childWindow.html2canvas(document.querySelector("html")).then(canvas =>
    {
        document.body.appendChild(canvas)
    });

}

window.onload = function ()
{
    //https://stackoverflow.com/questions/7731778/get-query-string-parameters-url-values-with-jquery-javascript-querystring
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('report'))
    {
        window.ReportId = urlParams.get('report');
        initializeDesigner();
    }
} 
//custom code to load the reports==========================================================

function initializeDesigner(event)
{
    //convert json to schema https://codebeautify.org/json-to-json-schema-generator
    const schemaParamsUrl = "../Data/Master/ReportParametersSchema.json";
    fetch(schemaParamsUrl)
        .then(response => response.json())
        .then(reportSchema =>
        {
            window.ReportSchema = reportSchema; 
            refreshReport('reportIframe', window.ReportId);
        })
        .catch(error =>
        {
            console.error('Error loading parameters schema:', error);
        });
}


// Function to fetch the HTML template and JSON data and perform the replacement
function refreshReport(iFrameId, reportId)
{
    var reportParamsUrl = "../Data/Reports/" + reportId + ".json";
    // Load the HTML template and parameters using fetch API (you can also use XMLHttpRequest)
    //https://developer.mozilla.org/en-US/docs/Web/API/fetch
    fetch(reportParamsUrl)
        .then(response => response.json())
        .then(reportParams =>
        {
            window.ReportParams = reportParams;
            refreshData(iFrameId);
        })
        .catch(error =>
        {
            console.error('Error loading HTML template:', error);
        });
}

// Function to fetch the HTML template and JSON data and perform the replacement
function refreshData(iFrameId)
{
    $.getJSON(window.ReportParams.DataSource, function (data) {
        window.reportData = data; 
        onReportParametersChanged(iFrameId);
    });
}

function onReportParametersChanged(iFrameId)
{
    if (!(Window.ReportTemplateSource) || Window.ReportTemplateSource !== window.ReportParams.ReportTemplate)
    {
        // Load the JSON data using fetch API (you can also use XMLHttpRequest)
        fetch(window.ReportParams.ReportTemplate)
            .then(response => response.text())
            .then(html_template =>
            {
                window.htmlTemplate = html_template;
                Window.ReportTemplateSource = window.ReportParams.ReportTemplate;
                loadReportTemplate(iFrameId);
            })
            .catch(error =>
            {
                console.error('Error loading JSON data:', error);
            });
    }
    else {
       loadReportTemplate(iFrameId);
    }
}

function loadReportTemplate(iFrameId)
{
    // Perform the replacements
    var modified_html = replacePlaceholders(window.htmlTemplate, window.ReportParams);
    modified_html = replacePlaceholders(modified_html, window.ReportParams.Layout);
    modified_html = replacePlaceholders(modified_html, window.reportData.CommonData); //final replacements with server data

    // Insert the modified HTML into the DOM
    document.getElementById(iFrameId).srcdoc = modified_html;  //set .innerHTML for div eleement

    //finally init the json editor
    initJsoneditor();
}
//Editor ===================================================
const jsonEditorForm = document.getElementById('paramEditorDiv');
var paramEditorOptoins = {
    max_depth: 10,   //to avoid infinite loop. Max depth of the nested properties to be rendered of provided json schema.

    iconlib: 'fontawesome5',
    //object_layout: 'grid-strict',
    show_errors: 'always',
    theme: 'bootstrap5',
    array_controls_top: true,
    disable_array_add: false,
    disable_array_delete: false,
    disable_array_delete_all_rows: false,
    disable_array_delete_last_row: true,
    disable_array_reorder: false,
    disable_collapse: true,
    disable_edit_json: true,
    disable_properties: true,
    display_required_only: false,
    enable_array_copy: false
}

var data = {
    options: paramEditorOptoins
}
var modifiedParams;
var isValid;
var errors='';
var jsoneditor = null;
var initJsoneditor = function () {
    // destroy old JSONEditor instance if exists
    if (jsoneditor) {
        //jsoneditor.destroy();
        jsoneditor.setValue(window.ReportParams);
        return;
    }
    data.options.schema = window.ReportSchema;

    // new instance of JSONEditor
    jsoneditor = new window.JSONEditor(jsonEditorForm, data.options);
    // we can enable/disable entire form or part of the form as well
    //editor.getEditor('root.location').disable();

    jsoneditor.on('ready', () =>
    {
        // Now the api methods will be available
        jsoneditor.setValue(window.ReportParams);
    });

    // listen for changes
    //jsoneditor.on('change', function () {
    //    saveParameters();
    //});
}

function saveParameters() {
    /* // Get a reference to a node within the editor
        const name = editor.getEditor('root.name');

        // `getEditor` will return null if the path is invalid
        if (name)
        {
            name.setValue("John Smith");

            console.log(name.getValue());
        }
        */


    // validate
    var validationErrors = jsoneditor.validate();
    if (validationErrors.length)
    {
        isValid = false;
        // errors is an array of objects, each with a `path`, `property`, and `message` parameter
        // `property` is the schema keyword that triggered the validation error (e.g. "minLength")
        // `path` is a dot separated path into the JSON object (e.g. "root.path.to.field")
        errors = JSON.stringify(validationErrors, null, 2)
        alert(errors);
    } else
    {
        isValid = true;
        // output
        var reportParams = jsoneditor.getValue();
        window.ReportParams = reportParams;
        //refreshReport('reportIframe', window.ReportId);
        onReportParametersChanged('reportIframe');
        //modifiedParams = JSON.stringify(json, null, 2); 
    }
}

//Utility functions ==========================================================

// Function to replace placeholders in the HTML template with JSON data
function replacePlaceholders(html_template, reportDataParams)
{
    for (const key in reportDataParams)
    {
        const placeholder = new RegExp('{' + key + '}', 'g');
        value = reportDataParams[key];
        if (typeof value === 'object')
            continue;

        //value = value.replace("{PageNumber}", "<span class='currentPageNumber'></span>");
        if (typeof value === 'string')
        {
            const functionStart = "{@", functionEnd = "@}";
            var nextIndex = value.indexOf(functionStart);
            while (nextIndex >= 0)
            {
                var endIndex = value.indexOf(functionEnd, nextIndex);
                if (endIndex >= 0)
                {
                    const stringFound = value.substring(nextIndex + functionStart.length, endIndex);
                    // https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string/359910#359910
                    const codeToExecute = "return " + stringFound;
                    const tempFunction = new Function(codeToExecute);
                    const returnValue = tempFunction();
                    value = value.replace(functionStart + stringFound + functionEnd, returnValue);
                }
                nextIndex = value.indexOf(functionStart);
            }
        }
        html_template = html_template.replace(placeholder, value);
    }
    return html_template;
}

function TodayDate(format)
{
    return (format) ? dateFormat(Date.now(), format) : dateFormat(Date.now());
}

//Page ===================================================
function addTags(document, parentSelector, tag, pagesCount)
{
    var content = '';
    for (var i = 1; i <= pagesCount; i++)
    {
        content += tag;
    }
    document.querySelector(parentSelector).innerHTML += content;
}