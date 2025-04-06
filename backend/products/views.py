from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from .models import Categorie, Produit, ImageProduit
from .serializers import CategorieSerializer, ProduitSerializer, ProduitDetailSerializer, ImageProduitSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['get'])
    def produits(self, request, slug=None):
        categorie = self.get_object()
        produits = Produit.objects.filter(categorie=categorie, disponible=True)
        serializer = ProduitSerializer(produits, many=True)
        return Response(serializer.data)


class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categorie', 'marque', 'disponible']
    search_fields = ['nom', 'description', 'marque']
    ordering_fields = ['prix', 'date_creation', 'nom']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProduitDetailSerializer
        return ProduitSerializer
    
    @action(detail=False, methods=['get'])
    def nouveautes(self, request):
        nouveautes = Produit.objects.filter(disponible=True).order_by('-date_creation')[:8]
        serializer = ProduitSerializer(nouveautes, many=True)
        return Response(serializer.data)
