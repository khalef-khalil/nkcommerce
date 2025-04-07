import os
import django
import sys

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nkcommerce.settings')
django.setup()

from products.models import Produit, Categorie
from orders.models import Commande, Panier, ArticlePanier

def delete_all_data():
    print("Starting data deletion...")
    
    # Delete all orders and related data
    print("Deleting orders and cart data...")
    Commande.objects.all().delete()
    Panier.objects.all().delete()
    ArticlePanier.objects.all().delete()
    
    # Delete all products and categories
    print("Deleting products and categories...")
    Produit.objects.all().delete()
    Categorie.objects.all().delete()
    
    print("Data deletion completed successfully!")
    print("Note: User data has been preserved.")

if __name__ == "__main__":
    delete_all_data() 