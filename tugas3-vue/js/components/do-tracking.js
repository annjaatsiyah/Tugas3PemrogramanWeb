/* ===========================================================
   do-tracking.js — <do-tracking>
   Menampilkan, mencari, dan memperbarui progres Delivery Order.
   Tugas Praktik 3 — STSI4209 Pemrograman Berbasis Web
   =========================================================== */

Vue.component("do-tracking", {
  props: {
    data: { type: Array, required: true },
  },

  data: function () {
    return {
      searchQuery: "",
      appliedSearch: "",
      selectedNomor: null,
      progressForm: { keterangan: "" },
    };
  },

  computed: {
    filteredList: function () {
      var q = this.appliedSearch.trim().toLowerCase();
      if (!q) return this.data;
      return this.data.filter(function (item) {
        return item.nomorDO.toLowerCase().indexOf(q) !== -1 || item.nim.indexOf(q) !== -1;
      });
    },

    selectedDO: function () {
      return this.data.find(function (item) {
        return item.nomorDO === this.selectedNomor;
      }, this) || null;
    },

    // Objek ringkasan dipakai pada template dengan
    // v-for="(value, key) in selectedDOSummary", yaitu bentuk pengolahan
    // array/objek dengan name based index (key bernama), berbeda dari
    // v-for(item, index) berbasis angka pada tabel stok. Field perjalanan
    // dan nomorDO dikeluarkan karena sudah ditampilkan tersendiri.
    selectedDOSummary: function () {
      if (!this.selectedDO) return {};
      var summary = {};
      Object.keys(this.selectedDO).forEach(function (k) {
        if (k !== "perjalanan" && k !== "nomorDO") summary[k] = this.selectedDO[k];
      }, this);
      return summary;
    },
  },

  watch: {
    // Watcher: jika pengguna menghapus seluruh teks pencarian secara manual
    // (tanpa menekan Esc), pencarian yang sedang diterapkan ikut dikosongkan
    // supaya daftar langsung kembali menampilkan seluruh data.
    searchQuery: function (newVal) {
      if (newVal.trim() === "") this.appliedSearch = "";
    },
  },

  methods: {
    // Dipicu oleh @keyup.enter pada kolom pencarian (event handler keyboard).
    doSearch: function () {
      this.appliedSearch = this.searchQuery;
      if (this.filteredList.length === 0) {
        this.selectedNomor = null;
      } else if (this.filteredList.length === 1) {
        this.selectedNomor = this.filteredList[0].nomorDO;
      }
    },

    // Dipicu oleh @keyup.esc pada kolom pencarian (event handler keyboard).
    clearSearch: function () {
      this.searchQuery = "";
      this.appliedSearch = "";
    },

    viewDetail: function (item) {
      this.selectedNomor = item.nomorDO;
      this.progressForm.keterangan = "";
    },

    statusKey: function (status) {
      return status;
    },

    // Dipicu lewat @submit.prevent, sehingga tombol Enter pada kolom
    // keterangan langsung menyimpan progres baru.
    submitProgress: function () {
      var text = this.progressForm.keterangan.trim();
      if (!text || !this.selectedDO) return;
      var now = new Date();
      var waktu = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0") +
        " " + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");
      this.$emit("tambah-progress", { nomorDO: this.selectedDO.nomorDO, waktu: waktu, keterangan: text });
      this.progressForm.keterangan = "";
    },
  },

  template: "#tpl-do-tracking",
});
