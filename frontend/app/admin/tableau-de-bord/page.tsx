"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3Icon, ShoppingCartIcon, UsersIcon, TrendingUpIcon, CircleDollarSignIcon, ShoppingBagIcon, Clock8Icon, CheckCheckIcon } from 'lucide-react';
import { fetchOrderStats, fetchSalesStats, fetchUserStats } from '../../services/api';
import Link from 'next/link';

type OrderStatsType = {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  status_distribution: { statut: string; count: number }[];
  recent_orders: number;
};

type SalesStatsType = {
  total_sales: { total: number };
  recent_sales: { total: number };
  average_order_value: { avg: number };
  top_products: {
    produit__id: number;
    produit__nom: string;
    total_quantity: number;
    total_sales: number;
  }[];
};

type UserStatsType = {
  total_customers: number;
  repeat_customers: number;
  new_customers: number;
  top_customers: {
    client__username: string;
    nom_complet: string;
    email: string;
    order_count: number;
    total_spent: number;
  }[];
};

export default function AdminDashboardPage() {
  const [orderStats, setOrderStats] = useState<OrderStatsType | null>(null);
  const [salesStats, setSalesStats] = useState<SalesStatsType | null>(null);
  const [userStats, setUserStats] = useState<UserStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all stats in parallel
        const [orderData, salesData, userData] = await Promise.all([
          fetchOrderStats(),
          fetchSalesStats(),
          fetchUserStats()
        ]);
        
        setOrderStats(orderData);
        setSalesStats(salesData);
        setUserStats(userData);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <BarChart3Icon size={48} className="text-indigo-300" />
          <p className="mt-4 text-gray-500">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <ShoppingCartIcon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Commandes Totales</p>
              <h3 className="text-2xl font-semibold text-gray-800">{orderStats?.total_orders || 0}</h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">En attente</span>
              <span className="font-medium">{orderStats?.pending_orders || 0}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Confirmées</span>
              <span className="font-medium">{orderStats?.confirmed_orders || 0}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CircleDollarSignIcon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Ventes Totales</p>
              <h3 className="text-xl font-semibold text-gray-800">
                {salesStats?.total_sales?.total 
                  ? `${salesStats.total_sales.total.toLocaleString('fr-FR')} MRU` 
                  : '0 MRU'}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Valeur moyenne</span>
              <span className="font-medium">
                {salesStats?.average_order_value?.avg 
                  ? `${salesStats.average_order_value.avg.toLocaleString('fr-FR')} MRU` 
                  : '0 MRU'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <UsersIcon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Clients</p>
              <h3 className="text-2xl font-semibold text-gray-800">{userStats?.total_customers || 0}</h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Nouveaux clients</span>
              <span className="font-medium">{userStats?.new_customers || 0}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Clients fidèles</span>
              <span className="font-medium">{userStats?.repeat_customers || 0}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <TrendingUpIcon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Ratio de Confirmation</p>
              <h3 className="text-2xl font-semibold text-gray-800">
                {orderStats 
                  ? `${Math.round((orderStats.confirmed_orders / orderStats.total_orders) * 100)}%` 
                  : '0%'}
              </h3>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ 
                width: `${orderStats ? Math.round((orderStats.confirmed_orders / orderStats.total_orders) * 100) : 0}%` 
              }}
            ></div>
          </div>
        </motion.div>
      </div>

      {/* Top Products Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Produits les plus vendus</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unités vendues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventes totales
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesStats?.top_products?.length ? (
                salesStats.top_products.map((product) => (
                  <tr key={product.produit__id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.produit__nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.total_quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.total_sales.toLocaleString('fr-FR')} MRU
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun produit vendu pour le moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Latest Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Statut des commandes</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                <Clock8Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-700">En attente</p>
                  <p className="text-sm font-medium text-gray-700">{orderStats?.pending_orders || 0}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ 
                      width: `${orderStats ? Math.round((orderStats.pending_orders / orderStats.total_orders) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <CheckCheckIcon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-700">Confirmées</p>
                  <p className="text-sm font-medium text-gray-700">{orderStats?.confirmed_orders || 0}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${orderStats ? Math.round((orderStats.confirmed_orders / orderStats.total_orders) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link href="/admin/commandes" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              <ShoppingBagIcon size={16} className="mr-2" />
              Voir toutes les commandes
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Meilleurs clients</h2>
          
          <div className="space-y-4">
            {userStats?.top_customers?.length ? (
              userStats.top_customers.slice(0, 5).map((customer, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-3">
                    {customer.nom_complet.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-800">{customer.nom_complet}</p>
                      <p className="text-sm font-medium text-gray-800">{customer.total_spent.toLocaleString('fr-FR')} MRU</p>
                    </div>
                    <p className="text-xs text-gray-500">{customer.order_count} commande{customer.order_count > 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun client pour le moment</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 