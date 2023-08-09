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

//JSON related ===================================================
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
function firstNCharacters(jsonArray, propertyToModify, n) {
    jsonArray.forEach(item => {
        if (item[propertyToModify].length > n) {
            item[propertyToModify] = item[propertyToModify].substring(0, n);
        }
    });
    return jsonArray;
}

//dynamic loading ===================================================
function loadStylesheet(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}
function loadScript(url, callback, isDefer = false) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.defer = isDefer; // Load script after parsing the DOM
    script.onload = callback; // Optional: Call a function when the script is loaded
    document.head.appendChild(script);
}