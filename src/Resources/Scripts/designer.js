// https://jsonformatter.curiousconcept.com/ to convert js code to json object

//custom code to laod the reports==========================================================
window.onload = function ()
{
    //https://stackoverflow.com/questions/7731778/get-query-string-parameters-url-values-with-jquery-javascript-querystring
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('report'))
    {
        window.ReportId = urlParams.get('report');
        RefreshData();
    }
} 
function RefreshData(event)
{
    loadAndReplace('reportIframe', window.ReportId);
}
// Function to replace placeholders in the HTML template with JSON data
function replacePlaceholders(html_template, reportDataParams)
{
    for (const key in reportDataParams)
    {
        const placeholder = new RegExp('{' + key + '}', 'g');
        value = reportDataParams[key];

        value = value.replace("{PageNumber}", "<span class='currentPageNumber'></span>");

        const functionStart = "{@", functionEnd = "@}";
        var nextIndex = value.indexOf(functionStart);
        while (nextIndex >=0) {
            var endIndex = value.indexOf(functionEnd, nextIndex);
            if (endIndex >=0)
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
        html_template = html_template.replace(placeholder, value);
    }
    return html_template;
}

// Function to fetch the HTML template and JSON data and perform the replacement
function loadAndReplace(iFrameId, reportId)
{
    var reportParamsUrl = "../Data/Reports/" + reportId + ".json";
    // Load the HTML template and parameters using fetch API (you can also use XMLHttpRequest)
    //https://developer.mozilla.org/en-US/docs/Web/API/fetch
    fetch(reportParamsUrl)
        .then(response => response.json())
        .then(reportParams =>
        {
            window.ReportParams = reportParams;

            // Load the JSON data using fetch API (you can also use XMLHttpRequest)
            fetch(window.ReportParams.ReportTemplate)
                .then(response => response.text())
                .then(html_template =>
                {
                    // Perform the replacement
                    const modified_html = replacePlaceholders(html_template, window.ReportParams.DataParams);
                    //do it one more time to modify self referencing templates.
                    const modified_html_phase2 = replacePlaceholders(modified_html, window.ReportParams.DataParams);

                    // Insert the modified HTML into the DOM
                    document.getElementById(iFrameId).srcdoc = modified_html_phase2;  //set .innerHTML for div eleement
                })
                .catch(error =>
                {
                    console.error('Error loading JSON data:', error);
                });
        })
        .catch(error =>
        {
            console.error('Error loading HTML template:', error);
        });
}

//Utility functions ==========================================================

function PrintReport(event)
{
    document.getElementById('reportIframe').contentWindow.print();
}

function TodayDate(format)
{
    return (format) ? dateFormat(Date.now(), format) : dateFormat(Date.now());
}