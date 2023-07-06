// Start for Google Sheet
// Otherwise, fetch the data using Google Sheet functions
function onOpen(e) {
    SpreadsheetApp.getUi()
        .createMenu('SEO')
        .addItem('Calculer la similarité', 'calculateSimilarity')
        .addToUi();
}

function calculateSimilarity() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const serpSheet = spreadsheet.getSheetByName("SERP");

    let serp = serpSheet.getRange("A2:B" + serpSheet.getLastRow()).getValues();
    let dataSelected = getColumnData("Requête");
    let targetUrl = getColumnData("URL cible");
    var statusData = getColumnData("État");

    const queriesData = createQueriesData(serp, dataSelected, targetUrl);
    const queriesDataClone = JSON.parse(JSON.stringify(queriesData));
    const updatedQueriesData = updateSimilarities(queriesData, queriesDataClone);
    const similarQueriesArray = getSimilarQueries(updatedQueriesData);

    updateColumnData("Cannibalisation", getSimilarQueries(updatedQueriesData));
}

function getColumnData(columnName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var headers = sheet.getRange("1:1").getValues()[0];
    var columnIndex;

    for (var i = 0; i < headers.length; i++) {
        if (headers[i] === columnName) {
            columnIndex = i + 1;
            break;
        }
    }

    if (columnIndex === undefined) {
        throw new Error(`No "${columnName}" column found.`);
    }

    var dataRange = sheet.getRange(2, columnIndex, sheet.getLastRow() - 1);
    var data = dataRange.getValues();

    return data;
}

function updateColumnData(columnName, updatedData) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var headers = sheet.getRange("1:1").getValues()[0];
    var columnIndex;

    for (var i = 0; i < headers.length; i++) {
        if (headers[i] === columnName) {
            columnIndex = i + 1;
            break;
        }
    }

    if (columnIndex === undefined) {
        throw new Error(`No "${columnName}" column found.`);
    }

    var dataRange = sheet.getRange(2, columnIndex, sheet.getLastRow() - 1);
    dataRange.clearContent();

    var outputRange = sheet.getRange(2, columnIndex, updatedData.length);
    outputRange.setValues(updatedData);
}

// END for Google Sheet

function createQueriesData(serp, dataSelected, targetUrl) {
    const queriesData = [];
    for (let i = 0; i < dataSelected.length; i++) {
        const URLs = serp.filter(el => el[0] === dataSelected[i][0]).map(el => el[1]);
        queriesData.push({ 'Query': dataSelected[i][0], 'URL': URLs, 'Similarities': [], 'TargetUrl': targetUrl[i][0] });
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
                        'TargetUrl': queryDataClone.TargetUrl
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
            .filter(similarity => similarity.SimilarityPercentage !== 0 && similarity.TargetUrl !== queryData.TargetUrl)
            .sort((a, b) => b.SimilarityPercentage - a.SimilarityPercentage);

        if (nonZeroSimilarsWithDifferentTargetUrl.length === 0) {
            return [""];
        }

        const similarQueries = nonZeroSimilarsWithDifferentTargetUrl.map(similarity => `${similarity.Query} (${similarity.SimilarityPercentage}%)`);
        return [similarQueries.join(", ")];
    });
}