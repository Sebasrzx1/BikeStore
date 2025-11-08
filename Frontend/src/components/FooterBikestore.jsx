import React from "react";
import { Link } from "react-router-dom";
import "../styles/FooterBikestore.css";

const FooterBikestore = () => {
  return (
    <footer className="footer">
      <div className="ContInfo">
          <div className="ContLogo">
            <img src="./public/LogoFooter.png" alt="BikeStore Logo" />
            <p>Tu destino definitivo para bicicletas, accesorios y repuestos. Pedalea con pasión.</p>
          </div>

          <div className="ContEnlaces">
            <div className="ContEn">
              <p>Enlaces rápidos</p>
            </div>
            <div className="Contlist">
              <div className="list">
                <p>Sobre nosotros</p>
            </div>
            <div className="list">
                <p>Catalogo</p>
            </div>

            </div>
          </div>

          <div className="ContContact">
            <div className="ContEn">
              <p>Contacto</p>
            </div>
            <div className="ListCont">

              <div className="itemCont">
                <img src="./public/IconTel.svg" alt="IconTel" />
                <div className="ParCont">
                  <p>+57 316 6534776</p>
                </div>
              </div>

                <div className="itemCont">
                <img src="./public/IconTel.svg" alt="IconTel" />
                <div className="ParCont">
                  <p>+57 311 7246191</p>
                </div>
              </div>

                <div className="itemCont">
                <img src="./public/IconTel.svg" alt="IconTel" />
                <div className="ParCont">
                  <p>+57 317 3293770</p>
                </div>
              </div>

              <div className="itemCont">
                <img src="./public/Iconredemail.svg" alt="IconTel" />
                <div className="ParCont">
                  <p>info@bikestore.com</p>
                </div>
              </div>

              <div className="itemCont">
                <img src="./public/Iconubi.svg" alt="IconTel" />
                <div className="ParCont">
                  <p>Cl. 40 #30-44, Palmira, Valle del Cauca</p>
                </div>
              </div>


            </div>
          </div>
      </div>

      <div className="ContCopy">
        <div className="Paraf">
          <p>© 2025 BikeStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterBikestore;
