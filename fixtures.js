const serp =
    [
        ['A', 'url_A1'],
        ['A', 'url_A2'],
        ['A', 'url_A3'],
        ['A', 'url_A4'],
        ['A', 'url_A5'],
        ['B', 'url_B1'],
        ['B', 'url_B2'],
        ['B', 'url_B3'],
        ['B', 'url_A2'],
        ['B', 'url_A1'],
        ['C', 'url_A2'],
        ['C', 'url_A1'],
        ['C', 'url_C3'],
        ['C', 'url_C4'],
        ['C', 'url_C5'],
        ['D', 'url_A1'],
        ['D', 'url_A2'],
        ['D', 'url_C3'],
        ['D', 'url_C4'],
        ['D', 'url_C5'],
    ];

const queries = [['A'], ['B'], ['C'], ['D']];
const targetUrl = [['target_A'], ['target_B'], ['target_C'], ['target_D']];
const status = [['Validé'], ['Abandonné'], ['État'], ['À valider']];

module.exports = { serp, queries, targetUrl, status };
