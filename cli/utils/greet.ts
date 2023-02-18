import { intro, note } from "@clack/prompts"
import { textSync } from "figlet"
import gradient from "gradient-string"

export const greet = async () => {
	const title = gradient("red", "green", "blue").multiline(
		textSync("Create Zihan Lib", {}),
	)
	intro(
		`Hi! I am ${gradient(
			"red",
			"green",
			"blue",
		)(
			`Create Zihan Lib`,
		)}. You want to create a new library? Sure! Let's do it.`,
	)
	note(title)
}
