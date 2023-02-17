import { intro } from "@clack/prompts"
import { textSync } from "figlet"
import gradient from "gradient-string"

export const greet = async () => {
	const title = gradient("red", "green", "blue").multiline(
		textSync("Create Zihan Lib", {}),
	)
	console.log(title)
	intro(
		`Hi! I am ${gradient(
			"red",
			"green",
			"blue",
		)(
			`Create Zihan Lib`,
		)}. You want to create a new library? Sure! Let's do it.`,
	)
}
