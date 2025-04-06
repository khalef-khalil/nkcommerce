from django.contrib import admin
from .models import Categorie, Produit, ImageProduit

class ImageProduitInline(admin.TabularInline):
    model = ImageProduit
    extra = 3

@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ['nom', 'slug', 'date_creation']
    prepopulated_fields = {'slug': ('nom',)}
    search_fields = ['nom']

@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ['nom', 'slug', 'categorie', 'prix', 'stock', 'disponible', 'date_creation']
    list_filter = ['disponible', 'date_creation', 'categorie']
    list_editable = ['prix', 'stock', 'disponible']
    prepopulated_fields = {'slug': ('nom',)}
    search_fields = ['nom', 'description']
    inlines = [ImageProduitInline]
