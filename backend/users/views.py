from django.shortcuts import render
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import api_view, permission_classes, action, authentication_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Profil
from .serializers import UserSerializer, UserCreateSerializer, ProfilSerializer
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
import json
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])   # Aucune authentification requise
def register_user(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Créer un token pour l'utilisateur
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Simple non-DRF view to avoid authentication issues
@csrf_exempt
def test_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            
            if not all([username, email, password]):
                return HttpResponse(json.dumps({'error': 'Missing required fields'}), 
                                  content_type="application/json", status=400)
                
            if User.objects.filter(username=username).exists():
                return HttpResponse(json.dumps({'error': 'Username already exists'}), 
                                  content_type="application/json", status=400)
                
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', '')
            )
            
            # Create token for the user
            token, created = Token.objects.get_or_create(user=user)
            
            return HttpResponse(json.dumps({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'token': token.key
            }), content_type="application/json", status=201)
            
        except json.JSONDecodeError:
            return HttpResponse(json.dumps({'error': 'Invalid JSON'}), 
                              content_type="application/json", status=400)
    
    return HttpResponse(json.dumps({'error': 'Only POST method allowed'}), 
                       content_type="application/json", status=405)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        user = request.user
        
        if request.method == 'GET':
            serializer = UserSerializer(user)
            return Response(serializer.data)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_info(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


# Non-DRF token endpoint to avoid authentication issues
@csrf_exempt
def obtain_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return HttpResponse(
                    json.dumps({'error': 'Les deux champs username et password sont requis'}),
                    content_type="application/json", 
                    status=400
                )
            
            user = authenticate(username=username, password=password)
            
            if not user:
                return HttpResponse(
                    json.dumps({'error': 'Identifiants invalides'}),
                    content_type="application/json", 
                    status=401
                )
            
            token, created = Token.objects.get_or_create(user=user)
            
            return HttpResponse(
                json.dumps({'token': token.key}),
                content_type="application/json",
                status=200
            )
            
        except json.JSONDecodeError:
            return HttpResponse(
                json.dumps({'error': 'Invalid JSON'}),
                content_type="application/json", 
                status=400
            )
    
    return HttpResponse(
        json.dumps({'error': 'Only POST method allowed'}),
        content_type="application/json", 
        status=405
    )
