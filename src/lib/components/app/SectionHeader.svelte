<script lang="ts">
	export let module: any;
	export let roleLabel = '';
	export let userName = '';

	$: firstName = userName.split(' ')[0] ?? roleLabel;
	$: headerIcon = module.id === 'dashboard' ? 'space_dashboard' : module.icon;
</script>

<section class="section-head">
	{#if module.id === 'dashboard'}
		<div class="section-head-main">
			<div class="section-icon" aria-hidden="true">
				<span class="material-symbols-outlined">{headerIcon}</span>
			</div>
			<div>
				<h1>Welcome back, {firstName}</h1>
				<p>It's a beautiful Monday. Here's your workspace for today.</p>
			</div>
		</div>
	{:else}
		<div class="section-head-main">
			<div class="section-icon" aria-hidden="true">
				<span class="material-symbols-outlined">{headerIcon}</span>
			</div>
			<div>
				<span class="eyebrow">{module.tag}</span>
				<h2>{module.label}</h2>
				<p>{module.description}</p>
			</div>
		</div>
		<div class="section-badge">{roleLabel} view</div>
	{/if}
</section>
