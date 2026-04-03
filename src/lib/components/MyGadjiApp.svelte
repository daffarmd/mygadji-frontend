<script lang="ts">
	import type { AppRole } from '$lib/auth/roles';
	import {
		attendanceFocus,
		attendanceHighlights,
		attendanceTrend,
		bossApprovals,
		dashboardContent,
		employeeDirectory,
		featuredPayslipByRole,
		formatCurrency,
		hrdApprovals,
		leaveBalancesByRole,
		leaveFlow,
		modules,
		overtimeSummaryByRole,
		payslipDetailsByRole,
		personalAttendanceRows,
		personalLeaveRequests,
		personalOvertimeRows,
		personalPayslips,
		reportCadence,
		reportCards,
		reportKpisByRole,
		roleAccess,
		roles,
		teamAttendanceRows,
		teamLeaveRequests,
		teamOvertimeRows,
		teamPayslips
	} from '$lib/mygadji-data';
	import './app/mygadji-app.css';
	import AppSidebar from './app/AppSidebar.svelte';
	import AppTopbar from './app/AppTopbar.svelte';
	import Panel from './app/ui/Panel.svelte';
	import SectionHeader from './app/SectionHeader.svelte';
	import ApprovalsSection from './app/sections/ApprovalsSection.svelte';
	import AttendanceSection from './app/sections/AttendanceSection.svelte';
	import DashboardSection from './app/sections/DashboardSection.svelte';
	import EmployeesSection from './app/sections/EmployeesSection.svelte';
	import LeaveSection from './app/sections/LeaveSection.svelte';
	import OvertimeSection from './app/sections/OvertimeSection.svelte';
	import PayslipsSection from './app/sections/PayslipsSection.svelte';
	import PayrollSection from './app/sections/PayrollSection.svelte';
	import ProfileSection from './app/sections/ProfileSection.svelte';
	import ReportsSection from './app/sections/ReportsSection.svelte';

	type ModuleId =
		| 'dashboard'
		| 'employees'
		| 'attendance'
		| 'leave'
		| 'overtime'
		| 'approvals'
		| 'payroll'
		| 'payslips'
		| 'reports'
		| 'profile';
	type Tone = 'blue' | 'green' | 'amber' | 'red' | 'slate';
	type PrototypeMessage = { title: string; detail: string; tag: string; tone: Tone };
	type NotificationItem = {
		id: string;
		title: string;
		body: string;
		category: 'approval' | 'payroll' | 'attendance' | 'leave' | 'overtime' | 'system';
		priority: 'high' | 'medium' | 'low';
		is_read: boolean;
		created_at: string;
		target_module: ModuleId;
		target_id: string;
		action_label: string;
		needs_action: boolean;
		tone: Tone;
	};
	type QuickAction = { id: string; label: string; detail: string; moduleId: ModuleId; tone: Tone };

	export let role: AppRole = 'hrd';

	const organizations = [
		{ label: 'Gadjianku HQ', detail: 'Operational workspace', tone: 'blue' as Tone },
		{ label: 'Design Sandbox', detail: 'Prototype playground', tone: 'green' as Tone },
		{ label: 'Executive Review', detail: 'Leadership snapshot', tone: 'amber' as Tone }
	];

	const roleProfiles = {
		hrd: {
			address: 'Jl. Sultan Agung No. 18, Jakarta',
			phone: '0812-1000-2000',
			bank: 'BCA',
			account: '9001234567',
			emergencyName: 'Nadia Prameswari',
			emergencyPhone: '0812-3111-2233'
		},
		boss: {
			address: 'Jl. Wijaya Timur No. 4, Jakarta',
			phone: '0813-9000-1111',
			bank: 'Mandiri',
			account: '1000788459',
			emergencyName: 'Lina Hartati',
			emergencyPhone: '0813-8811-2299'
		},
		employee: {
			address: 'Jl. Cempaka Putih No. 29, Jakarta',
			phone: '0812-7788-9911',
			bank: 'BCA',
			account: '7009954421',
			emergencyName: 'Danu Pratama',
			emergencyPhone: '0812-9090-1112'
		}
	};

	let activeModule: ModuleId = 'dashboard';
	let viewportWidth = 1440;
	let isSidebarOpen = true;
	let isSidebarCollapsed = true;
	let previousIsMobile: boolean | null = null;
	let prototypeSeed = '';

	let searchQuery = '';
	let isNotificationCenterOpen = false;
	let isOrganizationMenuOpen = false;
	let isQuickActionOpen = false;
	let activeOrganizationIndex = 0;
	let selectedReportId = '';
	let prototypeMessage: PrototypeMessage | null = null;
	let notificationFilter: 'all' | 'unread' | 'needs_action' = 'all';

	let employeesState: any[] = [];
	let employeeFilters = { query: '', division: 'all', status: 'all' };
	let employeeForm: any = {};
	let employeeDocumentDraft = { name: '', type: '', expires_at: '' };
	let selectedEmployeeId = '';

	let leaveRequestsState: any[] = [];
	let selectedLeaveRequestId = '';
	let leaveForm: any = {};

	let overtimeRowsState: any[] = [];
	let selectedOvertimeId = '';
	let overtimeForm: any = {};

	let approvalsState: any[] = [];
	let selectedApprovalId = '';
	let approvalForm: any = {};

	let personalAttendanceState: any[] = [];
	let teamAttendanceState: any[] = [];
	let attendanceCorrectionForm: any = {};

	let payrollPeriodsState: any[] = [];
	let selectedPayrollPeriodId = '';
	let payrollRowsState: any[] = [];
	let selectedPayrollRowId = '';
	let payrollPeriodForm: any = {};
	let payrollAdjustmentForm: any = {};

	let teamPayslipsState: any[] = [];
	let employeePayslipsState: any[] = [];
	let selectedEmployeePayslipId = '';
	let payslipPublicationForm: any = {};

	let profileState: any = {};
	let bankVerificationState = 'Verified';
	let notificationItems: NotificationItem[] = [];

	$: activeRoleProfile = roles.find((entry) => entry.id === role) ?? roles[0];
	$: displayRoleProfile = { ...activeRoleProfile, userName: profileState.full_name ?? activeRoleProfile.userName };
	$: visibleModules = modules.filter((module) => roleAccess[role].includes(module.id));
	$: currentModule = visibleModules.find((module) => module.id === activeModule) ?? visibleModules[0] ?? modules[0];
	$: isMobile = viewportWidth <= 1080;
	$: currentDashboard = dashboardContent[role];
	$: activeOrganization = organizations[activeOrganizationIndex] ?? organizations[0];
	$: currentLeaveBalances = leaveBalancesByRole[role];
	$: currentOvertimeSummary = overtimeSummaryByRole[role];
	$: currentAttendanceFocus = role === 'employee' ? buildEmployeeAttendanceFocus() : attendanceFocus[role];
	$: currentAttendanceHighlights = attendanceHighlights[role];
	$: currentAttendanceRows = role === 'employee' ? personalAttendanceState : teamAttendanceState;
	$: employeeHasCheckedOut = role === 'employee' && Boolean(personalAttendanceState[0]?.checkOut && personalAttendanceState[0]?.checkOut !== '-');
	$: dashboardStatusActionLabel = employeeHasCheckedOut ? 'View Attendance' : 'Check Out';
	$: filteredEmployees = filterEmployees(employeesState, employeeFilters);
	$: employeeStats = buildEmployeeStats(employeesState);
	$: contractAlerts = buildContractAlerts(employeesState);
	$: importSummary = { rows: employeesState.length, note: 'Template CSV siap dipakai untuk onboarding batch awal.' };
	$: currentApprovalMetrics = role === 'employee' ? [] : buildApprovalMetrics(role, approvalsState);
	$: currentPayrollBreakdown = buildPayrollBreakdown(payrollRowsState);
	$: currentPayrollMetrics = buildPayrollMetrics(role, payrollPeriodsState, selectedPayrollPeriodId, payrollRowsState);
	$: currentPayrollStages = buildPayrollStages(selectedPayrollPeriod?.status ?? 'review');
	$: selectedPayrollPeriod = payrollPeriodsState.find((period) => period.id === selectedPayrollPeriodId) ?? payrollPeriodsState[0] ?? null;
	$: dashboardFeaturedPayslip = role === 'employee' ? employeePayslipsState[0] ?? featuredPayslipByRole.employee : buildHrdFeaturedPayslip();
	$: selectedEmployeePayslip = employeePayslipsState.find((slip) => slip.id === selectedEmployeePayslipId) ?? employeePayslipsState[0] ?? null;
	$: currentPayslipFeatured = role === 'employee' ? selectedEmployeePayslip ?? featuredPayslipByRole.employee : buildHrdFeaturedPayslip();
	$: currentPayslipDetails = role === 'employee' ? selectedEmployeePayslip?.details ?? payslipDetailsByRole.employee : buildHrdPayslipDetails(teamPayslipsState);
	$: currentPayslips = role === 'employee' ? employeePayslipsState : teamPayslipsState;
	$: currentReportKpis = role === 'boss' ? reportKpisByRole.boss : reportKpisByRole.hrd;
	$: publicationPeriods = payrollPeriodsState.map((period) => period.period_label);
	$: selectedReport = reportCards.find((report) => report.id === selectedReportId) ?? null;
	$: unreadNotificationCount = notificationItems.filter((item) => !item.is_read).length;
	$: needsActionNotificationCount = notificationItems.filter((item) => item.needs_action).length;
	$: filteredNotificationItems = notificationItems.filter((item) => notificationFilter === 'all' ? true : notificationFilter === 'unread' ? !item.is_read : item.needs_action);
	$: quickActions = getQuickActions(role);
	$: primarySidebarActionLabel = quickActions[0]?.label ?? 'New Request';
	$: profilePendingLabel = bankVerificationState === 'Pending verification' ? 'Bank update pending' : '';
	$: if (previousIsMobile === null || isMobile !== previousIsMobile) {
		isSidebarOpen = !isMobile;
		isSidebarCollapsed = !isMobile;
		previousIsMobile = isMobile;
	}
	$: if (prototypeSeed !== role) {
		resetPrototypeState(role);
		prototypeSeed = role;
	}
	$: if (!visibleModules.some((module) => module.id === activeModule)) {
		activeModule = (visibleModules[0]?.id ?? 'dashboard') as ModuleId;
	}

	function n(value: any) {
		const parsed = Number(value ?? 0);
		if (Number.isFinite(parsed)) return parsed;
		const cleaned = String(value ?? '').replace(/[^\d.-]/g, '');
		const fallback = Number(cleaned);
		return Number.isFinite(fallback) ? fallback : 0;
	}

	function formatPercent(value: number) {
		return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
	}

	function generateId(prefix: string) {
		return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
	}

	function setPrototypeMessage(title: string, detail: string, tone: Tone = 'blue', tag = 'Workspace') {
		prototypeMessage = { title, detail, tone, tag };
	}

	function pushNotification(title: string, body: string, config: Partial<Omit<NotificationItem, 'id' | 'title' | 'body' | 'is_read'>> = {}) {
		notificationItems = [
			{
				id: generateId('notif'),
				title,
				body,
				is_read: false,
				category: config.category ?? 'system',
				priority: config.priority ?? 'low',
				created_at: config.created_at ?? 'Baru saja',
				target_module: config.target_module ?? 'dashboard',
				target_id: config.target_id ?? generateId('target'),
				action_label: config.action_label ?? 'Open',
				needs_action: config.needs_action ?? false,
				tone: config.tone ?? 'blue'
			},
			...notificationItems
		].slice(0, 12);
	}

	/* HELPERS */
	function computeEmployeeCompleteness(employee: any) {
		const required = [
			'employee_id',
			'full_name',
			'national_id',
			'email',
			'phone_number',
			'address',
			'division',
			'position',
			'manager_id',
			'join_date',
			'base_salary',
			'bank_name',
			'bank_account_number',
			'bank_account_holder_name'
		];
		const filled = required.filter((field) => String(employee[field] ?? '').trim()).length;
		return formatPercent((filled / required.length) * 100);
	}

	function createEmployeeRecord(entry: any, index: number) {
		const employmentStatus =
			/Kontrak/i.test(entry.status) ? 'contract' : /Probation/i.test(entry.status) ? 'probation' : 'active';
		const employee = {
			id: entry.id,
			employee_id: entry.id,
			full_name: entry.name,
			national_id: `3174${String(index + 1).padStart(12, '0')}`,
			email: entry.name.toLowerCase().replace(/\s+/g, '.') + '@mygadji.id',
			phone_number: `0812${String(880000 + index * 173).padStart(6, '0')}`,
			address: 'Jakarta, Indonesia',
			division: entry.division,
			position: entry.position,
			manager_id: entry.manager.replace(/\s+/g, '-').toLowerCase(),
			manager_name: entry.manager,
			employment_status: employmentStatus,
			employment_type: employmentStatus === 'contract' ? 'Contract' : employmentStatus === 'probation' ? 'Probation' : 'Permanent',
			join_date: `2024-${String((index % 9) + 1).padStart(2, '0')}-0${(index % 5) + 1}`,
			contract_end_date: employmentStatus === 'contract' ? '2026-05-15' : '',
			base_salary: entry.salary,
			bank_name: index % 2 === 0 ? 'BCA' : 'Mandiri',
			bank_account_number: `88${String(10000000 + index * 14837)}`,
			bank_account_holder_name: entry.name,
			tax_id: `09.${String(10000000 + index * 239).padStart(8, '0')}.1-000.000`,
			bpjs_number: `BPJS-${String(90000 + index * 17)}`,
			payroll_group: entry.division === 'Operations' ? 'Monthly Ops' : 'Monthly HQ',
			documents: [
				{ id: `doc-contract-${index}`, name: 'Employment Contract', type: 'contract', expires_at: employmentStatus === 'contract' ? '2026-05-15' : '' },
				{ id: `doc-bank-${index}`, name: 'Bank Account', type: 'payroll', expires_at: '' }
			],
			notes: employmentStatus === 'probation' ? 'Perlu review setelah masa probation.' : ''
		};
		return { ...employee, completeness: computeEmployeeCompleteness(employee) };
	}

	function buildEmployees(entries: any[] = []) {
		return entries.map((entry, index) => createEmployeeRecord(entry, index));
	}

	function buildLeaveRecords(entries: any[] = []) {
		return entries.map((entry, index) => ({
			...entry,
			id: `leave-${index + 1}`,
			attachment: '',
			handover_notes: '',
			replacement_person_id: '',
			contact_during_leave: ''
		}));
	}

	function buildOvertimeRecords(entries: any[] = []) {
		return entries.map((entry, index) => ({
			...entry,
			id: `overtime-${index + 1}`,
			project_or_cost_center: entry.requester.includes('Maya') ? 'Design Ops' : 'Engineering Sprint',
			requested_by: entry.requester,
			supervisor_id: 'mgr-001',
			attachment: '',
			payroll_eligible: true,
			notes: ''
		}));
	}

	function buildApprovalRecords(entries: any[] = [], prefix = 'approval') {
		return entries.map((entry, index) => {
			const isPayroll = /payroll/i.test(entry.title);
			const isLeave = /cuti|leave|izin/i.test(entry.title);
			const priority: 'high' | 'medium' | 'low' = entry.tone === 'red' ? 'high' : entry.tone === 'amber' ? 'medium' : 'low';
			return {
				...entry,
				id: `${prefix}-${index + 1}`,
				moduleId: isPayroll ? 'payroll' : isLeave ? 'leave' : 'overtime',
				category: isPayroll ? 'payroll' : isLeave ? 'leave' : 'overtime',
				approval_target_type: isPayroll ? 'payroll_period' : isLeave ? 'leave_request' : 'overtime_request',
				approval_target_id: `${isPayroll ? 'payroll' : isLeave ? 'leave' : 'overtime'}-seed-${index + 1}`,
				priority,
				sla: priority === 'high' ? 'SLA merah' : priority === 'medium' ? 'SLA aktif' : 'Low priority',
				needs_action: !/approved|rejected/i.test(entry.status)
			};
		});
	}

	function buildPeriodSeed() {
		return [
			{ id: 'period-apr-2026', period_label: 'April 2026', period_start: '2026-04-01', period_end: '2026-04-30', payment_date: '2026-05-01', payroll_group: 'Monthly HQ', cutoff_attendance_date: '2026-04-28', cutoff_overtime_date: '2026-04-29', status: 'review', notes: 'Final check tunjangan sales dan approval owner.' },
			{ id: 'period-mar-2026', period_label: 'Maret 2026', period_start: '2026-03-01', period_end: '2026-03-31', payment_date: '2026-04-01', payroll_group: 'Monthly HQ', cutoff_attendance_date: '2026-03-29', cutoff_overtime_date: '2026-03-30', status: 'published', notes: 'Batch slip sudah dipublikasikan.' }
		];
	}

	function buildPayrollRowsSeed() {
		return [
			{ name: 'Nadia Prameswari', base: 12500000, allowance: 1800000, overtime: 0, deduction: 350000, total: 13950000, status: 'Ready' },
			{ name: 'Dimas Pratama', base: 9800000, allowance: 1250000, overtime: 950000, deduction: 200000, total: 11800000, status: 'Ready' },
			{ name: 'Elena Rodriguez', base: 8900000, allowance: 900000, overtime: 0, deduction: 175000, total: 9625000, status: 'Needs review' },
			{ name: 'Farhan Naufal', base: 7200000, allowance: 800000, overtime: 425000, deduction: 145000, total: 8280000, status: 'Ready' }
		].map((row, index) => ({ ...row, id: `payrow-${index + 1}`, bonus: 0, adjustments: [] }));
	}

	function buildProfileSeed(selectedRole: AppRole, profileName: string) {
		const base = roleProfiles[selectedRole];
		return {
			full_name: profileName,
			email: profileName.toLowerCase().replace(/\s+/g, '.') + '@mygadji.id',
			phone_number: base.phone,
			address: base.address,
			emergency_contact_name: base.emergencyName,
			emergency_contact_phone: base.emergencyPhone,
			bank_name: base.bank,
			bank_account_number: base.account,
			bank_account_holder_name: profileName,
			password_current: '',
			password_new: '',
			password_confirm: '',
			notification_in_app: true,
			notification_email: selectedRole !== 'employee',
			reviewer_id: selectedRole === 'employee' ? 'hrd-review' : 'owner-review'
		};
	}

	function createEmployeeForm() {
		const empty = {
			employee_id: '',
			full_name: '',
			national_id: '',
			email: '',
			phone_number: '',
			address: '',
			division: '',
			position: '',
			manager_id: '',
			manager_name: '',
			employment_status: 'active',
			employment_type: 'Permanent',
			join_date: '2026-04-04',
			contract_end_date: '',
			base_salary: '',
			bank_name: '',
			bank_account_number: '',
			bank_account_holder_name: '',
			tax_id: '',
			bpjs_number: '',
			payroll_group: 'Monthly HQ',
			documents: [],
			notes: ''
		};
		return { ...empty, completeness: computeEmployeeCompleteness(empty) };
	}

	function createLeaveForm(userName: string) {
		return { request_type: 'leave', leave_category: 'Annual leave', start_date: '2026-04-10', end_date: '2026-04-10', duration_type: 'full_day', half_day_session: 'Morning', reason: '', attachment: '', handover_notes: '', replacement_person_id: '', contact_during_leave: '', requester: userName };
	}

	function createOvertimeForm(userName: string) {
		return { request_date: '2026-04-04', start_time: '18:00', end_time: '20:00', duration_hours: '2', reason: '', project_or_cost_center: '', requested_by: userName, supervisor_id: 'mgr-001', attachment: '', payroll_eligible: true, notes: '' };
	}

	function createApprovalForm() {
		return { approval_note: '', effective_date: '2026-04-04', escalation_flag: false, override_reason: '' };
	}

	function createAttendanceCorrectionForm() {
		return { attendance_date: '2026-04-04', issue_type: 'Forgot check-out', actual_check_in: '08:05', actual_check_out: '17:12', reason: '', attachment: '', reviewer_id: 'hrd-review' };
	}

	function createPayrollPeriodForm() {
		return { period_label: 'Mei 2026', period_start: '2026-05-01', period_end: '2026-05-31', payment_date: '2026-06-01', payroll_group: 'Monthly HQ', cutoff_attendance_date: '2026-05-29', cutoff_overtime_date: '2026-05-30', status: 'draft', notes: '' };
	}

	function createPayrollAdjustmentForm(userName: string) {
		return { component_type: 'allowance', component_name: '', amount: '', calculation_mode: 'fixed', taxable_flag: 'true', description: '', attachment: '', created_by: userName };
	}

	function createPayslipPublicationForm(periodLabel = 'April 2026') {
		return { period_id: periodLabel, employee_scope: 'Semua finalized employee', publish_mode: 'batch', publish_date: '2026-04-04', delivery_channel: 'in_app', include_pdf: true, note_to_employee: 'Slip tersedia di MyGadji dan siap diunduh.' };
	}

	function filterEmployees(entries: any[], filters: any) {
		return entries.filter((employee) => {
			const query = String(filters.query ?? '').trim().toLowerCase();
			const queryMatch = query ? `${employee.full_name} ${employee.email} ${employee.employee_id}`.toLowerCase().includes(query) : true;
			const divisionMatch = filters.division && filters.division !== 'all' ? employee.division === filters.division : true;
			const statusMatch = filters.status && filters.status !== 'all' ? employee.employment_status === filters.status : true;
			return queryMatch && divisionMatch && statusMatch;
		});
	}

	function buildEmployeeStats(entries: any[]) {
		const activeCount = entries.filter((employee) => employee.employment_status === 'active').length;
		const contractCount = entries.filter((employee) => employee.employment_status === 'contract').length;
		const highCompleteness = entries.length ? Math.round((entries.filter((employee) => n(employee.completeness) >= 90).length / entries.length) * 100) : 0;
		return [
			{ label: 'Karyawan aktif', value: String(activeCount), note: `${contractCount} kontrak, sisanya aktif permanen`, tone: 'blue' as Tone },
			{ label: 'Kontrak mendekati habis', value: String(buildContractAlerts(entries).length), note: 'Perlu review sebelum payroll berikutnya', tone: 'amber' as Tone },
			{ label: 'Profil lengkap > 90%', value: `${highCompleteness}%`, note: 'Pantau bank, NPWP, dan dokumen payroll', tone: 'green' as Tone }
		];
	}

	function buildContractAlerts(entries: any[]) {
		return entries.filter((employee) => employee.contract_end_date || employee.documents?.some((doc: any) => doc.expires_at)).slice(0, 4).map((employee) => ({
			title: employee.full_name,
			meta: employee.contract_end_date ? `Kontrak berakhir ${employee.contract_end_date}` : 'Dokumen payroll perlu diperbarui',
			badge: employee.contract_end_date ? 'Contract' : 'Document',
			tone: employee.contract_end_date ? 'amber' : 'blue'
		}));
	}

	function buildApprovalMetrics(selectedRole: AppRole, approvals: any[]) {
		const pending = approvals.filter((item) => item.needs_action).length;
		const high = approvals.filter((item) => item.priority === 'high' && item.needs_action).length;
		return selectedRole === 'boss'
			? [
					{ label: 'Butuh keputusan owner', value: String(pending), note: `${high} item prioritas tinggi`, tone: 'amber' as Tone },
					{ label: 'Dampak budget', value: formatCurrency(15600000), note: 'Akumulasi item di inbox approval', tone: 'blue' as Tone },
					{ label: 'Operasional berisiko', value: `${high} item`, note: 'Escalate jika catatan belum lengkap', tone: 'green' as Tone }
				]
			: [
					{ label: 'Menunggu approval', value: String(pending), note: `${high} masuk SLA merah`, tone: 'amber' as Tone },
					{ label: 'Selesai hari ini', value: String(Math.max(0, approvals.length - pending)), note: 'Keputusan tersimpan di inbox aksi', tone: 'green' as Tone },
					{ label: 'Avg. response time', value: pending > 5 ? '1,2 hari' : '0,8 hari', note: 'Target di bawah 1 hari', tone: 'blue' as Tone }
				];
	}

	function buildPayrollBreakdown(rows: any[]) {
		const base = rows.reduce((total, row) => total + n(row.base), 0);
		const allowance = rows.reduce((total, row) => total + n(row.allowance), 0);
		const bonus = rows.reduce((total, row) => total + n(row.bonus), 0);
		const overtime = rows.reduce((total, row) => total + n(row.overtime), 0);
		const deduction = rows.reduce((total, row) => total + n(row.deduction), 0);
		const gross = Math.max(1, base + allowance + bonus + overtime);
		const share = (value: number) => Math.max(8, Math.round((value / gross) * 100));
		return [
			{ label: 'Gaji pokok', value: formatCurrency(base), share: share(base), tone: 'blue' as Tone },
			{ label: 'Tunjangan', value: formatCurrency(allowance), share: share(allowance), tone: 'green' as Tone },
			{ label: 'Bonus', value: formatCurrency(bonus), share: share(bonus), tone: 'slate' as Tone },
			{ label: 'Lembur', value: formatCurrency(overtime), share: share(overtime), tone: 'amber' as Tone },
			{ label: 'Potongan', value: formatCurrency(deduction), share: share(deduction), tone: 'red' as Tone }
		];
	}

	function buildPayrollMetrics(selectedRole: AppRole, periods: any[], currentPeriodId: string, rows: any[]) {
		const currentPeriod = periods.find((period) => period.id === currentPeriodId) ?? periods[0] ?? { period_label: '-' };
		const readyRows = rows.filter((row) => row.status === 'Ready').length;
		const totalPayroll = rows.reduce((total, row) => total + n(row.total), 0);
		return selectedRole === 'boss'
			? [
					{ label: 'Total payroll', value: formatCurrency(totalPayroll), note: `Periode ${currentPeriod.period_label}`, tone: 'blue' as Tone },
					{ label: 'Variance to budget', value: '+2,1%', note: 'Masih dalam ambang yang disetujui', tone: 'green' as Tone },
					{ label: 'Item belum final', value: `${rows.length - readyRows} komponen`, note: 'Mayoritas adjustment baru', tone: 'amber' as Tone }
				]
			: [
					{ label: 'Periode aktif', value: currentPeriod.period_label, note: `Status ${currentPeriod.status}`, tone: 'blue' as Tone },
					{ label: 'Karyawan terproses', value: `${readyRows} / ${rows.length}`, note: `${rows.length - readyRows} masih perlu review`, tone: 'amber' as Tone },
					{ label: 'THP sementara', value: formatCurrency(totalPayroll), note: 'Termasuk lembur dan adjustment terbaru', tone: 'green' as Tone }
				];
	}

	function buildPayrollStages(status: string) {
		const current = status ?? 'review';
		return [
			{ label: 'Drafting', note: 'Tarik data absensi dan lembur', state: current === 'draft' ? 'active' : ['review', 'awaiting_approval', 'finalized', 'published'].includes(current) ? 'done' : 'pending' },
			{ label: 'Review', note: 'Cek komponen gaji & potongan', state: current === 'review' ? 'active' : ['awaiting_approval', 'finalized', 'published'].includes(current) ? 'done' : 'pending' },
			{ label: 'Approval', note: 'Butuh persetujuan owner', state: current === 'awaiting_approval' ? 'active' : ['finalized', 'published'].includes(current) ? 'done' : 'pending' },
			{ label: 'Finalized', note: 'Publikasi slip gaji', state: ['finalized', 'published'].includes(current) ? 'active' : 'pending' }
		];
	}

	function buildHrdFeaturedPayslip() {
		const latestBatch = teamPayslipsState[0] ?? teamPayslips[0];
		const totalAmount = payrollRowsState.reduce((total, row) => total + n(row.total), 0);
		return {
			eyebrow: 'Batch slip payroll',
			title: latestBatch?.status === 'Published' ? 'Batch slip sudah dipublikasikan' : `${latestBatch?.subject ?? 'Payroll aktif'} siap dipublikasikan`,
			amount: formatCurrency(totalAmount || 684500000),
			meta: latestBatch?.status === 'Published' ? 'Batch terbaru sudah tersedia in-app dan PDF.' : 'Slip final siap dipublikasikan setelah approval dan validasi terakhir.',
			chips: ['In-app ready', latestBatch?.status ?? 'Draft', `${payrollRowsState.length} employee`]
		};
	}

	function buildHrdPayslipDetails(entries: any[]) {
		const latestBatch = entries[0];
		return [
			{ label: 'Batch terbaru', value: latestBatch?.subject ?? 'Belum ada batch' },
			{ label: 'Status batch', value: latestBatch?.status ?? 'Draft' },
			{ label: 'Total arsip', value: `${entries.length} batch` }
		];
	}

	function buildEmployeeAttendanceFocus() {
		const today = personalAttendanceState[0];
		return !today || today.checkOut === '-'
			? attendanceFocus.employee
			: {
					...attendanceFocus.employee,
					title: 'Absensi hari ini selesai',
					summary: `Check-in ${today.checkIn} WIB dan check-out ${today.checkOut} WIB sudah tercatat di workspace.`,
					primary: 'Lihat riwayat',
					secondary: 'Ajukan izin',
					badges: ['Shift lengkap', 'Jam kerja tercatat', 'Sync ready']
				};
	}

	function buildRequestPeriod(startDate: string, endDate: string, durationType: string, halfDaySession: string) {
		if (!startDate) return 'Tanggal belum diisi';
		if (durationType === 'half_day') return `${startDate} (${halfDaySession})`;
		return endDate && endDate !== startDate ? `${startDate} - ${endDate}` : startDate;
	}

	function calculateDurationHours(startTime: string, endTime: string) {
		if (!startTime || !endTime) return '';
		const [sh, sm] = startTime.split(':').map(Number);
		const [eh, em] = endTime.split(':').map(Number);
		const diff = Math.max(0, eh * 60 + em - (sh * 60 + sm));
		return String(Math.round((diff / 60) * 10) / 10);
	}

	function getQuickActions(selectedRole: AppRole): QuickAction[] {
		return selectedRole === 'employee'
			? [
					{ id: 'quick-permit', label: 'Ajukan izin', detail: 'Buka form cuti/izin dan isi request baru.', moduleId: 'leave', tone: 'amber' },
					{ id: 'quick-overtime', label: 'Ajukan lembur', detail: 'Buka form lembur dengan requester otomatis.', moduleId: 'overtime', tone: 'blue' },
					{ id: 'quick-payslip', label: 'Buka slip terbaru', detail: 'Lompat ke arsip slip gaji terakhir.', moduleId: 'payslips', tone: 'green' }
				]
			: selectedRole === 'boss'
				? [
						{ id: 'quick-approvals', label: 'Review approval', detail: 'Masuk ke inbox approval paling prioritas.', moduleId: 'approvals', tone: 'amber' },
						{ id: 'quick-payroll', label: 'Cek payroll', detail: 'Lihat periode payroll dan variance terbaru.', moduleId: 'payroll', tone: 'blue' },
						{ id: 'quick-attendance-risk', label: 'Pantau absensi', detail: 'Lihat divisi dengan risiko keterlambatan.', moduleId: 'attendance', tone: 'green' }
					]
				: [
						{ id: 'quick-employee', label: 'Tambah karyawan', detail: 'Buka form employee CRUD untuk data baru.', moduleId: 'employees', tone: 'blue' },
						{ id: 'quick-payroll', label: 'Proses payroll', detail: 'Masuk ke periode aktif dan adjustment terbaru.', moduleId: 'payroll', tone: 'green' },
						{ id: 'quick-publish', label: 'Publikasikan slip', detail: 'Buka form batch publication untuk payslip.', moduleId: 'payslips', tone: 'amber' }
					];
	}

	function buildNotificationFeed(selectedRole: AppRole, approvals: any[], payrollPeriods: any[], leaveRequests: any[], overtimeRows: any[], attendanceRows: any[]) {
		const items: NotificationItem[] = [];
		const approval = approvals.find((item) => item.needs_action);
		const period = payrollPeriods[0];
		const leaveItem = leaveRequests[0];
		const overtimeItem = overtimeRows[0];
		const attendance = attendanceRows[0];
		if (approval && selectedRole !== 'employee') items.push({ id: generateId('notif'), title: approval.title, body: `${approval.owner} | ${approval.impact}`, category: 'approval', priority: approval.priority, is_read: false, created_at: 'Baru saja', target_module: 'approvals', target_id: approval.id, action_label: 'Review approval', needs_action: true, tone: approval.tone });
		if (period && selectedRole !== 'employee') items.push({ id: generateId('notif'), title: `Payroll ${period.period_label}`, body: `Status periode saat ini ${period.status.replace(/_/g, ' ')}`, category: 'payroll', priority: period.status === 'review' ? 'medium' : 'low', is_read: false, created_at: 'Hari ini', target_module: 'payroll', target_id: period.id, action_label: 'Buka payroll', needs_action: period.status !== 'published', tone: period.status === 'published' ? 'green' : 'amber' });
		if (leaveItem) items.push({ id: generateId('notif'), title: selectedRole === 'employee' ? 'Status pengajuan cuti' : `Queue ${leaveItem.type}`, body: `${leaveItem.requester} | ${leaveItem.status}`, category: 'leave', priority: 'medium', is_read: false, created_at: '2 jam lalu', target_module: 'leave', target_id: leaveItem.id, action_label: 'Buka request', needs_action: /menunggu|waiting|pending/i.test(leaveItem.status), tone: leaveItem.tone });
		if (overtimeItem) items.push({ id: generateId('notif'), title: 'Update lembur', body: `${overtimeItem.requester} | ${overtimeItem.duration}`, category: 'overtime', priority: 'low', is_read: false, created_at: '4 jam lalu', target_module: 'overtime', target_id: overtimeItem.id, action_label: 'Buka lembur', needs_action: /menunggu|waiting|pending/i.test(overtimeItem.status), tone: overtimeItem.tone });
		if (attendance) items.push({ id: generateId('notif'), title: 'Attendance snapshot', body: selectedRole === 'employee' ? `${attendance.date} | ${attendance.status}` : `${attendance.name} | ${attendance.status}`, category: 'attendance', priority: 'low', is_read: false, created_at: 'Hari ini', target_module: 'attendance', target_id: selectedRole === 'employee' ? attendance.date : attendance.name, action_label: 'Open attendance', needs_action: false, tone: 'blue' });
		items.push({ id: generateId('notif'), title: 'Workspace prototype aktif', body: 'Form P0 dan notification center sekarang bisa diuji end-to-end.', category: 'system', priority: 'low', is_read: false, created_at: 'Baru saja', target_module: 'dashboard', target_id: 'workspace', action_label: 'Kembali ke dashboard', needs_action: false, tone: 'blue' });
		return items;
	}

	function createApprovalFromRecord(moduleId: ModuleId, targetId: string, title: string, owner: string, impact: string, category: 'leave' | 'overtime' | 'payroll', priority: 'high' | 'medium' | 'low' = 'medium') {
		return {
			id: generateId('approval'),
			title,
			owner,
			impact,
			status: 'Waiting review',
			tone: priority === 'high' ? 'red' : priority === 'medium' ? 'amber' : 'blue',
			moduleId,
			category,
			approval_target_type: moduleId === 'leave' ? 'leave_request' : moduleId === 'overtime' ? 'overtime_request' : 'payroll_period',
			approval_target_id: targetId,
			priority,
			sla: priority === 'high' ? 'SLA merah' : 'SLA aktif',
			needs_action: true
		};
	}

	function focusTarget(moduleId: ModuleId, targetId = '') {
		activeModule = moduleId;
		if (moduleId === 'employees' && targetId) handleSelectEmployee(targetId);
		if (moduleId === 'leave' && targetId) selectedLeaveRequestId = targetId;
		if (moduleId === 'overtime' && targetId) selectedOvertimeId = targetId;
		if (moduleId === 'approvals' && targetId) selectedApprovalId = targetId;
		if (moduleId === 'payroll' && targetId) selectedPayrollPeriodId = targetId;
		if (moduleId === 'payslips' && targetId) selectedEmployeePayslipId = targetId;
	}

	function syncApprovalSource(moduleId: ModuleId, targetId: string, decision: 'approve' | 'reject', note: string) {
		const status = decision === 'approve' ? 'Approved' : 'Rejected';
		const tone = decision === 'approve' ? 'green' : 'red';
		if (moduleId === 'leave') leaveRequestsState = leaveRequestsState.map((request) => request.id === targetId ? { ...request, status, tone, approval_note: note } : request);
		if (moduleId === 'overtime') overtimeRowsState = overtimeRowsState.map((row) => row.id === targetId ? { ...row, status, tone, approval_note: note } : row);
		if (moduleId === 'payroll') payrollPeriodsState = payrollPeriodsState.map((period) => period.id === targetId ? { ...period, status: decision === 'approve' ? 'finalized' : 'review', notes: note || period.notes } : period);
	}

	function resetPrototypeState(selectedRole: AppRole) {
		const seedRoleProfile = roles.find((entry) => entry.id === selectedRole) ?? roles[0];
		employeesState = buildEmployees(employeeDirectory);
		selectedEmployeeId = employeesState[0]?.employee_id ?? '';
		employeeFilters = { query: '', division: 'all', status: 'all' };
		employeeForm = { ...(employeesState[0] ?? createEmployeeForm()) };
		employeeDocumentDraft = { name: '', type: '', expires_at: '' };
		personalAttendanceState = personalAttendanceRows.map((entry) => ({ ...entry }));
		teamAttendanceState = teamAttendanceRows.map((entry) => ({ ...entry }));
		attendanceCorrectionForm = createAttendanceCorrectionForm();
		leaveRequestsState = buildLeaveRecords(selectedRole === 'employee' ? personalLeaveRequests : teamLeaveRequests);
		selectedLeaveRequestId = leaveRequestsState[0]?.id ?? '';
		leaveForm = createLeaveForm(seedRoleProfile.userName);
		overtimeRowsState = buildOvertimeRecords(selectedRole === 'employee' ? personalOvertimeRows : teamOvertimeRows);
		selectedOvertimeId = overtimeRowsState[0]?.id ?? '';
		overtimeForm = createOvertimeForm(seedRoleProfile.userName);
		approvalsState = buildApprovalRecords(selectedRole === 'boss' ? bossApprovals : hrdApprovals, selectedRole);
		selectedApprovalId = approvalsState[0]?.id ?? '';
		approvalForm = createApprovalForm();
		payrollPeriodsState = buildPeriodSeed();
		selectedPayrollPeriodId = payrollPeriodsState[0]?.id ?? '';
		payrollRowsState = buildPayrollRowsSeed();
		selectedPayrollRowId = payrollRowsState[0]?.id ?? '';
		payrollPeriodForm = createPayrollPeriodForm();
		payrollAdjustmentForm = createPayrollAdjustmentForm(seedRoleProfile.userName);
		teamPayslipsState = teamPayslips.map((entry, index) => ({ ...entry, id: `batch-${index + 1}` }));
		employeePayslipsState = personalPayslips.map((entry) => ({ ...entry, chips: [...(entry.chips ?? [])], details: (entry.details ?? []).map((detail: any) => ({ ...detail })) }));
		selectedEmployeePayslipId = employeePayslipsState[0]?.id ?? '';
		payslipPublicationForm = createPayslipPublicationForm(payrollPeriodsState[0]?.period_label);
		profileState = buildProfileSeed(selectedRole, seedRoleProfile.userName);
		bankVerificationState = 'Verified';
		notificationItems = buildNotificationFeed(selectedRole, approvalsState, payrollPeriodsState, leaveRequestsState, overtimeRowsState, selectedRole === 'employee' ? personalAttendanceState : teamAttendanceState);
		notificationFilter = 'all';
		activeOrganizationIndex = selectedRole === 'employee' ? 1 : selectedRole === 'boss' ? 2 : 0;
		searchQuery = '';
		isNotificationCenterOpen = false;
		isOrganizationMenuOpen = false;
		isQuickActionOpen = false;
		selectedReportId = '';
		prototypeMessage = { title: 'Workspace siap dipakai', detail: 'Form P0, profile, approval action, payroll adjustment, dan notification center sekarang aktif.', tag: 'Workspace', tone: 'blue' };
	}

	/* HANDLERS */
	function handleSelectModule(moduleId: string) {
		activeModule = moduleId as ModuleId;
		if (isMobile) isSidebarOpen = false;
	}

	function handleToggleSidebar() {
		if (isMobile) {
			isSidebarOpen = !isSidebarOpen;
			return;
		}
		isSidebarCollapsed = !isSidebarCollapsed;
	}

	function handleCloseSidebar() {
		if (isMobile) {
			isSidebarOpen = false;
			return;
		}
		isSidebarCollapsed = true;
	}

	function handleSearchInput(value: string) { searchQuery = value; }
	function handleToggleOrganizationMenu() {
		isOrganizationMenuOpen = !isOrganizationMenuOpen;
		isNotificationCenterOpen = false;
		isQuickActionOpen = false;
	}

	function handleSelectOrganization(index: number) {
		const organization = organizations[index];
		activeOrganizationIndex = index;
		isOrganizationMenuOpen = false;
		setPrototypeMessage(`Workspace berganti ke ${organization.label}`, `${organization.detail} sekarang menjadi konteks aktif.`, organization.tone, 'Organization');
		pushNotification('Organization switcher', `Workspace aktif berpindah ke ${organization.label}.`, { target_module: 'dashboard', target_id: organization.label, action_label: 'Kembali ke dashboard', tone: organization.tone });
	}

	function handleToggleNotifications() {
		isNotificationCenterOpen = !isNotificationCenterOpen;
		isOrganizationMenuOpen = false;
		isQuickActionOpen = false;
	}

	function handleOpenQuickActions() {
		isQuickActionOpen = !isQuickActionOpen;
		isNotificationCenterOpen = false;
		isOrganizationMenuOpen = false;
	}

	function handleOpenProfile() {
		focusTarget('profile');
	}

	function handlePrimarySidebarAction() {
		handleQuickAction(quickActions[0]?.id ?? '');
	}

	function handleQuickAction(actionId: string) {
		const action = quickActions.find((entry) => entry.id === actionId);
		if (!action) return;
		handleSelectModule(action.moduleId);
		isQuickActionOpen = false;
		if (actionId === 'quick-permit') leaveForm = { ...leaveForm, request_type: 'permit', leave_category: 'Permit' };
		if (actionId === 'quick-overtime') overtimeForm = { ...overtimeForm, requested_by: displayRoleProfile.userName };
		if (actionId === 'quick-payslip') selectedEmployeePayslipId = employeePayslipsState[0]?.id ?? selectedEmployeePayslipId;
		if (actionId === 'quick-employee') {
			selectedEmployeeId = '';
			employeeForm = createEmployeeForm();
		}
		if (actionId === 'quick-publish') payslipPublicationForm = createPayslipPublicationForm(selectedPayrollPeriod?.period_label);
		setPrototypeMessage(action.label, action.detail, action.tone, 'Quick action');
		pushNotification(action.label, `Aksi diarahkan ke modul ${action.moduleId}.`, { target_module: action.moduleId, target_id: generateId('action'), action_label: 'Open module', tone: action.tone });
	}

	function recordEmployeeCheckout(source: 'dashboard' | 'attendance') {
		const today = personalAttendanceState[0];
		if (!today) return;
		if (today.checkOut !== '-') {
			handleSelectModule('attendance');
			setPrototypeMessage('Check-out sudah tercatat', 'Riwayat attendance hari ini sudah lengkap.', 'blue', 'Attendance');
			return;
		}
		personalAttendanceState = [{ ...today, checkOut: '17:08', status: 'Hadir', tone: 'green' }, ...personalAttendanceState.slice(1)];
		setPrototypeMessage('Check-out tersimpan', `Absensi hari ini diperbarui dari ${source === 'dashboard' ? 'dashboard' : 'modul attendance'}.`, 'green', 'Attendance');
		pushNotification('Check-out tercatat', 'Jam pulang 17:08 WIB berhasil disimpan.', { category: 'attendance', target_module: 'attendance', target_id: personalAttendanceState[0]?.date ?? 'today', action_label: 'Open attendance', tone: 'green' });
	}

	function handleDashboardStatusAction() {
		if (role !== 'employee') return;
		if (employeeHasCheckedOut) {
			handleSelectModule('attendance');
			setPrototypeMessage('Riwayat attendance dibuka', 'Fokus berpindah ke modul attendance setelah check-out selesai.', 'blue', 'Attendance');
			return;
		}
		recordEmployeeCheckout('dashboard');
	}

	function handleViewAttendanceCalendar() {
		handleSelectModule('attendance');
		setPrototypeMessage('Attendance calendar dibuka', 'Workspace mengarahkan ke modul attendance untuk melihat histori lebih lengkap.', 'blue', 'Navigation');
	}

	function handleAttendancePrimaryAction() {
		if (role === 'employee') {
			if (employeeHasCheckedOut) {
				handleSelectModule('attendance');
				return;
			}
			recordEmployeeCheckout('attendance');
			return;
		}
		if (role === 'boss') {
			handleSelectModule('attendance');
			setPrototypeMessage('Review tim dibuka', 'Modul attendance menjadi fokus untuk evaluasi keterlambatan tim.', 'amber', 'Attendance');
			pushNotification('Attendance review', 'Tim prioritas siap direview dari modul attendance.', { category: 'attendance', priority: 'medium', target_module: 'attendance', target_id: 'team-risk', action_label: 'Open attendance', needs_action: true, tone: 'amber' });
			return;
		}
		setPrototypeMessage('Pengingat terkirim', 'Workspace mensimulasikan broadcast reminder ke karyawan yang belum lengkap absensinya.', 'green', 'Attendance');
		pushNotification('Reminder attendance', 'Queue pengingat absensi berhasil dibuat.', { category: 'attendance', target_module: 'attendance', target_id: 'reminder-queue', action_label: 'Open attendance', tone: 'green' });
	}

	function handleAttendanceSecondaryAction() {
		if (role === 'employee') {
			handleQuickAction('quick-permit');
			return;
		}
		const attendanceReport = reportCards.find((report) => report.id === 'report-attendance');
		if (attendanceReport) handleOpenReport(attendanceReport);
	}

	function handleAttendanceCorrectionFieldChange(field: string, value: string) {
		attendanceCorrectionForm = { ...attendanceCorrectionForm, [field]: value };
	}

	function handleSubmitAttendanceCorrection() {
		setPrototypeMessage('Koreksi absensi dikirim', 'Request attendance correction masuk ke review HR.', 'amber', 'Attendance');
		pushNotification('Attendance correction', 'Koreksi absensi baru menunggu review HR.', { category: 'attendance', priority: 'medium', target_module: 'attendance', target_id: attendanceCorrectionForm.attendance_date ?? 'attendance-correction', action_label: 'Open attendance', needs_action: true, tone: 'amber' });
		attendanceCorrectionForm = createAttendanceCorrectionForm();
	}

	function handleSelectEmployee(employeeId: string) {
		const employee = employeesState.find((entry) => entry.employee_id === employeeId);
		if (!employee) return;
		selectedEmployeeId = employeeId;
		employeeForm = { ...employee, documents: [...(employee.documents ?? [])] };
	}

	function handleEmployeeFilterChange(field: string, value: string) {
		if (field === 'export') {
			setPrototypeMessage('Export CSV dipicu', 'Prototype mensimulasikan export direktori karyawan berdasarkan filter aktif.', 'blue', 'Employee');
			pushNotification('Employee export', 'Export CSV direktori karyawan siap diproses.', { target_module: 'employees', target_id: 'employee-export', action_label: 'Open employee data', tone: 'blue' });
			return;
		}
		employeeFilters = { ...employeeFilters, [field]: value };
	}

	function handleEmployeeFieldChange(field: string, value: string) {
		const nextForm = { ...employeeForm, [field]: value };
		nextForm.completeness = computeEmployeeCompleteness(nextForm);
		employeeForm = nextForm;
	}

	function handleDocumentFieldChange(field: string, value: string) {
		employeeDocumentDraft = { ...employeeDocumentDraft, [field]: value };
	}

	function handleAttachDocument() {
		if (!employeeDocumentDraft.name || !employeeDocumentDraft.type) {
			setPrototypeMessage('Dokumen belum lengkap', 'Isi nama dan tipe dokumen sebelum menyimpan metadata.', 'amber', 'Employee');
			return;
		}
		const nextDocument = { id: generateId('doc'), ...employeeDocumentDraft };
		const nextDocuments = [...(employeeForm.documents ?? []), nextDocument];
		employeeForm = { ...employeeForm, documents: nextDocuments, completeness: computeEmployeeCompleteness({ ...employeeForm, documents: nextDocuments }) };
		if (selectedEmployeeId) employeesState = employeesState.map((employee) => employee.employee_id === selectedEmployeeId ? { ...employee, documents: nextDocuments, completeness: computeEmployeeCompleteness({ ...employee, documents: nextDocuments }) } : employee);
		employeeDocumentDraft = { name: '', type: '', expires_at: '' };
		setPrototypeMessage('Metadata dokumen ditambahkan', 'Dokumen baru tercatat pada profil karyawan aktif.', 'green', 'Employee');
	}

	function handleResetEmployee() {
		if (selectedEmployeeId) {
			handleSelectEmployee(selectedEmployeeId);
			return;
		}
		employeeForm = createEmployeeForm();
	}

	function handleToggleEmployeeStatus() {
		const targetId = selectedEmployeeId || employeeForm.employee_id;
		if (!targetId) return;
		const currentStatus = employeeForm.employment_status ?? 'active';
		const nextStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
		employeeForm = { ...employeeForm, employment_status: nextStatus };
		employeesState = employeesState.map((employee) => employee.employee_id === targetId ? { ...employee, employment_status: nextStatus } : employee);
		setPrototypeMessage('Status kerja diperbarui', `Status karyawan berubah menjadi ${nextStatus}.`, nextStatus === 'inactive' ? 'red' : 'green', 'Employee');
	}

	function handleSaveEmployee() {
		if (!employeeForm.employee_id || !employeeForm.full_name) {
			setPrototypeMessage('Field wajib belum lengkap', 'Employee ID dan nama lengkap wajib diisi sebelum menyimpan.', 'amber', 'Employee');
			return;
		}
		const normalizedEmployee = { ...employeeForm, manager_name: employeesState.find((employee) => employee.employee_id === employeeForm.manager_id)?.full_name ?? employeeForm.manager_name ?? displayRoleProfile.userName, base_salary: n(employeeForm.base_salary), documents: [...(employeeForm.documents ?? [])], completeness: computeEmployeeCompleteness(employeeForm) };
		const exists = employeesState.some((employee) => employee.employee_id === normalizedEmployee.employee_id);
		employeesState = exists ? employeesState.map((employee) => employee.employee_id === normalizedEmployee.employee_id ? normalizedEmployee : employee) : [normalizedEmployee, ...employeesState];
		selectedEmployeeId = normalizedEmployee.employee_id;
		employeeForm = { ...normalizedEmployee };
		setPrototypeMessage(exists ? 'Data karyawan diperbarui' : 'Karyawan baru ditambahkan', `${normalizedEmployee.full_name} sekarang masuk ke direktori dan status kelengkapan payroll.`, 'green', 'Employee');
		pushNotification(exists ? 'Employee updated' : 'Employee created', `${normalizedEmployee.full_name} tersimpan di employee data.`, { priority: exists ? 'low' : 'medium', target_module: 'employees', target_id: normalizedEmployee.employee_id, action_label: 'Open employee data', tone: 'green' });
	}

	function handleSelectLeaveRequest(requestId: string) { selectedLeaveRequestId = requestId; }
	function handleLeaveFieldChange(field: string, value: string) { leaveForm = { ...leaveForm, [field]: value }; }

	function handleSubmitLeaveRequest() {
		if (!leaveForm.reason || !leaveForm.start_date) {
			setPrototypeMessage('Form leave belum lengkap', 'Isi tanggal dan alasan sebelum mengirim pengajuan.', 'amber', 'Leave');
			return;
		}
		const request = { id: generateId('leave'), requester: displayRoleProfile.userName, type: leaveForm.request_type === 'sick' ? 'Sick Leave' : leaveForm.request_type === 'permit' ? 'Permit' : leaveForm.leave_category, period: buildRequestPeriod(leaveForm.start_date, leaveForm.end_date, leaveForm.duration_type, leaveForm.half_day_session), reason: leaveForm.reason, status: 'Menunggu Manager', tone: 'amber', attachment: leaveForm.attachment, handover_notes: leaveForm.handover_notes, replacement_person_id: leaveForm.replacement_person_id, contact_during_leave: leaveForm.contact_during_leave };
		leaveRequestsState = [request, ...leaveRequestsState];
		selectedLeaveRequestId = request.id;
		leaveForm = createLeaveForm(displayRoleProfile.userName);
		approvalsState = [createApprovalFromRecord('leave', request.id, `${request.type} - ${request.requester}`, request.requester, request.period, 'leave'), ...approvalsState];
		setPrototypeMessage('Pengajuan leave terkirim', 'Request cuti/izin baru masuk ke queue approval.', 'green', 'Leave');
		pushNotification('Leave request dibuat', `${request.type} ${request.period} menunggu manager.`, { category: 'leave', priority: 'medium', target_module: 'leave', target_id: request.id, action_label: 'Buka request', needs_action: true, tone: 'amber' });
	}

	function handleSelectOvertimeRow(rowId: string) { selectedOvertimeId = rowId; }

	function handleOvertimeFieldChange(field: string, value: string | boolean) {
		const nextForm = { ...overtimeForm, [field]: value };
		if (field === 'start_time' || field === 'end_time') nextForm.duration_hours = calculateDurationHours(String(nextForm.start_time), String(nextForm.end_time));
		overtimeForm = nextForm;
	}

	function handleSubmitOvertimeRequest() {
		if (!overtimeForm.reason || !overtimeForm.request_date) {
			setPrototypeMessage('Form lembur belum lengkap', 'Isi tanggal dan alasan lembur sebelum submit.', 'amber', 'Overtime');
			return;
		}
		const row = { id: generateId('overtime'), requester: displayRoleProfile.userName, date: overtimeForm.request_date, duration: `${overtimeForm.duration_hours || '0'} jam`, reason: overtimeForm.reason, status: 'Menunggu manager', tone: 'amber', project_or_cost_center: overtimeForm.project_or_cost_center, requested_by: overtimeForm.requested_by, supervisor_id: overtimeForm.supervisor_id, attachment: overtimeForm.attachment, payroll_eligible: Boolean(overtimeForm.payroll_eligible), notes: overtimeForm.notes };
		overtimeRowsState = [row, ...overtimeRowsState];
		selectedOvertimeId = row.id;
		overtimeForm = createOvertimeForm(displayRoleProfile.userName);
		approvalsState = [createApprovalFromRecord('overtime', row.id, `Lembur ${row.requester}`, row.requester, row.duration, 'overtime'), ...approvalsState];
		setPrototypeMessage('Pengajuan lembur terkirim', 'Request lembur baru ditambahkan ke queue approval dan payroll impact.', 'green', 'Overtime');
		pushNotification('Overtime request dibuat', `${row.duration} untuk ${row.reason}.`, { category: 'overtime', priority: 'medium', target_module: 'overtime', target_id: row.id, action_label: 'Buka lembur', needs_action: true, tone: 'amber' });
	}

	function handleSelectApproval(approvalId: string) { selectedApprovalId = approvalId; approvalForm = createApprovalForm(); }
	function handleApprovalFieldChange(field: string, value: string | boolean) { approvalForm = { ...approvalForm, [field]: value }; }

	function handleApprovalDecision(decision: 'approve' | 'reject') {
		const selectedApproval = approvalsState.find((entry) => entry.id === selectedApprovalId);
		if (!selectedApproval || !selectedApproval.needs_action) return;
		if (decision === 'reject' && !String(approvalForm.approval_note ?? '').trim()) {
			setPrototypeMessage('Catatan approval wajib', 'Reject membutuhkan catatan approval sebelum status diubah.', 'red', 'Approval');
			return;
		}
		const nextStatus = decision === 'approve' ? 'Approved' : 'Rejected';
		const nextTone = decision === 'approve' ? 'green' : 'red';
		approvalsState = approvalsState.map((entry) => entry.id === selectedApproval.id ? { ...entry, status: nextStatus, tone: nextTone, needs_action: false, approval_note: approvalForm.approval_note, effective_date: approvalForm.effective_date, override_reason: approvalForm.override_reason, escalation_flag: approvalForm.escalation_flag } : entry);
		syncApprovalSource(selectedApproval.moduleId, selectedApproval.approval_target_id, decision, approvalForm.approval_note);
		setPrototypeMessage(`${nextStatus}: ${selectedApproval.title}`, `Decision tersimpan untuk ${selectedApproval.owner}.`, nextTone, 'Approval');
		pushNotification(`${nextStatus}: ${selectedApproval.title}`, 'Inbox approval dan modul sumber telah diperbarui.', { category: 'approval', priority: decision === 'reject' ? 'high' : 'medium', target_module: selectedApproval.moduleId, target_id: selectedApproval.approval_target_id, action_label: 'Open source', tone: nextTone });
		approvalForm = createApprovalForm();
	}

	function handleOpenApprovalSource() {
		const selectedApproval = approvalsState.find((entry) => entry.id === selectedApprovalId);
		if (!selectedApproval) return;
		focusTarget(selectedApproval.moduleId, selectedApproval.approval_target_id);
		setPrototypeMessage(`${selectedApproval.title} terhubung ke sumber`, 'Workspace berpindah ke modul asal untuk menelusuri data pendukung.', selectedApproval.tone, 'Approval');
	}

	function handleSelectPayrollPeriod(periodId: string) { selectedPayrollPeriodId = periodId; }
	function handleSelectPayrollRow(rowId: string) { selectedPayrollRowId = rowId; }
	function handlePayrollPeriodFieldChange(field: string, value: string) { payrollPeriodForm = { ...payrollPeriodForm, [field]: value }; }
	function handlePayrollAdjustmentFieldChange(field: string, value: string | boolean) { payrollAdjustmentForm = { ...payrollAdjustmentForm, [field]: String(value) }; }

	function handleCreatePayrollPeriod() {
		if (!payrollPeriodForm.period_label || !payrollPeriodForm.period_start || !payrollPeriodForm.period_end) {
			setPrototypeMessage('Payroll period belum lengkap', 'Isi label, start date, dan end date sebelum membuat periode.', 'amber', 'Payroll');
			return;
		}
		const period = { id: generateId('period'), ...payrollPeriodForm };
		payrollPeriodsState = [period, ...payrollPeriodsState];
		selectedPayrollPeriodId = period.id;
		payrollPeriodForm = createPayrollPeriodForm();
		setPrototypeMessage('Periode payroll dibuat', `${period.period_label} masuk ke daftar payroll period.`, 'green', 'Payroll');
		pushNotification('Payroll period dibuat', `${period.period_label} siap direview.`, { category: 'payroll', priority: 'medium', target_module: 'payroll', target_id: period.id, action_label: 'Open payroll', needs_action: true, tone: 'green' });
	}

	function handleAddPayrollAdjustment() {
		const selectedRow = payrollRowsState.find((row) => row.id === selectedPayrollRowId);
		if (!selectedRow || !payrollAdjustmentForm.component_name || !payrollAdjustmentForm.amount) {
			setPrototypeMessage('Adjustment belum lengkap', 'Pilih karyawan lalu isi nama komponen dan amount.', 'amber', 'Payroll');
			return;
		}
		const amount = n(payrollAdjustmentForm.amount);
		payrollRowsState = payrollRowsState.map((row) => {
			if (row.id !== selectedRow.id) return row;
			const allowance = payrollAdjustmentForm.component_type === 'deduction' ? row.allowance : row.allowance + amount;
			const bonus = payrollAdjustmentForm.component_type === 'bonus' ? n(row.bonus) + amount : n(row.bonus);
			const deduction = payrollAdjustmentForm.component_type === 'deduction' ? row.deduction + amount : row.deduction;
			return { ...row, allowance, bonus, deduction, total: n(row.base) + allowance + bonus + n(row.overtime) - deduction, status: 'Needs review', adjustments: [...(row.adjustments ?? []), { component_type: payrollAdjustmentForm.component_type, component_name: payrollAdjustmentForm.component_name, amount, description: payrollAdjustmentForm.description }] };
		});
		setPrototypeMessage('Adjustment payroll ditambahkan', `${payrollAdjustmentForm.component_name} masuk ke review ${selectedRow.name}.`, 'green', 'Payroll');
		pushNotification('Payroll adjustment', `Adjustment baru ditambahkan untuk ${selectedRow.name}.`, { category: 'payroll', priority: 'medium', target_module: 'payroll', target_id: selectedPayrollPeriodId || 'payroll-adjustment', action_label: 'Open payroll', needs_action: true, tone: 'amber' });
		payrollAdjustmentForm = createPayrollAdjustmentForm(displayRoleProfile.userName);
	}

	function handleFinalizePeriod() {
		const period = payrollPeriodsState.find((entry) => entry.id === selectedPayrollPeriodId);
		if (!period) return;
		payrollPeriodsState = payrollPeriodsState.map((entry) => entry.id === period.id ? { ...entry, status: 'awaiting_approval' } : entry);
		approvalsState = [createApprovalFromRecord('payroll', period.id, `Payroll final ${period.period_label}`, 'Finance + HR', formatCurrency(payrollRowsState.reduce((total, row) => total + n(row.total), 0)), 'payroll', 'high'), ...approvalsState];
		setPrototypeMessage('Periode payroll difinalisasi', `${period.period_label} masuk ke tahap awaiting approval.`, 'amber', 'Payroll');
		pushNotification('Payroll menunggu approval', `${period.period_label} siap direview owner.`, { category: 'payroll', priority: 'high', target_module: 'approvals', target_id: approvalsState[0]?.id ?? period.id, action_label: 'Review approval', needs_action: true, tone: 'red' });
	}

	function handlePublicationFieldChange(field: string, value: string | boolean) { payslipPublicationForm = { ...payslipPublicationForm, [field]: value }; }

	function handleSubmitPayslipPublication() {
		if (!payslipPublicationForm.period_id) {
			setPrototypeMessage('Pilih periode dulu', 'Period payslip wajib dipilih sebelum publikasi batch.', 'amber', 'Payslip');
			return;
		}
		const batch = { id: generateId('batch'), subject: `Payroll ${payslipPublicationForm.period_id}`, detail: `${payrollRowsState.length} slip dipublikasikan`, amount: formatCurrency(payrollRowsState.reduce((total, row) => total + n(row.total), 0)), status: 'Published', tone: 'green' };
		teamPayslipsState = [batch, ...teamPayslipsState];
		payrollPeriodsState = payrollPeriodsState.map((period) => period.period_label === payslipPublicationForm.period_id ? { ...period, status: 'published' } : period);
		setPrototypeMessage('Batch payslip dipublikasikan', `${batch.subject} sekarang tersedia via in-app${payslipPublicationForm.include_pdf ? ' dan PDF' : ''}.`, 'green', 'Payslip');
		pushNotification('Payslip published', `${batch.subject} berhasil dipublikasikan untuk ${payrollRowsState.length} karyawan.`, { category: 'payroll', priority: 'medium', target_module: 'payslips', target_id: batch.id, action_label: 'Open payslips', tone: 'green' });
	}

	function handleDownloadDashboardPayslip() { handleSelectModule('payslips'); handleDownloadPayslip(); }

	function handleDownloadPayslip() {
		const slip = selectedEmployeePayslip ?? employeePayslipsState[0];
		if (!slip) return;
		setPrototypeMessage(`Download ${slip.subject}`, 'Workspace mensimulasikan export slip gaji ke PDF tanpa file asli.', slip.tone, 'Payslip');
		pushNotification(`Payslip ${slip.subject}`, 'Simulasi download PDF berhasil dipicu.', { category: 'payroll', target_module: 'payslips', target_id: slip.id, action_label: 'Open payslip', tone: slip.tone });
	}

	function handleViewPayslipDetails() {
		handleSelectModule('payslips');
		const slip = selectedEmployeePayslip ?? employeePayslipsState[0];
		if (!slip) return;
		setPrototypeMessage(`Rincian ${slip.subject} ditampilkan`, 'Panel komposisi slip diperbarui sesuai arsip payslip yang aktif.', slip.tone, 'Payslip');
	}

	function handleOpenArchiveSlip(subject: string) {
		const slip = employeePayslipsState.find((entry) => entry.subject === subject);
		if (!slip) return;
		selectedEmployeePayslipId = slip.id;
		handleSelectModule('payslips');
		setPrototypeMessage(`${slip.title} aktif`, 'Hero payslip dan archive state sekarang mengikuti slip yang dipilih.', slip.tone, 'Payslip');
	}

	function handleProfileFieldChange(field: string, value: string | boolean) {
		profileState = { ...profileState, [field]: value };
		if (['bank_name', 'bank_account_number', 'bank_account_holder_name'].includes(field)) bankVerificationState = 'Pending verification';
	}

	function handleSaveProfile() {
		if (profileState.password_new && profileState.password_new !== profileState.password_confirm) {
			setPrototypeMessage('Password belum sinkron', 'Konfirmasi password baru harus sama dengan password baru.', 'red', 'Profile');
			return;
		}
		profileState = { ...profileState, password_current: '', password_new: '', password_confirm: '' };
		setPrototypeMessage('Profil disimpan', 'Perubahan profil, rekening, dan preferensi notifikasi berhasil disimpan.', 'green', 'Profile');
		pushNotification('Profile updated', 'Perubahan profil dan preferensi akun berhasil disimpan.', { target_module: 'profile', target_id: 'profile', action_label: 'Open profile', tone: 'green' });
	}
	function handleNotificationFilterChange(filter: 'all' | 'unread' | 'needs_action') { notificationFilter = filter; }
	function handleMarkNotificationRead(notificationId: string) {
		notificationItems = notificationItems.map((item) => item.id === notificationId ? { ...item, is_read: true } : item);
	}
	function handleNotificationAction(item: NotificationItem) {
		handleMarkNotificationRead(item.id);
		focusTarget(item.target_module, item.target_id);
		setPrototypeMessage(item.title, item.body, item.tone, 'Notification');
	}
	function handleOpenReport(report: any) {
		selectedReportId = report.id;
		handleSelectModule('reports');
		setPrototypeMessage(`${report.title} dibuka`, `Workspace menyiapkan preview ${report.delivery.toLowerCase()} untuk laporan ini.`, report.tone, 'Report');
		pushNotification(report.title, `Preview ${report.delivery.toLowerCase()} siap dibuka.`, { target_module: 'reports', target_id: report.id, action_label: 'Open report', tone: report.tone });
	}
	function handleOpenReportSource() {
		if (!selectedReport?.moduleId || !roleAccess[role].includes(selectedReport.moduleId)) return;
		handleSelectModule(selectedReport.moduleId);
		setPrototypeMessage(`${selectedReport.title} terhubung ke modul sumber`, `Workspace berpindah ke modul ${selectedReport.moduleId} untuk menelusuri data asal laporan.`, selectedReport.tone as Tone, 'Report');
	}
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div class="shell" class:sidebar-collapsed={!isMobile && isSidebarCollapsed}>
	{#if isMobile && isSidebarOpen}
		<button type="button" class="sidebar-backdrop" aria-label="Close navigation" on:click={handleCloseSidebar}></button>
	{/if}

	<AppSidebar
		{visibleModules}
		{activeModule}
		{isMobile}
		isOpen={isSidebarOpen}
		isCollapsed={isSidebarCollapsed}
		primaryActionLabel={primarySidebarActionLabel}
		onClose={handleCloseSidebar}
		onSelectModule={handleSelectModule}
		onPrimaryAction={handlePrimarySidebarAction}
	/>

	<div class="workspace">
		<AppTopbar
			activeRoleProfile={displayRoleProfile}
			{isMobile}
			searchValue={searchQuery}
			isSidebarCollapsed={isSidebarCollapsed}
			activeOrganizationLabel={activeOrganization.label}
			notificationCount={unreadNotificationCount}
			profilePendingLabel={profilePendingLabel}
			onToggleSidebar={handleToggleSidebar}
			onSearchInput={handleSearchInput}
			onToggleOrganizationMenu={handleToggleOrganizationMenu}
			onToggleNotifications={handleToggleNotifications}
			onOpenProfile={handleOpenProfile}
		/>

		<main class="page">
			<SectionHeader module={currentModule} roleLabel={activeRoleProfile.label} userName={displayRoleProfile.userName} />

			{#if prototypeMessage || isOrganizationMenuOpen || isNotificationCenterOpen || isQuickActionOpen || selectedReport}
				<section class="prototype-hub">
					{#if prototypeMessage}
						<article class={`prototype-banner ${prototypeMessage.tone}`}>
							<div class="prototype-banner-copy">
								<span class="eyebrow light">{prototypeMessage.tag}</span>
								<strong>{prototypeMessage.title}</strong>
								<p>{prototypeMessage.detail}</p>
							</div>
							<button type="button" class="icon-button subtle prototype-banner-close" aria-label="Dismiss workspace update" on:click={() => (prototypeMessage = null)}>
								<span class="material-symbols-outlined">close</span>
							</button>
						</article>
					{/if}

					{#if isOrganizationMenuOpen}
						<Panel title="Organization switcher" meta="Prototype workspace" className="prototype-surface">
							<div class="prototype-option-grid">
								{#each organizations as organization, index}
									<button type="button" class={`prototype-option-button ${activeOrganizationIndex === index ? 'active' : ''}`.trim()} on:click={() => handleSelectOrganization(index)}>
										<strong>{organization.label}</strong>
										<p>{organization.detail}</p>
									</button>
								{/each}
							</div>
						</Panel>
					{/if}

					{#if isNotificationCenterOpen}
						<Panel title="Notifications" meta={`${unreadNotificationCount} unread | ${needsActionNotificationCount} needs action`} className="prototype-surface prototype-report-preview">
							<div class="notification-filter-row">
								<button type="button" class:active-filter={notificationFilter === 'all'} class="pill filter-pill" on:click={() => handleNotificationFilterChange('all')}>All</button>
								<button type="button" class:active-filter={notificationFilter === 'unread'} class="pill filter-pill" on:click={() => handleNotificationFilterChange('unread')}>Unread</button>
								<button type="button" class:active-filter={notificationFilter === 'needs_action'} class="pill filter-pill" on:click={() => handleNotificationFilterChange('needs_action')}>Needs action</button>
							</div>
							<div class="prototype-list">
								{#each filteredNotificationItems as item}
									<article class={`prototype-list-card notification-card ${item.priority === 'high' ? 'priority-high' : ''}`.trim()}>
										<div class="record-card-head">
											<div>
												<strong>{item.title}</strong>
												<p>{item.body}</p>
											</div>
											<div class="notification-meta-stack">
												<span class={`status ${item.tone}`}>{item.created_at}</span>
												<span class={`notification-priority ${item.priority}`}>{item.priority}</span>
											</div>
										</div>
										<div class="pill-list compact-pill-list">
											<span class="pill soft">{item.category}</span>
											{#if item.needs_action}
												<span class="pill priority-pill">Needs action</span>
											{/if}
											{#if item.is_read}
												<span class="pill soft">Read</span>
											{/if}
										</div>
										<div class="form-actions">
											{#if !item.is_read}
												<button type="button" class="button-secondary" on:click={() => handleMarkNotificationRead(item.id)}>Mark as read</button>
											{/if}
											<button type="button" class="button-primary" on:click={() => handleNotificationAction(item)}>{item.action_label}</button>
										</div>
									</article>
								{/each}
							</div>
						</Panel>
					{/if}

					{#if isQuickActionOpen}
						<Panel title="Quick actions" meta="Role shortcuts" className="prototype-surface">
							<div class="prototype-option-grid">
								{#each quickActions as action}
									<button type="button" class="prototype-option-button" on:click={() => handleQuickAction(action.id)}>
										<strong>{action.label}</strong>
										<p>{action.detail}</p>
									</button>
								{/each}
							</div>
						</Panel>
					{/if}

					{#if selectedReport}
						<Panel title={selectedReport.title} meta={selectedReport.delivery} className="prototype-surface prototype-report-preview">
							<p>{selectedReport.note}</p>
							<div class="pill-list">
								<span class="pill soft">{selectedReport.action}</span>
								<span class="pill soft">Preview aktif</span>
								<span class="pill soft">{selectedReport.delivery}</span>
							</div>
							<div class="prototype-action-row">
								{#if selectedReport.moduleId && roleAccess[role].includes(selectedReport.moduleId)}
									<button type="button" class="button-secondary" on:click={handleOpenReportSource}>Open source module</button>
								{/if}
								<button type="button" class="button-primary" on:click={() => setPrototypeMessage(`${selectedReport.title} dijalankan`, 'Preview atau export report telah disimulasikan.', selectedReport.tone as Tone, 'Report')}>Run report preview</button>
							</div>
						</Panel>
					{/if}
				</section>
			{/if}

			{#if activeModule === 'dashboard'}
				<DashboardSection
					dashboard={currentDashboard}
					{visibleModules}
					activeRole={role}
					featuredPayslip={dashboardFeaturedPayslip}
					leaveBalances={currentLeaveBalances}
					requests={leaveRequestsState}
					attendanceRows={currentAttendanceRows}
					overtimeRows={overtimeRowsState}
					statusActionLabel={dashboardStatusActionLabel}
					onStatusAction={handleDashboardStatusAction}
					onViewCalendar={handleViewAttendanceCalendar}
					onDownloadPayslip={handleDownloadDashboardPayslip}
					onRequestActions={handleOpenQuickActions}
					onCreateRequest={handleOpenQuickActions}
				/>
			{/if}

			{#if activeModule === 'employees'}
				<EmployeesSection
					stats={employeeStats}
					employees={filteredEmployees}
					selectedEmployeeId={selectedEmployeeId}
					filters={employeeFilters}
					form={employeeForm}
					documentDraft={employeeDocumentDraft}
					importSummary={importSummary}
					contractAlerts={contractAlerts}
					{formatCurrency}
					onSelectEmployee={handleSelectEmployee}
					onFilterChange={handleEmployeeFilterChange}
					onFieldChange={handleEmployeeFieldChange}
					onDocumentFieldChange={handleDocumentFieldChange}
					onSaveEmployee={handleSaveEmployee}
					onResetEmployee={handleResetEmployee}
					onToggleEmployeeStatus={handleToggleEmployeeStatus}
					onAttachDocument={handleAttachDocument}
				/>
			{/if}

			{#if activeModule === 'attendance'}
				<AttendanceSection
					activeRole={role}
					focus={currentAttendanceFocus}
					highlights={currentAttendanceHighlights}
					trend={attendanceTrend}
					personalRows={personalAttendanceState}
					teamRows={teamAttendanceState}
					correctionForm={attendanceCorrectionForm}
					onCorrectionFieldChange={handleAttendanceCorrectionFieldChange}
					onSubmitCorrection={handleSubmitAttendanceCorrection}
					onPrimaryAction={handleAttendancePrimaryAction}
					onSecondaryAction={handleAttendanceSecondaryAction}
				/>
			{/if}

			{#if activeModule === 'leave'}
				<LeaveSection
					activeRole={role}
					balances={currentLeaveBalances}
					requests={leaveRequestsState}
					flow={leaveFlow}
					selectedRequestId={selectedLeaveRequestId}
					form={leaveForm}
					onSelectRequest={handleSelectLeaveRequest}
					onFieldChange={handleLeaveFieldChange}
					onSubmitRequest={handleSubmitLeaveRequest}
				/>
			{/if}

			{#if activeModule === 'overtime'}
				<OvertimeSection
					activeRole={role}
					summary={currentOvertimeSummary}
					rows={overtimeRowsState}
					payrollBreakdown={currentPayrollBreakdown}
					selectedRowId={selectedOvertimeId}
					form={overtimeForm}
					onSelectRow={handleSelectOvertimeRow}
					onFieldChange={handleOvertimeFieldChange}
					onSubmitRequest={handleSubmitOvertimeRequest}
				/>
			{/if}

			{#if activeModule === 'approvals'}
				<ApprovalsSection
					metrics={currentApprovalMetrics}
					approvals={approvalsState}
					selectedApprovalId={selectedApprovalId}
					form={approvalForm}
					onSelectApproval={handleSelectApproval}
					onFieldChange={handleApprovalFieldChange}
					onApprove={() => handleApprovalDecision('approve')}
					onReject={() => handleApprovalDecision('reject')}
					onOpenSource={handleOpenApprovalSource}
				/>
			{/if}

			{#if activeModule === 'payroll'}
				<PayrollSection
					metrics={currentPayrollMetrics}
					stages={currentPayrollStages}
					breakdown={currentPayrollBreakdown}
					rows={payrollRowsState}
					periods={payrollPeriodsState}
					selectedPeriodId={selectedPayrollPeriodId}
					selectedRowId={selectedPayrollRowId}
					periodForm={payrollPeriodForm}
					adjustmentForm={payrollAdjustmentForm}
					{formatCurrency}
					onSelectPeriod={handleSelectPayrollPeriod}
					onSelectRow={handleSelectPayrollRow}
					onPeriodFieldChange={handlePayrollPeriodFieldChange}
					onAdjustmentFieldChange={handlePayrollAdjustmentFieldChange}
					onCreatePeriod={handleCreatePayrollPeriod}
					onAddAdjustment={handleAddPayrollAdjustment}
					onFinalizePeriod={handleFinalizePeriod}
				/>
			{/if}

			{#if activeModule === 'payslips'}
				<PayslipsSection
					activeRole={role}
					featuredPayslip={currentPayslipFeatured}
					details={currentPayslipDetails}
					payslips={currentPayslips}
					activeArchiveSubject={selectedEmployeePayslip?.subject ?? ''}
					publicationForm={payslipPublicationForm}
					publicationPeriods={publicationPeriods}
					onPublicationFieldChange={handlePublicationFieldChange}
					onSubmitPublication={handleSubmitPayslipPublication}
					onDownloadFeatured={handleDownloadPayslip}
					onViewFeaturedDetails={handleViewPayslipDetails}
					onOpenArchiveSlip={handleOpenArchiveSlip}
				/>
			{/if}

			{#if activeModule === 'reports'}
				<ReportsSection reportCards={reportCards} reportKpis={currentReportKpis} {reportCadence} onOpenReport={handleOpenReport} />
			{/if}

			{#if activeModule === 'profile'}
				<ProfileSection
					profile={profileState}
					verificationState={bankVerificationState}
					roleLabel={activeRoleProfile.label}
					onFieldChange={handleProfileFieldChange}
					onSaveProfile={handleSaveProfile}
				/>
			{/if}
		</main>
	</div>
</div>
