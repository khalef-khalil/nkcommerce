"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  BarChart3, 
  PieChart, 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  Package,
  Calendar,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import { 
  fetchOrderStats, 
  fetchSalesStats, 
  fetchUserStats 
} from '../../services/api';

// Types for statistics
type OrderStats = {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  status_distribution: { statut: string; count: number }[];
  recent_orders: number;
};

type SalesStats = {
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

type UserStats = {
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

export default function StatsPage() {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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

  // Calculate rate of order confirmation
  const confirmationRate = orderStats 
    ? Math.round((orderStats.confirmed_orders / orderStats.total_orders) * 100) 
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-gray-800"
        >
          Statistiques
        </motion.h1>
      </div>

      {/* Tabs for different stat views */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-2 mb-6"
      >
        <div className="flex">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg ${
              activeTab === 'all' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Aperçu général
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg ${
              activeTab === 'sales' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Ventes
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg ${
              activeTab === 'customers' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Clients
          </button>
        </div>
      </motion.div>

      {/* Stats overview section */}
      {(activeTab === 'all' || activeTab === 'sales') && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
        >
          {/* Total Sales Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-gray-400" />
                  Total des ventes
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {salesStats?.total_sales?.total 
                    ? `${salesStats.total_sales.total.toLocaleString('fr-FR')} MRU` 
                    : '0 MRU'}
                </h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <LineChart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm">
                <span className="text-green-500 flex items-center mr-2">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  <span>{salesStats?.recent_sales?.total ? Math.round((salesStats.recent_sales.total / salesStats.total_sales.total) * 100) : 0}%</span>
                </span>
                <span className="text-gray-500">depuis le mois dernier</span>
              </div>
            </div>
          </div>

          {/* Average Order Value Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1 text-gray-400" />
                  Valeur moyenne/commande
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {salesStats?.average_order_value?.avg 
                    ? `${salesStats.average_order_value.avg.toLocaleString('fr-FR')} MRU` 
                    : '0 MRU'}
                </h3>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm">
                <span className="text-gray-500">Basé sur {orderStats?.total_orders || 0} commandes</span>
              </div>
            </div>
          </div>

          {/* Confirmation Rate Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  Taux de confirmation
                </p>
                <h3 className="text-2xl font-bold text-gray-800">{confirmationRate}%</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <PieChart className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${confirmationRate}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-2 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm">
                <span className="text-gray-500">{orderStats?.confirmed_orders || 0} commandes confirmées sur {orderStats?.total_orders || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Specific sections based on tab */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Produits les plus vendus</h3>
              <div className="bg-indigo-100 p-1.5 rounded-full">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            
            <div className="space-y-4">
              {salesStats?.top_products?.slice(0, 5).map((product, index) => (
                <div key={product.produit__id} className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                    {index + 1}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-700">{product.produit__nom}</p>
                      <p className="text-sm font-medium text-gray-900">{product.total_sales.toLocaleString('fr-FR')} MRU</p>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <p>{product.total_quantity} unités vendues</p>
                      <p>{Math.round((product.total_sales / (salesStats?.total_sales?.total || 1)) * 100)}% des ventes</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.round((product.total_sales / (salesStats?.total_sales?.total || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!salesStats?.top_products || salesStats.top_products.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">Aucune donnée disponible</p>
              )}
            </div>
          </motion.div>

          {/* Top Customers */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Meilleurs clients</h3>
              <div className="bg-blue-100 p-1.5 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="space-y-4">
              {userStats?.top_customers?.slice(0, 5).map((customer, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                    {customer.nom_complet.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-700">{customer.nom_complet}</p>
                      <p className="text-sm font-medium text-gray-900">{customer.total_spent.toLocaleString('fr-FR')} MRU</p>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <p>{customer.email}</p>
                      <p>{customer.order_count} commande{customer.order_count > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!userStats?.top_customers || userStats.top_customers.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">Aucune donnée disponible</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Sales tab content */}
      {activeTab === 'sales' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition des ventes par produit</h3>
          
          <div className="space-y-4 mt-6">
            {salesStats?.top_products?.map((product) => (
              <div key={product.produit__id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{product.produit__nom}</span>
                  <span className="text-sm font-medium text-gray-700">{product.total_sales.toLocaleString('fr-FR')} MRU</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.round((product.total_sales / (salesStats?.total_sales?.total || 1)) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{product.total_quantity} unités</span>
                  <span>{Math.round((product.total_sales / (salesStats?.total_sales?.total || 1)) * 100)}% du total</span>
                </div>
              </div>
            ))}
          </div>
          
          {(!salesStats?.top_products || salesStats.top_products.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">Aucune donnée de vente disponible</p>
          )}
        </motion.div>
      )}

      {/* Customers tab content */}
      {activeTab === 'customers' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-indigo-500 mr-2" />
                <h4 className="font-medium text-gray-700">Total clients</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800">{userStats?.total_customers || 0}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-green-500 mr-2" />
                <h4 className="font-medium text-gray-700">Clients fidèles</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800">{userStats?.repeat_customers || 0}</p>
              <p className="text-xs text-gray-500">
                {userStats ? Math.round((userStats.repeat_customers / userStats.total_customers) * 100) : 0}% du total
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-gray-700">Nouveaux clients</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800">{userStats?.new_customers || 0}</p>
              <p className="text-xs text-gray-500">
                {userStats ? Math.round((userStats.new_customers / userStats.total_customers) * 100) : 0}% du total
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Meilleurs clients par dépense</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commandes
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dépense totale
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userStats?.top_customers?.map((customer, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                          {customer.nom_complet.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{customer.nom_complet}</div>
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500">{customer.order_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">{customer.total_spent.toLocaleString('fr-FR')} MRU</div>
                    </td>
                  </tr>
                ))}
                
                {(!userStats?.top_customers || userStats.top_customers.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucune donnée client disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}