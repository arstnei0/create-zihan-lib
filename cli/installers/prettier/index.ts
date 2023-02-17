import { Installer } from ".."
import fs from "fs-extra"
import { prettierTemplateDir } from "../../utils/template"
import { join } from "path"
import { modifyPackageJson } from "../../utils/packageJson"

export const prettierInstaller: Installer = {
	name: "Prettier",
	install: async (opt) => {
		await fs.copy(prettierTemplateDir, opt.dir)
		await modifyPackageJson(join(opt.dir, "package.json"), (pkg) => ({
			...pkg,
			scripts: {
				...pkg.scripts,
				format: "prettier --write . --plugin-search-dir .",
			},
			devDependencies: {
				...pkg.devDependencies,
				prettier: "^2.8.4",
			},
		}))
	},
}
