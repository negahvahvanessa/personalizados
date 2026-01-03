export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export type ContactType = 'email' | 'whatsapp' | 'instagram' | 'phone';

export interface ContactInfo {
  id: string;
  type: ContactType;
  value: string;
}

export type FontTheme = 'afetivo' | 'elegante' | 'moderno';

export interface AtelierInfo {
  name: string;
  subtitle: string;
  aboutText: string;
  aboutImageUrl?: string;
  logoUrl?: string;
  leftDecorationUrl?: string;
  rightDecorationUrl?: string;
  contacts: ContactInfo[];
  themeColor: string;
  fontTheme: FontTheme;
  showDecorations: boolean;
}

export interface AppState {
  info: AtelierInfo;
  products: Product[];
  categories: string[];
  isEditMode: boolean;
}