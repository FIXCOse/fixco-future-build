import { motion } from "framer-motion";
import { GradientText } from "@/components/v2/GradientText";
import { GlassCard } from "@/components/v2/GlassCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Quote, Star } from "lucide-react";
import { containerVariants, scaleUp, viewportConfig } from "@/utils/scrollAnimations";

const testimonials = [
  {
    name: "Erik Andersson",
    role: "Snickare",
    years: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    quote: "Fixco har gett mig möjlighet att växa både professionellt och personligt. Flexibiliteten och stödet från teamet är oslagbart.",
    rating: 5
  },
  {
    name: "Maria Lindström",
    role: "Elektriker",
    years: 3,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    quote: "Här känner man sig verkligen uppskattad. Bra lön, roliga projekt och fantastiska kollegor. Kan inte tänka mig att jobba någon annanstans.",
    rating: 5
  },
  {
    name: "Johan Bergqvist",
    role: "VVS-montör",
    years: 7,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    quote: "Fixco investerar i sina medarbetare. Jag har fått utbildning och certifieringar som har tagit min karriär till nästa nivå.",
    rating: 5
  },
  {
    name: "Sara Pettersson",
    role: "Målare",
    years: 4,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    quote: "Balansen mellan arbete och fritid är perfekt. Jag kan planera mina pass och ändå ha tid för familjen. Fixco förstår vad som är viktigt.",
    rating: 5
  }
];

export const CareersTeam = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText>Möt teamet</GradientText>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hör vad våra medarbetare säger om att jobba på Fixco
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto mb-16"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-2">
                    <TestimonialCard testimonial={testimonial} index={index} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm hover:bg-background z-10" />
            <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm hover:bg-background z-10" />
          </Carousel>
        </motion.div>

        {/* Team Grid with Cascade Effect */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-center mb-10">
            <GradientText gradient="blue">Bli en del av familjen</GradientText>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.5,
                      delay: i * 0.05
                    }
                  }
                }}
                whileHover={{ scale: 1.05, rotate: 2, zIndex: 10 }}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img 
                  src={`https://images.unsplash.com/photo-${
                    ['1506794778202', '1519085360753', '1517841905240', '1534528741775', 
                     '1573497019940', '1580489944761', '1507003211169', '1438761681033'][i]
                  }-d5538e0ca943?w=400&h=400&fit=crop`}
                  alt="Team member"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <p className="font-semibold">Medarbetare</p>
                    <p className="text-sm text-white/80">
                      {['Snickare', 'Elektriker', 'VVS', 'Målare', 'Trädgård', 'Städ', 'Montering', 'Markarbeten'][i]}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  index: number;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <GlassCard className="p-6 h-full" hoverEffect={true}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img 
              src={testimonial.image} 
              alt={testimonial.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-primary-foreground fill-current" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            <p className="text-xs text-muted-foreground">{testimonial.years} år på Fixco</p>
          </div>
        </div>

        <div className="flex gap-1 mb-3">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <div className="relative flex-1">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
          <p className="text-sm text-foreground/80 italic pl-6">
            "{testimonial.quote}"
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
