from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profil

class ProfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profil
        fields = ['telephone', 'adresse', 'ville', 'photo']


class UserSerializer(serializers.ModelSerializer):
    profil = ProfilSerializer()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profil']
        read_only_fields = ['username']


class UserCreateSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate(self, data):
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError("Les mots de passe ne correspondent pas")
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user 