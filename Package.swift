// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterBruno",
    products: [
        .library(name: "TreeSitterBruno", targets: ["TreeSitterBruno"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterBruno",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                "src/scanner.c",
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterBrunoTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterBruno",
            ],
            path: "bindings/swift/TreeSitterBrunoTests"
        )
    ],
    cLanguageStandard: .c11
)
