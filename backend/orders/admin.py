from django.contrib import admin
from .models import Commande, DetailCommande, Panier, ArticlePanier

class DetailCommandeInline(admin.TabularInline):
    model = DetailCommande
    raw_id_fields = ['produit']
    extra = 0
    readonly_fields = ['prix', 'montant_total']

@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    list_display = ['id', 'nom_complet', 'email', 'ville', 'montant_total', 'statut', 'date_creation']
    list_filter = ['statut', 'date_creation']
    search_fields = ['nom_complet', 'email', 'telephone']
    readonly_fields = ['montant_total']
    inlines = [DetailCommandeInline]
    fieldsets = (
        (None, {'fields': ('client', 'statut', 'montant_total')}),
        ('Informations client', {'fields': ('nom_complet', 'email', 'telephone')}),
        ('Adresse de livraison', {'fields': ('adresse', 'ville')}),
        ('Informations supplémentaires', {'fields': ('notes',)}),
    )
    actions = ['confirmer_commandes', 'marquer_comme_expediees', 'marquer_comme_livrees', 'annuler_commandes']
    
    def confirmer_commandes(self, request, queryset):
        updated = queryset.update(statut='confirmee')
        self.message_user(request, f'{updated} commandes ont été confirmées.')
    confirmer_commandes.short_description = "Confirmer les commandes sélectionnées"
    
    def marquer_comme_expediees(self, request, queryset):
        updated = queryset.update(statut='expediee')
        self.message_user(request, f'{updated} commandes ont été marquées comme expédiées.')
    marquer_comme_expediees.short_description = "Marquer comme expédiées"
    
    def marquer_comme_livrees(self, request, queryset):
        updated = queryset.update(statut='livree')
        self.message_user(request, f'{updated} commandes ont été marquées comme livrées.')
    marquer_comme_livrees.short_description = "Marquer comme livrées"
    
    def annuler_commandes(self, request, queryset):
        updated = queryset.update(statut='annulee')
        self.message_user(request, f'{updated} commandes ont été annulées.')
    annuler_commandes.short_description = "Annuler les commandes"

class ArticlePanierInline(admin.TabularInline):
    model = ArticlePanier
    raw_id_fields = ['produit']
    extra = 0
    readonly_fields = ['montant_total']

@admin.register(Panier)
class PanierAdmin(admin.ModelAdmin):
    list_display = ['id', 'client_display', 'nombre_articles', 'montant_total', 'date_creation']
    inlines = [ArticlePanierInline]
    
    def client_display(self, obj):
        if obj.client:
            return obj.client.username
        return f"Invité ({obj.session_id})"
    client_display.short_description = 'Client'
