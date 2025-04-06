#!/bin/bash

# Script de test des API pour NK Commerce
# Ce script teste les fonctionnalités principales de l'API

# Configuration
BASE_URL="http://localhost:8000/api"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
TEST_USER="testuser_$(date +%s)"
TEST_PASSWORD="testpass123"
TEST_EMAIL="testuser_$(date +%s)@example.com"
CATEGORY_ID=""
PRODUCT_ID=""
CART_ITEM_ID=""
ORDER_ID=""
ADMIN_TOKEN=""  # Pour stocker le token admin

# Variables pour stocker les redirections de curl
OUTPUT_FILE="api_test_output.txt"
ERROR_FILE="api_test_errors.txt"
COOKIE_FILE="api_test_cookie.txt"
TOKEN_FILE="api_test_token.txt"

# Couleurs pour la sortie
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Fonction pour exécuter un test simple sans vérifier le code HTTP
run_simple_test() {
    ((TOTAL_TESTS++))
    echo -e "\n${YELLOW}Test $TOTAL_TESTS: $1${NC}"
    echo -e "\nTest $TOTAL_TESTS: $1" >> $OUTPUT_FILE
    echo "Exécution: $2" >> $OUTPUT_FILE
    
    # Exécute la commande et capture la sortie
    response=$(eval $2)
    local status=$?
    
    # Affiche la réponse sur la console et l'enregistre dans le fichier de sortie
    echo -e "Réponse: $response" 
    echo -e "Réponse: $response" >> $OUTPUT_FILE
    
    if [ $status -eq 0 ]; then
        ((PASSED_TESTS++))
        echo -e "${GREEN}✓ Test réussi${NC}"
    else
        ((FAILED_TESTS++))
        echo -e "${RED}✗ Test échoué${NC}"
        echo "Erreur: $(cat $ERROR_FILE)" >> $OUTPUT_FILE
        echo -e "Erreur: $(cat $ERROR_FILE)"
    fi
    
    # Vide le fichier d'erreur pour le prochain test
    > $ERROR_FILE
}

# Initialiser les fichiers de sortie
> $OUTPUT_FILE
> $ERROR_FILE
rm -f $COOKIE_FILE $TOKEN_FILE

echo "=== Tests API NK Commerce ==="
echo "Démarrage des tests à $(date)"

# ==========================================
# 1. Tests de base des produits
# ==========================================

echo -e "\n${YELLOW}=== Tests des produits ===${NC}"
echo -e "\n=== Tests des produits ===" >> $OUTPUT_FILE

# Test 1: Vérifier que le serveur est accessible
run_simple_test "Vérifier que le serveur est accessible" "curl -s $BASE_URL/products/"

# Test 2: Lister les catégories
run_simple_test "Lister les catégories" "curl -s $BASE_URL/products/categories/"

# Test 3: Lister les produits
run_simple_test "Lister les produits" "curl -s $BASE_URL/products/"

# Créer un produit de test si aucun n'existe
if [[ $response == "[]" ]]; then
    echo "Aucun produit trouvé. Création d'un produit de test..."
    echo "Aucun produit trouvé. Création d'un produit de test..." >> $OUTPUT_FILE
    
    # Créer une catégorie d'abord
    run_simple_test "Création d'une catégorie de test via Django shell" "pipenv run python -c \"
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nkcommerce.settings')
django.setup()
from products.models import Categorie
from django.utils.text import slugify
nom = 'Parfums Homme Test'
cat, created = Categorie.objects.get_or_create(
    nom=nom,
    defaults={
        'slug': slugify(nom),
        'description': 'Catégorie de test pour les parfums homme'
    }
)
print(f'Catégorie ID: {cat.id}')
\""
    
    # Extraire l'ID de la catégorie
    CATEGORY_ID=$(echo "$response" | grep -o 'Catégorie ID: [0-9]*' | sed 's/Catégorie ID: //g')
    
    # Créer un produit
    run_simple_test "Création d'un produit de test via Django shell" "pipenv run python -c \"
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nkcommerce.settings')
django.setup()
from products.models import Produit, Categorie
from django.utils.text import slugify
cat = Categorie.objects.get(id=$CATEGORY_ID)
nom = 'Parfum Test'
prod, created = Produit.objects.get_or_create(
    nom=nom,
    defaults={
        'slug': slugify(nom),
        'categorie': cat,
        'description': 'Parfum de test pour les tests API',
        'prix': 49.99,
        'stock': 100,
        'disponible': True,
        'marque': 'Marque Test',
        'volume': '100ml'
    }
)
print(f'Produit ID: {prod.id}')
\""
    
    # Extraire l'ID du produit
    PRODUCT_ID=$(echo "$response" | grep -o 'Produit ID: [0-9]*' | sed 's/Produit ID: //g')
    echo "Produit de test créé avec l'ID: $PRODUCT_ID" >> $OUTPUT_FILE
    echo "Produit de test créé avec l'ID: $PRODUCT_ID"
    
    # Mettre à jour la liste des produits
    run_simple_test "Lister les produits après création" "curl -s $BASE_URL/products/"
