from django.db import models
from django.utils.text import slugify

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories', blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['nom']
    
    def __str__(self):
        return self.nom
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nom)
        super().save(*args, **kwargs)


class Produit(models.Model):
    nom = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE, related_name='produits')
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    disponible = models.BooleanField(default=True)
    image_principale = models.ImageField(upload_to='produits', null=True, blank=True)
    marque = models.CharField(max_length=100, blank=True)
    volume = models.CharField(max_length=50, blank=True, help_text="Ex: 100ml")
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ['-date_creation']
    
    def __str__(self):
        return self.nom
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nom)
        super().save(*args, **kwargs)


class ImageProduit(models.Model):
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='produits')
    
    class Meta:
        verbose_name = "Image produit"
        verbose_name_plural = "Images produit"
    
    def __str__(self):
        return f"Image de {self.produit.nom}"
