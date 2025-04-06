"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { fetchOrderById } from '../../../services/api';
import { Order } from '../../../types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, PackageCheck, Clock, CheckCircle, Truck, PackageX, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

const OrderDetailPage = ({ params }: OrderDetailPageProps) => {
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const orderId = parseInt(params.id);

  useEffect(() => {
    const getOrder = async () => {
      if (!isAuthenticated) {
        router.push('/connexion');
        return;
      }
      
      if (isNaN(orderId)) {
        router.push('/commandes');
        return;
      }
      
      try {
        setIsLoading(true);
        const orderData = await fetchOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        router.push('/commandes');
      } finally {
        setIsLoading(false);
      }
    };

    getOrder();
  }, [isAuthenticated, orderId, router]);

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Chargement de la commande...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Commande introuvable</h2>
            <p className="text-gray-600 mb-6">
              La commande que vous recherchez n'existe pas ou vous n'y avez pas accès.
            </p>
            <Link href="/commandes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 mx-auto"
              >
                <ArrowLeft size={16} />
                Retour aux commandes
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Helper to get status details
  const getStatusDetails = () => {
    switch (order.statut) {
      case 'en_attente':
        return {
          icon: <Clock size={28} className="text-amber-500" />,
          label: 'En attente',
          description: 'Votre commande a été reçue et est en attente de confirmation.',
          color: 'bg-amber-50 border-amber-200'
        };
      case 'confirmee':
        return {
          icon: <CheckCircle size={28} className="text-green-500" />,
          label: 'Confirmée',
          description: 'Votre commande a été confirmée et est en cours de préparation.',
          color: 'bg-green-50 border-green-200'
        };
      case 'en_cours':
        return {
          icon: <Truck size={28} className="text-blue-500" />,
          label: 'En cours de livraison',
          description: 'Votre commande est en cours de livraison.',
          color: 'bg-blue-50 border-blue-200'
        };
      case 'livree':
        return {
          icon: <PackageCheck size={28} className="text-primary" />,
          label: 'Livrée',
          description: 'Votre commande a été livrée avec succès.',
          color: 'bg-purple-50 border-purple-200'
        };
      case 'annulee':
        return {
          icon: <PackageX size={28} className="text-red-500" />,
          label: 'Annulée',
          description: 'Votre commande a été annulée.',
          color: 'bg-red-50 border-red-200'
        };
      default:
        return {
          icon: <Clock size={28} className="text-gray-500" />,
          label: 'Statut inconnu',
          description: 'Le statut de votre commande est inconnu.',
          color: 'bg-gray-50 border-gray-200'
        };
    }
  };

  const statusDetails = getStatusDetails();
  
  // Format date
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
      {/* Header with back button */}
      <div className="flex items-center mb-8">
        <Link href="/commandes">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-gray-600 hover:text-primary mr-4"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Retour</span>
          </motion.button>
        </Link>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          Commande #{order.id}
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg border ${statusDetails.color}`}
          >
            <div className="flex items-center gap-4">
              {statusDetails.icon}
              <div>
                <h3 className="font-bold text-lg">{statusDetails.label}</h3>
                <p className="text-gray-600">{statusDetails.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Order items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-bold mb-6 pb-3 border-b">Articles commandés</h2>
            
            <div className="space-y-6">
              {order.details.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                    {item.produit.image_principale ? (
                      <Image
                        src={item.produit.image_principale}
                        alt={item.produit.nom}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Image non disponible
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between">
                      <div>
                        <Link href={`/produit/${item.produit.slug}`} className="font-medium text-primary hover:underline flex items-center">
                          {item.produit.nom}
                          <ExternalLink size={14} className="ml-1 opacity-70" />
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.produit.marque} · {item.produit.volume}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{Number(item.prix).toFixed(2)} MRU × {item.quantite}</p>
                        <p className="font-bold text-primary mt-1">{item.montant_total.toFixed(2)} MRU</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          {/* Order info */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 pb-3 border-b">Résumé de la commande</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-1">Date de commande</p>
                <p className="font-medium">{formatDate(order.date_creation)}</p>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{Number(order.montant_total).toFixed(2)} MRU</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Livraison</span>
                  <span>Gratuite</span>
                </div>
                <div className="flex justify-between pt-3 mt-2 border-t font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{Number(order.montant_total).toFixed(2)} MRU</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Delivery info */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 pb-3 border-b">Informations de livraison</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Nom</p>
                <p className="font-medium">{order.nom_complet}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Téléphone</p>
                <p className="font-medium">{order.telephone}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Adresse</p>
                <p className="font-medium">{order.adresse}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Ville</p>
                <p className="font-medium">{order.ville}</p>
              </div>
              {order.notes && (
                <div className="pt-3 mt-2 border-t">
                  <p className="text-gray-600 text-sm">Notes</p>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 