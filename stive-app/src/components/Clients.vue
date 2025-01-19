<template>
    <div>
        <!-- Indicateur de chargement -->
        <div v-if="loading">Chargement des donn&eacute;es...</div>

        <!-- Affichage des erreurs -->
        <div v-else-if="error" style="color: red">
            Une erreur est survenue : {{ error }}
        </div>

        <!-- Affichage du tableau si les données sont chargées -->
        <div v-else class="w9/12">
            <div class="my-6 flex justify-between items-center">
                <h3 class="text-xl font-bold text-pink-800">Clients</h3>
                <button @click="openModal" class="text-l w-30 bg-green-800 hover:bg-green-700 text-white py-1 px-4 rounded">+ Ajouter</button>
            </div>
            <!-- <div class="text-right w-11/12">
             </div>-->
            <table class="w-full my-8">
                <thead>
                    <tr>
                        <th class="bg-pink-800 text-gray-50" v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredResults" :key="index">
                        <td>{{ item.id }}</td>
                        <td>{{ item.firstName }}</td>
                        <td>{{ item.lastName }}</td>
                        <td>{{ item.address1 }} {{ item.address2 }} {{ item.postalCode }} {{ item.city }}</td>
                        <td>{{ item.email }}</td>
                        <td>
                            <div class="flex space-x-2 justify-between">
                                <button class="rounded bg-blue-600 px-4 py-2 text-white">Voir</button>
                                <button @click="openModalToUpdateClient(item)" class="rounded bg-green-800 px-4 py-2 text-white">Modifier</button>
                                <button @click="confirmDelete(item)" class="rounded bg-red-800 px-4 py-2 text-white">Supprimer</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Fenêtre modale commune (create/update) -->
        <div v-if="modalType" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div class="bg-white rounded-lg shadow-lg w-1/3 max-h-[90vh] p-6 overflow-auto">
                <h2 class="text-xl text-pink-800 font-bold mb-4">
                    {{ modalType === 'add' ? 'Ajouter un client' : 'Modifier un client' }}
                </h2>
                <form @submit.prevent="modalType === 'add' ? createUser() : updateUser(newItem)">
                    <!-- Contenu du formulaire -->
                    <div class="mb-4">
                        <label class="block text-gray-700">Pr&eacute;nom :</label>
                        <input v-model="newItem.firstName" type="text" class="w-full px-3 py-2 border rounded" placeholder="Pr&eacute;nom" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Nom :</label>
                        <input v-model="newItem.lastName" type="text" class="w-full px-3 py-2 border rounded" placeholder="Nom" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Adresse 1 :</label>
                        <input v-model="newItem.address1" type="text" class="w-full px-3 py-2 border rounded" placeholder="Adresse 1" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Adresse 2 :</label>
                        <input v-model="newItem.address2" type="text" class="w-full px-3 py-2 border rounded" placeholder="Adresse 2" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Code postal :</label>
                        <input v-model="newItem.postalCode" type="text" class="w-full px-3 py-2 border rounded" placeholder="Code postal" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Ville :</label>
                        <input v-model="newItem.city" type="text" class="w-full px-3 py-2 border rounded" placeholder="Ville" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Email :</label>
                        <input v-model="newItem.email" type="email" class="w-full px-3 py-2 border rounded" placeholder="Email" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Mot de passe :</label>
                        <input v-model="newItem.password" type="password" class="w-full px-3 py-2 border rounded" placeholder="Mot de passe" required />
                    </div>
                    <!-- Autres champs du formulaire -->
                    <div class="flex justify-end">
                        <button type="button" @click="closeModal" class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded mr-2">Annuler</button>
                        <button type="submit" class="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded">{{ modalType === 'add' ? 'Ajouter' : 'Modifier' }}</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modale de confirmation pour la suppression -->
        <div v-if="isConfirmModalOpen" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div class="bg-white rounded-lg shadow-lg w-1/3 p-6">
                <h2 class="text-xl text-red-800 font-bold mb-4">Confirmer la suppression</h2>
                <p>&Ecirc;tes-vous s&ucirc;r de vouloir supprimer le client {{ userToDelete.firstName }} {{ userToDelete.lastName }} ?</p>
                <div class="flex justify-end mt-4">
                    <button @click="closeConfirmModal" class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded mr-2">Annuler</button>
                    <button @click="deleteClient" class="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded">Supprimer</button>
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
                return this.results.filter(item => item.isAdmin === false);
            }
        },
        name: "ResultsPage",
        data() {
            return {
                results: [], // Données de l'API
                loading: true, // Indicateur de chargement
                error: null, // Gestion des erreurs
                modalType: null,
                isModalOpen: false, // Contrôle de la fenêtre modale
                isConfirmModalOpen: false, // Contrôle de la fenêtre de confirmation
                userToDelete: null, // Client sélectionné pour suppression
                newItem: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    isAdmin: false,
                }, // Nouveau client
                tableHeaders: ["ID", "Prenom", "Nom", "Adresse", "Email", "Actions"], // Entêtes du tableau
            };
        },
        methods: {
            // Appel API pour récupérer les clients
            async fetchUsers() {
                try {
                    const token = localStorage.getItem("authToken");
                    const response = await fetch("https://localhost:44308/api/User", {
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
            confirmDelete(client) {
                this.userToDelete = client;
                this.isConfirmModalOpen = true;
            },

            // Fermer la modale de confirmation
            closeConfirmModal() {
                this.userToDelete = null;
                this.isConfirmModalOpen = false;
            },

            // Supprimer le client
            async deleteClient() {
                 const token = localStorage.getItem("authToken");
                try {
                    const response = await fetch(`https://localhost:44308/api/User/${this.userToDelete.id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    // Rafraîchir la liste des clients
                    this.fetchUsers();
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
                this.newItem = { firstName: "", lastName: "", adress1: "", address2: "", postalCode: "", city: "", email: "", password: "", isAdmin: false };
            },

            // Soumettre le formulaire
            async createUser() {
                const token = localStorage.getItem("authToken");
                try {
                    const r = await fetch('https://localhost:44308/api/User', {
                        method: 'POST',
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
                    this.newItem = { firstName: "", lastName: "", adress1: "", address2: "", postalCode: "", city: "", email: "", password: "", isAdmin: false };
                    this.fetchUsers();
                }
            },

            openModalToUpdateClient(client) {
                this.modalType = 'update'; // Modal de mise à jour
                this.newItem = { ...client };
            },

            async updateUser(user) {
                const token = localStorage.getItem("authToken");
                try {
                    const r = await fetch(`https://localhost:44308/api/User/${user.id}`, {
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
                    this.newItem = { firstName: "", lastName: "", adress1: "", address2: "", postalCode: "", city: "", email: "", password: "", isAdmin: false };
                    this.fetchUsers();
                }
            },

            openModal() {
                this.modalType = 'add'; // Modal d'ajout
                this.newItem = {
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    isAdmin: false,
                };
            }

        },
        mounted() {
            this.fetchUsers();
        },
    };
</script>
