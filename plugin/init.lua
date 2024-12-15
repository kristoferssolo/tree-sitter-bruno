vim.filetype.add({
	pattern = { ["*%.bru"] = "bruno" },
})

require("nvim-treesitter.parsers").get_parser_configs().bruno = {
	install_info = {
		url = "https://github.com/kristoferssolo/tree-sitter-bruno",
		files = { "src/parser.c", "src/scanner.c" },
		branch = "main",
	},
}
