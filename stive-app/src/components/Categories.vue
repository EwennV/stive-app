<template>
    <div class="max-w-5xl mx-auto p-6">
        <!-- Indicateur de chargement -->
        <div v-if="loading" class="text-center text-lg font-semibold text-gray-700">
            Chargement des données...
        </div>

        <!-- Affichage des erreurs -->
        <div v-else-if="error" class="text-center text-red-600 font-semibold">
            Une erreur est survenue : {{ error }}
        </div>

        <!-- Affichage des données chargées -->
        <div v-else>
            <div class="my-6 flex justify-between items-center">
                <h3 class="text-2xl font-bold text-pink-800">Familles</h3>
                <button @click="openModal('add')"
                    class="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white py-2 px-5 rounded-lg shadow-md transition">
                    + Ajouter
                </button>
            </div>

            <div class="bg-white shadow-lg rounded-lg p-4">
                <ul>
                    <li v-for="(item, index) in filteredResults" :key="item.id"
                        class="border-b border-gray-200 py-4 px-3">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-900 font-semibold">{{ item.name }}</span>
                            <div class="flex gap-2">
                                <button @click="openModal('edit', item)"
                                    class="rounded-lg bg-green-700 px-4 py-2 text-white shadow-md hover:bg-green-600 transition">
                                    Modifier
                                </button>
                                <button @click="confirmDelete(item)"
                                    class="rounded-lg bg-red-700 px-4 py-2 text-white shadow-md hover:bg-red-600 transition">
                                    Supprimer
                                </button>
                            </div>
                        </div>

                        <!-- Liste des sous-catégories -->
                        <ul v-if="getDaughters(item.id).length" class="pl-6 mt-2">
                            <li v-for="(itemb, indexb) in getDaughters(item.id)" :key="indexb"
                                class="border-l border-gray-300 pl-4 py-2 flex justify-between items-center">
                                <span class="text-gray-800">{{ itemb.name }}</span>
                                <div class="flex gap-2">
                                    <button @click="openModal('edit', itemb)"
                                        class="rounded-lg bg-green-700 px-4 py-2 text-white shadow-md hover:bg-green-600 transition">
                                        Modifier
                                    </button>
                                    <button @click="confirmDelete(itemb)"
                                        class="rounded-lg bg-red-700 px-4 py-2 text-white shadow-md hover:bg-red-600 transition">
                                        Supprimer
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Fenêtre modale commune (ajout/modification) -->
        <div v-if="modalType"
            class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h2 class="text-2xl text-pink-800 font-bold mb-4">
                    {{ modalType === 'add' ? 'Ajouter une famille' : 'Modifier une famille' }}
                </h2>
                <form @submit.prevent="modalType === 'add' ? createCategory() : updateCategory()">
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium">Nom :</label>
                        <input v-model="newItem.name" type="text"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Nom" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium">Famille mère :</label>
                        <select v-model="newItem.categoryParentId"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                            <option :value="0">Aucune</option>
                            <option v-for="(item, index) in filteredResults" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </option>
                        </select>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button type="button" @click="closeModal"
                            class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md transition">
                            Annuler
                        </button>
                        <button type="submit"
                            class="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition">
                            {{ modalType === 'add' ? 'Ajouter' : 'Modifier' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modale de confirmation pour la suppression -->
        <div v-if="isConfirmModalOpen"
            class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h2 class="text-xl text-red-800 font-bold mb-4">Confirmer la suppression</h2>
                <p class="text-gray-700">Êtes-vous sûr de vouloir supprimer la famille <span class="font-semibold">{{ categoryToDelete.name }}</span> ?</p>
                <div class="flex justify-end mt-4 gap-2">
                    <button @click="closeConfirmModal"
                        class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md transition">
                        Annuler
                    </button>
                    <button @click="deleteCategory"
                        class="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ResultsPage",
    data() {
        return {
            results: [
                { id: 1, name: "Spiritueux", categoryParent: null },
                { id: 2, name: "Cognac", categoryParent: { id: 1} },
                { id: 3, name: "Pineau", categoryParent: { id: 1 } },
                { id: 4, name: "Vins", categoryParent: null },
                { id: 5, name: "Rosé", categoryParent: { id: 4 } },
                { id: 6, name: "Blanc", categoryParent: { id: 4 } },
                { id: 7, name: "Rouge", categoryParent: { id: 4 } },
                { id: 8, name: "Médoc", categoryParent: { id: 7 } },
                { id: 9, name: "St Émilion", categoryParent: { id: 7 } },
                { id: 10, name: "Entre deux mers", categoryParent: { id: 7 } },
            ],
            loading: false,
            error: null,
            modalType: null,
            isConfirmModalOpen: false,
            categoryToDelete: null,
            newItem: { name: "", categoryParentId: 0 },
        }
    },
    computed: {
        filteredResults() {
            return this.results.filter(item => !item.categoryParent)
        }
    },
    methods: {
        getDaughters(parentId) {
            return this.results.filter(item => item.categoryParent?.id === parentId)
        },
        confirmDelete(category) {
            this.categoryToDelete = category
            this.isConfirmModalOpen = true
        },
        closeConfirmModal() {
            this.categoryToDelete = null
            this.isConfirmModalOpen = false
        },
        deleteCategory() {
            this.results = this.results.filter(item => item.id !== this.categoryToDelete.id)
            this.closeConfirmModal()
        },
        openModal(type, item = null) {
            this.modalType = type
            this.newItem = item ? { ...item, categoryParentId: item.categoryParent?.id || 0 } : { name: "", categoryParentId: 0 }
        },
        closeModal() {
            this.modalType = null
            this.newItem = { name: "", categoryParentId: 0 }
        },
        createCategory() {
            this.results.push({ id: this.results.length + 1, name: this.newItem.name, categoryParent: this.newItem.categoryParentId ? { id: this.newItem.categoryParentId } : null })
            this.closeModal()
        },
        updateCategory() {
            const category = this.results.find(cat => cat.id === this.newItem.id)
            if (category) {
                category.name = this.newItem.name
                category.categoryParent = this.newItem.categoryParentId ? { id: this.newItem.categoryParentId } : null
            }
            this.closeModal()
        }
    }
}
</script>
