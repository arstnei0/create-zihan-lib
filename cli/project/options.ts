import { PM } from "../utils/pm"
import { z } from "zod"
import { Installers } from "../installers"

export type Options = {
	name: string
	pm: PM
	dir: string
	installers: Installers
}
