// Advanced Conversation State Management
import { ConversationState, ChatIntent, Message, LeadData, CalculatorData, BookingData } from './types';
import { intentEngine } from './IntentEngine';
import { knowledgeBase } from './KnowledgeBase';
import { calcDisplayPrice } from '@/utils/priceCalculation';

export class ConversationManager {
  private state: ConversationState;
  private messageHistory: Message[] = [];
  private contextWindow = 5; // Antal meddelanden att komma ihåg för kontext

  constructor() {
    this.state = this.getInitialState();
    this.loadFromStorage();
  }

  private getInitialState(): ConversationState {
    return {
      slots: {},
      mode: 'chat',
      context: {},
      leadData: {
        consent: {}
      },
      calculatorData: {},
      bookingData: {}
    };
  }

  // Huvudfunktion för att processa ett meddelande
  async processMessage(userMessage: string): Promise<{
    response: string;
    actions?: any[];
    modeChange?: string;
    data?: any;
  }> {
    // Lägg till användarmeddelande i historik
    const message: Message = {
      id: Date.now().toString(),
      content: userMessage,
      type: 'user',
      timestamp: new Date()
    };
    this.messageHistory.push(message);

    // Hämta kontext från senaste meddelanden
    const context = this.buildContext();

    // Upptäck intent
    const intent = intentEngine.detectIntent(userMessage, context);
    
    // Uppdatera conversation state
    this.updateState(intent, userMessage);

    // Generera svar baserat på intent
    const response = await this.generateResponse(intent, userMessage, context);

    // Lägg till bot-svar i historik
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response.response,
      type: 'bot',
      timestamp: new Date(),
      intent,
      metadata: response.data
    };
    this.messageHistory.push(botMessage);

    // Spara state
    this.saveToStorage();

    // Trigga analytics
    this.trackEvent('message_processed', {
      intent: intent.type,
      confidence: intent.confidence,
      hasSlots: Object.keys(intent.slots).length > 0
    });

