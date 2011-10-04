JSLint Utils
============

This is a set of utility files that wraps JSLint within either Node or Rhino,
enabling easy linting on the command line, and automated reporting of linting
errors via a continuous integration system like Hudson.

Do note that a prerequisite of invoking `run-jslint.sh` is to have either Node
or Java installed and its executable included in your `$PATH` variable.  The
script will detect whether the `node` executable is in your `$PATH`, and if not,
will then fall back to using the Rhino Jar file packaged with the source code.
The Node interpreter is much faster than Rhino, so it is suggested.

Installation
------------

1. Clone the repository from Github.com via

<br />

    git clone git://github.com/dylon/jslint-utils.git

2. The script must be invoked with the exact path to it, so create a simple
shell script like the following in some directory contained in your `$PATH` and
make it executable; I shall use `/usr/local/bin/jslint` for reference:

<br />

    #!/bin/bash
    #
    # ------------------------------------------------------------------------------
    # File: /usr/local/bin/jslint
    # ------------------------------------------------------------------------------

    sh "/path/to/jslint-utils/scripts/run-jslint.sh" "$@"

Basic Usage
-----------

Invoke the linter via

    jslint "/path/to/javascript/file.js"

It will output any errors and warnings found.

JSLint Options
--------------

JSLint is well documented on [JSLint.com](http://jslint.com/lint.html).  Should
the default options be insufficient for your needs, they may be overridden in
your JavaScript file by placing the following special block comment before the
location at which it is needed, preferably at the top of the file just below any
licensing or copyright notices:

    /*jslint
      option1: value1,
      option2: value2
    */

Do note thate there is NO space between the opening of the block comment (`/*`)
and the word, `jslint`.

Likewise, you may specify global functions and objects that are not found in
your source file via a comma-separated list as follows:

    /*global jQuery, $ */

or

    /*globals jQuery, $ */

The two comment types, `/*global */` and `/*globals */`, are synomymous and may
be interchanged at will.

It is helpful to know that the JSLint comments are scoped.  Thus, if you have a
function that requires a particular linting configuration that you do not wish
to enable throughout the entire script, you may add the configuration just
inside the function block within a `/*jslint */` comment.

    /*jslint
      browser: true
    */

    /*globals jQuery, $ */

    jQuery(function ($) {
        function one() {
            return 1;
        }

        function two(string) {
          /*jslint evil: true */

          // The use of eval is strongly discouraged, but this is an example
          // showing how to configure JSLint to tolerate it in just this one
          // function, rather than throughout the entire script.
          return eval(string);
        }
    });

Additional Usage Options
------------------------

If you prefer the use of a `Makefile`, you may modify the one included to point
to the proper source and report directories and run:

*   `make` to check everything with a `.js` or `.css` extension in the
    source directory, outputting errors to the command line.

*   `make jslint` or `make csslint` to lint JS or CSS, respectively,
    outputting errors to the command line

*   `make hudson` to lint JS and CSS, outputting errors in an XML format
    that Hudson can understand to the report directory

*   `make jsxml` or `make cssxml` to lint JS or CSS, respectively, outputting
    errors in XML format to the report directory

To output the reported errors and warnings to XML, as above, create a simple
shell script in some directory contained in your `$PATH` like the following, and
make it executable:

    #!/bin/bash
    #
    # ------------------------------------------------------------------------------
    # File: /usr/local/bin/jslint-to-xml
    # ------------------------------------------------------------------------------

    sh "/path/to/jslint-utils/scripts/jslint-to-xml.sh" "$@"

Then, invoke it as follows:

    jslint-to-xml "/path/to/javascript/file.js" "/path/to/output/directory/"

Keeping JSLint Up-to-Date
-------------------------

You may update the version of JSLint included by `cd`ing into the
`jslint-utils/lib/vendor/` directory and typing `make`.  The newest JSLint file
will be downloaded with `curl` from [JSLint.com](http://www.jslint.com).
Douglas Crockford updates the file silently all the time.

Final Note
----------
Enjoy!  Report bugs!

