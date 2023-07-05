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

function createQueriesData(serp) {
    const queriesData = [];
    for (const data of dataSelected) {
        const URLs = serp.filter(el => el[0] === data[0]).map(el => el[1]);
        queriesData.push({ 'Query': data[0], 'URL': URLs, 'Similarities': [] });
    }
    return queriesData;
}

function getCommonURLs(urls1, urls2) {
    const commonURLs = urls1.filter(url => urls2.includes(url));
    return commonURLs;
}

function calculateSimilarityScore(urls1, urls2, commonURLs) {
    let score = 0;
    for (const url of commonURLs) {
        //The earlier a URL appears in a SERP, the more weight it has in the similarity calculation.
        const weight1 = urls1.length - urls1.indexOf(url);
        const weight2 = urls2.length - urls2.indexOf(url);
        score += weight1 * weight2;
    }
    return score;
}

function calculateMaxSimilarityScore(urls1) {
    let score = 0;
    for (const url of urls1) {
        //The earlier a URL appears in a SERP, the more weight it has in the similarity calculation.
        const weight1 = urls1.length - urls1.indexOf(url);
        const weight2 = urls1.length - urls1.indexOf(url);
        score += weight1 * weight2;
    }

    return score;
}

function calculateSimilarityPercentage(urls1, urls2, commonURLs) {
    
    const totalPossibleScore = calculateMaxSimilarityScore(urls1);
    const score = calculateSimilarityScore(urls1, urls2, commonURLs);
    const similarityPercentage = (score / totalPossibleScore) * 100;
    return Math.trunc(similarityPercentage);
}

function updateSimilarities(queriesData, queriesDataClone) {
    for (const queryData of queriesData) {
        for (const queryDataClone of queriesDataClone) {
            if (queryData.Query !== queryDataClone.Query) {
                const commonURLs = getCommonURLs(queryData.URL, queryDataClone.URL);
                if (commonURLs.length > 0) {
                    const similarityScore = calculateSimilarityScore(queryData.URL, queryDataClone.URL, commonURLs);
                    const similarityPercentage = calculateSimilarityPercentage(queryData.URL, queryDataClone.URL, commonURLs);
                    queryData.Similarities.push({
                        'Query': queryDataClone.Query,
                        'URLs': commonURLs,
                        'SimilarityScore': similarityScore,
                        'SimilarityPercentage': similarityPercentage
                    });
                }
            }
        }
    }
    return queriesData;
}


// Create a clone of queries data for comparison
const queriesData = createQueriesData(serp);
const queriesDataClone = JSON.parse(JSON.stringify(queriesData));

// Update the Similarities for each query in the queries data array
const updatedQueriesData = updateSimilarities(queriesData, queriesDataClone);

console.log(JSON.stringify(updatedQueriesData, null, 2));

module.exports = {
    createQueriesData,
    getCommonURLs,
    calculateSimilarityScore,
    calculateMaxSimilarityScore,
    calculateSimilarityPercentage,
    updateSimilarities,
};
