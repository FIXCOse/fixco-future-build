import { Helmet } from "react-helmet-async";
import { Chat } from "@/features/ai/Chat";
import { ImageEditor } from "@/features/ai/ImageEditor";
import { QuotePreview } from "@/features/ai/QuotePreview";
import { Bot, Sparkles } from "lucide-react";

export default function AI() {
  return (
    <>
      <Helmet>
        <title>Fixco AI Concierge - Smarta hemtjänster med AI</title>
        <meta 
          name="description" 
          content="Chatta med Fixco AI, få visualiseringar på dina bilder, och få snabba offert-estimat med ROT-avdrag. Uppsala & Stockholm." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Powered by AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Fixco AI Concierge
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Din smarta assistent för hemrenoveringar. Få råd, visualiseringar och offerter direkt.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <Chat />
            </div>

            {/* Side Panel - Tools */}
            <div className="space-y-6">
              <ImageEditor />
              <QuotePreview />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-card border">
              <Bot className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Expertråd 24/7</h3>
              <p className="text-sm text-muted-foreground">
                Få professionella råd om byggnation, renovering och inredning när du behöver det
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">AI-visualiseringar</h3>
              <p className="text-sm text-muted-foreground">
                Se hur ditt hem kan se ut efter renoveringen - direkt på dina egna bilder
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <Bot className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Snabba offerter</h3>
              <p className="text-sm text-muted-foreground">
                Få preliminära offerter med ROT-beräkning på några sekunder
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>OBS:</strong> Fixco AI är en assistent som ger preliminära råd och visualiseringar. 
              Slutliga offerter och bedömningar görs alltid av våra professionella hantverkare. 
              ROT-avdrag bedöms slutligt av Skatteverket.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
