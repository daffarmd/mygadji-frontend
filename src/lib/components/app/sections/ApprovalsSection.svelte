<script lang="ts">
	import Panel from '../ui/Panel.svelte';
	import StatsGrid from '../ui/StatsGrid.svelte';
	import StatusBadge from '../ui/StatusBadge.svelte';

	export let metrics: any[] = [];
	export let approvals: any[] = [];
	export let selectedApprovalId = '';
	export let form: any = {};
	export let onSelectApproval: (approvalId: string) => void = () => {};
	export let onFieldChange: (field: string, value: string | boolean) => void = () => {};
	export let onApprove: () => void = () => {};
	export let onReject: () => void = () => {};
	export let onOpenSource: () => void = () => {};

	function update(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
		onFieldChange(field, value);
	}

	$: selectedApproval = approvals.find((item) => item.id === selectedApprovalId) ?? approvals[0] ?? null;
</script>

<StatsGrid stats={metrics} compact={true} />

<section class="split-grid">
	<div class="stack">
		<Panel title="Inbox approval" meta="Single decision center">
			<div class="record-list">
				{#each approvals as item}
					<button
						type="button"
						class:active={selectedApproval?.id === item.id}
						class={`record-card ${item.priority === 'high' ? 'priority-high' : ''}`.trim()}
						on:click={() => onSelectApproval(item.id)}
					>
						<div class="record-card-head">
							<div>
								<strong>{item.title}</strong>
								<p>{item.owner} | {item.impact}</p>
							</div>
							<StatusBadge tone={item.tone} label={item.status} />
						</div>
						<div class="pill-list">
							<span class={`pill ${item.priority === 'high' ? 'priority-pill' : 'soft'}`}>{item.priority}</span>
							<span class="pill soft">{item.category}</span>
							<span class="pill soft">{item.sla}</span>
						</div>
					</button>
				{/each}
			</div>
		</Panel>

		<Panel title="SLA" meta="Service target">
			<div class="pill-list">
				<span class="pill soft">Target respon &lt; 1 hari</span>
				<span class="pill soft">Escalate jika &gt; 24 jam</span>
				<span class="pill soft">Catatan approval wajib</span>
			</div>
		</Panel>
	</div>

	<div class="stack">
		<Panel title="Decision form" meta={selectedApproval?.title ?? 'Pilih approval'}>
			{#if selectedApproval}
				<div class="detail-list">
					<div class="detail-pair">
						<span>Target type</span>
						<strong>{selectedApproval.approval_target_type}</strong>
					</div>
					<div class="detail-pair">
						<span>Target ID</span>
						<strong>{selectedApproval.approval_target_id}</strong>
					</div>
					<div class="detail-pair">
						<span>Source module</span>
						<strong>{selectedApproval.moduleId}</strong>
					</div>
				</div>

				<div class="form-grid compact-form">
					<label class="field field-span-2">
						<span>Approval note</span>
						<textarea rows="3" on:input={(event) => update('approval_note', event)}>{form.approval_note ?? ''}</textarea>
					</label>
					<label class="field">
						<span>Effective date</span>
						<input type="date" value={form.effective_date ?? ''} on:input={(event) => update('effective_date', event)} />
					</label>
					<label class="switch-field">
						<div>
							<strong>Escalate</strong>
							<p>Naikkan ke approver berikutnya atau flag risiko.</p>
						</div>
						<input type="checkbox" checked={Boolean(form.escalation_flag)} on:change={(event) => update('escalation_flag', event)} />
					</label>
					<label class="field field-span-2">
						<span>Override reason</span>
						<input value={form.override_reason ?? ''} on:input={(event) => update('override_reason', event)} />
					</label>
				</div>

				<div class="form-actions">
					<button type="button" class="button-secondary" on:click={onOpenSource}>Open source module</button>
					<button type="button" class="button-secondary danger-button" on:click={onReject}>Reject</button>
					<button type="button" class="button-primary" on:click={onApprove}>Approve</button>
				</div>
			{:else}
				<p class="prototype-empty">Tidak ada item approval yang tersedia.</p>
			{/if}
		</Panel>

		<Panel title="Desain alur" meta="PRD aligned">
			<ul class="scope-list">
				<li>Semua approval dikumpulkan dalam satu inbox agar tidak tercecer di chat.</li>
				<li>Setiap item menyimpan catatan, status, prioritas, dan modul sumber.</li>
				<li>Approver bisa lompat ke source module untuk verifikasi data pendukung.</li>
			</ul>
		</Panel>
	</div>
</section>
