const { serp, queries, targetUrl, status } = require('./fixtures.js');
const { createQueriesData, getCommonURLs, calculateSimilarityScore, calculateMaxSimilarityScore, calculateSimilarityPercentage, updateSimilarities, getSimilarQueries } = require('./index.js');

test('createQueriesData creates correct data structure', () => {
    const queriesData = createQueriesData(serp, queries, targetUrl, status);
    expect(queriesData).toEqual(expect.arrayContaining([
        { "Query": "A", "Similarities": [], "Status": "Validé", "TargetUrl": "target_A", "URL": ["url_A1", "url_A2", "url_A3", "url_A4", "url_A5"] },
        { "Query": "B", "Similarities": [], "Status": "Abandonné", "TargetUrl": "target_B", "URL": ["url_B1", "url_B2", "url_B3", "url_A2", "url_A1"] },
        { "Query": "C", "Similarities": [], "Status": "État", "TargetUrl": "target_C", "URL": ["url_A2", "url_A1", "url_C3", "url_C4", "url_C5"] },
        { "Query": "D", "Similarities": [], "Status": "À valider", "TargetUrl": "target_D", "URL": ["url_A1", "url_A2", "url_C3", "url_C4", "url_C5"] }
]));
});

test('getCommonURLs returns correct URLs', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_B1', 'url_B2', 'url_B3', 'url_A2', 'url_A1'];
    const commonURLs = getCommonURLs(urls1, urls2);
    expect(commonURLs).toEqual(expect.arrayContaining(['url_A1', 'url_A2']));
});

test('getCommonURLs returns correct URLs with doublon in urls2', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_B1', 'url_B2', 'url_B3', 'url_A2', 'url_A1', 'url_A1'];
    const commonURLs = getCommonURLs(urls1, urls2);
    expect(commonURLs).toEqual(expect.arrayContaining(['url_A1', 'url_A2']));
});

test('getCommonURLs returns correct URLs with doublon in urls 1 and urls2', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5', 'url_A1'];
    const urls2 = ['url_B1', 'url_B2', 'url_B3', 'url_A2', 'url_A1', 'url_A1'];
    const commonURLs = getCommonURLs(urls1, urls2);
    expect(commonURLs).toEqual(expect.arrayContaining(['url_A1', 'url_A2']));
});

test('calculateSimilarityScore returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_B1', 'url_B2', 'url_B3', 'url_A2', 'url_A1'];
    const commonURLs = ['url_A1', 'url_A2'];
    const score = calculateSimilarityScore(urls1, urls2, commonURLs);
    expect(score).toBe(13);
});

test('calculateSimilarityScore returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_B1', 'url_B2', 'url_B3', 'url_A1', 'url_A2'];
    const commonURLs = ['url_A1', 'url_A2'];
    const score = calculateSimilarityScore(urls1, urls2, commonURLs);
    expect(score).toBe(14);
});

test('calculateSimilarityScore returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_A1', 'url_B2', 'url_B3', 'url_B4', 'url_B5'];
    const commonURLs = ['url_A1'];
    const score = calculateSimilarityScore(urls1, urls2, commonURLs);
    expect(score).toBe(25);
});

test('calculateSimilarityScore returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_A1', 'url_A1', 'url_B3', 'url_B4', 'url_B5'];
    const commonURLs = ['url_A1'];
    const score = calculateSimilarityScore(urls1, urls2, commonURLs);
    expect(score).toBe(25);
});

test('calculateSimilarityScore returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_A2', 'url_A1', 'url_B3', 'url_B4', 'url_B5'];
    const commonURLs = ['url_A1', 'url_A2'];
    const score = calculateSimilarityScore(urls1, urls2, commonURLs);
    expect(score).toBe(40);
});

test('calculateSimilarityScore returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_A1', 'url_A2', 'url_B3', 'url_B4', 'url_B5'];
    const commonURLs = ['url_A2', 'url_A1'];
    const score = calculateSimilarityScore(urls1, urls2, commonURLs);
    expect(score).toBe(41);
});

test('calculateSimilarityScore returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const commonURLs = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const score = calculateSimilarityScore(urls1, urls2, commonURLs);
    expect(score).toBe(55);
});

test('calculateMaxSimilarityScore returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_A1', 'url_A2', 'url_B3', 'url_B4', 'url_B5'];
    const commonURLs = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const score = calculateMaxSimilarityScore(urls1, commonURLs);
    expect(score).toBe(55);
});

test('calculateSimilarityPercentage returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_A1', 'url_A2', 'url_B3', 'url_B4', 'url_B5'];
    const commonURLs = ['url_A1', 'url_A2'];
    const score = calculateSimilarityPercentage(urls1, urls2, commonURLs);
    expect(score).toBe(74);
});

test('calculateSimilarityPercentage returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A6'];
    const commonURLs = ['url_A1', 'url_A2', 'url_A3', 'url_A4'];
    const score = calculateSimilarityPercentage(urls1, urls2, commonURLs);
    expect(score).toBe(98);
});


test('calculateSimilarityPercentage returns correct score', () => {
    const urls1 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const urls2 = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const commonURLs = ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'];
    const score = calculateSimilarityPercentage(urls1, urls2, commonURLs);
    expect(score).toBe(100);
});

