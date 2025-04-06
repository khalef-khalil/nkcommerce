"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { fetchOrders } from "../../services/api";
import Link from "next/link";
import { ChevronDown, ChevronUp, Package, Clock, Check, TruckIcon } from "lucide-react";

type OrderDetail = {
  id: number;
  produit: {
    id: number;
    nom: string;
    slug: string;
    prix: string;
    image_principale: string | null;
  };
  prix: string;
  quantite: number;
  montant_total: number;
};

type Order = {
  id: number;
  client: number | null;
  nom_complet: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  statut: "en_attente" | "confirmee" | "expediee" | "livree" | "annulee";
  notes: string;
  montant_total: string;
  details: OrderDetail[];
  date_creation: string;
};

const statusMap = {
  en_attente: {
    label: "En attente",
    color: "bg-yellow-500",
    icon: Clock,
  },
  confirmee: {
    label: "Confirmée",
    color: "bg-green-500",
    icon: Check,
  },
  expediee: {
    label: "Expédiée",
    color: "bg-blue-500",
    icon: TruckIcon,
  },
  livree: {
    label: "Livrée",
    color: "bg-purple-500",
    icon: Package,
  },
  annulee: {
    label: "Annulée",
    color: "bg-red-500",
    icon: Clock,
  },
};

const OrdersPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/connexion");
    } else if (isAuthenticated) {
      loadOrders();
    }
  }, [isLoading, isAuthenticated, router]);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading || loadingOrders) {
    return (
      <div className="container-custom py-10 min-h-screen flex justify-center items-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10 min-h-screen">
      <motion.h1
        className="text-2xl md:text-3xl font-bold mb-8 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Mes Commandes
      </motion.h1>

      {orders.length === 0 ? (
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore passé de commande.
          </p>
          <Link
            href="/catalogue"
            className="btn-primary inline-block"
          >
            Découvrir nos produits
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div
                className="p-4 md:p-6 cursor-pointer"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-2 md:mb-0">
                    <div className="flex items-center">
                      <span className="font-bold text-lg text-primary">
                        Commande #{order.id}
                      </span>
                      <span
                        className={`ml-3 ${
                          statusMap[order.statut].color
                        } text-white text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}
                      >
                        {React.createElement(statusMap[order.statut].icon, {
                          size: 14,
                          className: "mr-1",
                        })}
                        {statusMap[order.statut].label}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {formatDate(order.date_creation)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-lg">
                      {parseFloat(order.montant_total).toFixed(2)} €
                    </div>
                    <div className="ml-4">
                      {expandedOrder === order.id ? (
                        <ChevronUp size={20} className="text-primary" />
                      ) : (
                        <ChevronDown size={20} className="text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 md:p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2 text-gray-700">
                            Information de livraison
                          </h3>
                          <p className="text-gray-600">{order.nom_complet}</p>
                          <p className="text-gray-600">{order.adresse}</p>
                          <p className="text-gray-600">
                            {order.ville}
                          </p>
                          <p className="text-gray-600">{order.telephone}</p>
                          <p className="text-gray-600">{order.email}</p>
                        </div>

                        {order.notes && (
                          <div>
                            <h3 className="font-semibold mb-2 text-gray-700">
                              Notes
                            </h3>
                            <p className="text-gray-600">{order.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <h3 className="font-semibold mb-4 text-gray-700">
                          Produits
                        </h3>
                        <div className="space-y-4">
                          {order.details.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center border-b border-gray-100 pb-4"
                            >
                              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {item.produit.image_principale ? (
                                  <img
                                    src={item.produit.image_principale}
                                    alt={item.produit.nom}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package
                                    size={24}
                                    className="text-gray-400"
                                  />
                                )}
                              </div>
                              <div className="ml-4 flex-grow">
                                <Link
                                  href={`/produit/${item.produit.slug}`}
                                  className="font-medium text-primary hover:underline"
                                >
                                  {item.produit.nom}
                                </Link>
                                <p className="text-gray-500 text-sm">
                                  Quantité: {item.quantite}
                                </p>
                              </div>
                              <div className="font-medium">
                                {parseFloat(item.prix).toFixed(2)} €
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <div className="text-right">
                          <div className="font-medium text-gray-600">
                            Total commande:
                            <span className="text-lg font-bold text-primary ml-2">
                              {parseFloat(order.montant_total).toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default OrdersPage; 