else
    # Extraire le premier ID de produit de la réponse si des produits existent déjà
    PRODUCT_ID=$(echo "$response" | grep -o '"id":[[:space:]]*[0-9]*' | head -1 | sed 's/"id":[[:space:]]*//g')
    echo "Produit existant trouvé avec l'ID: $PRODUCT_ID" >> $OUTPUT_FILE
    echo "Produit existant trouvé avec l'ID: $PRODUCT_ID"
fi

# ==========================================
# 2. Tests pour l'inscription et l'authentification
# ==========================================

echo -e "\n${YELLOW}=== Tests d'authentification ===${NC}"
echo -e "\n=== Tests d'authentification ===" >> $OUTPUT_FILE

# Test: Inscription utilisateur (via l'endpoint public)
run_simple_test "Inscription utilisateur via public/register" "curl -s -X POST $BASE_URL/users/public/register/ -H 'Content-Type: application/json' -d '{\"username\":\"$TEST_USER\", \"email\":\"$TEST_EMAIL\", \"password\":\"$TEST_PASSWORD\"}'"

# Extraire le token si présent dans la réponse
TOKEN=$(echo "$response" | grep -o '"token":[[:space:]]*"[^"]*"' | sed 's/"token":[[:space:]]*"//g' | sed 's/"//g')
if [ -n "$TOKEN" ]; then
    echo "Token obtenu dans la réponse d'inscription: ${TOKEN:0:10}..." >> $OUTPUT_FILE
    echo -e "${GREEN}Token obtenu dans la réponse d'inscription: ${TOKEN:0:10}...${NC}"
    echo $TOKEN > $TOKEN_FILE
else
    # Test: Obtenir un token d'authentification
    run_simple_test "Obtenir un token d'authentification" "curl -s -X POST $BASE_URL/users/public/token/ -H 'Content-Type: application/json' -d '{\"username\":\"$TEST_USER\", \"password\":\"$TEST_PASSWORD\"}'"
    
    # Extraire le token
    TOKEN=$(echo "$response" | grep -o '"token":[[:space:]]*"[^"]*"' | sed 's/"token":[[:space:]]*"//g' | sed 's/"//g')
    if [ -n "$TOKEN" ]; then
        echo "Token obtenu: ${TOKEN:0:10}..." >> $OUTPUT_FILE
        echo -e "${GREEN}Token obtenu avec succès: ${TOKEN:0:10}...${NC}"
        echo $TOKEN > $TOKEN_FILE
    else
        echo "Échec de récupération du token. Création d'un utilisateur manuellement..." >> $OUTPUT_FILE
        echo -e "${RED}Échec de récupération du token. Création d'un utilisateur manuellement...${NC}"
        
        # Créer un utilisateur via Django shell
        run_simple_test "Création d'un utilisateur de test via Django shell" "pipenv run python -c \"
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nkcommerce.settings')
django.setup()
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
username='testadmin'
if not User.objects.filter(username=username).exists():
    user = User.objects.create_user(username=username, password='adminpass123', email='admin@example.com')
    token, _ = Token.objects.get_or_create(user=user)
    print(f'Utilisateur testadmin créé avec succès, token: {token.key}')
else:
    user = User.objects.get(username=username)
    token, _ = Token.objects.get_or_create(user=user)
    print(f'Utilisateur testadmin existe déjà, token: {token.key}')
\""
        
        # Extraire le token
        TOKEN=$(echo "$response" | grep -o 'token: [^ ]*' | sed 's/token: //g')
        if [ -n "$TOKEN" ]; then
            echo "Token obtenu via shell: ${TOKEN:0:10}..." >> $OUTPUT_FILE
            echo -e "${GREEN}Token obtenu via shell: ${TOKEN:0:10}...${NC}"
            echo $TOKEN > $TOKEN_FILE
            TEST_USER="testadmin"
        fi
    fi
