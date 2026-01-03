import React, { useState } from 'react';
import { SetupFormData } from '../types';

interface SetupScreenProps {
  onSetupComplete: (data: SetupFormData) => void;
  isLoading: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete, isLoading }) => {
  const [formData, setFormData] = useState<SetupFormData>({
    storeName: '',
    theme: '',
    phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.storeName && formData.theme) {
      onSetupComplete(formData);
    }
  };

  const examples = [
    { name: "Padaria da Esquina", theme: "Pães artesanais e doces finos" },
    { name: "Surf Vibe", theme: "Equipamentos de surf e moda praia" },
    { name: "TechZone", theme: "Acessórios para celular e gadgets" }
  ];

  const fillExample = (ex: typeof examples[0]) => {
    setFormData(prev => ({ ...prev, storeName: ex.name, theme: ex.theme }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden border border-white/50">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Crie sua Loja Digital
            </h1>
            <p className="text-gray-500">
              Defina o tema e a nossa IA montará o catálogo completo com fotos e descrições em segundos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Ex: Doceria da Ana"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">O que você vende? (Tema)</label>
              <input
                type="text"
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                placeholder="Ex: Bolos caseiros, Roupas femininas..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (para receber pedidos)</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Ex: 11999999999"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Opcional. Se vazio, o cliente precisará digitar.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.storeName || !formData.theme}
              className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl active:scale-[0.98]'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando Catálogo com IA...
                </span>
              ) : 'Criar Minha Loja'}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-center text-xs text-gray-400 uppercase tracking-wider mb-3">Ou tente um exemplo</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => fillExample(ex)}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-600 transition-colors"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};