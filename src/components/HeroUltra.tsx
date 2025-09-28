import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronRight, Phone, Award, Users, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import MagneticButton from "@/components/MagneticButton";
import TrustChips from "@/components/TrustChips";
import useProgressiveEnhancement from "@/hooks/useProgressiveEnhancement";
import { useCopy } from "@/copy/CopyProvider";

const HeroUltra = () => {
  const { t } = useCopy();

  const trustIndicators = [
    { icon: "image", src: "/assets/fixco-f-icon-new.png", title: "Fixco Kvalitet", description: "Vårt löfte till dig" },
    { icon: Award, title: "Lägst pris (ROT)", description: "480 kr/h efter ROT-avdrag" },
    { icon: Users, title: "2000+ kunder", description: "Genomsnittligt betyg 4.9/5" },
    { icon: MapPin, title: "Uppsala & Stockholm", description: "Nationellt vid större projekt" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        {/* Background System - Progressive Enhancement */}
        <div className="absolute inset-0">
          {/* Base gradient (always visible) */}
          <div className="absolute inset-0 hero-background" />
          
        {/* F Watermark Background Elements - Static */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <img 
            src="/assets/fixco-f-icon-new.png"
            alt="" 
            className="absolute top-16 left-8 w-32 h-32 object-contain rotate-12 opacity-40"
          />
          <img 
            src="/assets/fixco-f-icon-new.png"
            alt="" 
            className="absolute bottom-16 right-8 w-24 h-24 object-contain -rotate-12 opacity-30"
          />
          <img 
            src="/assets/fixco-f-icon-new.png"
            alt="" 
            className="absolute top-1/4 right-12 w-28 h-28 object-contain rotate-45 opacity-25"
          />
          <img 
            src="/assets/fixco-f-icon-new.png" 
            alt="" 
            className="absolute bottom-1/3 left-12 w-20 h-20 object-contain -rotate-6 opacity-35"
          />
        </div>
          
          {/* Static gradient - no animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-6xl xl:text-7xl font-bold leading-tight mb-6 px-2 text-foreground">
              {t('home.hero.title')}
            </h1>
            
            <p className="text-base md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
              {t('home.hero.subtitle')}
            </p>

            {/* Static CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
              <Link to="/kontakt">
                <MagneticButton className="bg-primary text-primary-foreground text-lg px-8 py-4">
                  {t('home.hero.primaryCta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MagneticButton>
              </Link>
              <Link to="/tjanster">
                <MagneticButton
                  variant="outline"
                  className="text-lg px-8 py-4 border-primary/30 hover:bg-primary/10"
                >
                  {t('common.services')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </MagneticButton>
              </Link>
            </div>

            {/* Trust Indicators - Horizontal Layout */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto mb-8 px-4">
              {trustIndicators.map((item, index) => {
                return (
                  <div
                    key={item.title}
                    className="card-service p-6 text-center border-primary/20"
                  >
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      {item.icon === "image" ? (
                        <img 
                          src={item.src} 
                          alt="Fixco Brand" 
                          className="h-8 w-8 object-contain opacity-90"
                        />
                      ) : (
                        (() => {
                          const IconComponent = item.icon as any;
                          return <IconComponent className="h-6 w-6 text-primary" />;
                        })()
                      )}
                    </div>
                    <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Trust Chips - All Visible */}
            <div className="max-w-4xl mx-auto">
              <TrustChips 
                variant="home" 
                showAll={true}
                className="flex flex-wrap items-center justify-center gap-3 pt-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Static scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-primary rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default HeroUltra;