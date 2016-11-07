JSHINT = ./node_modules/.bin/jshint
BASE = .

lint:
	$(JSHINT) index.js --config $(BASE)/.jshintrc && \
	$(JSHINT) ./config/ --config $(BASE)/.jshintrc && \
	$(JSHINT) ./controllers/ --config $(BASE)/.jshintrc && \
	$(JSHINT) ./models/ --config $(BASE)/.jshintrc

.PHONY: lint