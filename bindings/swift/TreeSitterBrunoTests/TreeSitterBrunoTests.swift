import XCTest
import SwiftTreeSitter
import TreeSitterBruno

final class TreeSitterBrunoTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_bruno())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Bruno grammar")
    }
}
