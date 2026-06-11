Vue.component('ba-stock-table', function (resolve, reject) {
    // Ambil file HTML eksternal untuk tampilan tabel stok bahan ajar
    fetch('./templates/stock-table.html')
        .then(response => response.text())
        .then(htmlTemplate => {
            
            // Eksekusi komponen Vue setelah HTML berhasil dimuat
            resolve({
                template: htmlTemplate,
                
                // Terima data dari induk dan inisialisasi state untuk form, filter, dan edit
                props: ['items'],
                data() {
                    return {
                        filterUpbjj: '',
                        filterKategori: '',
                        filterStokKritis: false,
                        sortBy: '',
                        
                        formData: {
                            kode: '',
                            judul: '',
                            kategori: '',
                            upbjj: 'UT-Pusat',
                            lokasiRak: 'A1',
                            harga: null,
                            qty: null,
                            safety: null,
                            catatanHTML: '<i>Barang baru ditambahkan</i>'
                        },
                        errorMessage: '',
                        editingKode: null,
                        editFormData: {}
                    };
                },
                
                // Logika reaktif untuk dropdown dinamis serta memfilter dan mengurutkan data tabel
                computed: {
                    daftarUpbjj() {
                        if (!this.items) return [];
                        const upbjjSet = new Set(this.items.map(item => item.upbjj));
                        return Array.from(upbjjSet);
                    },
                    daftarKategori() {
                        if (!this.filterUpbjj || !this.items) return [];
                        const filteredItems = this.items.filter(item => item.upbjj === this.filterUpbjj);
                        const kategoriSet = new Set(filteredItems.map(item => item.kategori));
                        return Array.from(kategoriSet);
                    },
                    processedItems() {
                        if (!this.items) return [];
                        let result = this.items;

                        if (this.filterUpbjj !== '') result = result.filter(item => item.upbjj === this.filterUpbjj);
                        if (this.filterKategori !== '') result = result.filter(item => item.kategori === this.filterKategori);
                        if (this.filterStokKritis) result = result.filter(item => item.qty < item.safety || item.qty === 0);

                        if (this.sortBy === 'judul_asc') result = result.slice().sort((a, b) => a.judul.localeCompare(b.judul));
                        else if (this.sortBy === 'stok_asc') result = result.slice().sort((a, b) => a.qty - b.qty);
                        else if (this.sortBy === 'stok_desc') result = result.slice().sort((a, b) => b.qty - a.qty);
                        else if (this.sortBy === 'harga_asc') result = result.slice().sort((a, b) => a.harga - b.harga);
                        else if (this.sortBy === 'harga_desc') result = result.slice().sort((a, b) => b.harga - a.harga);

                        return result;
                    }
                },
                
                // Reset pilihan kategori secara otomatis saat UT-Daerah diubah
                watch: {
                    filterUpbjj(newValue) {
                        this.filterKategori = ''; 
                    }
                },
                
                // Fungsi eksekusi untuk reset filter, tambah, hapus, dan edit data beserta notifikasi pop-up
                methods: {
                    resetFilter() {
                        this.filterUpbjj = '';
                        this.filterKategori = '';
                        this.filterStokKritis = false;
                        this.sortBy = '';
                    },
                    tambahData() {
                        if (!this.formData.kode || !this.formData.judul || !this.formData.harga) {
                            this.errorMessage = "Kode, Judul, dan Harga wajib diisi!";
                            return;
                        }
                        if (this.formData.qty < 0 || this.formData.safety < 0) {
                            this.errorMessage = "Stok tidak boleh minus!";
                            return;
                        }

                        this.errorMessage = '';
                        this.items.push({ ...this.formData });

                        this.formData.kode = '';
                        this.formData.judul = '';
                        this.formData.kategori = '';
                        this.formData.harga = null;
                        this.formData.qty = null;
                        this.formData.safety = null;

                        this.$root.$refs.globalModal.openModal("Berhasil!", "Data bahan ajar baru telah tersimpan di sistem.");
                    },
                    hapusData(kodeBuku) {
                        const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus data bahan ajar ini?");
                        if (konfirmasi) {
                            const index = this.items.findIndex(item => item.kode === kodeBuku);
                            if (index !== -1) {
                                this.items.splice(index, 1);
                                this.$root.$refs.globalModal.openModal("Terhapus", "Data berhasil dihapus dari sistem.");
                            }
                        }
                    },
                    mulaiEdit(item) {
                        this.editingKode = item.kode;
                        this.editFormData = { ...item };
                    },
                    batalEdit() {
                        this.editingKode = null;
                    },
                    simpanEdit() {
                        const index = this.items.findIndex(item => item.kode === this.editingKode);
                        if (index !== -1) {
                            this.items.splice(index, 1, { ...this.editFormData });
                            this.editingKode = null;
                            
                            this.$root.$refs.globalModal.openModal("Update Sukses", "Perubahan data berhasil disimpan.");
                        }
                    }
                },
                
                // Format angka menjadi mata uang Rupiah dan penambahan satuan buah
                filters: {
                    formatRupiah(value) {
                        if (!value) return 'Rp 0';
                        return 'Rp ' + parseInt(value).toLocaleString('id-ID');
                    },
                    formatBuah(value) {
                        if (value === undefined || value === null) return '0 buah';
                        return value + ' buah';
                    }
                }
            });
            
        })
        
        // Tangkap dan tampilkan pesan error jika HTML gagal dimuat
        .catch(error => {
            console.error("Gagal memuat template stock-table:", error);
            reject(error);
        });
});