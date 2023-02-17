import { join } from "path"
import { Installer } from ".."
import { modifyPackageJson } from "../../utils/packageJson"
import fs from "fs-extra"
import { eslintTemplateDir } from "../../utils/template"

export const eslintInstaller: Installer = {
	name: "ESLint",
	install: async (opt) => {
		await fs.copy(eslintTemplateDir, opt.dir)
		await modifyPackageJson(join(opt.dir, "package.json"), (pkg) => ({
			...pkg,
			scripts: {
				...pkg.scripts,
				lint: "eslint .",
			},
			devDependencies: {
				...pkg.devDependencies,
				"@typescript-eslint/eslint-plugin": "^5.52.0",
				"@typescript-eslint/parser": "^5.52.0",
				eslint: "^8.34.0",
			},
		}))
	},
}
