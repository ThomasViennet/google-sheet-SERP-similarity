function onOpen(e) {
    SpreadsheetApp.getUi()
        .createMenu('SEO')
        .addItem('Calculer la similarité', 'serpSimilarity')
        .addToUi();
}

function serpSimilarity() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const selection = sheet.getSelection().getActiveRange();
    const dataSelected = selection.getValues();
    const serp = sheet.getSheetByName("SERP").getRange("A2:B").getValues();
    const activeSheet = selection.getSheet(); // The sheet user is selecting

    const columnIndex = getColumnIndex(activeSheet, "Cannibalisation");
    const selectedColumnIndex = getSelectedColumnIndex(selection);

    // Create a clone of queries data for comparison
    const queriesData = createQueriesData(serp, dataSelected);
    const queriesDataClone = JSON.parse(JSON.stringify(queriesData));

    // Update the Similarities for each query in the queries data array
    updateSimilarities(queriesData, queriesDataClone, activeSheet, selectedColumnIndex, columnIndex);

    function getColumnIndex(sheet, columnName) {
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        let index = headers.indexOf(columnName);
        if (index === -1) {
            index = headers.length;  // Index of new column
            sheet.getRange('A1').offset(0, index).setValue(columnName);  // Set value in new column
        }
        return index + 1; // Adjust for 0-index to 1-index
    }

    function getSelectedColumnIndex(selection) {
        return selection.getCell(1, 1).getColumn();
    }

    function createQueriesData(serp, dataSelected) {
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
            const weight1 = urls1.length - urls1.indexOf(url);
            const weight2 = urls2.length - urls2.indexOf(url);
            score += weight1 * weight2;
        }
        return score;
    }

    function updateSimilarities(queriesData, queriesDataClone, sheet, selectedColumnIndex, cannibalisationColumnIndex) {
        for (const queryData of queriesData) {
            let similarityList = [];
            for (const queryDataClone of queriesDataClone) {
                if (queryData.Query !== queryDataClone.Query) {
                    const commonURLs = getCommonURLs(queryData.URL, queryDataClone.URL);
                    if (commonURLs.length > 0) {
                        const similarityScore = calculateSimilarityScore(queryData.URL, queryDataClone.URL, commonURLs);
                        queryData.Similarities.push({
                            'Query': queryDataClone.Query,
                            'URLs': commonURLs,
                            'SimilarityScore': similarityScore
                        });
                        similarityList.push(queryDataClone.Query);
                    }
                }
            }

            if (similarityList.length > 0) {
                const rowIndex = queriesData.indexOf(queryData) + 2; // Adjust for headers and 0-index
                sheet.getRange(rowIndex, cannibalisationColumnIndex).setValue(similarityList.join(', '));
            }
        }
    }
}
