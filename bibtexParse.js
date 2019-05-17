/* start bibtexParse 0.0.24 */

//Original work by Henrik Muehe (c) 2010
//
//CommonJS port by Mikola Lysenko 2013
//
//Choice of compact (default) or pretty output from toBibtex:
//		Nick Bailey, 2017.
//
//Port to Browser lib by ORCID / RCPETERS
//
//Issues:
//no comment handling within strings
//no string concatenation
//no variable values yet
//Grammar implemented here:
//bibtex -> (string | preamble | comment | entry)*;
//string -> '@STRING' '{' key_equals_value '}';
//preamble -> '@PREAMBLE' '{' value '}';
//comment -> '@COMMENT' '{' value '}';
//entry -> '@' key '{' key ',' key_value_list '}';
//key_value_list -> key_equals_value (',' key_equals_value)*;
//key_equals_value -> key '=' value;
//value -> value_quotes | value_braces | key;
//value_quotes -> '"' .*? '"'; // not quite
//value_braces -> '{' .*? '"'; // not quite
(function(exports) {

    function BibtexParser() {

        this.months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        this.notKey = [',','{','}',' ','='];
        this.pos = 0;
        this.input = "";
        this.entries = new Array();

        this.currentEntry = "";

        this.setInput = function(t) {
            this.input = t;
        };

        this.getEntries = function() {
            return this.entries;
        };

        this.isWhitespace = function(s) {
            return (s == ' ' || s == '\r' || s == '\t' || s == '\n');
        };

        this.match = function(s, canCommentOut) {
            if (canCommentOut == undefined || canCommentOut == null)
                canCommentOut = true;
            this.skipWhitespace(canCommentOut);
            if (this.input.substring(this.pos, this.pos + s.length) == s) {
                this.pos += s.length;
            } else {
                throw TypeError("Token mismatch: match", "expected " + s + ", found "
                        + this.input.substring(this.pos));
            };
            this.skipWhitespace(canCommentOut);
        };

        this.tryMatch = function(s, canCommentOut) {
            if (canCommentOut == undefined || canCommentOut == null)
                canCommentOut = true;
            this.skipWhitespace(canCommentOut);
            if (this.input.substring(this.pos, this.pos + s.length) == s) {
                return true;
            } else {
                return false;
            };
            this.skipWhitespace(canCommentOut);
        };

        /* when search for a match all text can be ignored, not just white space */
        this.matchAt = function() {
            while (this.input.length > this.pos && this.input[this.pos] != '@') {
                this.pos++;
            };

            if (this.input[this.pos] == '@') {
                return true;
            };
            return false;
        };

        this.skipWhitespace = function(canCommentOut) {
            while (this.isWhitespace(this.input[this.pos])) {
                this.pos++;
            };
            if (this.input[this.pos] == "%" && canCommentOut == true) {
                while (this.input[this.pos] != "\n") {
                    this.pos++;
                };
                this.skipWhitespace(canCommentOut);
            };
        };

        this.value_braces = function() {
            var bracecount = 0;
            this.match("{", false);
            var start = this.pos;
            var escaped = false;
            while (true) {
                if (!escaped) {
                    if (this.input[this.pos] == '}') {
                        if (bracecount > 0) {
                            bracecount--;
                        } else {
                            var end = this.pos;
                            this.match("}", false);
                            return this.input.substring(start, end);
                        };
                    } else if (this.input[this.pos] == '{') {
                        bracecount++;
                    } else if (this.pos >= this.input.length - 1) {
                        throw TypeError("Unterminated value: value_braces");
                    };
                };
                if (this.input[this.pos] == '\\' && escaped == false)
                    escaped = true;
                else
                    escaped = false;
                this.pos++;
            };
        };

        this.value_comment = function() {
            var str = '';
            var brcktCnt = 0;
            while (!(this.tryMatch("}", false) && brcktCnt == 0)) {
                str = str + this.input[this.pos];
                if (this.input[this.pos] == '{')
                    brcktCnt++;
                if (this.input[this.pos] == '}')
                    brcktCnt--;
                if (this.pos >= this.input.length - 1) {
                    throw TypeError("Unterminated value: value_comment", + this.input.substring(start));
                };
                this.pos++;
            };
            return str;
        };

        this.value_quotes = function() {
            this.match('"', false);
            var start = this.pos;
            var escaped = false;
            while (true) {
                if (!escaped) {
                    if (this.input[this.pos] == '"') {
                        var end = this.pos;
                        this.match('"', false);
                        return this.input.substring(start, end);
                    } else if (this.pos >= this.input.length - 1) {
                        throw TypeError("Unterminated value: value_quotes", this.input.substring(start));
                    };
                }
                if (this.input[this.pos] == '\\' && escaped == false)
                    escaped = true;
                else
                    escaped = false;
                this.pos++;
            };
        };

        this.single_value = function() {
            var start = this.pos;
            if (this.tryMatch("{")) {
                return this.value_braces();
            } else if (this.tryMatch('"')) {
                return this.value_quotes();
            } else {
                var k = this.key();
                if (k.match("^[0-9]+$"))
                    return k;
                else if (this.months.indexOf(k.toLowerCase()) >= 0)
                    return k.toLowerCase();
                else
                    throw "Value expected: single_value" + this.input.substring(start) + ' for key: ' + k;

            };
        };

        this.value = function() {
            var values = [];
            values.push(this.single_value());
            while (this.tryMatch("#")) {
                this.match("#");
                values.push(this.single_value());
            };
            return values.join("");
        };

        this.key = function(optional) {
            var start = this.pos;
            while (true) {
                if (this.pos >= this.input.length) {
                    throw TypeError("Runaway key: key");
                };
                                // а-яА-Я is Cyrillic
                //console.log(this.input[this.pos]);
                if (this.notKey.indexOf(this.input[this.pos]) >= 0) {
                    if (optional && this.input[this.pos] != ',') {
                        this.pos = start;
                        return null;
                    };
                    return this.input.substring(start, this.pos);
                } else {
                    this.pos++;

                };
            };
        };

        this.key_equals_value = function() {
            var key = this.key();
            if (this.tryMatch("=")) {
                this.match("=");
                var val = this.value();
                key = key.trim()
                return [ key, val ];
            } else {
                throw TypeError("Value expected, equals sign missing: key_equals_value",
                     this.input.substring(this.pos));
            };
        };

        this.key_value_list = function() {
            var kv = this.key_equals_value();
            this.currentEntry['entryTags'] = {};
            this.currentEntry['entryTags'][kv[0]] = kv[1];
            while (this.tryMatch(",")) {
                this.match(",");
                // fixes problems with commas at the end of a list
                if (this.tryMatch("}")) {
                    break;
                }
                ;
                kv = this.key_equals_value();
                this.currentEntry['entryTags'][kv[0]] = kv[1];
            };
        };

        this.entry_body = function(d) {
            this.currentEntry = {};
            this.currentEntry['citationKey'] = this.key(true);
            this.currentEntry['entryType'] = d.substring(1);
            if (this.currentEntry['citationKey'] != null) {
                this.match(",");
            }
            this.key_value_list();
            this.entries.push(this.currentEntry);
        };

        this.directive = function() {
            this.match("@");
            return "@" + this.key();
        };

        this.preamble = function() {
            this.currentEntry = {};
            this.currentEntry['entryType'] = 'PREAMBLE';
            this.currentEntry['entry'] = this.value_comment();
            this.entries.push(this.currentEntry);
        };

        this.comment = function() {
            this.currentEntry = {};
            this.currentEntry['entryType'] = 'COMMENT';
            this.currentEntry['entry'] = this.value_comment();
            this.entries.push(this.currentEntry);
        };

        this.entry = function(d) {
            this.entry_body(d);
        };

        this.alernativeCitationKey = function () {
            this.entries.forEach(function (entry) {
                if (!entry.citationKey && entry.entryTags) {
                    entry.citationKey = '';
                    if (entry.entryTags.author) {
                        entry.citationKey += entry.entryTags.author.split(',')[0] += ', ';
                    }
                    entry.citationKey += entry.entryTags.year;
                }
            });
        }

        this.bibtex = function() {
            while (this.matchAt()) {
                var d = this.directive();
                this.match("{");
                if (d.toUpperCase() == "@STRING") {
                    this.string();
                } else if (d.toUpperCase() == "@PREAMBLE") {
                    this.preamble();
                } else if (d.toUpperCase() == "@COMMENT") {
                    this.comment();
                } else {
                    this.entry(d);
                }
                this.match("}");
            };

            this.alernativeCitationKey();
        };
    };

    exports.toJSON = function(bibtex) {
        var b = new BibtexParser();
        b.setInput(bibtex);
        b.bibtex();
        return b.entries;
    };

    /* added during hackathon don't hate on me */
    /* Increased the amount of white-space to make entries
     * more attractive to humans. Pass compact as false
     * to enable */
    exports.toBibtex = function(json, compact) {
        if (compact === undefined) compact = true;
        var out = '';
        
        var entrysep = ',';
        var indent = '';
        if (!compact) {
		      entrysep = ',\n';
		      indent = '    ';        
        }
        for ( var i in json) {
            out += "@" + json[i].entryType;
            out += '{';
            if (json[i].citationKey)
                out += json[i].citationKey + entrysep;
            if (json[i].entry)
                out += json[i].entry ;
            if (json[i].entryTags) {
                var tags = indent;
                for (var jdx in json[i].entryTags) {
                    if (tags.trim().length != 0)
                        tags += entrysep + indent;
                    tags += jdx + (compact ? '={' : ' = {') + 
                            json[i].entryTags[jdx] + '}';
                }
                out += tags;
            }
            out += compact ? '}\n' : '\n}\n\n';
        }
        return out;

    };

})(typeof exports === 'undefined' ? this['bibtexParse'] = {} : exports);

