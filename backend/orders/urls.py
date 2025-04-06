from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('commandes', views.CommandeViewSet, basename='commande')
router.register('panier', views.PanierViewSet, basename='panier')

# Adding additional statistics endpoints
urlpatterns = [
    path('', include(router.urls)),
    path('stats/orders/', views.CommandeViewSet.as_view({'get': 'statistics'}), name='order-stats'),
    path('stats/sales/', views.CommandeViewSet.as_view({'get': 'sales_data'}), name='sales-stats'),
    path('stats/users/', views.CommandeViewSet.as_view({'get': 'user_statistics'}), name='user-stats'),
] 