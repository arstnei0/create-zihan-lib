<script lang="ts" setup>
const props = defineProps<{
	initial?: number
}>()

const count = ref(props.initial ?? 0)
</script>

<template>
	<button
		@click="
			() => {
				count += 1
			}
		"
	>
		Increase: {{ count }}
	</button>
</template>
