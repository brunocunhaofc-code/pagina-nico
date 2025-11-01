
import React, { useState, useMemo, useCallback } from 'react';
import type { Product } from './types';
import { useProducts } from './hooks/useProducts';
import { useAuth } from './hooks/useAuth';
import { useBrands } from './hooks/useBrands';
import { useSectionOrder } from './hooks/useSectionOrder';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { ProductList } from './components/ProductList';
import { ProductModal } from './components/ProductModal';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminView, setAdminView] = useState<'closed' | 'login' | 'panel'>('closed');

  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { isAuthenticated, login, logout, updatePassword, loading: authLoading } = useAuth();
  const { brands, addBrand, deleteBrand, loading: brandsLoading } = useBrands();
  // Fix: Removed `brands` argument from useSectionOrder call as it takes no arguments.
  const { sectionOrder, setSectionOrder, loading: orderLoading } = useSectionOrder();

  const bestSellers = useMemo(() => products.filter(p => p.isBestSeller), [products]);
  const maleProducts = useMemo(() => products.filter(p => p.isMale), [products]);
  const femaleProducts = useMemo(() => products.filter(p => p.isFemale), [products]);

  const productsByBrand = useMemo(() => {
    return brands.reduce((acc, brand) => {
      acc[brand] = products.filter(p => p.brand === brand);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products, brands]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setAdminView('panel');
    } else {
      setAdminView('login');
    }
  };
  
  const handleAdminClose = () => {
    setAdminView('closed');
  };

  const handleLoginSuccess = () => {
    setAdminView('panel');
  };

  const handleLogout = async () => {
    await logout();
    setAdminView('closed');
  };

  const handleAddBrand = useCallback(async (brandName: string) => {
    const { error } = await addBrand(brandName);
    if (!error && !sectionOrder.includes(brandName)) {
      await setSectionOrder([...sectionOrder, brandName]);
    }
    return { error };
  }, [addBrand, sectionOrder, setSectionOrder]);

  const handleDeleteBrand = useCallback(async (brandName: string) => {
    const { error } = await deleteBrand(brandName);
    if (!error) {
      const newOrder = sectionOrder.filter(s => s !== brandName);
      if (newOrder.length !== sectionOrder.length) {
          await setSectionOrder(newOrder);
      }
    }
    return { error };
  }, [deleteBrand, sectionOrder, setSectionOrder]);


  const loading = productsLoading || authLoading || brandsLoading || orderLoading;

  const sections = useMemo(() => {
    return sectionOrder
      .map(sectionName => {
        switch (sectionName) {
          case 'Más Vendidos':
            return { title: sectionName, products: bestSellers };
          case 'Catálogo Masculino':
            return { title: sectionName, products: maleProducts };
          case 'Catálogo Femenino':
            return { title: sectionName, products: femaleProducts };
          default:
            return { title: sectionName, products: productsByBrand[sectionName] || [] };
        }
      })
      .filter(section => section.products.length > 0 || ['Más Vendidos', 'Catálogo Masculino', 'Catálogo Femenino'].includes(section.title) || brands.includes(section.title));
  }, [sectionOrder, bestSellers, maleProducts, femaleProducts, productsByBrand, brands]);

  return (
    <div className="text-white min-h-screen font-sans antialiased">
      <Header 
        onAdminClick={handleAdminClick} 
        isAuthenticated={isAuthenticated} 
        sections={sectionOrder}
      />
       <main className="container mx-auto px-4 py-8 pt-40">
        {loading ? (
          <div className="fixed inset-0 bg-gray-900 flex justify-center items-center z-[100]">
            <p className="text-xl text-gray-400">Cargando catálogo...</p>
          </div>
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-500">
              Monster Store
            </h1>
            <p className="text-center text-lg text-gray-300 mb-12">
              Dale estilo a tus Pies!
            </p>
            <HeroCarousel products={bestSellers} onProductSelect={handleProductSelect} />
            <div className="space-y-16">
              {sections.map(({ title, products: sectionProducts }) => (
                <ProductList
                  key={title}
                  title={title}
                  products={sectionProducts}
                  onProductSelect={handleProductSelect}
                />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
      {adminView === 'login' && <AdminLogin onClose={handleAdminClose} onLoginSuccess={handleLoginSuccess} login={login} />}
      {adminView === 'panel' && isAuthenticated && (
        <AdminPanel
          onClose={handleAdminClose}
          onLogout={handleLogout}
          products={products}
          brands={brands}
          addBrand={handleAddBrand}
          deleteBrand={handleDeleteBrand}
          sectionOrder={sectionOrder}
          setSectionOrder={setSectionOrder}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          updatePassword={updatePassword}
        />
      )}
    </div>
  );
};

export default App;