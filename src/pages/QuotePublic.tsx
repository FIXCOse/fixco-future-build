import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FileText, Calendar, ExternalLink, CheckCircle2, AlertCircle, Clock, Download,
  XCircle, MessageCircle, Bell, CreditCard, List, Shield, Copy, Mail, Phone,
  Wrench, Package, Link as LinkIcon, Image as ImageIcon, Store, Send, Camera
} from 'lucide-react';
import { QuoteImageUpload } from '@/components/QuoteImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

// ── Bilingual copy ──────────────────────────────────────────────
const quoteCopy = {
  sv: {
    loading: 'Laddar offert...',
    notFoundTitle: 'Offert hittades inte',
    notFoundDesc: 'Offerten du söker kunde inte hittas. Kontrollera att länken är korrekt.',
    quoteLabel: 'Offert',
    fromFixco: 'Från Fixco AB',
    deleted: 'Raderad',
    accepted: 'Accepterad',
    declined: 'Nekad',
    expired: 'Utgången',
    awaitingResponse: 'Väntar på svar',
    dayLeft: 'dag kvar',
    daysLeft: 'dagar kvar',
    updatedWarningTitle: '⚠️ Offerten har uppdaterats',
    updatedWarningDesc: 'Vi har gjort ändringar i offerten efter din tidigare acceptans. Vänligen granska ändringarna nedan och acceptera på nytt för att fortsätta.',
    recipient: 'Mottagare',
    validUntil: 'Giltig till',
    whatsIncluded: 'Vad ingår i offerten',
    work: 'Arbete',
    material: 'Material',
    seeProduct: 'Se produkt',
    viewImage: 'Visa bild',
    fee: 'Avgifter',
    savedAmount: 'RABATT',
    materialNotIncluded: 'Material ingår ej i denna offert och faktureras separat efter slutfört arbete.',
    costBreakdown: 'Kostnadsspecifikation',
    laborCost: 'Arbetskostnad',
    materialCost: 'Materialkostnad',
    inclVat: ' (inkl moms)',
    discount: 'Rabatt',
    sum: 'Summa',
    ofWhichExclVat: 'varav Exkl. moms',
    ofWhichVat: 'varav Moms (25%)',
    vat25: 'Moms (25%)',
    taxReduction: 'Skattereduktion',
    toPay: 'ATT BETALA',
    alreadyAcceptedTitle: 'Offert redan godkänd',
    alreadyAcceptedDesc: 'Denna offert har redan accepterats. Vi kontaktar dig inom kort.',
    signedBy: 'Signerad av:',
    afterAcceptance: 'Efter acceptans',
    step1: 'Du får omedelbar bekräftelse via email',
    step2: 'Vi kontaktar dig för att boka starttid',
    step3: 'Arbete påbörjas enligt överenskommelse',
    payment: 'Betalning',
    paymentLine1: 'Faktura efter slutfört arbete',
    paymentLine2: 'Kortbetalning & Swish',
    paymentLine3: 'ROT-avdrag hanteras automatiskt',
    safeTrade: 'Trygg handel',
    safeLine1: 'Org.nr: 559224-6671',
    safeLine2: 'F-skatt & försäkring',
    safeLine3: '2 års garanti på arbete',
    thisQuoteDeleted: 'Denna offert har raderats',
    quoteAccepted: 'Offert accepterad!',
    weContactYou: 'Vi kontaktar dig inom kort',
    successTitle: 'Stort tack för ditt förtroende!',
    successDesc: 'Vi ser fram emot att köra igång med projektet. Vårt team kontaktar dig inom kort för att planera nästa steg.',
    whatHappensNow: 'Vad händer nu?',
    successStep1: 'Vi kontaktar dig inom kort för att bekräfta alla detaljer',
    successStep2: 'Vi bokar in en starttid som passar dig',
    successStep3: 'Du får en bekräftelse via email med alla detaljer',
    questionsAlready: 'Har du frågor redan nu?',
    close: 'Stäng',
    quoteDeclined: 'Offert nekad',
    thanksForFeedback: 'Tack för din feedback',
    quoteExpiredMsg: 'Denna offert har tyvärr gått ut',
    termsLabel: 'Jag godkänner',
    termsLinkText: 'Fixcos allmänna villkor',
    termsConfirm: 'och bekräftar att all information är korrekt',
    digitalSignature: 'Digital signatur *',
    signaturePlaceholder: 'Ditt fullständiga namn',
    signatureHelp: 'Din signatur bekräftar att du accepterar offerten',
    accepting: 'Accepterar...',
    acceptQuote: 'Acceptera offert',
    declineQuote: 'Neka offert',
    whyDecline: 'Varför tackar du nej?',
    whyDeclineDesc: 'Din feedback hjälper oss att förbättra våra tjänster',
    tooExpensive: 'För dyrt',
    choseOther: 'Valde annan leverantör',
    changedPlans: 'Ändrade planer',
    otherReason: 'Annan anledning',
    tellMore: 'Berätta mer (valfritt)',
    cancel: 'Avbryt',
    sending: 'Skickar...',
    requestChange: 'Begär ändring',
    requestChangeTitle: 'Begär ändring av offert',
    requestChangeDesc: 'Beskriv vilka ändringar du önskar så återkommer vi med en uppdaterad offert.',
    describeChanges: 'Beskriv önskade ändringar *',
    describeChangesPlaceholder: "T.ex. 'Jag skulle vilja ändra materialval till...'",
    attachFiles: 'Bifoga filer (valfritt)',
    attachFilesHelp: 'Bifoga bilder eller dokument som kan hjälpa oss förstå dina önskemål.',
    send: 'Skicka',
    askQuestion: 'Ställ fråga',
    haveQuestions: 'Har du frågor?',
    weAnswerSoon: 'Vi svarar så snart som möjligt',
    yourName: 'Ditt namn *',
    namePlaceholder: 'För- och efternamn',
    yourEmail: 'Din email (valfritt)',
    yourQuestion: 'Din fråga *',
    questionPlaceholder: 'Vad undrar du över?',
    sendQuestion: 'Skicka fråga',
    remindMe: 'Påminn mig',
    saveForLater: 'Spara för senare',
    reminderDesc: 'Vi skickar en påminnelse till din email',
    yourEmailRequired: 'Din email *',
    remindIn: 'Påminn om',
    day1: '1 dag',
    days3: '3 dagar',
    week1: '1 vecka',
    creating: 'Skapar...',
    createReminder: 'Skapa påminnelse',
    questionsAndAnswers: 'Frågor & Svar',
    qaSubtitle: 'Har du ställt frågor om offerten kan du se våra svar här',
    answerFromFixco: 'Svar från Fixco',
    awaitingAnswer: 'Väntar på svar',
    questionsLabel: 'Frågor?',
    fixcoQuestion: 'Fråga från Fixco',
    yourAnswer: 'Ditt svar *',
    answerPlaceholder: 'Skriv ditt svar här...',
    sendAnswer: 'Skicka svar',
    answerName: 'Ditt namn *',
    toastAnswerSuccess: 'Svar skickat!',
    toastAnswerSuccessDesc: 'Tack för ditt svar',
    toastAnswerFail: 'Kunde inte skicka svar',
    // Toast messages
    toastTermsTitle: 'Villkor måste accepteras',
    toastTermsDesc: 'Du måste godkänna våra villkor för att acceptera offerten',
    toastSigTitle: 'Signatur saknas',
    toastSigDesc: 'Ange ditt namn för att signera offerten',
    toastExpiredTitle: 'Offerten har gått ut',
    toastExpiredDesc: 'Tyvärr har denna offert passerat sitt sista giltighetsdatum',
    toastDeletedTitle: 'Offerten är raderad',
    toastDeletedDesc: 'Denna offert har raderats och kan inte accepteras',
    toastAcceptedTitle: '🎉 Offert accepterad!',
    toastAcceptedDesc: 'Tack! Vi kontaktar dig inom kort.',
    toastAcceptFailTitle: 'Kunde inte acceptera',
    toastAcceptFailDesc: 'Ett fel uppstod',
    toastRejectChoose: 'Välj en anledning',
    toastRejectChooseDesc: 'Berätta varför du tackar nej',
    toastRejectThanks: 'Tack för din feedback',
    toastRejectThanksDesc: 'Vi har registrerat ditt svar',
    toastRejectFail: 'Kunde inte registrera',
    toastChangeTitle: 'Ange ett meddelande',
    toastChangeDesc: 'Beskriv vilka ändringar du önskar',
    toastChangeSuccess: 'Din begäran är mottagen!',
    toastChangeSuccessDesc: 'Vi återkommer med en uppdaterad offert',
    toastChangeFail: 'Kunde inte skicka',
    toastQuestionTitle: 'Fyll i alla fält',
    toastQuestionDesc: 'Namn och fråga krävs',
    toastQuestionSuccess: 'Fråga mottagen!',
    toastQuestionSuccessDesc: 'Vi svarar så snart som möjligt',
    toastQuestionFail: 'Kunde inte skicka',
    toastEmailTitle: 'Email krävs',
    toastEmailDesc: 'Ange din email för påminnelsen',
    toastReminderSuccess: 'Påminnelse inställd!',
    toastReminderFail: 'Kunde inte skapa påminnelse',
    noToken: 'Ingen token angiven',
    quoteFetchError: 'Offerten kunde inte hittas',
    quoteDeletedError: 'Denna offert har raderats',
    downloadPdf: 'Ladda ner PDF',
    projectCreationNote: 'Vi kontaktar dig inom kort för att bekräfta detaljer.',
  },
  en: {
    loading: 'Loading quote...',
    notFoundTitle: 'Quote not found',
    notFoundDesc: 'The quote you are looking for could not be found. Please check that the link is correct.',
    quoteLabel: 'Quote',
    fromFixco: 'From Fixco AB',
    deleted: 'Deleted',
    accepted: 'Accepted',
    declined: 'Declined',
    expired: 'Expired',
    awaitingResponse: 'Awaiting response',
    dayLeft: 'day left',
    daysLeft: 'days left',
    updatedWarningTitle: '⚠️ Quote has been updated',
    updatedWarningDesc: 'We have made changes to the quote after your previous acceptance. Please review the changes below and accept again to continue.',
    recipient: 'Recipient',
    validUntil: 'Valid until',
    whatsIncluded: "What's included",
    work: 'Labour',
    material: 'Material',
    seeProduct: 'See product',
    viewImage: 'View image',
    fee: 'Fees',
    savedAmount: 'DISCOUNT',
    materialNotIncluded: 'Material is not included in this quote and will be invoiced separately after completed work.',
    costBreakdown: 'Cost breakdown',
    laborCost: 'Labour cost',
    materialCost: 'Material cost',
    inclVat: ' (incl. VAT)',
    discount: 'Discount',
    sum: 'Subtotal',
    ofWhichExclVat: 'of which excl. VAT',
    ofWhichVat: 'of which VAT (25%)',
    vat25: 'VAT (25%)',
    taxReduction: 'Tax reduction',
    toPay: 'TOTAL',
    alreadyAcceptedTitle: 'Quote already accepted',
    alreadyAcceptedDesc: 'This quote has already been accepted. We will contact you shortly.',
    signedBy: 'Signed by:',
    afterAcceptance: 'After acceptance',
    step1: 'You will receive immediate confirmation via email',
    step2: 'We will contact you to schedule a start date',
    step3: 'Work begins as agreed',
    payment: 'Payment',
    paymentLine1: 'Invoice after completed work',
    paymentLine2: 'Card payment & Swish',
    paymentLine3: 'ROT deduction handled automatically',
    safeTrade: 'Safe trade',
    safeLine1: 'Org. no: 559224-6671',
    safeLine2: 'F-tax & insurance',
    safeLine3: '2 year work guarantee',
    thisQuoteDeleted: 'This quote has been deleted',
    quoteAccepted: 'Quote accepted!',
    weContactYou: 'We will contact you shortly',
    successTitle: 'Thank you for your trust!',
    successDesc: 'We look forward to getting started with the project. Our team will contact you shortly to plan the next steps.',
    whatHappensNow: 'What happens now?',
    successStep1: 'We will contact you shortly to confirm all details',
    successStep2: 'We will schedule a start date that suits you',
    successStep3: 'You will receive a confirmation via email with all details',
    questionsAlready: 'Do you have questions already?',
    close: 'Close',
    quoteDeclined: 'Quote declined',
    thanksForFeedback: 'Thank you for your feedback',
    quoteExpiredMsg: 'Unfortunately this quote has expired',
    termsLabel: 'I accept',
    termsLinkText: "Fixco's general terms",
    termsConfirm: 'and confirm that all information is correct',
    digitalSignature: 'Digital signature *',
    signaturePlaceholder: 'Your full name',
    signatureHelp: 'Your signature confirms that you accept the quote',
    accepting: 'Accepting...',
    acceptQuote: 'Accept quote',
    declineQuote: 'Decline quote',
    whyDecline: 'Why are you declining?',
    whyDeclineDesc: 'Your feedback helps us improve our services',
    tooExpensive: 'Too expensive',
    choseOther: 'Chose another provider',
    changedPlans: 'Changed plans',
    otherReason: 'Other reason',
    tellMore: 'Tell us more (optional)',
    cancel: 'Cancel',
    sending: 'Sending...',
    requestChange: 'Request change',
    requestChangeTitle: 'Request quote change',
    requestChangeDesc: 'Describe what changes you would like and we will get back to you with an updated quote.',
    describeChanges: 'Describe desired changes *',
    describeChangesPlaceholder: "E.g. 'I would like to change the material to...'",
    attachFiles: 'Attach files (optional)',
    attachFilesHelp: 'Attach images or documents that can help us understand your wishes.',
    send: 'Send',
    askQuestion: 'Ask a question',
    haveQuestions: 'Do you have questions?',
    weAnswerSoon: 'We will answer as soon as possible',
    yourName: 'Your name *',
    namePlaceholder: 'First and last name',
    yourEmail: 'Your email (optional)',
    yourQuestion: 'Your question *',
    questionPlaceholder: 'What would you like to know?',
    sendQuestion: 'Send question',
    remindMe: 'Remind me',
    saveForLater: 'Save for later',
    reminderDesc: 'We will send a reminder to your email',
    yourEmailRequired: 'Your email *',
    remindIn: 'Remind in',
    day1: '1 day',
    days3: '3 days',
    week1: '1 week',
    creating: 'Creating...',
    createReminder: 'Create reminder',
    questionsAndAnswers: 'Questions & Answers',
    qaSubtitle: 'If you have asked questions about the quote, you can see our answers here',
    answerFromFixco: 'Answer from Fixco',
    awaitingAnswer: 'Awaiting answer',
    questionsLabel: 'Questions?',
    fixcoQuestion: 'Question from Fixco',
    yourAnswer: 'Your answer *',
    answerPlaceholder: 'Write your answer here...',
    sendAnswer: 'Send answer',
    answerName: 'Your name *',
    toastAnswerSuccess: 'Answer sent!',
    toastAnswerSuccessDesc: 'Thank you for your answer',
    toastAnswerFail: 'Could not send answer',
    toastTermsTitle: 'Terms must be accepted',
    toastTermsDesc: 'You must accept our terms to accept the quote',
    toastSigTitle: 'Signature missing',
    toastSigDesc: 'Enter your name to sign the quote',
    toastExpiredTitle: 'Quote has expired',
    toastExpiredDesc: 'Unfortunately this quote has passed its expiry date',
    toastDeletedTitle: 'Quote is deleted',
    toastDeletedDesc: 'This quote has been deleted and cannot be accepted',
    toastAcceptedTitle: '🎉 Quote accepted!',
    toastAcceptedDesc: 'Thank you! We will contact you shortly.',
    toastAcceptFailTitle: 'Could not accept',
    toastAcceptFailDesc: 'An error occurred',
    toastRejectChoose: 'Choose a reason',
    toastRejectChooseDesc: 'Tell us why you are declining',
    toastRejectThanks: 'Thank you for your feedback',
    toastRejectThanksDesc: 'We have registered your response',
    toastRejectFail: 'Could not register',
    toastChangeTitle: 'Enter a message',
    toastChangeDesc: 'Describe what changes you want',
    toastChangeSuccess: 'Your request has been received!',
    toastChangeSuccessDesc: 'We will get back to you with an updated quote',
    toastChangeFail: 'Could not send',
    toastQuestionTitle: 'Fill in all fields',
    toastQuestionDesc: 'Name and question are required',
    toastQuestionSuccess: 'Question received!',
    toastQuestionSuccessDesc: 'We will answer as soon as possible',
    toastQuestionFail: 'Could not send',
    toastEmailTitle: 'Email required',
    toastEmailDesc: 'Enter your email for the reminder',
    toastReminderSuccess: 'Reminder set!',
    toastReminderFail: 'Could not create reminder',
    noToken: 'No token provided',
    quoteFetchError: 'The quote could not be found',
    quoteDeletedError: 'This quote has been deleted',
    downloadPdf: 'Download PDF',
    projectCreationNote: 'We will contact you shortly to confirm details.',
  },
} as const;

