export class Downloader
{
    generateJsonUrlFromString(jsonString) {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        return url;
    }
    generateJsonUrlFromObject(object) {
        const jsonString = JSON.stringify(object, null, 2);
        //space (2): A string or number that's used to add whitespace to the output JSON string for formatting purposes.
        return this.generateJsonUrlFromString(jsonString);
    }

    autoDownloadUrl(url, filename = 'data.json') {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }

    /**
     * Calls the list of Urls to fetch the data and returns the results
     * @param {Array} urls to get the data
     * @returns {Array} The 'results' array will contain the resolved values of all services
     */
    download(urls, isCors)
    {   
        const corsMode = { mode: (isCors) ? 'no-cors' : 'cors' };
        //try 1
        const promises = [];
        urls.forEach(url => {
            const promise = fetch(url, corsMode);
            promises.push(promise);
        });
        
        //It uses Promise.allSettled() to wait for all promises to either resolve or reject. This method returns an array of objects representing the settlement status of each promise.
        return Promise.allSettled(promises).then((settledResults) =>
        {
            //try 2
            const retryPromises = []; //keep track of the indexes of failed promises that need to be retried.
            const retryIndexes = [];  //the promises for retrying the failed service calls.
            //iterates over the settledResults array to identify the failed service calls and 
            //constructs an array of retry promises 
            settledResults.forEach((settledResult, index) => {
                if (settledResult.status === 'rejected') {
                    console.error(`Retrying the call to ${urls[index]}:`, settledResult.reason);
                    retryPromises.push( fetch(urls[index], corsMode) );
                    retryIndexes.push(index);
                }
            });

            //this promise will fail if any one of the call is failed
            return Promise.all(retryPromises).then((retryResults) =>
            {
                // Combine original successful results and retry results
                //take initial results and if it is not fulfilled take from retry results and shift the arry
                const allResults = settledResults.map((settledResult, index) => {
                    if (settledResult.status === 'fulfilled') {
                        //If it was originally successful, we use its value from settledResults
                        return settledResult.value;
                    } else if (retryIndexes.includes(index)) {
                        //index = initial url index/first time failed index
                        //this index is value of retryindex array. Get index of retryindex array's index
                        const retryIndex = retryIndexes.indexOf(index);
                        return retryResults[retryIndex];
                    } 
                }); 

                console.log('All service calls completed:', allResults);
                return allResults;
            });
        });
        // handle the catch in calling function using the promise returned nothing to do here
        // .catch((error) =>
        // {
        //     console.error("Error occurred:", error);
        // });
    }
}