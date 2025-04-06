# Formats API pour NK Commerce

Ce document fournit les formats d'entrée et de sortie des points d'API principaux pour le développement du frontend.

## Base URL

```
http://localhost:8000/api
```

## Authentification

### Inscription

**Endpoint**: `POST /api/users/register/`

**Données d'entrée**:
```json
{
  "username": "utilisateur",
  "email": "utilisateur@exemple.com",
  "password": "motdepasse123",
  "password2": "motdepasse123", 
  "first_name": "Prénom",
  "last_name": "Nom"
}
```

**Réponse attendue** (201 Created):
```json
{
  "username": "utilisateur",
  "email": "utilisateur@exemple.com",
  "first_name": "Prénom",
  "last_name": "Nom"
}
```

### Alternative d'inscription (sans authentification)

**Endpoint**: `POST /api/users/public/register/`

**Données d'entrée**:
```json
{
  "username": "utilisateur",
  "email": "utilisateur@exemple.com",
  "password": "motdepasse123"
}
```

**Réponse attendue** (201 Created):
```json
{
  "id": 1,
  "username": "utilisateur",
  "email": "utilisateur@exemple.com",
  "first_name": "",
  "last_name": "",
  "token": "votre_token_d_authentification"
}
```

### Connexion

Django REST framework utilise l'authentification par token.

**Endpoint**: `POST /api/users/public/token/`

**Données d'entrée**:
```json
{
  "username": "utilisateur",
  "password": "motdepasse123"
}
```

**Réponse attendue**:
```json
{
  "token": "votre_token_d_authentification"
}
```

Pour utiliser ce token, ajoutez-le aux en-têtes de vos requêtes qui nécessitent une authentification:

```
Authorization: Token votre_token_d_authentification
```

## Produits

### Liste des produits

**Endpoint**: `GET /api/products/`

**Réponse**:
```json
[
  {
    "id": 1,
    "nom": "Parfum Exemple",
    "slug": "parfum-exemple",
    "categorie": {
      "id": 1,
      "nom": "Parfums Homme",
      "slug": "parfums-homme",
      "description": "...",
      "image": "/media/categories/homme.jpg",
      "date_creation": "2023-06-01T10:00:00Z"
    },
    "description": "Un parfum élégant pour homme...",
    "prix": "49.99",
    "stock": 10,
    "disponible": true,
    "image_principale": "/media/produits/parfum1.jpg",
    "images": [],
    "marque": "Marque Exemple",
    "volume": "100ml",
    "date_creation": "2023-06-01T10:00:00Z"
  }
]
```

### Détail d'un produit

**Endpoint**: `GET /api/products/{slug}/`

**Réponse**:
```json
{
  "id": 1,
  "nom": "Parfum Exemple",
  "slug": "parfum-exemple",
  "categorie": {
    "id": 1,
    "nom": "Parfums Homme",
    "slug": "parfums-homme",
    "description": "...",
    "image": "/media/categories/homme.jpg",
    "date_creation": "2023-06-01T10:00:00Z"
  },
  "description": "Un parfum élégant pour homme avec des notes boisées...",
  "prix": "49.99",
  "stock": 10,
  "disponible": true,
  "image_principale": "/media/produits/parfum1.jpg",
  "images": [
    {
      "id": 1,
      "image": "/media/produits/parfum1_1.jpg"
    },
    {
      "id": 2,
      "image": "/media/produits/parfum1_2.jpg"
    }
  ],
  "marque": "Marque Exemple",
  "volume": "100ml",
  "date_creation": "2023-06-01T10:00:00Z",
  "date_modification": "2023-06-01T10:00:00Z"
}
```

### Liste des catégories

**Endpoint**: `GET /api/products/categories/`

**Réponse**:
```json
[
  {
    "id": 1,
    "nom": "Parfums Homme",
    "slug": "parfums-homme",
    "description": "Collection de parfums pour homme",
    "image": "/media/categories/homme.jpg",
    "date_creation": "2023-06-01T10:00:00Z"
  },
  {
    "id": 2,
    "nom": "Parfums Femme",
    "slug": "parfums-femme",
    "description": "Collection de parfums pour femme",
    "image": "/media/categories/femme.jpg",
    "date_creation": "2023-06-01T10:00:00Z"
  }
]
```

