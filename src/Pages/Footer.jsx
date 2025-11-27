import React from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md'

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5" style={{ boxShadow: '0 -4px 10px rgba(0,0,0,0.1)' }}>
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
            {/* Columna 1: Información de la empresa */}
            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h5 className="text-uppercase mb-4 font-weight-bold" style={{ color: '#4CAF50' }}>
                    🏍️ MAB Motors
                </h5>
                <p className="text-secondary">
                    Tu tienda de confianza para motocicletas y accesorios. Calidad y servicio garantizados.
                </p>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                <h5 className="text-uppercase mb-4 font-weight-bold" style={{ color: '#4CAF50' }}>Enlaces</h5>
                <p><Link to="/" className="text-light text-decoration-none hover-effect">Inicio</Link></p>
                <p><Link to="/productos" className="text-light text-decoration-none hover-effect">Productos</Link></p>
                <p><Link to="/servicios" className="text-light text-decoration-none hover-effect">Servicios</Link></p>
                <p><Link to="/login" className="text-light text-decoration-none hover-effect">Mi Cuenta</Link></p>
            </div>

            {/* Columna 3: Contacto */}
             <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h5 className="text-uppercase mb-4 font-weight-bold" style={{ color: '#4CAF50' }}>Contacto</h5>
                <p className="text-secondary"><MdLocationOn className="me-2 text-white" /> Av. Siempre Viva 123, Springfield</p>
                <p className="text-secondary"><MdEmail className="me-2 text-white" /> contacto@mabmotors.com</p>
                <p className="text-secondary"><MdPhone className="me-2 text-white" /> +54 11 1234-5678</p>
                <p className="text-secondary"><FaWhatsapp className="me-2 text-white" /> +54 9 11 1234-5678</p>
            </div>

            {/* Columna 4: Redes Sociales */}
            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h5 className="text-uppercase mb-4 font-weight-bold" style={{ color: '#4CAF50' }}>Síguenos</h5>
                <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-3">
                    <a href="#" className="text-light fs-4 hover-scale"><FaFacebook /></a>
                    <a href="#" className="text-light fs-4 hover-scale"><FaInstagram /></a>
                    <a href="#" className="text-light fs-4 hover-scale"><FaTwitter /></a>
                    <a href="#" className="text-light fs-4 hover-scale"><FaYoutube /></a>
                </div>
            </div>
        </div>

        <hr className="mb-4 border-secondary" />

        <div className="row align-items-center">
            <div className="col-md-7 col-lg-8">
                <p className="text-secondary">© {new Date().getFullYear()} <strong className="text-white">MAB Motors</strong>. Todos los derechos reservados.</p>
            </div>
            <div className="col-md-5 col-lg-4">
                <p className="text-center text-md-end text-secondary">Desarrollado por <strong className="text-white">Miguel Angel Banegas</strong></p>
            </div>
        </div>
      </div>
      <style>{`
        .hover-effect:hover {
            color: #4CAF50 !important;
            padding-left: 5px;
            transition: all 0.3s ease;
        }
        .hover-scale:hover {
            color: #4CAF50 !important;
            transform: scale(1.2);
            transition: all 0.3s ease;
        }
      `}</style>
    </footer>
  )
}

export default Footer