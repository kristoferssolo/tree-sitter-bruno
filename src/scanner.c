#include "tree_sitter/parser.h"

#include <stdbool.h>
#include <stdint.h>

enum TokenType {
    RAWTEXT,
};

void *tree_sitter_bruno_external_scanner_create(void) {
    return NULL;
}

void tree_sitter_bruno_external_scanner_destroy(void *payload) {
    (void)payload;
}

unsigned tree_sitter_bruno_external_scanner_serialize(void *payload, char *buffer) {
    (void)payload;
    (void)buffer;
    return 0;
}

void tree_sitter_bruno_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
    (void)payload;
    (void)buffer;
    (void)length;
}

static void advance(TSLexer *lexer) {
    lexer->advance(lexer, false);
}

static void skip(TSLexer *lexer) {
    lexer->advance(lexer, true);
}

static bool scan_quoted(TSLexer *lexer, int32_t quote) {
    advance(lexer);

    while (lexer->lookahead) {
        if (lexer->lookahead == '\\') {
            advance(lexer);
            if (lexer->lookahead) advance(lexer);
            continue;
        }

        if (lexer->lookahead == quote) {
            advance(lexer);
            return true;
        }

        advance(lexer);
    }

    return false;
}

bool tree_sitter_bruno_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    (void)payload;

    if (!valid_symbols[RAWTEXT]) return false;
    if (lexer->lookahead == '}') return false;

    unsigned depth = 0;
    bool has_content = false;

    while (lexer->lookahead) {
        if (lexer->lookahead == '\'' || lexer->lookahead == '"' || lexer->lookahead == '`') {
            has_content = true;
            if (!scan_quoted(lexer, lexer->lookahead)) break;
            continue;
        }

        if (lexer->lookahead == '{') {
            has_content = true;
            depth++;
            advance(lexer);
            continue;
        }

        if (lexer->lookahead == '}') {
            if (depth == 0) break;
            depth--;
            has_content = true;
            advance(lexer);
            continue;
        }

        has_content = true;
        advance(lexer);
    }

    if (!has_content) return false;

    lexer->result_symbol = RAWTEXT;
    return true;
}
