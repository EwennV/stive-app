<template>
    <div>
        <!-- Indicateur de chargement -->
        <div v-if="loading">Chargement des données...</div>

        <!-- Affichage des erreurs -->
        <div v-else-if="error" style="color: red">
            Une erreur est survenue : {{ error }}
        </div>

        <!-- Affichage du tableau si les données sont chargées -->
        <div v-else class="w9/12">
            <div class="my-6 flex justify-between items-center">
                <h3 class="text-xl font-bold text-pink-800">Produits</h3>
                <button @click="openModal" class="text-l w-30 bg-green-800 hover:bg-green-700 text-white py-1 px-4 rounded">+ Ajouter</button>
            </div>
            <table class="w-full my-8">
                <thead>
                    <tr>
                        <th class="bg-pink-800 text-gray-50" v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in results" :key="index">
                        <td>{{ item.id }}</td>
                        <td>{{ item.reference }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.house }} </td>
                        <td>{{ item.bottlingDate }}</td>
                        <td>{{ item.sellPrice }}€</td>
                        <td>{{ item.purchasePrice }}€</td>
                        <td>{{ item.supplier.name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>
                            <div class="flex space-x-2 justify-between">
                                <button class="rounded bg-blue-600 px-4 py-2 text-white">Voir</button>
                                <button @click="openModalToUpdateProduct(item)" class="rounded bg-green-800 px-4 py-2 text-white">Modifier</button>
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
                    {{ modalType === 'add' ? 'Ajouter un produit' : 'Modifier un produit' }}
                </h2>
                <form @submit.prevent="modalType === 'add' ? createProduct() : updateProduct(newItem)" class="flex flex-wrap -mx-2">
                    <!-- Champ Nom -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Nom :</label>
                        <input v-model="newItem.name" type="text" class="w-full px-3 py-2 border rounded" placeholder="Nom" required />
                    </div>
                    <!-- Champ Référence -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Référence :</label>
                        <input v-model="newItem.reference" type="text" class="w-full px-3 py-2 border rounded" placeholder="Référence" required />
                    </div>
                    <!-- Champ Catégorie -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Catégorie :</label>
                        <select v-model="newItem.categoryIds" multiple class="w-full px-3 py-2 border rounded">
                            <option v-for="(category, index) in categories" :key="index" :value="category.id">{{ category.name }}</option>
                        </select>
                    </div>
                    <!-- Champ Domaine -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Domaine :</label>
                        <input v-model="newItem.house" type="text" class="w-full px-3 py-2 border rounded" placeholder="Domaine" required />
                    </div>
                    <!-- Champ Mise en bouteille -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Mise en bouteille :</label>
                        <input v-model="newItem.bottlingDate" type="text" class="w-full px-3 py-2 border rounded" placeholder="Mise en bouteille" required />
                    </div>
                    <!-- Champ Prix de vente -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Prix de vente :</label>
                        <input v-model="newItem.sellPrice" type="number" step="0.01" class="w-full px-3 py-2 border rounded" placeholder="Prix de vente" required />
                    </div>
                    <!-- Champ TVA à la vente -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">TVA vente (%) :</label>
                        <input v-model="newItem.sellTva" type="number" step="0.01" class="w-full px-3 py-2 border rounded" placeholder="TVA vente" />
                    </div>
                    <!-- Champ Quantité -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Quantité en stock :</label>
                        <input v-model="newItem.quantity" type="number" class="w-full px-3 py-2 border rounded" placeholder="Quantité en stock" required />
                    </div>
                    <!-- Champ Seuil de déclenchement commande fournisseur -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Seuil de déclenchement :</label>
                        <input v-model="newItem.minThreshold" type="text" class="w-full px-3 py-2 border rounded" placeholder="Seuil de déclenchement" required />
                    </div>
                    <!-- Champ Quantité à commander -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Quantité à commander :</label>
                        <input v-model="newItem.reorderQuantity" type="number" class="w-full px-3 py-2 border rounded" placeholder="Quantité à commander" required />
                    </div>
                    <!-- Champ Fournisseur -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Fournisseur :</label>
                        <select v-model="newItem.supplierId" class="w-full px-3 py-2 border rounded">
                            <option v-for="(supplier, index) in suppliers" :key="index" :value="supplier.id">{{ supplier.name }}</option>
                        </select>
                    </div>
                    <!-- Champ Commande automatique -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Commande automatique :</label>
                        <select v-model="newItem.autoProvisioning" class="w-full px-3 py-2 border rounded">
                            <option :value="true">Oui</option>
                            <option :value="false">Non</option>
                        </select>
                    </div>
                    <!-- Champ Prix d'achat -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">Prix d'achat :</label>
                        <input v-model="newItem.purchasePrice" type="number" step="0.01" class="w-full px-3 py-2 border rounded" placeholder="Prix d'achat" required />
                    </div>
                    <!-- Champ TVA à l'achat -->
                    <div class="w-1/2 px-2">
                        <label class="block text-gray-700">TVA à l'achat (%) :</label>
                        <input v-model="newItem.purchaseTva" type="number" step="0.01" class="w-full px-3 py-2 border rounded" placeholder="TVA à l'achat" required />
                    </div>
                    <!-- Champ Image produit -->
                    <div class="w-full px-2">
                        <label class="block text-gray-700">Image produit :</label>
                        <input v-model="newItem.imageName" type="text" class="w-full px-3 py-2 border rounded" placeholder="Image produit" />
                    </div>
                    <!-- Boutons -->
                    <div class="w-full flex justify-end mt-4 px-2">
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
                <p>Êtes-vous sûr de vouloir supprimer le produit {{ productToDelete.name }} ?</p>
                <div class="flex justify-end mt-4">
                    <button @click="closeConfirmModal" class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded mr-2">Annuler</button>
                    <button @click="deleteProduct" class="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded">Supprimer</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "ResultsPage",
        data() {
            return {
                results: [], // Données de l'API
                suppliers: [],
                categories: [],
                loading: true, // Indicateur de chargement
                error: null, // Gestion des erreurs
                modalType: null,
                isModalOpen: false, // Contrôle de la fenêtre modale
                isConfirmModalOpen: false, // Contrôle de la fenêtre de confirmation
                productToDelete: null, // Produit sélectionné pour suppression
                newItem: {
                    name: "",
                    reference: "",
                    sellPrice: "",
                    sellTva: "",
                    quantity: "",
                    minThreshold: "",
                    reorderQuantity: "",
                    bottlingDate: "",
                    purchasePrice: "",
                    purchaseTva: "",
                    house: "",
                    imageName: "",
                    autoProvisioning: false,
                    supplierId: "",
                    categoryIds: []
                }, // Nouveau produit
                tableHeaders: ["#", "Réf.", "Nom", "Domaine", "Millésimes", "Prix vente", "Prix achat. Four", "Fournisseur", "Quantité", "Actions"], // Entêtes du tableau
            };
        },
        methods: {
            // Appel API pour récupérer les fournisseurs
            async fetchProducts() {
                try {
                    const token = localStorage.getItem("authToken");
                    const response = await fetch("https://localhost:44308/api/Product", {
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

                this.fetchSuppliers();
                this.fetchCategories();
            },
            // Appel API pour récupérer les fournisseurs
            async fetchSuppliers() {
                try {
                    const token = localStorage.getItem("authToken");
                    const response = await fetch("https://localhost:44308/api/Supplier", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then(r => r.json());
                    this.suppliers = response;
                } catch (err) {
                    this.error = err.message || "Erreur inattendue";
                } finally {
                    this.loading = false;
                }
            },

            // Appel API pour récupérer les catégories
            async fetchCategories() {
                try {
                    const token = localStorage.getItem("authToken");
                    const response = await fetch("https://localhost:44308/api/Category", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then(r => r.json());
                    this.categories = response;
                } catch (err) {
                    this.error = err.message || "Erreur inattendue";
                } finally {
                    this.loading = false;
                }
            },

            // Ouvrir la modale de confirmation
            confirmDelete(product) {
                this.productToDelete = product;
                this.isConfirmModalOpen = true;
            },

            // Fermer la modale de confirmation
            closeConfirmModal() {
                this.productToDelete = null;
                this.isConfirmModalOpen = false;
            },

            // Supprimer le fournisseur
            async deleteProduct() {
                const token = localStorage.getItem("authToken");
                try {
                    const response = await fetch(`https://localhost:44308/api/Product/${this.productToDelete.id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    // Rafraîchir la liste des clients
                    this.fetchProducts();
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
                this.newItem = { name: "", reference: "", sellPrice: "", sellTva: "", quantity: "", minThreshold: "", reorderQuantity: "",
                        bottlingDate: "", purchasePrice: "", purchaseTva: "", house: "", imageName: "", autoProvisioning: false,
                            supplierId: "", categoryIds: [] };
            },

            // Soumettre le formulaire
            async createProduct() {
                const token = localStorage.getItem("authToken");
                try {
                    const r = await fetch('https://localhost:44308/api/Product', {
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
                    this.newItem = { name: "", reference: "", sellPrice: "", sellTva: "", quantity: "", minThreshold: "", reorderQuantity: "",
                            bottlingDate: "", purchasePrice: "", purchaseTva: "", house: "", imageName: "", autoProvisioning: false,
                            supplierId: "", categoryIds: [] };
                    this.fetchProducts();
                }
            },

            openModalToUpdateProduct(product) {
                this.modalType = 'update';
                this.newItem = { ...product };
                this.newItem.categoryIds = [];
                this.newItem.supplierId = product.supplier.id;
                if (Array.isArray(product.categories)) {
                    for (const categ of product.categories) {
                        this.newItem.categoryIds.push(categ.id);
                    }
                }
            },

            async updateProduct(product) {
                const token = localStorage.getItem("authToken");
                try {
                    const r = await fetch(`https://localhost:44308/api/Product/${product.id}`, {
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
                    this.newItem = { name: "", reference: "", sellPrice: "", sellTva: "", quantity: "", minThreshold: "", reorderQuantity: "",
                            bottlingDate: "", purchasePrice: "", purchaseTva: "", house: "", imageName: "", autoProvisioning: false,
                            supplierId: "", categoryIds: [] };
                    this.fetchProducts();
                }
            },

            openModal() {
                this.modalType = 'add'; // Modal d'ajout
                this.newItem = { name: "", reference: "", sellPrice: "", sellTva: "", quantity: "", minThreshold: "", reorderQuantity: "",
                        bottlingDate: "", purchasePrice: "", purchaseTva: "", house: "", imageName: "", autoProvisioning: false,
                        supplierId: "", categoryIds: []  }; // Nouveau produit
            }

        },
        mounted() {
            this.fetchProducts();
        },
    };
</script>