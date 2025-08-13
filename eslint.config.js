// @ts-check

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import globals from "globals";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),

    js.configs.recommended,
    ...ts.configs.strict,
    {
        files: ["eslint.config.js"],
        languageOptions: {
            globals: globals.node,
        },
    },

    perfectionist.configs["recommended-alphabetical"],
    {
        rules: Object.fromEntries(
            [
                "classes",
                "enums",
                "exports",
                "interfaces",
                "imports",
                "named-exports",
                "modules",
                "named-imports",
                "object-types",
                "objects",
                "variable-declarations",
            ].map((rule) => [
                `perfectionist/sort-${rule}`,
                [
                    "error",
                    {
                        partitionByComment: "^@sort",
                    },
                ],
            ]),
        ),
    },

    prettier,
);
