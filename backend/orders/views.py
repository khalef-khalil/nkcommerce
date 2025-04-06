from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from products.models import Produit
from .models import Commande, DetailCommande, Panier, ArticlePanier
from .serializers import CommandeSerializer, DetailCommandeSerializer, PanierSerializer, ArticlePanierSerializer
from django.utils import timezone
from django.db.models import Count, Sum, Avg, F
from datetime import timedelta
import uuid


class CommandeViewSet(viewsets.ModelViewSet):
    serializer_class = CommandeSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy', 'confirm', 'statistics', 'sales_data', 'user_statistics']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_staff:
                return Commande.objects.all()
            return Commande.objects.filter(client=user)
        return Commande.objects.none()
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        Confirm an order (admin only)
        """
        commande = self.get_object()
        commande.statut = 'confirmee'
        commande.save()
        serializer = self.get_serializer(commande)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get order statistics (admin only)
        """
        total_orders = Commande.objects.count()
        pending_orders = Commande.objects.filter(statut='en_attente').count()
        confirmed_orders = Commande.objects.filter(statut='confirmee').count()
        
        # Orders by status
        status_counts = Commande.objects.values('statut').annotate(count=Count('id'))
        
        # Recent orders (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_orders = Commande.objects.filter(date_creation__gte=thirty_days_ago).count()
        
        return Response({
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'confirmed_orders': confirmed_orders,
            'status_distribution': status_counts,
            'recent_orders': recent_orders
        })
    
    @action(detail=False, methods=['get'])
    def sales_data(self, request):
        """
        Get sales statistics (admin only)
        """
        # Total sales
        total_sales = Commande.objects.aggregate(total=Sum('montant_total'))
        
        # Sales by period
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_sales = Commande.objects.filter(date_creation__gte=thirty_days_ago).aggregate(total=Sum('montant_total'))
        
        # Average order value
        avg_order_value = Commande.objects.aggregate(avg=Avg('montant_total'))
        
        # Top selling products (last 30 days)
        top_products = DetailCommande.objects.filter(
            commande__date_creation__gte=thirty_days_ago
        ).values(
            'produit__id', 'produit__nom'
        ).annotate(
            total_quantity=Sum('quantite'),
            total_sales=Sum(F('prix') * F('quantite'))
        ).order_by('-total_quantity')[:5]
        
        return Response({
            'total_sales': total_sales,
            'recent_sales': recent_sales,
            'average_order_value': avg_order_value,
            'top_products': top_products
        })
    
    @action(detail=False, methods=['get'])
    def user_statistics(self, request):
        """
        Get user statistics (admin only)
        """
        total_users = Commande.objects.values('client').distinct().count()
        repeat_customers = Commande.objects.values('client').annotate(
            order_count=Count('id')
        ).filter(order_count__gt=1).count()
        
        # New users in the last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        new_customers = Commande.objects.filter(
            date_creation__gte=thirty_days_ago
        ).values('client').distinct().count()
        
        # Top customers
        top_customers = Commande.objects.values(
            'client__username', 'nom_complet', 'email'
        ).annotate(
            order_count=Count('id'),
            total_spent=Sum('montant_total')
        ).order_by('-total_spent')[:5]
        
        return Response({
            'total_customers': total_users,
            'repeat_customers': repeat_customers,
            'new_customers': new_customers,
            'top_customers': top_customers
        })


class PanierViewSet(viewsets.GenericViewSet):
    serializer_class = PanierSerializer
    
    def get_permissions(self):
        permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_object(self):
        request = self.request
        
        # For authenticated users, get or create their cart
        if request.user.is_authenticated:
            panier, created = Panier.objects.get_or_create(client=request.user)
            return panier
        
        # For anonymous users, get or create a cart based on session ID
        session_id = request.session.get('cart_session_id')
        if not session_id:
            session_id = str(uuid.uuid4())
            request.session['cart_session_id'] = session_id
        
        panier, created = Panier.objects.get_or_create(session_id=session_id)
        return panier
    
    def list(self, request):
        panier = self.get_object()
        serializer = self.get_serializer(panier)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def ajouter_produit(self, request):
        panier = self.get_object()
        produit_id = request.data.get('produit_id')
        quantite = int(request.data.get('quantite', 1))
        
        if not produit_id:
            return Response({'detail': 'Produit ID est requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            produit = Produit.objects.get(id=produit_id)
        except Produit.DoesNotExist:
            return Response({'detail': 'Produit non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        if not produit.disponible or produit.stock < quantite:
            return Response({'detail': 'Produit non disponible en stock'}, status=status.HTTP_400_BAD_REQUEST)
        
        article, created = ArticlePanier.objects.get_or_create(
            panier=panier,
            produit=produit,
            defaults={'quantite': quantite}
        )
        
        if not created:
            article.quantite += quantite
            article.save()
        
        serializer = PanierSerializer(panier)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def modifier_quantite(self, request):
        panier = self.get_object()
        article_id = request.data.get('article_id')
        quantite = int(request.data.get('quantite', 1))
        
        if not article_id:
            return Response({'detail': 'Article ID est requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            article = ArticlePanier.objects.get(id=article_id, panier=panier)
        except ArticlePanier.DoesNotExist:
            return Response({'detail': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        if quantite <= 0:
            article.delete()
        else:
            article.quantite = quantite
            article.save()
        
        serializer = PanierSerializer(panier)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def supprimer_article(self, request):
        panier = self.get_object()
        article_id = request.data.get('article_id')
        
        if not article_id:
            return Response({'detail': 'Article ID est requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            article = ArticlePanier.objects.get(id=article_id, panier=panier)
            article.delete()
        except ArticlePanier.DoesNotExist:
            return Response({'detail': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PanierSerializer(panier)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def vider(self, request):
        panier = self.get_object()
        ArticlePanier.objects.filter(panier=panier).delete()
        serializer = PanierSerializer(panier)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def convertir_en_commande(self, request):
        panier = self.get_object()
        articles = ArticlePanier.objects.filter(panier=panier)
        
        if not articles.exists():
            return Response({'detail': 'Le panier est vide'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier que les données requises sont fournies
        required_fields = ['nom_complet', 'email', 'telephone', 'adresse', 'ville']
        for field in required_fields:
            if not request.data.get(field):
                return Response({'detail': f'Le champ {field} est requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculer le montant total
        montant_total = sum(article.montant_total for article in articles)
        
        with transaction.atomic():
            # Créer la commande (lier au client si authentifié)
            client = request.user if request.user.is_authenticated else None
            
            commande = Commande.objects.create(
                client=client,
                nom_complet=request.data.get('nom_complet'),
                email=request.data.get('email'),
                telephone=request.data.get('telephone'),
                adresse=request.data.get('adresse'),
                ville=request.data.get('ville'),
                notes=request.data.get('notes', ''),
                montant_total=montant_total
            )
            
            # Créer les détails de commande
            for article in articles:
                DetailCommande.objects.create(
                    commande=commande,
                    produit=article.produit,
                    prix=article.produit.prix,
                    quantite=article.quantite
                )
                
                # Mettre à jour le stock
                produit = article.produit
                produit.stock -= article.quantite
                produit.save()
            
            # Vider le panier
            articles.delete()
        
        return Response({'id_commande': commande.id}, status=status.HTTP_201_CREATED)
