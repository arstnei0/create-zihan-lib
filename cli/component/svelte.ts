import { Options } from "../project/options"
import { ComponentInstaller } from "."
import fs from "fs-extra"
import { join } from "path"
import { templateDir } from "../utils/template"
import { modifyTsconfig } from "../utils/tsconfig"
import { modifyPackageJson } from "../utils/packageJson"
import { replaceFile, rewriteFile } from "../utils/file"
import { AUTO_IMPORTS, IMPORTS, PLUGINS } from "./placeholder"
import { yamlParse, yamlStringify } from "../utils/yaml"

export const svelteInstaller: ComponentInstaller = async (opt: Options) => {
	const eslint = opt.installers.includes("eslint")
	await fs.copy(join(templateDir, "svelte"), opt.dir)
	await modifyPackageJson(join(opt.dir, "package.json"), (pkg) => ({
		...pkg,
		dependencies: {
			...pkg.dependencies,
			svelte: "^3.55.1",
		},
		devDependencies: {
			...pkg.devDependencies,
			"@sveltejs/vite-plugin-svelte": "^2.0.2",
			...(eslint
				? {
						"eslint-plugin-svelte3": "^4.0.0",
				  }
				: {}),
		},
	}))
	replaceFile(join(opt.dir, "index.html"), "__MAIN_FILE__", "main.ts")

	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		IMPORTS,
		`${IMPORTS}\nimport { svelte as Svelte } from "@sveltejs/vite-plugin-svelte"`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		AUTO_IMPORTS,
		`${AUTO_IMPORTS}\n				"svelte",`,
	)
	await replaceFile(
		join(opt.dir, "vite.config.ts"),
		PLUGINS,
		`${PLUGINS}\n		Svelte(),`,
	)

	if (eslint)
		rewriteFile(join(opt.dir, ".eslintrc.yaml"), async (str) => {
			const c = yamlParse(str)
			return yamlStringify({
				...c,
				extends: [...c.extends],
				plugins: ["svelte3", ...c.plugins],
				overrides: [
					...(c.overrides ?? []),
					{
						files: ["*.svelte"],
						processor: "svelte3/svelte3",
					},
				],
				settings: {
					...c.settings,
					"svelte3/typescript": true,
				},
			})
		})
}
