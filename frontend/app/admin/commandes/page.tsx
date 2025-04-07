"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SearchIcon, 
  FilterIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  EyeIcon,
  ArrowUpDownIcon,
  UserIcon,
  CalendarIcon,
  CircleDollarSignIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { adminFetchAllOrders, adminConfirmOrder } from '../../services/api';
import toast from 'react-hot-toast';

// Type definitions
type OrderDetail = {
  id: number;
  produit: {
    id: number;
    nom: string;
    slug: string;
  };
  prix: string;
  quantite: number;
  montant_total: number;
};

type Order = {
  id: number;
  client: number | null;
  client__username?: string;
  nom_complet: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  statut: 'en_attente' | 'confirmee';
  notes: string;
  montant_total: string;
  details: OrderDetail[];
  date_creation: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [sortBy, setSortBy] = useState<string>('date_creation');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await adminFetchAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmOrder = async (orderId: number) => {
    try {
      await adminConfirmOrder(orderId);
      
      // Update the local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, statut: 'confirmee' } 
          : order
      ));
      
      toast.success('Commande confirmée avec succès');
      
      // Close modal if it's the selected order
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({...selectedOrder, statut: 'confirmee'});
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Erreur lors de la confirmation de la commande');
    }
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.nom_complet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter ? order.statut === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let compareA, compareB;
    
    switch (sortBy) {
      case 'date_creation':
        compareA = new Date(a.date_creation).getTime();
        compareB = new Date(b.date_creation).getTime();
        break;
      case 'montant_total':
        compareA = parseFloat(a.montant_total);
        compareB = parseFloat(b.montant_total);
        break;
      case 'nom_complet':
        compareA = a.nom_complet.toLowerCase();
        compareB = b.nom_complet.toLowerCase();
        break;
      default:
        compareA = new Date(a.date_creation).getTime();
        compareB = new Date(b.date_creation).getTime();
    }
    
    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Go to previous page
  const goToPreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  // Go to next page
  const goToNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
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
      {/* Header */}
      <div className="mb-6">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-gray-800"
        >
          Gestion des Commandes
        </motion.h1>
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
              placeholder="Rechercher par nom, email ou ID..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="w-full md:w-56">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              >
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="confirmee">Confirmée</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Orders table */}
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
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('nom_complet')}
                >
                  <div className="flex items-center">
                    Client 
                    <ArrowUpDownIcon className="w-4 h-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('date_creation')}
                >
                  <div className="flex items-center">
                    Date 
                    <ArrowUpDownIcon className="w-4 h-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('montant_total')}
                >
                  <div className="flex items-center">
                    Montant 
                    <ArrowUpDownIcon className="w-4 h-4 ml-1" />
                  </div>
                </th>
                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <span className="md:hidden">
                          {order.nom_complet.length > 20 ? `${order.nom_complet.substring(0, 20)}...` : order.nom_complet}
                        </span>
                        <span className="hidden md:inline">{order.nom_complet}</span>
                      </div>
                      <div className="text-xs text-gray-500 hidden md:block">{order.email}</div>
                      <div className="text-xs text-gray-500 md:hidden">
                        <span className={`
                          ${order.statut === 'confirmee' ? 'text-green-600' : 'text-yellow-600'} font-medium
                        `}>
                          {order.statut === 'confirmee' ? 'Confirmée' : 'En attente'}
                        </span>
                        <span className="mx-1">•</span>
                        <span>{parseFloat(order.montant_total).toLocaleString('fr-FR')} MRU</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.date_creation)}</div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{parseFloat(order.montant_total).toLocaleString('fr-FR')} MRU</div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.statut === 'confirmee' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.statut === 'confirmee' ? 'Confirmée' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {order.statut === 'en_attente' && (
                          <button
                            onClick={() => confirmOrder(order.id)}
                            className="text-green-600 hover:text-green-900 p-1.5 rounded-full hover:bg-green-50"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {sortedOrders.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à <span className="font-medium">
                    {Math.min(indexOfLastItem, sortedOrders.length)}
                  </span> sur <span className="font-medium">{sortedOrders.length}</span> commandes
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="mr-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing items per page
                    }}
                    className="border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={5}>5 par page</option>
                    <option value={10}>10 par page</option>
                    <option value={20}>20 par page</option>
                    <option value={50}>50 par page</option>
                  </select>
                </div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Page précédente</span>
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    let pageNumber;
                    
                    // Logic to show proper page numbers when there are many pages
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                      if (index === 4) pageNumber = totalPages;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Page suivante</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Order details modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Détails de la commande #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-700">Informations client</h4>
                  </div>
                  <p className="text-sm mb-1"><span className="font-medium">Nom:</span> {selectedOrder.nom_complet}</p>
                  <p className="text-sm mb-1"><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                  <p className="text-sm mb-1"><span className="font-medium">Téléphone:</span> {selectedOrder.telephone}</p>
                  <p className="text-sm mb-1"><span className="font-medium">Adresse:</span> {selectedOrder.adresse}</p>
                  <p className="text-sm"><span className="font-medium">Ville:</span> {selectedOrder.ville}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CircleDollarSignIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-700">Détails paiement</h4>
                  </div>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Montant total:</span> {parseFloat(selectedOrder.montant_total).toLocaleString('fr-FR')} MRU
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Statut:</span> 
                    <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedOrder.statut === 'confirmee' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.statut === 'confirmee' ? 'Confirmée' : 'En attente'}
                    </span>
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-700">Informations commande</h4>
                  </div>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Date:</span> {formatDate(selectedOrder.date_creation)}
                  </p>
                  {selectedOrder.notes && (
                    <p className="text-sm">
                      <span className="font-medium">Notes:</span> {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>
              
              <h4 className="font-medium text-gray-700 mb-3">Articles commandés</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix unitaire
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantité
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.details.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{item.produit.nom}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="text-sm text-gray-500">{parseFloat(item.prix).toLocaleString('fr-FR')} MRU</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="text-sm text-gray-500">{item.quantite}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="text-sm font-medium text-gray-900">{item.montant_total.toLocaleString('fr-FR')} MRU</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                        {parseFloat(selectedOrder.montant_total).toLocaleString('fr-FR')} MRU
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end">
                {selectedOrder.statut === 'en_attente' ? (
                  <button
                    onClick={() => confirmOrder(selectedOrder.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Confirmer la commande
                  </button>
                ) : (
                  <div className="flex items-center text-green-600">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Commande confirmée</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 