    return response;
  }

  private updateState(intent: ChatIntent, message: string) {
    // Uppdatera intent om det har högre konfidens
    if (!this.state.intent || intent.confidence > this.state.intent.confidence) {
      this.state.intent = intent;
    }

    // Uppdatera slots
    Object.entries(intent.slots).forEach(([key, value]) => {
      this.state.slots[key] = {
        name: key,
        value,
        confidence: intent.confidence,
        required: this.isSlotRequired(key, intent.type),
        filled: true
      };
    });

    // Uppdatera kontext
    this.state.context.lastIntent = intent.type;
    this.state.context.lastMessage = message;
    this.state.context.messageCount = this.messageHistory.length;
    this.state.context.hasAskedAboutPrice = this.hasAskedAboutPrice();
    this.state.context.selectedService = this.getSelectedService();

    // Uppdatera lead data från slots
    this.updateLeadDataFromSlots();
  }

  private async generateResponse(intent: ChatIntent, message: string, context: any): Promise<{
    response: string;
    actions?: any[];
    modeChange?: string;
    data?: any;
  }> {
    switch (intent.type) {
      case 'emergency':
        return this.handleEmergency(intent, message);
      
      case 'service_request':
        return this.handleServiceRequest(intent, message);
      
      case 'pricing_inquiry':
        return this.handlePricingInquiry(intent, message);
      
      case 'rot_rut_question':
        return this.handleROTRUTQuestion(intent, message);
      
      case 'booking_request':
        return this.handleBookingRequest(intent, message);
      
      case 'general_faq':
        return this.handleGeneralFAQ(intent, message);
      
      case 'handoff':
        return this.handleHandoff(intent, message);
      
      default:
        return this.handleDefault(intent, message);
    }
  }

  private handleEmergency(intent: ChatIntent, message: string) {
    const phone = intent.slots.phone || this.state.slots.phone?.value;
    
    if (!phone) {
      return {
        response: `🚨 Jag förstår att du har ett akut ärende! För omedelbar hjälp, ring oss direkt på **070-123 45 67**. Vi har jour 24/7 för akuta situationer.\n\nKan du också lämna ditt nummer så vi kan kontakta dig direkt?`,
        actions: [
          { type: 'highlight_phone', phone: '070-123 45 67' },
          { type: 'show_emergency_form' }
        ]
      };
    }

    this.state.leadData.urgency = 'emergency';
    this.state.leadData.phone = phone;
    
    return {
      response: `🚨 Akut ärende registrerat! Vi kontaktar dig på ${phone} inom 15 minuter. Ring samtidigt **070-123 45 67** för omedelbar hjälp.\n\nBeskriv kort vad som hänt så vi kan förbereda oss.`,
      actions: [
        { type: 'create_emergency_lead', data: this.state.leadData },
        { type: 'highlight_phone', phone: '070-123 45 67' }
      ]
    };
  }

  private handleServiceRequest(intent: ChatIntent, message: string) {
    const serviceType = intent.slots.service_type || this.state.slots.service_type?.value;
    const quantity = intent.slots.quantity || this.state.slots.quantity?.value;
    const location = intent.slots.location_type || this.state.slots.location_type?.value;

    // Sök relaterade tjänster
    const searchResults = knowledgeBase.search(message, 3);
    const suggestions = searchResults.filter(r => r.item.type === 'service').slice(0, 3);

    if (!serviceType && suggestions.length === 0) {
      return {
        response: `Jag hjälper dig gärna! För att ge dig bästa information, kan du berätta mer specifikt vad du behöver hjälp med?\n\nExempel: "Byta 6 spotlights i köket" eller "Installera diskmaskin"`,
        actions: [
          { type: 'show_service_categories' }
        ]
      };
    }

    if (suggestions.length > 0) {
      const topSuggestion = suggestions[0].item;
      this.state.calculatorData.service = topSuggestion.metadata;
      
      let response = `Perfekt! ${topSuggestion.title} är något vi gör ofta. `;
      
      if (quantity) {
        response += `Du nämnde ${quantity} stycken. `;
      }

      if (location) {
        response += `Arbetet ska göras ${location}. `;
      }

      // Beräkna ungefärligt pris
      const priceCalc = calcDisplayPrice(topSuggestion.metadata as any, 'rot');
      response += `\n\n💰 **Pris:** ${priceCalc.display}`;
      
      if (priceCalc.savings > 0) {
        response += `\n💚 **Sparar:** ${Math.round(priceCalc.savings)} kr med ROT-avdrag`;
      }
      
      response += `\n⏱️ **Tid:** Vanligtvis 0.5-2 timmar`;

      const followUp = intentEngine.generateFollowUpQuestion(intent.type, intent.slots);
      if (followUp) {
        response += `\n\n${followUp}`;
      } else {
        response += `\n\nVill du boka hembesök för kostnadsförslag?`;
      }

      return {
        response,
        modeChange: 'calculator',
        data: {
          service: topSuggestion.metadata,
          suggestions: suggestions.slice(1),
          priceCalculation: priceCalc
        },
        actions: [
          { type: 'show_calculator', data: this.state.calculatorData },
          { type: 'show_booking_cta' }
        ]
      };
    }

    return {
      response: `Jag kunde inte hitta exakt den tjänsten du söker. Kan du berätta mer specifikt, eller vill du prata med en av våra experter direkt?\n\n📞 **Ring:** 070-123 45 67\n💬 **WhatsApp:** [Starta chat](https://wa.me/46701234567)`,
      actions: [
        { type: 'show_contact_options' }
      ]
    };
  }

  private handlePricingInquiry(intent: ChatIntent, message: string) {
    const selectedService = this.getSelectedService();
    
    if (!selectedService) {
      return {
        response: `Våra priser varierar beroende på tjänst:\n\n• **Med ROT-avdrag:** från 480 kr/h\n• **Utan avdrag:** från 959 kr/h\n• **Fasta priser** för vissa tjänster\n\nVilken typ av arbete behöver du hjälp med? Då kan jag ge dig exakt pris.`,
        actions: [
          { type: 'show_service_finder' }
        ]
      };
    }

    return {
      response: this.generatePriceBreakdown(selectedService),
      modeChange: 'calculator',
      actions: [
        { type: 'show_calculator', data: { service: selectedService } }
      ]
    };
  }

  private handleROTRUTQuestion(intent: ChatIntent, message: string) {
    const rotInfo = knowledgeBase.getROTRUTInfo('rot');
    const rutInfo = knowledgeBase.getROTRUTInfo('rut');

    if (/\brot\b/i.test(message)) {
      return {
        response: `🏠 **ROT-avdrag** - Reparation, Ombyggnad, Tillbyggnad\n\n✅ **50% rabatt** på arbetskostnaden\n✅ **Max 50 000 kr/år** per person\n✅ **Vi sköter allt** - ansökan till utbetalning\n✅ **Direkt på fakturan** - du betalar redan rabatterat pris\n\n**Omfattar:** El, VVS, målning, golv, snickeri, plattläggning\n\n**Exempel:** Timpris 1000 kr → Du betalar 500 kr`,
        actions: [
          { type: 'show_rot_calculator' }
        ]
      };
    }

    if (/\brut\b/i.test(message)) {
      return {
        response: `🏡 **RUT-avdrag** - Rengöring, Underhåll, Trädgård\n\n✅ **50% rabatt** på arbetskostnaden\n✅ **Max 75 000 kr/år** per person\n✅ **Vi sköter allt** - ansökan till utbetalning\n✅ **Direkt på fakturan** - du betalar redan rabatterat pris\n\n**Omfattar:** Städning, fönsterputs, trädgårdsskötsel\n\n**Exempel:** Timpris 500 kr → Du betalar 250 kr`,
        actions: [
          { type: 'show_rut_calculator' }
        ]
      };
    }

    return {
      response: `💰 **ROT & RUT-avdrag** - 50% rabatt på arbetskostnaden!\n\n🏠 **ROT** (max 50 000 kr/år): El, VVS, snickeri, renovering\n🏡 **RUT** (max 75 000 kr/år): Städning, trädgård, fönsterputs\n\n✅ **Vi sköter allt åt dig** - från ansökan till utbetalning\n✅ **Rabatt direkt på fakturan** - inget förskott\n\nVilken typ av arbete planerar du?`,
      actions: [
        { type: 'show_rot_rut_comparison' }
      ]
    };
  }

  private handleBookingRequest(intent: ChatIntent, message: string) {
    const phone = intent.slots.phone || this.state.slots.phone?.value;
    const location = intent.slots.location || this.state.slots.location?.value;
    const name = intent.slots.name || this.state.slots.name?.value;

    if (!phone || !location) {
      const missing = [];
      if (!phone) missing.push('telefonnummer');
      if (!location) missing.push('ort');
      
      return {
        response: `Perfekt! Jag hjälper dig boka hembesök. För att kunna erbjuda lämpliga tider behöver jag ditt ${missing.join(' och ')}.\n\nVi startar vanligtvis inom 5 dagar och kostnadsförslag är alltid gratis.`,
        modeChange: 'form',
        actions: [
          { type: 'show_booking_form', missing }
        ]
      };
    }

    // Generera tillgängliga tider
    const availableSlots = this.generateAvailableSlots();
    this.state.bookingData.availableSlots = availableSlots;

    let response = `Bra! Vi kan erbjuda följande tider i ${location}:\n\n`;
    availableSlots.slice(0, 4).forEach((slot, i) => {
      response += `${i + 1}. **${this.formatDate(slot.date)}** ${slot.time} (${this.getTimeTypeEmoji(slot.type)} ${slot.type})\n`;
    });

    response += `\nVilken tid passar dig bäst? Svara med siffran (1-4).`;

    if (name) {
      response = `Hej ${name}! ${response}`;
    }

    return {
      response,
      modeChange: 'booking',
      data: { availableSlots: availableSlots.slice(0, 4) },
      actions: [
        { type: 'show_time_picker', slots: availableSlots.slice(0, 4) }
      ]
    };
  }

  private handleGeneralFAQ(intent: ChatIntent, message: string) {
    const searchResults = knowledgeBase.search(message, 1);
    
    if (searchResults.length > 0 && searchResults[0].item.type === 'faq') {
      const faq = searchResults[0].item;
      return {
        response: `**${faq.title}**\n\n${faq.content}\n\nHar du fler frågor eller vill du boka direkt?`,
        actions: [
          { type: 'show_related_faqs' },
          { type: 'show_booking_cta' }
        ]
      };
    }

    // Fallback svar
    return {
      response: `Jag försöker hitta svar på din fråga. Här är vad jag vet:\n\n• **Starttid:** Vanligtvis inom 5 dagar\n• **Områden:** Uppsala & Stockholm län\n• **Försäkring:** Fullständig ansvarsförsäkring\n• **Garanti:** På allt arbete vi utför\n\nVill du prata med en expert direkt? Ring **070-123 45 67**`,
      actions: [
        { type: 'show_contact_options' }
      ]
    };
  }

  private handleHandoff(intent: ChatIntent, message: string) {
    return {
      response: `Självklart! Här är flera sätt att komma i kontakt med oss:\n\n📞 **Ring direkt:** 070-123 45 67\n💬 **WhatsApp:** [Starta chat](https://wa.me/46701234567)\n📧 **E-post:** info@fixco.se\n\nVi svarar vanligtvis inom 30 minuter under kontorstid (08:00-17:00).`,
      actions: [
        { type: 'highlight_contact_methods' },
        { type: 'track_handoff_request' }
      ]
    };
  }

  private handleDefault(intent: ChatIntent, message: string) {
    return {
      response: `Jag förstår inte riktigt vad du menar, men jag hjälper dig gärna! Jag kan hjälpa dig med:\n\n🔧 **Hitta rätt tjänst** och få prisuppgift\n💰 **Förklara ROT/RUT-avdrag**\n📅 **Boka hembesök** för kostnadsförslag\n🚨 **Akuta ärenden** - ring direkt!\n\nVad vill du veta mer om?`,
      actions: [
        { type: 'show_quick_actions' }
      ]
    };
  }

  // Hjälpfunktioner
  private buildContext(): Record<string, any> {
    const recentMessages = this.messageHistory.slice(-this.contextWindow);
    const intents = recentMessages.map(m => m.intent?.type).filter(Boolean);
    
    return {
      recentIntents: intents,
      messageCount: this.messageHistory.length,
      hasAskedAboutPrice: this.hasAskedAboutPrice(),
      selectedService: this.getSelectedService(),
      currentMode: this.state.mode,
      completedSlots: Object.keys(this.state.slots).length
    };
  }

  private hasAskedAboutPrice(): boolean {
    return this.messageHistory.some(m => 
      m.intent?.type === 'pricing_inquiry' || 
      m.content.toLowerCase().includes('pris')
    );
  }

  private getSelectedService(): any {
    return this.state.calculatorData.service || 
           this.state.context.selectedService;
  }

  private isSlotRequired(slot: string, intent: string): boolean {
    const requiredSlots: Record<string, string[]> = {
      emergency: ['phone'],
      booking_request: ['phone', 'location'],
      service_request: ['service_type']
    };
    
    return (requiredSlots[intent] || []).includes(slot);
  }

  private updateLeadDataFromSlots() {
    const slots = this.state.slots;
    
    if (slots.name?.value) this.state.leadData.name = slots.name.value;
    if (slots.phone?.value) this.state.leadData.phone = slots.phone.value;
    if (slots.email?.value) this.state.leadData.email = slots.email.value;
    if (slots.location?.value) this.state.leadData.location = slots.location.value;
    if (slots.urgency?.value) this.state.leadData.urgency = slots.urgency.value;
  }

  private generatePriceBreakdown(service: any): string {
    const allMode = calcDisplayPrice(service, 'all');
    const rotMode = service.eligible.rot ? calcDisplayPrice(service, 'rot') : null;
    const rutMode = service.eligible.rut ? calcDisplayPrice(service, 'rut') : null;

    let response = `💰 **Prisuppgift för ${service.title}**\n\n`;
    response += `**Ordinarie pris:** ${allMode.display}\n`;
    
    if (rotMode && rotMode.savings > 0) {
      response += `**Med ROT-avdrag:** ${rotMode.display}\n`;
      response += `💚 **Du sparar:** ${Math.round(rotMode.savings)} kr (${rotMode.savingsPercent}%)\n`;
    }
    
    if (rutMode && rutMode.savings > 0) {
      response += `**Med RUT-avdrag:** ${rutMode.display}\n`;
      response += `💚 **Du sparar:** ${Math.round(rutMode.savings)} kr (${rutMode.savingsPercent}%)\n`;
    }

    response += `\n⏱️ **Ungefärlig tid:** 0.5-2 timmar\n`;
    response += `✅ **Inkluderat:** Material, arbete, städning\n`;
    response += `🎯 **Garanti:** 1 år på arbetet\n\n`;
    response += `Vill du boka hembesök för exakt prisuppgift?`;

    return response;
  }

  private generateAvailableSlots() {
    const slots = [];
    const now = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      // Skippa helger
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Lägg till olika tider
      const times = [
        { time: '08:00-10:00', type: 'morning' as const },
        { time: '10:00-12:00', type: 'morning' as const },
        { time: '13:00-15:00', type: 'afternoon' as const },
        { time: '15:00-17:00', type: 'afternoon' as const }
      ];
      
      times.forEach(timeSlot => {
        slots.push({
          id: `${date.toISOString().split('T')[0]}-${timeSlot.time}`,
          date,
          time: timeSlot.time,
          available: Math.random() > 0.3, // Simulera tillgänglighet
          type: timeSlot.type
        });
      });
    }
    
    return slots.filter(slot => slot.available).slice(0, 10);
  }

  private formatDate(date: Date): string {
    const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
    const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  }

  private getTimeTypeEmoji(type: string): string {
    const emojis = {
      morning: '🌅',
      afternoon: '☀️',
      evening: '🌆'
    };
    return emojis[type as keyof typeof emojis] || '⏰';
  }

  private trackEvent(event: string, data: any) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Storage methods
  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('fixco_chat_state', JSON.stringify({
          state: this.state,
          messages: this.messageHistory.slice(-10) // Bara senaste 10
        }));
      } catch (e) {
        console.warn('Could not save chat state to storage');
      }
    }
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('fixco_chat_state');
        if (stored) {
          const { state, messages } = JSON.parse(stored);
          this.state = { ...this.state, ...state };
          this.messageHistory = messages || [];
        }
      } catch (e) {
        console.warn('Could not load chat state from storage');
      }
    }
  }

  // Public getters
  get currentState() { return this.state; }
  get messages() { return this.messageHistory; }
  
  // Public methods för UI
  clearConversation() {
    this.state = this.getInitialState();
    this.messageHistory = [];
    this.saveToStorage();
  }

  setMode(mode: any) {
    this.state.mode = mode;
    this.saveToStorage();
  }

  updateLeadData(data: Partial<LeadData>) {
    this.state.leadData = { ...this.state.leadData, ...data };
    this.saveToStorage();
  }
}

// Singleton instance
export const conversationManager = new ConversationManager();