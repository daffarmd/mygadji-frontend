PRD — MyGadji
1. Nama Produk

MyGadji

2. Ringkasan Produk

MyGadji adalah aplikasi manajemen karyawan dan penggajian yang digunakan oleh HRD, boss/owner/manager, dan karyawan dalam satu platform. Aplikasi ini membantu perusahaan mengelola data karyawan, absensi, cuti, izin, lembur, approval, dan payroll secara lebih cepat, transparan, dan terpusat.

3. Latar Belakang

Banyak perusahaan kecil hingga menengah masih mengelola HR secara manual menggunakan spreadsheet, chat, dan dokumen terpisah. Hal ini menimbulkan masalah seperti:

data karyawan tidak rapi
proses payroll lambat
rekap absensi manual
approval cuti/izin berantakan
karyawan harus bertanya ke HR untuk kebutuhan dasar seperti slip gaji atau sisa cuti
boss sulit melihat kondisi tim dan biaya SDM secara cepat

MyGadji dibuat untuk menyederhanakan proses tersebut dalam satu sistem.

4. Tujuan Produk

Tujuan utama MyGadji:

mempermudah HRD dalam operasional SDM
memberi visibilitas bagi boss terhadap kondisi karyawan dan biaya payroll
memberi akses self-service bagi karyawan
mengurangi pekerjaan manual dan human error
membuat proses HR lebih cepat, terdokumentasi, dan transparan
5. Target Pengguna
5.1 HRD

Kebutuhan utama:

mengelola data karyawan
memproses payroll
memantau absensi, cuti, izin, lembur
membuat laporan
5.2 Boss / Owner / Manager

Kebutuhan utama:

melihat dashboard ringkasan perusahaan
melakukan approval
memantau biaya payroll
melihat performa tim dan status operasional
5.3 Karyawan

Kebutuhan utama:

absen masuk/pulang
melihat slip gaji
mengajukan cuti/izin/lembur
melihat sisa cuti dan riwayat absensi
mengakses data pribadi
6. Problem Statement

Saat ini proses HR dalam banyak perusahaan belum efisien karena:

data tersebar di banyak tempat
approval masih lewat chat
payroll rawan salah hitung
karyawan tidak punya akses mandiri terhadap data mereka
owner tidak punya dashboard real-time terkait SDM

MyGadji harus menjadi solusi terpusat yang mudah digunakan oleh semua pihak.

7. Ruang Lingkup Produk
7.1 In Scope (MVP)

Fitur yang masuk versi awal:

login dan role-based access
manajemen data karyawan
absensi check-in/check-out
pengajuan cuti dan izin
pengajuan lembur
approval oleh atasan / HR
payroll sederhana
slip gaji
dashboard per role
laporan dasar HR
7.2 Out of Scope (fase berikutnya)

Belum masuk MVP:

integrasi bank
integrasi fingerprint machine
reimbursement
performance review lengkap
onboarding/offboarding flow
e-signature dokumen
AI assistant
training management
8. Peran Pengguna dan Hak Akses
8.1 Super Admin
mengatur perusahaan
mengatur role pengguna
akses penuh seluruh modul
8.2 HRD
kelola data karyawan
kelola absensi
kelola cuti/izin/lembur
proses payroll
generate slip gaji
lihat laporan
8.3 Boss / Owner
lihat dashboard keseluruhan
lihat laporan payroll
lihat jumlah karyawan
approve request tertentu
lihat insight operasional
8.4 Manager / Supervisor
lihat anggota timnya
approve cuti/izin/lembur bawahan
lihat absensi tim
8.5 Karyawan
lihat data pribadi
absen masuk/pulang
ajukan cuti/izin/lembur
lihat slip gaji
lihat riwayat absensi dan sisa cuti
9. User Stories
9.1 HRD
Sebagai HRD, saya ingin menambah dan mengedit data karyawan agar database perusahaan selalu rapi.
Sebagai HRD, saya ingin melihat rekap absensi agar mudah memproses payroll.
Sebagai HRD, saya ingin menghitung gaji bulanan agar proses penggajian lebih cepat.
Sebagai HRD, saya ingin membuat slip gaji agar dapat dibagikan ke karyawan.
9.2 Boss / Owner
Sebagai boss, saya ingin melihat total payroll bulanan agar bisa memantau biaya tenaga kerja.
Sebagai boss, saya ingin melihat jumlah karyawan aktif agar mengetahui kapasitas tim.
Sebagai boss, saya ingin approve cuti/lembur agar proses berjalan terkontrol.
9.3 Karyawan
Sebagai karyawan, saya ingin check-in dan check-out dari aplikasi agar absensi saya tercatat.
Sebagai karyawan, saya ingin melihat slip gaji saya agar tidak perlu meminta ke HR.
Sebagai karyawan, saya ingin mengajukan cuti dan izin dari aplikasi agar proses lebih cepat.
Sebagai karyawan, saya ingin melihat sisa cuti agar bisa merencanakan pengajuan.
10. Fitur Utama MVP
10.1 Authentication & Authorization

