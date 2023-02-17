import yaml from "yaml"

export const yamlParse = (str: string | Buffer) => {
	let data = str as string
	if (Buffer.isBuffer(str)) {
		data = str.toString()
	}
	return yaml.parse(data)
}

export const yamlStringify = (value: any) => {
	return yaml.stringify(value, { indent: 4 })
}
