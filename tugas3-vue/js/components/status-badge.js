/* ===========================================================
   status-badge.js — <status-badge>
   Komponen status yang dipakai ulang pada tabel stok dan daftar tracking.
   Tugas Praktik 3 — STSI4209 Pemrograman Berbasis Web
   =========================================================== */

Vue.component("status-badge", {
  // variant: 'stok' menampilkan Aman/Menipis/Kosong, 'tracking' menampilkan
  // status pengiriman. catatan (opsional) ditampilkan sebagai tooltip HTML
  // saat kursor mouse hover di atas badge (event handler mouse).
  props: {
    status: { type: String, required: true },
    variant: { type: String, default: "stok" },
    catatan: { type: String, default: "" },
  },
  data: function () {
    return { showTooltip: false };
  },
  template: "#tpl-status-badge",
});
