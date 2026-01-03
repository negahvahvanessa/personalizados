import React, { useRef, useState } from 'react';
import { AtelierInfo } from '../../types';
import { Sparkles, Heart, Camera, Upload, Pencil, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CoverProps {
  info: AtelierInfo;
  isEditMode: boolean;
  onUpdate: (field: keyof AtelierInfo, value: any) => void;
  themeColor: string;
  fontClasses: { body: string; handwriting: string };
}

export const Cover: React.FC<CoverProps> = ({ info, isEditMode, onUpdate, themeColor, fontClasses }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const leftDecoInputRef = useRef<HTMLInputElement>(null);
  const rightDecoInputRef = useRef<HTMLInputElement>(null);
  
  const [isGeneratingSubtitle, setIsGeneratingSubtitle] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof AtelierInfo) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset input
  };

  const handleGenerateSubtitle = async () => {
    setIsGeneratingSubtitle(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Crie uma frase curta, afetiva, poética e elegante para servir de slogan/subtítulo de um ateliê de papelaria artesanal chamado "${info.name}". 
        A frase deve transmitir carinho, exclusividade e memórias. Máximo de 12 palavras. Responda apenas com a frase.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        const newSubtitle = response.text?.trim().replace(/^"|"$/g, '');
        if (newSubtitle) {
            onUpdate('subtitle', newSubtitle);
        }
    } catch (error) {
        console.error("Error generating subtitle:", error);
        alert("Erro ao gerar frase. Tente novamente.");
    } finally {
        setIsGeneratingSubtitle(false);
    }
  };

  return (
    <div className={`h-full w-full flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-white via-${themeColor}-50 to-white print:border-none`}>
      {/* Decorative Elements (Background) */}
      {info.showDecorations && (
        <>
          <div className={`absolute top-10 left-10 text-${themeColor}-200 opacity-50 animate-pulse`}>
            <Sparkles size={48} />
          </div>
          <div className={`absolute bottom-10 right-10 text-${themeColor}-200 opacity-50 animate-pulse delay-700`}>
            <Heart size={48} fill="currentColor" />
          </div>
        </>
      )}

      {/* Inputs for Decorations */}
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoUrl')} />
      <input type="file" ref={leftDecoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'leftDecorationUrl')} />
      <input type="file" ref={rightDecoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'rightDecorationUrl')} />
      
      {/* Main Content Container with Floating Images */}
      <div className="relative w-full max-w-2xl px-4 flex items-center justify-center">
        
        {/* Left Floating Image */}
        <div className={`absolute left-0 -translate-x-16 md:-translate-x-32 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center justify-center transition-all ${isEditMode ? 'opacity-100' : 'opacity-100'}`}>
             {info.leftDecorationUrl ? (
                 <div className="relative group">
                     <img 
                        src={info.leftDecorationUrl} 
                        alt="Decoração Esquerda" 
                        className="w-32 h-auto max-h-48 object-contain drop-shadow-md transform -rotate-6"
                     />
                     {isEditMode && (
                        <button 
                            onClick={() => onUpdate('leftDecorationUrl', '')}
                            className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={14} />
                        </button>
                     )}
                 </div>
             ) : (
                 isEditMode && (
                    <button 
                        onClick={() => leftDecoInputRef.current?.click()}
                        className={`w-24 h-24 border-2 border-dashed border-${themeColor}-300 rounded-full bg-white/50 flex flex-col items-center justify-center text-${themeColor}-400 hover:bg-${themeColor}-50 transition-colors`}
                        title="Adicionar imagem flutuante"
                    >
                        <ImageIcon size={24} />
                        <span className="text-[10px] font-bold mt-1">Esq.</span>
                    </button>
                 )
             )}
        </div>

        {/* Right Floating Image */}
        <div className={`absolute right-0 translate-x-16 md:translate-x-32 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center justify-center transition-all`}>
             {info.rightDecorationUrl ? (
                 <div className="relative group">
                     <img 
                        src={info.rightDecorationUrl} 
                        alt="Decoração Direita" 
                        className="w-32 h-auto max-h-48 object-contain drop-shadow-md transform rotate-12"
                     />
                     {isEditMode && (
                        <button 
                            onClick={() => onUpdate('rightDecorationUrl', '')}
                            className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={14} />
                        </button>
                     )}
                 </div>
             ) : (
                 isEditMode && (
                    <button 
                        onClick={() => rightDecoInputRef.current?.click()}
                        className={`w-24 h-24 border-2 border-dashed border-${themeColor}-300 rounded-full bg-white/50 flex flex-col items-center justify-center text-${themeColor}-400 hover:bg-${themeColor}-50 transition-colors`}
                        title="Adicionar imagem flutuante"
                    >
                        <ImageIcon size={24} />
                        <span className="text-[10px] font-bold mt-1">Dir.</span>
                    </button>
                 )
             )}
        </div>

        {/* Central Card */}
        <div className={`z-10 w-full px-8 py-12 border-4 border-double border-${themeColor}-200 rounded-3xl bg-white/60 backdrop-blur-sm shadow-xl flex flex-col items-center print:shadow-none print:border-0 relative`}>
            
            <div className="mb-6 flex flex-col items-center justify-center">
                {/* Logo Container */}
                <div 
                    className={`relative w-32 h-32 rounded-full shadow-lg overflow-hidden border-4 border-white flex items-center justify-center bg-gradient-to-tr from-${themeColor}-300 to-${themeColor}-100 ${isEditMode ? 'cursor-pointer hover:shadow-xl transition-shadow group' : ''}`}
                    onClick={() => isEditMode && logoInputRef.current?.click()}
                    title={isEditMode ? "Clique para alterar o logo" : ""}
                >
                    {info.logoUrl ? (
                        <img src={info.logoUrl} alt="Logo do Ateliê" className="w-full h-full object-cover" />
                    ) : (
                        <span className={`${fontClasses.handwriting} text-4xl text-white select-none`}>Logo</span>
                    )}

                    {/* Edit Overlay */}
                    {isEditMode && (
                        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={24} />
                            <span className="text-xs font-semibold mt-1">Alterar</span>
                        </div>
                    )}
                </div>

                {/* Text Helper for empty state in edit mode */}
                {isEditMode && !info.logoUrl && (
                    <button
                        onClick={() => logoInputRef.current?.click()}
                        className={`mt-2 text-xs text-${themeColor}-500 font-semibold hover:text-${themeColor}-600 flex items-center gap-1 no-print`}
                    >
                        <Upload size={12} /> Carregar Logo
                    </button>
                )}
            </div>

            {/* Title Section */}
            <div className="w-full mb-4 relative">
                {isEditMode ? (
                    <div className="relative group">
                        <input
                            type="text"
                            value={info.name}
                            onChange={(e) => onUpdate('name', e.target.value)}
                            className={`w-full text-center ${fontClasses.handwriting} text-6xl md:text-7xl text-gray-800 bg-white/80 border-2 border-dashed border-${themeColor}-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-${themeColor}-100 px-4 py-2 transition-all placeholder-${themeColor}-300`}
                            placeholder="Nome do Ateliê"
                        />
                        <div className={`absolute top-1/2 right-4 -translate-y-1/2 text-${themeColor}-400 pointer-events-none opacity-50`}>
                            <Pencil size={24} />
                        </div>
                    </div>
                ) : (
                    <h1 className={`${fontClasses.handwriting} text-6xl md:text-7xl text-gray-800 text-center drop-shadow-sm px-4 py-2 border-2 border-transparent`}>
                        {info.name}
                    </h1>
                )}
            </div>

            <div className={`h-1 w-32 bg-${themeColor}-300 mx-auto rounded-full mb-6`}></div>

            {/* Subtitle Section */}
            {isEditMode ? (
            <div className="w-full relative">
                <textarea
                    value={info.subtitle}
                    onChange={(e) => onUpdate('subtitle', e.target.value)}
                    className={`w-full text-center ${fontClasses.body} text-xl text-gray-600 bg-white/80 border-2 border-dashed border-${themeColor}-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-${themeColor}-200 resize-none transition-all placeholder-${themeColor}-300`}
                    rows={2}
                    placeholder="Escreva uma frase curta e afetiva..."
                />
                
                {/* AI Improve Button */}
                <button
                    onClick={handleGenerateSubtitle}
                    disabled={isGeneratingSubtitle}
                    className={`absolute -right-3 top-1/2 -translate-y-1/2 bg-${themeColor}-400 hover:bg-${themeColor}-500 text-white p-2 rounded-full shadow-md transition-all hover:scale-110 z-20 flex items-center justify-center`}
                    title="Criar frase afetiva com IA"
                >
                    {isGeneratingSubtitle ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                </button>
            </div>
            ) : (
            <p className={`${fontClasses.body} text-xl md:text-2xl text-gray-600 font-light tracking-wide text-center`}>
                {info.subtitle}
            </p>
            )}
        </div>
      </div>
    </div>
  );
};