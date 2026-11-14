/* ===========================================================
   app-modal.js — <app-modal>
   Dialog generik yang dipakai ulang untuk formulir tambah/ubah
   dan konfirmasi hapus pada <ba-stock-table>.
   Tugas Praktik 3 — STSI4209 Pemrograman Berbasis Web
   =========================================================== */

Vue.component("app-modal", {
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: "" },
  },
  template: "#tpl-app-modal",
  methods: {
    onKeydown: function (e) {
      // Event handler keyboard: tombol Esc menutup modal yang sedang terbuka.
      if (e.key === "Escape" && this.show) this.$emit("close");
    },
  },
  mounted: function () {
    document.addEventListener("keydown", this.onKeydown);
  },
  beforeDestroy: function () {
    document.removeEventListener("keydown", this.onKeydown);
  },
});
