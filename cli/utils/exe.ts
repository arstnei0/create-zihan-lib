import { spawn } from "child_process"

export const exe = (
	cmd: string,
	cwd: string,
	{ pipe = true }: { pipe?: boolean } = {}
) =>
	new Promise((resolve) => {
		const list = cmd.split(" ")
		const [cmdName, args] = [list[0], list.slice(1)]
		const child = spawn(cmdName, args, {
			cwd,
		})
		if (pipe) child.stdout.pipe(process.stdout)
		child.on("close", resolve)
		child.on("exit", resolve)
		child.on("disconnect", resolve)
	})
