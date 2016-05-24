// v8.js
// 2009-09-11: Based on Douglas Crockford's Rhino edition
//
// I've made a few changes, specifically the ability to parse
// one file, while displaying the name of another.
//

/*global jslint */

/*jslint
    for: true,
    node: true,
 */

(function (argv) {
    'use strict';

    var fileToParse;
    var fileToDisplay;
    var defaults;

    var util = require("util");
    var fs = require("fs");

    argv.shift(); // drop "node"
    argv.shift(); // drop this script's name

    if (!argv[0]) {
        util.puts("Usage: jslint.js file.js [realfilename.js]");
        process.exit(1);
    }

    fileToParse = argv[0];
    fileToDisplay = argv[1] || argv[0];

    fs.readFile(fileToParse, function (err, data) {
        if (err || !data) {
            util.puts("jslint: Couldn't open file '" + fileToParse + "'.");
            process.exit(1);
        }

        defaults = {
            browser: true,
            "continue": true,
            devel: true,
            indent: 2,
            nomen: true,
            plusplus: true,
            regexp: true,
            sloppy: true,
            unparam: false,
            vars: true,

            predef: [
                // Global symbol names
            ]
        };

        var results = jslint(data.toString(), defaults);

        if (results.warnings.length) {
            results.warnings.forEach(function (e) {
                util.puts('file [' + fileToDisplay + '], line [' + (1 + e.line) + '], column [' + (1 + e.column) + '], rule [' + e.code + ']: ' + e.message);
                if (e.evidence) {
                    util.puts(e.evidence.replace(/^\s+|\s+$/, ""));
                }
            });
            process.exit(2);
        } else {
            util.puts("jslint: No problems found in " + fileToDisplay);

            (function (data, itimes) {
                function indent(itimes, ichar) {
                    var j;
                    var indentation = [];

                    if (itimes === undefined) {
                        itimes = 1;
                    }

                    if (ichar === undefined) {
                        ichar = '  ';
                    }

                    for (j = 0; j < itimes; j += 1) {
                        indentation.push(ichar);
                    }

                    return indentation.join('');
                }

                function getItimes(itimes) {
                    return (itimes !== undefined)
                        ? itimes
                        : 1;
                }

                function iprint(message, itimes) {
                    var indentation = indent(getItimes(itimes));
                    util.puts(indentation + message);
                }

                itimes = getItimes(itimes);
                iprint(fileToDisplay, itimes);

                (function (functions, itimes) {
                    itimes = getItimes(itimes);

                    function getParams(fn) {
                        var params = fn.params;
                        var buffer = [];

                        if (params) {
                            params.forEach(function (param) {
                                buffer.push(param.string);
                            });
                        }

                        return buffer.join(', ');
                    }

                    function printSignature(fn, itimes) {
                        itimes = getItimes(itimes);

                        var signature = [
                            'line ', fn.line, ': ', fn.name, ' = function (', getParams(fn), ')'
                        ];

                        iprint(signature.join(''), itimes);
                    }

                    function printLabel(fn, label, itimes) {
                        var symbols;

                        symbols = fn[label];

                        if (symbols !== undefined) {
                            iprint(label + ':', itimes);
                            symbols.forEach(function (symbol) {
                                iprint(symbol, (itimes + 1));
                            });
                        }
                    }

                    function printFn(fn, itimes) {
                        var labels;

                        itimes = getItimes(itimes);
                        printSignature(fn, itimes);

                        labels = [
                            'closure',
                            'exception',
                            'global',
                            'label',
                            'outer',
                            'undef',
                            'unused',
                            'var'
                        ];

                        labels.forEach(function (label) {
                            printLabel(fn, label, (itimes + 1));
                        });
                    }

                    if (functions) {
                        iprint('functions:', itimes);

                        functions = functions.slice().sort(function (fn_1, fn_2) {
                            var comparison = (fn_2['(complexity)'] - fn_1['(complexity)']);

                            if (comparison === 0) {
                                comparison = (fn_1.line - fn_2.line);
                            }

                            if (comparison === 0) {
                                comparison = ((fn_1.name > fn_2.name)
                                    ? 1
                                    : (fn_1.name < fn_2.name)
                                        ? -1
                                        : 0);
                            }

                            return comparison;
                        });

                        functions.forEach(function (fn) {
                            printFn(fn, (itimes + 1));
                        });
                    }
                }(data.functions, (itimes + 1)));

                (function (globals, itimes) {
                    itimes = getItimes(itimes);

                    if (globals) {
                        iprint('globals:', itimes);
                        globals.forEach(function (global) {
                            iprint(global, (itimes + 1));
                        });
                    }
                }(data.globals, (itimes + 1)));

                (function (member, itimes) {
                    var identifiers;

                    itimes = getItimes(itimes);

                    // There is a weird bug below in which `member` occasionally does not
                    // have a method attribute named, "hasOwnProperty."
                    if (member && (typeof member.hasOwnProperty === 'function')) {
                        iprint('member:', itimes);

                        identifiers = Object.keys(member).sort(function (identifier_1, identifier_2) {
                            var comparison = (member[identifier_2] - member[identifier_1]);

                            if (comparison === 0) {
                                comparison = ((identifier_1 > identifier_2)
                                    ? 1
                                    : (identifier_1 < identifier_2)
                                        ? -1
                                        : 0);
                            }

                            return comparison;
                        });

                        identifiers.forEach(function (identifier) {
                            var message = identifier + ': ' + member[identifier];
                            iprint(message, (itimes + 1));
                        });
                    }
                }(data.member, (itimes + 1)));

                (function (urls, itimes) {
                    itimes = getItimes(itimes);

                    if (urls) {
                        iprint('urls:', itimes);
                        urls.forEach(function (url) {
                            iprint(url, (itimes + 1));
                        });
                    }
                }(data.urls, (itimes + 1)));
            }(results, 1));

            process.exit(0);
        }
    });
}(process.argv));

// vim: set ft=javascript ts=4 sw=4 et sta:
