Vue.component('order-form', function (resolve, reject) {
    // Ambil file HTML eksternal untuk tampilan form pemesanan
    fetch('./templates/order-form.html')
        .then(response => response.text())
        .then(htmlTemplate => {
            
            // Eksekusi komponen Vue setelah HTML berhasil dimuat
            resolve({
                template: htmlTemplate,
                
                // Terima data dari induk dan siapkan pesan informasi dasar
                props: ['paketList', 'ekspedisiList'],
                data() {
                    return {
                        infoPesan: 'Silakan gunakan tab Tracking DO untuk membuat pesanan Delivery Order baru.'
                    };
                }
            });
        })
        
        // Tangkap dan tampilkan pesan error jika HTML gagal dimuat
        .catch(error => {
            console.error("Gagal memuat template order-form:", error);
            reject(error);
        });
});