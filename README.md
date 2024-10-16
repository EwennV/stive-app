# Client Lourd STIVE - Bloc4
## Technologies utilisées
<img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/electron-icon.png" width="20" height="20"> [`ElectronJS`](https://www.electronjs.org/fr/): Une plateforme pour créer des applications desktop à partir de technologies web.

<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSDKn3vA2YUbXzN0ZC3gALWJ08gJN-Drl15w&s" width="20" height="20"> [`TailwindCSS`](https://tailwindcss.com/): Un framework CSS utilitaire pour un développement rapide d'interfaces utilisateur modernes.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

    Node.js et npm: nécessaires pour installer les dépendances et exécuter les scripts npm.

Vérifiez que Node.js et npm sont bien installés :

```bash
node -v
npm -v
```
## Tutoriel d'installation du projet

    Clonez le dépôt sur votre machine locale

Initialiser npm
Si ce n'est pas déjà fait, initialisez npm dans le répertoire du projet :

```bash
npm init -y
```

Installez Electron en tant que dépendance de développement :

```bash
npm install electron --save-dev
```

Installer TailwindCSS et ses dépendances CSS :

```bash
npm install -D tailwindcss
```

## Lancer le projet
```bash
npm run start
```

Lancer le watcher de TailwindCSS
Pour compiler et surveiller les fichiers CSS avec TailwindCSS, exécutez la commande suivante :

```bash
npx tailwindcss -i ./app/css/input.css -o ./app/css/output.css --watch
```

Cela va surveiller les changements dans le fichier input.css et générer automatiquement un fichier CSS compilé dans output.css.