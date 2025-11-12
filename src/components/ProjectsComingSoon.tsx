import { motion } from "framer-motion";
import { Image, Sparkles, Loader2 } from "lucide-react";
import { GradientText } from "@/components/v2/GradientText";

export const ProjectsComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 min-h-[400px]">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
        className="mb-8"
      >
        <div className="relative">
          <Image className="h-24 w-24 text-primary/20" />
          <Sparkles className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </motion.div>

      <h3 className="text-3xl font-bold mb-4 text-center">
        <GradientText gradient="rainbow">
          Projektbilder kommer inom kort
        </GradientText>
      </h3>

      <p className="text-muted-foreground text-center max-w-md mb-8">
        Vi håller på att ladda upp våra bästa projekt. Återkom snart för att se fantastiska före- och efterbilder!
      </p>

      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Förbereder innehåll...</span>
      </motion.div>
    </div>
  );
};
