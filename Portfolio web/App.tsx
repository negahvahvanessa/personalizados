import React, { useState } from 'react';
import { AtelierInfo, Product, FontTheme } from './types';
import { INITIAL_INFO, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './constants';
import { Cover } from './components/sections/Cover';
import { About } from './components/sections/About';
import { ProductCatalog } from './components/sections/ProductCatalog';
import { Button } from './components/ui/Button';
import { ChevronLeft, ChevronRight, Edit3, Save, Printer, Sparkles, Download, Loader2 } from 'lucide-react';

export default function App() {
  // State
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [info, setInfo] = useState<AtelierInfo>(INITIAL_INFO);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);

  // Constants
  const TOTAL_PAGES = 3; // Cover, About, Catalog
  
  const THEME_COLORS = [
    { name: 'Rosa', value: 'pink', class: 'bg-pink-400' },
    { name: 'Azul', value: 'sky', class: 'bg-sky-400' },
    { name: 'Lilás', value: 'violet', class: 'bg-violet-400' },
    { name: 'Verde', value: 'teal', class: 'bg-teal-400' },
    { name: 'Amarelo', value: 'amber', class: 'bg-amber-400' },
  ];

  const FONTS = [
    { name: 'Afetivo', value: 'afetivo', handwriting: 'font-handwriting-1', body: 'font-body-1' },
    { name: 'Elegante', value: 'elegante', handwriting: 'font-handwriting-2', body: 'font-body-2' },
    { name: 'Moderno', value: 'moderno', handwriting: 'font-handwriting-3', body: 'font-body-3' },
  ];

  const getFontClasses = (theme: FontTheme) => {
    const font = FONTS.find(f => f.value === theme) || FONTS[0];
    return { body: font.body, handwriting: font.handwriting };
  };

  const fontClasses = getFontClasses(info.fontTheme);

  // Handlers
  const handleInfoUpdate = (field: keyof AtelierInfo, value: any) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "Novo Produto",
      description: "Descrição do produto...",
      price: 0.00,
      category: categories.length > 0 ? categories[0] : "",
      images: [] // Initialize with empty images array
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleAddCategory = (name: string) => {
    if (name && !categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
  };

  const handleDeleteCategory = (name: string) => {
    if (window.confirm(`Deseja excluir a categoria "${name}"?`)) {
      setCategories(prev => prev.filter(c => c !== name));
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    // Allow React to render the print layout before triggering print
    setTimeout(() => {
        window.print();
        // Reset after print dialog closes (approximate)
        setTimeout(() => setIsPrinting(false), 500);
    }, 500);
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    setIsPrinting(true); // Force print layout view

    setTimeout(() => {
        const element = document.getElementById('content-to-print');
        const opt = {
            margin: 0,
            filename: `${info.name.replace(/\s+/g, '_')}_Portfolio.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        // @ts-ignore
        if (window.html2pdf) {
            // @ts-ignore
            window.html2pdf().set(opt).from(element).save().then(() => {
                setIsPrinting(false);
                setIsGeneratingPdf(false);
            }).catch((err: any) => {
                console.error("PDF Generation Error", err);
                setIsPrinting(false);
                setIsGeneratingPdf(false);
                alert("Erro ao gerar PDF. Tente usar a opção de Imprimir > Salvar como PDF.");
            });
        } else {
            alert("Biblioteca PDF não carregada. Tente recarregar a página.");
            setIsPrinting(false);
            setIsGeneratingPdf(false);
        }
    }, 1000); // Wait for images to render in the print layout
  };

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, TOTAL_PAGES - 1));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));

  // Render Page Content
  const renderPage = (pageIndex: number) => {
    const props = {
        info,
        isEditMode: isEditMode && !isPrinting,
        onUpdate: handleInfoUpdate,
        themeColor: info.themeColor || 'pink',
        fontClasses
    };

    switch(pageIndex) {
        case 0: return <Cover {...props} />;
        case 1: return <About {...props} />;
        case 2: return <ProductCatalog 
                    products={products} 
                    categories={categories}
                    atelierInfo={info}
                    isEditMode={isEditMode && !isPrinting} 
                    onUpdateProduct={handleProductUpdate}
                    onAddProduct={handleAddProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onAddCategory={handleAddCategory}
                    onDeleteCategory={handleDeleteCategory}
                    themeColor={info.themeColor || 'pink'}
                    fontClasses={fontClasses}
                />;
        default: return <Cover {...props} />;
    }
  };

  const currentTheme = info.themeColor || 'pink';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-${currentTheme}-50/30 transition-colors duration-500 print:bg-white print:p-0 print:block`}>
      
      {/* Top Controls - Hidden during print */}
      <div className="fixed top-4 right-4 z-50 flex flex-wrap items-center gap-2 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm border border-gray-100 max-w-[90vw] justify-end no-print">
        
        {isEditMode && (
             <div className="flex items-center gap-3 mr-2 border-r border-gray-200 pr-4 flex-wrap">
                {/* Font Selector */}
                <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Fonte:</span>
                    <select 
                        value={info.fontTheme}
                        onChange={(e) => handleInfoUpdate('fontTheme', e.target.value)}
                        className="text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none text-gray-600 focus:border-pink-300"
                    >
                        {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                </div>

                {/* Decorations Toggle */}
                <button 
                    onClick={() => handleInfoUpdate('showDecorations', !info.showDecorations)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${info.showDecorations ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                    title="Alternar elementos decorativos"
                >
                    <Sparkles size={14} />
                </button>

                {/* Color Selector */}
                <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Cor:</span>
                    <div className="flex gap-1">
                        {THEME_COLORS.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => handleInfoUpdate('themeColor', color.value)}
                                className={`w-5 h-5 rounded-full ${color.class} transition-all hover:scale-110 ${currentTheme === color.value ? 'ring-2 ring-offset-2 ring-gray-300 scale-110' : 'opacity-70 hover:opacity-100'}`}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
             </div>
        )}

        <div className="flex items-center gap-2 border-r border-gray-200 pr-2 mr-2">
            <Button 
                variant="secondary"
                size="sm"
                onClick={handleDownloadPDF}
                themeColor={currentTheme}
                disabled={isGeneratingPdf}
                title="Baixar arquivo PDF"
            >
                {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                <span className="hidden sm:inline">Baixar PDF</span>
            </Button>

            <Button 
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                themeColor={currentTheme}
                title="Imprimir"
            >
                <Printer size={18} /> <span className="hidden sm:inline">Imprimir</span>
            </Button>
        </div>

        <Button 
            variant={isEditMode ? "primary" : "secondary"} 
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            themeColor={currentTheme}
        >
            {isEditMode ? <><Save size={18} /> Salvar</> : <><Edit3 size={18} /> Editar</>}
        </Button>
      </div>

      {/* Main "Paper" Container */}
      {/* Logic: If Printing, we render ALL pages stacked. If not, we render the Slider. */}
      
      {isPrinting ? (
        <div id="content-to-print" className="w-full bg-white print:block">
            {[0, 1, 2].map((pageIndex) => (
                <div key={pageIndex} className="w-full h-screen page-break print-auto-height relative overflow-hidden mb-4 border-b-2 border-dashed border-gray-100 last:border-0">
                    <div className="aspect-[1.414/1] w-full max-w-[1123px] mx-auto bg-white relative">
                        {renderPage(pageIndex)}
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="relative w-full max-w-[1123px] aspect-[1.414/1] bg-white rounded shadow-2xl overflow-hidden transition-all duration-500 ease-in-out no-print">
            
            {/* Page Content */}
            <div className="absolute inset-0">
                {renderPage(currentPage)}
            </div>

            {/* Navigation Overlay (Bottom) */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8 pointer-events-none">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 0}
                    className={`pointer-events-auto p-3 rounded-full bg-white shadow-lg text-${currentTheme}-500 hover:bg-${currentTheme}-50 transition-all ${currentPage === 0 ? 'opacity-0' : 'opacity-100'}`}
                >
                    <ChevronLeft size={24} />
                </button>
                
                <div className="bg-white/90 px-4 py-1 rounded-full text-sm font-medium text-gray-400 shadow-sm pointer-events-auto backdrop-blur-sm">
                    Página {currentPage + 1} de {TOTAL_PAGES}
                </div>

                <button 
                    onClick={nextPage} 
                    disabled={currentPage === TOTAL_PAGES - 1}
                    className={`pointer-events-auto p-3 rounded-full bg-white shadow-lg text-${currentTheme}-500 hover:bg-${currentTheme}-50 transition-all ${currentPage === TOTAL_PAGES - 1 ? 'opacity-0' : 'opacity-100'}`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
      )}
      
      {/* Footer Info */}
      {!isPrinting && (
        <div className={`mt-8 text-center text-${currentTheme}-800/60 text-sm font-light no-print`}>
            <p>© {new Date().getFullYear()} {info.name}. Todos os direitos reservados.</p>
        </div>
      )}
    </div>
  );
}