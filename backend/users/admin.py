from django.contrib import admin
from .models import Profil

@admin.register(Profil)
class ProfilAdmin(admin.ModelAdmin):
    list_display = ['user', 'telephone', 'ville']
    search_fields = ['user__username', 'user__email', 'telephone']
