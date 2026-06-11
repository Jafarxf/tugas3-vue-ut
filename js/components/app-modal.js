Vue.component('app-modal', function (resolve, reject) {
    // Ambil file HTML eksternal untuk tampilan pop-up modal
    fetch('./templates/app-modal.html')
        .then(response => response.text())
        .then(htmlTemplate => {
            
            // Eksekusi komponen Vue setelah HTML berhasil dimuat
            resolve({
                template: htmlTemplate,
                
                // State untuk mengatur status buka/tutup dan isi pesan
                data() {
                    return {
                        isOpen: false,
                        title: '',
                        message: ''
                    };
                },
                
                // Fungsi untuk memicu modal terbuka atau tertutup dari komponen lain
                methods: {
                    openModal(title, message) {
                        this.title = title;
                        this.message = message;
                        this.isOpen = true;
                    },
                    closeModal() {
                        this.isOpen = false;
                    }
                }
            });
        })
        
        // Tampilkan error jika file HTML gagal dipanggil
        .catch(error => {
            console.error("Gagal memuat template app-modal:", error);
            reject(error);
        });
});