from django.db import models
from django.contrib.auth.models import User
from products.models import Produit
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify
import uuid

class Commande(models.Model):
    STATUT_CHOICES = (
        ('en_attente', 'En Attente'),
        ('confirmee', 'Confirmée'),
        ('en_traitement', 'En Traitement'),
        ('expediee', 'Expédiée'),
        ('livree', 'Livrée'),
        ('annulee', 'Annulée'),
    )
    
    client = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    nom_complet = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    adresse = models.CharField(max_length=200)
    ville = models.CharField(max_length=100)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    notes = models.TextField(blank=True)
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Commande {self.id} - {self.nom_complet}"


class DetailCommande(models.Model):
    commande = models.ForeignKey(Commande, related_name='details', on_delete=models.CASCADE)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    quantite = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.quantite} x {self.produit.nom}"
    
    @property
    def montant_total(self):
        return self.prix * self.quantite


class Panier(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        if self.client:
            return f"Panier de {self.client.username}"
        return f"Panier invité {self.session_id}"
    
    @property
    def nombre_articles(self):
        return sum(article.quantite for article in self.articles.all())
    
    @property
    def montant_total(self):
        return sum(article.montant_total for article in self.articles.all())


class ArticlePanier(models.Model):
    panier = models.ForeignKey(Panier, related_name='articles', on_delete=models.CASCADE)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField(default=1)
    date_ajout = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.quantite} x {self.produit.nom}"
    
    @property
    def montant_total(self):
        return self.produit.prix * self.quantite


@receiver(post_save, sender=User)
def creer_panier_utilisateur(sender, instance, created, **kwargs):
    """Créer un panier pour chaque nouvel utilisateur."""
    if created:
        Panier.objects.create(client=instance)