Deskripsi:

pengguna login menggunakan email/nomor HP dan password
sistem membedakan akses berdasarkan role

Kebutuhan:

login
logout
lupa password
role-based access control
10.2 Employee Management

Deskripsi:
HRD dapat mengelola seluruh data karyawan.

Data utama:

nama lengkap
NIK / ID karyawan
email
nomor HP
alamat
jabatan
divisi
atasan
tanggal masuk
status kerja
gaji pokok
nomor rekening
dokumen pendukung

Fungsi:

tambah karyawan
edit karyawan
nonaktifkan karyawan
lihat detail karyawan
cari dan filter karyawan
10.3 Attendance / Absensi

Deskripsi:
Karyawan dapat mencatat kehadiran harian melalui aplikasi.

Fungsi:

check-in
check-out
catatan waktu masuk/pulang
status hadir, telat, izin, cuti, alpha
riwayat absensi
rekap absensi untuk HRD

Opsional MVP ringan:

lokasi GPS
selfie attendance
10.4 Leave & Permit

Deskripsi:
Karyawan mengajukan cuti dan izin, lalu diproses atasan/HR.

Fungsi:

ajukan cuti
ajukan izin
pilih tanggal
isi alasan
lihat status pengajuan
approve / reject oleh atasan
kuota cuti tahunan
10.5 Overtime / Lembur

Deskripsi:
Karyawan dapat mengajukan lembur dan atasan dapat menyetujuinya.

Fungsi:

ajukan lembur
tanggal dan durasi lembur
alasan lembur
approval atasan / HR
rekap lembur untuk payroll
10.6 Payroll

Deskripsi:
HRD memproses penggajian berdasarkan data gaji, absensi, dan lembur.

Komponen payroll:

gaji pokok
tunjangan
bonus
potongan
lembur
total take-home pay

Fungsi:

buat periode payroll
hitung payroll per karyawan
edit komponen gaji
finalisasi payroll
status payroll

Catatan:
untuk MVP, pajak dan BPJS bisa dibuat sederhana atau manual input dulu.

10.7 Payslip / Slip Gaji

Deskripsi:
Setelah payroll final, karyawan bisa melihat slip gaji masing-masing.

Isi slip gaji:

nama
periode
gaji pokok
tunjangan
bonus
potongan
lembur
total diterima

Fungsi:

generate slip gaji
lihat slip gaji
download slip gaji
10.8 Approval Center

Deskripsi:
Semua approval masuk ke satu tempat agar lebih mudah ditindaklanjuti.

Jenis approval:

cuti
izin
lembur
payroll final

Fungsi:

daftar request menunggu
approve
reject
catatan approval
10.9 Dashboard

Deskripsi:
Setiap role mendapatkan dashboard sesuai kebutuhannya.

Dashboard HRD
jumlah karyawan aktif
absensi hari ini
pengajuan pending
payroll bulan ini
kontrak yang mendekati habis
Dashboard Boss
total karyawan
total payroll bulan ini
approval pending
ringkasan absensi
ringkasan divisi
Dashboard Karyawan
status absensi hari ini
sisa cuti
slip gaji terakhir
pengajuan terbaru
10.10 Reporting

Deskripsi:
HRD dan boss dapat melihat laporan dasar.

Laporan MVP:

laporan absensi
laporan cuti
laporan lembur
laporan payroll
laporan data karyawan aktif
11. Alur Pengguna
11.1 Alur Karyawan

