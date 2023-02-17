import { isCancel } from "@clack/core"
import { cancel } from "@clack/prompts"

export const input = <T>(data: symbol | T) => {
	if (isCancel(data)) {
		cancel("Cancelled.")
		process.exit()
	}
	return data
}
