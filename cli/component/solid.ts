import { Options } from "../project/options"
import { ComponentInstaller } from "."
import fs from "fs-extra"
import { join } from "path"
import { templateDir } from "../utils/template"
import { modifyTsconfig } from "../utils/tsconfig"
import { modifyPackageJson } from "../utils/packageJson"
import { replaceFile, rewriteFile } from "../utils/file"
import { AUTO_IMPORTS, EXTERNAL, IMPORTS, PLUGINS } from "./placeholder"
import { yamlParse, yamlStringify } from "../utils/yaml"

export const solidInstaller: ComponentInstaller = async (opt: Options) => {
	const eslint = opt.installers.includes("eslint")
	await fs.copy(join(templateDir, "solid"), opt.dir)
	await modifyTsconfig(join(opt.dir, "tsconfig.json"), (tsc) => ({
		...tsc,
		compilerOptions: {
			...tsc.compilerOptions,
			jsx: "preserve",
			jsxImportSource: "solid-js",
		},
	}))
	await modifyPackageJson(join(opt.dir, "package.json"), (pkg) => ({
		...pkg,
		dependencies: {
			...pkg.dependencies,
			"solid-js": "^1.6.11",
		},
		devDependencies: {
			...pkg.devDependencies,
			"vite-plugin-solid": "^2.5.0",
			...(eslint
				? {
						"eslint-plugin-solid": "^0.9.4",
				  }
				: {}),
		},
	}))
	replaceFile(join(opt.dir, "index.html"), "__MAIN_FILE__", "main.tsx")

	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		IMPORTS,
		`${IMPORTS}\nimport Solid from "vite-plugin-solid"`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		AUTO_IMPORTS,
		`${AUTO_IMPORTS}\n				"solid-js",`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		EXTERNAL,
		`${EXTERNAL}\n				/^solid-js/ig,`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		PLUGINS,
		`${PLUGINS}\n		Solid(),`,
	)

	if (eslint)
		rewriteFile(join(opt.dir, ".eslintrc.yaml"), async (str) => {
			const c = yamlParse(str)
			return yamlStringify({
				...c,
				extends: [...c.extends, "plugin:solid/typescript"],
			})
		})
}
