<script lang="ts">
	import Panel from '../ui/Panel.svelte';

	export let profile: any = {};
	export let verificationState = 'Verified';
	export let roleLabel = '';
	export let onFieldChange: (field: string, value: string | boolean) => void = () => {};
	export let onSaveProfile: () => void = () => {};

	const issueOptions = ['Forgot check-in', 'Forgot check-out', 'Wrong shift', 'Manual review'];

	function updateField(field: string, event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
		onFieldChange(field, value);
	}
</script>

<section class="split-grid">
	<div class="stack">
		<Panel title="Profil pribadi" meta={`${roleLabel} workspace`}>
			<div class="form-grid">
				<label class="field">
					<span>Nama lengkap</span>
					<input value={profile.full_name ?? ''} on:input={(event) => updateField('full_name', event)} />
				</label>
				<label class="field">
					<span>Email</span>
					<input type="email" value={profile.email ?? ''} on:input={(event) => updateField('email', event)} />
				</label>
				<label class="field">
					<span>Nomor HP</span>
					<input value={profile.phone_number ?? ''} on:input={(event) => updateField('phone_number', event)} />
				</label>
				<label class="field">
					<span>Alamat</span>
					<textarea rows="3" on:input={(event) => updateField('address', event)}>{profile.address ?? ''}</textarea>
				</label>
				<label class="field">
					<span>Kontak darurat</span>
					<input value={profile.emergency_contact_name ?? ''} on:input={(event) => updateField('emergency_contact_name', event)} />
				</label>
				<label class="field">
					<span>Nomor kontak darurat</span>
					<input value={profile.emergency_contact_phone ?? ''} on:input={(event) => updateField('emergency_contact_phone', event)} />
				</label>
			</div>
		</Panel>

		<Panel title="Rekening payroll" meta={verificationState}>
			<div class="form-grid">
				<label class="field">
					<span>Nama bank</span>
					<input value={profile.bank_name ?? ''} on:input={(event) => updateField('bank_name', event)} />
				</label>
				<label class="field">
					<span>No. rekening</span>
					<input value={profile.bank_account_number ?? ''} on:input={(event) => updateField('bank_account_number', event)} />
				</label>
				<label class="field">
					<span>Nama pemilik rekening</span>
					<input value={profile.bank_account_holder_name ?? ''} on:input={(event) => updateField('bank_account_holder_name', event)} />
				</label>
				<div class="detail-note">
					<strong>Status verifikasi</strong>
					<p>Perubahan rekening sensitif ditandai sebagai pending verification sampai diverifikasi HR.</p>
				</div>
			</div>
		</Panel>
	</div>

	<div class="stack">
		<Panel title="Keamanan akun" meta="Password management">
			<div class="form-grid">
				<label class="field">
					<span>Password saat ini</span>
					<input type="password" value={profile.password_current ?? ''} on:input={(event) => updateField('password_current', event)} />
				</label>
				<label class="field">
					<span>Password baru</span>
					<input type="password" value={profile.password_new ?? ''} on:input={(event) => updateField('password_new', event)} />
				</label>
				<label class="field">
					<span>Konfirmasi password</span>
					<input type="password" value={profile.password_confirm ?? ''} on:input={(event) => updateField('password_confirm', event)} />
				</label>
			</div>
		</Panel>

		<Panel title="Preferensi notifikasi" meta="P0 + P1 readiness">
			<div class="stack compact-stack">
				<label class="switch-field">
					<div>
						<strong>In-app notification</strong>
						<p>Badge dan notification center untuk approval, payroll, attendance, dan request.</p>
					</div>
					<input type="checkbox" checked={Boolean(profile.notification_in_app)} on:change={(event) => updateField('notification_in_app', event)} />
				</label>
				<label class="switch-field">
					<div>
						<strong>Email notification</strong>
						<p>Toggle P1 untuk digest harian atau event kritikal.</p>
					</div>
					<input type="checkbox" checked={Boolean(profile.notification_email)} on:change={(event) => updateField('notification_email', event)} />
				</label>
			</div>
		</Panel>

		<Panel title="Attendance exception" meta="P1 schema ready">
			<div class="detail-list">
				<div class="detail-pair">
					<span>Issue type</span>
					<strong>{issueOptions.join(' / ')}</strong>
				</div>
				<div class="detail-pair">
					<span>Reviewer</span>
					<strong>{profile.reviewer_id ?? 'HR reviewer assigned'}</strong>
				</div>
				<p class="detail-copy">Form koreksi absensi disiapkan di modul attendance dan schema ini disimpan agar tidak bentrok saat backend siap.</p>
			</div>
		</Panel>

		<div class="form-actions">
			<button type="button" class="button-primary" on:click={onSaveProfile}>Simpan perubahan</button>
		</div>
	</div>
</section>
