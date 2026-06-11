Vue.component('status-badge', function (resolve, reject) {
    // Ambil file HTML eksternal untuk tampilan badge status
    fetch('./templates/status-badge.html')
        .then(response => response.text())
        .then(htmlTemplate => {
            
            // Eksekusi komponen Vue setelah HTML berhasil dimuat
            resolve({
                template: htmlTemplate,
                
                // Terima data jumlah dan batas aman stok dari komponen induk
                props: ['qty', 'safety'],
                
                // Tentukan warna dan teks peringatan secara dinamis berdasarkan sisa stok
                computed: {
                    badgeStyle() {
                        if (this.qty === 0) return 'color: #ef4444; font-weight: bold;';
                        if (this.qty < this.safety) return 'color: #f59e0b; font-weight: bold;';
                        return 'color: #10b981; font-weight: bold;';
                    },
                    badgeText() {
                        if (this.qty === 0) return 'Kosong';
                        if (this.qty < this.safety) return 'Menipis';
                        return 'Aman';
                    }
                }
            });
        })
        
        // Tangkap dan tampilkan pesan error jika HTML gagal dimuat
        .catch(error => {
            console.error("Gagal memuat template status-badge:", error);
            reject(error);
        });
});