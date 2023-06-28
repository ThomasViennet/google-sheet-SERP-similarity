//Fixtures
const fixtures =
    [
        ['A', '1'],
        ['A', '1'],
        ['A', '1'],
        ['A', '1'],
        ['A', '1'],
        ['A', '1'],
        ['A', '1'],
        ['A', '1'],
        ['A', '1'],
        ['A', '1'],
        ['B', '2'],
        ['B', '2'],
        ['B', '2'],
        ['B', '2'],
        ['B', '2'],
        ['B', '2'],
        ['B', '2'],
        ['B', '2'],
        ['B', '2'],
        ['B', '2'],
        ['C', '3'],
        ['C', '3'],
        ['C', '3'],
        ['C', '3'],
        ['C', '3'],
        ['C', '3'],
        ['C', '3'],
        ['C', '3'],
        ['C', '3'],
        ['C', '3'],
    ];

const dataSelected = [['A'], ['B'], ['C']];
//si je suis en environnement de test

let output = [];
dataSelected.forEach(query => output.push(query[0]));
console.log(output);
// { a: "a", b: "b", c: "c" }
// Transformer les données pour obtenir un tableau d'objects { "Query": ..., "URL": ...}

// Obtenir la liste de toutes les requêtes
// unique = [...new Set(fixtures)]

// Comparer toutes les requêtes avec toutes les suivantes respectivement et stocker le score de similarité


// console.log(fixtures);