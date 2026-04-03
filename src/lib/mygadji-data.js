export const currencyFormatter = new Intl.NumberFormat('id-ID', {
	style: 'currency',
	currency: 'IDR',
	maximumFractionDigits: 0
});

export const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	day: '2-digit',
	month: 'short',
	year: 'numeric'
});

/** @param {number} value */
export function formatCurrency(value) {
	return currencyFormatter.format(value);
}

/** @param {string} name */
export function getInitials(name) {
	return name
		.split(' ')
		.map((part) => part[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();
}

export const modules = [
	{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard', tag: 'Role overview', description: 'Ringkasan berbasis role untuk HRD, owner, dan karyawan.' },
	{ id: 'employees', label: 'Employee Data', icon: 'groups', tag: 'Employee management', description: 'Database karyawan, struktur, status kerja, dan komponen payroll inti.' },
	{ id: 'attendance', label: 'Attendance', icon: 'event_available', tag: 'Attendance / Absensi', description: 'Check-in, check-out, status hadir, dan rekap harian.' },
	{ id: 'leave', label: 'Leave & Permit', icon: 'holiday_village', tag: 'Leave & permit', description: 'Pengajuan cuti dan izin dengan kuota dan histori.' },
	{ id: 'overtime', label: 'Overtime', icon: 'alarm_on', tag: 'Overtime / Lembur', description: 'Pengajuan lembur dan dampaknya ke payroll.' },
	{ id: 'approvals', label: 'Approval Center', icon: 'fact_check', tag: 'Approval center', description: 'Inbox approval untuk cuti, izin, lembur, dan payroll final.' },
	{ id: 'payroll', label: 'Payroll', icon: 'payments', tag: 'Payroll processing', description: 'Periode payroll, komponen gaji, dan finalisasi.' },
	{ id: 'payslips', label: 'Payslips', icon: 'description', tag: 'Slip gaji', description: 'Slip gaji final yang siap diakses dan diunduh.' },
	{ id: 'reports', label: 'Reports', icon: 'bar_chart', tag: 'Reporting', description: 'Laporan absensi, cuti, lembur, payroll, dan karyawan aktif.' },
	{ id: 'profile', label: 'Profile & Account', icon: 'manage_accounts', tag: 'Profile & account', description: 'Profil pribadi, rekening, password, dan preferensi notifikasi.' }
];

export const roles = [
	{
		id: 'hrd',
		label: 'HRD',
		title: 'Pusat kendali operasional HR & payroll',
		subtitle: 'Kelola seluruh siklus SDM dari data karyawan sampai slip gaji dalam satu dashboard siap operasional.',
		badge: 'Operational control',
		userName: 'Alex Thompson',
		userRole: 'HR Director',
		primaryAction: 'Proses payroll',
		secondaryAction: 'Unduh laporan',
		notice: 'Payroll April ditutup dalam 3 hari, 12 approval menunggu, dan 6 kontrak perlu review.'
	},
	{
		id: 'boss',
		label: 'Boss / Owner',
		title: 'Executive overview untuk owner dan manager',
		subtitle: 'Pantau biaya payroll, approval lintas divisi, dan kesehatan operasional tim lewat satu tampilan ringkas.',
		badge: 'Executive visibility',
		userName: 'Raka Santoso',
		userRole: 'Owner',
		primaryAction: 'Lihat summary payroll',
		secondaryAction: 'Review approval',
		notice: 'Biaya payroll naik 6,4% dan dua divisi perlu perhatian pada tingkat keterlambatan.'
	},
	{
		id: 'employee',
		label: 'Karyawan',
		title: 'Self-service harian untuk setiap karyawan',
		subtitle: 'Absen, ajukan cuti, cek lembur, dan akses slip gaji dari tampilan ringan yang mobile-friendly.',
		badge: 'Employee self-service',
		userName: 'Maya Putri',
		userRole: 'Product Designer',
		primaryAction: 'Check-in sekarang',
		secondaryAction: 'Ajukan cuti',
		notice: 'Status hadir hari ini tercatat, satu pengajuan izin menunggu manager, dan slip gaji terbaru siap diunduh.'
	}
];

export const roleAccess = {
	hrd: ['dashboard', 'employees', 'attendance', 'leave', 'overtime', 'approvals', 'payroll', 'payslips', 'reports', 'profile'],
	boss: ['dashboard', 'attendance', 'leave', 'overtime', 'approvals', 'payroll', 'reports', 'profile'],
	employee: ['dashboard', 'attendance', 'leave', 'overtime', 'payslips', 'profile']
};

export const dashboardContent = {
	hrd: {
		stats: [
			{ label: 'Karyawan aktif', value: '452', delta: '+6 sejak bulan lalu', icon: 'groups', tone: 'blue' },
			{ label: 'Absensi hari ini', value: '93%', delta: '18 telat, 14 belum check-out', icon: 'event_available', tone: 'green' },
			{ label: 'Approval pending', value: '12', delta: '4 prioritas tinggi', icon: 'fact_check', tone: 'amber' },
			{ label: 'Payroll bulan ini', value: formatCurrency(684500000), delta: '78% draft selesai', icon: 'payments', tone: 'slate' }
		],
		focus: [
			{ title: 'Kontrak berakhir dalam 45 hari', meta: '6 orang perlu review HRBP minggu ini', badge: 'Urgent', tone: 'amber' },
			{ title: 'Data rekening belum lengkap', meta: '3 karyawan menghambat finalisasi payroll', badge: 'Action', tone: 'blue' },
			{ title: 'Sinkronisasi lembur Maret', meta: '2 approval masih menunggu supervisor', badge: 'Follow up', tone: 'green' }
		],
		queue: [
			{ title: 'Cuti tahunan - Elena Rodriguez', meta: '3 hari | Menunggu persetujuan HR', badge: 'Waiting', tone: 'amber' },
			{ title: 'Payroll final - April 2026', meta: 'Owner approval setelah variance check', badge: 'Review', tone: 'blue' },
			{ title: 'Lembur - Dimas Pratama', meta: '6 jam | Dampak ke biaya engineering', badge: 'Escalated', tone: 'red' }
		],
		insights: [
			{ label: 'Kelengkapan profil karyawan', progress: 87, note: 'Target minimum 95% sebelum closing payroll.', tone: 'blue' },
			{ label: 'Payroll readiness', progress: 78, note: 'Masih ada 11 komponen yang perlu final check.', tone: 'green' },
			{ label: 'SLA approval', progress: 68, note: 'Target di bawah 1 hari.', tone: 'amber' }
		]
	},
	boss: {
		stats: [
			{ label: 'Total payroll', value: formatCurrency(684500000), delta: '+6,4% vs bulan lalu', icon: 'payments', tone: 'blue' },
			{ label: 'Approval prioritas', value: '7', delta: '4 lembur, 3 cuti', icon: 'fact_check', tone: 'amber' },
			{ label: 'Kehadiran tim', value: '91%', delta: '2 divisi perlu follow up', icon: 'groups', tone: 'green' },
			{ label: 'Kontrak kritikal', value: '6', delta: '3 habis bulan ini', icon: 'assignment_late', tone: 'slate' }
		],
		focus: [
			{ title: 'Biaya lembur sales naik 18%', meta: 'Dipicu onboarding batch baru dan event mingguan', badge: 'Insight', tone: 'blue' },
			{ title: 'Marketing terlambat tertinggi minggu ini', meta: '5 anggota tim lebih dari 15 menit', badge: 'Attention', tone: 'amber' },
			{ title: 'Payroll variance terkendali', meta: 'Masih dalam batas budget kuartal', badge: 'Healthy', tone: 'green' }
		],
		queue: [
			{ title: 'Approval payroll final April', meta: 'Total THP 84 karyawan siap dikunci', badge: 'Decision', tone: 'red' },
			{ title: 'Cuti supervisor gudang', meta: 'Perlu back-up plan 12-14 April', badge: 'Risk', tone: 'amber' },
			{ title: 'Lembur tim engineering', meta: 'Permintaan 24 jam untuk sprint release', badge: 'Budget', tone: 'blue' }
		],
		insights: [
			{ label: 'Budget payroll kuartal', progress: 74, note: 'Masih di bawah batas 80%.', tone: 'blue' },
			{ label: 'Kesehatan absensi', progress: 91, note: 'Divisi operasi membaik setelah penyesuaian shift.', tone: 'green' },
			{ label: 'Approval responsiveness', progress: 63, note: 'Supervisor masih jadi bottleneck.', tone: 'amber' }
		]
	},
	employee: {
		stats: [
			{ label: 'Status hadir', value: 'On-site', delta: 'Check-in 08:02 WIB', icon: 'badge', tone: 'green' },
			{ label: 'Sisa cuti', value: '8 hari', delta: '1 request sedang diproses', icon: 'holiday_village', tone: 'blue' },
			{ label: 'Slip gaji terbaru', value: formatCurrency(8750000), delta: 'Periode Maret 2026', icon: 'description', tone: 'slate' },
			{ label: 'Lembur bulan ini', value: '11 jam', delta: '1 request menunggu approval', icon: 'alarm_on', tone: 'amber' }
		],
		focus: [
			{ title: 'Check-out tersedia pukul 17:00', meta: 'Lokasi dan perangkat hari ini tervalidasi', badge: 'Today', tone: 'green' },
			{ title: 'Pengajuan izin dokter', meta: 'Menunggu persetujuan manager', badge: 'Waiting', tone: 'amber' },
			{ title: 'Slip gaji Maret sudah terbit', meta: 'Bisa diunduh dalam format PDF', badge: 'Ready', tone: 'blue' }
		],
		queue: [
			{ title: 'Izin 04 April 2026', meta: 'Status: diproses manager', badge: 'Pending', tone: 'amber' },
			{ title: 'Lembur 28 Maret 2026', meta: 'Approved HR, menunggu payroll', badge: 'Approved', tone: 'green' },
			{ title: 'Update rekening gaji', meta: 'Dokumen baru berhasil diverifikasi', badge: 'Done', tone: 'blue' }
		],
		insights: [
			{ label: 'Kepatuhan absensi bulan ini', progress: 96, note: 'Terlambat hanya sekali dalam 21 hari kerja.', tone: 'green' },
			{ label: 'Kuota cuti terpakai', progress: 33, note: '4 hari terpakai dari total 12 hari.', tone: 'blue' },
			{ label: 'Kecepatan approval', progress: 72, note: 'Rata-rata request selesai dalam 0,8 hari.', tone: 'amber' }
		]
	}
};

export const employeeSummaryStats = [
	{ label: 'Karyawan aktif', value: '452', note: '37 kontrak, 415 permanen', tone: 'blue' },
	{ label: 'Kontrak mendekati habis', value: '6', note: 'Perlu keputusan sebelum 15 April', tone: 'amber' },
	{ label: 'Profil lengkap > 90%', value: '87%', note: 'Data bank dan NPWP paling sering kosong', tone: 'green' }
];

export const employeeDirectory = [
	{ name: 'Nadia Prameswari', id: 'EMP-1024', division: 'Finance', position: 'Senior Accountant', manager: 'Haris Setiawan', status: 'Aktif', salary: 12500000, completeness: '98%' },
	{ name: 'Dimas Pratama', id: 'EMP-1041', division: 'Engineering', position: 'Frontend Engineer', manager: 'Maya Putri', status: 'Aktif', salary: 9800000, completeness: '94%' },
	{ name: 'Elena Rodriguez', id: 'EMP-1063', division: 'Operations', position: 'Warehouse Supervisor', manager: 'Raka Santoso', status: 'Kontrak', salary: 8900000, completeness: '88%' },
	{ name: 'Farhan Naufal', id: 'EMP-1077', division: 'Sales', position: 'Account Executive', manager: 'Nina Marsha', status: 'Probation', salary: 7200000, completeness: '84%' },
	{ name: 'Lina Hartati', id: 'EMP-1088', division: 'People Ops', position: 'HR Generalist', manager: 'Alex Thompson', status: 'Aktif', salary: 8600000, completeness: '100%' }
];

export const employeeChecklist = [
	'Nama lengkap, NIK, email, nomor HP, alamat',
	'Jabatan, divisi, atasan, tanggal masuk, status kerja',
	'Gaji pokok, rekening bank, dan dokumen pendukung',
	'Filter berdasarkan divisi, status, atasan, dan tanggal masuk'
];

export const employeeWorkflow = [
	'Tambah karyawan baru',
	'Edit data dan ubah status kerja',
	'Nonaktifkan karyawan',
	'Pantau kelengkapan dokumen payroll',
	'Import CSV dan tracker kontrak'
];

export const attendanceFocus = {
	hrd: { title: 'Rekap absensi real-time', summary: '421 hadir tepat waktu, 18 telat, 7 izin, 6 cuti, dan 14 orang belum check-out.', primary: 'Kirim pengingat', secondary: 'Unduh rekap', badges: ['Tepat waktu 93%', 'WFH 24%', 'GPS optional'] },
	boss: { title: 'Kesehatan disiplin tim', summary: 'Divisi sales dan marketing menjadi penyumbang keterlambatan tertinggi dalam tiga hari terakhir.', primary: 'Review tim', secondary: 'Lihat laporan', badges: ['Telat 18 orang', '2 divisi alert', 'Coverage 91%'] },
	employee: { title: 'Absensi saya hari ini', summary: 'Check-in tercatat pukul 08:02 WIB di kantor pusat. Check-out dapat dilakukan mulai pukul 17:00 WIB.', primary: 'Check-out', secondary: 'Ajukan izin', badges: ['Shift 09:00 - 18:00', 'Lokasi valid', 'Tanpa keterlambatan'] }
};

export const teamAttendanceRows = [
	{ name: 'Dimas Pratama', division: 'Engineering', checkIn: '08:02', checkOut: '17:14', status: 'Tepat waktu', tone: 'green' },
	{ name: 'Sarah Wijaya', division: 'Marketing', checkIn: '09:17', checkOut: '-', status: 'Terlambat', tone: 'amber' },
	{ name: 'Elena Rodriguez', division: 'Operations', checkIn: '-', checkOut: '-', status: 'Cuti', tone: 'blue' },
	{ name: 'Agus Prabowo', division: 'Sales', checkIn: '08:48', checkOut: '17:29', status: 'WFH', tone: 'slate' },
	{ name: 'Lina Hartati', division: 'People Ops', checkIn: '07:55', checkOut: '17:02', status: 'Tepat waktu', tone: 'green' }
];

export const personalAttendanceRows = [
	{ date: '01 Apr 2026', mode: 'Office', checkIn: '08:02', checkOut: '-', status: 'Hadir', tone: 'green' },
	{ date: '31 Mar 2026', mode: 'Office', checkIn: '08:11', checkOut: '17:18', status: 'Hadir', tone: 'green' },
	{ date: '28 Mar 2026', mode: 'Remote', checkIn: '08:07', checkOut: '17:09', status: 'WFH', tone: 'slate' },
	{ date: '27 Mar 2026', mode: 'Office', checkIn: '09:03', checkOut: '17:27', status: 'Terlambat', tone: 'amber' },
	{ date: '26 Mar 2026', mode: 'Office', checkIn: '07:59', checkOut: '17:05', status: 'Hadir', tone: 'green' }
];

export const attendanceHighlights = {
	hrd: [
		{ label: 'Telat > 30 menit', value: '5 orang', tone: 'amber' },
		{ label: 'Belum check-out', value: '14 orang', tone: 'slate' },
		{ label: 'Izin & cuti', value: '13 orang', tone: 'blue' }
	],
	boss: [
		{ label: 'Divisi alert', value: '2 divisi', tone: 'amber' },
		{ label: 'WFH hari ini', value: '109 orang', tone: 'slate' },
		{ label: 'Kehadiran sehat', value: '91%', tone: 'green' }
	],
	employee: [
		{ label: 'Jam kerja', value: '09:00 - 18:00', tone: 'blue' },
		{ label: 'Toleransi telat', value: '15 menit', tone: 'amber' },
		{ label: 'Kepatuhan bulan ini', value: '96%', tone: 'green' }
	]
};

export const attendanceTrend = [
	{ day: 'Sen', height: 72 },
	{ day: 'Sel', height: 78 },
	{ day: 'Rab', height: 84 },
	{ day: 'Kam', height: 80 },
	{ day: 'Jum', height: 88 }
];

export const leaveBalancesByRole = {
	hrd: [
		{ label: 'Pending request', value: '9 request', note: '4 perlu keputusan hari ini', tone: 'amber' },
		{ label: 'Kuota termonitor', value: '452 karyawan', note: 'Sinkron dengan status aktif', tone: 'blue' },
		{ label: 'Cuti terpakai bulan ini', value: '128 hari', note: 'Naik 12% dari bulan lalu', tone: 'green' }
	],
	boss: [
		{ label: 'Approval tertunda', value: '5 request', note: '2 berdampak ke operasi gudang', tone: 'amber' },
		{ label: 'Cuti tim bulan ini', value: '31 hari', note: 'Sales paling tinggi', tone: 'blue' },
		{ label: 'Coverage kerja', value: '92%', note: 'Masih aman untuk peak week', tone: 'green' }
	],
	employee: [
		{ label: 'Cuti tahunan', value: '8 hari', note: 'Dari total 12 hari', tone: 'blue' },
		{ label: 'Izin pribadi', value: '2 hari', note: '1 pengajuan sedang diproses', tone: 'amber' },
		{ label: 'Pengajuan bulan ini', value: '3 request', note: '2 selesai, 1 menunggu manager', tone: 'green' }
	]
};

export const teamLeaveRequests = [
	{ requester: 'Elena Rodriguez', type: 'Annual Leave', period: '12 - 14 Apr 2026', reason: 'Acara keluarga', status: 'Menunggu HR', tone: 'amber' },
	{ requester: 'Liam Parker', type: 'Sick Leave', period: '01 Apr 2026', reason: 'Medical check-up', status: 'Approved', tone: 'green' },
	{ requester: 'Sophia Kim', type: 'Permit', period: '03 Apr 2026', reason: 'Keperluan keluarga', status: 'Menunggu Manager', tone: 'blue' },
	{ requester: 'Agung Purnomo', type: 'Annual Leave', period: '08 - 09 Apr 2026', reason: 'Pernikahan saudara', status: 'Rejected', tone: 'red' }
];

export const personalLeaveRequests = [
	{ requester: 'Maya Putri', type: 'Permit', period: '04 Apr 2026', reason: 'Kontrol dokter', status: 'Menunggu Manager', tone: 'amber' },
	{ requester: 'Maya Putri', type: 'Annual Leave', period: '21 - 22 Mar 2026', reason: 'Liburan keluarga', status: 'Approved', tone: 'green' },
	{ requester: 'Maya Putri', type: 'Permit', period: '12 Mar 2026', reason: 'Keperluan administrasi', status: 'Approved', tone: 'blue' }
];

export const leaveFlow = [
	'Karyawan pilih tanggal dan isi alasan pengajuan',
	'Manager melakukan approval awal',
	'HR memvalidasi kuota dan kebijakan',
	'Status final otomatis tampil di dashboard pengguna'
];

export const overtimeSummaryByRole = {
	hrd: [
		{ label: 'Request masuk', value: '14', note: '42 jam lembur diajukan', tone: 'blue' },
		{ label: 'Approved hours', value: '31 jam', note: 'Sebagian besar dari engineering', tone: 'green' },
		{ label: 'Estimasi biaya', value: formatCurrency(12400000), note: 'Akan masuk payroll April', tone: 'amber' }
	],
	boss: [
		{ label: 'Biaya lembur', value: formatCurrency(12400000), note: 'Naik 18% dari minggu lalu', tone: 'amber' },
		{ label: 'Request prioritas', value: '4', note: 'Terkait release produk dan event sales', tone: 'blue' },
		{ label: 'Approved hours', value: '31 jam', note: 'Masih dalam budget operasional', tone: 'green' }
	],
	employee: [
		{ label: 'Lembur bulan ini', value: '11 jam', note: '8 jam sudah approved', tone: 'blue' },
		{ label: 'Request aktif', value: '1', note: 'Menunggu manager sejak kemarin', tone: 'amber' },
		{ label: 'Estimasi payout', value: formatCurrency(675000), note: 'Masuk payroll bulan berjalan', tone: 'green' }
	]
};

export const teamOvertimeRows = [
	{ requester: 'Dimas Pratama', date: '28 Mar 2026', duration: '6 jam', reason: 'Sprint release', status: 'Approved', tone: 'green' },
	{ requester: 'Sarah Wijaya', date: '30 Mar 2026', duration: '4 jam', reason: 'Campaign launch', status: 'Menunggu manager', tone: 'amber' },
	{ requester: 'Agus Prabowo', date: '31 Mar 2026', duration: '5 jam', reason: 'Client presentation', status: 'Approved', tone: 'blue' },
	{ requester: 'Lina Hartati', date: '01 Apr 2026', duration: '3 jam', reason: 'Payroll final check', status: 'Menunggu HR', tone: 'slate' }
];

export const personalOvertimeRows = [
	{ requester: 'Maya Putri', date: '28 Mar 2026', duration: '3 jam', reason: 'Design QA release', status: 'Approved', tone: 'green' },
	{ requester: 'Maya Putri', date: '26 Mar 2026', duration: '2 jam', reason: 'Workshop preparation', status: 'Approved', tone: 'blue' },
	{ requester: 'Maya Putri', date: '01 Apr 2026', duration: '4 jam', reason: 'Prototype handoff', status: 'Menunggu manager', tone: 'amber' }
];

export const hrdApprovals = [
	{ title: 'Payroll final April 2026', owner: 'Finance + HR', impact: formatCurrency(684500000), status: 'Needs review', tone: 'red' },
	{ title: 'Cuti Elena Rodriguez', owner: 'Operations', impact: '3 hari', status: 'Waiting HR', tone: 'amber' },
	{ title: 'Lembur Dimas Pratama', owner: 'Engineering', impact: '6 jam', status: 'Escalated', tone: 'blue' },
	{ title: 'Izin Sophia Kim', owner: 'Sales', impact: '4 jam', status: 'Waiting manager', tone: 'slate' }
];

export const bossApprovals = [
	{ title: 'Payroll final April 2026', owner: 'HRD', impact: formatCurrency(684500000), status: 'Decision', tone: 'red' },
	{ title: 'Cuti supervisor gudang', owner: 'Operations', impact: '3 hari', status: 'Risk to schedule', tone: 'amber' },
	{ title: 'Lembur sprint engineering', owner: 'Engineering', impact: formatCurrency(3200000), status: 'Budget check', tone: 'blue' }
];

export const approvalMetricsByRole = {
	hrd: [
		{ label: 'Menunggu approval', value: '12', note: '4 masuk SLA merah', tone: 'amber' },
		{ label: 'Selesai hari ini', value: '19', note: 'Naik 22% dari kemarin', tone: 'green' },
		{ label: 'Avg. response time', value: '1,4 hari', note: 'Target di bawah 1 hari', tone: 'blue' }
	],
	boss: [
		{ label: 'Butuh keputusan owner', value: '3', note: '1 payroll final, 2 request kritikal', tone: 'amber' },
		{ label: 'Dampak budget', value: formatCurrency(15600000), note: 'Akumulasi item menunggu approval', tone: 'blue' },
		{ label: 'Operasional berisiko', value: '2 item', note: 'Terutama area gudang dan sales', tone: 'green' }
	]
};

export const payrollMetricsByRole = {
	hrd: [
		{ label: 'Periode aktif', value: 'Apr 2026', note: 'Closing 03 Apr 2026', tone: 'blue' },
		{ label: 'Karyawan terproses', value: '84 / 92', note: '8 masih perlu pengecekan tunjangan', tone: 'amber' },
		{ label: 'THP sementara', value: formatCurrency(684500000), note: 'Sudah termasuk lembur 31 jam', tone: 'green' }
	],
	boss: [
		{ label: 'Total payroll', value: formatCurrency(684500000), note: 'Naik 6,4% vs bulan lalu', tone: 'blue' },
		{ label: 'Variance to budget', value: '+2,1%', note: 'Masih dalam ambang yang disetujui', tone: 'green' },
		{ label: 'Item belum final', value: '8 komponen', note: 'Mayoritas tunjangan baru sales', tone: 'amber' }
	]
};

export const payrollStages = [
	{ label: 'Drafting', note: 'Tarik data absensi dan lembur', state: 'done' },
	{ label: 'Review', note: 'Cek komponen gaji & potongan', state: 'active' },
	{ label: 'Approval', note: 'Butuh persetujuan owner', state: 'pending' },
	{ label: 'Finalized', note: 'Publikasi slip gaji', state: 'pending' }
];

export const payrollRows = [
	{ name: 'Nadia Prameswari', base: 12500000, allowance: 1800000, overtime: 0, deduction: 350000, total: 13950000, status: 'Ready' },
	{ name: 'Dimas Pratama', base: 9800000, allowance: 1250000, overtime: 950000, deduction: 200000, total: 11800000, status: 'Ready' },
	{ name: 'Elena Rodriguez', base: 8900000, allowance: 900000, overtime: 0, deduction: 175000, total: 9625000, status: 'Needs review' },
	{ name: 'Farhan Naufal', base: 7200000, allowance: 800000, overtime: 425000, deduction: 145000, total: 8280000, status: 'Ready' }
];

export const payrollBreakdown = [
	{ label: 'Gaji pokok', value: formatCurrency(532000000), share: 78, tone: 'blue' },
	{ label: 'Tunjangan', value: formatCurrency(91300000), share: 46, tone: 'green' },
	{ label: 'Bonus', value: formatCurrency(22500000), share: 18, tone: 'slate' },
	{ label: 'Lembur', value: formatCurrency(12400000), share: 12, tone: 'amber' },
	{ label: 'Potongan', value: formatCurrency(7370000), share: 9, tone: 'red' }
];

export const featuredPayslipByRole = {
	hrd: { eyebrow: 'Batch slip payroll', title: '84 slip gaji siap dipublikasikan', amount: formatCurrency(684500000), meta: '97% slip berhasil digenerate otomatis. Sisa batch menunggu approval owner.', chips: ['PDF ready', 'Draft 78%', '1 approval final'] },
	employee: { eyebrow: 'Slip terbaru', title: 'Slip gaji Maret 2026', amount: formatCurrency(8750000), meta: 'Take-home pay final sudah tersedia, lengkap dengan rincian komponen dan arsip PDF pribadi.', chips: ['Transfer sukses', 'PDF ready', '1 potongan aktif'] }
};

export const payslipDetailsByRole = {
	hrd: [
		{ label: 'Slip berhasil digenerate', value: '84 dokumen' },
		{ label: 'Antrian publikasi', value: '8 dokumen' },
		{ label: 'Karyawan tanpa rekening valid', value: '3 orang' }
	],
	employee: [
		{ label: 'Gaji pokok', value: formatCurrency(7200000) },
		{ label: 'Tunjangan & bonus', value: formatCurrency(1900000) },
		{ label: 'Potongan', value: formatCurrency(350000) }
	]
};

export const teamPayslips = [
	{ subject: 'Payroll April 2026', detail: '84 slip siap kirim', amount: formatCurrency(684500000), status: 'Menunggu approval', tone: 'amber' },
	{ subject: 'Payroll Maret 2026', detail: '92 slip dipublikasikan', amount: formatCurrency(658300000), status: 'Published', tone: 'green' },
	{ subject: 'Payroll Februari 2026', detail: '89 slip dipublikasikan', amount: formatCurrency(641100000), status: 'Published', tone: 'blue' }
];

export const personalPayslips = [
	{
		id: 'payslip-2026-03',
		subject: 'Maret 2026',
		title: 'Slip gaji Maret 2026',
		eyebrow: 'Slip terbaru',
		detail: 'THP final + bonus kinerja',
		amount: formatCurrency(8750000),
		status: 'Ready to download',
		tone: 'green',
		meta: 'Take-home pay final sudah tersedia, termasuk bonus kinerja bulan ini dan arsip PDF pribadi.',
		chips: ['Transfer sukses', 'PDF ready', '1 potongan aktif'],
		details: [
			{ label: 'Gaji pokok', value: formatCurrency(7200000) },
			{ label: 'Tunjangan & bonus', value: formatCurrency(1900000) },
			{ label: 'Potongan', value: formatCurrency(350000) }
		]
	},
	{
		id: 'payslip-2026-02',
		subject: 'Februari 2026',
		title: 'Slip gaji Februari 2026',
		eyebrow: 'Arsip slip',
		detail: 'THP final',
		amount: formatCurrency(8425000),
		status: 'Available',
		tone: 'blue',
		meta: 'Slip final Februari tersimpan rapi dan siap dibuka kembali untuk keperluan administrasi.',
		chips: ['Arsip aman', 'Transfer sukses', 'PDF ready'],
		details: [
			{ label: 'Gaji pokok', value: formatCurrency(7200000) },
			{ label: 'Tunjangan & bonus', value: formatCurrency(1550000) },
			{ label: 'Potongan', value: formatCurrency(325000) }
		]
	},
	{
		id: 'payslip-2026-01',
		subject: 'Januari 2026',
		title: 'Slip gaji Januari 2026',
		eyebrow: 'Arsip slip',
		detail: 'THP final',
		amount: formatCurrency(8325000),
		status: 'Available',
		tone: 'slate',
		meta: 'Arsip payroll Januari tetap tersedia untuk download dan pengecekan histori komponen gaji.',
		chips: ['Arsip aman', 'PDF ready', 'Finalized'],
		details: [
			{ label: 'Gaji pokok', value: formatCurrency(7200000) },
			{ label: 'Tunjangan & bonus', value: formatCurrency(1450000) },
			{ label: 'Potongan', value: formatCurrency(325000) }
		]
	}
];

export const reportCards = [
	{ id: 'report-attendance', title: 'Laporan absensi', note: 'Hadir, telat, cuti, izin, alpha', action: 'Unduh CSV', tone: 'blue', moduleId: 'attendance', delivery: 'CSV export' },
	{ id: 'report-leave', title: 'Laporan cuti', note: 'Saldo cuti dan histori request', action: 'Buka detail', tone: 'green', moduleId: 'leave', delivery: 'Detail preview' },
	{ id: 'report-overtime', title: 'Laporan lembur', note: 'Jam lembur dan biaya payroll', action: 'Lihat ringkasan', tone: 'amber', moduleId: 'overtime', delivery: 'Summary view' },
	{ id: 'report-payroll', title: 'Laporan payroll', note: 'THP, komponen gaji, varians', action: 'Export PDF', tone: 'slate', moduleId: 'payroll', delivery: 'PDF export' },
	{ id: 'report-employees', title: 'Karyawan aktif', note: 'Data pekerja aktif per divisi', action: 'Buka direktori', tone: 'blue', moduleId: 'employees', delivery: 'Directory drilldown' }
];

export const reportKpisByRole = {
	hrd: [
		{ label: 'Waktu proses payroll', progress: 54, note: '54% lebih cepat dari proses manual.', tone: 'green' },
		{ label: 'Adopsi self-service', progress: 80, note: 'Target 80% karyawan aktif.', tone: 'blue' },
		{ label: 'Approval via aplikasi', progress: 90, note: 'Chat manual tinggal 10% dari total request.', tone: 'amber' }
	],
	boss: [
		{ label: 'Visibilitas payroll', progress: 88, note: 'Owner bisa pantau biaya dalam satu layar.', tone: 'blue' },
		{ label: 'Efisiensi approval', progress: 73, note: 'Masih ada bottleneck di level supervisor.', tone: 'amber' },
		{ label: 'Stabilitas operasional', progress: 91, note: 'Coverage tim aman walau ada cuti bergulir.', tone: 'green' }
	]
};

export const reportCadence = [
	'Daily: absensi hari ini, request pending, kehadiran divisi',
	'Weekly: tren keterlambatan, lembur, dan approval backlog',
	'Monthly: payroll final, slip gaji, dan karyawan aktif',
	'Quarterly: budget payroll dan perubahan headcount'
];
