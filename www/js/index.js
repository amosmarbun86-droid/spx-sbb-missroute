document.addEventListener('deviceready', initAplikasi, false);

let map;
let markerGroup;
let markerTemp; // Variabel global untuk marker pencarian admin
let databaseWilayah = [];
let statusAdmin = false;

// PASSWORD UNTUK MASUK MODE ADMIN
const PASSWORD_ADMIN = "101312"; 

// KONFIGURASI FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBJtljHK_PDFakT_jfz6FfXT-adUQW6QeY",
    authDomain: "spx-sbb-missroute.firebaseapp.com",
    databaseURL: "https://spx-sbb-missroute-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "spx-sbb-missroute",
    storageBucket: "spx-sbb-missroute.firebasestorage.app",
    messagingSenderId: "609035978516",
    appId: "1:609035978516:web:7d8fdb156fa31a9c04a401"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const dbRef = firebase.database().ref('spx_rute');

const databaseDefault = [
    { kode: "1", nama: "DC SIBORONG-BORONG", lat: 2.2076, lon: 98.9916 }, 
    // ... (databaseDefault Anda tetap sama)
];

function initAplikasi() {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    map = L.map('mapBox').setView([2.2076, 98.9916], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    markerGroup = L.layerGroup().addTo(map);

    dbRef.on('value', (snapshot) => {
        const dataFirebase = snapshot.val();
        if (dataFirebase) {
            databaseWilayah = Object.values(dataFirebase);
        } else {
            databaseWilayah = [...databaseDefault];
            dbRef.set(databaseDefault);
        }
    });
}

if (!window.cordova) {
    window.onload = initAplikasi;
}

// --- FITUR BARU: PENCARIAN LOKASI VIA PETA ---
function cariLokasiDiPeta() {
    const query = document.getElementById('searchMapInput').value;
    if (!query) return alert("Masukkan nama lokasi!");

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                document.getElementById('newLat').value = lat.toFixed(6);
                document.getElementById('newLon').value = lon.toFixed(6);

                map.setView([lat, lon], 15);

                if (markerTemp) map.removeLayer(markerTemp);
                markerTemp = L.marker([lat, lon]).addTo(map)
                    .bindPopup("Hasil: " + data[0].display_name)
                    .openPopup();
            } else {
                alert("Lokasi tidak ditemukan!");
            }
        })
        .catch(() => alert("Gagal mencari lokasi. Cek internet!"));
}

// --- FUNGSI EXISTING ---
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
        listContainer.innerHTML = '<div class="p-3 text-center text-danger fw-bold">❌ Tidak ditemukan!</div>';
        return;
    }

    hasilFilter.forEach(item => {
        listContainer.innerHTML += `
            <div class="list-group-item d-flex justify-content-between align-items-center p-3" onclick="geserKeLokasi(${item.lat}, ${item.lon}, '${item.kode}', '${item.nama}')" style="cursor: pointer;">
                <div><span class="fw-bold d-block">${item.nama}</span><small class="text-muted">Lat: ${item.lat} | Lon: ${item.lon}</small></div>
                <span class="badge bg-danger rounded-pill">${item.kode}</span>
            </div>
        `;
        L.marker([item.lat, item.lon]).bindPopup(`<b>Kode: ${item.kode}</b><br>${item.nama}`).addTo(markerGroup);
    });
}

function masukModeAdmin() {
    const inputPass = prompt("🔑 Masukkan Password Admin:");
    if (inputPass === PASSWORD_ADMIN) {
        statusAdmin = true;
        document.getElementById('formTambahWilayah').style.display = 'block';
        document.getElementById('btnAdminMode').style.display = 'none';
        alert("🔓 Admin Mode Aktif!");
    } else {
        alert("❌ Password Salah!");
    }
}

function keluarModeAdmin() {
    statusAdmin = false;
    document.getElementById('formTambahWilayah').style.display = 'none';
    document.getElementById('btnAdminMode').style.display = 'block';
    if(markerTemp) map.removeLayer(markerTemp);
    bersihkanCari();
}

function simpanWilayahBaru() {
    if (!statusAdmin) return;
    const kode = document.getElementById('newKode').value.trim();
    const nama = document.getElementById('newNama').value.trim();
    const lat = parseFloat(document.getElementById('newLat').value);
    const lon = parseFloat(document.getElementById('newLon').value);

    if (!kode || !nama || isNaN(lat) || isNaN(lon)) {
        alert("⚠️ Lengkapi data (Gunakan fitur cari lokasi)!");
        return;
    }

    const indexBaru = databaseWilayah.length;
    firebase.database().ref('spx_rute/' + indexBaru).set({ kode, nama, lat, lon }, (error) => {
        if (!error) {
            alert(`✅ Tersimpan: ${nama}`);
            document.getElementById('newKode').value = "";
            document.getElementById('newNama').value = "";
            document.getElementById('newLat').value = "";
            document.getElementById('newLon').value = "";
            if(markerTemp) map.removeLayer(markerTemp);
            bersihkanCari();
        }
    });
}

function resetKeDefault() {
    if (confirm("Reset server ke data awal?")) {
        dbRef.set(databaseDefault);
    }
}

function geserKeLokasi(lat, lon, kode, nama) {
    map.setView([lat, lon], 14);
    L.popup().setLatLng([lat, lon]).setContent(`<b>Kode: ${kode}</b><br>${nama}`).openOn(map);
}

function bersihkanCari() {
    document.getElementById('inputSearch').value = "";
    document.getElementById('listHasil').innerHTML = '<div class="p-3 text-center text-muted">Silakan ketik data...</div>';
    markerGroup.clearLayers();
    map.setView([2.2076, 98.9916], 9);
}
