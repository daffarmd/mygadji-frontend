<script lang="ts">
	import Panel from '../ui/Panel.svelte';
	import StatsGrid from '../ui/StatsGrid.svelte';
	import StatusBadge from '../ui/StatusBadge.svelte';

	export let stats: any[] = [];
	export let employees: any[] = [];
	export let selectedEmployeeId = '';
	export let filters: any = {};
	export let form: any = {};
	export let documentDraft: any = {};
	export let importSummary: any = {};
	export let contractAlerts: any[] = [];
	export let formatCurrency: (value: number) => string = (value) => String(value);
	export let onSelectEmployee: (employeeId: string) => void = () => {};
	export let onFilterChange: (field: string, value: string) => void = () => {};
	export let onFieldChange: (field: string, value: string) => void = () => {};
	export let onDocumentFieldChange: (field: string, value: string) => void = () => {};
	export let onSaveEmployee: () => void = () => {};
	export let onResetEmployee: () => void = () => {};
	export let onToggleEmployeeStatus: () => void = () => {};
	export let onAttachDocument: () => void = () => {};

	const statusOptions = ['active', 'probation', 'contract', 'inactive'];
	const employmentTypeOptions = ['Permanent', 'Contract', 'Probation'];
	const payrollGroups = ['Monthly HQ', 'Monthly Ops', 'Weekly'];

	function update(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		onFieldChange(field, target.value);
	}

	function updateFilter(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLSelectElement;
		onFilterChange(field, target.value);
	}

	function updateDocument(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLSelectElement;
		onDocumentFieldChange(field, target.value);
	}

	$: divisions = Array.from(new Set(employees.map((employee) => employee.division))).filter(Boolean);
	$: selectedEmployee = employees.find((employee) => employee.employee_id === selectedEmployeeId) ?? employees[0] ?? null;
</script>

<StatsGrid stats={stats} compact={true} />

