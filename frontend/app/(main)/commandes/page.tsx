"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { fetchOrders } from '../../services/api';
import { Order } from '../../types';
import Link from 'next/link';
import { PackageCheck, ShoppingBag, PackageX, Clock, CheckCircle, Truck } from 'lucide-react';

const OrdersPage = () => {
  const { isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      if (!isAuthenticated || !token) return;
      
      try {
        setIsLoading(true);
        const ordersData = await fetchOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getOrders();
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="container-custom py-12">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <ShoppingBag size={80} className="text-gray-300 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Connectez-vous pour voir vos commandes</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Vous devez être connecté pour voir l'historique de vos commandes.
            </p>
            <Link href="/connexion">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white py-3 px-6 rounded-md"
              >
                Se connecter
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-custom py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 text-gray-800"
        >
          Mes Commandes
        </motion.h1>
        
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <PackageX size={80} className="text-gray-300 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Aucune commande trouvée</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Vous n'avez pas encore passé de commande. Visitez notre catalogue pour découvrir nos produits.
            </p>
            <Link href="/catalogue">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white py-3 px-6 rounded-md"
              >
                Parcourir le catalogue
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Helper to get status icon
  const getStatusIcon = (status: Order['statut']) => {
    switch (status) {
      case 'en_attente':
        return <Clock className="text-amber-500" />;
      case 'confirmee':
        return <CheckCircle className="text-green-500" />;
      case 'en_cours':
        return <Truck className="text-blue-500" />;
      case 'livree':
        return <PackageCheck className="text-primary" />;
      case 'annulee':
        return <PackageX className="text-red-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  // Helper to get status text in French
  const getStatusText = (status: Order['statut']) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'confirmee': return 'Confirmée';
      case 'en_cours': return 'En cours de livraison';
      case 'livree': return 'Livrée';
      case 'annulee': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container-custom py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-gray-800"
      >
        Mes Commandes
      </motion.h1>
      
      <AnimatePresence>
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden"
          >
            <div className="p-6 border-b">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Commande #{order.id}</p>
                  <h3 className="font-bold text-xl mt-1">{formatDate(order.date_creation)}</h3>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md">
                  {getStatusIcon(order.statut)}
                  <span className="font-medium">{getStatusText(order.statut)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Informations de livraison</h4>
                  <div className="text-gray-600">
                    <p>{order.nom_complet}</p>
                    <p>{order.email}</p>
                    <p>{order.telephone}</p>
                    <p>{order.adresse}</p>
                    <p>{order.ville}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Récapitulatif</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Articles:</span>
                      <span>{order.details.reduce((sum, detail) => sum + detail.quantite, 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Total:</span>
                      <span className="font-bold text-primary">{Number(order.montant_total).toFixed(2)} MRU</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link href={`/commandes/${order.id}`} className="block w-full mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  Voir les détails
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage; 