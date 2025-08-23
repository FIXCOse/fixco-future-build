// AI Chat Types and Interfaces

export type ChatMode = 'chat' | 'form' | 'calculator' | 'booking';

export type Intent = 
  | 'service_request'
  | 'pricing_inquiry' 
  | 'rot_rut_question'
  | 'booking_request'
  | 'emergency'
  | 'general_faq'
  | 'handoff';

export interface ChatIntent {
  type: Intent;
  confidence: number;
  slots: Record<string, any>;
  data?: any;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  intent?: ChatIntent;
  attachments?: ChatAttachment[];
  metadata?: Record<string, any>;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'document';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface ConversationSlot {
  name: string;
  value: any;
  confidence: number;
  required: boolean;
  filled: boolean;
}

export interface ConversationState {
  intent?: ChatIntent;
  slots: Record<string, ConversationSlot>;
  mode: ChatMode;
  context: Record<string, any>;
  leadData: LeadData;
  calculatorData: CalculatorData;
  bookingData: BookingData;
}

export interface LeadData {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  address?: string;
  service?: string;
  description?: string;
  images?: ChatAttachment[];
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
  preferredContact?: 'phone' | 'email' | 'whatsapp' | 'sms';
  consent: {
    dataProcessing?: boolean;
    marketing?: boolean;
    imageStorage?: boolean;
  };
}

export interface CalculatorData {
  service?: any;
  quantity?: number;
  location?: 'inomhus' | 'utomhus' | 'båda';
  complexity?: 'enkel' | 'normal' | 'komplex';
  priceMode?: 'all' | 'rot' | 'rut';
  results?: PriceCalculation;
}

export interface PriceCalculation {
  basePrice: number;
  laborCost: number;
  materialCost: number;
  discount: number;
  finalPrice: number;
  savings: number;
  savingsPercent: number;
  timeEstimate: string;
  eligibility: {
    rot: boolean;
    rut: boolean;
  };
}

export interface BookingData {
  selectedDate?: Date;
  selectedTime?: string;
  availableSlots?: TimeSlot[];
  confirmedSlot?: TimeSlot;
}

export interface TimeSlot {
  id: string;
  date: Date;
  time: string;
  available: boolean;
  type: 'morning' | 'afternoon' | 'evening';
}

export interface KnowledgeItem {
  id: string;
  type: 'service' | 'faq' | 'policy' | 'rule';
  title: string;
  content: string;
  category: string;
  keywords: string[];
  metadata: Record<string, any>;
}

export interface SearchResult {
  item: KnowledgeItem;
  score: number;
  relevance: number;
}