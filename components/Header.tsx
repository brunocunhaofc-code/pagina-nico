
import React, { useState } from 'react';
import { AdminIcon } from './ui/Icons';

interface HeaderProps {
  onAdminClick: () => void;
  isAuthenticated: boolean;
  sections: string[];
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick, isAuthenticated, sections }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const generateSectionId = (title: string) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/:/g, '');
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-40 border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <a href="#" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-500">
            Monster Store
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {sections.slice(0, 4).map(section => (
              <a 
                key={section}
                href={`#${generateSectionId(section)}`}
                className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
              >
                {section}
              </a>
            ))}
             {sections.length > 4 && (
                <div className="relative group">
                    <button className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                        Más
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
                        {sections.slice(4).map(section => (
                             <a 
                                key={section}
                                href={`#${generateSectionId(section)}`}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                {section}
                            </a>
                        ))}
                    </div>
                </div>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={onAdminClick}
              className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
              aria-label="Admin Panel"
            >
              <AdminIcon />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {sections.map(section => (
              <a 
                key={section}
                href={`#${generateSectionId(section)}`}
                onClick={handleNavLinkClick}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                {section}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};