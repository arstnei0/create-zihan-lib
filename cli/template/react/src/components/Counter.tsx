export function Counter(props: { initial?: number }) {
	const [count, setCount] = useState(props.initial ?? 0)

	return (
		<button onClick={() => setCount((count) => count + 1)}>
			Increase: {count}
		</button>
	)
}
