"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

type RegistrationFormData = {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type FormErrors = {
  [key in keyof RegistrationFormData]?: string;
};

const InscriptionPage = () => {
  const { registerUser, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof RegistrationFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await registerUser(formData.username, formData.email, formData.password);
    } catch (error) {
      console.error("Registration error:", error);
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
          Créer un compte
        </motion.h1>

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
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
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
            <FormInput
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              label="Confirmer le mot de passe"
              value={formData.passwordConfirm}
              onChange={handleChange}
              error={errors.passwordConfirm}
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
              S'inscrire
            </Button>
          </motion.div>
        </motion.form>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-center text-gray-600"
        >
          Vous avez déjà un compte?{" "}
          <Link href="/connexion" className="text-primary font-medium hover:underline">
            Se connecter
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default InscriptionPage; 