### Produits par catégorie

**Endpoint**: `GET /api/products/categories/{slug}/produits/`

**Réponse**: Identique à la liste des produits

## Panier

Le panier est disponible à la fois pour les utilisateurs authentifiés et pour les visiteurs anonymes. Pour les visiteurs anonymes, le panier est identifié par un ID de session stocké dans les cookies.

### Voir le panier

**Endpoint**: `GET /api/orders/panier/`

**Réponse**:
```json
{
  "id": 1,
  "client": 1,
  "articles": [
    {
      "id": 1,
      "produit": {
        "id": 1,
        "nom": "Parfum Exemple",
        "slug": "parfum-exemple",
        "categorie": {
          "id": 1,
          "nom": "Parfums Homme",
          "slug": "parfums-homme",
          "description": "...",
          "image": "/media/categories/homme.jpg",
          "date_creation": "2023-06-01T10:00:00Z"
        },
        "description": "...",
        "prix": "49.99",
        "stock": 10,
        "disponible": true,
        "image_principale": "/media/produits/parfum1.jpg",
        "images": [],
        "marque": "Marque Exemple",
        "volume": "100ml",
        "date_creation": "2023-06-01T10:00:00Z"
      },
      "quantite": 2,
      "montant_total": "99.98",
      "date_ajout": "2023-06-01T10:00:00Z"
    }
  ],
  "montant_total": "99.98",
  "nombre_articles": 2,
  "date_creation": "2023-06-01T10:00:00Z"
}
```

### Ajouter au panier

**Endpoint**: `POST /api/orders/panier/ajouter_produit/`

**Données d'entrée**:
```json
{
  "produit_id": 1,
  "quantite": 2
}
```

**Réponse**: Même format que "Voir le panier"

### Modifier la quantité

**Endpoint**: `POST /api/orders/panier/modifier_quantite/`

**Données d'entrée**:
```json
{
  "article_id": 1,
  "quantite": 3
}
```

**Réponse**: Même format que "Voir le panier"

### Supprimer un article

**Endpoint**: `POST /api/orders/panier/supprimer_article/`

**Données d'entrée**:
```json
{
  "article_id": 1
}
```

**Réponse**: Même format que "Voir le panier"

### Vider le panier

**Endpoint**: `POST /api/orders/panier/vider/`

