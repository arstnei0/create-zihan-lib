import { join } from "path"

export const templateDir = join(__dirname, "../../template")
export const baseTemplateDir = join(templateDir, "base")
export const prettierTemplateDir = join(templateDir, "prettier")
export const eslintTemplateDir = join(templateDir, "eslint")
