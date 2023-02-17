import { Options } from "./options"
import {
	text,
	confirm,
	spinner,
	note,
	multiselect,
	isCancel,
	cancel,
	outro,
} from "@clack/prompts"
import { getPm, installDependenciesCommand, PM } from "../utils/pm"
import fs from "fs-extra"
import { join } from "path"
import { baseTemplateDir, templateDir } from "../utils/template"
import { modifyPackageJson } from "../utils/packageJson"
import { exe } from "../utils/exe"
import colors from "picocolors"
import { installers, Installers } from "../installers"

const input = <T>(data: symbol | T) => {
	if (isCancel(data)) {
		cancel("Cancelled.")
		process.exit()
	}
	return data
}

export const promptOptions = async () => {
	const name = input(
		await text({
			message: "The name of your library",
			placeholder: "zihan-lib",
		}),
	)
	const tools = input(
		await multiselect({
			message: "Select the tools you want to use.",
			options: [
				...Object.entries(installers).map(([id, { name }]) => ({
					value: id,
					label: name,
				})),
			],
			initialValue: [],
			required: false,
		}),
	)

	const $installers = [...tools] as Installers

	const cwd = process.cwd()
	const opt: Options = {
		name,
		pm: getPm(),
		dir: join(cwd, name),
		installers: $installers,
	}

	return opt
}

export const finish = async (opt: Options) => {
	const command = installDependenciesCommand(opt.pm)
	// const command = "pnpm install"

	const ifInstallDependencies = input(
		await confirm({
			message: `Do you want to install npm dependencies? (${command})`,
			initialValue: true,
			active: "Yes (Recommended)",
		}),
	)
	if (ifInstallDependencies) {
		const installSpinner = spinner()
		installSpinner.start(
			colors.blue(
				`Installing dependencies by running "${colors.yellow(
					command,
				)}"`,
			),
		)
		await exe(command, opt.dir, { pipe: false })
		installSpinner.stop(
			colors.green(`Dependencies installed successfully!`),
		)
	}

	outro("Thank you for using Create Zihan Lib!")
}

const install = async (opt: Options) => {
	const installSpinner = spinner()
	for (let installerId of opt.installers) {
		const { name, install } = installers[installerId]
		installSpinner.start(
			`${colors.blue(`Installing `)}${colors.yellow(name)}`,
		)
		await install(opt)
		installSpinner.stop(
			`${colors.yellow(name)} ${colors.green(`installed successfully!`)}`,
		)
	}
}

export const create = async (opt: Options) => {
	const exists = await fs.exists(opt.dir)

	if (!exists) {
		const ifCreateDir = input(
			await confirm({
				message: `Directory doesn't exist. Do you want to create a new directory \`${opt.dir}\`?`,
			}),
		)
		if (ifCreateDir) await fs.mkdir(opt.dir)
		else await cancel(`Directory doesn't exist. Cancelled.`)
	}

	await fs.emptyDir(opt.dir)

	const copyFilesSpinner = spinner()
	copyFilesSpinner.start(`Copying files from the base template`)
	await fs.copy(baseTemplateDir, opt.dir)
	copyFilesSpinner.stop(colors.green(`Files copied from the base template!`))

	await modifyPackageJson(
		// join(opt.dir, "packages/template/package.json"),
		join(opt.dir, "package.json"),
		(pkg) => ({
			...pkg,
			name: opt.name,
		}),
	)
	// await modifyPackageJson(join(opt.dir, "package.json"), (pkg) => ({
	// 	...pkg,
	// 	scripts: Object.entries(pkg.scripts)
	// 		.map(([name, content]) => [
	// 			name,
	// 			content.replaceAll("__NAME__", opt.name),
	// 		])
	// 		.reduce(
	// 			(prev, [name, content]) => ({ ...prev, [name]: content }),
	// 			{},
	// 		),
	// }))

	// const targetPkgDir = join(opt.dir, `packages/${opt.name}`)
	// await fs.move(join(opt.dir, "packages/template"), targetPkgDir)

	await install(opt)
}
