/* ===========================================================
   order-form.js — <order-form>
   Formulir pemesanan / pencatatan Delivery Order baru.
   Tugas Praktik 3 — STSI4209 Pemrograman Berbasis Web
   =========================================================== */

function todayISO() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

Vue.component("order-form", {
  props: {
    paket: { type: Array, required: true },
    ekspedisi: { type: Array, required: true },
    jumlahDoSaatIni: { type: Number, default: 0 },
  },

  data: function () {
    return {
      form: { nim: "", nama: "", ekspedisiKode: "", paketKode: "", tanggalKirim: todayISO() },
      errors: {},
    };
  },

  computed: {
    // Computed property: nomor DO berikutnya mengikuti pola DO{tahun}-{urut},
    // dihitung dari jumlah Delivery Order yang sudah tercatat saat ini.
    nextNomorDO: function () {
      var year = new Date().getFullYear();
      var seq = this.jumlahDoSaatIni + 1;
      return "DO" + year + "-" + String(seq).padStart(4, "0");
    },

    selectedPaketDetail: function () {
      return this.paket.find(function (p) {
        return p.kode === this.form.paketKode;
      }, this) || null;
    },

    totalHarga: function () {
      return this.selectedPaketDetail ? this.selectedPaketDetail.harga : 0;
    },
  },

  watch: {
    // Watcher: input NIM disaring agar hanya berisi digit angka selagi
    // pengguna mengetik.
    "form.nim": function (newVal) {
      var digitsOnly = (newVal || "").replace(/\D/g, "");
      if (digitsOnly !== newVal) this.form.nim = digitsOnly;
    },
  },

  methods: {
    resetForm: function () {
      this.form = { nim: "", nama: "", ekspedisiKode: "", paketKode: "", tanggalKirim: todayISO() };
      this.errors = {};
    },

    // Dipanggil lewat @submit.prevent pada <form>: menekan Enter di kolom
    // manapun pada formulir ini langsung menyimpan Delivery Order baru.
    submitOrder: function () {
      var f = this.form;
      var errors = {};
      if (!f.nim || f.nim.length < 6) errors.nim = "NIM wajib diisi, minimal 6 digit angka.";
      if (!f.nama.trim()) errors.nama = "Nama wajib diisi.";
      if (!f.ekspedisiKode) errors.ekspedisiKode = "Ekspedisi wajib dipilih.";
      if (!f.paketKode) errors.paketKode = "Paket bahan ajar wajib dipilih.";
      this.errors = errors;
      if (Object.keys(errors).length > 0) return;

      var ekspedisiItem = this.ekspedisi.find(function (e) { return e.kode === f.ekspedisiKode; });

      this.$emit("created", {
        nomorDO: this.nextNomorDO,
        nim: f.nim,
        nama: f.nama.trim(),
        status: "Dalam Perjalanan",
        ekspedisi: "JNE " + (ekspedisiItem ? ekspedisiItem.nama : ""),
        tanggalKirim: f.tanggalKirim || todayISO(),
        paket: f.paketKode,
        total: this.totalHarga,
        perjalanan: [{ waktu: f.tanggalKirim + " 09:00:00", keterangan: "Pesanan diterima sistem SITTA" }],
      });

      this.resetForm();
    },
  },

  template: "#tpl-order-form",
});