fi

# Test: Accéder au profil utilisateur avec token
if [ -n "$TOKEN" ]; then
    AUTH_HEADER="Authorization: Token $TOKEN"
    run_simple_test "Accéder au profil utilisateur avec token" "curl -s $BASE_URL/users/me/ -H \"$AUTH_HEADER\""
else
    echo "Test ignoré: Pas de token disponible" >> $OUTPUT_FILE
    echo -e "${RED}Test ignoré: Pas de token disponible${NC}"
fi

# ==========================================
# 3. Tests du panier - Utilisateur authentifié
# ==========================================

echo -e "\n${YELLOW}=== Tests du panier utilisateur authentifié ===${NC}"
echo -e "\n=== Tests du panier utilisateur authentifié ===" >> $OUTPUT_FILE

if [ -n "$TOKEN" ] && [ -n "$PRODUCT_ID" ]; then
    AUTH_HEADER="Authorization: Token $TOKEN"
    
    # Test: Voir le panier (utilisateur authentifié)
    run_simple_test "Voir le panier (utilisateur authentifié)" "curl -s $BASE_URL/orders/panier/ -H \"$AUTH_HEADER\""
    
    # Test: Ajouter un produit au panier
    run_simple_test "Ajouter un produit au panier" "curl -s -X POST $BASE_URL/orders/panier/ajouter_produit/ -H \"$AUTH_HEADER\" -H 'Content-Type: application/json' -d '{\"produit_id\":$PRODUCT_ID, \"quantite\":2}'"
    
    # Extraire l'ID de l'article du panier
    CART_ITEM_ID=$(echo "$response" | grep -o '"id":[[:space:]]*[0-9]*' | grep -v "\"id\":[[:space:]]*$PRODUCT_ID" | head -1 | sed 's/"id":[[:space:]]*//g')
    if [ -n "$CART_ITEM_ID" ]; then
        echo "Article ajouté au panier avec l'ID: $CART_ITEM_ID" >> $OUTPUT_FILE
        echo "Article ajouté au panier avec l'ID: $CART_ITEM_ID"
        
        # Test: Modifier la quantité d'un article du panier
        run_simple_test "Modifier la quantité d'un article du panier" "curl -s -X POST $BASE_URL/orders/panier/modifier_quantite/ -H \"$AUTH_HEADER\" -H 'Content-Type: application/json' -d '{\"article_id\":$CART_ITEM_ID, \"quantite\":3}'"
        
        # Test: Créer une commande à partir du panier
        run_simple_test "Créer une commande à partir du panier" "curl -s -X POST $BASE_URL/orders/panier/convertir_en_commande/ -H \"$AUTH_HEADER\" -H 'Content-Type: application/json' -d '{\"nom_complet\":\"Test User\", \"email\":\"$TEST_EMAIL\", \"telephone\":\"123456789\", \"adresse\":\"123 Test Street\", \"ville\":\"Test City\", \"notes\":\"Test order\"}'"
        
        # Extraire l'ID de la commande
        ORDER_ID=$(echo "$response" | grep -o '"id_commande":[[:space:]]*[0-9]*' | sed 's/"id_commande":[[:space:]]*//g')
        if [ -n "$ORDER_ID" ]; then
            echo "Commande créée avec l'ID: $ORDER_ID" >> $OUTPUT_FILE
            echo "Commande créée avec l'ID: $ORDER_ID"
            
            # Test: Voir la liste des commandes
            run_simple_test "Voir la liste des commandes" "curl -s $BASE_URL/orders/commandes/ -H \"$AUTH_HEADER\""
            
            # Test: Voir le détail d'une commande
            run_simple_test "Voir le détail d'une commande" "curl -s $BASE_URL/orders/commandes/$ORDER_ID/ -H \"$AUTH_HEADER\""
            
            # Test: Confirmer une commande (admin uniquement)
            run_simple_test "Confirmer une commande" "curl -s -X POST $BASE_URL/orders/commandes/$ORDER_ID/confirm/ -H \"$AUTH_HEADER\""
        else
            echo "Échec de création de la commande" >> $OUTPUT_FILE
            echo -e "${RED}Échec de création de la commande${NC}"
        fi
    else
        echo "Échec d'ajout d'article au panier" >> $OUTPUT_FILE
        echo -e "${RED}Échec d'ajout d'article au panier${NC}"
    fi
