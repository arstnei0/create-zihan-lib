<script lang="ts">
	export let initial = 0
	let count: number = initial
</script>

<button on:click={() => (count += 1)}>
	Increase: {count}
</button>
