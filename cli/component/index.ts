import { Options } from "../project/options"
import { solidInstaller } from "./solid"
import { reactInstaller } from "./react"
import { spinner } from "@clack/prompts"
import colors from "picocolors"
import { replaceFile } from "../utils/replace"
import { join } from "path"
import { AUTO_IMPORTS, IMPORTS, PLUGINS } from "./placeholder"
import { modifyPackageJson } from "../utils/packageJson"

export const components = [
	{ id: "solid", name: "Solid", install: solidInstaller },
	{ id: "react", name: "React", install: reactInstaller },
] as const
export type ComponentId = typeof components[number]["id"]
export type ComponentInstaller = (opt: Options) => Promise<void>

export const installComponent = async (opt: Options) => {
	let install: ComponentInstaller
	let name: string
	for (let component of components) {
		if (component.id === opt.component) {
			install = component.install
			name = component.name
			break
		}
	}

	const componentSpinner = spinner()
	componentSpinner.start(`Installing ${colors.yellow(name)}`)
	await install(opt)
	componentSpinner.stop(
		`${colors.yellow(name)} ${colors.green(`installed successfully!`)}`,
	)

	await replaceFile(join(opt.dir, "vite.config.ts"), `${AUTO_IMPORTS}\n`, "")
	await replaceFile(join(opt.dir, "vite.config.ts"), `${IMPORTS}\n`, "")
	await replaceFile(join(opt.dir, "vite.config.ts"), `${PLUGINS}\n`, "")

	await modifyPackageJson(join(opt.dir, "package.json"), (pkg) => ({
		...pkg,
		scripts: {
			...pkg.scripts,
			dev: "vite dev",
		},
	}))
}