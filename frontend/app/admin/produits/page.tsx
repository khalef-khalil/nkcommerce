"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  Trash2Icon, 
  SearchIcon, 
  FilterIcon, 
  CheckIcon, 
  XIcon,
  ImageIcon,
  ArrowUpDownIcon,
  EyeIcon,
  PackageIcon,
  TagIcon,
  BoxIcon,
  InfoIcon
} from 'lucide-react';
import { fetchProducts, fetchCategories, adminDeleteProduct, adminCreateProduct, adminUpdateProduct } from '../../services/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Types
type Product = {
  id: number;
  nom: string;
  slug: string;
  prix: string;
  stock: number;
  disponible: boolean;
  categorie: {
    id: number;
    nom: string;
  };
  marque: string;
  image_principale: string | null;
  description: string;
  volume: string;
  date_creation: string;
  date_modification: string;
};

type Category = {
  id: number;
  nom: string;
  slug: string;
};

// Main component
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    slug: '',
    categorie_id: '',
    description: '',
    prix: '',
    stock: '',
    disponible: true,
    marque: '',
    volume: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  
  const router = useRouter();

  // Initialize empty form data
  const emptyFormData = {
    nom: '',
    slug: '',
    categorie_id: '',
    description: '',
    prix: '',
    stock: '',
    disponible: true,
    marque: '',
    volume: ''
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter products based on search query and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.marque.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? product.categorie.id === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortBy) return 0;
    
    let compareA, compareB;
    
    switch (sortBy) {
      case 'nom':
        compareA = a.nom.toLowerCase();
        compareB = b.nom.toLowerCase();
        break;
      case 'prix':
        compareA = parseFloat(a.prix);
        compareB = parseFloat(b.prix);
        break;
      case 'stock':
        compareA = a.stock;
        compareB = b.stock;
        break;
      default:
        return 0;
    }
    
    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const handleEditClick = (product: Product) => {
    setProductToEdit(product);
    // Populate form data with the product's current values
    setFormData({
      nom: product.nom,
      slug: product.slug,
      categorie_id: product.categorie.id.toString(),
      description: product.description || '',
      prix: product.prix,
      stock: product.stock.toString(),
      disponible: product.disponible,
      marque: product.marque || '',
      volume: product.volume || ''
    });
    // Reset image preview
    setSelectedImage(null);
    setImagePreview(product.image_principale);
    setShowEditProduct(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
  };

  // Handle name input to auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      nom: name,
      slug: generateSlug(name)
    });
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear selected image
  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddProductClick = () => {
    // Reset form data to empty values
    setFormData(emptyFormData);
    setSelectedImage(null);
    setImagePreview(null);
    setShowAddProduct(true);
  };

  // Add product submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Prepare form data for multipart submission
      const formDataObj = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'disponible') {
          formDataObj.append(key, value ? 'true' : 'false');
        } else {
          formDataObj.append(key, value.toString());
        }
      });
      
      // Add image if selected
      if (selectedImage) {
        formDataObj.append('image_principale', selectedImage);
      }
      
      // Call API with FormData - use the correct backend URL
      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${getCookieValue('admin_token')}`,
        },
        body: formDataObj
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const newProduct = await response.json();
      
      // Update local state
      setProducts([...products, newProduct]);
      toast.success(`${newProduct.nom} a été ajouté avec succès!`);
      
      // Reset form and close modal
      setFormData(emptyFormData);
      setSelectedImage(null);
      setImagePreview(null);
      setShowAddProduct(false);
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit product submission
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToEdit) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare form data for multipart submission
      const formDataObj = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'disponible') {
          formDataObj.append(key, value ? 'true' : 'false');
        } else {
          formDataObj.append(key, value.toString());
        }
      });
      
      // Add image if selected
      if (selectedImage) {
        formDataObj.append('image_principale', selectedImage);
      }
      
      // Call API with FormData - use the correct backend URL
      const response = await fetch(`http://localhost:8000/api/products/${productToEdit.slug}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${getCookieValue('admin_token')}`,
        },
        body: formDataObj
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const updatedProduct = await response.json();
      
      // Update local state
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      toast.success(`${updatedProduct.nom} a été mis à jour avec succès!`);
      
      // Close modal
      setShowEditProduct(false);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await adminDeleteProduct(productToDelete.slug);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast.success(`${productToDelete.nom} a été supprimé`);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    } finally {
      setShowModal(false);
      setProductToDelete(null);
    }
  };

  // Helper function to get cookie value
  const getCookieValue = (name: string): string => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : '';
  };

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0"
        >
          Gestion des Produits
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button 
            onClick={handleAddProductClick}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Ajouter un produit
          </button>
        </motion.div>
      </div>
      
      {/* Filters and search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="w-full md:w-56">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Products table */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('nom')}
                >
                  <div className="flex items-center">
                    Nom 
                    <ArrowUpDownIcon className="w-4 h-4 ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('prix')}
                >
                  <div className="flex items-center">
                    Prix 
                    <ArrowUpDownIcon className="w-4 h-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('stock')}
                >
                  <div className="flex items-center">
                    Stock 
                    <ArrowUpDownIcon className="w-4 h-4 ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image_principale ? (
                        <img 
                          src={product.image_principale} 
                          alt={product.nom} 
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.nom}</div>
                      <div className="text-xs text-gray-500">{product.marque}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.categorie.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{parseFloat(product.prix).toLocaleString('fr-FR')} MRU</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.stock < 5 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        {product.stock} unités
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.disponible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.disponible ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => viewProductDetails(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2Icon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
              <p className="text-sm text-gray-500 mb-4">
                Êtes-vous sûr de vouloir supprimer <span className="font-medium text-gray-700">{productToDelete?.nom}</span> ? 
                Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Ajouter un produit</h3>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom*
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      value={formData.nom}
                      onChange={handleNameChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Slug */}
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                      Slug*
                    </label>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      required
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Catégorie */}
                  <div>
                    <label htmlFor="categorie_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie*
                    </label>
                    <select
                      id="categorie_id"
                      name="categorie_id"
                      required
                      value={formData.categorie_id}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Prix */}
                  <div>
                    <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (MRU)*
                    </label>
                    <input
                      id="prix"
                      name="prix"
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      value={formData.prix}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Stock */}
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock*
                    </label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Marque */}
                  <div>
                    <label htmlFor="marque" className="block text-sm font-medium text-gray-700 mb-1">
                      Marque
                    </label>
                    <input
                      id="marque"
                      name="marque"
                      type="text"
                      value={formData.marque}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Volume */}
                  <div>
                    <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                      Volume
                    </label>
                    <input
                      id="volume"
                      name="volume"
                      type="text"
                      value={formData.volume}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image principale
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className="w-32 h-32 border-2 border-gray-300 border-dashed rounded-md flex justify-center items-center overflow-hidden relative">
                        {imagePreview ? (
                          <>
                            <img 
                              src={imagePreview} 
                              alt="Image preview" 
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={clearSelectedImage}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="space-y-1 text-center">
                            <div className="flex justify-center">
                              <ImageIcon className="h-10 w-10 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500">Ajouter une image</p>
                          </div>
                        )}
                      </div>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Choisir une image
                      </button>
                    </div>
                  </div>
                  
                  {/* Disponibilité */}
                  <div className="flex items-center mt-3">
                    <input
                      id="disponible"
                      name="disponible"
                      type="checkbox"
                      checked={formData.disponible}
                      onChange={(e) => setFormData({...formData, disponible: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="disponible" className="ml-2 block text-sm text-gray-700">
                      Disponible
                    </label>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Ajouter le produit'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && productToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Modifier: {productToEdit.nom}</h3>
                <button
                  onClick={() => setShowEditProduct(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div>
                    <label htmlFor="edit-nom" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom*
                    </label>
                    <input
                      id="edit-nom"
                      name="nom"
                      type="text"
                      required
                      value={formData.nom}
                      onChange={handleNameChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Slug */}
                  <div>
                    <label htmlFor="edit-slug" className="block text-sm font-medium text-gray-700 mb-1">
                      Slug*
                    </label>
                    <input
                      id="edit-slug"
                      name="slug"
                      type="text"
                      required
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Catégorie */}
                  <div>
                    <label htmlFor="edit-categorie_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie*
                    </label>
                    <select
                      id="edit-categorie_id"
                      name="categorie_id"
                      required
                      value={formData.categorie_id}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Prix */}
                  <div>
                    <label htmlFor="edit-prix" className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (MRU)*
                    </label>
                    <input
                      id="edit-prix"
                      name="prix"
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      value={formData.prix}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Stock */}
                  <div>
                    <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock*
                    </label>
                    <input
                      id="edit-stock"
                      name="stock"
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Marque */}
                  <div>
                    <label htmlFor="edit-marque" className="block text-sm font-medium text-gray-700 mb-1">
                      Marque
                    </label>
                    <input
                      id="edit-marque"
                      name="marque"
                      type="text"
                      value={formData.marque}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Volume */}
                  <div>
                    <label htmlFor="edit-volume" className="block text-sm font-medium text-gray-700 mb-1">
                      Volume
                    </label>
                    <input
                      id="edit-volume"
                      name="volume"
                      type="text"
                      value={formData.volume}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image principale
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className="w-32 h-32 border-2 border-gray-300 border-dashed rounded-md flex justify-center items-center overflow-hidden relative">
                        {imagePreview ? (
                          <>
                            <img 
                              src={imagePreview} 
                              alt="Image preview" 
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={clearSelectedImage}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="space-y-1 text-center">
                            <div className="flex justify-center">
                              <ImageIcon className="h-10 w-10 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500">Ajouter une image</p>
                          </div>
                        )}
                      </div>
                      <input
                        id="edit-image"
                        name="image"
                        type="file"
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {productToEdit?.image_principale ? 'Changer l\'image' : 'Ajouter une image'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Disponibilité */}
                  <div className="flex items-center mt-3">
                    <input
                      id="edit-disponible"
                      name="disponible"
                      type="checkbox"
                      checked={formData.disponible}
                      onChange={(e) => setFormData({...formData, disponible: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="edit-disponible" className="ml-2 block text-sm text-gray-700">
                      Disponible
                    </label>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditProduct(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Mettre à jour le produit'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowProductDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.nom}</h2>
                <button
                  onClick={() => setShowProductDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <PackageIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Catégorie:</span>
                    <span className="ml-2 font-medium">{selectedProduct.categorie.nom}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Marque:</span>
                    <span className="ml-2 font-medium">{selectedProduct.marque}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <BoxIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Volume:</span>
                    <span className="ml-2 font-medium">{selectedProduct.volume}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <InfoIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Statut:</span>
                    <span className={`ml-2 font-medium ${selectedProduct.disponible ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedProduct.disponible ? 'Disponible' : 'Non disponible'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <PackageIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Stock:</span>
                    <span className="ml-2 font-medium">{selectedProduct.stock} unités</span>
                  </div>
                  
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Prix:</span>
                    <span className="ml-2 font-medium">{selectedProduct.prix} €</span>
                  </div>
                  
                  <div className="flex items-center">
                    <BoxIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Créé le:</span>
                    <span className="ml-2 font-medium">{formatDate(selectedProduct.date_creation)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <InfoIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Modifié le:</span>
                    <span className="ml-2 font-medium">{formatDate(selectedProduct.date_modification)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{selectedProduct.description}</p>
              </div>

              {selectedProduct.image_principale && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Image principale</h3>
                  <img
                    src={selectedProduct.image_principale}
                    alt={selectedProduct.nom}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 