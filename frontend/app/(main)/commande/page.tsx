"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';
import { useRouter } from 'next/navigation';
import { convertCartToOrder } from '../../services/api';
import { toast } from 'react-hot-toast';

type FormData = {
  nom_complet: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  notes: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

const CheckoutPage = () => {
  const { cart, isLoading, clearCart, refreshCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    nom_complet: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    email: user?.email || '',
    telephone: user?.profil?.telephone || '',
    adresse: user?.profil?.adresse || '',
    ville: user?.profil?.ville || '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.nom_complet) newErrors.nom_complet = "Le nom complet est requis";
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (!formData.telephone) newErrors.telephone = "Le numéro de téléphone est requis";
    if (!formData.adresse) newErrors.adresse = "L'adresse est requise";
    if (!formData.ville) newErrors.ville = "La ville est requise";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!cart || cart.articles.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await convertCartToOrder(formData);
      
      toast.success("Commande placée avec succès!");
      clearCart();
      router.push(`/commandes/${response.id_commande}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Erreur lors de la création de la commande. Veuillez réessayer.");
      refreshCart(); // Refresh cart in case of error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  React.useEffect(() => {
    if (!isLoading && (!cart || cart.articles.length === 0)) {
      router.push('/panier');
    }
  }, [cart, isLoading, router]);

  if (isLoading || !cart) {
    return (
      <div className="container-custom py-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-gray-800"
      >
        Finaliser votre commande
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-2/3"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 pb-4 border-b">Informations de livraison</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Nom complet"
                  id="nom_complet"
                  name="nom_complet"
                  value={formData.nom_complet}
                  onChange={handleChange}
                  error={errors.nom_complet}
                />
                
                <FormInput
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                
                <FormInput
                  label="Téléphone"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  error={errors.telephone}
                />
                
                <FormInput
                  label="Ville"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  error={errors.ville}
                />
                
                <div className="md:col-span-2">
                  <FormInput
                    label="Adresse"
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    error={errors.adresse}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optionnel)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 mt-6 bg-secondary text-white rounded-md flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-white rounded-full animate-spin mr-2"></div>
                    Traitement...
                  </>
                ) : (
                  "Confirmer la commande"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/3"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 pb-4 border-b">Récapitulatif</h2>
            
            <div className="space-y-4">
              {cart.articles.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">{item.produit.nom}</p>
                    <p className="text-sm text-gray-500">{item.quantite} × {Number(item.produit.prix).toFixed(2)} MRU</p>
                  </div>
                  <span className="font-semibold">{item.montant_total.toFixed(2)} MRU</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Sous-total</span>
                <span>{cart.montant_total.toFixed(2)} MRU</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Livraison</span>
                <span>Gratuite</span>
              </div>
              
              <div className="flex justify-between py-4 border-t border-gray-200 font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{cart.montant_total.toFixed(2)} MRU</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage; 