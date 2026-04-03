<script lang="ts">
	import Panel from '../ui/Panel.svelte';
	import ProgressList from '../ui/ProgressList.svelte';
	import StatsGrid from '../ui/StatsGrid.svelte';
	import StatusBadge from '../ui/StatusBadge.svelte';

	export let dashboard: any;
	export let visibleModules: any[] = [];
	export let activeRole = 'hrd';
	export let featuredPayslip: any = null;
	export let leaveBalances: any[] = [];
	export let requests: any[] = [];
	export let attendanceRows: any[] = [];
	export let overtimeRows: any[] = [];
	export let statusActionLabel = 'Check Out';
	export let onStatusAction: () => void = () => {};
	export let onViewCalendar: () => void = () => {};
	export let onDownloadPayslip: () => void = () => {};
	export let onRequestActions: () => void = () => {};
	export let onCreateRequest: () => void = () => {};

	function formatTimeLabel(value = '') {
		const [hours = '', minutes = '00'] = value.split(':');
		const parsedHours = Number(hours);

		if (Number.isNaN(parsedHours)) {
			return value || '--:--';
		}

		const suffix = parsedHours >= 12 ? 'PM' : 'AM';
		const normalizedHours = ((parsedHours + 11) % 12) + 1;

		return `${String(normalizedHours).padStart(2, '0')}:${minutes} ${suffix}`;
	}

	function isPendingStatus(status = '') {
		return /pending|menunggu|waiting/i.test(status);
	}

	$: latestAttendance = attendanceRows[0] ?? {
		date: 'Today',
		checkIn: '08:45',
		checkOut: '-',
		status: 'On duty',
		tone: 'green'
	};

	$: requestItems = [
		...requests.map((request) => ({
			title: request.type,
			subtitle: request.reason,
			detail: request.period,
			status: request.status,
			tone: request.tone,
			icon: request.type?.toLowerCase().includes('sick') ? 'medical_services' : 'event_note'
		})),
		...overtimeRows.map((row) => ({
			title: `Overtime (${row.duration})`,
			subtitle: row.reason,
			detail: row.date,
			status: row.status,
			tone: row.tone,
			icon: 'timer'
		}))
	].slice(0, 3);

	$: pendingRequestCount = requestItems.filter((item) => isPendingStatus(item.status)).length;
	$: employeeQuickCards = [
		{
			label: 'Remaining Leave',
			value: leaveBalances[0]?.value ?? '8 Days',
			meta: leaveBalances[0]?.note ?? 'Annual allocation',
			icon: 'calendar_month',
			tone: 'blue',
			progress: 58
		},
		{
			label: 'Attendance Streak',
			value: '15 Days',
			meta: 'Keep it up!',
			icon: 'bolt',
			tone: 'green',
			progress: 0
		},
		{
			label: 'Pending Requests',
			value: `${pendingRequestCount || 1} Request${pendingRequestCount === 1 ? '' : 's'}`,
			meta: 'View details',
			icon: 'work_history',
			tone: 'amber',
			progress: 0
		}
	];

	$: payslipPeriod =
		featuredPayslip?.title?.replace(/^Slip gaji\s*/i, '') ??
		featuredPayslip?.eyebrow ??
		'Latest payslip';
	$: hasCheckedOut = latestAttendance.checkOut && latestAttendance.checkOut !== '-';
	$: statusTimeLabel = hasCheckedOut
		? formatTimeLabel(latestAttendance.checkOut)
		: formatTimeLabel(latestAttendance.checkIn);
</script>