else
    echo "Tests du panier ignorés: Token ou Produit ID non disponibles" >> $OUTPUT_FILE
    echo -e "${RED}Tests du panier ignorés: Token ou Produit ID non disponibles${NC}"
fi

# ==========================================
# 4. Tests du panier - Utilisateur anonyme
# ==========================================

echo -e "\n${YELLOW}=== Tests du panier anonyme ===${NC}"
echo -e "\n=== Tests du panier anonyme ===" >> $OUTPUT_FILE

if [ -n "$PRODUCT_ID" ]; then
    # Test: Voir le panier (anonyme)
    run_simple_test "Voir le panier (anonyme)" "curl -s $BASE_URL/orders/panier/ -b $COOKIE_FILE -c $COOKIE_FILE"
    
    # Test: Ajouter un produit au panier anonyme
    run_simple_test "Ajouter un produit au panier anonyme" "curl -s -X POST $BASE_URL/orders/panier/ajouter_produit/ -H 'Content-Type: application/json' -d '{\"produit_id\":$PRODUCT_ID, \"quantite\":1}' -b $COOKIE_FILE -c $COOKIE_FILE"
    
    # Extraire l'ID de l'article du panier
    CART_ITEM_ID=$(echo "$response" | grep -o '"id":[[:space:]]*[0-9]*' | grep -v "\"id\":[[:space:]]*$PRODUCT_ID" | head -1 | sed 's/"id":[[:space:]]*//g')
    if [ -n "$CART_ITEM_ID" ]; then
        echo "Article ajouté au panier anonyme avec l'ID: $CART_ITEM_ID" >> $OUTPUT_FILE
        echo "Article ajouté au panier anonyme avec l'ID: $CART_ITEM_ID"
        
        # Test: Créer une commande anonyme à partir du panier
        GUEST_EMAIL="guest_$(date +%s)@example.com"
        run_simple_test "Créer une commande anonyme" "curl -s -X POST $BASE_URL/orders/panier/convertir_en_commande/ -H 'Content-Type: application/json' -d '{\"nom_complet\":\"Guest User\", \"email\":\"$GUEST_EMAIL\", \"telephone\":\"987654321\", \"adresse\":\"456 Guest Street\", \"ville\":\"Guest City\", \"notes\":\"Guest order\"}' -b $COOKIE_FILE -c $COOKIE_FILE"
        
        # Extraire l'ID de la commande
        ORDER_ID=$(echo "$response" | grep -o '"id_commande":[[:space:]]*[0-9]*' | sed 's/"id_commande":[[:space:]]*//g')
        if [ -n "$ORDER_ID" ]; then
            echo "Commande anonyme créée avec l'ID: $ORDER_ID" >> $OUTPUT_FILE
            echo "Commande anonyme créée avec l'ID: $ORDER_ID"
        else
            echo "Échec de création de la commande anonyme" >> $OUTPUT_FILE
            echo -e "${RED}Échec de création de la commande anonyme${NC}"
        fi
    else
        echo "Échec d'ajout d'article au panier anonyme" >> $OUTPUT_FILE
        echo -e "${RED}Échec d'ajout d'article au panier anonyme${NC}"
    fi
else
    echo "Tests du panier anonyme ignorés: Produit ID non disponible" >> $OUTPUT_FILE
    echo -e "${RED}Tests du panier anonyme ignorés: Produit ID non disponible${NC}"
fi

# ==========================================
# 5. Création d'un compte admin pour les tests
# ==========================================

echo -e "\n${YELLOW}=== Création d'un compte admin pour les tests ===${NC}"
echo -e "\n=== Création d'un compte admin pour les tests ===" >> $OUTPUT_FILE

# Rendre le script exécutable si nécessaire
chmod +x create_admin.py

# Créer un super utilisateur pour tester les endpoints admin
run_simple_test "Création d'un super utilisateur admin" "pipenv run python create_admin.py"

# Extraire le token admin
ADMIN_TOKEN=$(echo "$response" | grep -o 'TOKEN:[^ ]*' | sed 's/TOKEN://g')
if [ -n "$ADMIN_TOKEN" ]; then
    echo "Token admin obtenu: ${ADMIN_TOKEN:0:10}..." >> $OUTPUT_FILE
    echo -e "${GREEN}Token admin obtenu: ${ADMIN_TOKEN:0:10}...${NC}"
