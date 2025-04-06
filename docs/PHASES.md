# Phases de Développement Frontend - NK Commerce

Ce document définit les phases de développement de l'interface utilisateur de NK Commerce avec Next.js, en se basant sur les endpoints API existants et testés.

## Phase 1: Structure de Base et Catalogue Produits

### Objectifs
- Mettre en place la structure de base du projet Next.js
- Développer les pages principales pour la navigation et l'affichage des produits
- Implémenter la recherche et le filtrage des produits

### API Endpoints Disponibles

#### Lister les produits
```
GET /api/products/
```

Exemple de réponse:
```json
[
  {
    "id": 2,
    "nom": "Parfum Élégance",
    "slug": "parfum-elegance",
    "categorie": {
      "id": 1,
      "nom": "Parfums Homme",
      "slug": "parfums-homme",
      "description": "Collection de parfums pour homme",
      "image": null,
      "date_creation": "2025-04-06T15:12:59.813694Z"
    },
    "description": "Un parfum frais et élégant pour toutes occasions",
    "prix": "39.99",
    "stock": 8,
    "disponible": true,
    "image_principale": null,
    "images": [],
    "marque": "Luxe Parfums",
    "volume": "50ml",
    "date_creation": "2025-04-06T15:13:41.255045Z"
  },
  {
    "id": 1,
    "nom": "Parfum Royal",
    "slug": "parfum-royal",
    "categorie": {
      "id": 1,
      "nom": "Parfums Homme",
      "slug": "parfums-homme",
      "description": "Collection de parfums pour homme",
      "image": null,
      "date_creation": "2025-04-06T15:12:59.813694Z"
    },
    "description": "Un parfum élégant avec des notes boisées",
    "prix": "49.99",
    "stock": 97,
    "disponible": true,
    "image_principale": null,
    "images": [],
    "marque": "Luxe Parfums",
    "volume": "100ml",
    "date_creation": "2025-04-06T15:13:34.255081Z"
  }
]
```

#### Lister les catégories
```
GET /api/products/categories/
```

Exemple de réponse:
```json
[
  {
    "id": 1,
    "nom": "Parfums Homme",
    "slug": "parfums-homme",
    "description": "Collection de parfums pour homme",
    "image": null,
    "date_creation": "2025-04-06T15:12:59.813694Z"
  }
]
```

#### Détail d'un produit (par slug)
```
GET /api/products/{slug}/
```

Exemple de réponse:
```json
{
  "id": 2,
  "nom": "Parfum Élégance",
  "slug": "parfum-elegance",
  "categorie": {
    "id": 1,
    "nom": "Parfums Homme",
    "slug": "parfums-homme",
    "description": "Collection de parfums pour homme",
    "image": null,
    "date_creation": "2025-04-06T15:12:59.813694Z"
  },
  "description": "Un parfum frais et élégant pour toutes occasions",
  "prix": "39.99",
  "stock": 8,
  "disponible": true,
  "image_principale": null,
  "images": [],
  "marque": "Luxe Parfums",
  "volume": "50ml",
  "date_creation": "2025-04-06T15:13:41.255045Z",
  "date_modification": "2025-04-06T15:33:47.178637Z"
}
```

### Pages à Développer
- Page d'accueil avec sélection de produits mis en avant
- Page catalogue avec filtres par catégorie et prix
- Page détail produit
- Barre de recherche

## Phase 2: Authentification et Profil Utilisateur

### Objectifs
- Implémenter l'inscription et la connexion utilisateur
- Développer la gestion du profil utilisateur
- Intégrer la gestion du token d'authentification

### API Endpoints Disponibles

#### Inscription utilisateur
```
POST /api/users/public/register/
```

