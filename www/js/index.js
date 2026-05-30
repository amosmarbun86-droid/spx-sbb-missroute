document.addEventListener('deviceready', initAplikasi, false);

let map;
let markerGroup;

// Database lengkap disesuaikan dari data asli Anda (75 Wilayah)
const databaseWilayah = [
    { kode: "1", nama: "Siborong-borong", lat: 2.2076, lon: 98.9916 },
    { kode: "2", nama: "Gunung Meriah", lat: 2.4500, lon: 97.8500 },
    { kode: "3", nama: "Simpang Kiri", lat: 2.3500, lon: 97.8000 },
    { kode: "5", nama: "Penyabungan", lat: 0.8615, lon: 99.5452 },
    { kode: "6", nama: "Natal", lat: 0.5500, lon: 99.1200 },
    { kode: "11", nama: "Kota Pinang", lat: 1.9150, lon: 100.0950 },
    { kode: "12", nama: "Tarutung", lat: 2.0172, lon: 98.9668 },
    { kode: "13", nama: "Pandan", lat: 1.6856, lon: 98.8192 },
    { kode: "14", nama: "Barus", lat: 2.0125, lon: 98.3987 },
    { kode: "15", nama: "Dolok Sanggul", lat: 2.3303, lon: 98.7510 },
    { kode: "16", nama: "Pangururan", lat: 2.6426, lon: 98.7133 },
    { kode: "17", nama: "Sidikalang", lat: 2.7425, lon: 98.3125 },
    { kode: "18-22", nama: "Sidikalang", lat: 2.7425, lon: 98.3125 },
    { kode: "23", nama: "Garoga", lat: 2.1400, lon: 98.7500 },
    { kode: "25", nama: "Balige", lat: 2.3333, lon: 99.0667 },
    { kode: "26", nama: "Padang Bolak", lat: 1.5000, lon: 99.7500 },
    { kode: "27", nama: "Barumun", lat: 1.3000, lon: 99.7000 },
    { kode: "29", nama: "Padang Sidempuan Tenggara", lat: 1.3800, lon: 99.2700 },
    { kode: "30", nama: "Sayur Matinggi", lat: 1.3000, lon: 99.3500 },
    { kode: "32", nama: "Padang Sidempuan Batunadua", lat: 1.4000, lon: 99.3000 },
    { kode: "33", nama: "Padang Sidempuan Selatan", lat: 1.3700, lon: 99.2800 },
    { kode: "35", nama: "Porsea", lat: 2.5667, lon: 99.0833 },
    { kode: "36", nama: "Pinang Sori", lat: 1.5500, lon: 98.9000 },
    { kode: "37", nama: "Tapian Nauli", lat: 1.6500, lon: 98.8000 },
    { kode: "38", nama: "Pahae Jae", lat: 2.0500, lon: 98.8500 },
    { kode: "39", nama: "Sinunukan", lat: 0.8000, lon: 99.4000 },
    { kode: "40", nama: "Muara Sipongi", lat: 0.9500, lon: 99.6000 },
    { kode: "41", nama: "Batang Toru", lat: 1.5300, lon: 99.0700 },
    { kode: "42", nama: "Angkola Barat", lat: 1.4500, lon: 99.2000 },
    { kode: "43", nama: "Silangkitang", lat: 1.9500, lon: 100.1500 },
    { kode: "44", nama: "Halongonan", lat: 1.7000, lon: 99.9000 },
    { kode: "45", nama: "Kampung Rakyat", lat: 2.0000, lon: 100.1000 },
    { kode: "46", nama: "Sipirok", lat: 1.6500, lon: 99.3000 },
    { kode: "47", nama: "Sorkam", lat: 1.9000, lon: 98.7000 },
    { kode: "50", nama: "Sipahutar", lat: 2.2833, lon: 99.0000 },
    { kode: "51", nama: "Sosa", lat: 1.4000, lon: 100.0000 },
    { kode: "52", nama: "Aceh Singkil", lat: 2.3000, lon: 97.8000 },
    { kode: "53", nama: "Siabu", lat: 1.2000, lon: 99.5000 },
    { kode: "54", nama: "Sultan Daulat", lat: 2.7000, lon: 97.9000 },
    { kode: "55", nama: "Barumun Tengah", lat: 1.3500, lon: 99.8000 },
    { kode: "56", nama: "Batang Natal", lat: 0.7500, lon: 99.5000 },
    { kode: "57", nama: "Sirandorung", lat: 1.8500, lon: 98.9000 },
    { kode: "58", nama: "Pollung", lat: 2.4000, lon: 98.7000 },
    { kode: "59", nama: "Lintong Nihuta", lat: 2.2500, lon: 98.9000 },
    { kode: "60", nama: "Parlilitan", lat: 2.5500, lon: 98.6000 },
    { kode: "61", nama: "Simangambat", lat: 1.5500, lon: 100.0000 },
    { kode: "62", nama: "Muara Batang Gadis", lat: 0.7000, lon: 99.3000 },
    { kode: "63", nama: "Pakkat", lat: 2.4500, lon: 98.5000 },
    { kode: "64", nama: "Ulu Barumun", lat: 1.2500, lon: 99.8000 },
    { kode: "65", nama: "Simpang Kanan", lat: 2.3500, lon: 97.8500 },
    { kode: "66", nama: "Pahae Julu", lat: 2.1000, lon: 98.9000 },
    { kode: "67", nama: "Laguboti", lat: 2.4500, lon: 99.0500 },
    { kode: "69", nama: "Pangaribuan", lat: 2.2000, lon: 98.8000 },
    { kode: "70", nama: "Sipoholon", lat: 2.0333, lon: 98.9333 },
    { kode: "71", nama: "Angkola Timur", lat: 1.4500, lon: 99.3000 },
    { kode: "72", nama: "Muara Batang Toru", lat: 1.4000, lon: 99.0500 },
    { kode: "73", nama: "Lumban Julu", lat: 2.5833, lon: 99.1333 },
    { kode: "74", nama: "Lubuk barumun", lat: 1.3000, lon: 99.8500 },
    { kode: "75", nama: "Sosa 2", lat: 1.4200, lon: 100.0200 },
    { kode: "76", nama: "Sumbul", lat: 2.6000, lon: 98.5000 },
    { kode: "77", nama: "Huristak", lat: 1.5000, lon: 99.9000 },
    { kode: "78", nama: "Siempat Nempu", lat: 2.8000, lon: 98.3000 },
    { kode: "79", nama: "Hutaraja Tinggi", lat: 1.3500, lon: 99.9000 },
    { kode: "80", nama: "Salak", lat: 2.5500, lon: 98.3000 },
    { kode: "81", nama: "Singkohor", lat: 2.4000, lon: 97.9000 },
    { kode: "82", nama: "Ranto Baek-baek", lat: 0.9000, lon: 99.4000 },
    { kode: "84", nama: "Siantar Naromonda", lat: 2.4500, lon: 99.2000 },
    { kode: "86", nama: "Simanindo", lat: 2.6500, lon: 98.8000 },
    { kode: "87", nama: "Sibabangun", lat: 1.8300, lon: 98.7800 },
    { kode: "90", nama: "Angkola Selatan", lat: 1.4000, lon: 99.2500 },
    { kode: "91", nama: "palipi", lat: 2.6500, lon: 98.6000 },
    { kode: "92", nama: "Adian koting", lat: 2.1000, lon: 98.7000 },
    { kode: "93", nama: "Rundeng", lat: 2.6500, lon: 97.9500 },
    { kode: "94", nama: "Saipar dolok", lat: 1.5300, lon: 99.0500 },
    { kode: "95", nama: "Tampahan", lat: 2.5650, lon: 99.0600 }
];

