import { PM } from "../utils/pm"
import { ComponentId } from "../component"
import { Installers } from "../installers"

export type LibType = "normal" | "component"
type BaseOptions = {
	name: string
	desc?: string
	pm: PM
	dir: string
	installers: Installers
	type: LibType
}
export type Options =
	| (BaseOptions & {
			type: "normal"
			component: null
	  })
	| (BaseOptions & {
			type: "component"
			component: ComponentId
	  })
