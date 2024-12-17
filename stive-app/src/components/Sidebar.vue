<script setup>
import TopBar from './TopBar.vue'
</script>

<template>
  <div class="flex h-screen flex-col">
    <TopBar />
    <div class="flex flex-row">
      <!-- Menu burger (visible sur mobile) -->
      <button class="p-2 m-2 text-gray-700 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-500"
        @click="toggleSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Sidebar -->
      <aside :class="[
        'fixed inset-y-0 left-0 bg-white text-gray-800 w-64 transform',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'transition-transform duration-300 ease-in-out lg:static lg:translate-x-0'
      ]">
        <nav>
          <ul class="mt-4">
            <li v-for="menu in menus" :key="menu.name" class="mb-2">
              <button @click="setActiveItem(menu)" :class="[
                'flex items-center justify-between w-full px-4 py-2 text-left rounded-md focus:outline-none',
                menu.isActive ? 'bg-rose-100 border-2 border-rose-700' : 'hover:border-2 hover:border-rose-700'
              ]">
                <span class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-file-earmark-spreadsheet" viewBox="0 0 16 16">
                    <path :d="menu.path" />
                  </svg>
                  <span>{{ menu.name }}</span>
                </span>
                <svg v-if="menu.subMenus" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': menu.isOpen }" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <!-- Sous-menus -->
              <ul v-if="menu.subMenus && menu.isOpen" class="pl-8 text-sm">
                <li v-for="subMenu in menu.subMenus" :key="subMenu"
                  class="py-2 hover:border-2 hover:border-rose-700 rounded-md p-2"
                  @click="setActiveSubMenu(menu, subMenu)">
                  {{ subMenu }}
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Contenu principal -->
      <main class="flex-1 p-4 m-128">
        <h1 class="text-xl font-bold text-rose-700" v-if="activeItem && !activeSubItem">{{ activeItem.name }}</h1>
        <h1 class="text-xl font-bold text-rose-700" v-if="activeItem && activeSubItem">
          {{ activeItem.name }}/{{ activeSubItem }}</h1>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: true, // État du menu burger
      activeItem: null, // Item actif
      activeSubItem: null, // Sous-item actif
      menus: [
        {
          name: 'Produits',
          path: "M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5zM3 12v-2h2v2zm0 1h2v2H4a1 1 0 0 1-1-1zm3 2v-2h3v2zm4 0v-2h3v1a1 1 0 0 1-1 1zm3-3h-3v-2h3zm-7 0v-2h3v2z",
          isOpen: false,
          isActive: true,
        },
        {
          name: 'Famille',
          path: "M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
          isOpen: false,
          isActive: false,
        },
        {
          name: 'Commande',
          path: "M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708",
          subMenus: ['Clients', 'Fournisseur'],
          isOpen: false,
          isActive: false,
        },
        {
          name: 'Inventaire',
          path: "M0 .5A.5.5 0 0 1 .5 0h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 .5m4 0a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10A.5.5 0 0 1 4 .5m-4 2A.5.5 0 0 1 .5 2h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-4 2A.5.5 0 0 1 .5 4h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m-4 2A.5.5 0 0 1 .5 6h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5",
          isOpen: false,
          isActive: false,
        },
        {
          name: 'Utilisateurs',
          path: "M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
          isOpen: false,
          isActive: false,
        },
      ],
    }
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen
    },
    setActiveItem(item) {
      // Désactiver tous les autres onglets
      this.menus.forEach(menu => {
        if (menu !== item) {
          menu.isActive = false
          menu.isOpen = false
        }
      })

      // Activer l'onglet sélectionné
      item.isActive = true
      if (item.subMenus) {
        item.isOpen = !item.isOpen
      } else {
        this.activeSubItem = null
      }

      this.activeItem = item
    },
    setActiveSubMenu(menu, subMenu) {
      this.activeSubItem = subMenu
    },
  }

}
</script>
