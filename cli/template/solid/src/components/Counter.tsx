import type { Component } from "solid-js"

export const Counter: Component<{ initial?: number }> = (props) => {
	// eslint-disable-next-line solid/reactivity
	const [count, setCount] = createSignal(props.initial ?? 0)

	return (
		<button onClick={() => setCount((count) => count + 1)}>
			Increase: {count()}
		</button>
	)
}
