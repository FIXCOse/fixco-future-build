// Advanced Intent Recognition and Slot Filling Engine
import { ChatIntent, Intent, ConversationSlot } from './types';
import { knowledgeBase } from './KnowledgeBase';

export class IntentEngine {
  private patterns: Record<Intent, RegExp[]> = {
    // Akuta ärenden (högsta prioritet)
    emergency: [
      /\b(akut|kris|nödfall|jour|läcker|läckage|stopp|haverí|brustit|vattenläcka|kortkoppling|ström[en]? är borta)\b/i,
      /\b(hjälp|nu direkt|omedelbart|snabbt|bråttom)\b.*\b(el|vatten|rör|värme)\b/i,
      /\b(ingen ström|inget vatten|kallt|varmt)\b/i
    ],
    
    // Tjänsteförfrågningar
    service_request: [
      /\b(byta|installera|montera|fixa|reparera|göra)\b.*\b(uttag|strömbrytare|dimmer|lampa|kran|toalett|diskmaskin)\b/i,
      /\b(behöver|vill|ska|planerar)\b.*\b(hjälp med|göra|byta|installera)\b/i,
      /\b(el|vvs|snickeri|städning|trädgård|flytt)\b.*\b(jobb|arbete|projekt)\b/i,
      /\b\d+\s*(st|stycken|antal)?\s*(uttag|armaturer|lampor|kranar)\b/i
    ],
    
    // Prisfrågor
    pricing_inquiry: [
      /\b(pris|kostar|kostnad|timpris|peng|betala|räkna)\b/i,
      /\b(hur mycket|vad får|billigt|dyrt|prisuppgift)\b/i,
      /\b(offert|kostnadsförslag|anbud)\b/i
    ],
    
    // ROT/RUT frågor
    rot_rut_question: [
      /\b(rot|rut|avdrag|skatteavdrag|skatteförmån|subvention)\b/i,
      /\b(50%|femtio procent|rabatt)\b.*\b(skatt|avdrag)\b/i,
      /\bhur funkar\b.*\b(rot|rut|avdrag)\b/i
    ],
    
    // Bokningsförfrågningar
    booking_request: [
      /\b(boka|tid|besök|komma|träffa|när|datum|schema)\b/i,
      /\b(hembesök|kostnadsförslag|offert|titta på)\b/i,
      /\b(imorgon|nästa vecka|snart|måndag|tisdag|onsdag|torsdag|fredag)\b/i,
      /\b(på\s+(måndag|tisdag|onsdag|torsdag|fredag))\b/i
    ],
    
    // Allmänna FAQ
    general_faq: [
      /\b(hur|vad|var|när|varför|vilka)\b/i,
      /\b(försäkring|garanti|områden|täcker|f-skatt|ansvarsförsäkring)\b/i,
      /\b(hur lång tid|hur snabbt|deadline)\b/i
    ],
    
    // Vill prata med människa
    handoff: [
      /\b(prata med|tala med|människa|person|ring|telefon|samtala)\b/i,
      /\b(whatsapp|sms|maila|kontakt)\b/i,
      /\b(inte förstår|komplicerat|svårt|förklara bättre)\b/i
    ]
  };

  private slotPatterns = {
    // Antal/kvantitet
    quantity: /\b(\d+)\s*(st|stycken|antal|stk)?\b/i,
    
    // Rum/platser
    room: /\b(kök|vardagsrum|sovrum|badrum|hall|garage|källare|vind|balkong|terrass)\b/i,
    
    // Läge
    location_type: /\b(inomhus|utomhus|inne|ute|invändigt|utvändigt)\b/i,
    
    // Orter
    location: /\b(uppsala|stockholm|solna|täby|märsta|knivsta|enköping|västerås|eskilstuna|strängnäs)\b/i,
    
    // Telefonnummer
    phone: /\b(\+46|0)[\s-]?[0-9]{1,3}[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}\b/,
    
    // E-post
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    
    // Tidsuttryck
    time_preference: /\b(morgon|förmiddag|lunch|eftermiddag|kväll|helg|vardag)\b/i,
    date_preference: /\b(imorgon|övermorgon|nästa vecka|denna vecka|måndag|tisdag|onsdag|torsdag|fredag)\b/i,
    
    // Brådska
    urgency: /\b(akut|bråttom|snabbt|direkt|omedelbart|kan vänta|inte bråttom)\b/i,
    
    // Namn (enkel heuristik)
    name: /\b[A-ZÅÄÖ][a-zåäö]+(?:\s[A-ZÅÄÖ][a-zåäö]+)*\b/
  };

