from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.CategorieViewSet, basename='categorie')
router.register('', views.ProduitViewSet, basename='produit')

urlpatterns = [
    path('', include(router.urls)),
] 