from rest_framework import serializers
from .models import Commande, DetailCommande, Panier, ArticlePanier
from products.serializers import ProduitSerializer
from products.models import Produit

class DetailCommandeSerializer(serializers.ModelSerializer):
    produit = ProduitSerializer(read_only=True)
    produit_id = serializers.PrimaryKeyRelatedField(write_only=True, source='produit', queryset=Produit.objects.all())
    montant_total = serializers.ReadOnlyField()
    
    class Meta:
        model = DetailCommande
        fields = ['id', 'produit', 'produit_id', 'prix', 'quantite', 'montant_total']


class CommandeSerializer(serializers.ModelSerializer):
    details = DetailCommandeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Commande
        fields = [
            'id', 'client', 'nom_complet', 'email', 'telephone', 
            'adresse', 'ville', 'statut', 'notes', 'montant_total', 
            'details', 'date_creation'
        ]
        read_only_fields = ['client', 'montant_total']
    
    def create(self, validated_data):
        client = self.context['request'].user
        validated_data['client'] = client
        return super().create(validated_data)


class ArticlePanierSerializer(serializers.ModelSerializer):
    produit = ProduitSerializer(read_only=True)
    produit_id = serializers.PrimaryKeyRelatedField(write_only=True, source='produit', queryset=Produit.objects.all())
    montant_total = serializers.ReadOnlyField()
    
    class Meta:
        model = ArticlePanier
        fields = ['id', 'produit', 'produit_id', 'quantite', 'montant_total', 'date_ajout']


class PanierSerializer(serializers.ModelSerializer):
    articles = ArticlePanierSerializer(many=True, read_only=True)
    montant_total = serializers.ReadOnlyField()
    nombre_articles = serializers.ReadOnlyField()
    
    class Meta:
        model = Panier
        fields = ['id', 'client', 'articles', 'montant_total', 'nombre_articles', 'date_creation']
        read_only_fields = ['client'] 