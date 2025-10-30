import React, { useState } from 'react';
import { CloseIcon } from './ui/Icons';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AdminLoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  login: (identifier: string, pass: string) => Promise<{ error: Error | null }>;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onLoginSuccess, login }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Si el usuario es "admin", lo traducimos al email requerido por Supabase.
    const loginIdentifier = username.toLowerCase() === 'admin' ? 'admin@kicks.com' : username;

    const { error: loginError } = await login(loginIdentifier, password);
    setLoading(false);

    if (loginError) {
      setError('Usuario o contraseña incorrectos.');
    } else {
      onLoginSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-8 animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Acceso Admin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
          <div className="space-y-4">
            <Input 
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input 
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  );
};