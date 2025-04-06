"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgImage: string;
  textColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Collection Exclusive",
    subtitle: "Découvrez notre nouvelle collection de parfums de luxe",
    buttonText: "Découvrir",
    buttonLink: "/catalogue",
    bgImage: "/images/slide1.jpg",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "Parfums pour Lui",
    subtitle: "Des fragrances élégantes pour tous les moments",
    buttonText: "Voir la collection",
    buttonLink: "/categories/parfums-homme",
    bgImage: "/images/slide2.jpg",
    textColor: "text-white"
  },
  {
    id: 3,
    title: "Parfums pour Elle",
    subtitle: "Des parfums délicats et envoûtants",
    buttonText: "Explorer",
    buttonLink: "/categories/parfums-femme",
    bgImage: "/images/slide3.jpg",
    textColor: "text-white"
  }
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };
  
  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${slides[currentIndex].bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-4xl md:text-5xl font-bold mb-4 ${slides[currentIndex].textColor}`}
            >
              {slides[currentIndex].title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-lg md:text-xl mb-8 max-w-2xl ${slides[currentIndex].textColor}`}
            >
              {slides[currentIndex].subtitle}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link href={slides[currentIndex].buttonLink} className="btn-primary">
                {slides[currentIndex].buttonText}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all z-10"
        aria-label="Slide précédent"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all z-10"
        aria-label="Slide suivant"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            } transition-all`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 