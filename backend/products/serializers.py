from rest_framework import serializers
from .models import Categorie, Produit, ImageProduit

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ['id', 'nom', 'slug', 'description', 'image', 'date_creation']


class ImageProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageProduit
        fields = ['id', 'image']


class ProduitSerializer(serializers.ModelSerializer):
    categorie = CategorieSerializer(read_only=True)
    categorie_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Categorie.objects.all(), source='categorie')
    images = ImageProduitSerializer(many=True, read_only=True)
    
    class Meta:
        model = Produit
        fields = [
            'id', 'nom', 'slug', 'categorie', 'categorie_id', 'description',
            'prix', 'stock', 'disponible', 'image_principale', 'images',
            'marque', 'volume', 'date_creation'
        ]


class ProduitDetailSerializer(serializers.ModelSerializer):
    categorie = CategorieSerializer(read_only=True)
    images = ImageProduitSerializer(many=True, read_only=True)
    
    class Meta:
        model = Produit
        fields = [
            'id', 'nom', 'slug', 'categorie', 'description',
            'prix', 'stock', 'disponible', 'image_principale', 'images',
            'marque', 'volume', 'date_creation', 'date_modification'
        ] 