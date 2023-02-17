import { expect, it } from "vitest"
import { add } from "."

it("add", () => {
	expect(add(1, 1)).toEqual(2)
})
