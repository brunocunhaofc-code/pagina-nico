import React from 'react';

export const Footer = () => {
    const whatsappUrl = `https://wa.me/59800000000?text=${encodeURIComponent("Hola, estoy interesado en sus productos.")}`;

    return (
        <footer className="bg-black border-t border-gray-800 py-12">
            <div className="container mx-auto px-4 text-center text-gray-400">
                <h3 className="text-2xl font-bold text-white mb-4">Contacto</h3>
                <p className="mb-6">¿Tenés alguna consulta? ¡Escribinos!</p>
                <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                >
                    Contactar por WhatsApp
                </a>
                <div className="mt-10 pt-8 border-t border-gray-700">
                    <p>&copy; {new Date().getFullYear()} Monster Store. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};