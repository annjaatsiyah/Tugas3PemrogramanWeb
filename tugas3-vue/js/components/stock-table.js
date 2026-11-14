/* ===========================================================
   stock-table.js — <ba-stock-table>
   Tabel stok bahan ajar: filter, urutan, serta fitur create,
   update, dan delete data.
   Tugas Praktik 3 — STSI4209 Pemrograman Berbasis Web
   =========================================================== */

Vue.component("ba-stock-table", {
  props: {
    items: { type: Array, required: true },
    upbjjList: { type: Array, required: true },
    kategoriList: { type: Array, required: true },
  },

  data: function () {
    return {
      // ---- Filter & urutan ----
      filterUpbjj: "",
      filterKategori: "",
      onlyReorder: false,
      sortBy: "judul",
      sortDir: "asc",
      showFilterPanel: true,

      // ---- Modal (tambah / ubah / hapus) ----
      modalMode: "", // '' | 'tambah' | 'ubah' | 'hapus'
      form: this.emptyForm(),
      errors: {},
      hapusTarget: null,

      // ---- Notifikasi ----
      toastMessage: "",
      toastType: "success",
      toastTimer: null,
    };
  },

  computed: {
    // Computed property: Vue hanya menghitung ulang daftar ini ketika salah
    // satu data reaktif yang dipakai (items, filter, atau urutan) benar-benar
    // berubah, sehingga tidak perlu recompute manual pada setiap render.
    filteredSortedStok: function () {
      var list = this.items.filter(function (item) {
        if (this.filterUpbjj && item.upbjj !== this.filterUpbjj) return false;
        if (this.filterKategori && item.kategori !== this.filterKategori) return false;
        if (this.onlyReorder && !(item.qty === 0 || item.qty < item.safety)) return false;
        return true;
      }, this);

      var key = this.sortBy;
      var dir = this.sortDir === "desc" ? -1 : 1;
      return list.slice().sort(function (a, b) {
        if (typeof a[key] === "string") return a[key].localeCompare(b[key]) * dir;
        return (a[key] - b[key]) * dir;
      });
    },

    reorderCount: function () {
      return this.items.filter(function (item) {
        return item.qty === 0 || item.qty < item.safety;
      }).length;
    },

    modalTitle: function () {
      if (this.modalMode === "tambah") return "Tambah Bahan Ajar Baru";
      if (this.modalMode === "ubah") return "Ubah Data Bahan Ajar";
      if (this.modalMode === "hapus") return "Konfirmasi Hapus";
      return "";
    },
  },

  watch: {
    // Watcher 1: dependent options. Setiap kali UT-Daerah berganti, filter
    // Kategori yang sedang aktif dikosongkan agar tidak menyaring dengan
    // kombinasi yang sudah tidak relevan.
    filterUpbjj: function () {
      this.filterKategori = "";
    },

    // Watcher 2: kode mata kuliah pada formulir tambah/ubah otomatis
    // dikapitalkan selagi pengguna mengetik, agar format kode tetap
    // konsisten dengan data yang sudah ada.
    "form.kode": function (newVal) {
      var upper = (newVal || "").toUpperCase();
      if (upper !== newVal) this.form.kode = upper;
    },
  },

  methods: {
    emptyForm: function () {
      return { kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", harga: null, qty: null, safety: null, catatanHTML: "" };
    },

    statusKey: function (item) {
      if (item.qty === 0) return "kosong";
      if (item.qty < item.safety) return "menipis";
      return "aman";
    },

    resetFilters: function () {
      this.filterUpbjj = "";
      this.filterKategori = "";
      this.onlyReorder = false;
      this.sortBy = "judul";
      this.sortDir = "asc";
    },

    showToast: function (message, type) {
      this.toastMessage = message;
      this.toastType = type || "success";
      clearTimeout(this.toastTimer);
      var self = this;
      this.toastTimer = setTimeout(function () {
        self.toastMessage = "";
      }, 2800);
    },

    // ---- Buka modal ----
    openTambah: function () {
      this.form = this.emptyForm();
      this.errors = {};
      this.modalMode = "tambah";
    },
    openUbah: function (item) {
      this.form = Object.assign({}, item);
      this.errors = {};
      this.modalMode = "ubah";
    },
    openHapus: function (item) {
      this.hapusTarget = item;
      this.modalMode = "hapus";
    },
    closeModal: function () {
      this.modalMode = "";
      this.hapusTarget = null;
    },

    validateForm: function () {
      var f = this.form;
      var errors = {};
      var isTambah = this.modalMode === "tambah";
      if (!f.kode.trim()) errors.kode = "Kode mata kuliah wajib diisi.";
      else if (isTambah && this.items.some(function (s) { return s.kode === f.kode.trim(); })) errors.kode = "Kode ini sudah terdaftar.";
      if (!f.judul.trim()) errors.judul = "Nama mata kuliah wajib diisi.";
      if (!f.kategori) errors.kategori = "Kategori wajib dipilih.";
      if (!f.upbjj) errors.upbjj = "UT-Daerah wajib dipilih.";
      if (!f.lokasiRak.trim()) errors.lokasiRak = "Lokasi rak wajib diisi.";
      if (f.harga === null || f.harga < 0) errors.harga = "Harga wajib diisi dengan angka 0 atau lebih.";
      if (f.qty === null || f.qty < 0) errors.qty = "Jumlah stok wajib diisi dengan angka 0 atau lebih.";
      if (f.safety === null || f.safety < 0) errors.safety = "Safety stock wajib diisi dengan angka 0 atau lebih.";
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },

    // Dipanggil lewat @submit.prevent pada <form>, sehingga tombol Enter di
    // kolom manapun pada formulir ini otomatis menyimpan data (event handler
    // keyboard), selain lewat klik tombol Simpan (event handler mouse).
    submitForm: function () {
      if (!this.validateForm()) {
        this.showToast("Lengkapi data dengan benar sebelum menyimpan.", "danger");
        return;
      }
      var payload = {
        kode: this.form.kode.trim(),
        judul: this.form.judul.trim(),
        kategori: this.form.kategori,
        upbjj: this.form.upbjj,
        lokasiRak: this.form.lokasiRak.trim(),
        harga: Number(this.form.harga),
        qty: Number(this.form.qty),
        safety: Number(this.form.safety),
        catatanHTML: this.form.catatanHTML.trim() || "\u2014",
      };

      if (this.modalMode === "tambah") {
        this.$emit("stok-tambah", payload);
        this.showToast("Bahan ajar baru berhasil ditambahkan.", "success");
      } else {
        this.$emit("stok-ubah", payload);
        this.showToast("Data " + payload.kode + " berhasil diperbarui.", "success");
      }
      this.closeModal();
    },

    confirmHapus: function () {
      this.$emit("stok-hapus", this.hapusTarget.kode);
      this.showToast("Data " + this.hapusTarget.kode + " telah dihapus.", "success");
      this.closeModal();
    },
  },

  template: "#tpl-stock-table",
});
