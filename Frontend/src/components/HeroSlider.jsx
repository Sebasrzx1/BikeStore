import React, { useState, useEffect } from "react";
import "../styles/HeroSlider.css";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    textoPrincipal: "Encuentra la bicicleta de tus sueños",
    textoSecundario:
      "Bicicletas de alta calidad para todo tipo de terreno y estilo.",
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
    boton: "Comprar ahora",
    imagen: "/imgslide3.jpg",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const { textoPrincipal, textoSecundario, boton, imagen } = slides[index];

  const navigate = useNavigate();

  return (
    <div
      className="hero-slider"
      style={{
        backgroundImage: `url(${imagen})`,
      }}
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
    </div>
  );
}
