const api = {
    // mengambil data stok bahan ajar
    fetchDataBahanAjar() {
        return fetch('./data/dataBahanAjar.json')
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching data:', error);
                return null;
            });
    }
};