Vue.component('do-tracking', function (resolve, reject) {
    // Ambil file HTML eksternal untuk tampilan tracking DO
    fetch('./templates/do-tracking.html')
        .then(response => response.text())
        .then(htmlTemplate => {
            
            // Eksekusi komponen Vue setelah HTML berhasil dimuat
            resolve({
                template: htmlTemplate,
                
                // Terima data dari induk dan siapkan state form/pencarian
                props: ['data', 'paketList', 'ekspedisiList'],
                data() {
                    return {
                        searchQuery: '',
                        isSearching: false,
                        formDO: {
                            nim: '',
                            nama: '',
                            ekspedisi: '',
                            paketKode: ''
                        },
                        errorMessage: ''
                    };
                },
                
                // Logika reaktif untuk generate nomor DO otomatis, detail paket, dan filter pencarian
                computed: {
                    generateNoDO() {
                        const year = new Date().getFullYear(); 
                        
                        if (!this.data || this.data.length === 0) return `DO${year}-0001`;

                        const sequences = this.data.map(d => {
                            if (!d.noDO) return 0;
                            const parts = d.noDO.split('-'); 
                            return parts.length > 1 ? parseInt(parts[1], 10) : 0;
                        });

                        const maxSequence = Math.max(...sequences);
                        const nextSequence = maxSequence + 1;

                        return `DO${year}-${String(nextSequence).padStart(4, '0')}`;
                    },
                    selectedPaketDetail() {
                        if (!this.formDO.paketKode || !this.paketList) return null;
                        return this.paketList.find(p => p.kode === this.formDO.paketKode);
                    },
                    filteredTracking() {
                        if (!this.isSearching || this.searchQuery.trim() === '') return this.data;
                        const query = this.searchQuery.toLowerCase();
                        return this.data.filter(d => 
                            (d.noDO && d.noDO.toLowerCase().includes(query)) || 
                            (d.nim && d.nim.toLowerCase().includes(query))
                        );
                    }
                },
                
                // Fungsi eksekusi untuk pencarian, tambah DO baru, dan update status pengiriman
                methods: {
                    doSearch() {
                        this.isSearching = true;
                    },
                    resetSearch() {
                        this.searchQuery = '';
                        this.isSearching = false;
                    },
                    tambahDO() {
                        if (!this.formDO.nim || !this.formDO.nama || !this.formDO.ekspedisi || !this.formDO.paketKode) {
                            this.errorMessage = "Semua field harus diisi!";
                            return;
                        }
                        this.errorMessage = '';

                        const now = new Date();
                        const tanggalKirim = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                        const waktuAwal = `${tanggalKirim} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

                        const newDO = {
                            noDO: this.generateNoDO,
                            nim: this.formDO.nim,
                            nama: this.formDO.nama,
                            ekspedisi: this.formDO.ekspedisi,
                            paket: this.formDO.paketKode,
                            tanggalKirim: tanggalKirim,
                            totalHarga: this.selectedPaketDetail.harga,
                            progress: [
                                { waktu: waktuAwal, keterangan: "Pesanan Delivery Order berhasil dibuat" }
                            ]
                        };

                        this.data.unshift(newDO);
                        
                        this.formDO.nim = '';
                        this.formDO.nama = '';
                        this.formDO.ekspedisi = '';
                        this.formDO.paketKode = '';
                        alert("Delivery Order baru berhasil dibuat!");
                    },
                    tambahProgress(noDO) {
                        const ket = prompt("Masukkan keterangan status pengiriman baru:");
                        if (ket) {
                            const doItem = this.data.find(d => d.noDO === noDO);
                            if (doItem) {
                                const now = new Date();
                                const waktu = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
                                doItem.progress.push({ waktu: waktu, keterangan: ket });
                            }
                        }
                    }
                },
                
                // Format angka menjadi mata uang Rupiah
                filters: {
                    formatRupiah(value) {
                        if (!value) return 'Rp 0';
                        return 'Rp ' + parseInt(value).toLocaleString('id-ID');
                    }
                }
            });
        })
        
        // Tangkap dan tampilkan pesan error jika HTML gagal dimuat
        .catch(error => {
            console.error("Gagal memuat template do-tracking:", error);
            reject(error);
        });
});