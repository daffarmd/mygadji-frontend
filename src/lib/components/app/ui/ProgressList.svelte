<script lang="ts">
	export let items: any[] = [];
</script>

<div class="stack">
	{#each items as item}
		<div class="metric-row">
			<div class="metric-label">
				<strong>{item.label}</strong>
				<span>{item.note ?? item.value}</span>
			</div>
			<div class="progress">
				<span class={`progress-fill ${item.tone ?? 'blue'}`} style={`width: ${item.progress ?? item.share ?? 0}%`}></span>
			</div>
		</div>
	{/each}
</div>
