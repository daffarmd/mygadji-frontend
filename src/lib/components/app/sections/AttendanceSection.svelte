<script lang="ts">
	import Panel from '../ui/Panel.svelte';
	import StatusBadge from '../ui/StatusBadge.svelte';

	export let activeRole = 'hrd';
	export let focus: any;
	export let highlights: any[] = [];
	export let trend: any[] = [];
	export let personalRows: any[] = [];
	export let teamRows: any[] = [];
	export let correctionForm: any = {};
	export let onCorrectionFieldChange: (field: string, value: string) => void = () => {};
	export let onSubmitCorrection: () => void = () => {};
	export let onPrimaryAction: () => void = () => {};
	export let onSecondaryAction: () => void = () => {};

	function update(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		onCorrectionFieldChange(field, target.value);
	}
</script>

<section class="feature-banner">
	<div>
		<span class="eyebrow">Absensi harian</span>
		<h3>{focus.title}</h3>
		<p>{focus.summary}</p>
		<div class="hero-actions compact-actions">
			<button type="button" class="button-primary" on:click={onPrimaryAction}>{focus.primary}</button>
			<button type="button" class="button-secondary" on:click={onSecondaryAction}>{focus.secondary}</button>
		</div>
	</div>
	<div class="pill-list">
		{#each focus.badges as badge}
			<span class="pill">{badge}</span>
		{/each}
	</div>
</section>

<section class="split-grid">
	<Panel
		title={activeRole === 'employee' ? 'Riwayat absensi saya' : 'Rekap absensi hari ini'}
		meta={activeRole === 'employee' ? '5 hari terakhir' : 'Live recap'}
		className="table-card"
	>
		<div class="table-wrap">
			{#if activeRole === 'employee'}
				<table>
					<thead>
						<tr>
							<th>Tanggal</th>
							<th>Mode</th>
							<th>Check-in</th>
							<th>Check-out</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{#each personalRows as row}
							<tr>
								<td>{row.date}</td>
								<td>{row.mode}</td>
								<td>{row.checkIn}</td>
								<td>{row.checkOut}</td>
								<td><StatusBadge tone={row.tone} label={row.status} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<table>
					<thead>
						<tr>
							<th>Nama</th>
							<th>Divisi</th>
							<th>Check-in</th>
							<th>Check-out</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{#each teamRows as row}
							<tr>
								<td>{row.name}</td>
								<td>{row.division}</td>
								<td>{row.checkIn}</td>
								<td>{row.checkOut}</td>
								<td><StatusBadge tone={row.tone} label={row.status} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</Panel>

	<div class="stack">
		<Panel title="Highlight" meta="Today">
			<div class="stack">
				{#each highlights as item}
					<div class="summary-tile">
						<strong>{item.value}</strong>
						<p>{item.label}</p>
						<StatusBadge tone={item.tone} label={item.tone} />
					</div>
				{/each}
			</div>
		</Panel>

		<Panel title="Attendance correction" meta="P1 workflow ready">
			<div class="form-grid compact-form">
				<label class="field">
					<span>Tanggal absensi</span>
					<input type="date" value={correctionForm.attendance_date ?? ''} on:input={(event) => update('attendance_date', event)} />
				</label>
				<label class="field">
					<span>Issue type</span>
					<select value={correctionForm.issue_type ?? 'Forgot check-in'} on:change={(event) => update('issue_type', event)}>
						<option value="Forgot check-in">Forgot check-in</option>
						<option value="Forgot check-out">Forgot check-out</option>
						<option value="Wrong shift">Wrong shift</option>
						<option value="Manual review">Manual review</option>
					</select>
				</label>
				<label class="field">
					<span>Actual check-in</span>
					<input type="time" value={correctionForm.actual_check_in ?? ''} on:input={(event) => update('actual_check_in', event)} />
				</label>
				<label class="field">
					<span>Actual check-out</span>
					<input type="time" value={correctionForm.actual_check_out ?? ''} on:input={(event) => update('actual_check_out', event)} />
				</label>
				<label class="field">
					<span>Attachment</span>
					<input value={correctionForm.attachment ?? ''} on:input={(event) => update('attachment', event)} />
				</label>
				<label class="field">
					<span>Reviewer</span>
					<input value={correctionForm.reviewer_id ?? ''} on:input={(event) => update('reviewer_id', event)} />
				</label>
				<label class="field field-span-2">
					<span>Reason</span>
					<textarea rows="3" on:input={(event) => update('reason', event)}>{correctionForm.reason ?? ''}</textarea>
				</label>
			</div>

			<div class="form-actions">
				<button type="button" class="button-secondary" on:click={onSubmitCorrection}>Submit correction</button>
			</div>
		</Panel>

		<Panel title="Tren mingguan" meta="Attendance pulse">
			<div class="chart-bars">
				{#each trend as point}
					<div class="bar-group">
						<div class="bar-track">
							<span class="bar-fill" style={`height: ${point.height}%`}></span>
						</div>
						<small>{point.day}</small>
					</div>
				{/each}
			</div>
		</Panel>
	</div>
</section>
