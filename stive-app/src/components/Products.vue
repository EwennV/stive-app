<template>
  <div class="products-container">
    <h2 class="title">Produits</h2>
    <div class="filters">
      <select v-model="selectedFamily">
        <option value="">Familles</option>
        <option v-for="family in families" :key="family.id" :value="family.id">
          {{ family.name }}
        </option>
      </select>

      <select v-model="selectedVintage">
        <option value="">Millésimes</option>
        <option v-for="vintage in vintages" :key="vintage.id" :value="vintage.id">
          {{ vintage.year }}
        </option>
      </select>

      <select v-model="selectedDomain">
        <option value="">Domaine</option>
        <option v-for="domain in domains" :key="domain.id" :value="domain.id">
          {{ domain.name }}
        </option>
      </select>

      <select v-model="selectedSupplier">
        <option value="">Fournisseur</option>
        <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
          {{ supplier.name }}
        </option>
      </select>

      <input type="text" v-model="searchQuery" placeholder="Rechercher un produit..." />
      <button @click="searchProducts">Rechercher</button>
    </div>

    <button class="add-button">+ Ajouter</button>

    <table class="product-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Réf.</th>
          <th>Nom</th>
          <th>Domaine</th>
          <th>Millésimes</th>
          <th>Prix vente</th>
          <th>Prix achat. Four</th>
          <th>Fournisseur</th>
          <th>Quantité</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in filteredProducts" :key="product.id">
          <td>{{ index + 1 }}</td>
          <td>{{ product.reference }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.domain }}</td>
          <td>{{ product.vintage }}</td>
          <td>{{ product.sellPrice }} €</td>
          <td>{{ product.purchasePrice }} €</td>
          <td>{{ product.supplier }}</td>
          <td>{{ product.quantity }}</td>
          <td class="actions flex gap-4">
            <button class="rounded-lg bg-green-700 px-4 py-2 text-white shadow-md hover:bg-green-600 transition" @click="editProduct(product)">Modifier</button>
            <button class="rounded-lg bg-gray-500 px-4 py-2 text-white shadow-md hover:bg-gray-400 transition" @click="duplicateProduct(product)">Copier</button>
            <button class="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition" @click="deleteProduct(product)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      selectedFamily: '',
      selectedVintage: '',
      selectedDomain: '',
      selectedSupplier: '',
      products: [
        { id: 1, reference: "P001", name: "Vin Rouge", domain: "Château A", vintage: "2019", sellPrice: 20, purchasePrice: 10, supplier: "Fournisseur X", quantity: 50 },
        { id: 2, reference: "P002", name: "Vin Blanc", domain: "Domaine B", vintage: "2020", sellPrice: 25, purchasePrice: 12, supplier: "Fournisseur Y", quantity: 30 }
      ],
      families: [{ id: 1, name: "Rouges" }, { id: 2, name: "Blancs" }],
      vintages: [{ id: 1, year: "2019" }, { id: 2, year: "2020" }],
      domains: [{ id: 1, name: "Château A" }, { id: 2, name: "Domaine B" }],
      suppliers: [{ id: 1, name: "Fournisseur X" }, { id: 2, name: "Fournisseur Y" }]
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (!this.selectedFamily || p.familyId === this.selectedFamily) &&
        (!this.selectedVintage || p.vintage === this.selectedVintage) &&
        (!this.selectedDomain || p.domain === this.selectedDomain) &&
        (!this.selectedSupplier || p.supplier === this.selectedSupplier)
      )
    }
  },
  methods: {
    searchProducts() {
      console.log("Recherche :", this.searchQuery)
    },
    editProduct(product) {
      console.log("Modifier", product)
    },
    duplicateProduct(product) {
      console.log("Dupliquer", product)
    },
    deleteProduct(product) {
      console.log("Supprimer", product)
      this.products = this.products.filter(p => p.id !== product.id)
    }
  }
}
</script>

<style scoped>
.products-container {
  padding: 20px;
  background-color: #f8f8f8;
}

.title {
  color: #8a1c34;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.filters select, .filters input, .filters button {
  padding: 5px;
  border-radius: 5px;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.product-table th {
  background-color: #8a1c34;
  color: white;
  padding: 10px;
}

.product-table td {
  padding: 8px;
  text-align: center;
}
</style>
