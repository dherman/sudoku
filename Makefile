TRACEUR_RUNTIME=$(shell dirname `which traceur`)/bin/traceur.js
BUILD=build
PRELUDE=underscore.js $(TRACEUR_RUNTIME) $(BUILD)/traceur.init.out.js $(BUILD)/dict.out.js

all: $(BUILD)/pythonic.js $(BUILD)/methods.js

$(BUILD)/pythonic.js: $(PRELUDE) $(BUILD)/solver.pythonic.out.js
	cat $(PRELUDE) $(BUILD)/solver.pythonic.out.js > $(BUILD)/pythonic.js

$(BUILD)/methods.js: $(PRELUDE) $(BUILD)/solver.methods.out.js
	cat $(PRELUDE) $(BUILD)/solver.methods.out.js > $(BUILD)/methods.js

# $(BUILD)/demo.js: underscore.js $(TRACEUR_RUNTIME) $(BUILD)/traceur.init.out.js $(BUILD)/solver.out.js $(BUILD)/dict.out.js
# 	echo $(TRACEUR_RUNTIME)
# 	cat underscore.js $(TRACEUR_RUNTIME) $(BUILD)/traceur.init.out.js $(BUILD)/dict.out.js $(BUILD)/solver.out.js > $(BUILD)/demo.js

$(BUILD)/traceur.init.out.js: traceur.init.js
	traceur --out $(BUILD)/traceur.init.out.js --script traceur.init.js

$(BUILD)/solver.pythonic.out.js: solver.pythonic.js
	traceur --out $(BUILD)/solver.pythonic.out.js --script solver.pythonic.js

$(BUILD)/solver.methods.out.js: solver.methods.js
	traceur --arrow-functions=true --out $(BUILD)/solver.methods.out.js --script solver.methods.js

$(BUILD)/dict.out.js: dict.js
	traceur --out $(BUILD)/dict.out.js --script dict.js
