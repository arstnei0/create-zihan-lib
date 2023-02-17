export const Counter: Component<{ initial?: number }> = (props) => {
	const [count, setCount] = createSignal(props.initial ?? 0)

	return (
		<button onClick={() => setCount((count) => count + 1)}>
			Increase: {count()}
		</button>
	)
}
