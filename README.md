# Client Lourd STIVE - Bloc4
## Technologies utilisées
<img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/electron-icon.png" width="20" height="20"> [`ElectronJS`](https://www.electronjs.org/fr/): Une plateforme pour créer des applications desktop à partir de technologies web.

<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSDKn3vA2YUbXzN0ZC3gALWJ08gJN-Drl15w&s" width="20" height="20"> [`TailwindCSS`](https://tailwindcss.com/): Un framework CSS utilitaire pour un développement rapide d'interfaces utilisateur modernes.

<img src="https://images.ctfassets.net/ooa29xqb8tix/RrX9HCiZ8qPoIpJSlHphR/f9778b44e2b768d31fafb4ac70956682/vue-logo.png?w=400&q=50" width="20" height="20"> [`Vue.Js`](https://vuejs.org/): Un framework Javascript favorable à l'utilisation de composants et à une programmation moderne.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

    Node.js et npm: nécessaires pour installer les dépendances et exécuter les scripts npm.

Vérifiez que Node.js et npm sont bien installés :

```bash
node -v
npm -v
```
## Tutoriel d'installation du projet

Clonez le dépôt sur votre machine locale via `git clone <repository>`

Déplacez vous dans le projet
```bash
cd stive-app
```

Installer les dépendances liées au projet.
```bash
npm install
```

## Lancer le projet
```bash
npm run build
npm run start
```

Lancer le watcher de TailwindCSS
Pour compiler et surveiller les fichiers CSS avec TailwindCSS, exécutez la commande suivante :

```bash
npx tailwindcss -i ./src/assets/input.css -o ./src/assets/output.css --watch
```

Cela va surveiller les changements de classes css dans les fichiers .html, .js, .ts, ... et générer automatiquement un fichier CSS compilé dans `./src/assets/output.css`.