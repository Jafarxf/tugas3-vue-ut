new Vue({
    // Inisialisasi elemen HTML dan penampung data global
    el: '#app',
    data: {
        tab: 'stok',
        state: {
            stok: [],
            tracking: [],
            paket: [],
            pengirimanList: []
        }
    },
    
    // Jalankan fungsi loadData
    created() {
        this.loadData();
    },
    
    // Ambil data dari JSON
    methods: {
        loadData() {
            api.fetchDataBahanAjar().then(data => {
                if (data) {
                    this.state.stok = data.stok || [];
                    this.state.paket = data.paket || [];
                    this.state.pengirimanList = data.pengirimanList || [];
                    
                    let rawTracking = data.tracking || [];
                    let flatTracking = rawTracking.map(item => {
                        let noDO = Object.keys(item)[0]; 
                        let detail = item[noDO];
                        
                        return {
                            noDO: noDO,
                            nim: detail.nim,
                            nama: detail.nama,
                            ekspedisi: detail.ekspedisi,
                            paket: detail.paket,
                            tanggalKirim: detail.tanggalKirim,
                            totalHarga: detail.total, 
                            progress: detail.perjalanan || [] 
                        };
                    });
                    
                    this.state.tracking = flatTracking;
                }
            });
        }
    }
});