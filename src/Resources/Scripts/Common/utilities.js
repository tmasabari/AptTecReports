//Utility functions ==========================================================

// Function to replace placeholders in the HTML template with JSON data
function replacePlaceholders(html_template, reportDataParams)
{
    for (const key in reportDataParams)
    {
        const placeholder = new RegExp('{{' + key + '}}', 'g');
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

function mergeAllProperties(obj1, obj2) {
    for (const key in obj2) {
        obj1[key] = obj2[key];
    }
    return obj1;
}

function mergeExistingProperties(obj1, obj2) {
    for (const key in obj2) {
        if (obj1.hasOwnProperty(key)) {
            obj1[key] = obj2[key];
        }
    }
    return obj1;
}