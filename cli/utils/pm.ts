export type PM = "npm" | "yarn" | "pnpm"
export const getPm = (): PM =>
	((userAgent) =>
		userAgent.startsWith("yarn")
			? "yarn"
			: userAgent.startsWith("pnpm")
			? "pnpm"
			: "npm")((process.env.npm_config_user_agent as string) ?? "npm")

export const installDependenciesCommand = (pm: PM) =>
	pm === "pnpm"
		? "pnpm install"
		: pm === "yarn"
		? "yarn install"
		: "npm install"
