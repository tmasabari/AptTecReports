'use strict';
//JSON related ===================================================

export function mergeExistingProperties(source, obj2) {
    let obj1 = JSON.parse(JSON.stringify(source));  //deep copy
    for (const key in obj2) {
        if ( Object.prototype.hasOwnProperty.call(obj1, key) ) {
            obj1[key] = obj2[key];
        }
    }
    return obj1;
}
export function firstNCharacters(jsonArray, propertyToModify, n) {
    jsonArray.forEach(item => {
        if ( (item[propertyToModify]) && item[propertyToModify].length > n) {
            item[propertyToModify] = item[propertyToModify].substring(0, n);
        }
    });
    return jsonArray;
}

//dynamic loading ===================================================
export function loadStylesheet(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}
export function loadScript(url, callback, isDefer = false) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.defer = isDefer; // Load script after parsing the DOM
    script.onload = callback; // Optional: Call a Function when the script is loaded
    document.head.appendChild(script);
}


//Kendo ===================================================
export function getKendoSortedData(gridSelector) {
    if ($(gridSelector).length === 0)
        return null;  //if it is not a kendo grid return empty 
    // https://www.telerik.com/forums/get-sorted-items-without-paging
    var grid = $(gridSelector).data('kendoGrid');
    if (!(grid))
        return null;  //if it is not a kendo grid return empty 

    var result = null;
    var dataSource = grid.dataSource;
    var data = dataSource.data();
    var sort = dataSource.sort();
    if (data.length > 0 && sort)
    {  //sort throws error in case data length =0
        var query = new window.kendo.data.Query(data);
        var sortedData = query.sort(sort).data;
        result = sortedData;
    }
    else
    {
        result = data;
    }

    return result;
}

// Function to get the device DPI
export function getDeviceDPI() {
    const dpiDiv = document.createElement('div');
    dpiDiv.style.width = '1in';
    document.body.appendChild(dpiDiv);
    const dpi = dpiDiv.offsetWidth;
    document.body.removeChild(dpiDiv);
    return dpi;
}