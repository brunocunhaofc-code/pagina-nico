
import React, { useState } from 'react';
import type { Product } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { CloseIcon, EditIcon, DeleteIcon, AddIcon } from './ui/Icons';
import { ProductForm } from './ProductForm';

// A simple component with up/down buttons for reordering.
const OrderableList: React.FC<{ items: string[], setItems: (items: string[]) => void }> = ({ items, setItems }) => {
    
    const move = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        const item = newItems[index];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (swapIndex < 0 || swapIndex >= newItems.length) return;

        newItems.splice(index, 1);
        newItems.splice(swapIndex, 0, item);
        setItems(newItems);
    };

    return (
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li key={item} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                    <span>{item}</span>
                    <div className="space-x-2">
                        <button onClick={() => move(index, 'up')} disabled={index === 0} className="disabled:opacity-50">↑</button>
                        <button onClick={() => move(index, 'down')} disabled={index === items.length - 1} className="disabled:opacity-50">↓</button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

interface AdminPanelProps {
    onClose: () => void;
    onLogout: () => void;
    products: Product[];
    brands: string[];
    addBrand: (brandName: string) => Promise<{ error: Error | null }>;
    deleteBrand: (brandName: string) => Promise<{ error: Error | null }>;
    sectionOrder: string[];
    setSectionOrder: (newOrder: string[]) => Promise<void>;
    addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product | null>;
    updateProduct: (product: Product) => Promise<Product | null>;
    deleteProduct: (productId: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

type ActiveTab = 'products' | 'brands' | 'order' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('products');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Brands state
    const [newBrand, setNewBrand] = useState('');
    const [brandError, setBrandError] = useState('');

    // Section order state
    const [localSectionOrder, setLocalSectionOrder] = useState(props.sectionOrder);

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    
    const handleAddProductClick = () => {
        setEditingProduct(null);
        setShowProductForm(true);
    };

    const handleEditProductClick = (product: Product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };
    
    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            await props.deleteProduct(productId);
        }
    };

    const handleSaveProduct = async (productData: Omit<Product, 'id' | 'created_at'> | Product) => {
        setIsSaving(true);
        if ('id' in productData && productData.id) {
            await props.updateProduct(productData as Product);
        } else {
            await props.addProduct(productData);
        }
        setIsSaving(false);
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        setBrandError('');
        if (!newBrand.trim()) return;
        const { error } = await props.addBrand(newBrand.trim());
        if (error) {
            setBrandError(error.message);
        } else {
            setNewBrand('');
        }
    };
    
    const handleDeleteBrand = async (brandName: string) => {
        setBrandError('');
        if (window.confirm(`¿Estás seguro de que quieres eliminar la marca "${brandName}"?`)) {
            const { error } = await props.deleteBrand(brandName);
            if (error) {
                setBrandError(error.message);
            }
        }
    };
    
    const handleSaveOrder = async () => {
        await props.setSectionOrder(localSectionOrder);
        alert('Orden guardado!');
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });
        if (newPassword.length < 6) {
             setPasswordMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
             return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
            return;
        }
        const { error } = await props.updatePassword(newPassword);
        if (error) {
            setPasswordMessage({ type: 'error', text: `Error: ${error.message}` });
        } else {
            setPasswordMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
            setNewPassword('');
            setConfirmPassword('');
        }
    };
    
    const tabs: { id: ActiveTab, label: string }[] = [
        { id: 'products', label: 'Productos' },
        { id: 'brands', label: 'Marcas' },
        { id: 'order', label: 'Orden Secciones' },
        { id: 'settings', label: 'Ajustes' },
    ];

    const TabButton: React.FC<{ tabId: ActiveTab; label: string }> = ({ tabId, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === tabId ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-fade-in-down">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold">Panel de Administrador</h2>
                    <div className="flex items-center gap-4">
                        <Button onClick={props.onLogout} variant="secondary" className="py-2 px-4">Cerrar Sesión</Button>
                        <button onClick={props.onClose} className="text-gray-400 hover:text-white">
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div className="flex-grow flex flex-col overflow-hidden">
                    <div className="flex border-b border-gray-700 px-4">
                        {tabs.map(tab => <TabButton key={tab.id} tabId={tab.id} label={tab.label} />)}
                    </div>
                    
                    <div className="flex-grow p-6 overflow-y-auto">
                        {activeTab === 'products' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold">Gestionar Productos</h3>
                                    <Button onClick={handleAddProductClick}><AddIcon className="mr-2" /> Nuevo Producto</Button>
                                </div>
                                <div className="bg-gray-800 rounded-lg overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="p-3">Nombre</th>
                                            <th className="p-3">Marca</th>
                                            <th className="p-3">Precio</th>
                                            <th className="p-3">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {props.products.map(p => (
                                        <tr key={p.id} className="border-b border-gray-700 last:border-0">
                                            <td className="p-3">{p.name}</td>
                                            <td className="p-3">{p.brand}</td>
                                            <td className="p-3">${p.price}</td>
                                            <td className="p-3">
                                                <button onClick={() => handleEditProductClick(p)} className="p-2 text-blue-400 hover:text-blue-300"><EditIcon /></button>
                                                <button onClick={() => handleDeleteProduct(p.id!)} className="p-2 text-red-400 hover:text-red-300"><DeleteIcon /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        )}
                        {activeTab === 'brands' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Gestionar Marcas</h3>
                                {brandError && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{brandError}</p>}
                                <form onSubmit={handleAddBrand} className="flex gap-4 mb-6">
                                    <Input value={newBrand} onChange={e => setNewBrand(e.target.value)} placeholder="Nueva marca" className="flex-grow" />
                                    <Button type="submit">Agregar</Button>
                                </form>
                                <ul className="space-y-2">
                                    {props.brands.map(brand => (
                                        <li key={brand} className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                                            <span>{brand}</span>
                                            <button onClick={() => handleDeleteBrand(brand)} className="text-red-400 hover:text-red-300"><DeleteIcon /></button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === 'order' && (
                             <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold">Ordenar Secciones</h3>
                                    <Button onClick={handleSaveOrder}>Guardar Orden</Button>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">Usa las flechas para reordenar las secciones en la página principal.</p>
                                <OrderableList items={localSectionOrder} setItems={setLocalSectionOrder} />
                            </div>
                        )}
                         {activeTab === 'settings' && (
                             <div>
                                <h3 className="text-xl font-semibold mb-4">Cambiar Contraseña</h3>
                                 {passwordMessage.text && <p className={`${passwordMessage.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} p-3 rounded-md mb-4`}>{passwordMessage.text}</p>}
                                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
                                    <Input type="password" placeholder="Nueva Contraseña" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                    <Input type="password" placeholder="Confirmar Nueva Contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                                    <Button type="submit">Actualizar Contraseña</Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showProductForm && (
                <ProductForm
                    product={editingProduct}
                    brands={props.brands}
                    onSave={handleSaveProduct}
                    onCancel={() => setShowProductForm(false)}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
};
