/* ===========================================================
   app.js — Inisialisasi Vue root
   Tugas Praktik 3 — STSI4209 Pemrograman Berbasis Web
   =========================================================== */

var app = new Vue({
  el: "#app",

  data: {
    tab: "stok", // 'stok' | 'tracking' | 'order'
    loading: true,
    loadError: "",
    state: {
      upbjjList: [],
      kategoriList: [],
      pengirimanList: [],
      paket: [],
      stok: [],
      tracking: [],
    },
  },

  created: function () {
    var self = this;
    api
      .fetchBahanAjar()
      .then(function (data) {
        self.state.upbjjList = data.upbjjList;
        self.state.kategoriList = data.kategoriList;
        self.state.pengirimanList = data.pengirimanList;
        self.state.paket = data.paket;
        self.state.stok = data.stok;
        self.state.tracking = api.normalizeTracking(data.tracking);
        self.loading = false;
      })
      .catch(function () {
        self.loadError = "Data bahan ajar tidak dapat dimuat.";
        self.loading = false;
      });
  },

  methods: {
    // ---- Stok: ketiga handler ini menjadi satu-satunya tempat yang
    // mengubah state.stok, sehingga <ba-stock-table> tetap murni presentasional
    // dan hanya memancarkan (emit) kejadian ke induknya. ----
    handleStokTambah: function (item) {
      this.state.stok.push(item);
    },
    handleStokUbah: function (updated) {
      var idx = this.state.stok.findIndex(function (s) { return s.kode === updated.kode; });
      if (idx > -1) this.$set(this.state.stok, idx, updated);
    },
    handleStokHapus: function (kode) {
      var idx = this.state.stok.findIndex(function (s) { return s.kode === kode; });
      if (idx > -1) this.state.stok.splice(idx, 1);
    },

    // ---- Tracking ----
    handleNewDO: function (newDO) {
      this.state.tracking.push(newDO);
      this.tab = "tracking";
    },
    handleTambahProgress: function (payload) {
      var rec = this.state.tracking.find(function (t) { return t.nomorDO === payload.nomorDO; });
      if (rec) {
        rec.perjalanan.push({ waktu: payload.waktu, keterangan: payload.keterangan });
      }
    },
  },
});
