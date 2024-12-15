package tree_sitter_bruno_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_bruno "github.com/kristoferssolo/tree-sitter-bruno/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_bruno.Language())
	if language == nil {
		t.Errorf("Error loading Bruno grammar")
	}
}