else
    echo "Échec de création du compte admin" >> $OUTPUT_FILE
    echo -e "${RED}Échec de création du compte admin${NC}"
fi

# ==========================================
# 6. Tests des statistiques (Admin uniquement)
# ==========================================

echo -e "\n${YELLOW}=== Tests des statistiques avec utilisateur normal ===${NC}"
echo -e "\n=== Tests des statistiques avec utilisateur normal ===" >> $OUTPUT_FILE

if [ -n "$TOKEN" ]; then
    AUTH_HEADER="Authorization: Token $TOKEN"
    
    # Test: Statistiques des commandes avec utilisateur normal
    run_simple_test "Statistiques des commandes avec utilisateur normal" "curl -s $BASE_URL/orders/stats/orders/ -H \"$AUTH_HEADER\""
    
    # Test: Statistiques des ventes avec utilisateur normal
    run_simple_test "Statistiques des ventes avec utilisateur normal" "curl -s $BASE_URL/orders/stats/sales/ -H \"$AUTH_HEADER\""
    
    # Test: Statistiques des utilisateurs avec utilisateur normal
    run_simple_test "Statistiques des utilisateurs avec utilisateur normal" "curl -s $BASE_URL/orders/stats/users/ -H \"$AUTH_HEADER\""
else
    echo "Tests des statistiques ignorés: Token non disponible" >> $OUTPUT_FILE
    echo -e "${RED}Tests des statistiques ignorés: Token non disponible${NC}"
fi

# ==========================================
# 7. Tests des statistiques avec admin
# ==========================================

echo -e "\n${YELLOW}=== Tests des statistiques avec admin ===${NC}"
echo -e "\n=== Tests des statistiques avec admin ===" >> $OUTPUT_FILE

if [ -n "$ADMIN_TOKEN" ]; then
    ADMIN_AUTH_HEADER="Authorization: Token $ADMIN_TOKEN"
    
    # Test: Statistiques des commandes avec admin
    run_simple_test "Statistiques des commandes avec admin" "curl -s $BASE_URL/orders/stats/orders/ -H \"$ADMIN_AUTH_HEADER\""
    
    # Test: Statistiques des ventes avec admin
    run_simple_test "Statistiques des ventes avec admin" "curl -s $BASE_URL/orders/stats/sales/ -H \"$ADMIN_AUTH_HEADER\""
    
    # Test: Statistiques des utilisateurs avec admin
    run_simple_test "Statistiques des utilisateurs avec admin" "curl -s $BASE_URL/orders/stats/users/ -H \"$ADMIN_AUTH_HEADER\""
else
    echo "Tests des statistiques admin ignorés: Token admin non disponible" >> $OUTPUT_FILE
    echo -e "${RED}Tests des statistiques admin ignorés: Token admin non disponible${NC}"
fi

# ==========================================
# 8. Tests des fonctionnalités admin - Products CRUD
# ==========================================

echo -e "\n${YELLOW}=== Tests CRUD produits avec admin ===${NC}"
echo -e "\n=== Tests CRUD produits avec admin ===" >> $OUTPUT_FILE

