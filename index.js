require('dotenv').config();

let serp, queries, targetUrl, status;

// If it's the test environment, use test data
if (process.env.NODE_ENV === 'test') {
    const fixtures = require('./fixtures.js');

    serp = fixtures.serp;
    queries = fixtures.queries;
    targetUrl = fixtures.targetUrl;
    status = fixtures.status;
} else {
    // Otherwise, fetch the data using Google Sheet functions
}

function createQueriesData(serp, queries, targetUrl, status) {
    const queriesData = [];
    for (let i = 0; i < queries.length; i++) {
        const URLs = serp.filter(el => el[0] === queries[i][0]).map(el => el[1]);
        queriesData.push({ 'Query': queries[i][0], 'URL': URLs, 'Similarities': [], 'TargetUrl': targetUrl[i][0], 'Status': status[i][0] });
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
        const weight1 = urls1.length - urls1.indexOf(url);
        const weight2 = urls2.length - urls2.indexOf(url);
        score += weight1 * weight2;
    }
    return score;
}

function calculateMaxSimilarityScore(urls1) {
    let score = 0;
    for (const url of urls1) {
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
                        'SimilarityPercentage': similarityPercentage,
                        'TargetUrl': queryDataClone.TargetUrl,
                        'Status': queryDataClone.Status
                    });
                }
            }
        }
    }
    return queriesData;
}


function getSimilarQueries(updatedQueriesData) {
    return updatedQueriesData.map(queryData => {
        const nonZeroSimilarsWithDifferentTargetUrl = queryData.Similarities
            .filter(similarity => similarity.SimilarityPercentage !== 0 && similarity.TargetUrl !== queryData.TargetUrl && similarity.Status === "Validé")
            .sort((a, b) => b.SimilarityPercentage - a.SimilarityPercentage);

        if (nonZeroSimilarsWithDifferentTargetUrl.length === 0) {
            return [""];
        }

        const similarQueries = nonZeroSimilarsWithDifferentTargetUrl.map(similarity => `${similarity.Query} (${similarity.SimilarityPercentage}%)`);
        return [similarQueries.join(", ")];
    });
}

const queriesData = createQueriesData(serp, queries, targetUrl, status);
const queriesDataClone = JSON.parse(JSON.stringify(queriesData));
const updatedQueriesData = updateSimilarities(queriesData, queriesDataClone);
const similarQueriesArray = getSimilarQueries(updatedQueriesData);

console.log(JSON.stringify(similarQueriesArray, null, 2));

module.exports = {
    createQueriesData,
    getCommonURLs,
    calculateSimilarityScore,
    calculateMaxSimilarityScore,
    calculateSimilarityPercentage,
    updateSimilarities,
    getSimilarQueries,
};
