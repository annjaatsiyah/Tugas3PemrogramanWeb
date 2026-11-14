/* ===========================================================
   api.js — Data service: mengambil dan menormalkan data acuan
   Tugas Praktik 3 — STSI4209 Pemrograman Berbasis Web
   =========================================================== */

var api = (function () {
  // Salinan data acuan yang sama persis dengan data/dataBahanAjar.json.
  // Dipakai sebagai cadangan ketika fetch() ke berkas JSON gagal, misalnya
  // saat index.html dibuka langsung dari berkas lokal (protokol file://)
  // yang pada sebagian besar peramban memblokir permintaan fetch lintas asal.
  var FALLBACK_DATA = {
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    pengirimanList: [
      { kode: "REG", nama: "Reguler (3-5 hari)" },
      { kode: "EXP", nama: "Ekspres (1-2 hari)" },
    ],
    paket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 },
    ],
    stok: [
      { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
      { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
      { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
      { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" },
      { kode: "MKDU4221", judul: "Sistem Informasi Manajemen", kategori: "MK Wajib", upbjj: "Padang", lokasiRak: "R4-A1", harga: 58000, qty: 0, safety: 10, catatanHTML: "Stok <strong>kosong</strong>, menunggu kiriman pusat" },
      { kode: "SATS4411", judul: "Metode Statistika", kategori: "MK Wajib", upbjj: "Denpasar", lokasiRak: "R2-D2", harga: 62000, qty: 40, safety: 15, catatanHTML: "Kondisi baik" },
    ],
    tracking: [
      { "DO2025-0001": { nim: "123456789", nama: "Rina Wulandari", status: "Dalam Perjalanan", ekspedisi: "JNE Reguler (3-5 hari)", tanggalKirim: "2025-08-25", paket: "PAKET-UT-001", total: 120000, perjalanan: [{ waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" }] } },
    ],
  };

  /**
   * Mengambil data acuan dari data/dataBahanAjar.json. Jika fetch gagal
   * (misalnya dijalankan langsung dari file://), fungsi ini otomatis
   * memakai FALLBACK_DATA agar aplikasi tetap dapat dijalankan dan diuji.
   */
  function fetchBahanAjar() {
    return fetch("data/dataBahanAjar.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Status HTTP " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.warn("Gagal memuat data/dataBahanAjar.json, memakai data cadangan.", err);
        return FALLBACK_DATA;
      });
  }

  /**
   * Struktur mentah "tracking" pada berkas JSON berbentuk larik pembungkus,
   * setiap pembungkus memiliki satu kunci bernama nomor DO, contoh:
   *   [ { "DO2025-0001": { nim: ..., nama: ... } } ]
   * Fungsi ini mengubahnya menjadi larik datar berisi objek dengan field
   * nomorDO eksplisit, memakai Object.entries untuk mengambil pasangan
   * kunci-bernama (name based index) dan nilainya dari setiap pembungkus.
   * Data dengan nomor DO yang sama diduplikasi hanya diambil satu kali.
   */
  function normalizeTracking(rawTrackingArray) {
    var seen = {};
    var result = [];
    (rawTrackingArray || []).forEach(function (wrapper) {
      Object.entries(wrapper).forEach(function (pair) {
        var nomorDO = pair[0];
        var detail = pair[1];
        if (seen[nomorDO]) return;
        seen[nomorDO] = true;
        result.push(Object.assign({ nomorDO: nomorDO }, detail));
      });
    });
    return result;
  }

  return {
    fetchBahanAjar: fetchBahanAjar,
    normalizeTracking: normalizeTracking,
  };
})();