function initAplikasi() {
    // Koordinat tengah untuk wilayah Sumatera Utara SBB
    map = L.map('mapBox').setView([1.8, 99.0], 8);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    markerGroup = L.layerGroup().addTo(map);
}

if (!window.cordova) {
    window.onload = initAplikasi;
}

function prosesCari() {
    const keyword = document.getElementById('inputSearch').value.trim().toLowerCase();
    const listContainer = document.getElementById('listHasil');

    if (!keyword) {
        bersihkanCari();
        return;
    }

    const hasilFilter = databaseWilayah.filter(item => 
        item.nama.toLowerCase().includes(keyword) || item.kode.toLowerCase().includes(keyword)
    );

    listContainer.innerHTML = "";
    markerGroup.clearLayers();

    if (hasilFilter.length === 0) {
        listContainer.innerHTML = '<div class="p-3 text-center text-danger fw-bold card-info-text">❌ Kode / Wilayah Tidak Terdaftar!</div>';
        return;
    }

    hasilFilter.forEach(item => {
        const itemHTML = `
            <div class="list-group-item d-flex justify-content-between align-items-center p-3" 
                 onclick="geserKeLokasi(${item.lat}, ${item.lon}, '${item.kode}', '${item.nama}')" style="cursor: pointer;">
                <div>
                    <span class="fw-bold d-block text-dark text-capitalize" style="font-size:0.95rem;">${item.nama}</span>
                    <small class="text-muted" style="font-size:0.75rem;">Lat: ${item.lat} | Lon: ${item.lon}</small>
                </div>
                <span class="badge badge-kode rounded-pill px-3 py-2">${item.kode}</span>
            </div>
        `;
        listContainer.innerHTML += itemHTML;

        const marker = L.marker([item.lat, item.lon])
            .bindPopup(`<b>Kode: ${item.kode}</b><br>${item.nama}`);
        markerGroup.addLayer(marker);
    });

    map.setView([hasilFilter[0].lat, hasilFilter[0].lon], 11);
}

function geserKeLokasi(lat, lon, kode, nama) {
    map.setView([lat, lon], 14);
    L.popup()
        .setLatLng([lat, lon])
        .setContent(`<b>Kode: ${kode}</b><br>${nama}`)
        .openOn(map);
}

function bersihkanCari() {
    document.getElementById('inputSearch').value = "";
    document.getElementById('listHasil').innerHTML = '<div class="p-3 text-center text-muted card-info-text">Silakan ketik data paket untuk memulai tracking.</div>';
    markerGroup.clearLayers();
    map.setView([1.8, 99.0], 8);
}
