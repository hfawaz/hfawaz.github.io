var bibtexParse = require('bibtex-parse-js');

var sample = bibtexParse.toJSON('@article{sample1,title={sample title}}');

console.log(sample);