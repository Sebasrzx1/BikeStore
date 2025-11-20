import React from "react";
import { Link } from "react-router-dom"
import "../styles/SobreNostros.css"
const SobreNosotros = () => {
    return (
        <div className="contenedor-general-sobrenostros">
            <div className="logo-titulo">
                <img src="../logo_bike2.png" alt="Logo"></img>
                <p>Sobre Nosotros</p>
            </div>
            <div className="Descripcion-sobrenostros">
                <h1>Pasión por el ciclismo, tecnlogía y servicio</h1>
                <div className="text">
                    <p>BikeStore nació de la pasión por el ciclismo y el compromiso de ofrecer la mejor experiencia a cada ciclista. Somos más que una tienda online: somos un punto de encuentro para amantes de las dos ruedas que buscan calidad, innovación y un servicio excepcional. Nuestro catálogo incluye bicicletas de alto rendimiento, accesorios de última generación y repuestos de marcas líderes mundiales. Creemos que cada pedaleo cuenta, por eso trabajamos día a día para que encuentres exactamente lo que necesitas, con asesoramiento experto, entrega rápida y soporte técnico post-venta. En BikeStore, tu próxima aventura comienza aquí.</p>
                </div>
            </div>

            <div className="contenedor-imagenes">
                <img src="../4SN.png" alt="Foto1" />
                <img src="../3SN.png" alt="Foto2" />
                <img src="../1SN.png" alt="Foto3" />
                <img src="../2SN.png" alt="Foto4" />
            </div>

            <div className="cards-informativas">
                <div className="encabezado_SN">
                    <h2>¿Por qué elegir BikeStore?</h2>
                    <p>Nos diferenciamos por nuestra dedicación a cada detalle y nuestro compromiso con la comunidad ciclista</p>
                </div>


                <div className="contenedor-de-cards">

                    <div className="cardinfo">
                        <div className="icono-background">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M20.6357 17.1867L22.6557 28.5547C22.6783 28.6886 22.6595 28.8261 22.6018 28.949C22.5442 29.0719 22.4503 29.1743 22.3329 29.2424C22.2155 29.3106 22.0801 29.3412 21.9447 29.3303C21.8094 29.3194 21.6807 29.2674 21.5757 29.1814L16.8023 25.5987C16.5719 25.4266 16.292 25.3335 16.0043 25.3335C15.7167 25.3335 15.4368 25.4266 15.2063 25.5987L10.425 29.18C10.3201 29.266 10.1915 29.3178 10.0563 29.3288C9.92117 29.3397 9.7859 29.3091 9.66855 29.2412C9.55121 29.1733 9.45737 29.0711 9.39956 28.9485C9.34175 28.8258 9.32272 28.6885 9.345 28.5547L11.3637 17.1867" stroke="white" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16 18.6667C20.4183 18.6667 24 15.085 24 10.6667C24 6.24841 20.4183 2.66669 16 2.66669C11.5817 2.66669 8 6.24841 8 10.6667C8 15.085 11.5817 18.6667 16 18.6667Z" stroke="white" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <p id="titlecard">Calidad Premium</p>
                        <p>Productos de las mejores marcas del mercado con garantia extendida</p>
                    </div>

                    <div className="cardinfo">
                        <div className="icono-background">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M5.333 18.6667C5.08068 18.6675 4.83331 18.5968 4.6196 18.4627C4.4059 18.3285 4.23464 18.1365 4.12573 17.9089C4.01682 17.6813 3.97472 17.4275 4.00433 17.1769C4.03394 16.9263 4.13404 16.6893 4.293 16.4933L17.493 2.89335C17.592 2.77906 17.7269 2.70182 17.8756 2.67432C18.0243 2.64683 18.178 2.6707 18.3113 2.74202C18.4446 2.81334 18.5498 2.92788 18.6094 3.06682C18.6691 3.20577 18.6798 3.36088 18.6397 3.50668L16.0797 11.5333C16.0042 11.7354 15.9788 11.9527 16.0058 12.1667C16.0327 12.3807 16.1112 12.5849 16.2345 12.7619C16.3577 12.9389 16.522 13.0834 16.7134 13.1829C16.9047 13.2824 17.1173 13.334 17.333 13.3333H26.6663C26.9186 13.3325 27.166 13.4032 27.3797 13.5374C27.5934 13.6715 27.7647 13.8635 27.8736 14.0911C27.9825 14.3187 28.0246 14.5726 27.995 14.8231C27.9654 15.0737 27.8653 15.3107 27.7063 15.5067L14.5063 29.1067C14.4073 29.221 14.2724 29.2982 14.1237 29.3257C13.975 29.3532 13.8214 29.3293 13.688 29.258C13.5547 29.1867 13.4496 29.0722 13.3899 28.9332C13.3302 28.7943 13.3196 28.6392 13.3597 28.4933L15.9197 20.4667C15.9952 20.2646 16.0205 20.0473 15.9935 19.8333C15.9666 19.6194 15.8881 19.4151 15.7649 19.2381C15.6416 19.0611 15.4773 18.9167 15.286 18.8171C15.0946 18.7176 14.882 18.666 14.6663 18.6667H5.333Z" stroke="white" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <p id="titlecard">Calidad Premium</p>
                        <p>Productos de las mejores marcas del mercado con garantia extendida</p>
                    </div>

                    <div className="cardinfo">
                        <div className="icono-background">
                            <img src="./public/IconBike.svg" alt="IconoBicicletas" />
                        </div>
                        <p id="titlecard">Calidad Premium</p>
                        <p>Productos de las mejores marcas del mercado con garantia extendida</p>
                    </div>

                    <div className="cardinfo">
                        <div className="icono-background">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M21.3337 28V25.3333C21.3337 23.9188 20.7718 22.5623 19.7716 21.5621C18.7714 20.5619 17.4148 20 16.0003 20H8.00033C6.58584 20 5.22928 20.5619 4.22909 21.5621C3.2289 22.5623 2.66699 23.9188 2.66699 25.3333V28" stroke="white" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M21.333 4.17065C22.4767 4.46715 23.4895 5.13501 24.2126 6.0694C24.9356 7.0038 25.3279 8.15184 25.3279 9.33332C25.3279 10.5148 24.9356 11.6628 24.2126 12.5972C23.4895 13.5316 22.4767 14.1995 21.333 14.496" stroke="white" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M29.333 28V25.3333C29.3321 24.1516 28.9388 23.0037 28.2148 22.0698C27.4908 21.1358 26.4772 20.4688 25.333 20.1733" stroke="white" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.0003 14.6667C14.9458 14.6667 17.3337 12.2789 17.3337 9.33333C17.3337 6.38781 14.9458 4 12.0003 4C9.05481 4 6.66699 6.38781 6.66699 9.33333C6.66699 12.2789 9.05481 14.6667 12.0003 14.6667Z" stroke="white" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <p id="titlecard">Premium</p>
                        <p>Productos de las mejores marcas del mercado con garantia extendida</p>
                    </div>

                </div>
            </div>

            <div className="ContenedorPublicidad">
                <div className="publicidad">
                    <p id="readyAventure">¿Listo para comenzar tu aventura?</p>
                    <p>Descubre nuestro catálogo completo de bicicletas, accesorios y repuestos. Encuentra el equipo perfecto para tu próximo desafio.</p>
                    <button>Ver Catálogo</button>
                </div>
            </div>

            <div className="recomendacion">
                <div className="card-recomendacion">
                    <p id="price">10,000+</p>
                    <p>Clientes Satisfechos</p>
                </div>
                <div className="card-recomendacion">
                    <p id="price">200+</p>
                    <p>Prodcutos en stock</p>
                </div>
                <div className="card-recomendacion">
                    <p id="price">15+</p>
                    <p>Marcas Premium</p>
                </div>

            </div>


















        </div>
    )
}

export default SobreNosotros