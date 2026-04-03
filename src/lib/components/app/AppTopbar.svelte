<script lang="ts">
	import { getInitials } from '$lib/mygadji-data';

	export let activeRoleProfile: any;
	export let isMobile = false;
	export let isSidebarCollapsed = false;
	export let searchValue = '';
	export let activeOrganizationLabel = 'Gadjianku HQ';
	export let notificationCount = 0;
	export let profilePendingLabel = '';
	export let onToggleSidebar: () => void = () => {};
	export let onSearchInput: (value: string) => void = () => {};
	export let onToggleOrganizationMenu: () => void = () => {};
	export let onToggleNotifications: () => void = () => {};
	export let onOpenProfile: () => void = () => {};

	function handleSearchInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		onSearchInput(target.value);
	}
</script>

<header class="topbar">
	<div class="topbar-leading">
		<button
			type="button"
			class="sidebar-toggle"
			aria-label={isMobile ? 'Open navigation' : isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			on:click={onToggleSidebar}
		>
			<span class="material-symbols-outlined">
				{isMobile ? 'menu' : isSidebarCollapsed ? 'right_panel_open' : 'left_panel_close'}
			</span>
		</button>

		<label class="search">
			<span class="material-symbols-outlined">search</span>
			<input
				type="text"
				placeholder="Search anything..."
				value={searchValue}
				on:input={handleSearchInput}
			/>
		</label>
	</div>

	<div class="topbar-meta">
		<button type="button" class="meta-pill meta-action" on:click={onToggleOrganizationMenu}>
			<span class="material-symbols-outlined">business_center</span>
			<span>{activeOrganizationLabel}</span>
		</button>
		<button
			type="button"
			class="icon-pill topbar-notification-button"
			aria-label="Notifications"
			on:click={onToggleNotifications}
		>
			<span class="material-symbols-outlined">notifications</span>
			{#if notificationCount > 0}
				<span class="topbar-notification-count">{notificationCount}</span>
			{/if}
		</button>
		<button type="button" class="user-pill user-button" on:click={onOpenProfile}>
			<div class="user-copy">
				<strong>{activeRoleProfile.userName}</strong>
				<span>{activeRoleProfile.userRole}</span>
				{#if profilePendingLabel}
					<small>{profilePendingLabel}</small>
				{/if}
			</div>
			<div class="avatar">{getInitials(activeRoleProfile.userName)}</div>
		</button>
		<form method="POST" action="/logout" class="logout-form">
			<button type="submit" class="meta-pill meta-action topbar-logout-button">
				<span class="material-symbols-outlined">logout</span>
				<span>Log out</span>
			</button>
		</form>
	</div>
</header>