  detectIntent(message: string, context: Record<string, any> = {}): ChatIntent {
    const normalizedMessage = message.toLowerCase().trim();
    let bestIntent: Intent = 'general_faq';
    let maxConfidence = 0;
    
    // Kontextbaserad viktning
    const contextBoost = this.getContextBoost(context);
    
    // Testa alla intent-mönster
    Object.entries(this.patterns).forEach(([intent, patterns]) => {
      let confidence = 0;
      
      patterns.forEach(pattern => {
        if (pattern.test(normalizedMessage)) {
          confidence += 0.8;
        }
      });
      
      // Lägg till kontextbaserad boost
      confidence += contextBoost[intent as Intent] || 0;
      
      // Specialregler för bättre klassning
      confidence = this.applySpecialRules(intent as Intent, normalizedMessage, confidence);
      
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        bestIntent = intent as Intent;
      }
    });

    // Extrahera slots
    const slots = this.extractSlots(message, bestIntent);
    
    // Semantisk sökning för att hitta relaterade tjänster
    const searchResults = knowledgeBase.search(message, 3);
    const data = searchResults.length > 0 ? {
      suggestions: searchResults.map(r => r.item),
      topMatch: searchResults[0]
    } : undefined;

    return {
      type: bestIntent,
      confidence: Math.min(maxConfidence, 1.0),
      slots,
      data
    };
  }

  private getContextBoost(context: Record<string, any>): Record<Intent, number> {
    const boost: Record<Intent, number> = {
      emergency: 0,
      service_request: 0,
      pricing_inquiry: 0,
      rot_rut_question: 0,
      booking_request: 0,
      general_faq: 0,
      handoff: 0
    };

    // Om användaren redan frågat om pris, höj sannolikheten för bokningsfrågor
    if (context.hasAskedAboutPrice) {
      boost.booking_request += 0.2;
    }

    // Om användaren redan identifierat en tjänst, höj prisförfrågningar
    if (context.selectedService) {
      boost.pricing_inquiry += 0.3;
      boost.booking_request += 0.2;
    }

    // Om det är sent på dagen, höj emergency-sannolikheten
    const hour = new Date().getHours();
    if (hour < 7 || hour > 20) {
      boost.emergency += 0.1;
    }

    return boost;
  }

  private applySpecialRules(intent: Intent, message: string, confidence: number): number {
    // Akuta ärenden har alltid hög prioritet
    if (intent === 'emergency') {
      if (/\b(nu|direkt|akut|kris)\b/.test(message)) {
        confidence += 0.3;
      }
    }

    // Bokningsförfrågningar stärks av tidsindikatorer
    if (intent === 'booking_request') {
      if (/\b(måndag|tisdag|onsdag|torsdag|fredag|imorgon|nästa vecka)\b/.test(message)) {
        confidence += 0.2;
      }
    }

    // Prisfrågor stärks av numeriska uttryck
    if (intent === 'pricing_inquiry') {
      if (/\b\d+\b/.test(message) || /\b(kr|kronor|kostar|pris)\b/.test(message)) {
        confidence += 0.2;
      }
    }

    // ROT/RUT stärks av procenttal
    if (intent === 'rot_rut_question') {
      if (/\b(\d+%|procent|50|femtio)\b/.test(message)) {
        confidence += 0.2;
      }
    }

    return confidence;
  }

  extractSlots(message: string, intent?: Intent): Record<string, any> {
    const slots: Record<string, any> = {};

    Object.entries(this.slotPatterns).forEach(([slotName, pattern]) => {
      const match = message.match(pattern);
      if (match) {
        let value = match[1] || match[0];
        
        // Specialbehandling för vissa slots
        switch (slotName) {
          case 'quantity':
            value = parseInt(value, 10).toString();
            break;
          case 'phone':
            value = value.replace(/\s|-/g, '');
            break;
          case 'location':
            value = value.toLowerCase();
            break;
          case 'urgency':
            if (/akut|bråttom|snabbt|direkt|omedelbart/.test(value.toLowerCase())) {
              value = 'high';
            } else if (/kan vänta|inte bråttom/.test(value.toLowerCase())) {
              value = 'low';
            } else {
              value = 'medium';
            }
            break;
        }
        
        slots[slotName] = value;
      }
    });

    // Intent-specifik slot-extraktion
    if (intent) {
      const additionalSlots = this.extractIntentSpecificSlots(message, intent);
      Object.assign(slots, additionalSlots);
    }

    return slots;
  }

  private extractIntentSpecificSlots(message: string, intent: Intent): Record<string, any> {
    const slots: Record<string, any> = {};

    switch (intent) {
      case 'service_request':
        // Extrahera tjänsttyp
        const serviceKeywords = ['uttag', 'strömbrytare', 'dimmer', 'lampa', 'kran', 'toalett', 'diskmaskin'];
        for (const keyword of serviceKeywords) {
          if (message.toLowerCase().includes(keyword)) {
            slots.service_type = keyword;
            break;
          }
        }
        break;

      case 'pricing_inquiry':
        // Extrahera vad de frågar om pris för
        const priceContext = message.match(/pris.*?(på|för)\s+([^.?!]+)/i);
        if (priceContext) {
          slots.price_context = priceContext[2].trim();
        }
        break;

      case 'booking_request':
        // Extrahera önskad tid mer specifikt
        const timeMatch = message.match(/\b(\d{1,2}):?(\d{2})?\b/);
        if (timeMatch) {
          slots.preferred_time = timeMatch[0];
        }
        break;
    }

    return slots;
  }

  // Kontrollera om alla nödvändiga slots är fyllda för en intent
  isIntentComplete(intent: Intent, slots: Record<string, any>): boolean {
    const requiredSlots: Record<Intent, string[]> = {
      emergency: ['phone'],
      service_request: ['service_type'],
      pricing_inquiry: ['service_type'],
      rot_rut_question: [],
      booking_request: ['phone', 'location'],
      general_faq: [],
      handoff: []
    };

    const required = requiredSlots[intent] || [];
    return required.every(slot => slots[slot] !== undefined);
  }

  // Generera följdfråga för saknade slots
  generateFollowUpQuestion(intent: Intent, slots: Record<string, any>): string | null {
    const missingSlots = this.getMissingSlots(intent, slots);
    
    if (missingSlots.length === 0) return null;

    const questions: Record<string, string> = {
      service_type: "Vilken typ av arbete behöver du hjälp med?",
      quantity: "Hur många stycken?",
      location: "Vilken ort befinner du dig i?",
      phone: "Kan du lämna ditt telefonnummer så vi kan kontakta dig?",
      room: "I vilket rum ska arbetet utföras?",
      location_type: "Är arbetet inomhus eller utomhus?",
      urgency: "Är det bråttom eller kan det vänta?",
      name: "Vad heter du?"
    };

    return questions[missingSlots[0]] || "Kan du berätta lite mer?";
  }

  private getMissingSlots(intent: Intent, slots: Record<string, any>): string[] {
    const requiredSlots: Record<Intent, string[]> = {
      emergency: ['phone'],
      service_request: ['service_type'],
      pricing_inquiry: ['service_type'],
      rot_rut_question: [],
      booking_request: ['phone', 'location'],
      general_faq: [],
      handoff: []
    };

    const required = requiredSlots[intent] || [];
    return required.filter(slot => slots[slot] === undefined);
  }
}

// Singleton instance
export const intentEngine = new IntentEngine();