/* end bibtexParse */

function getText(){
    // read text from URL location
    var request = new XMLHttpRequest();
    request.open('GET', 'references.bib', true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                return request.responseText;
            }
        }
    }
}

var bibtext = "\
@InProceedings{IsmailFawaz2018transfer,  Title                    = {Transfer learning for time series classification},  Author                   = {Ismail Fawaz, Hassan and Forestier, Germain and Weber, Jonathan and Idoumghar, Lhassane and Muller, Pierre-Alain},  booktitle                = {{IEEE International Conference on Big Data (BigData)}},  pages                    = {1367-1376},  Year                     = {2018}}@InProceedings{IsmailFawaz2019deep,  Title                    = {Deep Neural Network Ensembles for Time Series Classification},  Author                   = {Ismail Fawaz, Hassan and Forestier, Germain and Weber, Jonathan and Idoumghar, Lhassane and Muller, Pierre-Alain},  booktitle                = {IEEE International Joint Conference on Neural Networks (IJCNN)},  Year                     = {2019}}@InWorkshops{ismailFawaz2018data,  Title                    = {Data augmentation using synthetic data for time series classification with deep residual networks},  Author                   = {Ismail Fawaz, Hassan and Forestier, Germain and Weber, Jonathan and Idoumghar, Lhassane and Muller, Pierre-Alain},  Booktitle                = {International Workshop on Advanced Analytics and Learning on Temporal Data, {ECML} {PKDD} (AALTD)},  Year                     = {2018}}@InProceedings{IsmailFawaz2019adversarial,  Title                    = {Adversarial Attacks on Deep Neural Networks for Time Series Classification},  Author                   = {Ismail Fawaz, Hassan and Forestier, Germain and Weber, Jonathan and Idoumghar, Lhassane and Muller, Pierre-Alain},  booktitle                = {IEEE International Joint Conference on Neural Networks (IJCNN)},  Year                     = {2019}}@InProceedings{IsmailFawaz2018evaluating,  Title                    = {Evaluating surgical skills from kinematic data using convolutional neural networks},  Author                   = {Ismail Fawaz, Hassan and Forestier, Germain and Weber, Jonathan and Idoumghar, Lhassane and Muller, Pierre-Alain},  booktitle                = {International Conference On Medical Image Computing and Computer Assisted Intervention (MICCAI)},  Year                     = {2018},  pages                    = {214--221}}@InProceedings{IsmailFawaz2019automatic,  Title                    = {Automatic alignment of surgical videos using kinematic data},  Author                   = {Ismail Fawaz, Hassan and Forestier, Germain and Weber, Jonathan and Petitjean, François and Idoumghar, Lhassane and Muller, Pierre-Alain},  booktitle                = {Artificial Intelligence in Medicine (AIME)},  Year                     = {2019}}@Article{Forestier2018Surgicalmotionanalysis,  author                   = {Forestier, G. and Petitjean, F. and Senin, P. and Despinoy, F. and Huaulmé, A. and Ismail Fawaz, H. and Weber, J. and Idoumghar, L. and Muller, P-A. and Jannin, P.},  title                    = {Surgical motion analysis using discriminative interpretable patterns},  journal                  = {Artificial Intelligence in Medicine},  year                     = {2018},  volume                   = {81},  pages                    = {3--11},  url                      = {https://www.sciencedirect.com/science/article/pii/S0933365717306681},  pdf                      = {https://germain-forestier.info/publis/aim2018.pdf},  code                     = {https://germain-forestier.info/src/aiim2018/},  acronym                  = {AIM}}@Article{ismailfawaz2018deep,  author                   = {Ismail Fawaz, Hassan and Forestier, Germain and Weber, Jonathan and Idoumghar, Lhassane and Muller, Pierre-Alain},  title                    = {Deep learning for time series classification: a review},  journal                  = {Data Mining and Knowledge Discovery},  year                     = {2019},  url                      = {https://link.springer.com/article/10.1007%2Fs10618-019-00619-1},  pdf                      = {https://arxiv.org/pdf/1809.04356.pdf},  code                     = {https://github.com/hfawaz/dl-4-tsc/},  acronym                  = {DMKD}}\
"

var allTex = bibtexParse.toJSON(bibtext);
console.log(allTex);

for(i=0;i<allTex.length;i++){
    x = allTex[i];

    

    if(x['entryType']=='Article'){
        console.log(x)
    }
}