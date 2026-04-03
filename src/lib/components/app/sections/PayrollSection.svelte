<script lang="ts">
	import Panel from '../ui/Panel.svelte';
	import StatsGrid from '../ui/StatsGrid.svelte';
	import StatusBadge from '../ui/StatusBadge.svelte';

	export let metrics: any[] = [];
	export let stages: any[] = [];
	export let breakdown: any[] = [];
	export let rows: any[] = [];
	export let periods: any[] = [];
	export let selectedPeriodId = '';
	export let selectedRowId = '';
	export let periodForm: any = {};
	export let adjustmentForm: any = {};
	export let formatCurrency: (value: number) => string = (value) => String(value);
	export let onSelectPeriod: (periodId: string) => void = () => {};
	export let onSelectRow: (rowId: string) => void = () => {};
	export let onPeriodFieldChange: (field: string, value: string) => void = () => {};
	export let onAdjustmentFieldChange: (field: string, value: string | boolean) => void = () => {};
	export let onCreatePeriod: () => void = () => {};
	export let onAddAdjustment: () => void = () => {};
	export let onFinalizePeriod: () => void = () => {};

	const statusOptions = ['draft', 'review', 'awaiting_approval', 'finalized', 'published'];
	const componentOptions = ['allowance', 'bonus', 'deduction', 'correction'];
	const calculationModes = ['fixed', 'manual'];

	function updatePeriod(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		onPeriodFieldChange(field, target.value);
	}

	function updateAdjustment(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
		onAdjustmentFieldChange(field, String(value));
	}

	$: selectedPeriod = periods.find((period) => period.id === selectedPeriodId) ?? periods[0] ?? null;
	$: selectedRow = rows.find((row) => row.id === selectedRowId) ?? rows[0] ?? null;
</script>

<StatsGrid stats={metrics} compact={true} />

