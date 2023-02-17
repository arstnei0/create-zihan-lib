import { Options } from "../project/options"
import { ComponentInstaller } from "."
import fs from "fs-extra"
import { join } from "path"
import { templateDir } from "../utils/template"
import { modifyTsconfig } from "../utils/tsconfig"
import { modifyPackageJson } from "../utils/packageJson"
import { replaceFile } from "../utils/replace"
import { AUTO_IMPORTS, IMPORTS, PLUGINS } from "./placeholder"

export const reactInstaller: ComponentInstaller = async (opt: Options) => {
	await fs.copy(join(templateDir, "react"), opt.dir)
	await modifyTsconfig(join(opt.dir, "tsconfig.json"), (tsc) => ({
		...tsc,
		compilerOptions: {
			...tsc.compilerOptions,
			jsx: "react-jsx",
		},
	}))
	await modifyPackageJson(join(opt.dir, "package.json"), (pkg) => ({
		...pkg,
		dependencies: {
			...pkg.dependencies,
			react: "^18.2.0",
			"react-dom": "^18.2.0",
		},
		devDependencies: {
			...pkg.devDependencies,
			"@types/react": "^18.0.27",
			"@types/react-dom": "^18.0.10",
			"@vitejs/plugin-react": "^3.1.0",
		},
	}))
	replaceFile(join(opt.dir, "index.html"), "__MAIN_FILE__", "main.tsx")

	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		IMPORTS,
		`${IMPORTS}\nimport React from "@vitejs/plugin-react"`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		AUTO_IMPORTS,
		`${AUTO_IMPORTS}\n				"react",`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		PLUGINS,
		`${PLUGINS}\n		React(),`,
	)
}
