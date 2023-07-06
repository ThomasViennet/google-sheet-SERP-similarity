// Fetch the data using Google Sheet functions
function onOpen(e) {
    SpreadsheetApp.getUi()
        .createMenu('SEO')
        .addItem('Calculer la similarité', 'updateCannibalisationColumn')
        .addToUi();
}

const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
const serpSheet = spreadsheet.getSheetByName("SERP");
let serp = serpSheet.getRange("A2:B" + serpSheet.getLastRow()).getValues();

let dataSelected = getQueryColumnData();

const queriesData = createQueriesData(serp);
const queriesDataClone = JSON.parse(JSON.stringify(queriesData));
const updatedQueriesData = updateSimilarities(queriesData, queriesDataClone);
const similarQueriesArray = getSimilarQueries(updatedQueriesData);

function getQueryColumnData() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // Use the active sheet
    var headers = sheet.getRange("1:1").getValues()[0]; // Get the first row to use as header
    var columnIndex;

    for (var i = 0; i < headers.length; i++) {
        if (headers[i] === "Requête") {
            columnIndex = i + 1; // i starts from 0, column index starts from 1
            break;
        }
    }

    if (columnIndex === undefined) {
        throw new Error('No "Requête" column found.');
    }

    var dataRange = sheet.getRange(2, columnIndex, sheet.getLastRow() - 1); // Get the data starting from second row in the column
    var data = dataRange.getValues(); // Get the data

    return data;
}

function updateCannibalisationColumn() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // Use the active sheet
    var headers = sheet.getRange("1:1").getValues()[0]; // Get the first row to use as header
    var columnIndex;

    for (var i = 0; i < headers.length; i++) {
        if (headers[i] === "Cannibalisation") {
            columnIndex = i + 1; // i starts from 0, column index starts from 1
            break;
        }
    }

    if (columnIndex === undefined) {
        throw new Error('No "Cannibalisation" column found.');
    }

    var dataRange = sheet.getRange(2, columnIndex, sheet.getLastRow() - 1); // Get the data starting from 3 row in the column because 2 is used for formula
    dataRange.clearContent(); // Clear the content of the cells

    var outputRange = sheet.getRange(2, columnIndex, getSimilarQueries(updatedQueriesData).length);
    outputRange.setValues(getSimilarQueries(updatedQueriesData)); // Set the new values
}

function getTargetUrlColumnData() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // Use the active sheet
    var headers = sheet.getRange("1:1").getValues()[0]; // Get the first row to use as header
    var columnIndex;

    for (var i = 0; i < headers.length; i++) {
        if (headers[i] === "URL cible") {
            columnIndex = i + 1; // i starts from 0, column index starts from 1
            break;
        }
    }

    if (columnIndex === undefined) {
        throw new Error('No "URL cible" column found.');
    }

    var dataRange = sheet.getRange(2, columnIndex, sheet.getLastRow() - 1); // Get the data starting from second row in the column
    var data = dataRange.getValues(); // Get the data

    return data;
}