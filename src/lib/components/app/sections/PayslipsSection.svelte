<script lang="ts">
	import Panel from '../ui/Panel.svelte';
	import StatusBadge from '../ui/StatusBadge.svelte';

	export let activeRole = 'hrd';
	export let featuredPayslip: any;
	export let details: any[] = [];
	export let payslips: any[] = [];
	export let activeArchiveSubject = '';
	export let publicationForm: any = {};
	export let publicationPeriods: string[] = [];
	export let onPublicationFieldChange: (field: string, value: string | boolean) => void = () => {};
	export let onSubmitPublication: () => void = () => {};
	export let onDownloadFeatured: () => void = () => {};
	export let onViewFeaturedDetails: () => void = () => {};
	export let onOpenArchiveSlip: (subject: string) => void = () => {};

	function updatePublication(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
		onPublicationFieldChange(field, value);
	}
</script>

{#if activeRole === 'employee'}
	<section class="content-grid">
		<Panel className="featured-slip">
			<span class="eyebrow">{featuredPayslip?.eyebrow}</span>
			<h3>{featuredPayslip?.title}</h3>
			<strong class="featured-amount">{featuredPayslip?.amount}</strong>
			<p>{featuredPayslip?.meta}</p>
			<div class="pill-list">
				{#each featuredPayslip?.chips ?? [] as chip}
					<span class="pill">{chip}</span>
				{/each}
			</div>
			<div class="form-actions">
				<button type="button" class="button-secondary" on:click={onViewFeaturedDetails}>Lihat rincian</button>
				<button type="button" class="button-primary" on:click={onDownloadFeatured}>Download PDF</button>
			</div>
		</Panel>

		<Panel title="Komponen slip" meta="Salary breakdown">
			<div class="stack">
				{#each details as item}
					<div class="list-item">
						<div>
							<strong>{item.label}</strong>
						</div>
						<span class="value-chip">{item.value}</span>
					</div>
				{/each}
			</div>
		</Panel>
	</section>

	<section class="card-grid wide">
		{#each payslips as slip}
			<button
				type="button"
				class={`slip-card ${activeArchiveSubject === slip.subject || (!activeArchiveSubject && slip === payslips[0]) ? 'active-slip-card' : ''}`.trim()}
				on:click={() => onOpenArchiveSlip(slip.subject)}
			>
				<div class="request-head">
					<div>
						<strong>{slip.subject}</strong>
						<p>{slip.detail}</p>
					</div>
					<StatusBadge tone={slip.tone} label={slip.status} />
				</div>
				<strong class="slip-value">{slip.amount}</strong>
			</button>
		{/each}
	</section>
{:else}
	<section class="split-grid">
		<div class="stack">
			<Panel className="featured-slip">
				<span class="eyebrow">{featuredPayslip?.eyebrow}</span>
				<h3>{featuredPayslip?.title}</h3>
				<strong class="featured-amount">{featuredPayslip?.amount}</strong>
				<p>{featuredPayslip?.meta}</p>
				<div class="pill-list">
					{#each featuredPayslip?.chips ?? [] as chip}
						<span class="pill">{chip}</span>
					{/each}
				</div>
			</Panel>

			<Panel title="Riwayat batch payslip" meta={`${payslips.length} batch`}>
				<div class="record-list">
					{#each payslips as slip}
						<article class="record-card static-card">
							<div class="record-card-head">
								<div>
									<strong>{slip.subject}</strong>
									<p>{slip.detail}</p>
								</div>
								<StatusBadge tone={slip.tone} label={slip.status} />
							</div>
							<strong class="slip-value">{slip.amount}</strong>
						</article>
					{/each}
				</div>
			</Panel>
		</div>

		<div class="stack">
			<Panel title="Publikasi slip" meta="Form P0">
				<div class="form-grid compact-form">
					<label class="field">
						<span>Period</span>
						<select value={publicationForm.period_id ?? publicationPeriods[0] ?? ''} on:change={(event) => updatePublication('period_id', event)}>
							{#each publicationPeriods as period}
								<option value={period}>{period}</option>
							{/each}
						</select>
					</label>
					<label class="field">
						<span>Employee scope</span>
						<input value={publicationForm.employee_scope ?? ''} on:input={(event) => updatePublication('employee_scope', event)} />
					</label>
					<label class="field">
						<span>Publish mode</span>
						<input value={publicationForm.publish_mode ?? ''} on:input={(event) => updatePublication('publish_mode', event)} />
					</label>
					<label class="field">
						<span>Publish date</span>
						<input type="date" value={publicationForm.publish_date ?? ''} on:input={(event) => updatePublication('publish_date', event)} />
					</label>
					<label class="field">
						<span>Delivery channel</span>
						<input value={publicationForm.delivery_channel ?? ''} on:input={(event) => updatePublication('delivery_channel', event)} />
					</label>
					<label class="switch-field">
						<div>
							<strong>Include PDF</strong>
							<p>Kirim file PDF bersama arsip in-app.</p>
						</div>
						<input type="checkbox" checked={Boolean(publicationForm.include_pdf)} on:change={(event) => updatePublication('include_pdf', event)} />
					</label>
					<label class="field field-span-2">
						<span>Note to employee</span>
						<textarea rows="3" on:input={(event) => updatePublication('note_to_employee', event)}>{publicationForm.note_to_employee ?? ''}</textarea>
					</label>
				</div>

				<div class="form-actions">
					<button type="button" class="button-primary" on:click={onSubmitPublication}>Publikasikan slip</button>
				</div>
			</Panel>

			<Panel title="Kontrol publikasi" meta="Batch monitoring">
				<div class="stack">
					{#each details as item}
						<div class="list-item">
							<div>
								<strong>{item.label}</strong>
							</div>
							<span class="value-chip">{item.value}</span>
						</div>
					{/each}
				</div>
			</Panel>
		</div>
	</section>
{/if}
