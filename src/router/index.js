import { createRouter, createWebHistory } from 'vue-router'
import MainPesantrenPageView from '../views/MainPesantrenPageView.vue'
import TabelPengajuanInfrastrukturPesantren from '../components/TabelPengajuanInfrastrukturPesantren.vue'
import FormPengajuanBantuanPesantren from '../views/FormPengajuanBantuanPesantren.vue'

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/MainDashboardSantri.vue"),
    meta: {
      requiresAuth: true,
      allowedRoles: ["admin", "officer"],
    },
  },
  {
    path: "/dashboard/santri",
    name: "dashboard_santri",
    component: () => import("../views/MainDashboardSantri.vue"),
  },
  {
    path: "/dashboard/pesantren",
    name: "dashboard_pesantren",
    component: () => import("../views/MainDashBoardPesantren.vue"),
  },
  {
    path: "/santri",
    name: "santri",
    component: () => import("../views/MainSantriPageView.vue"),
    children: [
      {
        path: "daftar",
        name: "daftar_santri",
        component: () => import("../components/TabelPengajuanBantuanSantri.vue"),
      },
      {
        path: "form/:data?",
        name: "form_santri",
        component: () => import("../components/FormPengajuanBantuanSantri.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "verifikasi",
        name: "daftar_verifikasi_santri",
        component: () => import("../components/TabelHasilVerifikasiSantri.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "verifikasi/form/:data?",
        name: "form_verifikasi_santri",
        component: () => import("../components/FormVerifikasiSantri.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "alokasi",
        name: "daftar_alokasi_santri",
        component: () => import("../components/TabelPengalokasianBantuanSantri.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "alokasi/form/:data?",
        name: "form_alokasi_santri",
        component: () => import("../components/FormPersetujuanAlokasiSantri.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "dokumen/:data?",
        name: "dokumen_santri",
        component: () => import("../components/LembarDokumenSantri.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "laporan",
        name: "laporan_santri",
        component: () => import("../views/FormPertanggungjawabanBantuanSantri.vue"),
      },
      {
        path: "ocr-test",
        name: "ocr_test",
        component: () => import("../views/OcrTestPage.vue"),
      },
    ],
  },
  {
    path: "/pesantren",
    name: "pesantren",
    component: () => import("../views/MainPesantrenPageView.vue"),
    children: [
      {
        path: "daftar",
        name: "daftar_pesantren",
        component: () => import("../components/TabelPengajuanInfrastrukturPesantren.vue"),
      },
      {
        path: "form/:data?",
        name: "form_pesantren",
        component: () => import("../views/FormPengajuanBantuanPesantren.vue"),
      },
      {
        path: "verifikasi",
        name: "daftar_verifikasi_pesantren",
        component: () => import("../components/TabelHasilVerifikasiPesantren.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "verifikasi/form/:data?",
        name: "form_verifikasi_pesantren",
        component: () => import("../views/FormVerifikasiPesantren.vue"),
      },
      {
        path: "alokasi",
        name: "daftar_alokasi_pesantren",
        component: () => import("../components/TablePengalokasianBantuanPesantren.vue"),
      },
      {
        path: "alokasi/form/:data?",
        name: "form_alokasi_pesantren",
        component: () => import("../components/FormPersetujuanAlokasiBantuanPesantren.vue"),
      },
      {
        path: "dokumen/:data?",
        name: "dokumen_pesantren",
        component: () => import("../components/LembarDokumenPesantren.vue"),
      },
      {
        path: "laporan",
        name: "laporan_pesantren",
        component: () => import("../views/FormPertanggungjawabanBantuanPesantren.vue"),
      },
    ],
  },
  {
    path: "/chart",
    name: "chart",
    component: () => import("../components/IncomeExpenseChart.vue"),
  },
  {
    path: "/main",
    name: "main",
    component: () => import("../views/MainLayoutView.vue"),
    meta: {
      requiresAuth: true,
      allowedRoles: ["admin", "officer"],
    },
  },
  {
    path: "/menu",
    name: "menu",
    component: () => import("../views/MainPageLayout.vue"),
  },
  {
    path: "/form",
    name: "form",
    component: () => import("../views/MainFormSample.vue"),
  },
  {
    path: "/error",
    name: "error",
    component: () => import("../views/MainPageErrorView.vue"),
    children: [
      {
        name: "unauthorized",
        path: "unauthorized",
        component: () => import("../user/UnauthPage.vue"),
      },
      {
        name: "notfound",
        path: "notfound",
        component: () => import("../user/PageNotFaound.vue"),
      },
      {
        path: "logout",
        name: "logout",
        component: () => import("../user/LogoutUser.vue"),
      },
      {
        path: "aktivasi/:id",
        name: "aktivasi",
        component: () => import("../profile/AktivasiUser.vue"),
      },
    ],
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/MainProfilePageView.vue"),
    children: [
      {
        path: "input",
        name: "input",
        component: () => import("../profile/IsiProfileEntity.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "input/polygon",
        name: "input_polygon",
        component: () => import("../profile/IsiDataPolygon.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "register/user",
        name: "register_user",
        component: () => import("../profile/RegisterUser.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
    ],
  },
  {
    path: "/warga",
    name: "warga",
    component: () => import("../views/MainWargaPageView.vue"),
    children: [
      {
        path: "input/blok",
        name: "input_blok",
        component: () => import("../warga/InputBlokWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "input/warga",
        name: "input_warga",
        component: () => import("../warga/IsiDataWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "input/type",
        name: "input_type",
        component: () => import("../warga/InputTypeWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "input/pekerjaan",
        name: "input_pekerjaan",
        component: () => import("../warga/InputPekerjaanWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "input/status",
        name: "input_status",
        component: () => import("../warga/InputStatusWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "modal",
        name: "modal",
        component: () => import("../components/ToastCard.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "daftar/kk",
        name: "daftar_kk",
        component: () => import("../warga/DaftarKkWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "daftar/table",
        name: "daftar_table",
        component: () => import("../warga/TabelBlokWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "tambah/warga/:nik/:kk",
        name: "tambah_warga",
        component: () => import("../warga/TambahWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "list/kk",
        name: "table_kk",
        component: () => import("../warga/TableKkWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "list/warga/kk/:id",
        name: "table_warga_per_kk",
        component: () => import("../warga/TableWargaKk.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "edit/warga/:nik/:kk",
        name: "edit_warga",
        component: () => import("../warga/EditWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "edit/kk/:nik/:kk",
        name: "edit_rumah",
        component: () => import("../warga/EditRumahKk.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "del/kk/:nik/:kk",
        name: "del_rumah",
        component: () => import("../warga/DelRumahWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"],
        },
      },
      {
        path: "upload/fotokk/:id/:nama",
        name: "upload_fotokk",
        component: () => import("../warga/UploadFotoKK.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "upload/fotoktp/:id/:nama",
        name: "upload_fotoktp",
        component: () => import("../warga/UploadFotoKTP.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../user/loginUser.vue"),
  },
  {
    path: "/anggaran",
    name: "anggaran",
    component: () => import("../views/MainAnggaranPageView.vue"),
    children: [
      {
        path: "input/type",
        name: "input_type_anggaran",
        component: () => import("../anggaran/InputTypeAnggaran.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "input/anggaran",
        name: "input_anggaran",
        component: () => import("../anggaran/InputAnggaranWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "input/jenis/anggaran/masuk",
        name: "input_jenis_anggaran_masuk",
        component: () => import("../anggaran/IsiJenisAnggaranMasuk.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "edit/jenis/anggaran/masuk/:id",
        name: "edit_jenis_anggaran_masuk",
        component: () => import("../anggaran/EditJenisAnggaranMasuk.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "input/jenis/anggaran/keluar",
        name: "input_jenis_anggaran_keluar",
        component: () => import("../anggaran/IsiJenisAnggaranKeluar.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "edit/jenis/anggaran/keluar/:id",
        name: "edit_jenis_anggaran_keluar",
        component: () => import("../anggaran/EditJenisAnggaranKeluar.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "upload/bukti/:id/:nama",
        name: "upload_bukti_anggaran",
        component: () => import("../anggaran/InputFileBuktiSetor.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
    ],
  },
  {
    path: "/iuran",
    name: "iuran",
    component: () => import("../views/MainIuranPageView.vue"),
    children: [
      {
        path: "input/iuran",
        name: "input_iuran",
        component: () => import("../iuran/IsiIuranWarga.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "input/jenis",
        name: "input_jenis_iuran",
        component: () => import("../iuran/IsiJenisIuran.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "edit/jenis/:id",
        name: "edit_jenis_iuran",
        component: () => import("../iuran/EditJenisIuran.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "bayar/iuran",
        name: "bayar_iuran",
        component: () => import("../warga/TableKKBayarIuran.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "bayar/kk/:id/:nama",
        name: "bayar_iuran_kk",
        component: () => import("../iuran/BayarIuranKK.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin", "officer"],
        },
      },
      {
        path: "warga/sudah",
        name: "sudah_bayar_iuran",
        component: () => import("../warga/LaporanSudahIuran.vue"),
      },
      {
        path: "warga/belum",
        name: "belum_bayar_iuran",
        component: () => import("../warga/LaporanBelumIuran.vue"),
      },
    ],
  },
  {
    name: "laporan",
    path: "/laporan",
    component: () => import("../views/MainLaporanView.vue"),
  },
  {
    path: "/cobasidebar",
    name: "cobasidebar",
    component: () => import("../components/CobaSidebar.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/MainDashboardSantri.vue"),
  },
  {
    path: "/polygon",
    name: "polygon",
    component: () => import("../profile/GetPolygonData.vue"),
  },
  {
    path: "/daftarkk",
    name: "daftarkk",
    component: () => import("../components/DaftarKK.vue"),
    meta: {
      requiresAuth: true,
      allowedRoles: ["admin", "officer"],
    },
  },
  {
    path: "/daftarkk/update",
    name: "updatekk",
    component: () => import("../components/UpdateTabelKK.vue"),
    meta: {
      requiresAuth: true,
      allowedRoles: ["admin"],
    },
  },
  {
    path: "/status",
    name: "status",
    component: () => import("../warga/TabelStatusWarga.vue"),
    meta: {
      requiresAuth: true,
      allowedRoles: ["admin"],
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }; // scroll ke atas setiap ganti halaman
  },
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  const userRole = localStorage.getItem("level"); // misalnya: "admin"

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next("/login");
    }

    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
      return next("/error/unauthorized"); // atau tampilkan pesan akses ditolak
    }
  }

  return next(); // lanjutkan ke route yang dituju
});

export default router;
