<script lang="ts">
	export let stats: any[] = [];
	export let compact = false;
</script>

<section class:compact class="stats-grid">
	{#each stats as stat}
		<article class={`stat-card tone-${stat.tone ?? 'blue'}`}>
			{#if stat.icon || stat.delta}
				<div class="stat-head">
					{#if stat.icon}
						<div class="stat-icon">
							<span class="material-symbols-outlined">{stat.icon}</span>
						</div>
					{:else}
						<div></div>
					{/if}

					{#if stat.delta}
						<span class={`delta ${stat.tone ?? 'blue'}`}>{stat.delta}</span>
					{/if}
				</div>
			{/if}

			<span class="stat-label">{stat.label}</span>
			<strong class="stat-value">{stat.value}</strong>

			{#if stat.note}
				<p class="mini-copy">{stat.note}</p>
			{/if}
		</article>
	{/each}
</section>
