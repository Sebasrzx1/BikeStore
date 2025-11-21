import React from "react";
import "../styles/BotonSubrayado.css";

const BotonSubrayado = ({ texto = "Comprar ahora", onClick }) => {
return (
    <button className="cta" onClick={onClick}>
    <span className="hover-underline-animation">{texto}</span>

    <svg
        id="arrow-horizontal"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="10"
        viewBox="0 0 46 16"
    >
        <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" />
    </svg>
    </button>
);
};

export default BotonSubrayado;
