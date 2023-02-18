import { Options } from "../project/options"
import { ComponentInstaller } from "."
import fs from "fs-extra"
import { join } from "path"
import { templateDir } from "../utils/template"
import { modifyTsconfig } from "../utils/tsconfig"
import { modifyPackageJson } from "../utils/packageJson"
import { replaceFile, rewriteFile } from "../utils/file"
import {
	AUTO_IMPORTS,
	AUTO_IMPORTS_APPEND,
	EXTERNAL,
	IMPORTS,
	PLUGINS,
} from "./placeholder"
import { yamlParse, yamlStringify } from "../utils/yaml"

export const vueInstaller: ComponentInstaller = async (opt: Options) => {
	const eslint = opt.installers.includes("eslint")
	await fs.copy(join(templateDir, "vue"), opt.dir)
	await modifyPackageJson(join(opt.dir, "package.json"), (pkg) => ({
		...pkg,
		scripts: {
			...pkg.scripts,
			// build: `${pkg.scripts.build} && cp -R ./src/components ./dist/components`,
		},
		dependencies: {
			...pkg.dependencies,
			vue: "^3.2.47",
		},
		devDependencies: {
			...pkg.devDependencies,
			"@vitejs/plugin-vue": "^4.0.0",
			...(eslint
				? {
						"eslint-plugin-vue": "^9.9.0",
				  }
				: {}),
		},
	}))
	replaceFile(join(opt.dir, "index.html"), "__MAIN_FILE__", "main.ts")

	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		IMPORTS,
		`${IMPORTS}\nimport Vue from "@vitejs/plugin-vue"`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		AUTO_IMPORTS,
		`${AUTO_IMPORTS}\n				"vue",`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		AUTO_IMPORTS_APPEND,
		`${AUTO_IMPORTS_APPEND}
			vueTemplate: true,
			eslintrc: {
				enabled: true,
				filepath: "./.eslintrc-auto-import.generated.json",
			},`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		EXTERNAL,
		`${EXTERNAL}\n				/^vue/ig,`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		PLUGINS,
		`${PLUGINS}\n		Vue(),`,
	)

	if (eslint)
		rewriteFile(join(opt.dir, ".eslintrc.yaml"), async (str) => {
			const c = yamlParse(str)
			return yamlStringify({
				...c,
				extends: [
					...c.extends,
					"plugin:vue/vue3-recommended",
					"./.eslintrc-auto-import.generated.json",
				],
				parser: "vue-eslint-parser",
				parserOptions: {
					parser: "@typescript-eslint/parser",
				},
				rules: {
					...c.rules,
					"vue/html-indent": "off",
					"vue/multi-word-component-names": "off",
				},
			})
		})
}