**Réponse**: Même format que "Voir le panier" (avec liste d'articles vide)

## Commandes

### Créer une commande

**Endpoint**: `POST /api/orders/panier/convertir_en_commande/`

Cette fonctionnalité est disponible pour les utilisateurs authentifiés et les invités. Les invités doivent fournir toutes les informations de contact.

**Données d'entrée**:
```json
{
  "nom_complet": "Jean Dupont",
  "email": "jean.dupont@exemple.com",
  "telephone": "123456789",
  "adresse": "123 Rue Exemple",
  "ville": "Ville Exemple",
  "notes": "Livraison en après-midi de préférence"
}
```

**Réponse** (201 Created):
```json
{
  "id_commande": 1
}
```

### Liste des commandes

**Endpoint**: `GET /api/orders/commandes/`

Cette fonctionnalité est réservée aux utilisateurs authentifiés. Les utilisateurs normaux ne voient que leurs propres commandes, tandis que les administrateurs voient toutes les commandes.

**Réponse**:
```json
[
  {
    "id": 1,
    "client": 1,
    "nom_complet": "Jean Dupont",
    "email": "jean.dupont@exemple.com",
    "telephone": "123456789",
    "adresse": "123 Rue Exemple",
    "ville": "Ville Exemple",
    "statut": "en_attente",
    "notes": "Livraison en après-midi de préférence",
    "montant_total": "99.98",
    "details": [
      {
        "id": 1,
        "produit": {
          "id": 1,
          "nom": "Parfum Exemple",
          "slug": "parfum-exemple",
          "categorie": {
            "id": 1,
            "nom": "Parfums Homme",
            "slug": "parfums-homme",
            "description": "...",
            "image": "/media/categories/homme.jpg",
            "date_creation": "2023-06-01T10:00:00Z"
          },
          "description": "...",
          "prix": "49.99",
          "stock": 10,
          "disponible": true,
          "image_principale": "/media/produits/parfum1.jpg",
          "images": [],
          "marque": "Marque Exemple",
          "volume": "100ml",
          "date_creation": "2023-06-01T10:00:00Z"
        },
        "prix": "49.99",
        "quantite": 2,
        "montant_total": "99.98"
      }
    ],
    "date_creation": "2023-06-01T10:00:00Z"
  }
]
```

### Détail d'une commande

**Endpoint**: `GET /api/orders/commandes/{id}/`

**Réponse**: Même format que pour un élément de la liste des commandes

### Confirmer une commande (Admin uniquement)

**Endpoint**: `POST /api/orders/commandes/{id}/confirm/`

**Réponse**: Détails de la commande mise à jour avec le statut 'confirmee'

## Statistiques (Admin uniquement)

### Statistiques des commandes

**Endpoint**: `GET /api/orders/stats/orders/`

**Réponse**:
```json
{
  "total_orders": 120,
  "pending_orders": 15,
  "confirmed_orders": 85,
  "status_distribution": [
    {"statut": "en_attente", "count": 15},
    {"statut": "confirmee", "count": 85},
    {"statut": "expediee", "count": 10},
    {"statut": "livree", "count": 8},
    {"statut": "annulee", "count": 2}
  ],
  "recent_orders": 45
}
```

### Statistiques des ventes

**Endpoint**: `GET /api/orders/stats/sales/`

**Réponse**:
```json
{
  "total_sales": {"total": "5980.50"},
  "recent_sales": {"total": "2450.75"},
  "average_order_value": {"avg": "49.83"},
  "top_products": [
    {"produit__id": 1, "produit__nom": "Parfum Exemple", "total_quantity": 42, "total_sales": "2097.58"},
    {"produit__id": 2, "produit__nom": "Parfum Premium", "total_quantity": 28, "total_sales": "1957.72"},
    {"produit__id": 3, "produit__nom": "Parfum Classique", "total_quantity": 15, "total_sales": "599.85"}
  ]
}
```

### Statistiques des utilisateurs

**Endpoint**: `GET /api/orders/stats/users/`

**Réponse**:
```json
{
  "total_customers": 95,
  "repeat_customers": 25,
  "new_customers": 18,
  "top_customers": [
    {"client__username": "jean.dupont", "nom_complet": "Jean Dupont", "email": "jean.dupont@exemple.com", "order_count": 5, "total_spent": "489.95"},
    {"client__username": "marie.martin", "nom_complet": "Marie Martin", "email": "marie.martin@exemple.com", "order_count": 3, "total_spent": "278.97"}
  ]
}
```

## Profil utilisateur

### Voir le profil

**Endpoint**: `GET /api/users/me/`

**Réponse**:
```json
{
  "id": 1,
  "username": "utilisateur",
  "email": "utilisateur@exemple.com",
  "first_name": "Prénom",
  "last_name": "Nom",
  "profil": {
    "telephone": "123456789",
    "adresse": "123 Rue Exemple",
    "ville": "Ville Exemple",
    "photo": null
  }
}
```

### Mettre à jour le profil

**Endpoint**: `PUT /api/users/me/`

**Données d'entrée**:
```json
{
  "email": "utilisateur@exemple.com",
  "first_name": "Prénom Modifié",
  "last_name": "Nom Modifié",
  "profil": {
    "telephone": "987654321",
    "adresse": "456 Nouvelle Rue",
    "ville": "Nouvelle Ville"
  }
}
```

**Réponse**: Même format que "Voir le profil" 