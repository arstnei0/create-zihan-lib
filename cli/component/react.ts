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

export const reactInstaller: ComponentInstaller = async (opt: Options) => {
	const eslint = opt.installers.includes("eslint")
	await fs.copy(join(templateDir, "react"), opt.dir)
	await modifyTsconfig(join(opt.dir, "tsconfig.json"), (tsc) => ({
		...tsc,
		compilerOptions: {
			...tsc.compilerOptions,
			jsx: "react-jsxdev",
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
			...(eslint
				? {
						"eslint-plugin-react": "^7.32.2",
				  }
				: {}),
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
		EXTERNAL,
		`${EXTERNAL}\n				/^react/ig,`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		PLUGINS,
		`${PLUGINS}\n		React(),`,
	)

	if (eslint)
		rewriteFile(join(opt.dir, ".eslintrc.yaml"), async (str) => {
			const c = yamlParse(str)
			return yamlStringify({
				...c,
				extends: [...c.extends, "plugin:react/recommended"],
				rules: { ...c.rules, "react/react-in-jsx-scope": "off" },
			})
		})
}
