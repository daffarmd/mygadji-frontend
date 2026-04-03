<script lang="ts">
	export let visibleModules: any[] = [];
	export let activeModule = 'dashboard';
	export let isMobile = false;
	export let isOpen = true;
	export let isCollapsed = false;
	export let primaryActionLabel = 'New Request';
	export let onClose: () => void = () => {};
	export let onSelectModule: (moduleId: string) => void = () => {};
	export let onPrimaryAction: () => void = () => {};
</script>

<aside class="sidebar" class:mobile={isMobile} class:open={isOpen || !isMobile} class:collapsed={isCollapsed && !isMobile}>
	<div class="sidebar-head">
		<a class="brand brand-shell" href="/" aria-label="MyGadji home">
			<div class="brand-mark">
				<img
					class="brand-logo"
					src="/brand/mygadji-logo-v2.1.png"
					alt="MyGadji logo"
					loading="eager"
					decoding="async"
				/>
			</div>
		</a>

		{#if isMobile}
			<button type="button" class="sidebar-close" aria-label="Close navigation" on:click={onClose}>
				<span class="material-symbols-outlined">close</span>
			</button>
		{/if}
	</div>

	<nav class="sidebar-nav" aria-label="Module navigation">
		{#each visibleModules as module}
			<button
				type="button"
				class:active={activeModule === module.id}
				class="nav-button"
				aria-label={module.label}
				on:click={() => onSelectModule(module.id)}
			>
				<span class="material-symbols-outlined">{module.icon}</span>
				{#if !isCollapsed || isMobile}
					<strong>{module.label}</strong>
				{/if}
			</button>
		{/each}
	</nav>

	<button
		type="button"
		class="sidebar-primary-action"
		aria-label={primaryActionLabel}
		on:click={onPrimaryAction}
	>
		<span class="material-symbols-outlined">add</span>
		{#if !isCollapsed || isMobile}
			<span>{primaryActionLabel}</span>
		{/if}
	</button>
</aside>
