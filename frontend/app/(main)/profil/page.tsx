"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { updateUserProfile } from "../../services/api";
import toast from "react-hot-toast";

type ProfileFormData = {
  first_name: string;
  last_name: string;
  telephone: string;
  adresse: string;
  ville: string;
};

const ProfilPage = () => {
  const { user, isAuthenticated, isLoading, refreshUserProfile } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    telephone: "",
    adresse: "",
    ville: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/connexion");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        telephone: user.profil?.telephone || "",
        adresse: user.profil?.adresse || "",
        ville: user.profil?.ville || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Send a single update with both user data and nested profile data
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        // Use the nested structure for profile updates
        profil: {
          telephone: formData.telephone,
          adresse: formData.adresse,
          ville: formData.ville
        }
      };
      
      await updateUserProfile(userData);
      await refreshUserProfile();
      toast.success("Profil mis à jour avec succès!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsUpdating(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="container-custom py-10 min-h-screen flex justify-center items-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container-custom py-10 min-h-screen">
      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="md:flex">
          <motion.div
            className="md:w-1/3 bg-primary p-8 text-white"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="w-32 h-32 rounded-full bg-white/30 mx-auto flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-4xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
            <p className="text-white/80 mb-4">{user.email}</p>
            <div className="border-t border-white/20 pt-4 mt-4">
              <h3 className="font-medium mb-2">Informations</h3>
              <p className="text-sm text-white/80 mb-1">
                <span className="font-medium">Membre depuis:</span>{" "}
                {new Date().toLocaleDateString("fr-FR")}
              </p>
            </div>
          </motion.div>

          <div className="md:w-2/3 p-8">
            <motion.h1
              className="text-2xl font-bold mb-6 text-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Mon Profil
            </motion.h1>

            <motion.form
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <FormInput
                    id="first_name"
                    name="first_name"
                    label="Prénom"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormInput
                    id="last_name"
                    name="last_name"
                    label="Nom"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <FormInput
                  id="telephone"
                  name="telephone"
                  label="Téléphone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormInput
                  id="adresse"
                  name="adresse"
                  label="Adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormInput
                  id="ville"
                  name="ville"
                  label="Ville"
                  value={formData.ville}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="pt-4"
              >
                <Button
                  type="submit"
                  isLoading={isUpdating}
                >
                  Mettre à jour le profil
                </Button>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilPage; 