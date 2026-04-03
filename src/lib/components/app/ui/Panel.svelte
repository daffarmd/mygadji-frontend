<script lang="ts">
	export let title = '';
	export let meta = '';
	export let className = '';
</script>

<article class={`panel ${className}`.trim()}>
	{#if title || meta}
		<div class="panel-head">
			<h3>{title}</h3>
			{#if meta}
				<span>{meta}</span>
			{/if}
		</div>
	{/if}

	<slot />
</article>
