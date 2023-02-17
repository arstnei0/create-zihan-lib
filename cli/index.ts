#!/usr/bin/env node

import { create, finish, promptOptions } from "./project"
import { greet } from "./utils/greet"
;(async () => {
	await greet()
	const opt = await promptOptions()

	await create(opt)

	await finish(opt)
})()