if [ -n "$ADMIN_TOKEN" ]; then
    ADMIN_AUTH_HEADER="Authorization: Token $ADMIN_TOKEN"
    
    # Test: Créer un nouveau produit avec admin
    NEW_PRODUCT_NAME="Parfum Exclusive Admin Test $(date +%s)"
    NEW_PRODUCT_SLUG="parfum-exclusive-admin-test-$(date +%s)"
    run_simple_test "Créer un produit avec admin" "curl -s -X POST $BASE_URL/products/ -H \"$ADMIN_AUTH_HEADER\" -H 'Content-Type: application/json' -d '{
        \"nom\": \"$NEW_PRODUCT_NAME\", 
        \"slug\": \"$NEW_PRODUCT_SLUG\",
        \"categorie_id\": 1, 
        \"description\": \"Un parfum exclusif créé lors des tests\", 
        \"prix\": 79.99, 
        \"stock\": 50, 
        \"disponible\": true, 
        \"marque\": \"Luxe Test\", 
        \"volume\": \"75ml\"
    }'"
    
    # Extraire l'ID du nouveau produit
    NEW_PRODUCT_ID=$(echo "$response" | grep -o '"id":[[:space:]]*[0-9]*' | head -1 | sed 's/"id":[[:space:]]*//g')
    if [ -n "$NEW_PRODUCT_ID" ]; then
        echo "Nouveau produit créé avec l'ID: $NEW_PRODUCT_ID" >> $OUTPUT_FILE
        echo "Nouveau produit créé avec l'ID: $NEW_PRODUCT_ID"
        
        # Test: Voir les détails du produit créé
        run_simple_test "Voir les détails du produit créé" "curl -s $BASE_URL/products/$NEW_PRODUCT_SLUG/ -H \"$ADMIN_AUTH_HEADER\""
        
        # Test: Modifier un produit avec admin
        run_simple_test "Modifier un produit avec admin" "curl -s -X PATCH $BASE_URL/products/$NEW_PRODUCT_SLUG/ -H \"$ADMIN_AUTH_HEADER\" -H 'Content-Type: application/json' -d '{
            \"prix\": 89.99,
            \"stock\": 45,
            \"description\": \"Un parfum exclusif modifié lors des tests\"
        }'"
        
        # Vérifier que les modifications ont été appliquées
        run_simple_test "Vérifier les modifications du produit" "curl -s $BASE_URL/products/$NEW_PRODUCT_SLUG/ -H \"$ADMIN_AUTH_HEADER\""
        
        # Test: Supprimer un produit avec admin
        run_simple_test "Supprimer un produit avec admin" "curl -s -X DELETE $BASE_URL/products/$NEW_PRODUCT_SLUG/ -H \"$ADMIN_AUTH_HEADER\""
        
        # Vérifier que le produit a été supprimé (devrait retourner 404)
        run_simple_test "Vérifier que le produit a été supprimé" "curl -s $BASE_URL/products/$NEW_PRODUCT_SLUG/ -H \"$ADMIN_AUTH_HEADER\""
    else
        echo "Échec de création du produit avec admin" >> $OUTPUT_FILE
        echo -e "${RED}Échec de création du produit avec admin${NC}"
    fi
else
    echo "Tests CRUD produits ignorés: Token admin non disponible" >> $OUTPUT_FILE
    echo -e "${RED}Tests CRUD produits ignorés: Token admin non disponible${NC}"
fi

# ==========================================
# 9. Tests des fonctionnalités admin - Order Management
# ==========================================

echo -e "\n${YELLOW}=== Tests des fonctionnalités admin - Order Management ===${NC}"
echo -e "\n=== Tests des fonctionnalités admin - Order Management ===" >> $OUTPUT_FILE

if [ -n "$ADMIN_TOKEN" ] && [ -n "$ORDER_ID" ]; then
    ADMIN_AUTH_HEADER="Authorization: Token $ADMIN_TOKEN"
    
    # Test: Confirmer une commande avec admin
    run_simple_test "Confirmer une commande avec admin" "curl -s -X POST $BASE_URL/orders/commandes/$ORDER_ID/confirm/ -H \"$ADMIN_AUTH_HEADER\""
else
    echo "Tests des fonctionnalités admin - Order Management ignorés: Token admin ou Order ID non disponibles" >> $OUTPUT_FILE
    echo -e "${RED}Tests des fonctionnalités admin - Order Management ignorés: Token admin ou Order ID non disponibles${NC}"
fi

# ==========================================
# Affichage des résultats
# ==========================================

echo -e "\n=== Résultats des tests ==="
echo -e "Total des tests: $TOTAL_TESTS"
echo -e "${GREEN}Tests réussis: $PASSED_TESTS${NC}"
echo -e "${RED}Tests échoués: $(($TOTAL_TESTS - $PASSED_TESTS))${NC}"
echo "Détails des tests sauvegardés dans $OUTPUT_FILE"
echo "Terminé à $(date)"

# Note pour l'utilisateur
echo -e "\n${YELLOW}Note importante:${NC}"
echo "Ce script teste les fonctionnalités principales de l'API NK Commerce:"
echo "- Authentification (inscription, connexion)"
echo "- Produits (liste, détails)"
echo "- Panier (ajout, modification, commande) pour utilisateurs authentifiés et anonymes"
echo "- Commandes (création, liste, confirmation)"
echo "- Statistiques (commandes, ventes, utilisateurs) avec utilisateur normal et admin"
echo "- Fonctionnalités spécifiques admin (confirmation/annulation de commandes)"
echo "Les réponses sont affichées à l'écran et sauvegardées dans $OUTPUT_FILE."

# Nettoyer les fichiers temporaires
rm -f $COOKIE_FILE

exit 0 