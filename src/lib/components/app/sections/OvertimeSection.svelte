<script lang="ts">
	import Panel from '../ui/Panel.svelte';
	import StatsGrid from '../ui/StatsGrid.svelte';
	import StatusBadge from '../ui/StatusBadge.svelte';

	export let activeRole = 'hrd';
	export let summary: any[] = [];
	export let rows: any[] = [];
	export let payrollBreakdown: any[] = [];
	export let selectedRowId = '';
	export let form: any = {};
	export let onSelectRow: (rowId: string) => void = () => {};
	export let onFieldChange: (field: string, value: string | boolean) => void = () => {};
	export let onSubmitRequest: () => void = () => {};

	function update(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
		onFieldChange(field, value);
	}

	$: selectedRow = rows.find((row) => row.id === selectedRowId) ?? rows[0] ?? null;
</script>

<StatsGrid stats={summary} compact={true} />

<section class="split-grid">
	<div class="stack">
		<Panel
			title={activeRole === 'employee' ? 'Riwayat lembur saya' : 'Daftar pengajuan lembur'}
			meta={activeRole === 'employee' ? 'Personal recap' : 'Payroll impact'}
		>
			<div class="record-list">
				{#each rows as row}
					<button
						type="button"
						class:active={selectedRow?.id === row.id}
						class="record-card"
						on:click={() => onSelectRow(row.id)}
					>
						<div class="record-card-head">
							<div>
								<strong>{row.requester}</strong>
								<p>{row.reason}</p>
							</div>
							<StatusBadge tone={row.tone} label={row.status} />
						</div>
						<div class="detail-list compact-list">
							<div class="detail-pair">
								<span>Tanggal</span>
								<strong>{row.date}</strong>
							</div>
							<div class="detail-pair">
								<span>Durasi</span>
								<strong>{row.duration}</strong>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</Panel>

		<Panel title="Dampak ke payroll" meta="Transparent calculation">
			<div class="stack">
				{#each payrollBreakdown.slice(0, 4) as item}
					<div class="metric-row">
						<div class="metric-label">
							<strong>{item.label}</strong>
							<span>{item.value}</span>
						</div>
						<div class="progress">
							<span class={`progress-fill ${item.tone}`} style={`width: ${item.share}%`}></span>
						</div>
					</div>
				{/each}
			</div>
		</Panel>
	</div>

	<div class="stack">
		<Panel title="Ajukan lembur" meta="Form P0">
			<div class="form-grid">
				<label class="field">
					<span>Tanggal</span>
					<input type="date" value={form.request_date ?? ''} on:input={(event) => update('request_date', event)} />
				</label>
				<label class="field">
					<span>Jam mulai</span>
					<input type="time" value={form.start_time ?? ''} on:input={(event) => update('start_time', event)} />
				</label>
				<label class="field">
					<span>Jam selesai</span>
					<input type="time" value={form.end_time ?? ''} on:input={(event) => update('end_time', event)} />
				</label>
				<label class="field">
					<span>Durasi (jam)</span>
					<input type="number" min="0" step="0.5" value={form.duration_hours ?? ''} on:input={(event) => update('duration_hours', event)} />
				</label>
				<label class="field field-span-2">
					<span>Reason</span>
					<textarea rows="3" on:input={(event) => update('reason', event)}>{form.reason ?? ''}</textarea>
				</label>
				<label class="field">
					<span>Project / Cost center</span>
					<input value={form.project_or_cost_center ?? ''} on:input={(event) => update('project_or_cost_center', event)} />
				</label>
				<label class="field">
					<span>Requested by</span>
					<input value={form.requested_by ?? ''} on:input={(event) => update('requested_by', event)} />
				</label>
				<label class="field">
					<span>Supervisor ID</span>
					<input value={form.supervisor_id ?? ''} on:input={(event) => update('supervisor_id', event)} />
				</label>
				<label class="field">
					<span>Attachment</span>
					<input value={form.attachment ?? ''} on:input={(event) => update('attachment', event)} />
				</label>
				<label class="switch-field field-span-2">
					<div>
						<strong>Payroll eligible</strong>
						<p>Default true dan bisa disesuaikan HR saat review.</p>
					</div>
					<input type="checkbox" checked={Boolean(form.payroll_eligible)} on:change={(event) => update('payroll_eligible', event)} />
				</label>
				<label class="field field-span-2">
					<span>Notes</span>
					<textarea rows="3" on:input={(event) => update('notes', event)}>{form.notes ?? ''}</textarea>
				</label>
			</div>

			<div class="form-actions">
				<button type="button" class="button-primary" on:click={onSubmitRequest}>Submit overtime</button>
			</div>
		</Panel>

		<Panel title="Detail terpilih" meta="Request snapshot">
			{#if selectedRow}
				<div class="detail-list">
					<div class="detail-pair">
						<span>Pemohon</span>
						<strong>{selectedRow.requester}</strong>
					</div>
					<div class="detail-pair">
						<span>Status</span>
						<strong>{selectedRow.status}</strong>
					</div>
					<div class="detail-pair">
						<span>Durasi</span>
						<strong>{selectedRow.duration}</strong>
					</div>
					<div class="detail-pair">
						<span>Alasan</span>
						<strong>{selectedRow.reason}</strong>
					</div>
				</div>
			{:else}
				<p class="prototype-empty">Belum ada request lembur yang dipilih.</p>
			{/if}
		</Panel>
	</div>
</section>
