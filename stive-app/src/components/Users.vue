<template>
    <div>

        <!-- Indicateur de chargement -->
        <div v-if="loading">Chargement des donn�es...</div>

        <!-- Affichage des erreurs -->
        <div v-else-if="error" style="color: red">
            Une erreur est survenue : {{ error }}
        </div>

        <!-- Affichage du tableau si les donn�es sont charg�es -->
        <table class="w-11/12 my-8 " v-else>
            <thead>
                <tr>
                    <th class="bg-pink-800 text-gray-50 text-center" v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in results" :key="index">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.email }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'ResultsPage',
        data() {
            return {
                results: [], // Stocke les donn�es de l'API
                loading: true, // Indicateur de chargement
                error: null, // Gestion des erreurs
                tableHeaders: ['ID', 'Nom', 'Email'], // Ent�tes du tableau
                count: 0,
            };
        },
        methods: {
            // Appel API pour r�cup�rer les r�sultats
            async fetchData() {
                try {
                    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                    this.results = response.data; // Stockage des donn�es r�cup�r�es
                } catch (err) {
                    this.error = err.message || 'Erreur inattendue';
                } finally {
                    this.loading = false; // Fin du chargement
                }
            },
        },
        mounted() {
            // Appel de l'API lorsque le composant est mont�
            this.fetchData();
        },
    };
</script>
