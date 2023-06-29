const { generateQueriesData, searchSerp, updateSerp, updateQueriesData } = require('./index');
const { serp, dataSelected } = require('./fixtures');

describe('Test functions from index.js', () => {
    test('generateQueriesData generates correct data structure', () => {
        const result = generateQueriesData(dataSelected);
        expect(result).toEqual([
            { Query: 'A', URL: [], Similarities: [] },
            { Query: 'B', URL: [], Similarities: [] },
            { Query: 'C', URL: [], Similarities: [] }
        ]);
    });

    test('searchSerp finds correct URL data for a query', () => {
        const result = searchSerp('A', serp);
        expect(result).toEqual(['1', '1', '1', '1', '1', '1', '1', '1', '1', '1']);
    });

    test('updateSerp updates URL data for a query', () => {
        const data = generateQueriesData(dataSelected);
        const result = updateSerp(data, 'A', ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1']);
        expect(result[0].URL).toEqual(['1', '1', '1', '1', '1', '1', '1', '1', '1', '1']);
    });

    test('updateQueriesData updates URL data for all queries', () => {
        let queriesData = generateQueriesData(dataSelected);
        queriesData = updateQueriesData(queriesData, serp, searchSerp, updateSerp);
        expect(queriesData).toEqual([
            { Query: 'A', URL: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1'], Similarities: [] },
            { Query: 'B', URL: ['2', '2', '2', '2', '2', '2', '2', '2', '2', '2'], Similarities: [] },
            { Query: 'C', URL: ['3', '3', '3', '3', '3', '3', '3', '3', '3', '3'], Similarities: [] }
        ]);
    });
});
