<template>
  <div class="flex items-center justify-between bg-white shadow-md h-12 px-4">
    <!-- Logo à gauche -->
    <div class="text-black text-2xl font-serif tracking-wide">
      NEGOSUD
    </div>
    <!-- Icône et Bouton à droite -->
    <div class="flex items-center space-x-2">
      <div class="bg-red-800 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
        BL
      </div>
      <button class="text-gray-700 hover:text-black transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
}
</script>

<style scoped>
</style>
