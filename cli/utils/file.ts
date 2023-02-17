import fs from "fs-extra"

export const replaceFile = async (
	file: string,
	from: string | RegExp,
	to: string,
) => {
	const original = (await fs.readFile(file)).toString()
	const newContent = original.replaceAll(from, to)
	await fs.writeFile(file, newContent)
}

export const rewriteFile = async (
	file: string,
	rewriter: (data: string) => Promise<string>,
) => {
	const original = (await fs.readFile(file)).toString()
	const newContent = await rewriter(original)
	await fs.writeFile(file, newContent)
}
