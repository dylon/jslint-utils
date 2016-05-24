.PHONY:	all updatejslint ../rhinoed_jslint.js ../node_jslint.js

all: updatejslint ../rhinoed_jslint.js ../node_jslint.js

fork:	updateforkedjslint ../rhinoed_jslint.js ../node_jslint.js

updateforkedjslint:
	@curl -o jslint.js http://github.com/mikewest/jslint/raw/master/fulljslint.js

updatejslint:
	@curl -O https://raw.githubusercontent.com/douglascrockford/JSLint/master/jslint.js

../rhinoed_jslint.js: jslint.js ../rhino.js
	@cat ./jslint.js ../rhino.js > ../rhinoed_jslint.js

../node_jslint.js: jslint.js ../node.js
	@cat ./jslint.js ../node.js > ../node_jslint.js
