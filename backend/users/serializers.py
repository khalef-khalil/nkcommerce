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
    
    def update(self, instance, validated_data):
        # Extract nested profile data if it exists
        profile_data = validated_data.pop('profil', None)
        
        # Update User instance fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        
        # Update or create profile if profile data is provided
        if profile_data:
            profile, created = Profil.objects.get_or_create(user=instance)
            profile.telephone = profile_data.get('telephone', profile.telephone)
            profile.adresse = profile_data.get('adresse', profile.adresse)
            profile.ville = profile_data.get('ville', profile.ville)
            # Handle other profile fields if needed
            profile.save()
        
        return instance


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