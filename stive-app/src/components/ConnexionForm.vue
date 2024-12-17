<script>
    import axios from "axios";

    export default {
        name: "ConnexionForm",
        data() {
            return {
                email: "",
                password: "",
                errorMessage: "",
                isLoading: false, // Ajouter une propriété pour gérer l'état de chargement
            };
        },
        methods: {
            goToHome() {
                this.$router.push('/home'); // Navigation vers la page "Home"
            },
            async handleLogin() {
                // Désactive le bouton pendant la connexion
                this.isLoading = true;
                this.errorMessage = ""; // Réinitialiser le message d'erreur

                // Préparer les données de connexion
                const loginData = {
                    email: this.email,
                    password: this.password,
                };

                try {
                    // Effectuer la requête de connexion
                    const response = await axios.post("https://localhost:44308/Auth/login", loginData);

                    // Si la connexion est réussie, récupérez le jeton
                    const token = response.data.token;

                    // Sauvegarder le token (dans localStorage par exemple)
                    localStorage.setItem("authToken", token);

                    // Affichez un message de succès ou effectuez une redirection
                    alert("Connexion réussie !");

                    // Orientation vers la page d'accueil
                    this.goToHome();

                } catch (error) {
                    console.log(error)
                    // En cas d'erreur, affichez un message d'erreur
                    this.errorMessage = "Identifiants incorrects.";
                } finally {
                    // Réactivez le bouton après la connexion
                    this.isLoading = false;
                }
            }
        },
    };
</script>

<template>
    <div class="flex justify-center mt-16 h-screen w-screen">
        <div class="w-48 max-w-full">
            <h1 class="text-2xl text-pink-800">Connexion</h1>
            <form @submit.prevent="handleLogin">
                <div>
                    <div><label for="email">Email :</label></div>
                    <div>
                        <input class="w-full text-gray-900 rounded bg-gray-200 px-2"
                               type="email"
                               id="email"
                               v-model="email"
                               required
                               placeholder="Entrez votre email" />
                    </div>
                </div>
                <div>
                    <div class="mt-1"><label for="password">Mot de passe :</label></div>
                    <div>
                        <input class="w-full text-gray-900 rounded bg-gray-200 px-2"
                               type="password"
                               id="password"
                               v-model="password"
                               required
                               placeholder="Entrez votre mot de passe" />
                    </div>
                </div>
                <button class="text-xl w-full bg-green-800 hover:bg-green-700 text-white mt-4 py-1 px-4 rounded"
                        type="submit">Se connecter</button>
                <div v-if="errorMessage" class="text-red-600 mt-2 text-center">
                    {{ errorMessage }}
                </div>
                <div class="mt-1 text-right italic text-xs">
                    <RouterLink to="/register">Se cr&eacute;er un compte</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>
