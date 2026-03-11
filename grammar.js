/**
 * @file Bruno grammar for tree-sitter
 * @author Kristofers Solo <dev@kristofers.xyz>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
	name: "bruno",

  extras: (_) => [/\s/],
  externals: ($) => [$.rawtext],

	rules: {
    source_file: ($) => repeat($.section),

    section: ($) =>
      choice(
        $.meta,
        $.http,
        $.query,
        $.headers,
        $.auth,
        $.body,
        $.vars,
        $.assert,
        $.params,
        $.script,
        $.tests,
        $.docs,
      ),

    meta: ($) => seq(alias("meta", $.keyword), $.object_block),

    http: ($) => seq(alias($.http_verb, $.keyword), $.object_block),
    http_verb: (_) =>
      choice(
        "get",
        "post",
        "put",
        "delete",
        "patch",
        "options",
        "head",
        "connect",
        "trace",
      ),

    query: ($) => seq(alias("query", $.keyword), $.object_block),

    headers: ($) => seq(alias("headers", $.keyword), $.object_block),

    auth: ($) =>
      choice(
        $.authawsv4,
        $.authbasic,
        $.authbearer,
        $.authdigest,
        $.authoauth2,
      ),
    authawsv4: ($) => seq(alias("auth:awsv4", $.keyword), $.object_block),
    authbasic: ($) => seq(alias("auth:basic", $.keyword), $.object_block),
    authbearer: ($) => seq(alias("auth:bearer", $.keyword), $.object_block),
    authdigest: ($) => seq(alias("auth:digest", $.keyword), $.object_block),
    authoauth2: ($) => seq(alias("auth:oauth2", $.keyword), $.object_block),

    body: ($) =>
      choice(
        $.bodyjson,
        $.bodytext,
        $.bodyxml,
        $.bodysparql,
        $.bodygraphql,
        $.bodygraphqlvars,
        $.bodyformurlencoded,
        $.bodyformmultipart,
        $.bodyraw,
      ),
    bodyraw: ($) => seq(alias("body", $.keyword), $.textblock),
    bodyjson: ($) => seq(alias("body:json", $.keyword), $.textblock),
    bodytext: ($) => seq(alias("body:text", $.keyword), $.textblock),
    bodyxml: ($) => seq(alias("body:xml", $.keyword), $.textblock),
    bodysparql: ($) => seq(alias("body:sparql", $.keyword), $.textblock),
    bodygraphql: ($) => seq(alias("body:graphql", $.keyword), $.textblock),
    bodygraphqlvars: ($) =>
      seq(alias("body:graphql:vars", $.keyword), $.textblock),
    bodyformurlencoded: ($) =>
      seq(alias("body:form-urlencoded", $.keyword), $.object_block),
    bodyformmultipart: ($) =>
      seq(alias("body:multipart-form", $.keyword), $.object_block),

    vars: ($) =>
      choice($.vars_plain, $.vars_secret, $.varsreq, $.varsres),
    vars_plain: ($) => seq(alias("vars", $.keyword), $.object_block),
    vars_secret: ($) => seq(alias("vars:secret", $.keyword), $.array_block),
    varsreq: ($) => seq(alias("vars:pre-request", $.keyword), $.object_block),
    varsres: ($) => seq(alias("vars:post-response", $.keyword), $.object_block),

    assert: ($) => seq(alias("assert", $.keyword), $.assert_block),

    script: ($) => choice($.scriptreq, $.scriptres),
    scriptreq: ($) => seq(alias("script:pre-request", $.keyword), $.textblock),
    scriptres: ($) =>
      seq(alias("script:post-response", $.keyword), $.textblock),

    params: ($) => choice($.params_path, $.params_query),
    params_query: ($) => seq(alias("params:query", $.keyword), $.object_block),
    params_path: ($) => seq(alias("params:path", $.keyword), $.object_block),

    tests: ($) => seq(alias("tests", $.keyword), $.textblock),

    docs: ($) => seq(alias("docs", $.keyword), $.textblock),

    object_block: ($) => seq("{", repeat($.dictionary_pair), "}"),
    dictionary_pair: ($) => seq($.key, ":", $.dictionary_value),
    dictionary_value: ($) =>
      choice($.template_value, $.quoted_value, $.bare_value),

    assert_block: ($) => seq("{", repeat($.assert_dictionary_pair), "}"),
    assert_dictionary_pair: ($) => seq($.assert_key, ":", $.dictionary_value),

    array_block: ($) => seq("[", repeat(seq($.array_value, optional(","))), "]"),
    array_value: ($) =>
      choice($.template_value, $.quoted_value, $.bare_value),

    textblock: ($) => seq("{", optional($.rawtext), "}"),

    assert_key: (_) => /[^\r\n:]+/,

    key: (_) => /[^\s\r\n:]+/,
    bare_value: (_) => /[^\s\r\n",\]}][^\r\n]*/,
    quoted_value: (_) => token(seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"')),
    template_value: (_) =>
      token(seq("{{", repeat(choice(/[^}]+/, /}[^}]/)), "}}")),
	},
});
