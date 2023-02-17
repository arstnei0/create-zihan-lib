import { prettierInstaller } from "./prettier"
import { Options } from "../project/options"
import { eslintInstaller } from "./eslint"

export type Installer = {
	name: string
	install: (opt: Options) => Promise<void>
}
export const installers = {
	prettier: prettierInstaller,
	eslint: eslintInstaller,
} as const
export type InstallerName = keyof typeof installers
export type Installers = InstallerName[]
