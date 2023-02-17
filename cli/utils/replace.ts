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
