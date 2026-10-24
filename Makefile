# quality is the normal test entrypoint; coverage is a separate run.
.DEFAULT_GOAL := help
.PHONY: help workspace worktree dependencies tools preflight lint quality coverage build frontend-build frontend-dev start dev preview clean

MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

help workspace worktree dependencies tools preflight lint quality coverage build frontend-build frontend-dev start dev preview clean:
	@NODE_V8_COVERAGE= node "$(MAKEFILE_DIR)scripts/make.js" $@