<section class="split-grid">
	<div class="stack">
		<Panel title="Direktori karyawan" meta={`${employees.length} record aktif`}>
			<div class="control-bar">
				<label class="field compact-field">
					<span>Cari</span>
					<input value={filters.query ?? ''} placeholder="Nama, email, atau ID" on:input={(event) => updateFilter('query', event)} />
				</label>
				<label class="field compact-field">
					<span>Divisi</span>
					<select value={filters.division ?? 'all'} on:change={(event) => updateFilter('division', event)}>
						<option value="all">Semua divisi</option>
						{#each divisions as division}
							<option value={division}>{division}</option>
						{/each}
					</select>
				</label>
				<label class="field compact-field">
					<span>Status</span>
					<select value={filters.status ?? 'all'} on:change={(event) => updateFilter('status', event)}>
						<option value="all">Semua status</option>
						{#each statusOptions as status}
							<option value={status}>{status}</option>
						{/each}
					</select>
				</label>
				<button type="button" class="button-secondary compact-button" on:click={() => onFilterChange('export', 'csv')}>Export CSV</button>
			</div>

			<div class="record-list">
				{#each employees as employee}
					<button
						type="button"
						class:active={selectedEmployee?.employee_id === employee.employee_id}
						class="record-card"
						on:click={() => onSelectEmployee(employee.employee_id)}
					>
						<div class="record-card-head">
							<div>
								<strong>{employee.full_name}</strong>
								<p>{employee.position} | {employee.division}</p>
							</div>
							<StatusBadge tone={employee.employment_status === 'inactive' ? 'red' : employee.employment_status === 'contract' ? 'amber' : 'green'} label={employee.employment_status} />
						</div>
						<div class="detail-list compact-list">
							<div class="detail-pair">
								<span>ID</span>
								<strong>{employee.employee_id}</strong>
							</div>
							<div class="detail-pair">
								<span>Gaji pokok</span>
								<strong>{formatCurrency(Number(employee.base_salary ?? 0))}</strong>
							</div>
							<div class="detail-pair">
								<span>Kelengkapan</span>
								<strong>{employee.completeness}</strong>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</Panel>

		<Panel title="P1 readiness" meta="Import & contract tracker">
			<div class="card-grid">
				<div class="summary-tile">
					<strong>{importSummary.rows ?? 0} baris</strong>
					<p>{importSummary.note ?? 'Belum ada import baru.'}</p>
				</div>
				<div class="summary-tile">
					<strong>{contractAlerts.length} alert</strong>
					<p>Kontrak dan dokumen yang perlu ditinjau sebelum payroll berikutnya.</p>
				</div>
			</div>
			<div class="stack compact-stack">
				{#each contractAlerts as item}
					<div class="list-item">
						<div>
							<strong>{item.title}</strong>
							<p>{item.meta}</p>
						</div>
						<StatusBadge tone={item.tone} label={item.badge} />
					</div>
				{/each}
			</div>
		</Panel>
	</div>

	<div class="stack">
		<Panel title={form.employee_id ? 'Edit karyawan' : 'Tambah karyawan'} meta="CRUD dasar">
			<div class="form-grid">
				<label class="field">
					<span>Employee ID</span>
					<input value={form.employee_id ?? ''} on:input={(event) => update('employee_id', event)} />
				</label>
				<label class="field">
					<span>Nama lengkap</span>
					<input value={form.full_name ?? ''} on:input={(event) => update('full_name', event)} />
				</label>
				<label class="field">
					<span>NIK</span>
					<input value={form.national_id ?? ''} on:input={(event) => update('national_id', event)} />
				</label>
				<label class="field">
					<span>Email</span>
					<input type="email" value={form.email ?? ''} on:input={(event) => update('email', event)} />
				</label>
				<label class="field">
					<span>Nomor HP</span>
					<input value={form.phone_number ?? ''} on:input={(event) => update('phone_number', event)} />
				</label>
				<label class="field">
					<span>Alamat</span>
					<textarea rows="3" on:input={(event) => update('address', event)}>{form.address ?? ''}</textarea>
				</label>
				<label class="field">
					<span>Divisi</span>
					<input value={form.division ?? ''} on:input={(event) => update('division', event)} />
				</label>
				<label class="field">
					<span>Jabatan</span>
					<input value={form.position ?? ''} on:input={(event) => update('position', event)} />
				</label>
				<label class="field">
					<span>Manager ID</span>
					<input value={form.manager_id ?? ''} on:input={(event) => update('manager_id', event)} />
				</label>
				<label class="field">
					<span>Status kerja</span>
					<select value={form.employment_status ?? 'active'} on:change={(event) => update('employment_status', event)}>
						{#each statusOptions as status}
							<option value={status}>{status}</option>
						{/each}
					</select>
				</label>
				<label class="field">
					<span>Tipe kerja</span>
					<select value={form.employment_type ?? 'Permanent'} on:change={(event) => update('employment_type', event)}>
						{#each employmentTypeOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
				<label class="field">
					<span>Tanggal masuk</span>
					<input type="date" value={form.join_date ?? ''} on:input={(event) => update('join_date', event)} />
				</label>
				<label class="field">
					<span>Akhir kontrak</span>
					<input type="date" value={form.contract_end_date ?? ''} on:input={(event) => update('contract_end_date', event)} />
				</label>
				<label class="field">
					<span>Gaji pokok</span>
					<input type="number" min="0" value={form.base_salary ?? ''} on:input={(event) => update('base_salary', event)} />
				</label>
				<label class="field">
					<span>Bank</span>
					<input value={form.bank_name ?? ''} on:input={(event) => update('bank_name', event)} />
				</label>
				<label class="field">
					<span>No. rekening</span>
					<input value={form.bank_account_number ?? ''} on:input={(event) => update('bank_account_number', event)} />
				</label>
				<label class="field">
					<span>Nama rekening</span>
					<input value={form.bank_account_holder_name ?? ''} on:input={(event) => update('bank_account_holder_name', event)} />
				</label>
				<label class="field">
					<span>NPWP</span>
					<input value={form.tax_id ?? ''} on:input={(event) => update('tax_id', event)} />
				</label>
				<label class="field">
					<span>BPJS</span>
					<input value={form.bpjs_number ?? ''} on:input={(event) => update('bpjs_number', event)} />
				</label>
				<label class="field">
					<span>Payroll group</span>
					<select value={form.payroll_group ?? payrollGroups[0]} on:change={(event) => update('payroll_group', event)}>
						{#each payrollGroups as group}
							<option value={group}>{group}</option>
						{/each}
					</select>
				</label>
				<label class="field field-span-2">
					<span>Catatan</span>
					<textarea rows="3" on:input={(event) => update('notes', event)}>{form.notes ?? ''}</textarea>
				</label>
			</div>

			<div class="detail-list">
				<div class="detail-pair">
					<span>Dokumen tersimpan</span>
					<strong>{(form.documents ?? []).length} metadata</strong>
				</div>
				<div class="detail-pair">
					<span>Kelengkapan</span>
					<strong>{form.completeness ?? '0%'}</strong>
				</div>
			</div>

			<div class="form-actions">
				<button type="button" class="button-secondary" on:click={onResetEmployee}>Reset</button>
				<button type="button" class="button-secondary" on:click={onToggleEmployeeStatus}>Toggle status</button>
				<button type="button" class="button-primary" on:click={onSaveEmployee}>Simpan karyawan</button>
			</div>
		</Panel>

		<Panel title="Dokumen & detail terpilih" meta="Metadata first">
			{#if selectedEmployee}
				<div class="detail-list">
					<div class="detail-pair">
						<span>Atasan</span>
						<strong>{selectedEmployee.manager_name}</strong>
					</div>
					<div class="detail-pair">
						<span>Status</span>
						<strong>{selectedEmployee.employment_status}</strong>
					</div>
					<div class="detail-pair">
						<span>Payroll group</span>
						<strong>{selectedEmployee.payroll_group}</strong>
					</div>
				</div>
			{/if}

			<div class="form-grid compact-form">
				<label class="field">
					<span>Nama dokumen</span>
					<input value={documentDraft.name ?? ''} on:input={(event) => updateDocument('name', event)} />
				</label>
				<label class="field">
					<span>Tipe</span>
					<input value={documentDraft.type ?? ''} on:input={(event) => updateDocument('type', event)} />
				</label>
				<label class="field">
					<span>Berlaku sampai</span>
					<input type="date" value={documentDraft.expires_at ?? ''} on:input={(event) => updateDocument('expires_at', event)} />
				</label>
				<button type="button" class="button-primary compact-button align-end" on:click={onAttachDocument}>Tambah metadata</button>
			</div>

			<div class="pill-list">
				{#each selectedEmployee?.documents ?? [] as doc}
					<span class="pill soft">{doc.name} | {doc.type}</span>
				{/each}
			</div>
		</Panel>
	</div>
</section>
