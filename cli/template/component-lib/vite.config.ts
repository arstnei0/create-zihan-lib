import { defineConfig } from "vite"
import AutoImport from "unplugin-auto-import/vite"
import Dts from "vite-plugin-dts"
// __IMPORTS__

export default defineConfig({
	build: {
		lib: {
			entry: "./src/index.ts",
			formats: ["es"],
			fileName: "index",
		},
	},
	plugins: [
		AutoImport({
			dts: "./src/auto-imports.generated.d.ts",
			imports: [
				// __AUTO_IMPORTS__
			],
		}),
		Dts(),
		// __PLUGINS__
	],
})
