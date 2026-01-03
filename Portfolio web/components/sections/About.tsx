import React, { useRef } from 'react';
import { AtelierInfo, ContactType, ContactInfo } from '../../types';
import { Scissors, Ruler, HeartHandshake, Mail, Phone, Camera, Instagram, Trash2, Plus, MessageCircle } from 'lucide-react';

interface AboutProps {
  info: AtelierInfo;
  isEditMode: boolean;
  onUpdate: (field: keyof AtelierInfo, value: any) => void;
  themeColor: string;
  fontClasses: { body: string; handwriting: string };
}

export const About: React.FC<AboutProps> = ({ info, isEditMode, onUpdate, themeColor, fontClasses }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate('aboutImageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddContact = () => {
    const newContact: ContactInfo = {
        id: Date.now().toString(),
        type: 'whatsapp',
        value: ''
    };
    onUpdate('contacts', [...info.contacts, newContact]);
  };

  const handleRemoveContact = (id: string) => {
    onUpdate('contacts', info.contacts.filter(c => c.id !== id));
  };

  const handleChangeContact = (id: string, field: keyof ContactInfo, value: string) => {
    const updatedContacts = info.contacts.map(c => 
        c.id === id ? { ...c, [field]: value } : c
    );
    onUpdate('contacts', updatedContacts);
  };

  const getContactIcon = (type: ContactType) => {
    switch (type) {
        case 'instagram': return <Instagram size={20} className={`text-${themeColor}-500`} />;
        case 'email': return <Mail size={20} className={`text-${themeColor}-500`} />;
        case 'whatsapp': return <MessageCircle size={20} className="text-green-500" />;
        case 'phone': return <Phone size={20} className={`text-${themeColor}-500`} />;
        default: return <Phone size={20} className={`text-${themeColor}-500`} />;
    }
  };

  const getPlaceholder = (type: ContactType) => {
      switch (type) {
          case 'instagram': return '@seu_instagram';
          case 'email': return 'seu@email.com';
          case 'whatsapp': return '(00) 00000-0000';
          case 'phone': return '(00) 0000-0000';
          default: return 'Contato';
      }
  }

  return (
    <div className={`h-full w-full p-8 md:p-16 bg-white flex flex-col justify-center overflow-y-auto no-scrollbar print:overflow-visible print:h-auto`}>
      <div className="grid md:grid-cols-2 gap-12 items-center h-full print:block print:space-y-8">
        
        {/* Left: Text Content */}
        <div className="order-2 md:order-1 space-y-6">
          <div>
            <h2 className={`${fontClasses.handwriting} text-5xl text-${themeColor}-400 mb-6`}>Sobre o Ateliê</h2>
            {isEditMode ? (
              <textarea
                value={info.aboutText}
                onChange={(e) => onUpdate('aboutText', e.target.value)}
                className={`w-full h-48 p-4 ${fontClasses.body} text-lg text-gray-600 bg-gray-50 border border-${themeColor}-200 rounded-lg focus:ring-2 focus:ring-${themeColor}-300 outline-none resize-none`}
              />
            ) : (
              <p className={`text-lg md:text-xl text-gray-600 leading-relaxed text-justify ${fontClasses.body}`}>
                {info.aboutText}
              </p>
            )}
          </div>

          {/* Contact Info - Dynamic List */}
          <div className={`bg-${themeColor}-50/50 p-4 rounded-xl border border-${themeColor}-100 space-y-3 print:border-none print:bg-transparent print:p-0`}>
             {info.contacts.map((contact) => (
                 <div key={contact.id} className="flex items-center gap-3 text-gray-600">
                    <div className="shrink-0 flex items-center justify-center w-8">
                        {getContactIcon(contact.type)}
                    </div>
                    
                    {isEditMode ? (
                        <div className="flex-1 flex gap-2">
                            <select
                                value={contact.type}
                                onChange={(e) => handleChangeContact(contact.id, 'type', e.target.value as ContactType)}
                                className={`bg-white border border-${themeColor}-200 rounded px-2 py-1 text-sm focus:outline-none text-gray-600 ${fontClasses.body}`}
                            >
                                <option value="whatsapp">WhatsApp</option>
                                <option value="instagram">Instagram</option>
                                <option value="email">Email</option>
                                <option value="phone">Telefone</option>
                            </select>
                            <input 
                                type="text"
                                value={contact.value}
                                onChange={(e) => handleChangeContact(contact.id, 'value', e.target.value)}
                                className={`flex-1 bg-white border border-${themeColor}-200 rounded px-2 py-1 text-base focus:outline-none focus:border-${themeColor}-400 text-gray-600 ${fontClasses.body}`}
                                placeholder={getPlaceholder(contact.type)}
                            />
                            <button 
                                onClick={() => handleRemoveContact(contact.id)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ) : (
                        <span className={`text-base font-medium ${fontClasses.body}`}>{contact.value}</span>
                    )}
                 </div>
             ))}

             {isEditMode && (
                 <button 
                    onClick={handleAddContact}
                    className={`w-full py-2 border border-dashed border-${themeColor}-300 text-${themeColor}-500 rounded-lg hover:bg-${themeColor}-50 flex items-center justify-center gap-2 font-semibold text-sm transition-colors mt-2 ${fontClasses.body}`}
                 >
                     <Plus size={16} /> Adicionar Contato
                 </button>
             )}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 print:hidden">
             <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-3 bg-${themeColor}-100 rounded-full text-${themeColor}-500`}>
                    <Scissors size={24} />
                </div>
                <span className={`text-sm font-bold text-gray-500 uppercase tracking-wider ${fontClasses.body}`}>Artesanal</span>
             </div>
             <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-blue-100 rounded-full text-blue-500">
                    <Ruler size={24} />
                </div>
                <span className={`text-sm font-bold text-gray-500 uppercase tracking-wider ${fontClasses.body}`}>Exclusivo</span>
             </div>
             <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                    <HeartHandshake size={24} />
                </div>
                <span className={`text-sm font-bold text-gray-500 uppercase tracking-wider ${fontClasses.body}`}>Afetivo</span>
             </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="order-1 md:order-2 h-full min-h-[300px] relative group print:mb-8 print:h-64">
            <div className={`absolute inset-4 border-2 border-dashed border-${themeColor}-300 rounded-2xl z-10 pointer-events-none print:hidden`}></div>
            <div className={`absolute inset-0 bg-${themeColor}-50 rounded-2xl transform rotate-2 pointer-events-none print:hidden`}></div>
            <div className="absolute inset-0 bg-blue-50 rounded-2xl transform -rotate-2 pointer-events-none print:hidden"></div>
            
            <div 
                className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-lg z-20 bg-gray-100 ${isEditMode ? `cursor-pointer hover:ring-4 ring-${themeColor}-200 transition-all` : ''}`}
                onClick={() => isEditMode && fileInputRef.current?.click()}
            >
                <img 
                    src={info.aboutImageUrl || "https://picsum.photos/seed/atelierworkspace/800/600"} 
                    alt="Espaço de trabalho" 
                    className="w-full h-full object-cover"
                />
                
                {isEditMode && (
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white flex-col">
                        <Camera size={48} />
                        <span className="font-bold mt-2">Alterar Imagem</span>
                    </div>
                )}
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
            />
        </div>
      </div>
    </div>
  );
};