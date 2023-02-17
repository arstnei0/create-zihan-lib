import { Options } from "../project/options"
import { ComponentInstaller } from "."
import fs from "fs-extra"
import { join } from "path"
import { templateDir } from "../utils/template"
import { modifyTsconfig } from "../utils/tsconfig"
import { modifyPackageJson } from "../utils/packageJson"
import { replaceFile } from "../utils/replace"
import { AUTO_IMPORTS, IMPORTS, PLUGINS } from "./placeholder"

export const solidInstaller: ComponentInstaller = async (opt: Options) => {
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
			"vite-plugin-solid": "^2.5.0",
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
		PLUGINS,
		`${PLUGINS}\n		Solid(),`,
	)
}
