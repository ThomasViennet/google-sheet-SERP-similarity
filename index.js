require('dotenv').config();

let serp, dataSelected, targetUrl;

// If it's the test environment, use test data
if (process.env.NODE_ENV === 'test') {
    const fixtures = require('./fixtures.js');
    serp = fixtures.serp;
    dataSelected = fixtures.dataSelected;
    targetUrl = fixtures.targetUrl;
    
} else {
    // Otherwise, fetch the data using Google Sheet functions
}

function createQueriesData(serp, dataSelected, targetUrl) {
    const queriesData = [];
    for (let i = 0; i < dataSelected.length; i++) {
        const URLs = serp.filter(el => el[0] === dataSelected[i][0]).map(el => el[1]);
        queriesData.push({ 'Query': dataSelected[i][0], 'URL': URLs, 'TargetUrl': targetUrl[i][0], 'Similarities': [] });
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

function getSimilarQueries(updatedQueriesData) {
    const result = [];

    for (const queryData of updatedQueriesData) {
        if (queryData.Similarities.length > 0) {
            // Sort the similarities in descending order of SimilarityPercentage
            queryData.Similarities.sort((a, b) => b.SimilarityPercentage - a.SimilarityPercentage);
            // Filter out the similarities where SimilarityPercentage is 0
            const filteredSimilarities = queryData.Similarities.filter(similarity => similarity.SimilarityPercentage !== 0);

            const similarQueries = filteredSimilarities.map(similarity => {
                return `${similarity.Query} (${similarity.SimilarityPercentage}%)`;
            });

            // Only add an entry in the result if there are similar queries left after filtering
            if (similarQueries.length > 0) {
                result.push([similarQueries.join(", ")]);
            }
        } else {
            result.push([""]);
        }
    }

    return result;
}

const queriesData = createQueriesData(serp, dataSelected, targetUrl);
const queriesDataClone = JSON.parse(JSON.stringify(queriesData));
const updatedQueriesData = updateSimilarities(queriesData, queriesDataClone);
const similarQueriesArray = getSimilarQueries(updatedQueriesData);

//console.log(JSON.stringify(updatedQueriesData, null, 2));

module.exports = {
    createQueriesData,
    getCommonURLs,
    calculateSimilarityScore,
    calculateMaxSimilarityScore,
    calculateSimilarityPercentage,
    updateSimilarities,
    getSimilarQueries,
};
