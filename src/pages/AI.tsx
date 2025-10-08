import { Helmet } from "react-helmet-async";
import { Chat } from "@/features/ai/Chat";
import { ImageEditor } from "@/features/ai/ImageEditor";
import { QuotePreview } from "@/features/ai/QuotePreview";
import { Bot, Sparkles } from "lucide-react";
import { useCopy } from "@/copy/CopyProvider";

export default function AI() {
  const { t } = useCopy();
  
  return (
    <>
      <Helmet>
        <title>{t('ai.page_title')}</title>
        <meta 
          name="description" 
          content={t('ai.page_subtitle')}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">{t('ai.powered_by')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t('ai.hero_title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('ai.hero_subtitle')}
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
              <h3 className="font-semibold mb-2">{t('ai.feature1_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai.feature1_desc')}
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">{t('ai.feature2_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai.feature2_desc')}
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <Bot className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">{t('ai.feature3_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai.feature3_desc')}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>{t('ai.disclaimer_title')}</strong> {t('ai.disclaimer_text')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
