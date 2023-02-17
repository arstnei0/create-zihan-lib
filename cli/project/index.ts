import { LibType, Options } from "./options"
import {
	text,
	confirm,
	spinner,
	note,
	multiselect,
	isCancel,
	cancel,
	outro,
	select,
} from "@clack/prompts"
import { getPm, installDependenciesCommand, PM } from "../utils/pm"
import fs from "fs-extra"
import { join } from "path"
import { baseTemplateDir, templateDir } from "../utils/template"
import { modifyPackageJson } from "../utils/packageJson"
import { exe } from "../utils/exe"
import colors from "picocolors"
import { installers, Installers } from "../installers"
import { input } from "../utils/input"
import { ComponentId, components, installComponent } from "../component"

export const promptOptions = async () => {
	const name = input(
		await text({
			message: "The name of your library",
			placeholder: "zihan-lib",
		}),
	)
	const type = input(
		await select({
			message: "What type of library are you building?",
			options: [
				{ value: "normal", label: "Normal library" },
				{ value: "component", label: "Component library" },
			],
		}),
	) as LibType
	let component: ComponentId | null = null
	if (type === "component") {
		component = input(
			await select({
				message: `Which frontend framework are you using?`,
				options: [
					...components.map(({ id, name }) => ({
						value: id,
						label: name,
					})),
				],
			}),
		)
	}
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
		type: type as any,
		pm: getPm(),
		dir: join(cwd, name),
		installers: $installers,
		component,
	}

	return opt
}

export const finish = async (opt: Options) => {
	const installDepCommand = installDependenciesCommand(opt.pm)
	// const command = "pnpm install"

	const ifInstallDependencies = input(
		await confirm({
			message: `Do you want to install npm dependencies? (${installDepCommand})`,
			initialValue: true,
			active: "Yes (Recommended)",
		}),
	)
	if (ifInstallDependencies) {
		const installSpinner = spinner()
		installSpinner.start(
			colors.blue(
				`Installing dependencies by running "${colors.yellow(
					installDepCommand,
				)}"`,
			),
		)
		await exe(installDepCommand, opt.dir, { pipe: false })
		installSpinner.stop(
			colors.green(`Dependencies installed successfully!`),
		)
	}

	const gitInitCommand = `git init`
	const ifInitGit = input(
		await confirm({
			message: `Do you want to init a new Git repo? (${gitInitCommand})`,
			initialValue: true,
			active: "Yes (Recommended)",
		}),
	)
	if (ifInitGit) {
		const gitSpinner = spinner()
		gitSpinner.start(
			colors.blue(
				`Initiating Git repo by running "${colors.yellow(
					gitInitCommand,
				)}"`,
			),
		)
		await exe(gitInitCommand, opt.dir, { pipe: false })
		gitSpinner.stop(colors.green(`Git repo initiated successfully!`))
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

	if (opt.type === "normal") {
		await fs.copy(join(templateDir, "normal-lib"), opt.dir)
	} else {
		await fs.copy(join(templateDir, "component-lib"), opt.dir)
	}

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

	if (opt.type === "normal") {
		await modifyPackageJson(join(opt.dir, "package.json"), (pkg) => ({
			...pkg,
			exports: {
				".": {
					import: "./dist/index.js",
					require: "./dist/index.js",
					types: "./dist/index.d.ts",
				},
			},
			scripts: {
				...pkg.scripts,
				test: "vitest",
				coverage: "vitest run --coverage",
				dev: "vitest --watch",
			},
			devDependencies: {
				...pkg.devDependencies,
				"vite-plugin-dts": "2.0.0-beta.0",
				"@types/node": "^18.13.0",
				vitest: "^0.28.5",
			},
		}))
	} else if (opt.type === "component") {
		await installComponent(opt)
	}

	// const targetPkgDir = join(opt.dir, `packages/${opt.name}`)
	// await fs.move(join(opt.dir, "packages/template"), targetPkgDir)

	await install(opt)
}
