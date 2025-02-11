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
            async askForToken() {
                const loginData = {
                    email: this.email,
                    password: this.password,
                };
                try {
                    const r = await fetch('https://localhost:44308/Auth/login', {
                        method: 'POST',
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(loginData)
                    });

                    if (!r.ok) {
                        throw new Error(`HTTP error! status: ${r.status}`);
                    } else {
                        const data = await r.json();
                        const token = data.token;
                        // Sauvegarder le token (dans localStorage par exemple)
                        localStorage.setItem("authToken", token);
                        // Orientation vers la page d'accueil
                        this.goToHome();
                    }
                } catch (error) {
                    // En cas d'erreur, affichez un message d'erreur
                    this.errorMessage = "Identifiants incorrects.";
                } finally {
                    // Réactivez le bouton après la connexion
                    this.isLoading = false;
                }
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

                    //const response = await axios.post("https://sewv02.ewenn-vallois.fr/stive/Auth/login", loginData);
                    const response = await axios.post("https://localhost:44308/Auth/login", loginData); 

                    // Si la connexion est réussie, récupérez le jeton
                    const token = response.data.token;

                    // Sauvegarder le token (dans localStorage par exemple)
                    localStorage.setItem("authToken", token);

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
            <form @submit.prevent="askForToken">
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
            </form>
        </div>
    </div>
</template>
