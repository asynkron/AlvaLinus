.PHONY: quality
quality:
	npm run typecheck
	npm test
	npm run build