type QuoteCopy = typeof quoteCopy.sv;

type QuoteQuestion = {
  id: string;
  question: string;
  customer_name: string;
  customer_email: string;
  asked_at: string;
  answered: boolean;
  answer?: string;
  answered_at?: string;
  asked_by?: string;
};

type PublicQuote = {
  id: string;
  number: string;
  title: string;
  status: string;
  items: any;
  subtotal_work_sek: number;
  subtotal_mat_sek: number;
  vat_sek: number;
  rot_deduction_sek: number;
  rot_percentage?: number;
  discount_amount_sek?: number;
  discount_type?: string;
  discount_value?: number;
  total_sek: number;
  pdf_url?: string;
  valid_until?: string;
  accepted_at?: string;
  signature_name?: string;
  signature_date?: string;
  customer_name: string;
  customer_email: string;
  questions: QuoteQuestion[];
  vat_included?: boolean;
  locale?: string;
};

export default function QuotePublic() {
  const { token, number } = useParams<{ token: string; number?: string }>();
  const { toast } = useToast();
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Accept/Reject states
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  // Change request states
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [changeMessage, setChangeMessage] = useState('');
  const [changeFiles, setChangeFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Question states
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [questionName, setQuestionName] = useState('');
  const [questionEmail, setQuestionEmail] = useState('');
  const [questionSubmitting, setQuestionSubmitting] = useState(false);

  // Reminder states
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderDays, setReminderDays] = useState('3');
  const [reminderSubmitting, setReminderSubmitting] = useState(false);

  // Answer admin question states
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [answerQuestionId, setAnswerQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [answerName, setAnswerName] = useState('');
  const [answerSubmitting, setAnswerSubmitting] = useState(false);

  // Derive locale-aware copy
  const locale = (quote?.locale === 'en' ? 'en' : 'sv') as 'sv' | 'en';
  const t = quoteCopy[locale];
  const dateLocale = locale === 'en' ? 'en-GB' : 'sv-SE';

  // Confetti
  const fireConfetti = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:2147483647;pointer-events:none;';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const myConfetti = confetti.create(canvas, { resize: true });
    const isMobile = window.innerWidth < 768;
    const defaults = { ticks: 300, gravity: 0.6, scalar: isMobile ? 1.0 : 1.2, startVelocity: isMobile ? 25 : 45 };
    const count = isMobile ? 0.6 : 1;
    myConfetti({ ...defaults, particleCount: Math.round(150 * count), spread: 100, origin: { y: 0.6 }, colors: ['#16a34a', '#22c55e', '#fbbf24', '#f59e0b', '#3b82f6'] });
    setTimeout(() => myConfetti({ ...defaults, particleCount: Math.round(100 * count), angle: 60, spread: 55, origin: { x: 0 }, colors: ['#16a34a', '#22c55e', '#fbbf24'] }), 400);
    setTimeout(() => myConfetti({ ...defaults, particleCount: Math.round(100 * count), angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3b82f6', '#8b5cf6', '#f59e0b'] }), 700);
    setTimeout(() => myConfetti({ ...defaults, particleCount: Math.round(80 * count), spread: 120, origin: { y: 0.5 }, colors: ['#16a34a', '#fbbf24', '#8b5cf6'] }), 1000);
    setTimeout(() => myConfetti({ ...defaults, particleCount: Math.round(60 * count), spread: 160, origin: { y: 0.7 }, colors: ['#22c55e', '#f59e0b', '#8b5cf6'] }), 1500);
    setTimeout(() => { canvas.remove(); }, 5000);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-page-type', 'quote');
    return () => { document.body.removeAttribute('data-page-type'); };
  }, []);

  useEffect(() => {
    if (!token) {
      setError(quoteCopy.sv.noToken);
      setLoading(false);
      return;
    }

    const fetchQuote = async () => {
      try {
        const path = number ? `get-quote-public/${number}/${token}` : `get-quote-public/${token}`;
        const { data, error } = await supabase.functions.invoke(path);

        if (error) {
          if (error.message?.includes('deleted') || data?.error === 'deleted') {
            setIsDeleted(true);
            setError(quoteCopy.sv.quoteDeletedError);
            return;
          }
          throw error;
        }
        if (!data) throw new Error(quoteCopy.sv.quoteFetchError);

        setQuote(data);
        if (data.status === 'accepted') {
          setAccepted(true);
        }
      } catch (err: any) {
        console.error('Error fetching quote:', err);
        setError(err.message || quoteCopy.sv.quoteFetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    
    if (!termsAccepted) {
      toast({ title: t.toastTermsTitle, description: t.toastTermsDesc, variant: 'destructive' });
      return;
    }

    if (!signatureName.trim()) {
      toast({ title: t.toastSigTitle, description: t.toastSigDesc, variant: 'destructive' });
      return;
    }
    
    setAccepting(true);
    try {
      const path = number ? `accept-quote-public/${number}/${token}` : `accept-quote-public/${token}`;
      const { data, error } = await supabase.functions.invoke(path, {
        method: 'POST',
        body: JSON.stringify({ signature_name: signatureName, terms_accepted: termsAccepted })
      });

      if (error) throw error;
      
      if (data.error === 'expired') {
        toast({ title: t.toastExpiredTitle, description: t.toastExpiredDesc, variant: 'destructive' });
        return;
      }

      if (data.error === 'deleted') {
        toast({ title: t.toastDeletedTitle, description: t.toastDeletedDesc, variant: 'destructive' });
        setIsDeleted(true);
        return;
      }

      if (data.error === 'project_creation_failed') {
        toast({ title: t.toastAcceptedTitle, description: t.projectCreationNote });
        setQuote(prev => prev ? { ...prev, status: 'accepted' } : prev);
        setAccepted(true);
        setShowSuccessDialog(true);
        setTimeout(() => fireConfetti(), 500);
        return;
      }

      setQuote(prev => prev ? { ...prev, status: 'accepted' } : prev);
      setAccepted(true);
      setShowSuccessDialog(true);
      setTimeout(() => fireConfetti(), 500);
      
      toast({ title: t.toastAcceptedTitle, description: t.toastAcceptedDesc });
    } catch (err: any) {
      console.error('Error accepting:', err);
      toast({ title: t.toastAcceptFailTitle, description: err.message || t.toastAcceptFailDesc, variant: 'destructive' });
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!token || !rejectReason) {
      toast({ title: t.toastRejectChoose, description: t.toastRejectChooseDesc, variant: 'destructive' });
      return;
    }

    setRejectSubmitting(true);
    try {
      const path = number ? `reject-quote-public/${number}/${token}` : `reject-quote-public/${token}`;
      const { error } = await supabase.functions.invoke(path, {
        method: 'POST',
        body: JSON.stringify({ reason: rejectReason, reason_text: rejectReasonText, customer_name: quote?.customer_name || 'Unknown' })
      });

      if (error) throw error;

      setDeclined(true);
      setRejectModalOpen(false);
      toast({ title: t.toastRejectThanks, description: t.toastRejectThanksDesc });
    } catch (err: any) {
      console.error('Error rejecting:', err);
      toast({ title: t.toastRejectFail, description: err.message || t.toastAcceptFailDesc, variant: 'destructive' });
    } finally {
      setRejectSubmitting(false);
    }
  };

  const handleChangeRequest = async () => {
    if (!token || !changeMessage.trim()) {
      toast({ title: t.toastChangeTitle, description: t.toastChangeDesc, variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('message', changeMessage);
      changeFiles.forEach((file) => { formData.append('files', file); });

      const { data, error } = await supabase.functions.invoke('request-change-quote-public', { body: formData });

      if (error) throw error;

      if (data?.error === 'deleted') {
        toast({ title: t.toastDeletedTitle, description: t.toastDeletedDesc, variant: 'destructive' });
        setIsDeleted(true);
        return;
      }

      toast({ title: t.toastChangeSuccess, description: t.toastChangeSuccessDesc });
      setChangeRequestOpen(false);
      setChangeMessage('');
      setChangeFiles([]);
    } catch (err: any) {
      console.error('Error requesting change:', err);
      toast({ title: t.toastChangeFail, description: err.message || t.toastAcceptFailDesc, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!token || !question.trim() || !questionName.trim()) {
      toast({ title: t.toastQuestionTitle, description: t.toastQuestionDesc, variant: 'destructive' });
      return;
    }

    setQuestionSubmitting(true);
    try {
      const path = number ? `ask-question-quote/${number}/${token}` : `ask-question-quote/${token}`;
      const { error } = await supabase.functions.invoke(path, {
        method: 'POST',
        body: JSON.stringify({ question, customer_name: questionName, customer_email: questionEmail || null })
      });

      if (error) throw error;

      setQuote(prev => prev ? {
        ...prev,
        questions: [...(prev.questions || []), {
          id: crypto.randomUUID(), question, customer_name: questionName,
          customer_email: questionEmail || '', asked_at: new Date().toISOString(),
          answered: false, answer: null, answered_at: null,
        }]
      } : prev);

      toast({ title: t.toastQuestionSuccess, description: t.toastQuestionSuccessDesc });
      setQuestionModalOpen(false);
      setQuestion('');
      setQuestionName('');
      setQuestionEmail('');
    } catch (err: any) {
      console.error('Error asking question:', err);
      toast({ title: t.toastQuestionFail, description: err.message || t.toastAcceptFailDesc, variant: 'destructive' });
    } finally {
      setQuestionSubmitting(false);
    }
  };

  const handleSetReminder = async () => {
    if (!token || !reminderEmail.trim()) {
      toast({ title: t.toastEmailTitle, description: t.toastEmailDesc, variant: 'destructive' });
      return;
    }

    setReminderSubmitting(true);
    try {
      const path = number ? `set-reminder-quote/${number}/${token}` : `set-reminder-quote/${token}`;
      const { error } = await supabase.functions.invoke(path, {
        method: 'POST',
        body: JSON.stringify({ customer_email: reminderEmail, days: parseInt(reminderDays) })
      });

      if (error) throw error;

      toast({ title: t.toastReminderSuccess, description: locale === 'sv' ? `Vi skickar en påminnelse om ${reminderDays} dagar` : `We will send a reminder in ${reminderDays} days` });
      setReminderModalOpen(false);
      setReminderEmail('');
    } catch (err: any) {
      console.error('Error setting reminder:', err);
      toast({ title: t.toastReminderFail, description: err.message || t.toastAcceptFailDesc, variant: 'destructive' });
    } finally {
      setReminderSubmitting(false);
    }
  };


  const handleAnswerAdminQuestion = async () => {
    if (!answerQuestionId || !answerText.trim() || !answerName.trim()) {
      toast({ title: t.toastQuestionTitle, description: t.toastQuestionDesc, variant: 'destructive' });
      return;
    }

    setAnswerSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('answer-quote-question', {
        body: {
          question_id: answerQuestionId,
          answer: answerText.trim(),
          customer_email: quote?.customer_email || null,
        }
      });

      if (error) throw error;

      setQuote(prev => prev ? {
        ...prev,
        questions: prev.questions.map(q =>
          q.id === answerQuestionId
            ? { ...q, answered: true, answer: answerText.trim(), answered_at: new Date().toISOString() }
            : q
        )
      } : prev);

      toast({ title: t.toastAnswerSuccess, description: t.toastAnswerSuccessDesc });
      setAnswerModalOpen(false);
      setAnswerQuestionId(null);
      setAnswerText('');
      setAnswerName('');
    } catch (err: any) {
      console.error('Error answering question:', err);
      toast({ title: t.toastAnswerFail, description: err.message, variant: 'destructive' });
    } finally {
      setAnswerSubmitting(false);
    }
  };

  const isExpired = quote?.valid_until && new Date(quote.valid_until) < new Date();
  const daysLeft = quote?.valid_until 
    ? Math.ceil((new Date(quote.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <>
        <Helmet>
          <title>{t.notFoundTitle} - Fixco</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">{t.notFoundTitle}</h1>
              <p className="text-muted-foreground">
                {error || t.notFoundDesc}
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t.quoteLabel} {quote.number} - Fixco</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-background py-4">
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-lg mb-2">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {t.quoteLabel} {quote.number}
            </h1>
            <p className="text-xs text-muted-foreground">{t.fromFixco}</p>
            
            {/* Status & Timer */}
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              {isDeleted ? (
                <Badge variant="destructive" className="px-3 py-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {t.deleted}
                </Badge>
              ) : (accepted || quote?.status === 'accepted') ? (
                <Badge className="bg-green-600 hover:bg-green-700 px-3 py-1">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {t.accepted}
                </Badge>
              ) : declined ? (
                <Badge variant="destructive" className="px-3 py-1">
                  <XCircle className="h-3 w-3 mr-1" />
                  {t.declined}
                </Badge>
              ) : isExpired ? (
                <Badge variant="destructive" className="px-3 py-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {t.expired}
                </Badge>
              ) : (
                <>
                  <Badge variant="secondary" className="px-3 py-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {t.awaitingResponse}
                  </Badge>
                  {daysLeft !== null && daysLeft > 0 && (
                    <Badge 
                      variant={daysLeft <= 2 ? "destructive" : daysLeft <= 7 ? "default" : "secondary"}
                      className="px-3 py-1"
                    >
                      {daysLeft} {daysLeft === 1 ? t.dayLeft : t.daysLeft}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>

              {/* Status Warning for pending_reaccept */}
              {quote?.status === 'pending_reaccept' && !isDeleted && (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-500/50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        {t.updatedWarningTitle}
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {t.updatedWarningDesc}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Card */}
          <Card className="border-border bg-surface shadow-xl">
            <CardContent className="p-4 space-y-4">
              {/* Title */}
              <div className="text-center pb-4 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">{quote.title}</h2>
                {(() => {
                  const allItems = Array.isArray(quote.items) ? quote.items : JSON.parse(quote.items || '[]');
                  const scopeMeta = allItems.find((item: any) => item.type === '_meta' && item.key === 'scope_description');
                  if (!scopeMeta?.value) return null;
                  return (
                    <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{scopeMeta.value}</p>
                  );
                })()}
              </div>

              {/* Customer & Date */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{t.recipient}</p>
                  <p className="font-semibold text-foreground">{quote.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t.validUntil}
                  </p>
                  <p className="font-semibold text-foreground">
                    {quote.valid_until 
                      ? new Date(quote.valid_until).toLocaleDateString(dateLocale)
                      : '—'}
                  </p>
                </div>
              </div>

              {/* Line Items */}
              {(() => {
                let parsedItems: any[] = [];
                try {
                  parsedItems = Array.isArray(quote.items) ? quote.items : JSON.parse(quote.items || '[]');
                } catch (e) {
                  console.error('Failed to parse items:', e);
                }
                
                if (parsedItems.length === 0) return null;
                
                const workItems = parsedItems.filter((item: any) => item.type === 'work');
                const materialItems = parsedItems.filter((item: any) => item.type === 'material');
                const feeItems = parsedItems.filter((item: any) => item.type === 'fee');
                const materialMeta = parsedItems.find((item: any) => item.type === '_meta' && item.key === 'material_included');
                const materialNotIncluded = materialMeta && materialMeta.value === false;
                
                return (
                  <div className="space-y-2 pt-4 pb-2 border-b border-border">
                    <div className="flex items-center gap-2 pb-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <List className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{t.whatsIncluded}</h3>
                    </div>
                    
                    {workItems.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Wrench className="h-4 w-4 text-primary" />
                          <span>{t.work}</span>
                        </div>
                        {workItems.map((item: any, idx: number) => (
                          <div key={`work-${idx}`} className={`ml-6 text-sm ${item.strikethrough ? 'opacity-60' : ''}`}>
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-foreground ${item.strikethrough ? 'line-through' : ''}`}>
                                {item.description} ({item.quantity} {item.unit || 'st'} × {item.price.toLocaleString(dateLocale)} kr)
                              </span>
                              <div className="flex items-center gap-2">
                                {item.strikethrough && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                                    {t.savedAmount}
                                  </Badge>
                                )}
                                <span className={`font-semibold text-foreground whitespace-nowrap ${item.strikethrough ? 'line-through' : ''}`}>
                                  {(item.quantity * item.price).toLocaleString(dateLocale)} kr
                                </span>
                              </div>
                            </div>
                            {(item.productUrl || item.imageUrl || item.supplierName) && (
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                {item.supplierName && (
                                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                    <Store className="h-3 w-3" />
                                    {item.supplierName}
                                  </span>
                                )}
                                {item.productUrl && (
                                  <a href={item.productUrl.startsWith('http') ? item.productUrl : `https://${item.productUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                    <LinkIcon className="h-3 w-3" />
                                    {t.seeProduct}
                                  </a>
                                )}
                                {item.imageUrl && (
                                  <a href={item.imageUrl.startsWith('http') ? item.imageUrl : `https://${item.imageUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                    <ImageIcon className="h-3 w-3" />
                                    {t.viewImage}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {materialItems.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Package className="h-4 w-4 text-primary" />
                          <span>{t.material}</span>
                        </div>
                        {materialItems.map((item: any, idx: number) => (
                          <div key={`material-${idx}`} className={`ml-6 text-sm ${item.strikethrough ? 'opacity-60' : ''}`}>
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-foreground ${item.strikethrough ? 'line-through' : ''}`}>
                                {item.description} ({item.quantity} {item.unit || 'st'} × {item.price.toLocaleString(dateLocale)} kr)
                              </span>
                              <div className="flex items-center gap-2">
                                {item.strikethrough && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                                    {t.savedAmount}
                                  </Badge>
                                )}
                                <span className={`font-semibold text-foreground whitespace-nowrap ${item.strikethrough ? 'line-through' : ''}`}>
                                  {(item.quantity * item.price).toLocaleString(dateLocale)} kr
                                </span>
                              </div>
                            </div>
                            {(item.productUrl || item.imageUrl || item.supplierName) && (
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                {item.supplierName && (
                                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                    <Store className="h-3 w-3" />
                                    {item.supplierName}
                                  </span>
                                )}
                                {item.productUrl && (
                                  <a href={item.productUrl.startsWith('http') ? item.productUrl : `https://${item.productUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                    <LinkIcon className="h-3 w-3" />
                                    {t.seeProduct}
                                  </a>
                                )}
                                {item.imageUrl && (
                                  <a href={item.imageUrl.startsWith('http') ? item.imageUrl : `https://${item.imageUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                    <ImageIcon className="h-3 w-3" />
                                    {t.viewImage}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fee items */}
                    {feeItems.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span>{t.fee}</span>
                        </div>
                        {feeItems.map((item: any, idx: number) => (
                          <div key={`fee-${idx}`} className={`ml-6 text-sm ${item.strikethrough ? 'opacity-60' : ''}`}>
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-foreground ${item.strikethrough ? 'line-through' : ''}`}>
                                {item.description}
                              </span>
                              <div className="flex items-center gap-2">
                                {item.strikethrough && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                                    {t.savedAmount}
                                  </Badge>
                                )}
                                <span className={`font-semibold text-foreground whitespace-nowrap ${item.strikethrough ? 'line-through' : ''}`}>
                                  {(item.quantity * item.price).toLocaleString(dateLocale)} kr
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {materialNotIncluded && (
                      <div className="mt-3 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-3">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {t.materialNotIncluded}
                        </p>
                      </div>
                    )}

                    {/* Customer notes */}
                    {(() => {
                      const customerNotesMeta = parsedItems.find((item: any) => item.type === '_meta' && item.key === 'customer_notes');
                      if (!customerNotesMeta?.value) return null;
                      return (
                        <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                          <p className="text-sm text-foreground whitespace-pre-line">{customerNotesMeta.value}</p>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}

              {/* Price breakdown */}
              {(() => {
                const vatIncluded = quote.vat_included ?? false;
                const workCostDisplay = quote.subtotal_work_sek;
                const matCostDisplay = quote.subtotal_mat_sek;
                const totalBeforeDiscount = workCostDisplay + matCostDisplay;
                const discountAmount = quote.discount_amount_sek || 0;
                const sumAfterDiscount = totalBeforeDiscount - discountAmount;
                const exclVat = Math.round(sumAfterDiscount / 1.25);
                const vatAmount = sumAfterDiscount - exclVat;
                
                return (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-xs">kr</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{t.costBreakdown}</h3>
                    </div>
                    
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">
                          {t.laborCost}{vatIncluded ? t.inclVat : ''}
                        </span>
                        <span className="font-semibold">{workCostDisplay.toLocaleString(dateLocale)} kr</span>
                      </div>
                      
                      {matCostDisplay > 0 && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">
                            {t.materialCost}{vatIncluded ? t.inclVat : ''}
                          </span>
                          <span className="font-semibold">{matCostDisplay.toLocaleString(dateLocale)} kr</span>
                        </div>
                      )}
                      
                      {discountAmount > 0 && (
                        <div className="flex justify-between py-2 border-b border-border bg-green-50 dark:bg-green-900/10 -mx-3 px-3 rounded">
                          <span className="font-medium text-green-700 dark:text-green-400">
                            {t.discount} {quote.discount_type === 'percent' ? `(${quote.discount_value}%)` : ''}
                          </span>
                          <span className="font-semibold text-green-700 dark:text-green-400">
                            −{discountAmount.toLocaleString(dateLocale)} kr
                          </span>
                        </div>
                      )}
                      
                      {discountAmount > 0 && (
                        <div className="flex justify-between py-2 border-b border-border font-medium">
                          <span className="text-foreground">{t.sum}</span>
                          <span className="font-semibold">{sumAfterDiscount.toLocaleString(dateLocale)} kr</span>
                        </div>
                      )}
                      
                      {vatIncluded && (
                        <>
                          <div className="flex justify-between py-1.5 text-muted-foreground text-xs">
                            <span className="italic">{t.ofWhichExclVat}</span>
                            <span>{exclVat.toLocaleString(dateLocale)} kr</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-border text-muted-foreground text-xs">
                            <span className="italic">{t.ofWhichVat}</span>
                            <span>{vatAmount.toLocaleString(dateLocale)} kr</span>
                          </div>
                        </>
                      )}
                      
                      {!vatIncluded && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">{t.vat25}</span>
                          <span className="font-semibold">{quote.vat_sek.toLocaleString(dateLocale)} kr</span>
                        </div>
                      )}
                      
                      {quote.rot_deduction_sek > 0 && (
                        <div className="flex justify-between py-2 border-b border-border bg-green-50 dark:bg-green-900/10 -mx-3 px-3 rounded">
                          <span className="font-medium text-green-700 dark:text-green-400">
                            {t.taxReduction} (ROT {quote.rot_percentage || 30}%)
                          </span>
                          <span className="font-semibold text-green-700 dark:text-green-400">
                            −{quote.rot_deduction_sek.toLocaleString(dateLocale)} kr
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="gradient-primary rounded-xl p-4 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary-foreground">{t.toPay}</span>
                        <span className="text-2xl font-bold text-primary-foreground">
                          {quote.total_sek.toLocaleString(dateLocale)} kr
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Already Accepted Badge */}
              {(accepted || quote?.status === 'accepted') && !isDeleted && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center gap-3 text-green-700 dark:text-green-300">
                      <CheckCircle2 className="h-8 w-8" />
                      <div>
                        <h3 className="font-semibold text-lg">{t.alreadyAcceptedTitle}</h3>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {t.alreadyAcceptedDesc}
                        </p>
                        {quote?.signature_name && (
                          <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                            {t.signedBy} {quote.signature_name}
                            {quote.accepted_at && (
                              <> · {new Date(quote.accepted_at).toLocaleDateString(dateLocale, { 
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}</>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next Steps Info */}
              {!isDeleted && !accepted && !declined && !isExpired && quote?.status !== 'accepted' && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <List className="h-4 w-4" />
                      {t.afterAcceptance}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{t.step1}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{t.step2}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{t.step3}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment & Trust Info */}
              {!isDeleted && !declined && (
                <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-border">
                  <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        {t.payment}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground space-y-1">
                      <p>• {t.paymentLine1}</p>
                      <p>• {t.paymentLine2}</p>
                      <p>• {t.paymentLine3}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {t.safeTrade}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground space-y-1">
                      <p>• {t.safeLine1}</p>
                      <p>• {t.safeLine2}</p>
                      <p>• {t.safeLine3}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Actions */}
              {isDeleted ? (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-destructive font-semibold">
                    {t.thisQuoteDeleted}
                  </p>
                </div>
              ) : accepted ? (
                <>
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-600/30 rounded-lg p-4 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-green-700 dark:text-green-300 font-semibold">
                      {t.quoteAccepted}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{t.weContactYou}</p>
                  </div>

                  {/* Success Dialog */}
                  <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-scale-in">
                          <CheckCircle2 className="h-12 w-12 text-green-600 animate-fade-in" />
                        </div>
                        <DialogTitle className="text-center text-2xl animate-fade-in">
                          {t.successTitle}
                        </DialogTitle>
                        <p className="text-center text-muted-foreground pt-2 animate-fade-in">
                          {t.successDesc}
                        </p>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4 space-y-3 animate-fade-in">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            {t.whatHappensNow}
                          </h4>
                          <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                              <span>{t.successStep1}</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                              <span>{t.successStep2}</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                              <span>{t.successStep3}</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="border-t pt-4 space-y-2">
                          <p className="text-sm text-muted-foreground text-center">
                            {t.questionsAlready}
                          </p>
                          <div className="flex justify-center">
                            <a href="mailto:info@fixco.se" className="flex items-center justify-center gap-2 text-sm hover:text-primary transition-colors">
                              <Mail className="h-4 w-4" />
                              info@fixco.se
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={() => setShowSuccessDialog(false)} className="w-full sm:w-auto">
                          {t.close}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>

              ) : declined ? (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
                  <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-destructive font-semibold">
                    {t.quoteDeclined}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{t.thanksForFeedback}</p>
                </div>
              ) : (
                <>
                  {isExpired && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-center">
                      <p className="text-destructive font-medium text-sm flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t.quoteExpiredMsg}
                      </p>
                    </div>
                  )}
                  
                  {/* Terms & Signature + Action Buttons */}
                  {quote?.status !== 'accepted' && (
                  <>
                  <div className="space-y-4 pt-2 border-t border-border">
                    <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                      <Checkbox 
                        id="terms" 
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        disabled={isExpired}
                      />
                      <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                        {t.termsLabel}{' '}
                        <a href="/terms" target="_blank" className="text-primary hover:underline font-medium">
                          {t.termsLinkText}
                        </a>
                        {' '}{t.termsConfirm}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signature">{t.digitalSignature}</Label>
                      <Input
                        id="signature"
                        placeholder={t.signaturePlaceholder}
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        disabled={isExpired}
                        className="font-serif text-lg"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t.signatureHelp}
                      </p>
                    </div>
                  </div>

                  {/* Main Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="gradient-primary hover:brightness-110 transition-all"
                      onClick={handleAccept}
                      disabled={accepting || isExpired || !termsAccepted || !signatureName.trim()}
                      size="lg"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {accepting ? t.accepting : t.acceptQuote}
                    </Button>
                    
                    <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="border-destructive/30 hover:bg-destructive/5 text-destructive"
                          disabled={isExpired}
                          size="lg"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {t.declineQuote}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{t.whyDecline}</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-2">
                            {t.whyDeclineDesc}
                          </p>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <RadioGroup value={rejectReason} onValueChange={setRejectReason}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="too_expensive" id="r1" />
                              <Label htmlFor="r1">{t.tooExpensive}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="chose_other" id="r2" />
                              <Label htmlFor="r2">{t.choseOther}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="changed_plans" id="r3" />
                              <Label htmlFor="r3">{t.changedPlans}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="r4" />
                              <Label htmlFor="r4">{t.otherReason}</Label>
                            </div>
                          </RadioGroup>

                          {rejectReason === 'other' && (
                            <Textarea
                              placeholder={t.tellMore}
                              value={rejectReasonText}
                              onChange={(e) => setRejectReasonText(e.target.value)}
                              rows={3}
                            />
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                            {t.cancel}
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={handleReject}
                            disabled={rejectSubmitting || !rejectReason}
                          >
                            {rejectSubmitting ? t.sending : t.declineQuote}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Secondary Actions */}
                  <div className="grid md:grid-cols-3 gap-2">
                    {/* Change Request */}
                    <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-primary/30 hover:bg-primary/5" disabled={isExpired} size="sm">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          {t.requestChange}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{t.requestChangeTitle}</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-2">{t.requestChangeDesc}</p>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="message">{t.describeChanges}</Label>
                            <Textarea
                              id="message"
                              value={changeMessage}
                              onChange={(e) => setChangeMessage(e.target.value)}
                              placeholder={t.describeChangesPlaceholder}
                              rows={5}
                              className="resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="files">{t.attachFiles}</Label>
                            <Input id="files" type="file" multiple onChange={(e) => setChangeFiles(Array.from(e.target.files || []))} className="cursor-pointer" />
                            <p className="text-xs text-muted-foreground">{t.attachFilesHelp}</p>
                          </div>
                          <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={() => setChangeRequestOpen(false)}>{t.cancel}</Button>
                            <Button onClick={handleChangeRequest} disabled={submitting || !changeMessage.trim()} className="gradient-primary">
                              {submitting ? t.sending : t.send}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Ask Question */}
                    <Dialog 
                      open={questionModalOpen} 
                      onOpenChange={(open) => {
                        setQuestionModalOpen(open);
                        if (open && quote) {
                          setQuestionName(quote.customer_name || '');
                          setQuestionEmail(quote.customer_email || '');
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-primary/30 hover:bg-primary/5" disabled={isExpired} size="sm">
                          <MessageCircle className="h-3 w-3 mr-2" />
                          {t.askQuestion}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{t.haveQuestions}</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-2">{t.weAnswerSoon}</p>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="qname">{t.yourName}</Label>
                            <Input id="qname" value={questionName} onChange={(e) => setQuestionName(e.target.value)} placeholder={t.namePlaceholder} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="qemail">{t.yourEmail}</Label>
                            <Input id="qemail" type="email" value={questionEmail} onChange={(e) => setQuestionEmail(e.target.value)} placeholder="din@email.se" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="question">{t.yourQuestion}</Label>
                            <Textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t.questionPlaceholder} rows={4} />
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setQuestionModalOpen(false)}>{t.cancel}</Button>
                            <Button onClick={handleAskQuestion} disabled={questionSubmitting || !question.trim() || !questionName.trim()}>
                              {questionSubmitting ? t.sending : t.sendQuestion}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Reminder */}
                    <Dialog open={reminderModalOpen} onOpenChange={setReminderModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-primary/30 hover:bg-primary/5" disabled={isExpired} size="sm">
                          <Bell className="h-3 w-3 mr-2" />
                          {t.remindMe}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle>{t.saveForLater}</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-2">{t.reminderDesc}</p>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="remail">{t.yourEmailRequired}</Label>
                            <Input id="remail" type="email" value={reminderEmail} onChange={(e) => setReminderEmail(e.target.value)} placeholder="din@email.se" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="days">{t.remindIn}</Label>
                            <RadioGroup value={reminderDays} onValueChange={setReminderDays}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="d1" />
                                <Label htmlFor="d1">{t.day1}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id="d3" />
                                <Label htmlFor="d3">{t.days3}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="7" id="d7" />
                                <Label htmlFor="d7">{t.week1}</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setReminderModalOpen(false)}>{t.cancel}</Button>
                            <Button onClick={handleSetReminder} disabled={reminderSubmitting || !reminderEmail.trim()}>
                              {reminderSubmitting ? t.creating : t.createReminder}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Q&A Section */}
          {quote && quote.questions && quote.questions.length > 0 && (
            <Card className="border-primary/20 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  {t.questionsAndAnswers}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.qaSubtitle}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {quote.questions.map((q) => {
                  const isAdminQ = q.asked_by === 'admin';
                  return (
                    <div key={q.id} className={`border rounded-lg p-4 space-y-3 ${isAdminQ ? 'border-blue-200 bg-blue-50/50' : 'border-border'}`}>
                      <div className="space-y-1">
                        <div className="flex items-start gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAdminQ ? 'bg-blue-100' : 'bg-primary/10'}`}>
                            {isAdminQ ? (
                              <Store className="h-4 w-4 text-blue-600" />
                            ) : (
                              <MessageCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${isAdminQ ? 'text-blue-700' : 'text-muted-foreground'}`}>
                              {isAdminQ ? t.fixcoQuestion : q.customer_name}
                            </p>
                            <p className="text-sm text-foreground mt-1">{q.question}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(q.asked_at).toLocaleDateString(dateLocale, {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {q.answered && q.answer ? (
                        <div className="ml-10 pl-4 border-l-2 border-primary/30 space-y-1">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-primary">
                                {isAdminQ ? q.customer_name || quote.customer_name : t.answerFromFixco}
                              </p>
                              <p className="text-sm text-foreground mt-1">{q.answer}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(q.answered_at!).toLocaleDateString(dateLocale, {
                                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : isAdminQ ? (
                        <div className="ml-10">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                              setAnswerQuestionId(q.id);
                              setAnswerText('');
                              setAnswerName(quote.customer_name || '');
                              setAnswerModalOpen(true);
                            }}
                          >
                            <Send className="h-3 w-3" />
                            {t.sendAnswer}
                          </Button>
                        </div>
                      ) : (
                        <div className="ml-10 pl-4 border-l-2 border-border">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {t.awaitingAnswer}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Answer Admin Question Dialog */}
          <Dialog open={answerModalOpen} onOpenChange={(open) => {
            if (!open) {
              setAnswerModalOpen(false);
              setAnswerQuestionId(null);
              setAnswerText('');
              setAnswerName('');
            }
          }}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t.fixcoQuestion}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {answerQuestionId && quote?.questions && (
                  <div className="bg-blue-50 p-3 rounded-lg border-l-2 border-blue-400">
                    <p className="text-sm">{quote.questions.find(q => q.id === answerQuestionId)?.question}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>{t.answerName}</Label>
                  <Input
                    value={answerName}
                    onChange={(e) => setAnswerName(e.target.value)}
                    placeholder={t.namePlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.yourAnswer}</Label>
                  <Textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder={t.answerPlaceholder}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setAnswerModalOpen(false)}>{t.cancel}</Button>
                  <Button
                    onClick={handleAnswerAdminQuestion}
                    disabled={answerSubmitting || !answerText.trim() || !answerName.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {answerSubmitting ? t.sending : t.sendAnswer}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <span>{t.questionsLabel}</span>
              <a href="mailto:info@fixco.se" className="hover:text-primary flex items-center gap-1">
                <Mail className="h-3 w-3" />
                info@fixco.se
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
