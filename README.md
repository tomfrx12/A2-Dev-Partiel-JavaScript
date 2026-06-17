# Kibab : plat des dieux

Application web de gestion de recettes de kebab, réalisée en React + Vite dans le cadre d'un partiel de développement JavaScript.

## Fonctionnalités

- **Ajout de recettes** : saisir un nom et des ingrédients pour créer une recette
- **Envoi en cuisine** : envoyer une recette en cuisine avec une sauce au choix
- **Suivi en temps réel** : chronomètre qui s'incrémente chaque seconde pour chaque commande en cuisine, avec horodatage via l'API [timeapi.io](https://timeapi.io) (heure de Paris)
- **Validation / suppression** : valider une commande (la retire des deux listes) ou la supprimer indépendamment
- **Persistance** : les recettes et les commandes en cuisine sont sauvegardées dans le `localStorage`

## Stack technique

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

## Build de production

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── App.jsx       # Composant principal (logique + UI)
├── App.css       # Styles globaux
└── main.jsx      # Point d'entrée React
```