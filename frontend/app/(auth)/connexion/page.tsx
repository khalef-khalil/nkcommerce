"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

type LoginFormData = {
  username: string;
  password: string;
};

type FormErrors = {
  [key in keyof LoginFormData]?: string;
};

const ConnexionPage = () => {
  const { loginUser, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    
    if (generalError) {
      setGeneralError("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await loginUser(formData.username, formData.password);
    } catch (error) {
      setGeneralError("Identifiants incorrects. Veuillez réessayer.");
      console.error("Login error:", error);
    }
  };

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

  return (
    <div className="container-custom py-10">
      <motion.div
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-2xl font-bold text-center mb-6 text-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Connexion
        </motion.h1>

        {generalError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"
          >
            {generalError}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <FormInput
              id="username"
              name="username"
              type="text"
              label="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              Se connecter
            </Button>
          </motion.div>
        </motion.form>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-center text-gray-600"
        >
          Vous n'avez pas de compte?{" "}
          <Link href="/inscription" className="text-primary font-medium hover:underline">
            S'inscrire
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ConnexionPage; 