{#if activeRole === 'employee'}
	<section class="employee-dashboard-grid">
		<div class="employee-dashboard-main">
			<article class="dashboard-status-card">
				<div class="status-card-copy">
					<span class="eyebrow">Current Status</span>
					<strong class="status-time">{statusTimeLabel}</strong>
					<p class="status-copy">
						<span class="status-dot"></span>
						{#if hasCheckedOut}
							Checked Out at {formatTimeLabel(latestAttendance.checkOut)}
						{:else}
							Checked In Since {formatTimeLabel(latestAttendance.checkIn)}
						{/if}
					</p>
				</div>

				<button type="button" class="button-primary status-action-button" on:click={onStatusAction}>
					<span class="material-symbols-outlined">logout</span>
					<span>{statusActionLabel}</span>
				</button>
			</article>

			<div class="dashboard-quick-grid">
				{#each employeeQuickCards as card}
					<article class="dashboard-quick-card">
						<div class={`quick-icon ${card.tone}`}>
							<span class="material-symbols-outlined">{card.icon}</span>
						</div>
						<p class="quick-label">{card.label}</p>
						<strong class="quick-value">{card.value}</strong>

						{#if card.progress > 0}
							<div class="quick-progress">
								<span class={`quick-progress-fill ${card.tone}`} style={`width: ${card.progress}%`}></span>
							</div>
						{/if}

						<p class={`quick-meta ${card.tone}`}>{card.meta}</p>
					</article>
				{/each}
			</div>

			<section class="dashboard-history-card">
				<div class="dashboard-card-head">
					<h3>Attendance History</h3>
					<button type="button" class="inline-link" on:click={onViewCalendar}>View Full Calendar</button>
				</div>

				<div class="history-table">
					<div class="history-table-head">
						<span>Date</span>
						<span>Check In</span>
						<span>Check Out</span>
						<span>Status</span>
					</div>

					{#each attendanceRows.slice(0, 3) as row}
						<div class="history-table-row">
							<strong>{row.date}</strong>
							<span>{formatTimeLabel(row.checkIn)}</span>
							<span>{row.checkOut === '-' ? '--:--' : formatTimeLabel(row.checkOut)}</span>
							<StatusBadge tone={row.tone} label={row.status === 'Hadir' ? 'On duty' : row.status} />
						</div>
					{/each}
				</div>
			</section>
		</div>

		<div class="employee-dashboard-side">
			<aside class="dashboard-payslip-card">
				<div class="payslip-card-head">
					<span class="eyebrow light">Latest Payslip</span>
					<span class="material-symbols-outlined">account_balance_wallet</span>
				</div>
				<p class="payslip-period">{payslipPeriod}</p>
				<strong class="payslip-amount">{featuredPayslip?.amount ?? '$0.00'}</strong>
				<p class="payslip-copy">{featuredPayslip?.meta ?? 'Take-home pay final sudah tersedia.'}</p>
				<button type="button" class="payslip-download-button" on:click={onDownloadPayslip}>
					<span class="material-symbols-outlined">download</span>
					<span>Download PDF</span>
				</button>
			</aside>

			<aside class="dashboard-request-card">
				<div class="dashboard-card-head">
					<h3>My Requests</h3>
					<button
						type="button"
						class="icon-button subtle"
						aria-label="More request actions"
						on:click={onRequestActions}
					>
						<span class="material-symbols-outlined">more_horiz</span>
					</button>
				</div>

				<div class="request-list">
					{#each requestItems as item}
						<div class="request-item">
							<div class={`request-icon ${item.tone}`}>
								<span class="material-symbols-outlined">{item.icon}</span>
							</div>
							<div class="request-content">
								<div class="request-line">
									<strong>{item.title}</strong>
									<StatusBadge tone={item.tone} label={item.status} />
								</div>
								<p>{item.subtitle}</p>
								<small>{item.detail}</small>
							</div>
						</div>
					{/each}
				</div>

				<button type="button" class="request-create-button" on:click={onCreateRequest}>
					+ Create New Request
				</button>
			</aside>

			<aside class="dashboard-quote-card">
				<div class="quote-thumb"></div>
				<p>
					"Success is not final, failure is not fatal: it is the courage to continue that
					counts."
				</p>
			</aside>
		</div>
	</section>
{:else}
	<StatsGrid stats={dashboard.stats} />

	<section class="content-grid">
		<Panel title="Fokus operasional" meta="Hari ini">
			<div class="stack">
				{#each dashboard.focus as item}
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

		<Panel title="Queue & next action" meta="Approval center">
			<div class="stack">
				{#each dashboard.queue as item}
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
	</section>

	<section class="content-grid">
		<Panel title="Modul yang tersedia" meta="Role access">
			<div class="module-grid">
				{#each visibleModules as module}
					<div class="module-tile">
						<span class="material-symbols-outlined">{module.icon}</span>
						<div>
							<strong>{module.label}</strong>
							<p>{module.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</Panel>

		<Panel title="KPI implementasi" meta="Operational health">
			<ProgressList items={dashboard.insights} />
		</Panel>
	</section>
{/if}
