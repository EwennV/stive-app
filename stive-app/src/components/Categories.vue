<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Indicateur de chargement -->
        <div v-if="loading" class="text-center text-gray-600">Chargement des donn&eacute;es...</div>

        <!-- Affichage des erreurs -->
        <div v-else-if="error" class="text-center text-red-600 font-semibold">
            Une erreur est survenue : {{ error }}
        </div>

        <!-- Affichage des données chargées -->
        <div v-else class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div class="mb-6 flex justify-between items-center">
                <h3 class="text-2xl font-bold text-pink-800">Familles</h3>
                <button @click="openModal"
                        class="bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded-lg shadow-md transition">
                    + Ajouter
                </button>
            </div>

            <ul class="space-y-4 ml-4 border-l-2 border-gray-400 pl-4">
                <li v-for="item in filteredResults" :key="item.id" class="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div class="flex justify-start items-center">
                        <span class="text-gray-800 font-semibold">{{ item.name }}</span>
                        <div class="space-x-2 ml-4">
                            <button @click="openModalToUpdateCategory(item)"
                                    class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded-md">
                                Modifier
                            </button>
                            <button @click="confirmDelete(item)"
                                    class="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md">
                                Supprimer
                            </button>
                        </div>
                    </div>
                    <ul class="ml-6 mt-2 space-y-2 border-l-2 border-gray-400">
                        <li v-for="itemb in getDaughters(item.id)" :key="itemb.id" class="text-gray-700 ml-4">
                            - {{ itemb.name }}
                            <button @click="openModalToUpdateCategory(itemb)"
                                    class="ml-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md">
                                Modifier
                            </button>
                            <button @click="confirmDelete(itemb)"
                                    class="ml-2 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md">
                                Supprimer
                            </button>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <!-- Modale (create/update) -->
        <div v-if="modalType" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div class="bg-white rounded-lg shadow-lg w-1/3 p-6">
                <h2 class="text-xl text-pink-800 font-bold mb-4">
                    {{ modalType === 'add' ? 'Ajouter une famille' : 'Modifier une famille' }}
                </h2>
                <form @submit.prevent="modalType === 'add' ? createCategory() : updateCategory(newItem)">
                    <div class="mb-4">
                        <label class="block text-gray-700 font-semibold">Nom :</label>
                        <input v-model="newItem.name" type="text" class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-pink-300" placeholder="Nom" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-semibold">Famille mère :</label>
                        <select v-model="newItem.categoryParentId" class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-pink-300">
                            <option :value="0">Aucune</option>
                            <option v-for="item in results" :key="item.id" :value="item.id">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button type="button" @click="closeModal" class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg">Annuler</button>
                        <button type="submit" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg">{{ modalType === 'add' ? 'Ajouter' : 'Modifier' }}</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modale de confirmation pour la suppression -->
        <div v-if="isConfirmModalOpen" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div class="bg-white rounded-lg shadow-lg w-1/3 p-6">
                <h2 class="text-xl text-red-800 font-bold mb-4">Confirmer la suppression</h2>
                <p>&Ecirc;tes-vous s&ucirc;r de vouloir supprimer la famille {{ categoryToDelete.name }} ?</p>
                <div class="flex justify-end mt-4">
                    <button @click="closeConfirmModal" class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded mr-2">Annuler</button>
                    <button @click="deleteCategory" class="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
         computed: {
            filteredResults() {
            return this.results.filter(item => !item.categoryParent);
         }
    },
        name: "ResultsPage",
        data() {
            return {
                results: [], // Données de l'API
                daughters: [],
                loading: true, // Indicateur de chargement
                error: null, // Gestion des erreurs
                modalType: null,
                isModalOpen: false, // Contrôle de la fenêtre modale
                isConfirmModalOpen: false, // Contrôle de la fenêtre de confirmation
                categoryToDelete: null, // Categorie sélectionnée pour suppression
                newItem: {
                    name: "",
                    categoryParentId: 0,
                }, // Nouvelle famille
            };
        },
        methods: {
            // Ouvrir la modale de confirmation
        confirmDelete(category) {
            this.categoryToDelete = category;
            this.isConfirmModalOpen = true;
        },
            // Retourne les objets "fils" d'une catégorie donnée
        getDaughters(parentId) {
            return this.results.filter(item => item.categoryParent?.id === parentId);
        },
            // Appel API pour récupérer les clients
            async fetchCategories() {
                try {
                    const token = localStorage.getItem("authToken");
                    const response = await fetch("https://localhost:44308/api/Category", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then(r => r.json());
                    this.results = response;
                } catch (err) {
                    this.error = err.message || "Erreur inattendue";
                } finally {
                    this.loading = false;
                }
            },

            // Ouvrir la modale de confirmation
            confirmDelete(category) {
                this.categoryToDelete = category;
                this.isConfirmModalOpen = true;
            },

            // Fermer la modale de confirmation
            closeConfirmModal() {
                this.categoryToDelete = null;
                this.isConfirmModalOpen = false;
            },

            // Supprimer le client
            async deleteCategory() {
                console.log(this.categoryToDelete.id);
                const token = localStorage.getItem("authToken");
                try {
                    const response = await fetch(`https://localhost:44308/api/Category/${this.categoryToDelete.id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    // Rafraîchir la liste des clients
                    this.fetchCategories();
                } catch (err) {
                    this.error = err.message || "Erreur inattendue lors de la suppression.";
                } finally {
                    this.closeConfirmModal();
                }
            },

            // Ouvrir la modale
            openModal() {
                this.isUpdateModalOpen = false;
                this.isModalOpen = true;
            },

            // Fermer la modale
            closeModal() {
                this.modalType = false;
                this.newItem = { name: "", categoryParentId: 0 };
            },

            // Soumettre le formulaire
            async createCategory() {
                const token = localStorage.getItem("authToken");
                try {
                    const r = await fetch('https://localhost:44308/api/Category', {
                        method: 'POST',
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify(this.newItem),
                    });

                    if (!r.ok) {
                         const errorText = await response.text();
                         console.error("Erreur HTTP :", response.status, errorText);
                        throw new Error(`HTTP error! status: ${r.status}`);
                    }
                } catch (error) {
                    // En cas d'erreur, affichez un message d'erreur
                    this.errorMessage = "Impossible de créer la famille.";
                } finally {
                    // Réactivez le bouton après la connexion
                    this.isLoading = false;
                    this.closeModal();
                    this.newItem = { name: "", categoryParentId: 0 };
                    this.fetchCategories();
                }
            },

            openModalToUpdateCategory(category) {
                this.modalType = 'update'; // Modal de mise à jour
                this.newItem = { ...category };
                this.newItem.categoryParentId = category.categoryParent ? category.categoryParent.id : 0;
            },

            async updateCategory(category) {
                const token = localStorage.getItem("authToken");
                try {
                    const r = await fetch(`https://localhost:44308/api/Category/${category.id}`, {
                        method: 'PUT',
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify(this.newItem)
                    });

                    if (!r.ok) {
                        throw new Error(`HTTP error! status: ${r.status}`);
                    }
                } catch (error) {
                    // En cas d'erreur, affichez un message d'erreur
                    this.errorMessage = "Identifiants incorrects.";
                } finally {
                    // Réactivez le bouton après la connexion
                    this.isLoading = false;
                    this.closeModal();
                    this.newItem = { name: "", categoryParentId: 0 };
                    this.fetchCategories();
                }
            },

            openModal() {
                this.modalType = 'add'; // Modal d'ajout
                this.newItem = {
                    name: "",
                    categoryParentId: 0,
                };
            }

        },
        mounted() {
            this.fetchCategories();
        },
    };
</script>
