/** 
 * Script process:
 * 1. Create an array of objects
 * [{'Query':..., 'URL':[...]},...]
 * 
 * 2. Add similar queries to the objects
 * [
 *     {
 *         'Query': '...',
 *         'URL': ['...'],
 *         'Similarities':
 *             [
 *                 {
 *                     'Query': '...',
 *                     'Score': '...'
 *                 }
 *             ]
 *     }
 * ];
**/

require('dotenv').config();

let serp, dataSelected;

// If it's the test environment, use test data
if (process.env.NODE_ENV === 'test') {
    const fixtures = require('./fixtures.js');
    serp = fixtures.serp;
    dataSelected = fixtures.dataSelected;
} else {
    // Otherwise, fetch the data using Google Sheet functions
}

// Function to generate the initial array of query data
function generateQueriesData(dataSelected) {
    return dataSelected.map(query => ({
        'Query': query[0],
        'URL': [],
        'Similarities': []
    }));
}

// Function to search for the URLs corresponding to a query in the SERP data
function searchSerp(query, serp) {
    return serp
        .filter(ser => ser[0] === query)
        .map(ser => ser[1]);
}

// Function to update the URLs of a query in the array of query data
function updateSerp(data, query, newURL) {
    const objectToUpdate = data.find(item => item.Query === query);
    if (objectToUpdate) {
        objectToUpdate.URL = newURL;
    }
    return data;
}

// Function to update the URLs of all queries in the array of query data
function updateQueriesData(queriesData, serp, searchSerp, updateSerp) {
    for (const queryData of queriesData) {
        updateSerp(queriesData, queryData.Query, searchSerp(queryData.Query, serp));    
    }
    return queriesData;
}

// Generate the initial array of query data
let queriesData = generateQueriesData(dataSelected);
// Update the URLs of all queries in the array of query data
queriesData = updateQueriesData(queriesData, serp, searchSerp, updateSerp);

// Display the final data
console.log(queriesData);

module.exports = { generateQueriesData, searchSerp, updateSerp, updateQueriesData };