test('updateSimilarities updates the Similarities array correctly', () => {
    const queriesData = [
        { Query: 'A', URL: ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'], Similarities: [] },
        { Query: 'B', URL: ['url_B1', 'url_B2', 'url_B3', 'url_A4', 'url_A5'], Similarities: [] },
        { Query: 'C', URL: ['url_A2', 'url_A1', 'url_C3', 'url_C4', 'url_C5'], Similarities: [] },
        { Query: 'D', URL: ['url_A1', 'url_A2', 'url_C3', 'url_C4', 'url_C5'], Similarities: [] }
    ];
    const queriesDataClone = JSON.parse(JSON.stringify(queriesData));
    const updatedQueriesData = updateSimilarities(queriesData, queriesDataClone);
    expect(updatedQueriesData[0].Similarities).toEqual(expect.arrayContaining([
        { Query: 'B', URLs: ['url_A4', 'url_A5'], SimilarityScore: 5, SimilarityPercentage: 9 }
    ]));

});

test('getSimilarQueries returns correct result for non-empty similarities', () => {
    const updatedQueriesData = [
        {
            Query: 'A',
            URL: ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'],
            TargetUrl: 'target_A',
            Similarities: [
                {
                    'Query': 'B',
                    'URLs': ['url_A1', 'url_B2'],
                    'SimilarityScore': 10,
                    'SimilarityPercentage': 70,
                    'Status': 'Validé',
                    'TargetUrl': 'target_B'
                },
                {
                    'Query': 'C',
                    'URLs': ['url_A2'],
                    'SimilarityScore': 5,
                    'SimilarityPercentage': 50,
                    'Status': 'Validé',
                    'TargetUrl': 'target_C'
                }
            ]
        }
    ];
    const result = getSimilarQueries(updatedQueriesData);
    expect(result).toEqual(expect.arrayContaining([['B (70%), C (50%)']]));
});

test('getSimilarQueries returns empty string for empty similarities', () => {
    const updatedQueriesData = [
        {
            Query: 'A',
            URL: ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'],
            TargetUrl: 'target_A',
            Similarities: []
        }
    ];
    const result = getSimilarQueries(updatedQueriesData);
    expect(result).toEqual(expect.arrayContaining([['']]));
});

test('getSimilarQueries filters out queries with the same TargetUrl', () => {
    const updatedQueriesData = [
        {
            Query: 'A',
            URL: ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'],
            TargetUrl: 'target_A',
            Similarities: [
                {
                    'Query': 'B',
                    'URLs': ['url_A1', 'url_B2'],
                    'SimilarityScore': 10,
                    'SimilarityPercentage': 70,
                    'Status': 'Validé',
                    'TargetUrl': 'target_B'
                },
                {
                    'Query': 'C',
                    'URLs': ['url_A2'],
                    'SimilarityScore': 5,
                    'SimilarityPercentage': 50,
                    'Status': 'Validé',
                    'TargetUrl': 'target_A'
                }
            ]
        }
    ];
    const result = getSimilarQueries(updatedQueriesData);
    expect(result).toEqual(expect.arrayContaining([['B (70%)']]));
});

test('getSimilarQueries filters out queries with the same TargetUrl', () => {
    const updatedQueriesData = [
        {
            Query: 'A',
            URL: ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'],
            TargetUrl: 'target_A',
            Similarities: [
                {
                    'Query': 'B',
                    'URLs': ['url_A1', 'url_B2'],
                    'SimilarityScore': 10,
                    'SimilarityPercentage': 70,
                    'TargetUrl': 'target_A'
                },
                {
                    'Query': 'C',
                    'URLs': ['url_A2'],
                    'SimilarityScore': 5,
                    'SimilarityPercentage': 50,
                    'TargetUrl': 'target_A'
                }
            ]
        }
    ];
    const result = getSimilarQueries(updatedQueriesData);
    expect(result).toEqual(expect.arrayContaining([['']]));
});

test('getSimilarQueries filters out queries with the same TargetUrl', () => {
    const updatedQueriesData = [
        {
            Query: 'A',
            URL: ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'],
            TargetUrl: 'target_A',
            Similarities: [
                {
                    'Query': 'B',
                    'URLs': ['url_A1', 'url_B2'],
                    'SimilarityScore': 10,
                    'SimilarityPercentage': 70,
                    'Status': 'Validé',
                    'TargetUrl': 'target_A'
                },
                {
                    'Query': 'C',
                    'URLs': ['url_A2'],
                    'SimilarityScore': 5,
                    'SimilarityPercentage': 50,
                    'Status': 'Validé',
                    'TargetUrl': 'target_C'
                }
            ]
        }
    ];
    const result = getSimilarQueries(updatedQueriesData);
    expect(result).toEqual(expect.arrayContaining([["C (50%)"]]));
});

test('getSimilarQueries filters out queries with the same TargetUrl', () => {
    const updatedQueriesData = [
        {
            Query: 'A',
            URL: ['url_A1', 'url_A2', 'url_A3', 'url_A4', 'url_A5'],
            TargetUrl: 'target_A',
            Similarities: [
                {
                    'Query': 'B',
                    'URLs': ['url_A1', 'url_B2'],
                    'SimilarityScore': 10,
                    'SimilarityPercentage': 70,
                    'Status': 'Validé',
                    'TargetUrl': 'target_A'
                },
                {
                    'Query': 'C',
                    'URLs': ['url_A2'],
                    'SimilarityScore': 5,
                    'SimilarityPercentage': 50,
                    'Status': 'À valider',
                    'TargetUrl': 'target_C'
                }
            ]
        }
    ];
    const result = getSimilarQueries(updatedQueriesData);
    expect(result).toEqual(expect.arrayContaining([[""]]));
});