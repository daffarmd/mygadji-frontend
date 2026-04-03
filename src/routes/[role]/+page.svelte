<script lang="ts">
	import MyGadjiApp from '$lib/components/MyGadjiApp.svelte';
	import { roles } from '$lib/mygadji-data';

	import type { PageData } from './$types';

	export let data: PageData;

	$: activeRoleProfile = roles.find((role) => role.id === data.role) ?? roles[0];
</script>

<svelte:head>
	<title>MyGadji | {activeRoleProfile.label}</title>
	<meta
		name="description"
		content={`MyGadji ${activeRoleProfile.label}: HR dan payroll platform dengan dashboard, attendance, leave, overtime, approval, payroll, payslips, dan reports berbasis role.`}
	/>
</svelte:head>

<MyGadjiApp role={data.role} />
