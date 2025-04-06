#!/usr/bin/env python
import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nkcommerce.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

admin_username = 'admin_tester'
admin_email = 'admin_tester@example.com'
admin_pass = 'admin123secure'

# Create or update the admin user
try:
    if not User.objects.filter(username=admin_username).exists():
        admin_user = User.objects.create_superuser(
            username=admin_username, 
            email=admin_email, 
            password=admin_pass
        )
        admin_token, _ = Token.objects.get_or_create(user=admin_user)
        print(f'Admin créé avec succès, token: {admin_token.key}')
    else:
        admin_user = User.objects.get(username=admin_username)
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        admin_token, _ = Token.objects.get_or_create(user=admin_user)
        print(f'Admin existe déjà, token: {admin_token.key}')
    
    # Return just the token for easier parsing
    print(f'TOKEN:{admin_token.key}')
    
except Exception as e:
    print(f'Erreur: {str(e)}', file=sys.stderr)
    sys.exit(1) 