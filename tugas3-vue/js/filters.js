/* ===========================================================
   filters.js — Vue filter untuk formatting data teks
   Tugas Praktik 3 — STSI4209 Pemrograman Berbasis Web
   =========================================================== */

// Filter "rupiah": menambahkan currency Rp dan pemisah ribuan.
// Dipakai pada template misalnya {{ item.harga | rupiah }}
Vue.filter("rupiah", function (value) {
  var n = Number(value) || 0;
  return "Rp " + n.toLocaleString("id-ID");
});

// Filter "satuan": menambahkan satuan "buah" di belakang angka.
// Dipakai misalnya {{ item.qty | satuan }}
Vue.filter("satuan", function (value) {
  var n = Number(value) || 0;
  return n.toLocaleString("id-ID") + " buah";
});

// Filter "tanggalIndo": memformat tanggal ISO (yyyy-mm-dd) menjadi
// format Indonesia "tanggal bulan tahun", contoh "25 Agustus 2025".
Vue.filter("tanggalIndo", function (value) {
  if (!value) return "-";
  var d = new Date(value + "T00:00:00");
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
});
