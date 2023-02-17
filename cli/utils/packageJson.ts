import { PackageJson, Promisable } from "type-fest"
import fs from "fs-extra"
import { jsonParse, jsonStringify } from "./json"

export const modifyPackageJson = async (
	file: string,
	modifier: (pkg: PackageJson) => Promisable<PackageJson>,
) => {
	const pkg = jsonParse(await fs.readFile(file)) as PackageJson
	const newPkg = await Promise.resolve(modifier(pkg))
	await fs.writeFile(file, jsonStringify(newPkg))
}
