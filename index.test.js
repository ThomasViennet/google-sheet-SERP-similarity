const { serp, dataSelected } = require('./fixtures.js');
const { createQueriesData, getCommonURLs, calculateSimilarityScore, updateSimilarities } = require('./index.js');

test('createQueriesData creates correct data structure', () => {
    const queriesData = createQueriesData(serp);
    expect(queriesData).toEqual(expect.arrayContaining([
        { Query: 'A', URL: ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'], Similarities: [] },
        { Query: 'B', URL: ['url_B1', 'url_B2', 'url_B3', 'url_A2', 'url_A1'], Similarities: [] },
        { Query: 'C', URL: ['url_A2', 'url_A1', 'url_C3', 'url_C4', 'url_C5'], Similarities: [] },
        { Query: 'D', URL: ['url_A1', 'url_A2', 'url_C3', 'url_C4', 'url_C5'], Similarities: [] }
    ]));
});

test('getCommonURLs returns correct URLs', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_B1', 'url_B2', 'url_B3', 'url_A2', 'url_A1'];
    const commonURLs = getCommonURLs(urls1, urls2);
    expect(commonURLs).toEqual(expect.arrayContaining(['url_A1', 'url_A2']));
});

test('calculateSimilarityScore returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_B1', 'url_B2', 'url_B3', 'url_A2', 'url_A1'];
    const commonURLs = ['url_A1', 'url_A2'];
    const score = calculateSimilarityScore(urls1, urls2, commonURLs);
    expect(score).toBe(22); // calculated based on the formula
});

test('updateSimilarities updates the Similarities array correctly', () => {
    const queriesData = [
        { Query: 'A', URL: ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'], Similarities: [] },
        { Query: 'B', URL: ['url_B1', 'url_B2', 'url_B3', 'url_A2', 'url_A1'], Similarities: [] },
        { Query: 'C', URL: ['url_A2', 'url_A1', 'url_C3', 'url_C4', 'url_C5'], Similarities: [] },
        { Query: 'D', URL: ['url_A1', 'url_A2', 'url_C3', 'url_C4', 'url_C5'], Similarities: [] }
    ];
    const queriesDataClone = JSON.parse(JSON.stringify(queriesData));
    const updatedQueriesData = updateSimilarities(queriesData, queriesDataClone);
    expect(updatedQueriesData[0].Similarities).toEqual(expect.arrayContaining([
        { Query: 'B', URLs: ['url_A1', 'url_A2'], SimilarityScore: 22 }
    ]));
    // Similar checks for other queries
    expect(updatedQueriesData[2].Similarities).toEqual(expect.arrayContaining([
        { Query: 'A', URLs: ['url_A1', 'url_A2'], SimilarityScore: 22 },
        { Query: 'D', URLs: ['url_A2', 'url_A1', 'url_C3', 'url_C4', 'url_C5'], SimilarityScore: 48 }
    ]));
    expect(updatedQueriesData[3].Similarities).toEqual(expect.arrayContaining([
        { Query: 'A', URLs: ['url_A1', 'url_A2'], SimilarityScore: 22 },
        { Query: 'C', URLs: ['url_A2', 'url_A1', 'url_C3', 'url_C4', 'url_C5'], SimilarityScore: 48 }
    ]));
});

