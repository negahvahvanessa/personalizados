import React, { memo } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  accentColor: string;
}

export const ProductCard = memo(({ product, onAddToCart, accentColor }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100 group">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          <button
            onClick={() => onAddToCart(product)}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-200 active:scale-95`}
            style={{ backgroundColor: accentColor }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';