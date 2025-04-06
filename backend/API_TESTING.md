# Guide de test des API NK Commerce

Ce document explique comment utiliser le script de test API (`test_api.sh`) pour vérifier que toutes les fonctionnalités principales de l'API backend fonctionnent correctement.

## Prérequis

- Un serveur Django exécutant l'API NK Commerce
- cURL installé sur la machine
- Bash ou un shell compatible

## Exécution des tests

1. Assurez-vous que le serveur Django est en cours d'exécution sur `http://localhost:8000`
2. Rendez le script exécutable (si ce n'est pas déjà fait) :
   ```bash
   chmod +x test_api.sh
   ```
3. Exécutez le script :
   ```bash
   ./test_api.sh
   ```

## Ce que le script teste

Le script teste l'intégralité du flux utilisateur dans l'application e-commerce :

1. **Inscription et authentification**
   - Création d'un compte utilisateur
   - Connexion
   - Récupération du profil utilisateur

2. **Catégories et produits**
   - Listage des catégories
   - Création d'une catégorie (nécessite des droits admin)
   - Listage des produits
   - Visualisation des détails d'un produit

3. **Panier d'achat**
   - Visualisation du panier
   - Ajout d'un produit au panier
   - Modification de la quantité d'un article
   - Vérification du panier mis à jour

4. **Commandes**
   - Création d'une commande à partir du panier
   - Listage des commandes
   - Visualisation des détails d'une commande

5. **Nettoyage**
   - Vidage du panier

## Format des réponses API

Voici les formats de réponses attendus pour chaque type d'API :

### Inscription utilisateur
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "first_name": "Test",
  "last_name": "User"
}
```

### Profil utilisateur
```json
{
  "id": 1,
  "username": "testuser",
  "email": "testuser@example.com",
  "first_name": "Test",
  "last_name": "User",
  "profil": {
    "telephone": "",
    "adresse": "",
    "ville": "",
    "photo": null
  }
}
```

### Liste des produits
```json
[
  {
    "id": 1,
    "nom": "Parfum Test",
    "slug": "parfum-test",
    "categorie": {
      "id": 1,
      "nom": "Parfums Homme",
      "slug": "parfums-homme",
      "description": "Parfums pour homme",
      "image": "/media/categories/homme.jpg",
      "date_creation": "2023-06-01T10:00:00Z"
    },
    "description": "Description du parfum test",
    "prix": "49.99",
    "stock": 10,
    "disponible": true,
    "image_principale": "/media/produits/parfum1.jpg",
    "images": [],
    "marque": "Test Brand",
    "volume": "100ml",
    "date_creation": "2023-06-01T10:00:00Z"
  }
]
```

### Panier
```json
{
  "id": 1,
  "client": 1,
  "articles": [
    {
      "id": 1,
      "produit": {
        "id": 1,
        "nom": "Parfum Test",
        "slug": "parfum-test",
        "categorie": {
          "id": 1,
          "nom": "Parfums Homme",
          "slug": "parfums-homme",
          "description": "Parfums pour homme",
          "image": "/media/categories/homme.jpg",
          "date_creation": "2023-06-01T10:00:00Z"
        },
        "description": "Description du parfum test",
        "prix": "49.99",
        "stock": 10,
        "disponible": true,
        "image_principale": "/media/produits/parfum1.jpg",
        "images": [],
        "marque": "Test Brand",
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

### Commande
```json
{
  "id": 1,
  "client": 1,
  "nom_complet": "Test User",
  "email": "testuser@example.com",
  "telephone": "123456789",
  "adresse": "123 Test Street",
  "ville": "Test City",
  "statut": "en_attente",
  "notes": "Commande de test",
  "montant_total": "99.98",
  "details": [
    {
      "id": 1,
      "produit": {
        "id": 1,
        "nom": "Parfum Test",
        "slug": "parfum-test",
        "categorie": {
          "id": 1,
          "nom": "Parfums Homme",
          "slug": "parfums-homme",
          "description": "Parfums pour homme",
          "image": "/media/categories/homme.jpg",
          "date_creation": "2023-06-01T10:00:00Z"
        },
        "description": "Description du parfum test",
        "prix": "49.99",
        "stock": 10,
        "disponible": true,
        "image_principale": "/media/produits/parfum1.jpg",
        "images": [],
        "marque": "Test Brand",
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
```

## Interprétation des résultats

À la fin de l'exécution, le script affiche un résumé :
- Nombre total de tests exécutés
- Nombre de tests réussis (en vert)
- Nombre de tests échoués (en rouge)

Les résultats détaillés sont enregistrés dans le fichier `api_test_output.txt`.

### Résolution des problèmes

Si des tests échouent, voici quelques mesures à prendre :

1. Vérifiez que le serveur Django est en cours d'exécution sur le port 8000
2. Assurez-vous qu'il y a des données de test dans la base de données (catégories, produits)
3. Vérifiez les détails de l'erreur dans le fichier `api_test_output.txt`
4. Assurez-vous que les autorisations sont correctement configurées (certaines API nécessitent une authentification)

## Personnalisation des tests

Vous pouvez personnaliser le script en modifiant les variables au début du fichier :
- `BASE_URL`: l'URL de base de votre API
- `TEST_USER`, `TEST_PASSWORD`, `TEST_EMAIL`: les informations d'identification pour les tests

Vous pouvez également ajouter des tests supplémentaires en ajoutant des appels à la fonction `run_test` dans le script. 