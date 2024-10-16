window.addEventListener('DOMContentLoaded', () => {
    // Si tu veux exposer certaines API ou objets au contexte de la fenêtre
    // tu peux le faire ici. Par exemple :
    window.versions = {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    }
})
