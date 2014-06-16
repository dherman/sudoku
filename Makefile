TRACEUR_RUNTIME=$(shell dirname `which traceur`)/bin/traceur.js
BUILD=build

$(BUILD)/demo.js: underscore.js $(TRACEUR_RUNTIME) $(BUILD)/traceur.init.out.js $(BUILD)/solver.out.js $(BUILD)/dict.out.js
	echo $(TRACEUR_RUNTIME)
	cat underscore.js $(TRACEUR_RUNTIME) $(BUILD)/traceur.init.out.js $(BUILD)/dict.out.js $(BUILD)/solver.out.js > $(BUILD)/demo.js

$(BUILD)/traceur.init.out.js: traceur.init.js
	traceur --out $(BUILD)/traceur.init.out.js --script traceur.init.js

$(BUILD)/solver.out.js: solver.js
	traceur --out $(BUILD)/solver.out.js --script solver.js

$(BUILD)/dict.out.js: dict.js
	traceur --out $(BUILD)/dict.out.js --script dict.js
