export const jsonParse = ($data: string | Buffer) => {
	let data: string
	if (Buffer.isBuffer($data)) data = $data.toString()
	else data = $data

	return JSON.parse(data)
}

export const jsonStringify = (data: any) => JSON.stringify(data, null, "\t")
