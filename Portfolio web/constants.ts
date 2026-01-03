import { AtelierInfo, Product } from './types';

export const INITIAL_CATEGORIES = [
  'Cadernos & Planners',
  'Bloquinhos & Kits',
  'Painéis em EVA'
];

export const INITIAL_INFO: AtelierInfo = {
  name: "Sonhos de Papel",
  subtitle: "Papelaria personalizada feita com amor em cada detalhe",
  aboutText: "Bem-vindo ao nosso mundo de criatividade! Cada peça produzida em nosso ateliê carrega uma história única. Trabalhamos com materiais de alta qualidade e um processo artesanal minucioso para transformar papel em memórias afetivas. Do planejamento do dia a dia aos presentes mais especiais, estamos aqui para encantar.",
  aboutImageUrl: "https://picsum.photos/seed/atelierworkspace/800/600",
  contacts: [
    { id: '1', type: 'email', value: 'contato@sonhosdepapel.com.br' },
    { id: '2', type: 'whatsapp', value: '(11) 99999-9999' },
    { id: '3', type: 'instagram', value: '@sonhosdepapel_atelie' }
  ],
  themeColor: 'pink',
  fontTheme: 'afetivo',
  showDecorations: true,
  leftDecorationUrl: "",
  rightDecorationUrl: ""
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "Planner Floral 2024",
    description: "Capa dura laminada, miolo colorido 90g, bolso interno e cartela de adesivos. Personalizável com seu nome.",
    price: 89.90,
    category: 'Cadernos & Planners',
    images: [
      "https://picsum.photos/seed/planner1/600/600",
      "https://picsum.photos/seed/planner1detail/600/600"
    ]
  },
  {
    id: '2',
    name: "Agenda Diária Clean",
    description: "Design minimalista para organizar sua rotina. Acabamento em wire-o bronze e elástico para fechamento.",
    price: 65.00,
    category: 'Cadernos & Planners',
    images: ["https://picsum.photos/seed/agenda2/600/600"]
  },
  {
    id: '3',
    name: "Kit Bloquinhos Doce",
    description: "Trio de bloquinhos A6 com folhas destacáveis. Ideal para listas de compras e anotações rápidas.",
    price: 25.00,
    category: 'Bloquinhos & Kits',
    images: ["https://picsum.photos/seed/blocks3/600/600"]
  },
  {
    id: '4',
    name: "Painel Sala de Aula",
    description: "Painel decorativo em EVA tema 'Jardim Encantado'. Cores vibrantes e corte preciso. 1m x 60cm.",
    price: 45.90,
    category: 'Painéis em EVA',
    images: ["https://picsum.photos/seed/eva4/600/600"]
  },
];