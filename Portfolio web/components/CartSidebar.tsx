import React, { useMemo } from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  storeName: string;
  phoneNumber: string;
  accentColor: string;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  storeName,
  phoneNumber,
  accentColor
}) => {
  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let message = `*Novo Pedido - ${storeName}*\n\n`;
    message += `-------------------------------\n`;
    
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name}\n`;
      message += `${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += `-------------------------------\n`;
    message += `*Total: ${formatPrice(total)}*\n\n`;
    message += `Gostaria de confirmar a disponibilidade e entrega.`;

    const encodedMessage = encodeURIComponent(message);
    // Remove non-numeric chars from phone
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Fallback if no number provided
    const target = cleanPhone ? `https://wa.me/55${cleanPhone}` : `https://wa.me/?`;
    
    window.open(`${target}?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Seu Carrinho
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Seu carrinho está vazio.</p>
              <button 
                onClick={onClose}
                className="text-sm font-semibold underline decoration-2 underline-offset-2"
                style={{ color: accentColor }}
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md bg-gray-100" />
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(item.price)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Total do Pedido</span>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ backgroundColor: '#25D366' }} // Always WhatsApp green for familiarity
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Enviar Pedido no Zap
            </button>
          </div>
        )}
      </div>
    </>
  );
};