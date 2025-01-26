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
            </div>
            <div class="p-4">
                <table class="min-w-full table-auto border-collapse border border-gray-200 shadow-md">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="border border-gray-200 px-4 py-2 text-left">ID</th>
                            <th class="border border-gray-200 px-4 py-2 text-left">Nom</th>
                            <th class="border border-gray-200 px-4 py-2 text-left">Quantité</th>
                            <th class="border border-gray-200 px-4 py-2 text-left">Nouvelle Quantité</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in products"
                            :key="product.id"
                            class="hover:bg-gray-50">
                            <td class="border border-gray-200 px-4 py-2">{{ product.id }}</td>
                            <td class="border border-gray-200 px-4 py-2">{{ product.name }}</td>
                            <td class="border border-gray-200 px-4 py-2">{{ product.quantity }}</td>
                            <td class="border border-gray-200 px-4 py-2">
                                <input type="number"
                                       v-model.number="product.newQuantity"
                                       placeholder="Nouvelle quantité"
                                       class="w-full px-2 py-1 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="mt-4">
                    <button @click="updateQuantities"
                            class="px-4 py-2 bg-blue-500 text-white font-medium rounded shadow hover:bg-blue-600">
                        Mettre à jour
                    </button>
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
                products: [], // Données de l'API
                loading: true, // Indicateur de chargement
                error: null, // Gestion des erreurs
                modalType: null,
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
                    this.products = response;
                } catch (err) {
                    this.error = err.message || "Erreur inattendue";
                } finally {
                    this.loading = false;
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
                    this.errorMessage = "Impossible de mettre à jour l'inventaire.";
                } finally {
                    // Réactivez le bouton après la connexion
                    this.isLoading = false;
                    this.newItem = {
                        name: "", reference: "", sellPrice: "", sellTva: "", quantity: "", minThreshold: "", reorderQuantity: "",
                        bottlingDate: "", purchasePrice: "", purchaseTva: "", house: "", imageName: "", autoProvisioning: false,
                        supplierId: "", categoryIds: []
                    };
                    this.fetchProducts();
                }
            },

            updateQuantities() {
                this.products.forEach((product) => {
                    if (typeof product.newQuantity === "number" && product.newQuantity >= 0) {
                        this.newItem = { ...product };
                        this.newItem.categoryIds = [];
                        this.newItem.supplierId = product.supplier?.id || null;
                        if (Array.isArray(product.categories)) {
                            for (const categ of product.categories) {
                                this.newItem.categoryIds.push(categ.id);
                            }
                        }
                        this.newItem.quantity = product.newQuantity;
                        this.updateProduct(product);

                        // Lance une commande fournisseur si on passe en-dessous du seuil
                        if (product.newQuantity < product.minThreshold && product.autoProvisioning === true) {
                            this.reorderToSupplier(product);
                        }

                        product.newQuantity = null; // Réinitialise le champ de saisie
                    }
                });
            },
        },

        mounted() {
            this.fetchProducts();
        },
    };
</script>