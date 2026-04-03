<script lang="ts">
	import Panel from '../ui/Panel.svelte';
	import StatsGrid from '../ui/StatsGrid.svelte';
	import StatusBadge from '../ui/StatusBadge.svelte';

	export let activeRole = 'hrd';
	export let balances: any[] = [];
	export let requests: any[] = [];
	export let flow: string[] = [];
	export let selectedRequestId = '';
	export let form: any = {};
	export let onSelectRequest: (requestId: string) => void = () => {};
	export let onFieldChange: (field: string, value: string) => void = () => {};
	export let onSubmitRequest: () => void = () => {};

	const requestTypes = ['leave', 'permit', 'sick'];
	const leaveCategories = ['Annual leave', 'Special leave', 'Permit'];
	const durationOptions = ['full_day', 'half_day'];
	const halfDayOptions = ['Morning', 'Afternoon'];

	function update(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		onFieldChange(field, target.value);
	}

	$: selectedRequest = requests.find((request) => request.id === selectedRequestId) ?? requests[0] ?? null;
	$: panelTitle = activeRole === 'employee' ? 'Pengajuan saya' : 'Request cuti & izin';
</script>

<StatsGrid stats={balances} compact={true} />

<section class="split-grid">
	<div class="stack">
		<Panel title={panelTitle} meta={activeRole === 'employee' ? 'Histori terbaru' : 'Queue approval'}>
			<div class="record-list">
				{#each requests as request}
					<button
						type="button"
						class:active={selectedRequest?.id === request.id}
						class="record-card"
						on:click={() => onSelectRequest(request.id)}
					>
						<div class="record-card-head">
							<div>
								<strong>{request.requester}</strong>
								<p>{request.type}</p>
							</div>
							<StatusBadge tone={request.tone} label={request.status} />
						</div>
						<div class="detail-list compact-list">
							<div class="detail-pair">
								<span>Periode</span>
								<strong>{request.period}</strong>
							</div>
							<div class="detail-pair">
								<span>Alasan</span>
								<strong>{request.reason}</strong>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</Panel>

		<Panel title="Approval flow" meta="Simple and documented">
			<ul class="scope-list">
				{#each flow as item}
					<li>{item}</li>
				{/each}
			</ul>
		</Panel>
	</div>

	<div class="stack">
		<Panel title="Buat pengajuan" meta="Form P0">
			<div class="form-grid">
				<label class="field">
					<span>Request type</span>
					<select value={form.request_type ?? requestTypes[0]} on:change={(event) => update('request_type', event)}>
						{#each requestTypes as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
				<label class="field">
					<span>Leave category</span>
					<select value={form.leave_category ?? leaveCategories[0]} on:change={(event) => update('leave_category', event)}>
						{#each leaveCategories as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
				<label class="field">
					<span>Start date</span>
					<input type="date" value={form.start_date ?? ''} on:input={(event) => update('start_date', event)} />
				</label>
				<label class="field">
					<span>End date</span>
					<input type="date" value={form.end_date ?? ''} on:input={(event) => update('end_date', event)} />
				</label>
				<label class="field">
					<span>Duration</span>
					<select value={form.duration_type ?? durationOptions[0]} on:change={(event) => update('duration_type', event)}>
						{#each durationOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
				{#if form.duration_type === 'half_day'}
					<label class="field">
						<span>Half day session</span>
						<select value={form.half_day_session ?? halfDayOptions[0]} on:change={(event) => update('half_day_session', event)}>
							{#each halfDayOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</label>
				{/if}
				<label class="field field-span-2">
					<span>Reason</span>
					<textarea rows="3" on:input={(event) => update('reason', event)}>{form.reason ?? ''}</textarea>
				</label>
				<label class="field">
					<span>Attachment</span>
					<input value={form.attachment ?? ''} on:input={(event) => update('attachment', event)} placeholder="Surat dokter / metadata file" />
				</label>
				<label class="field">
					<span>Handover notes</span>
					<input value={form.handover_notes ?? ''} on:input={(event) => update('handover_notes', event)} />
				</label>
				<label class="field">
					<span>Replacement person ID</span>
					<input value={form.replacement_person_id ?? ''} on:input={(event) => update('replacement_person_id', event)} />
				</label>
				<label class="field">
					<span>Contact during leave</span>
					<input value={form.contact_during_leave ?? ''} on:input={(event) => update('contact_during_leave', event)} />
				</label>
			</div>

			<div class="form-actions">
				<button type="button" class="button-primary" on:click={onSubmitRequest}>Submit request</button>
			</div>
		</Panel>

		<Panel title="Detail request" meta="Status & policy">
			{#if selectedRequest}
				<div class="detail-list">
					<div class="detail-pair">
						<span>Pemohon</span>
						<strong>{selectedRequest.requester}</strong>
					</div>
					<div class="detail-pair">
						<span>Status</span>
						<strong>{selectedRequest.status}</strong>
					</div>
					<div class="detail-pair">
						<span>Periode</span>
						<strong>{selectedRequest.period}</strong>
					</div>
					<div class="detail-pair">
						<span>Catatan</span>
						<strong>{selectedRequest.reason}</strong>
					</div>
				</div>
			{:else}
				<p class="prototype-empty">Belum ada request untuk ditampilkan.</p>
			{/if}

			<div class="pill-list">
				<span class="pill soft">Kuota tahunan otomatis</span>
				<span class="pill soft">Status real-time</span>
				<span class="pill soft">Catatan alasan wajib</span>
				<span class="pill soft">Approval singkat</span>
			</div>
		</Panel>
	</div>
</section>
