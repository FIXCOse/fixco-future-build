import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Testimonial {
  name: string;
  location: string;
  project: string;
  rating: number;
  quote: string;
  avatar: string;
  savings?: string;
}

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      name: "Maria Andersson",
      location: "Södermalm, Stockholm",
      project: "Kök & badrumsrenovering",
      rating: 5,
      quote: "Otroligt professionella och snabba. Började redan dagen efter offerten och levererade exakt vad som lovades. Med ROT-avdraget sparade vi 45,000 kr!",
      avatar: "MA",
      savings: "45,000 kr"
    },
    {
      name: "Johan Eriksson",
      location: "Luthagen, Uppsala",
      project: "Komplett takbyte",
      rating: 5,
      quote: "Fixco hanterade allt från A till Ö. Fantastisk kvalitet till oslagbart pris. ROT-avdraget gjorde det extra lönsamt.",
      avatar: "JE",
      savings: "62,000 kr"
    },
    {
      name: "Anna Nilsson",
      location: "Vasastan, Stockholm",
      project: "Trädgård & altan",
      rating: 5,
      quote: "Förvandlade vår trädgård till en oas på rekordtid. Personalen var kunnig och hjälpsam genom hela processen.",
      avatar: "AN",
      savings: "28,000 kr"
    },
    {
      name: "Peter Lindström",
      location: "Centrum, Uppsala",
      project: "El & VVS-renovering",
      rating: 5,
      quote: "Snabb service och transparent prissättning. Fick det gjort på halva tiden jämfört med andra offerter vi fick.",
      avatar: "PL",
      savings: "33,000 kr"
    },
    {
      name: "Sofia Bergman",
      location: "Östermalm, Stockholm",
      project: "Köksrenovering total",
      rating: 5,
      quote: "Resultatet överträffade våra förväntningar. Mycket professionellt team som höll alla tidsramar.",
      avatar: "SB",
      savings: "78,000 kr"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-24 bg-gradient-primary-subtle relative">
      {/* F Watermark Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <img 
          src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
          alt="" 
          className="absolute top-20 left-20 w-16 h-16 object-contain rotate-12 opacity-30 animate-pulse"
          style={{ animationDuration: '5s' }}
        />
        <img 
          src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
          alt="" 
          className="absolute bottom-20 right-20 w-20 h-20 object-contain -rotate-6 opacity-25 animate-pulse"
          style={{ animationDuration: '4s', animationDelay: '2s' }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Våra kunder <span className="gradient-text">älskar oss</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Se vad våra nöjda kunder säger om Fixco
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="card-premium p-8 md:p-12 text-center relative">
                    {/* ROT Savings Badge */}
                    {testimonial.savings && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                          Sparade {testimonial.savings}
                        </div>
                      </div>
                    )}

                    {/* F Brand Badge - Top Left to Avoid Conflict */}
                    <div className="absolute top-4 left-4 w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
                      <img 
                        src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                        alt="Fixco" 
                        className="h-3.5 w-3.5 object-contain opacity-90"
                      />
                    </div>

                    {/* Quote Icon */}
                    <Quote className="h-12 w-12 text-primary/20 mx-auto mb-6" />
                    
                    {/* Stars */}
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-6 w-6 text-yellow-400 fill-current mx-1 animate-scale-in" 
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg md:text-xl text-foreground mb-8 italic leading-relaxed max-w-4xl mx-auto">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Customer Info */}
                    <div className="flex items-center justify-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      
                      <div className="text-left">
                        <div className="font-semibold text-primary text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {testimonial.location}
                        </div>
                        <div className="text-accent text-sm font-medium">
                          {testimonial.project}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background border border-border"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background border border-border"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-primary scale-125" 
                    : "bg-border hover:bg-primary/50"
                )}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isAutoPlaying ? "Pausa automatisk" : "Starta automatisk"} visning
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;