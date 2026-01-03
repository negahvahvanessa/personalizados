import React, { useState, useRef, useEffect } from 'react';
import { Product, AtelierInfo } from '../../types';
import { Plus, Trash2, X, Image as ImageIcon, ChevronLeft, ChevronRight, Phone, Check, Camera, Sparkles, Loader2, MessageCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ProductCatalogProps {
  products: Product[];
  categories: string[];
  atelierInfo: AtelierInfo;
  isEditMode: boolean;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: () => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
  themeColor: string;
  fontClasses: { body: string; handwriting: string };
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories,
  atelierInfo,
  isEditMode,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  themeColor,
  fontClasses
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadSlotIndex, setUploadSlotIndex] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  useEffect(() => {
    if (categories.length > 0 && (!activeCategory || !categories.includes(activeCategory))) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredProducts = products.filter(p => p.category === activeCategory);

  const PALETTE = [
    'bg-pink-100 text-pink-700 hover:bg-pink-200',
    'bg-blue-100 text-blue-700 hover:bg-blue-200',
    'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    'bg-green-100 text-green-700 hover:bg-green-200',
    'bg-purple-100 text-purple-700 hover:bg-purple-200',
    'bg-orange-100 text-orange-700 hover:bg-orange-200'
  ];

  const getColor = (index: number) => PALETTE[index % PALETTE.length];

  const openProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setGalleryIndex(0);
  };

  const closeProduct = () => {
    setSelectedProductId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct || uploadSlotIndex === null) return;
    
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...selectedProduct.images];
        newImages[uploadSlotIndex] = reader.result as string;
        onUpdateProduct({ ...selectedProduct, images: newImages });
        setGalleryIndex(uploadSlotIndex);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    if (!selectedProduct) return;
    const newImages = selectedProduct.images.filter((_, i) => i !== indexToRemove);
    onUpdateProduct({ ...selectedProduct, images: newImages });
    if (galleryIndex >= newImages.length) setGalleryIndex(Math.max(0, newImages.length - 1));
  };

  const triggerUpload = (slotIndex: number) => {
    setUploadSlotIndex(slotIndex);
    setTimeout(() => {
        fileInputRef.current?.click();
    }, 50);
  };

  const saveNewCategory = () => {
    if (newCategoryName.trim()) {
        onAddCategory(newCategoryName.trim());
        setNewCategoryName("");
        setIsAddingCategory(false);
    }
  };

  // Refactored to accept a product argument
  const handleOrder = (productToOrder: Product) => {
    const whatsappContact = atelierInfo.contacts.find(c => c.type === 'whatsapp');
    
    if (whatsappContact && whatsappContact.value) {
        const cleanNumber = whatsappContact.value.replace(/\D/g, '');
        const finalNumber = (cleanNumber.length === 10 || cleanNumber.length === 11) 
            ? `55${cleanNumber}` 
            : cleanNumber;

        const message = `Olá! Gostaria de encomendar o produto: *${productToOrder.name}* (Preço: R$ ${productToOrder.price.toFixed(2)}). Poderia me passar mais informações?`;
        const url = `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(url, '_blank');
    } else {
        alert("Número de WhatsApp não configurado no ateliê.");
    }
  };

  const handleImproveDescription = async () => {
    if (!selectedProduct) return;
    
    if (!selectedProduct.name || selectedProduct.name.trim() === "" || selectedProduct.name === "Novo Produto") {
        alert("Por favor, dê um nome ao produto antes de gerar a descrição.");
        return;
    }

    setIsGenerating(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Você é um especialista em marketing para papelaria personalizada artesanal.
        Escreva uma descrição atraente, curta (máximo 3 frases) e vendedora para um produto chamado: "${selectedProduct.name}".
        Use um tom de voz delicado, afetivo e profissional. Destaque o carinho e a exclusividade.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        const newDescription = response.text?.trim();
        
        if (newDescription) {
            onUpdateProduct({ ...selectedProduct, description: newDescription });
        }
    } catch (error) {
        console.error("Error generating description:", error);
        alert("Ocorreu um erro ao gerar a descrição. Tente novamente.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="h-full w-full p-8 flex flex-col bg-white">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-4 no-print">
        <h2 className={`${fontClasses.handwriting} text-4xl text-gray-800 mb-4 md:mb-0`}>Nossos Produtos</h2>
        <div className="flex gap-2 flex-wrap justify-center items-center">
          {categories.map((cat, idx) => (
            <div key={cat} className="relative group/cat">
                <button
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        activeCategory === cat
                        ? getColor(idx) + ' shadow-md scale-105'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    } ${fontClasses.body}`}
                >
                    {cat}
                </button>
                {isEditMode && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCategory(cat);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity shadow-sm z-10"
                        title="Remover categoria"
                    >
                        <X size={12} />
                    </button>
                )}
            </div>
          ))}

          {isEditMode && (
            isAddingCategory ? (
                <div className={`flex items-center gap-1 bg-white border border-${themeColor}-200 rounded-full pl-3 pr-1 py-1 shadow-sm animate-in fade-in zoom-in duration-200`}>
                    <input 
                        type="text" 
                        autoFocus
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Nova Categoria"
                        className={`text-sm outline-none text-gray-700 w-32 bg-transparent ${fontClasses.body}`}
                        onKeyDown={(e) => e.key === 'Enter' && saveNewCategory()}
                    />
                    <button 
                        onClick={saveNewCategory}
                        className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600"
                    >
                        <Check size={14} />
                    </button>
                    <button 
                        onClick={() => setIsAddingCategory(false)}
                        className="bg-gray-200 text-gray-500 rounded-full p-1 hover:bg-gray-300"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsAddingCategory(true)}
                    className={`px-3 py-2 rounded-full bg-${themeColor}-50 text-${themeColor}-500 border border-dashed border-${themeColor}-300 hover:bg-${themeColor}-100 hover:border-${themeColor}-400 transition-colors flex items-center gap-1 text-sm font-semibold`}
                >
                    <Plus size={16} /> <span className="hidden sm:inline">Nova</span>
                </button>
            )
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-2 print:overflow-visible">
        {categories.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>Nenhuma categoria encontrada.</p>
                {isEditMode && <p className="text-sm mt-2">Adicione uma categoria acima para começar.</p>}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-3">
            {filteredProducts.map((product) => (
                <div 
                    key={product.id} 
                    className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col h-full cursor-pointer break-inside-avoid"
                    onClick={() => openProduct(product)}
                >
                {isEditMode && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setProductToDelete(product.id);
                        }}
                        className="absolute -top-2 -right-2 z-20 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
                    >
                        <Trash2 size={16} />
                    </button>
                )}

                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-50">
                    {product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={48} />
                        </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center no-print">
                        <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow opacity-0 group-hover:opacity-100 transition-opacity">
                            {isEditMode ? 'Editar Detalhes' : 'Ver Mais'}
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col pointer-events-none">
                    <h3 className={`font-bold text-lg text-gray-800 mb-1 ${fontClasses.body}`}>{product.name}</h3>
                    <p className={`text-sm text-gray-500 mb-4 flex-1 leading-snug line-clamp-2 ${fontClasses.body}`}>{product.description}</p>
                    
                    {/* Updated Footer Layout */}
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center pointer-events-auto">
                        <span className={`${fontClasses.handwriting} text-2xl text-${themeColor}-600`}>
                            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        
                        {!isEditMode && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOrder(product);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm flex items-center gap-1 transition-colors"
                            >
                                <MessageCircle size={16} />
                                Encomendar
                            </button>
                        )}
                        {isEditMode && (
                             <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Valor</span>
                        )}
                    </div>
                </div>
                </div>
            ))}

            {isEditMode && (
                <button 
                    onClick={onAddProduct}
                    className={`border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-8 text-gray-400 hover:text-${themeColor}-500 hover:border-${themeColor}-300 hover:bg-${themeColor}-50 transition-all min-h-[300px] no-print`}
                >
                    <Plus size={48} />
                    <span className="mt-2 font-semibold">Adicionar Produto</span>
                </button>
            )}
            </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm no-print">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={24} />
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 mb-2">Excluir Produto?</h3>
                    <p className="text-gray-500">
                        Você tem certeza que deseja remover este item? Esta ação não pode ser desfeita.
                    </p>
                </div>
                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={() => setProductToDelete(null)}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => {
                            onDeleteProduct(productToDelete);
                            setProductToDelete(null);
                        }}
                        className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors"
                    >
                        Sim, Excluir
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm no-print">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative animate-in fade-in zoom-in duration-200">
                
                <button 
                    onClick={closeProduct} 
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 text-gray-600"
                >
                    <X size={24} />
                </button>

                {/* Left: Gallery */}
                <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col">
                    <div className="aspect-square w-full rounded-xl overflow-hidden shadow-inner bg-white relative mb-4 flex items-center justify-center group">
                        {selectedProduct.images.length > 0 ? (
                            <img 
                                src={selectedProduct.images[galleryIndex] || selectedProduct.images[0]} 
                                alt={selectedProduct.name} 
                                className="w-full h-full object-contain" 
                            />
                        ) : (
                            <div className="text-gray-300 flex flex-col items-center">
                                <ImageIcon size={64} />
                                <span className="text-sm mt-2">Sem imagem</span>
                            </div>
                        )}

                        {!isEditMode && selectedProduct.images.length > 1 && (
                            <>
                                <button 
                                    onClick={() => setGalleryIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white text-gray-600"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button 
                                    onClick={() => setGalleryIndex((prev) => (prev + 1) % selectedProduct.images.length)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white text-gray-600"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-5 gap-2 mt-auto">
                        {isEditMode ? (
                            Array.from({ length: 10 }).map((_, idx) => {
                                const hasImage = idx < selectedProduct.images.length;
                                const isNextSlot = idx === selectedProduct.images.length;

                                return (
                                    <div 
                                        key={idx} 
                                        className={`
                                            aspect-square rounded-lg border-2 relative flex flex-col items-center justify-center overflow-hidden transition-all duration-200
                                            ${isNextSlot 
                                                ? `border-${themeColor}-400 border-dashed bg-${themeColor}-50 cursor-pointer hover:bg-${themeColor}-100 scale-100 active:scale-95` 
                                                : 'border-gray-200 bg-white'
                                            }
                                            ${!hasImage && !isNextSlot ? 'opacity-40 bg-gray-50' : ''}
                                        `}
                                        onClick={() => isNextSlot && triggerUpload(selectedProduct.images.length)}
                                    >
                                        {hasImage ? (
                                            <div className="relative w-full h-full group">
                                                <img 
                                                    src={selectedProduct.images[idx]} 
                                                    className="w-full h-full object-cover" 
                                                    alt={`Slot ${idx}`}
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(idx);
                                                    }}
                                                    className="absolute top-0 right-0 m-0.5 bg-white text-red-500 p-0.5 rounded-full shadow border border-red-100 hover:bg-red-50 hover:scale-110 transition-all z-10"
                                                    title="Remover imagem"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={`flex flex-col items-center justify-center ${isNextSlot ? `text-${themeColor}-500` : 'text-gray-300'}`}>
                                                <Plus size={isNextSlot ? 20 : 16} strokeWidth={isNextSlot ? 3 : 2} />
                                                {isNextSlot && <span className="text-[8px] font-bold uppercase mt-0.5">Add</span>}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            selectedProduct.images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setGalleryIndex(idx)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${galleryIndex === idx ? `border-${themeColor}-400 shadow-md scale-105` : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                                </button>
                            ))
                        )}
                    </div>
                    {isEditMode && (
                        <p className="text-xs text-gray-400 mt-2 text-center">Adicione até 10 imagens.</p>
                    )}
                </div>

                {/* Right: Info / Form */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    {isEditMode ? (
                        <>
                            <label className="text-xs text-gray-400 font-bold uppercase mb-1">Nome do Produto</label>
                            <input 
                                className={`${fontClasses.handwriting} text-3xl text-gray-800 mb-4 border-b border-gray-200 focus:border-${themeColor}-400 outline-none w-full`}
                                value={selectedProduct.name}
                                onChange={(e) => onUpdateProduct({...selectedProduct, name: e.target.value})}
                            />
                            
                            <label className="text-xs text-gray-400 font-bold uppercase mb-1">Descrição</label>
                            <div className="relative w-full">
                                <textarea 
                                    className={`text-base text-gray-600 mb-6 flex-1 border border-gray-200 rounded p-3 focus:ring-1 focus:ring-${themeColor}-200 outline-none w-full resize-none min-h-[150px] ${fontClasses.body}`}
                                    value={selectedProduct.description}
                                    onChange={(e) => onUpdateProduct({...selectedProduct, description: e.target.value})}
                                />
                                <button
                                    className={`absolute top-0 right-0 -mt-3 -mr-3 bg-${themeColor}-400 text-white p-1.5 rounded-full shadow-md hover:scale-110 transition-transform z-10 flex items-center justify-center ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
                                    title="Melhorar com IA"
                                    type="button"
                                    onClick={handleImproveDescription}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                </button>
                            </div>

                            <label className="text-xs text-gray-400 font-bold uppercase mb-1">Preço</label>
                            <div className="flex items-center mb-6">
                                <span className={`text-${themeColor}-600 font-bold mr-2 text-xl`}>R$</span>
                                <input 
                                    type="number"
                                    step="0.01"
                                    className={`${fontClasses.handwriting} text-4xl text-${themeColor}-600 w-full border-b border-${themeColor}-100 focus:border-${themeColor}-400 outline-none`}
                                    value={selectedProduct.price}
                                    onChange={(e) => onUpdateProduct({...selectedProduct, price: parseFloat(e.target.value) || 0})}
                                />
                            </div>

                             <label className="text-xs text-gray-400 font-bold uppercase mb-1">Categoria</label>
                             <div className="flex gap-2 flex-wrap">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => onUpdateProduct({...selectedProduct, category: cat})}
                                        className={`px-3 py-1 rounded text-xs border ${selectedProduct.category === cat ? `bg-${themeColor}-100 border-${themeColor}-300 text-${themeColor}-700` : 'bg-white border-gray-200 text-gray-500'} ${fontClasses.body}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                             </div>
                        </>
                    ) : (
                        <>
                            <h2 className={`${fontClasses.handwriting} text-4xl text-gray-800 mb-4`}>{selectedProduct.name}</h2>
                            <p className={`text-lg text-gray-600 leading-relaxed mb-8 flex-1 ${fontClasses.body}`}>
                                {selectedProduct.description}
                            </p>
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Investimento</span>
                                        <span className={`${fontClasses.handwriting} text-5xl text-${themeColor}-500`}>
                                            {selectedProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleOrder(selectedProduct)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        <Phone size={20} />
                                        Encomendar
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};