Login → Dashboard → Absen / Ajukan cuti / Lihat slip gaji / Lihat profil

11.2 Alur HRD

Login → Dashboard HR → Kelola data karyawan → Cek absensi → Proses payroll → Generate slip gaji → Unduh laporan

11.3 Alur Boss

Login → Dashboard boss → Lihat ringkasan perusahaan → Approve request → Lihat laporan payroll dan tim

12. Kebutuhan Fungsional
Sistem harus memungkinkan pengguna login sesuai role.
Sistem harus memungkinkan HRD menambah, mengubah, dan menonaktifkan data karyawan.
Sistem harus memungkinkan karyawan melakukan check-in dan check-out.
Sistem harus mencatat waktu absensi setiap karyawan.
Sistem harus memungkinkan karyawan mengajukan cuti, izin, dan lembur.
Sistem harus memungkinkan atasan/HRD menyetujui atau menolak pengajuan.
Sistem harus memungkinkan HRD membuat payroll berdasarkan komponen gaji.
Sistem harus menghasilkan slip gaji untuk tiap karyawan.
Sistem harus menyediakan dashboard berbeda sesuai role.
Sistem harus menyediakan laporan dasar untuk absensi, cuti, lembur, dan payroll.
13. Kebutuhan Non-Fungsional
aplikasi harus mudah digunakan oleh pengguna non-teknis
respons halaman utama maksimal dalam beberapa detik pada koneksi normal
data payroll dan data pribadi harus aman
sistem harus punya hak akses berbasis role
histori perubahan penting harus tercatat
sistem harus mobile-friendly jika berbasis web
14. KPI Keberhasilan Produk

KPI awal yang bisa dipakai:

waktu proses payroll berkurang minimal 50%
80% karyawan aktif menggunakan fitur self-service
90% pengajuan cuti/izin diproses lewat aplikasi, bukan chat manual
tingkat kesalahan rekap absensi menurun signifikan
HRD bisa generate slip gaji seluruh karyawan dalam 1 alur kerja
15. Asumsi Produk
target awal adalah perusahaan kecil sampai menengah
struktur organisasi minimal punya HRD, atasan, dan karyawan
perusahaan sudah memiliki data karyawan dasar
payroll awal belum perlu integrasi bank
pengguna terbiasa memakai smartphone dan web app
16. Risiko Produk
aturan payroll tiap perusahaan bisa berbeda
user adoption rendah jika UI terlalu rumit
data awal karyawan mungkin tidak lengkap
absensi berbasis lokasi bisa bermasalah jika GPS lemah
approval bisa macet jika alurnya terlalu panjang

Mitigasi:

mulai dari payroll sederhana dan fleksibel
buat UI sangat simpel
sediakan import data karyawan
sediakan fallback absensi manual untuk HR
approval flow dibuat singkat
17. Prioritas Fitur
P0 — Wajib untuk MVP
login & role
data karyawan
absensi
cuti/izin
approval
payroll sederhana
slip gaji
dashboard dasar
P1 — Setelah MVP
GPS attendance
lembur lebih detail
export laporan
notifikasi email/WA
kontrak kerja & dokumen
P2 — Fase Lanjutan
performance review
reimbursement
onboarding/offboarding
AI insight
integrasi bank / fingerprint
18. Rekomendasi Platform

Versi awal paling aman:

web app responsive untuk HRD dan boss
mobile-friendly untuk karyawan

Kalau nanti berkembang:

mobile app khusus karyawan
web admin untuk HRD dan boss
19. Definisi Sukses MVP

MVP dianggap berhasil jika:

HRD bisa mengelola data karyawan dari satu sistem
karyawan bisa absen dan melihat slip gaji sendiri
boss bisa melihat dashboard dan approval
payroll bulanan bisa diproses dari sistem tanpa Excel sebagai alat utama
20. Penutup

MyGadji diposisikan sebagai aplikasi HR dan payroll yang sederhana namun berguna bagi tiga pihak utama: HRD, boss, dan karyawan. Fokus MVP adalah menyelesaikan kebutuhan paling inti: data karyawan, absensi, pengajuan, approval, payroll, dan slip gaji.