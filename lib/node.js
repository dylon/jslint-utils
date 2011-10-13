// v8.js
// 2009-09-11: Based on Douglas Crockford's Rhino edition
//
// I've made a few changes, specifically the ability to parse
// one file, while displaying the name of another.
//

/*global JSLINT */

/*jslint
  bitwise  : true ,
  browser  : true ,
  newcap   : true ,
  node     : true ,
  regexp   : true ,
  rhino    : true ,
  undef    : true ,
 */

(function (argv) {
  'use strict';

  var e, i, input, fileToParse, fileToDisplay, defaults, numErrors,
    sys = require("sys"),
    fs  = require("fs");

  argv.shift(); // drop "node"
  argv.shift(); // drop this script's name

  if (!argv[0]) {
    sys.puts("Usage: jslint.js file.js [realfilename.js]");
    process.exit(1);
  }

  fileToParse = argv[0];
  fileToDisplay = argv[1] || argv[0];

  input = fs.readFile(fileToParse, function (err, data) {
    if (err || !data) {
      sys.puts("jslint: Couldn't open file '" + fileToParse + "'.");
      process.exit(1);
    }

    defaults = {
      browser    : true,
      'continue' : true,
      devel      : true,
      indent     : 2,
      nomen      : true,
      plusplus   : true,
      regexp     : true,
      sloppy     : true,
      vars       : true,

      predef: [

        /* Backbone.js
         * =========== */

        'Backbone',

        /* Facebook
         * ======== */

        'FB',

        /* ICanHaz
         * ======= */

        'ich',

        /* jQuery
         * ====== */

        '$',
        'jQuery',

        /* Modernizr Rules
         * =============== */

        'placeholderFix',

        /* QUnit
         * ===== */

        'QUnit',
        'asyncTest',
        'deepEqual',
        'equal',
        'expect',
        'module',
        'notDeepEqual',
        'notEqual',
        'notStrictEqual',
        'ok',
        'raises',
        'start',
        'stop',
        'strictEqual',
        'test',

        /* RequireJS
         * ========= */

        'define',
        'require',
        'requirejs',

        /* Underscore.js
         * ========== */
        '_',

        /* Vitrue
         * ====== */

        'App',
        'Bundle',
        'checkSessionTimeout',
        'disableBack',
        'disableCRinForm',
        'Error',
        'FacebookApplication',
        'fbc',
        'globalHeaderSort',
        'Invitation',
        'ModalDialog',
        'ModalError',
        'Modernizr',
        'PasswordChange',
        'Product',
        'resize_overlay',
        'Resource',
        'Role',
        'setCheckSessionTimeout',
        'Signup',
        'Success',
        'Team',
        'TeamMembership',
        'User',
        'UserSignup'
      ]
    };

    if (!JSLINT(data.toString(), defaults)) {
      for (i = 0, numErrors = JSLINT.errors.length; i < numErrors; i += 1) {
        e = JSLINT.errors[i];
        if (e) {
          sys.puts('[' + fileToDisplay + '] Lint at line ' + e.line + ' character ' + e.character + ': ' + e.reason);
          sys.puts((e.evidence || '').replace(/^\s+|\s+$/, ""));
        }
      }
      process.exit(2);
    } else {
      sys.puts("jslint: No problems found in " + fileToDisplay);
      process.exit(0);
    }
  });
}(process.ARGV));
