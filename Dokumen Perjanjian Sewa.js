function generatePDF() {

    let nomor, tgl, nama1, jabatan, status1, alamat1, nama2, alamat2, usaha, jenis, besaran_sewa;
    let tbl_nama_perangkat, tbl_kib, tbl_kode_barang, tbl_nama_barang, tbl_reg, tbl_lokasi, tbl_luas, tbl_ket;
    let nama1_out, nama2_out, jenis_out, jabatan_out, status1_out;
    let hari, tanggal, bulan, tahun, terbilang, hariLower, bulanLower;

    // ===== AMBIL DATA FORM =====
    try {
        console.log('Mengambil data form...');
        
        nomor = document.getElementById('nomor')?.value || '';
        tgl = document.getElementById('tgl')?.value || new Date().toISOString().split('T')[0];
        nama1 = document.getElementById('nama1')?.value || '';
        jabatan = document.getElementById('jabatan')?.value || '';
        status1 = document.getElementById('status1')?.value || '';
        alamat1 = document.getElementById('alamat1')?.value || '';
        nama2 = document.getElementById('nama2')?.value || '';
        alamat2 = document.getElementById('alamat2')?.value || '';
        usaha = document.getElementById('usaha')?.value || '';
        jenis = document.getElementById('jenis')?.value || '';
        besaran_sewa = parseInt(document.getElementById('besaran_sewa')?.value) || 0;
        
        tbl_nama_perangkat = document.getElementById('tbl_nama_perangkat')?.value || '';
        tbl_kib = document.getElementById('tbl_kib')?.value || '';
        tbl_kode_barang = document.getElementById('tbl_kode_barang')?.value || '';
        tbl_nama_barang = document.getElementById('tbl_nama_barang')?.value || '';
        tbl_reg = document.getElementById('tbl_reg')?.value || '';
        tbl_lokasi = document.getElementById('tbl_lokasi')?.value || '';
        tbl_luas = document.getElementById('tbl_luas')?.value || '';
        tbl_ket = document.getElementById('tbl_ket')?.value || '';
        
        console.log('Data yang diambil:', {
            nama1, nama2, usaha, jenis, besaran_sewa,
            tbl_nama_perangkat
        });
    } catch (e) {
        alert('ERROR: Gagal mengambil data form.\n' + e.message);
        console.error('Form data error:', e);
        return;
    }

    // ===== VALIDASI DATA =====
    // validate required fields (all except "nomor")
    const requiredIds = ['tgl','nama1','jabatan','status1','alamat1','nama2','alamat2','usaha','jenis','besaran_sewa','tbl_no','tbl_nama_perangkat','tbl_kib','tbl_kode_barang','tbl_nama_barang','tbl_reg','tbl_lokasi','tbl_luas','tbl_ket'];
    const labels = {
        tgl: 'Tanggal Perjanjian',
        usaha: 'Kegiatan Usaha',
        nama1: 'Nama Pihak Kesatu',
        jabatan: 'Jabatan Pihak Kesatu',
        alamat1: 'Alamat Instansi Pihak Kesatu',
        nama2: 'Nama Pihak Kedua',
        alamat2: 'Alamat Pihak Kedua',
        status1: 'Status Barang',
        jenis: 'Jenis Barang',
        besaran_sewa: 'Besaran Sewa',
        tbl_no: 'No.',
        tbl_nama_perangkat: 'Nama Perangkat',
        tbl_kib: 'KIB',
        tbl_kode_barang: 'Kode Barang',
        tbl_nama_barang: 'Nama Barang',
        tbl_reg: 'Reg',
        tbl_lokasi: 'Lokasi',
        tbl_luas: 'Luas (m²)',
        tbl_ket: 'Ket.'
    };
    for (let id of requiredIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const val = el.value.trim();
        if (val === '') {
            const name = id.startsWith('tbl_') ? 'Tabel Objek Sewa - ' + labels[id] : labels[id];
            alert('Mohon lengkapi semua data. ' + name + ' tidak boleh kosong.');
            el.focus();
            return;
        }
    }

    // Validasi besaran sewa tidak negatif
    if (besaran_sewa < 0) {
        alert('Besaran sewa tidak boleh negatif.');
        document.getElementById('besaran_sewa').focus();
        return;
    }

    // Validasi KIB (A-F, kapital)
    if (!/^[A-Fa-f]$/.test(tbl_kib)) {
        alert('KIB harus berupa 1 huruf (A-F) saja.');
        document.getElementById('tbl_kib').focus();
        return;
    }
    tbl_kib = tbl_kib.toUpperCase();

    // Validasi Kode Barang (angka dan titik)
    if (tbl_kode_barang && !/^[0-9.]*$/.test(tbl_kode_barang)) {
        alert('Kode Barang hanya boleh berisi angka dan titik.');
        document.getElementById('tbl_kode_barang').focus();
        return;
    }

    // Validasi REG (1-4 karakter angka)
    if (!/^[0-9]{1,4}$/.test(tbl_reg)) {
        alert('REG hanya boleh berisi 1-4 karakter angka.');
        document.getElementById('tbl_reg').focus();
        return;
    }

    // Validasi Luas (angka saja)
    if (!/^[0-9]+$/.test(tbl_luas)) {
        alert('Luas hanya boleh berisi angka.');
        document.getElementById('tbl_luas').focus();
        return;
    }

    console.log('Validasi berhasil');

    // ===== PROSES DATA =====
    try {
        console.log('✓ STEP 4: Memproses data...');
        
        nama1_out = nama1.toUpperCase();
        nama2_out = nama2.toUpperCase();
        jenis_out = jenis.toLowerCase();
        
        function toTitleCase(str) {
            return str.toLowerCase().split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        jabatan_out = toTitleCase(jabatan);
        status1_out = status1.charAt(0).toUpperCase() + status1.slice(1);
        
        // Parse tanggal
        const now = new Date(tgl);
        const hariNames = ['minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const bulanNames = ['januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        hari = hariNames[now.getDay()]?.toLowerCase() || 'senin';
        hariLower = hari;
        tanggal = now.getDate();
        bulan = bulanNames[now.getMonth()]?.toLowerCase() || 'januari';
        bulanLower = bulan;
        tahun = now.getFullYear();
        
        console.log('Data yang diproses:', {
            nama1_out, nama2_out, hari, tanggal, bulan, tahun
        });
        
        // Terbilang
        terbilang = function(n) {
            const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
            if (n < 12) return satuan[n] || '';
            if (n < 20) return terbilang(n - 10) + ' belas';
            if (n < 100) return terbilang(Math.floor(n / 10)) + ' puluh' + (n % 10 ? ' ' + terbilang(n % 10) : '');
            if (n < 200) return 'seratus' + (n - 100 ? ' ' + terbilang(n - 100) : '');
            if (n < 1000) return terbilang(Math.floor(n / 100)) + ' ratus' + (n % 100 ? ' ' + terbilang(n % 100) : '');
            if (n < 2000) return 'seribu' + (n - 1000 ? ' ' + terbilang(n - 1000) : '');
            if (n < 1000000) return terbilang(Math.floor(n / 1000)) + ' ribu' + (n % 1000 ? ' ' + terbilang(n % 1000) : '');
            if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + ' juta' + (n % 1000000 ? ' ' + terbilang(n % 1000000) : '');
            if (n < 1000000000000) return terbilang(Math.floor(n / 1000000000)) + ' miliar' + (n % 1000000000 ? ' ' + terbilang(n % 1000000000) : '');
            return terbilang(Math.floor(n / 1000000000000)) + ' triliun' + (n % 1000000000000 ? ' ' + terbilang(n % 1000000000000) : '');
        };
        
        console.log('Data siap diproses');
    } catch (e) {
        alert('ERROR memproses data: ' + e.message);
        console.error('Process error:', e);
        return;
    }

    // ===== BUILD DOCUMENT =====
    try {
        console.log('Generate PDF');
        
        const docContent = [];
        
        // Header
        docContent.push({ text: 'PERJANJIAN SEWA', style: 'title' });
        docContent.push({ text: 'BARANG MILIK DAERAH BERUPA TANAH MILIK PEMERINTAH KABUPATEN', style: 'subtitle' });
        docContent.push({ text: 'KARANGANYAR YANG DIGUNAKAN UNTUK ' + usaha.toUpperCase(), margin: [0,0,0,10], style: 'subtitle' });
        docContent.push({ text: 'Nomor : ' + nomor, margin: [0,0,0,10], style: 'nomor' });
        // Tanggal
        docContent.push({
            text: 'Pada hari ini ' + hariLower + ' tanggal ' + terbilang(tanggal) + ' bulan ' + bulanLower + ' tahun ' + terbilang(tahun) + ', bertempat di Kantor Bupati Karanganyar, kami yang bertanda tangan di bawah ini:',
            style: 'bodyText',
            alignment: 'justify'
        });

        // Pihak
        docContent.push({
            table: {
                widths: ['auto', 135, 'auto', '*'],
                body: [
                    [
                        { text: '1.', alignment: 'left' },
                        { text: nama1_out, alignment: 'left' },
                        { text: ' : ', alignment: 'left' },
                        { text: jabatan_out + ' selaku ' + status1_out + ' Barang Milik Daerah, yang dalam hal ini bertindak untuk dan atas nama Pemerintah Kabupaten Karanganyar yang berkedudukan di ' + alamat1 + ', yang selanjutnya disebut PIHAK KESATU.', alignment: 'justify' }
                    ],
                    [
                        { text: '2.', alignment: 'left' },
                        { text: nama2_out, alignment: 'left' },
                        { text: ' : ', alignment: 'left' },
                        { text: 'Penyewa ' + jenis_out + ' yang berkedudukan di ' + alamat2 + ', yang selanjutnya disebut PIHAK KEDUA.', alignment: 'justify' }
                    ]
                ]
            },
            layout: 'noBorders',
            style: 'bodyText'
        });

        docContent.push({
            text: 'PIHAK KESATU dan PIHAK KEDUA yang secara bersama-sama selanjutnya disebut PARA PIHAK, sepakat untuk mengikat diri dalam Perjanjian Sewa sebagai bentuk pemanfaatan Barang Milik Daerah Pemerintah Kabupaten Karanganyar dengan mendasarkan pada:',
            style: 'bodyText',
            alignment: 'justify'
        });


        // Dasar hukum
        const peraturan = [
            'Undang\u2011Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali terakhir dengan Undang\u2011Undang Nomor 6 Tahun 2023 tentang Penetapan Peraturan Pemerintah Pengganti Undang\u2011Undang Nomor 2 Tahun 2022 tentang Cipta Kerja menjadi Undang\u2011Undang;',
            'Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah sebagaimana diubah dengan Peraturan Pemerintah Nomor 28 Tahun 2020 tentang Perubahan atas Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah;',
            'Peraturan Menteri Dalam Negeri Republik Indonesia Nomor 19 Tahun 2016 tentang Pedoman Pengelolaan Barang Milik Daerah sebagaimana telah diubah dengan Peraturan Menteri Dalam Negeri Republik Indonesia Nomor 7 Tahun 2024 tentang Perubahan Atas Peraturan Menteri Dalam Negeri Nomor 19 Tahun 2016 tentang Pedoman Pengelolaan Barang Milik Daerah;',
            'Peraturan Daerah Nomor 1 Tahun 2019 tentang Pengelolaan Barang Milik Daerah sebagaimana diubah dengan Peraturan Daerah Nomor 8 Tahun 2025 tentang Perubahan atas Peraturan Daerah Nomor 1 Tahun 2019 tentang Pengelolaan Barang Milik Daerah;',
            'Peraturan Bupati Nomor 90 Tahun 2021 tentang Tata Cara Pelaksanaan Pemanfaatan Barang Milik Daerah sebagaimana telah diubah dengan Peraturan Bupati Nomor 900/39 Tahun 2022 tentang Perubahan atas Peraturan Bupati Karanganyar Nomor 90 Tahun 2021 tentang Tata Cara Pelaksanaan Pemanfaatan Barang Milik Daerah;',
            'Keputusan Bupati Nomor 900/338 Tahun 2025 tentang Penetapan Besaran Sewa Barang Milik Daerah berupa Tanah Non Pertanian dan Bangunan pada Sekretariat Daerah, Badan Keuangan Daerah dan Kecamatan Karanganyar.'
        ];

        let peraturanTableBody = peraturan.map((item, idx) => [
            { text: (idx + 1) + '.  ', alignment: 'left' },
            { text: item, alignment: 'justify', margin: [4, 0, 0, 0] }
        ]);

        docContent.push({
            table: {
                widths: ['auto', '*'],
                body: peraturanTableBody
            },
            layout: {
                defaultBorder: false,
                paddingLeft: function(i) { return i === 0 ? 0 : 5; },
                paddingRight: function(i, node) { return -1; },
                paddingTop: function(i, node) { return 0; },
                paddingBottom: function(i, node) { return 0; }
            },
            style: 'bodyText'
        });

        docContent.push({
            text: 'Berdasarkan hal tersebut di atas, PARA PIHAK sepakat untuk melakukan Perjanjian Sewa Barang Milik Daerah berupa ' + jenis_out + ' dengan syarat dan ketentuan sebagai berikut:',
            style: 'bodyText',
            alignment: 'justify'
        });

        // Page break & BAB I
        docContent.push({ text: 'BAB I', margin: [0, 10, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'OBJEK DAN PEMANFAATAN', style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 1', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });

        // Klausa (1)
        docContent.push({
            table: {
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(1)', style: 'clauseNumber', border: [false, false, false, false] },
                        { text: 'PIHAK KESATU menyewakan kepada PIHAK KEDUA berupa ' + jenis_out + ' milik PIHAK KESATU sebagai berikut:', style: 'bodyText', alignment: 'justify', border: [false, false, false, false] }
                    ]
                ]
            },
            layout: {
                hLineWidth: function(i, node) { return 0; },
                vLineWidth: function(i, node) { return 0; },
                paddingLeft: function(i, node) { return 0; },
                paddingRight: function(i, node) { return 0; },
                paddingTop: function(i, node) { return 0; },
                paddingBottom: function(i, node) { return 3; }
            }
        });

        // Tabel detail barang - margin kiri sesuai width kolom 1 + spacing
        docContent.push({
            table: {
                headerRows: 1,
                widths: ['4%', '14%', '4%', '11%', '14%', '5%', '28%', '8%', '8%'],
                body: [
                    [
                        { text: 'No.', style: 'tableHeader' },
                        { text: 'Nama Perangkat', style: 'tableHeader' },
                        { text: 'KIB', style: 'tableHeader' },
                        { text: 'Kode Barang', style: 'tableHeader' },
                        { text: 'Nama Barang', style: 'tableHeader' },
                        { text: 'Reg', style: 'tableHeader' },
                        { text: 'Lokasi', style: 'tableHeader' },
                        { text: 'Luas (m²)', style: 'tableHeader' },
                        { text: 'Ket.', style: 'tableHeader' }
                    ],
                    [
                        { text: '1', style: 'tableBody' },
                        { text: tbl_nama_perangkat, style: 'tableBody' },
                        { text: tbl_kib, style: 'tableBody' },
                        { text: tbl_kode_barang, style: 'tableBody', fontSize: 7 },
                        { text: tbl_nama_barang, style: 'tableBody', fontSize: 7 },
                        { text: tbl_reg, style: 'tableBody' },
                        { text: tbl_lokasi, style: 'tableBody', fontSize: 7 },
                        { text: tbl_luas, style: 'tableBody' },
                        { text: tbl_ket, style: 'tableBody' }
                    ]
                ]
            },
            margin: [22, 0, -15, 1],
            layout: {
                hLineWidth: function(i, node) { return 0.5; },
                vLineWidth: function(i, node) { return 0.5; },
                hLineColor: function(i, node) { return '#000'; },
                vLineColor: function(i, node) { return '#000'; },
                paddingLeft: function(i, node) { return 4; },
                paddingRight: function(i, node) { return 4; },
                paddingTop: function(i, node) { return 2; },
                paddingBottom: function(i, node) { return 2; }
            }
        });

        // Klausa (2)
        docContent.push({
            table: {
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(2)', style: 'clauseNumber', border: [false, false, false, false] },
                        { text: 'Pemanfaatan ' + jenis_out + ' sebagaimana dimaksud pada ayat (1) digunakan semata\u2011mata untuk kegiatan ' + usaha + ' yang dikelola oleh PIHAK KEDUA, dan dilarang digunakan untuk kepentingan lain tanpa persetujuan tertulis dari PIHAK KESATU.', style: 'bodyText', alignment: 'justify', border: [false, false, false, false] }
                    ]
                ]
            },
            layout: {
                hLineWidth: function(i, node) { return 0; },
                vLineWidth: function(i, node) { return 0; },
                paddingLeft: function(i, node) { return 0; },
                paddingRight: function(i, node) { return 0; },
                paddingTop: function(i, node) { return 0; },
                paddingBottom: function(i, node) { return 5; }
            }
        });

        // BAB II
        docContent.push({ text: 'BAB II', margin: [0, 10, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'BESARAN DAN JANGKA WAKTU SEWA', style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 2', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });

        // 1. Hitung variabel pembayaran terlebih dahulu
        const bayar_120 = Math.round(besaran_sewa * 1.2);
        const bayar_60 = Math.round(besaran_sewa * 0.6);

        // 2. Masukkan ke dalam format tabel tanpa garis
        docContent.push({
            table: {
                // Lebar kolom: 'auto' menyesuaikan lebar angka (1), (2), (3), dan '*' mengisi sisa kertas
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(1)', style: 'clauseNumber' },
                        { text: 'Besaran uang sewa ' + jenis_out + ' sebagaimana dimaksud dalam Pasal 1 ayat (1) disepakati sebesar Rp ' + besaran_sewa.toLocaleString('id-ID') + ',- (' + terbilang(besaran_sewa) + ' rupiah) dengan jangka waktu 2 (dua) tahun.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(2)', style: 'clauseNumber' },
                        { text: 'Pembayaran uang sewa sebagaimana dimaksud pada ayat (1) dapat dilakukan dengan 2 (dua) metode pembayaran dengan memperhatikan faktor penyesuai sewa yaitu:', style: 'bodyText', alignment: 'justify' }
                    ],
                    // Baris khusus untuk poin a dan b (nested table)
                    [
                        { text: '' }, // Kolom angka dikosongkan agar menjorok ke dalam
                        {
                            table: {
                                widths: ['auto', '*'],
                                body: [
                                    [
                                        { text: 'a.', style: 'bodyText' },
                                        { text: 'Sebesar 100% (seratus persen) untuk pembayaran sewa yang dilakukan sekaligus atau Rp ' + besaran_sewa.toLocaleString('id-ID') + ',- (' + terbilang(besaran_sewa) + ' rupiah); atau', style: 'bodyText', alignment: 'justify' }
                                    ],
                                    [
                                        { text: 'b.', style: 'bodyText' },
                                        { text: 'Sebesar 120% (seratus dua puluh persen) yakni Rp ' + bayar_120.toLocaleString('id-ID') + ',- (' + terbilang(bayar_120) + ' rupiah) ' + 'untuk metode pembayaran bertahap, dengan komitmen pembayaran tahunan masing\u2011masing sebesar Rp ' + bayar_60.toLocaleString('id-ID') + ',- (' + terbilang(bayar_60) + ' rupiah), ' + 'yang tidak mengubah kedudukan hukum bahwa sewa dilakukan untuk masa 2 (dua) tahun sebagaimana dimaksud dalam Pasal 2 ayat (1).', style: 'bodyText', alignment: 'justify' }
                                    ]
                                ]
                            },
                            layout: {
                                hLineWidth: function() { return 0; }, // Hilangkan garis horizontal
                                vLineWidth: function() { return 0; }, // Hilangkan garis vertikal
                                paddingLeft: function(i) { return i === 0 ? 0 : 6; }, // Jarak antara huruf a/b dengan teks
                                paddingRight: function() { return 0; },
                                paddingTop: function() { return 2; },
                                paddingBottom: function() { return 2; }
                            }
                        }
                    ],
                    [
                        { text: '(3)', style: 'clauseNumber' },
                        { text: 'Uang sewa sebagaimana dimaksud pada ayat (1) dibayar melalui rekening Kas Daerah Kabupaten Karanganyar dengan Kode Rekening RKUD (1.019.0024.06) 4.1.04.03.01.0001.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(4)', style: 'clauseNumber' },
                        { text: 'Jangka waktu sewa terhitung sejak tanggal ' + tanggal + ' ' + bulan + ' ' + tahun + ' sampai dengan ' + tanggal + ' ' + bulan + ' ' + (tahun + 2) + ' dan dapat diperpanjang berdasarkan kesepakatan PARA PIHAK, setelah dilakukan evaluasi bersama sesuai ketentuan peraturan perundang\u2011undangan.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(5)', style: 'clauseNumber' },
                        { text: 'Uang sewa wajib dibayarkan selambat\u2011lambatnya:', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '' }, // Kolom angka dikosongkan agar menjorok ke dalam
                        {
                            table: {
                                widths: ['auto', '*'],
                                body: [
                                    [
                                        { text: 'a.', style: 'bodyText' },
                                        { text: 'sebelum ditandatanganinya perjanjian ini, untuk metode pembayaran sewa sebagaimana dimaksud pada ayat (2) huruf a; dan', style: 'bodyText', alignment: 'justify'}
                                    ],
                                    [
                                        { text: 'b.', style: 'bodyText' },
                                        { text: 'tanggal 1 Desember setiap tahun untuk metode pembayaran sewa sebagaimana dimaksud pada ayat (2) huruf b.', style: 'bodyText', alignment: 'justify' }
                                    ]
                                ]
                            },
                            layout: {
                                hLineWidth: function() { return 0; }, // Hilangkan garis horizontal
                                vLineWidth: function() { return 0; }, // Hilangkan garis vertikal
                                paddingLeft: function(i) { return i === 0 ? 0 : 6; }, // Jarak antara huruf a/b dengan teks
                                paddingRight: function() { return 0; },
                                paddingTop: function() { return 2; },
                                paddingBottom: function() { return 2; }
                            }
                        }
                    ],
                    [
                        { text: '(6)', style: 'clauseNumber' },
                        { text: 'Keterlambatan pembayaran uang sewa sebagaimana dimaksud pada ayat (5) dikenakan denda keterlambatan sebesar 2% (dua persen) per bulan, dihitung sejak jatuh tempo sampai dengan saat pembayaran dengan batas maksimal keterlambatan 3 (tiga) bulan.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(7)', style: 'clauseNumber' },
                        {
                            stack: [
                                { text: 'Sanksi Keterlambatan dan Pemutusan Perjanjian.', style: 'bodyText' },
                                {
                                    table: {
                                        widths: ['auto', '*'],
                                        body: [
                                            [
                                                { text: 'a.', style: 'bodyText' },
                                                { 
                                                    text: 'Apabila PIHAK KEDUA terlambat membayar uang sewa melebihi batas waktu 3 (tiga) bulan sebagaimana dimaksud dalam Pasal 2 ayat (6), maka PIHAK KESATU berhak memutus Perjanjian Sewa ini secara sepihak dengan pemberitahuan tertulis kepada PIHAK KEDUA, setelah sebelumnya diberikan sekurang\u2011kurangnya 1 (satu) kali surat peringatan tertulis.', 
                                                    style: 'bodyText', alignment: 'justify' 
                                                }
                                            ],
                                            [
                                                { text: 'b.', style: 'bodyText' },
                                                {
                                                    stack: [
                                                        { text: 'Dalam hal Perjanjian Sewa diputus sebagaimana dimaksud pada huruf a, maka:', style: 'bodyText', alignment: 'justify' },
                                                        {
                                                            table: {
                                                                widths: ['auto', '*'],
                                                                body: [
                                                                    [
                                                                        { text: '1.', style: 'bodyText' },
                                                                        { text: 'PIHAK KEDUA wajib mengosongkan dan menyerahkan kembali ' + jenis_out + ' sewaan kepada PIHAK KESATU dalam waktu paling lama 7 (tujuh) hari kerja sejak tanggal pemberitahuan pemutusan diterima;', style: 'bodyText', alignment: 'justify' }
                                                                    ],
                                                                    [
                                                                        { text: '2.', style: 'bodyText' },
                                                                        { text: 'Uang sewa yang telah dibayarkan tidak dapat diminta kembali dan dianggap sebagai kompensasi atas penggunaan ' + jenis_out + ' serta ganti rugi administratif kepada Pemerintah Kabupaten Karanganyar; dan', style: 'bodyText', alignment: 'justify' }
                                                                    ],
                                                                    [
                                                                        { text: '3.', style: 'bodyText' },
                                                                        { text: 'PIHAK KESATU dibebaskan dari segala tuntutan hukum dan/atau ganti rugi yang mungkin timbul akibat pemutusan dimaksud.', style: 'bodyText', alignment: 'justify' }
                                                                    ]
                                                                ]
                                                            },
                                                            layout: {
                                                                hLineWidth: () => 0, vLineWidth: () => 0,
                                                                paddingLeft: (i) => (i === 0 ? 0 : 6),
                                                                paddingRight: () => 0,
                                                                paddingTop: () => 0,    // Set ke 0 agar rapat
                                                                paddingBottom: () => 1  // Jarak antar poin kecil saja
                                                            }
                                                        }
                                                    ]
                                                }
                                            ],
                                            [
                                                { text: 'c.', style: 'bodyText' },
                                                { text: 'pemutusan sebagaimana dimaksud pada huruf a tidak menghapus kewajiban PIHAK KEDUA untuk melunasi kewajiban keuangan yang telah timbul sebelum tanggal pemutusan.', style: 'bodyText', alignment: 'justify' }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0, vLineWidth: () => 0,
                                        paddingLeft: (i) => (i === 0 ? 0 : 6),
                                        paddingRight: () => 0,
                                        paddingTop: () => 0,    // Set ke 0 agar rapat
                                        paddingBottom: () => 1  // Jarak antar poin kecil saja
                                    }
                                }
                            ]
                        }
                    ],
                    [
                        { text: '(8)', style: 'clauseNumber' },
                        { text: 'Perpanjangan masa sewa sebagaimana dimaksud pada ayat (4) dilakukan dengan membuat Perjanjian Sewa baru setelah dilakukan evaluasi dan mendapat persetujuan Bupati.', style: 'bodyText', alignment: 'justify' }
                    ]

                ]
            },
            layout: {
                hLineWidth: function() { return 0; },
                vLineWidth: function() { return 0; },
                paddingLeft: function(i) { return i === 0 ? 0 : 5; }, // Jarak antara angka (1),(2) dengan teks
                paddingRight: function() { return 0; },
                paddingTop: function() { return 0; },     // Jarak antar ayat (atas)
                paddingBottom: function() { return 0; }   // Jarak antar ayat (bawah)
            }
        });

        // BAB III - Hak & Kewajiban
        docContent.push({ text: 'BAB III', margin: [0, 10, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Bagian Kesatu', margin: [0, 5, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Hak dan Kewajiban PIHAK KESATU', style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 3', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });
        
        docContent.push({
            table: {
                // Lebar kolom: 'auto' menyesuaikan lebar angka (1), (2), (3), dan '*' mengisi sisa kertas
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(1)', style: 'clauseNumber' },
                        {
                            stack: [
                                { text: 'PIHAK KESATU berhak untuk:', style: 'bodyText' },
                                {
                                    table: {
                                        widths: ['auto', '*'],
                                        body: [
                                            [
                                                { text: 'a.', style: 'bodyText' },
                                                { 
                                                    text: 'melakukan pengawasan dan evaluasi terhadap penggunaan ' + jenis_out + ' sebagaimana dimaksud dalam Pasal 1 ayat (1) oleh PIHAK KEDUA;', 
                                                    style: 'bodyText', alignment: 'justify' 
                                                }
                                            ],
                                            [
                                                { text: 'b.', style: 'bodyText' },
                                                { 
                                                    text: 'memberikan peringatan kepada PIHAK KEDUA apabila PIHAK KEDUA tidak melaksanakan isi Perjanjian Sewa berdasarkan peraturan perundang\u2011undangan yang berlaku; dan', 
                                                    style: 'bodyText', alignment: 'justify' 
                                                }
                                            ],
                                            [
                                                { text: 'c.', style: 'bodyText' },
                                                {
                                                    stack: [
                                                        { text: 'memutuskan secara sepihak Perjanjian Sewa, apabila', style: 'bodyText' },
                                                        {
                                                            table: {
                                                                widths: ['auto', '*'],
                                                                body: [
                                                                    [
                                                                        { text: '1.', style: 'bodyText' },
                                                                        { text: 'PIHAK KEDUA tidak melaksanakan kewajibannya;', style: 'bodyText', alignment: 'justify' }
                                                                    ],
                                                                    [
                                                                        { text: '2.', style: 'bodyText' },
                                                                        { text: 'PIHAK KEDUA melakukan hal yang dilarang dalam perjanjian atau peraturan perundang\u2011undangan; dan', style: 'bodyText', alignment: 'justify' }
                                                                    ],
                                                                    [
                                                                        { text: '3.', style: 'bodyText' },
                                                                        { text: 'PIHAK KESATU membutuhkan sewaktu\u2011waktu sebagaimana dimaksud dalam Pasal 1 ayat (1) untuk keperluan penyelengaraan Pemerintah Daerah selama jangka waktu sewa sebagimana dimaksud dalam Pasal 2 ayat (4).', style: 'bodyText', alignment: 'justify' }
                                                                    ]
                                                                ]
                                                            },
                                                            layout: {
                                                                hLineWidth: () => 0, vLineWidth: () => 0,
                                                                paddingLeft: (i) => (i === 0 ? 0 : 6),
                                                                paddingRight: () => 0,
                                                                paddingTop: () => 0,    // Set ke 0 agar rapat
                                                                paddingBottom: () => 1  // Jarak antar poin kecil saja
                                                            }
                                                        }
                                                    ]
                                                }
                                            ],
                                            [
                                                { text: 'd.', style: 'bodyText' },
                                                { text: 'Pemutusan sebagaimana dimaksud pada huruf a tidak menghapus kewajiban PIHAK KEDUA untuk melunasi kewajiban keuangan yang telah timbul sebelum tanggal pemutusan.', style: 'bodyText', alignment: 'justify' }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0, vLineWidth: () => 0,
                                        paddingLeft: (i) => (i === 0 ? 0 : 6),
                                        paddingRight: () => 0,
                                        paddingTop: () => 0,    // Set ke 0 agar rapat
                                        paddingBottom: () => 1  // Jarak antar poin kecil saja
                                    }
                                }
                            ]
                        }
                    ],
                    [
                        { text: '(2)', style: 'clauseNumber' },
                        { text: 'Pemutusan dilakukan dengan memberitahukan secara tertulis sekurang\u2011kurangnya 1 (satu) bulan sebelumnya dan tanpa kewajiban ganti rugi dari PIHAK KESATU kecuali ditentukan lain secara tertulis.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(3)', style: 'clauseNumber' },
                        { text: 'Pemutusan perjanjian oleh PIHAK KESATU sebagaimana dimaksud dalam ayat (2) sebelum berakhirnya masa sewa tidak menimbulkan kewajiban ganti rugi, kecuali terdapat investasi permanen yang telah mendapat persetujuan tertulis sebelumnya dari PIHAK KESATU.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(4)', style: 'clauseNumber' },
                        { text: 'Pemutusan Perjanjian Sewa sebagaimana dimaksud pada ayat (1) huruf c dilaksanakan dengan PIHAK KESATU memberitahukan secara tertulis kepada PIHAK KEDUA.', style: 'bodyText', alignment: 'justify' }
                    ]

                ]
            },
            layout: {
                hLineWidth: function() { return 0; },
                vLineWidth: function() { return 0; },
                paddingLeft: function(i) { return i === 0 ? 0 : 5; }, // Jarak antara angka (1),(2) dengan teks
                paddingRight: function() { return 0; },
                paddingTop: function() { return 0; },     // Jarak antar ayat (atas)
                paddingBottom: function() { return 0; }   // Jarak antar ayat (bawah)
            }
        });
        
        docContent.push({ text: 'Pasal 4', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });
        docContent.push({
            text: 'PIHAK KESATU berkewajiban menyerahkan pemanfaatan ' + jenis_out + ' sebagaimana dimaksud dalam Pasal 1 ayat (1) kepada PIHAK KEDUA selama jangka waktu sewa sebagaimana dimaksud dalam Pasal 2 ayat (3).',
            style: 'bodyText',
            alignment: 'justify'
        });

        docContent.push({ text: 'Bagian Kedua', margin: [0, 5, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Hak dan Kewajiban PIHAK KEDUA', style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 5', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });

        docContent.push({
            table: {
                // Lebar kolom: 'auto' menyesuaikan lebar angka (1), (2), (3), dan '*' mengisi sisa kertas
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(1)', style: 'clauseNumber' },
                        { text: 'PIHAK KEDUA berhak memanfaatkan ' + jenis_out + ' sebagaimana dimaksud dalam Pasal 1 ayat (1) sesuai penggunaan sebagaimana dimaksud dalam Pasal 1 ayat (2).', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(2)', style: 'clauseNumber' },
                        { text: 'PIHAK KEDUA berkewajiban untuk ', style: 'bodyText', alignment: 'justify' }
                    ],
                    // Baris khusus untuk poin a dan b (nested table)
                    [
                        { text: '' }, // Kolom angka dikosongkan agar menjorok ke dalam
                        {
                            table: {
                                widths: ['auto', '*'],
                                body: [
                                    [
                                        { text: 'a.', style: 'bodyText' },
                                        { text: 'Menggunakan ' + jenis_out + ' milik PIHAK KESATU sesuai ketentuan yang berlaku;', style: 'bodyText', alignment: 'justify' }
                                    ],
                                    [
                                        { text: 'b.', style: 'bodyText' },
                                        { text: 'Memelihara, merawat dan menjaga keamanan ' + jenis_out + ' yang disewa;', style: 'bodyText', alignment: 'justify' }
                                    ],
                                    [
                                        { text: 'c.', style: 'bodyText' },
                                        { text: 'Membayar pajak sesuai ketentuan yang berlaku dan biaya lain yang timbul selama jangka waktu sewa; dan', style: 'bodyText', alignment: 'justify' }
                                    ],
                                    [
                                        { text: 'd.', style: 'bodyText' },
                                        { text: 'PIHAK KEDUA wajib menyerahkan kembali tanah dalam keadaan bersih, bebas dari pihak ketiga, tanpa bangunan atau tanaman yang menghalangi pemanfaatan, kecuali disetujui tertulis oleh PIHAK KESATU setelah jangka waktu sewa berakhir atau jika sewaktu\u2011waktu diperlukan PIHAK KESATU sebagaimana diatur dalam Pasal 3 ayat (1) huruf c.', style: 'bodyText', alignment: 'justify' }
                                    ]
                                ]
                            },
                            layout: {
                                hLineWidth: function() { return 0; }, // Hilangkan garis horizontal
                                vLineWidth: function() { return 0; }, // Hilangkan garis vertikal
                                paddingLeft: function(i) { return i === 0 ? 0 : 6; }, // Jarak antara huruf a/b dengan teks
                                paddingRight: function() { return 0; },
                                paddingTop: function() { return 2; },
                                paddingBottom: function() { return 2; }
                            }
                        }
                    ],
                ]
            },
            layout: {
                hLineWidth: function() { return 0; },
                vLineWidth: function() { return 0; },
                paddingLeft: function(i) { return i === 0 ? 0 : 5; }, // Jarak antara angka (1),(2) dengan teks
                paddingRight: function() { return 0; },
                paddingTop: function() { return 0; },     // Jarak antar ayat (atas)
                paddingBottom: function() { return 0; }   // Jarak antar ayat (bawah)
            }
        });

        // BAB IV
        docContent.push({ text: 'BAB IV', margin: [0, 10, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'LARANGAN DAN SANKSI', style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 6', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });
        docContent.push({
            table: {
                // Lebar kolom: 'auto' menyesuaikan lebar angka (1), (2), (3), dan '*' mengisi sisa kertas
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(1)', style: 'clauseNumber' },
                        { text: 'PIHAK KEDUA dilarang menjaminkan ' + jenis_out + ' yang disewa sebagaimana dimaksud dalam Pasal 1 ayat (1) kepada pihak lain.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(2)', style: 'clauseNumber' },
                        { text: 'PIHAK KEDUA dilarang memindahtangankan hak sewa atas ' + jenis_out + ' yang disewa sebagaimana dimaksud dalam Pasal 1 ayat (1) baik sebagian atau seluruhnya kepada pihak lain tanpa izin tertulis dari PIHAK KESATU', style: 'bodyText', alignment: 'justify' }
                    ],
                ]
            },
            layout: {
                hLineWidth: function() { return 0; },
                vLineWidth: function() { return 0; },
                paddingLeft: function(i) { return i === 0 ? 0 : 5; }, // Jarak antara angka (1),(2) dengan teks
                paddingRight: function() { return 0; },
                paddingTop: function() { return 0; },     // Jarak antar ayat (atas)
                paddingBottom: function() { return 0; }   // Jarak antar ayat (bawah)
            }
        });
        docContent.push({ text: 'Pasal 7', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });
        docContent.push({
            text: 'Apabila PIHAK KEDUA tidak memenuhi kewajibannya atau melakukan pelanggaran baik terhadap Perjanjian Sewa ini maupun terhadap ketentuan peraturan perundang\u2011undangan yang berlaku dikenakan sanksi berupa:',
            style: 'bodyText',
            alignment: 'justify'
        });
        docContent.push({
            table: {
                // Lebar kolom: 'auto' menyesuaikan lebar angka (1), (2), (3), dan '*' mengisi sisa kertas
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(1)', style: 'clauseNumber' },
                        { text: 'pencabutan hak sewa atas ' + jenis_out + ' sebagaimana dimaksud dalam Pasal 1 ayat (1); dan/atau', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(2)', style: 'clauseNumber' },
                        { text: 'mengganti segala kerugian yang timbul akibat pelanggaran yang dilakukan baik kepada PIHAK KESATU maupun PIHAK LAIN yang terdampak.', style: 'bodyText', alignment: 'justify' }
                    ],
                ]
            },
            layout: {
                hLineWidth: function() { return 0; },
                vLineWidth: function() { return 0; },
                paddingLeft: function(i) { return i === 0 ? 0 : 5; }, // Jarak antara angka (1),(2) dengan teks
                paddingRight: function() { return 0; },
                paddingTop: function() { return 0; },     // Jarak antar ayat (atas)
                paddingBottom: function() { return 0; }   // Jarak antar ayat (bawah)
            }
        });

        // ===== BAB V - KEADAAN MEMAKSA =====
        docContent.push({ text: 'BAB V', margin: [0, 10, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: ['KEADAAN MEMAKSA (',{ text: 'FORCE MAJEURE', italics: true },')'], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 8', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });

        docContent.push({
            table: {
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(1)', style: 'clauseNumber' },
                        { text: 'Keadaan memaksa adalah suatu keadaan yang terjadi di luar kehendak PARA PIHAK dan tidak dapat diperkirakan sebelumnya, sehingga kewajiban yang ditentukan dalam Perjanjian Sewa ini tidak dapat dipenuhi.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(2)', style: 'clauseNumber' },
                        {
                            stack: [
                                { text: 'Yang dapat digolongkan sebagai keadaan memaksa sebagaimana dimaksud pada ayat (1) meliputi:', style: 'bodyText' },
                                {
                                    table: {
                                        widths: ['auto', '*'],
                                        body: [
                                            [{ text: 'a.', style: 'bodyText' }, { text: 'bencana alam;', style: 'bodyText' }],
                                            [{ text: 'b.', style: 'bodyText' }, { text: 'bencana non alam; dan', style: 'bodyText' }],
                                            [{ text: 'c.', style: 'bodyText' }, { text: 'bencana sosial.', style: 'bodyText' }]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0, vLineWidth: () => 0,
                                        paddingLeft: (i) => (i === 0 ? 0 : 6),
                                        paddingTop: () => 0, paddingBottom: () => 0
                                    }
                                }
                            ]
                        }
                    ],
                    [
                        { text: '(3)', style: 'clauseNumber' },
                        { text: 'Apabila terjadi keadaan memaksa sebagaimana dimaksud pada ayat (2) yang ditandai dengan pernyataan instansi/pejabat yang berwenang, PIHAK KEDUA wajib memberitahukan kepada PIHAK KESATU secara tertulis selambat\u2011lambatnya 14 (empat belas) hari kalender sejak terjadinya keadaan memaksa.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(4)', style: 'clauseNumber' },
                        { text: 'Kelalaian atau keterlambatan dalam memenuhi kewajiban sebagaimana dimaksud pada ayat (3) mengakibatkan tidak diakuinya sebagai keadaan memaksa.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(5)', style: 'clauseNumber' },
                        { text: 'PARA PIHAK dibebaskan untuk melaksanakan kewajiban sebagaimana diatur dalam Perjanjian Sewa ini sebagai akibat terjadinya keadaan memaksa.', style: 'bodyText', alignment: 'justify' }
                    ]
                ]
            },
            layout: {
                hLineWidth: () => 0, vLineWidth: () => 0,
                paddingLeft: (i) => (i === 0 ? 0 : 5),
                paddingTop: () => 0, paddingBottom: () => 1
            }
        });

        // ===== BAB VI - PENYELESAIAN PERSELISIHAN =====
        docContent.push({ text: 'BAB VI', margin: [0, 10, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'PENYELESAIAN PERSELISIHAN', style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 9', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });

        docContent.push({
            table: {
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(1)', style: 'clauseNumber' },
                        { text: 'Permasalahan yang timbul dalam pelaksanaan Perjanjian Sewa ini diselesaikan secara musyawarah mufakat antara PARA PIHAK.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(2)', style: 'clauseNumber' },
                        { text: 'Apabila penyelesaian musyawarah tidak berhasil mencapai mufakat, maka PARA PIHAK sepakat menyerahkan penyelesaian permasalahan tersebut melalui kantor Pengadilan Negeri Karanganyar.', style: 'bodyText', alignment: 'justify' }
                    ]
                ]
            },
            layout: {
                hLineWidth: () => 0, vLineWidth: () => 0,
                paddingLeft: (i) => (i === 0 ? 0 : 5),
                paddingTop: () => 0, paddingBottom: () => 1
            }
        });

        // ===== BAB VII - PENGAWASAN PELAKSANAAN =====
        docContent.push({ text: 'BAB VII', margin: [0, 10, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'PENGAWASAN PELAKSANAAN', style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 10', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });

        docContent.push({
            text: 'Pengawasan pelaksanaan Perjanjian Sewa ini dilaksanakan oleh Badan Keuangan Daerah.',
            style: 'bodyText',
            alignment: 'justify',
            margin: [0, 0, 0, 5]
        });

        // ===== BAB VIII - LAIN-LAIN =====
        docContent.push({ text: 'BAB VIII', margin: [0, 10, 0, 0], style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'LAIN-LAIN', style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 11', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });

        docContent.push({
            table: {
                widths: ['auto', '*'],
                body: [
                    [
                        { text: '(1)', style: 'clauseNumber' },
                        { text: 'Hal\u2011hal lain yang belum diatur dalam Perjanjian Sewa ini, akan diatur lebih lanjut berdasarkan musyawarah mufakat oleh PARA PIHAK.', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: '(2)', style: 'clauseNumber' },
                        { text: 'Apabila terjadi perubahan, maka akan dituangkan secara tertulis dalam perubahan Perjanjian Sewa sebagaimana disepakati oleh PARA PIHAK.', style: 'bodyText', alignment: 'justify' }
                    ]
                ]
            },
            layout: {
                hLineWidth: () => 0, vLineWidth: () => 0,
                paddingLeft: (i) => (i === 0 ? 0 : 5),
                paddingTop: () => 0, paddingBottom: () => 1
            }
        });

        // ===== BAB IX - PENUTUP =====
        docContent.push({ text: 'BAB IX', margin: [0, 10, 0, 0], style: 'babTitle', alignment: 'center', pageBreak: 'before' });
        docContent.push({ text: 'PENUTUP', style: 'babTitle', alignment: 'center' });
        docContent.push({ text: 'Pasal 12', margin: [0, 5, 0, 0], style: 'pasalTitle', alignment: 'center' });

        docContent.push({
            text: 'Demikian Perjanjian Sewa ini dibuat dan ditandatangani PARA PIHAK, pada hari dan tanggal tersebut diatas, serta dibuat rangkap 4 (empat) yang masing\u2011masing mempunyai kekuatan hukum yang sama dengan perincian sebagai berikut:',
            style: 'bodyText',
            alignment: 'justify',
            margin: [0, 0, 0, 5]
        });

        // Daftar Rincian Lembar (a, b, c, d)
        docContent.push({
            table: {
                widths: [70, 5, '*'],
                body: [
                    [
                        { text: 'a. Lembar I', style: 'bodyText' },
                        { text: ':', style: 'bodyText' },
                        { text: 'ditempel meterai Rp 10.000,00 (sepuluh ribu rupiah) untuk PIHAK KESATU;', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: 'b. Lembar II', style: 'bodyText' },
                        { text: ':', style: 'bodyText' },
                        { text: 'ditempel meterai Rp 10.000,00 (sepuluh ribu rupiah) untuk PIHAK KEDUA;', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: 'c. Lembar III', style: 'bodyText' },
                        { text: ':', style: 'bodyText' },
                        { text: 'untuk Kepala Badan Keuangan Daerah Kabupaten Karanganyar; dan', style: 'bodyText', alignment: 'justify' }
                    ],
                    [
                        { text: 'd. Lembar IV', style: 'bodyText' },
                        { text: ':', style: 'bodyText' },
                        { text: 'untuk Kepala Bagian Hukum Sekretariat Daerah Kabupaten Karanganyar.', style: 'bodyText', alignment: 'justify' }
                    ]
                ]
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 40] // Margin bawah sebelum tanda tangan
        });

        // ===== TANDA TANGAN =====
        docContent.push({
            table: {
                widths: ['*', '*'],
                body: [
                    [
                        { text: 'PIHAK KEDUA,', alignment: 'center', style: 'bodyText' },
                        { text: 'PIHAK KESATU,', alignment: 'center', style: 'bodyText'}
                    ],
                    [
                        { text: '\n\n\n\n\n', fontSize: 10 }, // Ruang tanda tangan (5 enter)
                        { text: '\n\n\n\n\n', fontSize: 10 }
                    ],
                    [
                        { text: nama2_out, alignment: 'center', style: 'bodyText'},
                        { text: nama1_out, alignment: 'center', style: 'bodyText'}
                    ]
                ]
            },
            layout: 'noBorders'
        });

        console.log('Dokumen berhasil dibangun (' + docContent.length + ' elements)');
        
        // ===== STEP 6: CREATE STYLES =====
        console.log( 'Membuat styles');
        
        const docDefinition = {
            content: docContent,
            styles: {
                title: { fontSize: 12, alignment: 'center' },
                subtitle: { fontSize: 12, alignment: 'center' },
                nomor: { fontSize: 12, alignment: 'center' },
                bodyText: { fontSize: 12, lineHeight: 1, noWrap: false },
                clauseNumber: { fontSize: 12, alignment: 'left', margin: [0, 0, 6, 0] },
                tableHeader: { fontSize: 8.5, alignment: 'center' },
                tableBody: { fontSize: 8.5, alignment: 'center', noWrap: false },
                babTitle: { fontSize: 12,  alignment: 'center'},
                pasalTitle: { fontSize: 12, alignment: 'center'}
            },
            pageSize: 'A4',
            pageMargins: [85, 71, 57, 57]  // [3cm, 2.5cm, 2cm, 2cm]
        };

        console.log('✓Styles ready');
        
        // ===== STEP 7: DOWNLOAD =====
        console.log('Download PDF');
        
        const outputName = 'Perjanjian_Sewa_' + nama2.replace(/\s+/g, '_');
        pdfMake.createPdf(docDefinition).download(outputName + '.pdf');
        
        console.log('========== PDF BERHASIL DIBUAT SEBAGAI: ' + outputName + '.pdf ==========');
        
    } catch (e) {
        alert('ERROR FINAL: ' + e.message);
        console.error('Download error:', e, e.stack);
        return;
    }
}

// Real-time input validation
document.addEventListener('DOMContentLoaded', function() {
    console.log('PAGE LOADED - input validation ready');
    
    const kibInput = document.getElementById('tbl_kib');
    if (kibInput) {
        kibInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Fa-f]/g, '').slice(0, 1).toUpperCase();
        });
    }

    const kodeInput = document.getElementById('tbl_kode_barang');
    if (kodeInput) {
        kodeInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.]/g, '');
        });
    }

    const regInput = document.getElementById('tbl_reg');
    if (regInput) {
        regInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    const luasInput = document.getElementById('tbl_luas');
    if (luasInput) {
        luasInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
});
