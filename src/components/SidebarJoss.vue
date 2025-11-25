<template>
  <div>
    <!-- Start Side Bar -->
    <div
      :class="{
        'w-14': !isiSidebar,
        'w-60': isiSidebar,
      }"
      class="z-10 bg-gradient-to-r font-Poppins from-purple-200 to-slate-100 pl-3 h-[100vh] w-14 transition-transform duration-500 relative"
    >
      <span
        @click="openSidebar"
        class="material-icons transition-transform duration-500 cursor-pointer bg-purple-700 text-white border border-purple-800 rounded-full absolute -right-3 top-9"
        :class="{
          'rotate-180': !isiSidebar,
          'rotate-0': isiSidebar,
        }"
        >arrow_back</span
      >
      <div
        class="flex items-center bg-gradient-to-r from-purple-200 to-white rounded-r-lg space-x-2"
      >
        <img src="../assets/logo_rukun.png" class="w-10 h-10" />
        <h1 v-if="isiSidebar" class="font-Poppins ml-5 text-xl">
          <span class="font-semibold text-[#ca13c5]">SANTRI</span
          ><span class="font-semibold text-[#2b94f1]">PESANTREN</span>
        </h1>
      </div>
      <div class="flex items-center cursor-pointer ml-3 mt-6">
        <router-link to="/dashboard/santri">
          <span class="material-icons text-[#e52bf1] w-12 h-12">dashboard</span>
          <span v-if="isiSidebar" class="text-blue-600 text-base"
            >Santri</span
          ></router-link
        >
      </div>
      <div class="flex items-center cursor-pointer ml-3 mt-6">
        <router-link to="/dashboard/pesantren">
          <span class="material-icons text-[#e52bf1] w-12 h-12">dashboard_customize</span>
          <span v-if="isiSidebar" class="text-blue-600 text-base"
            >Pesantren</span
          ></router-link
        >
      </div>
      <div v-for="menu in menus" :key="menu.title" class="mt-4">
        <div class="flex justify-between hover:bg-slate-100 rounded-md">
          <div
            @click="toggleSubmenu(menu)"
            class="flex items-center cursor-pointer ml-3 mt-4"
          >
            <span class="material-icons text-[#e52bf1]">{{ menu.icon }}</span>
            <span v-if="isiSidebar" class="ml-2 text-blue-600">{{
              menu.title
            }}</span>
          </div>
          <span
            v-if="isiSidebar && menu.submenu"
            :class="{
              'rotate-180': menu.submenu && menu.open,
              'rotate-0': !menu.submenu && menu.open,
            }"
            class="material-icons text-blue-600 right-2 mt-4"
            >arrow_drop_down</span
          >
        </div>

        <ul
          v-if="menu.open && menu.submenu && isiSidebar"
          class="text-[#0824a1] bg-yellow-200 rounded-md ml-6 z-10"
        >
          <li
            v-for="sub in menu.submenu"
            :key="sub.name"
            class="hover:bg-slate-100 hover:font-semibold p-1"
          >
            <RouterLink :to="sub.path" class="block">{{ sub.name }}</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  data() {
    return {
      isiSidebar: false,
      menus: [
        {
          title: "Santri Profile",
          icon: "settings_accessibility",
          submenu: [
            {
              name: "Daftar Pengajuan",
              path: "/santri/daftar",
            },
            {
              name: "Verifikasi Santri",
              path: "/santri/verifikasi",
            },
            {
              name: "ALokasi Bantuan",
              path: "/santri/alokasi",
            },
            {
              name: "Laporan Pertanggungjawaban",
              path: "/santri/laporan",
            },
            {
              name: "AI Document Upload Test",
              path: "/santri/ocr-test",
            }
          ],
          open: false,
        },
        {
          title: "Pesantren Profile",
          path: "/pesantren",
          icon: "mosque",
          submenu: [
            {
              name: "Daftar Pengajuan",
              path: "/pesantren/daftar",
            },
            {
              name: "Verifikasi Pesantren",
              path: "/pesantren/verifikasi",
            },
            {
              name: "Alokasi Bantuan Pesantren",
              path: "/pesantren/alokasi",
            },
            {
              name: "Laporan Pertanggungjawaban",
              path: "/pesantren/laporan",
            },
            {
              name: "AI Document Upload Test",
              path: "/santri/ocr-test",
            },
          ],
          open: false,
        },
      ],
    };
  },
  methods: {
    openSidebar() {
      this.isiSidebar = !this.isiSidebar;
    },

    toggleSubmenu(menu) {
      menu.open = !menu.open;
    },
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .w-64 {
    width: 100%;
  }
}
</style>
