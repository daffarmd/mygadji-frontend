<script lang="ts">
	import Panel from '../ui/Panel.svelte';
	import ProgressList from '../ui/ProgressList.svelte';

	export let reportCards: any[] = [];
	export let reportKpis: any[] = [];
	export let reportCadence: string[] = [];
	export let onOpenReport: (report: any) => void = () => {};
</script>

<section class="card-grid wide">
	{#each reportCards as report}
		<button
			type="button"
			class={`report-card report-card-button tone-${report.tone}`}
			on:click={() => onOpenReport(report)}
		>
			<div class="panel-head">
				<h3>{report.title}</h3>
				<span>{report.action}</span>
			</div>
			<p>{report.note}</p>
		</button>
	{/each}
</section>

<section class="split-grid">
	<Panel title="KPI keberhasilan produk" meta="From PRD">
		<ProgressList items={reportKpis} />
	</Panel>

	<Panel title="Cadence laporan" meta="Monitoring rutin">
		<ul class="scope-list">
			{#each reportCadence as item}
				<li>{item}</li>
			{/each}
		</ul>
	</Panel>
</section>