<section class="content-grid">
	<Panel title="Status periode payroll" meta={selectedPeriod?.period_label ?? 'Current period'}>
		<div class="timeline">
			{#each stages as stage}
				<div class={`stage ${stage.state}`}>
					<strong>{stage.label}</strong>
					<p>{stage.note}</p>
				</div>
			{/each}
		</div>
	</Panel>

	<Panel title="Komponen biaya" meta="Payroll breakdown">
		<div class="stack">
			{#each breakdown as item}
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
</section>

<section class="split-grid">
	<div class="stack">
		<Panel title="Payroll periods" meta="Buat dan pilih periode">
			<div class="record-list">
				{#each periods as period}
					<button
						type="button"
						class:active={selectedPeriod?.id === period.id}
						class="record-card"
						on:click={() => onSelectPeriod(period.id)}
					>
						<div class="record-card-head">
							<div>
								<strong>{period.period_label}</strong>
								<p>{period.period_start} → {period.period_end}</p>
							</div>
							<StatusBadge tone={period.status === 'published' ? 'green' : period.status === 'finalized' ? 'blue' : 'amber'} label={period.status} />
						</div>
						<div class="detail-list compact-list">
							<div class="detail-pair">
								<span>Payment date</span>
								<strong>{period.payment_date}</strong>
							</div>
							<div class="detail-pair">
								<span>Group</span>
								<strong>{period.payroll_group}</strong>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</Panel>

		<Panel title="Preview payroll per karyawan" meta="Editable before finalize">
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
								<strong>{row.name}</strong>
								<p>{formatCurrency(row.total)} take-home pay</p>
							</div>
							<StatusBadge tone={row.status === 'Ready' ? 'green' : 'amber'} label={row.status} />
						</div>
						<div class="detail-list compact-list">
							<div class="detail-pair">
								<span>Pokok</span>
								<strong>{formatCurrency(row.base)}</strong>
							</div>
							<div class="detail-pair">
								<span>Tunjangan</span>
								<strong>{formatCurrency(row.allowance)}</strong>
							</div>
							<div class="detail-pair">
								<span>Potongan</span>
								<strong>{formatCurrency(row.deduction)}</strong>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</Panel>
	</div>

	<div class="stack">
		<Panel title="Buat periode payroll" meta="Form P0">
			<div class="form-grid">
				<label class="field">
					<span>Period label</span>
					<input value={periodForm.period_label ?? ''} on:input={(event) => updatePeriod('period_label', event)} />
				</label>
				<label class="field">
					<span>Period start</span>
					<input type="date" value={periodForm.period_start ?? ''} on:input={(event) => updatePeriod('period_start', event)} />
				</label>
				<label class="field">
					<span>Period end</span>
					<input type="date" value={periodForm.period_end ?? ''} on:input={(event) => updatePeriod('period_end', event)} />
				</label>
				<label class="field">
					<span>Payment date</span>
					<input type="date" value={periodForm.payment_date ?? ''} on:input={(event) => updatePeriod('payment_date', event)} />
				</label>
				<label class="field">
					<span>Payroll group</span>
					<input value={periodForm.payroll_group ?? ''} on:input={(event) => updatePeriod('payroll_group', event)} />
				</label>
				<label class="field">
					<span>Attendance cutoff</span>
					<input type="date" value={periodForm.cutoff_attendance_date ?? ''} on:input={(event) => updatePeriod('cutoff_attendance_date', event)} />
				</label>
				<label class="field">
					<span>Overtime cutoff</span>
					<input type="date" value={periodForm.cutoff_overtime_date ?? ''} on:input={(event) => updatePeriod('cutoff_overtime_date', event)} />
				</label>
				<label class="field">
					<span>Status</span>
					<select value={periodForm.status ?? statusOptions[0]} on:change={(event) => updatePeriod('status', event)}>
						{#each statusOptions as status}
							<option value={status}>{status}</option>
						{/each}
					</select>
				</label>
				<label class="field field-span-2">
					<span>Notes</span>
					<textarea rows="3" on:input={(event) => updatePeriod('notes', event)}>{periodForm.notes ?? ''}</textarea>
				</label>
			</div>

			<div class="form-actions">
				<button type="button" class="button-secondary" on:click={onFinalizePeriod}>Finalize selected period</button>
				<button type="button" class="button-primary" on:click={onCreatePeriod}>Buat periode</button>
			</div>
		</Panel>

		<Panel title="Payroll adjustment" meta={selectedRow?.name ?? 'Pilih karyawan'}>
			{#if selectedRow}
				<div class="detail-list">
					<div class="detail-pair">
						<span>Karyawan</span>
						<strong>{selectedRow.name}</strong>
					</div>
					<div class="detail-pair">
						<span>Total saat ini</span>
						<strong>{formatCurrency(selectedRow.total)}</strong>
					</div>
				</div>
			{/if}

			<div class="form-grid compact-form">
				<label class="field">
					<span>Component type</span>
					<select value={adjustmentForm.component_type ?? componentOptions[0]} on:change={(event) => updateAdjustment('component_type', event)}>
						{#each componentOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
				<label class="field">
					<span>Component name</span>
					<input value={adjustmentForm.component_name ?? ''} on:input={(event) => updateAdjustment('component_name', event)} />
				</label>
				<label class="field">
					<span>Amount</span>
					<input type="number" min="0" value={adjustmentForm.amount ?? ''} on:input={(event) => updateAdjustment('amount', event)} />
				</label>
				<label class="field">
					<span>Calculation mode</span>
					<select value={adjustmentForm.calculation_mode ?? calculationModes[0]} on:change={(event) => updateAdjustment('calculation_mode', event)}>
						{#each calculationModes as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
				<label class="field">
					<span>Attachment</span>
					<input value={adjustmentForm.attachment ?? ''} on:input={(event) => updateAdjustment('attachment', event)} />
				</label>
				<label class="field">
					<span>Created by</span>
					<input value={adjustmentForm.created_by ?? ''} on:input={(event) => updateAdjustment('created_by', event)} />
				</label>
				<label class="switch-field">
					<div>
						<strong>Taxable flag</strong>
						<p>Tandai jika komponen ikut basis perhitungan pajak.</p>
					</div>
					<input type="checkbox" checked={adjustmentForm.taxable_flag === 'true'} on:change={(event) => updateAdjustment('taxable_flag', event)} />
				</label>
				<label class="field field-span-2">
					<span>Description</span>
					<textarea rows="3" on:input={(event) => updateAdjustment('description', event)}>{adjustmentForm.description ?? ''}</textarea>
				</label>
			</div>

			<div class="form-actions">
				<button type="button" class="button-primary" on:click={onAddAdjustment}>Tambah adjustment</button>
			</div>
		</Panel>
	</div>
</section>
