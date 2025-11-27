import React from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md'

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5" style={{ boxShadow: '0 -4px 10px rgba(0,0,0,0.1)' }}>
      <div className="container">
        <div className="row g-4">
          {/* Columna 1: Información de la empresa */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h5 className="text-uppercase mb-3 fw-bold" style={{ color: '#4CAF50' }}>
              🏍️ MAB Motors
            </h5>
            <p className="text-secondary small">
              Tu tienda de confianza para motocicletas y accesorios. Calidad y servicio garantizados.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="col-12 col-sm-6 col-lg-2">
            <h5 className="text-uppercase mb-3 fw-bold" style={{ color: '#4CAF50' }}>Enlaces</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none hover-effect small">
                  Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/productos" className="text-light text-decoration-none hover-effect small">
                  Catálogo
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/servicios" className="text-light text-decoration-none hover-effect small">
                  Servicios
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-light text-decoration-none hover-effect small">
                  Mi Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="col-12 col-sm-6 col-lg-4">
            <h5 className="text-uppercase mb-3 fw-bold" style={{ color: '#4CAF50' }}>Contacto</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-start">
                <MdLocationOn className="me-2 mt-1 flex-shrink-0" style={{ color: '#4CAF50' }} />
                <span className="text-secondary small">Av. Siempre Viva 123, Springfield</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <MdEmail className="me-2 flex-shrink-0" style={{ color: '#4CAF50' }} />
                <a href="mailto:contacto@mabmotors.com" className="text-secondary text-decoration-none small hover-effect">
                  contacto@mabmotors.com
                </a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <MdPhone className="me-2 flex-shrink-0" style={{ color: '#4CAF50' }} />
                <a href="tel:+541112345678" className="text-secondary text-decoration-none small hover-effect">
                  +54 11 1234-5678
                </a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaWhatsapp className="me-2 flex-shrink-0" style={{ color: '#4CAF50' }} />
                <a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none small hover-effect">
                  +54 9 11 1234-5678
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h5 className="text-uppercase mb-3 fw-bold" style={{ color: '#4CAF50' }}>Síguenos</h5>
            <div className="d-flex gap-3 flex-wrap">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-light fs-4 hover-scale"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-light fs-4 hover-scale"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-light fs-4 hover-scale"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-light fs-4 hover-scale"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
            <p className="text-secondary small mt-3 mb-0">
              Mantente conectado con nosotros en nuestras redes sociales para las últimas novedades y ofertas.
            </p>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        {/* Copyright */}
        <div className="row">
          <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="text-secondary small mb-0">
              © {new Date().getFullYear()} <strong className="text-white">MAB Motors</strong>. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-12 col-md-6 text-center text-md-end">
            <p className="text-secondary small mb-0">
              Desarrollado por <strong className="text-white">Miguel Angel Banegas</strong>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .hover-effect {
          transition: all 0.3s ease;
        }
        .hover-effect:hover {
          color: #4CAF50 !important;
          padding-left: 5px;
        }
        .hover-scale {
          transition: all 0.3s ease;
          display: inline-block;
        }
        .hover-scale:hover {
          color: #4CAF50 !important;
          transform: scale(1.2);
        }
        
        @media (max-width: 576px) {
          footer h5 {
            font-size: 1rem;
          }
          footer .fs-4 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer