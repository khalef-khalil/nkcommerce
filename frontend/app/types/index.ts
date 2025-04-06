export interface Category {
  id: number;
  nom: string;
  slug: string;
  description: string;
  image: string | null;
  date_creation: string;
}

export interface Product {
  id: number;
  nom: string;
  slug: string;
  categorie: Category;
  description: string;
  prix: string;
  stock: number;
  disponible: boolean;
  image_principale: string | null;
  images: string[];
  marque: string;
  volume: string;
  date_creation: string;
  date_modification?: string;
}

export interface CartItem {
  id: number;
  produit: Product;
  quantite: number;
  montant_total: number;
  date_ajout: string;
}

export interface Cart {
  id: number;
  client: number | null;
  articles: CartItem[];
  montant_total: number;
  nombre_articles: number;
  date_creation: string;
}

export interface OrderDetail {
  id: number;
  produit: Product;
  prix: string;
  quantite: number;
  montant_total: number;
}

export interface Order {
  id: number;
  client: number | null;
  nom_complet: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  statut: 'en_attente' | 'confirmee' | 'en_cours' | 'livree' | 'annulee';
  notes: string;
  montant_total: string;
  details: OrderDetail[];
  date_creation: string;
} 