# NK Commerce Backend

Ce répertoire contient le backend de l'application e-commerce NK Commerce, développé avec Django REST Framework.

## Prérequis

- Python 3.12+
- Pipenv

## Installation

1. Cloner le dépôt
2. Naviguer vers le répertoire du backend : `cd backend`
3. Installer les dépendances : `pipenv install`
4. Activer l'environnement virtuel : `pipenv shell`
5. Appliquer les migrations : `python manage.py migrate`
6. Créer un superutilisateur : `python manage.py createsuperuser`

## Démarrage du serveur

```bash
python manage.py runserver
```

L'API sera disponible à l'adresse http://localhost:8000/

## Structure du projet

- `nkcommerce/` - Configuration principale du projet Django
- `products/` - API et modèles pour la gestion des produits
- `orders/` - API et modèles pour la gestion des commandes et paniers
- `users/` - API et modèles pour la gestion des utilisateurs

## Points d'API

### Produits

- `GET /api/products/` - Liste de tous les produits
- `GET /api/products/{slug}/` - Détails d'un produit
- `GET /api/products/categories/` - Liste des catégories
- `GET /api/products/categories/{slug}/` - Détails d'une catégorie
- `GET /api/products/categories/{slug}/produits/` - Produits d'une catégorie
- `GET /api/products/nouveautes/` - Nouveaux produits

### Commandes et Panier

- `GET /api/orders/panier/` - Voir le panier de l'utilisateur
- `POST /api/orders/panier/ajouter_produit/` - Ajouter un produit au panier
- `POST /api/orders/panier/modifier_quantite/` - Modifier la quantité d'un article
- `POST /api/orders/panier/supprimer_article/` - Supprimer un article du panier
- `POST /api/orders/panier/vider/` - Vider le panier
- `POST /api/orders/panier/convertir_en_commande/` - Créer une commande à partir du panier
- `GET /api/orders/commandes/` - Liste des commandes de l'utilisateur
- `GET /api/orders/commandes/{id}/` - Détails d'une commande

### Utilisateurs

- `POST /api/users/register/` - Créer un nouveau compte
- `GET /api/users/info/` - Informations sur l'utilisateur actuel
- `GET /api/users/me/` - Profil de l'utilisateur actuel
- `PUT /api/users/me/` - Mettre à jour le profil

## Administration

L'interface d'administration est disponible à l'adresse http://localhost:8000/admin/

Utilisez les identifiants du superutilisateur pour vous connecter. 