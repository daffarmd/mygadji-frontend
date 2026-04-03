<script lang="ts">
	import { enhance } from '$app/forms';
	import { roles } from '$lib/mygadji-data';

	import type { ActionData } from './$types';

	export let form: ActionData;

	const roleCards = roles.map((role) => ({
		id: role.id,
		label: role.label,
		badge: role.badge,
		notice: role.notice
	}));

	let selectedRole = form?.values?.role ?? roleCards[0]?.id ?? 'hrd';
	let emailValue = form?.values?.email ?? '';
</script>

<svelte:head>
	<title>MyGadji | Sign In</title>
	<meta
		name="description"
		content="Masuk ke workspace MyGadji untuk mengelola HR, approval, payroll, payslip, dan self-service karyawan."
	/>
</svelte:head>

<section class="auth-shell">
	<div class="auth-grid">
		<article class="auth-hero">
			<span class="auth-kicker">MyGadji Workspace</span>
			<h1>Masuk ke operasional HR dan payroll tanpa pindah ke chat atau spreadsheet.</h1>
			<p>
				Frontend ini sekarang punya pintu masuk login, role landing, dan role workspace yang
				terhubung ke alur prototype operasional.
			</p>

			<div class="auth-role-grid">
				{#each roleCards as role}
					<button
						type="button"
						class:active={selectedRole === role.id}
						class="auth-role-card"
						on:click={() => (selectedRole = role.id)}
					>
						<strong>{role.label}</strong>
						<span>{role.badge}</span>
						<p>{role.notice}</p>
					</button>
				{/each}
			</div>

			<div class="auth-feature-strip">
				<div>
					<strong>P0 ready</strong>
					<p>Employee, leave, overtime, approval, payroll, payslip, profile.</p>
				</div>
				<div>
					<strong>In-app alerts</strong>
					<p>Notification center dengan unread state dan deep-link ke item sumber.</p>
				</div>
			</div>
		</article>

		<article class="auth-card">
			<div class="auth-card-head">
				<span class="auth-kicker">Sign in</span>
				<h2>Masuk ke workspace</h2>
				<p>Pilih role yang ingin diuji lalu masuk ke dashboard yang sesuai.</p>
			</div>

			<form method="POST" action="?/login" use:enhance class="auth-form">
				<label class="field">
					<span>Email</span>
					<input
						name="email"
						type="email"
						placeholder="alex@mygadji.id"
						bind:value={emailValue}
						required
					/>
				</label>

				<label class="field">
					<span>Password</span>
					<input name="password" type="password" placeholder="Minimal 8 karakter" required />
				</label>

				<label class="field">
					<span>Role workspace</span>
					<select name="role" bind:value={selectedRole}>
						{#each roleCards as role}
							<option value={role.id}>{role.label}</option>
						{/each}
					</select>
				</label>

				{#if form?.error}
					<p class="auth-error">{form.error}</p>
				{/if}

				<button type="submit" class="auth-submit">Masuk ke workspace</button>
			</form>

			<div class="auth-foot">
				<div>
					<strong>Lupa password?</strong>
					<p>Gunakan placeholder ini untuk alur reset password P0. Integrasi email masuk fase berikutnya.</p>
				</div>
				<span class="auth-placeholder">Reset link placeholder</span>
			</div>
		</article>
	</div>
</section>

<style>
	.auth-shell {
		min-height: 100vh;
		padding: 2rem;
		background:
			radial-gradient(circle at top left, rgba(12, 86, 208, 0.12), transparent 28%),
			radial-gradient(circle at bottom right, rgba(0, 108, 73, 0.08), transparent 32%),
			linear-gradient(180deg, #f6f8fc 0%, #eef3fb 100%);
	}

	.auth-grid {
		max-width: 1180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(360px, 420px);
		gap: 1.5rem;
		align-items: stretch;
	}

	.auth-hero,
	.auth-card {
		background: rgba(255, 255, 255, 0.92);
		border: 1px solid rgba(115, 118, 133, 0.12);
		border-radius: 28px;
		box-shadow: 0 22px 54px rgba(15, 23, 42, 0.08);
	}

	.auth-hero {
		padding: 2rem;
		display: grid;
		gap: 1.5rem;
	}

	.auth-card {
		padding: 1.75rem;
		display: grid;
		gap: 1.25rem;
		align-content: start;
	}

	.auth-kicker {
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #003d9b;
	}

	.auth-hero h1,
	.auth-card h2 {
		font-size: clamp(2rem, 4vw, 3.6rem);
		line-height: 1.02;
	}

	.auth-card h2 {
		font-size: 1.8rem;
	}

	.auth-hero p,
	.auth-card p,
	.auth-role-card span,
	.auth-role-card p,
	.auth-foot p {
		color: #61697b;
	}

	.auth-role-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.auth-role-card,
	.auth-feature-strip > div,
	.auth-placeholder {
		padding: 1rem;
		border-radius: 20px;
		border: 1px solid rgba(115, 118, 133, 0.12);
		background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
		text-align: left;
	}

	.auth-role-card {
		display: grid;
		gap: 0.35rem;
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.auth-role-card.active {
		border-color: rgba(12, 86, 208, 0.3);
		box-shadow: 0 18px 34px rgba(12, 86, 208, 0.12);
		transform: translateY(-2px);
	}

	.auth-feature-strip {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.auth-card-head {
		display: grid;
		gap: 0.4rem;
	}

	.auth-form {
		display: grid;
		gap: 1rem;
	}

	.field {
		display: grid;
		gap: 0.45rem;
	}

	.field span {
		font-size: 0.85rem;
		font-weight: 700;
		color: #293145;
	}

	.field input,
	.field select {
		min-height: 3rem;
		padding: 0 0.95rem;
		border-radius: 14px;
		border: 1px solid #d9e2f1;
		background: #f9fbff;
	}

	.auth-submit {
		min-height: 3.1rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #0f4fca 0%, #003d9b 100%);
		color: white;
		font-weight: 800;
		box-shadow: 0 18px 34px rgba(12, 86, 208, 0.24);
	}

	.auth-foot {
		display: grid;
		gap: 0.75rem;
		padding-top: 0.5rem;
		border-top: 1px solid rgba(115, 118, 133, 0.12);
	}

	.auth-placeholder {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		font-weight: 700;
		color: #003d9b;
	}

	.auth-error {
		padding: 0.8rem 0.95rem;
		border-radius: 14px;
		background: rgba(186, 26, 26, 0.08);
		color: #ba1a1a;
		font-weight: 700;
	}

	@media (max-width: 900px) {
		.auth-shell {
			padding: 1rem;
		}

		.auth-grid,
		.auth-role-grid,
		.auth-feature-strip {
			grid-template-columns: 1fr;
		}

		.auth-hero,
		.auth-card {
			padding: 1.35rem;
		}
	}
</style>
