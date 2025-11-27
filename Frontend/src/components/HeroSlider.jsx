import React, { useState, useEffect } from "react";
import "../styles/HeroSlider.css";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    textoPrincipal: "Encuentra la bicicleta de tus sueños",
    textoSecundario: "Bicicletas de alta calidad para todo tipo de terreno y estilo.",
    boton: "Compra ahora",
    imagen: "/imgslide1.jpg",
  },
  {
    textoPrincipal: "Experimenta la libertad",
    textoSecundario: "Únete a la revolución",
    boton: "Compra ahora",
    imagen: "/imgslide2.jpg",
  },
  {
    textoPrincipal: "Viaja con pasión",
    textoSecundario: "Accesorios y repuestos de calidad",
    boton: "Compra ahora",
    imagen: "/imgslide3.jpg",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // --- AUTOPLAY MÁS RÁPIDO (3s) ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setIndex((prev) => (prev + 1) % slides.length);
      }
    }, 1600); // <--- velocidad reducida

    return () => clearInterval(interval);
  }, [isPaused]);

  const { textoPrincipal, textoSecundario, boton, imagen } = slides[index];

  const pauseTime = 1500; // <--- Pausa después de botón/dot

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), pauseTime);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), pauseTime);
  };

  const goToSlide = (slideIndex) => {
    setIndex(slideIndex);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), pauseTime);
  };

  return (
    <div
      className="hero-slider"
      style={{
        backgroundImage: `url(${imagen})`,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slider-content">
        <div className="Tituloslider">
          <h1>{textoPrincipal}</h1>
          <p>{textoSecundario}</p>
          <button
            className="slider-button"
            onClick={() => navigate("/catalogo")}
          >
            {boton}
          </button>
        </div>
      </div>

      <button className="arrow left-arrow" onClick={prevSlide} aria-label="Slide anterior">
        &#10094;
      </button>
      <button className="arrow right-arrow" onClick={nextSlide} aria-label="Slide siguiente">
        &#10095;
      </button>

      <div className="dots">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            className={`dot ${slideIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(slideIndex)}
            aria-label={`Ir al slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