Données à envoyer:
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123"
}
```

Exemple de réponse:
```json
{
  "id": 17,
  "username": "testuser",
  "email": "testuser@example.com",
  "first_name": "",
  "last_name": "",
  "token": "67ba96064b2a3e5af6ecf8a956c4b0fab05b9667"
}
```

#### Obtenir le profil utilisateur
```
GET /api/users/me/
```
Headers: `Authorization: Token <token>`

Exemple de réponse:
```json
{
  "id": 17,
  "username": "testuser",
  "email": "testuser@example.com",
  "first_name": "",
  "last_name": "",
  "profil": {
    "telephone": "",
    "adresse": "",
    "ville": "",
    "photo": null
  }
}
```

### Pages à Développer
- Page d'inscription
- Page de connexion
- Page de profil utilisateur
- Composant d'état d'authentification

## Phase 3: Panier et Commandes

### Objectifs
- Développer la fonctionnalité du panier d'achat
- Implémenter le processus de commande
- Gérer les paniers pour utilisateurs connectés et non connectés

### API Endpoints Disponibles

#### Voir le panier
```
GET /api/orders/panier/
```
Headers (optionnel): `Authorization: Token <token>`

Exemple de réponse (utilisateur connecté):
```json
{
  "id": 23,
  "client": 17,
  "articles": [],
  "montant_total": 0,
  "nombre_articles": 0,
  "date_creation": "2025-04-06T15:30:49.129529Z"
}
```

Exemple de réponse (utilisateur anonyme):
```json
{
  "id": 24,
  "client": null,
  "articles": [],
  "montant_total": 0,
  "nombre_articles": 0,
  "date_creation": "2025-04-06T15:30:49.230321Z"
}
```

#### Ajouter un produit au panier
```
POST /api/orders/panier/ajouter_produit/
```
Headers (optionnel): `Authorization: Token <token>`

Données à envoyer:
```json
{
  "produit_id": 2,
  "quantite": 2
}
```

Exemple de réponse:
```json
{
  "id": 23,
  "client": 17,
  "articles": [
    {
      "id": 22,
      "produit": {
        "id": 2,
        "nom": "Parfum Élégance",
        "slug": "parfum-elegance",
        "categorie": {
          "id": 1,
          "nom": "Parfums Homme",
          "slug": "parfums-homme",
          "description": "Collection de parfums pour homme",
          "image": null,
          "date_creation": "2025-04-06T15:12:59.813694Z"
        },
        "description": "Un parfum frais et élégant pour toutes occasions",
        "prix": "39.99",
        "stock": 14,
        "disponible": true,
        "image_principale": null,
        "images": [],
        "marque": "Luxe Parfums",
        "volume": "50ml",
        "date_creation": "2025-04-06T15:13:41.255045Z"
      },
      "quantite": 2,
      "montant_total": 79.98,
      "date_ajout": "2025-04-06T15:30:49.164386Z"
    }
  ],
  "montant_total": 79.98,
  "nombre_articles": 2,
  "date_creation": "2025-04-06T15:30:49.129529Z"
}
```

#### Convertir le panier en commande
```
POST /api/orders/panier/convertir_en_commande/
```
Headers (optionnel): `Authorization: Token <token>`

Données à envoyer:
```json
{
  "nom_complet": "Test User",
  "email": "testuser@example.com",
  "telephone": "123456789",
  "adresse": "123 Test Street",
  "ville": "Test City",
  "notes": "Test order"
}
```

Exemple de réponse:
```json
{
  "id_commande": 22
}
```

#### Voir les commandes (utilisateur connecté uniquement)
```
GET /api/orders/commandes/
```
Headers: `Authorization: Token <token>`

Exemple de réponse:
```json
[
  {
    "id": 22,
    "client": 17,
    "nom_complet": "Test User",
    "email": "testuser@example.com",
    "telephone": "123456789",
    "adresse": "123 Test Street",
    "ville": "Test City",
    "statut": "en_attente",
    "notes": "Test order",
    "montant_total": "79.98",
    "details": [
      {
        "id": 22,
        "produit": {
          "id": 2,
          "nom": "Parfum Élégance",
          "slug": "parfum-elegance",
          "categorie": {
            "id": 1,
            "nom": "Parfums Homme",
            "slug": "parfums-homme",
            "description": "Collection de parfums pour homme",
            "image": null,
            "date_creation": "2025-04-06T15:12:59.813694Z"
          },
          "description": "Un parfum frais et élégant pour toutes occasions",
          "prix": "39.99",
          "stock": 12,
          "disponible": true,
          "image_principale": null,
          "images": [],
          "marque": "Luxe Parfums",
          "volume": "50ml",
          "date_creation": "2025-04-06T15:13:41.255045Z"
        },
        "prix": "39.99",
        "quantite": 2,
        "montant_total": 79.98
      }
    ],
    "date_creation": "2025-04-06T15:30:49.188951Z"
  }
]
```

### Pages à Développer
- Page panier d'achat
- Page de validation de commande
- Récapitulatif de commande
- Historique des commandes (utilisateurs connectés)

## Phase 4: Panneau d'Administration

### Objectifs
- Développer l'interface admin pour la gestion des produits
- Implémenter la gestion des commandes
- Créer des tableaux de bord pour les statistiques

### API Endpoints Disponibles (Accès Admin Uniquement)

#### CRUD Produits

##### Créer un produit
```
POST /api/products/
```
Headers: `Authorization: Token <admin_token>`

Données à envoyer:
```json
{
  "nom": "Nouveau Parfum",
  "slug": "nouveau-parfum",
  "categorie_id": 1,
  "description": "Description du nouveau parfum",
  "prix": 79.99,
  "stock": 50,
  "disponible": true,
  "marque": "Luxe Test",
  "volume": "75ml"
}
```

##### Modifier un produit
```
PATCH /api/products/{slug}/
```
Headers: `Authorization: Token <admin_token>`

##### Supprimer un produit
```
DELETE /api/products/{slug}/
```
Headers: `Authorization: Token <admin_token>`

#### Confirmer une commande
```
POST /api/orders/commandes/{id}/confirm/
```
Headers: `Authorization: Token <admin_token>`

Exemple de réponse:
```json
{
  "id": 25,
  "client": null,
  "nom_complet": "Guest User",
  "email": "guest@example.com",
  "telephone": "987654321",
  "adresse": "456 Guest Street",
  "ville": "Guest City",
  "statut": "confirmee",
  "notes": "Guest order",
  "montant_total": "39.99",
  "details": [
    {
      "id": 25,
      "produit": {
        "id": 2,
        "nom": "Parfum Élégance",
        "slug": "parfum-elegance",
        "categorie": {
          "id": 1,
          "nom": "Parfums Homme",
          "slug": "parfums-homme",
          "description": "Collection de parfums pour homme",
          "image": null,
          "date_creation": "2025-04-06T15:12:59.813694Z"
        },
        "description": "Un parfum frais et élégant pour toutes occasions",
        "prix": "39.99",
        "stock": 8,
        "disponible": true,
        "image_principale": null,
        "images": [],
        "marque": "Luxe Parfums",
        "volume": "50ml",
        "date_creation": "2025-04-06T15:13:41.255045Z"
      },
      "prix": "39.99",
      "quantite": 1,
      "montant_total": 39.99
    }
  ],
  "date_creation": "2025-04-06T15:33:46.534728Z"
}
```

#### Statistiques des commandes
```
GET /api/orders/stats/orders/
```
Headers: `Authorization: Token <admin_token>`

Exemple de réponse:
```json
{
  "total_orders": 25,
  "pending_orders": 19,
  "confirmed_orders": 6,
  "status_distribution": [
    {
      "statut": "confirmee",
      "count": 6
    },
    {
      "statut": "en_attente",
      "count": 19
    }
  ],
  "recent_orders": 25
}
```

#### Statistiques des ventes
```
GET /api/orders/stats/sales/
```
Headers: `Authorization: Token <admin_token>`

Exemple de réponse:
```json
{
  "total_sales": {
    "total": 1829.55
  },
  "recent_sales": {
    "total": 1829.55
  },
  "average_order_value": {
    "avg": 73.182
  },
  "top_products": [
    {
      "produit__id": 2,
      "produit__nom": "Parfum Élégance",
      "total_quantity": 42,
      "total_sales": 1679.58
    },
    {
      "produit__id": 1,
      "produit__nom": "Parfum Royal",
      "total_quantity": 3,
      "total_sales": 149.97
    }
  ]
}
```

#### Statistiques des utilisateurs
```
GET /api/orders/stats/users/
```
Headers: `Authorization: Token <admin_token>`

Exemple de réponse:
```json
{
  "total_customers": 13,
  "repeat_customers": 2,
  "new_customers": 13,
  "top_customers": [
    {
      "client__username": "admin_user",
      "nom_complet": "Admin Test",
      "email": "admin@example.com",
      "order_count": 2,
      "total_spent": 219.95
    },
    {
      "client__username": "testuser_1743952586",
      "nom_complet": "Test User",
      "email": "testuser@example.com",
      "order_count": 1,
      "total_spent": 119.97
    }
  ]
}
```

### Pages à Développer
- Page de connexion admin
- Tableau de bord admin avec statistiques
- Interface de gestion des produits
- Interface de gestion des commandes
- Rapports de ventes

## Processus de Déploiement

1. Configuration d'un environnement de développement
2. Configuration d'un environnement de préproduction pour les tests
3. Déploiement en production avec:
   - Serveur Next.js ou export statique
   - Configuration des variables d'environnement
   - Configuration des DNS
   - Mise en place du HTTPS

## Étapes Suivantes

- Validation du design et de l'expérience utilisateur
- Tests utilisateurs avec groupe focus
- Analyse et optimisation des performances
- Plan de lancement et marketing 