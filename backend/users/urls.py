from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.UserViewSet, basename='user')

# Restricted API routes that use DRF
api_urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.register_user, name='register'),
    path('info/', views.user_info, name='user-info'),
]

# Public endpoints that bypass DRF authentication
urlpatterns = [
    # These endpoints are direct Django views with no authentication
    path('public/register/', views.test_register, name='public-register'),
    path('public/token/', views.obtain_token, name='public-token'),
    
    # Include the standard API routes
    path('', include(api_urlpatterns)),
] 