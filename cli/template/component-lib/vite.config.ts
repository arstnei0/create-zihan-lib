import { defineConfig } from "vite"
import AutoImport from "unplugin-auto-import/vite"
// __IMPORTS__

export default defineConfig({
	plugins: [
		AutoImport({
			dts: "./types/auto-imports.generated.d.ts",
			imports: [
				// __AUTO_IMPORTS__
			],
		}),
		// __PLUGINS__
	],
})
