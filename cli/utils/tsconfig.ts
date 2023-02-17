import { Promisable, TsConfigJson } from "type-fest"
import fs from "fs-extra"
import { jsonParse, jsonStringify } from "./json"

export const modifyTsconfig = async (
	file: string,
	modifier: (tsc: TsConfigJson) => Promisable<TsConfigJson>,
) => {
	const pkg = jsonParse(await fs.readFile(file)) as TsConfigJson
	const newPkg = await Promise.resolve(modifier(pkg))
	await fs.writeFile(file, jsonStringify(newPkg))
}
