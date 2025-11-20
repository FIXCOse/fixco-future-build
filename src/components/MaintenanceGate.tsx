import { ReactNode } from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useRole } from '@/hooks/useRole';
import { Wrench, Shield, Phone, Mail, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/v2/GlassCard';
import { GradientText } from '@/components/v2/GradientText';

interface MaintenanceGateProps {
  children: ReactNode;
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const { data: maintenanceEnabled, isLoading: flagLoading } = useFeatureFlag('maintenance_mode');
  const { isAdmin, isOwner, loading: roleLoading } = useRole();

  if (flagLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const shouldShowMaintenancePage = maintenanceEnabled && !isAdmin && !isOwner;

  if (shouldShowMaintenancePage) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />
        </div>

        {/* Floating Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-3xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Animated Icon Section */}
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Pulsing Background */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Rotating Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Icon Container */}
                <GlassCard 
                  className="relative p-10 rounded-full"
                  hoverEffect={false}
                  glowColor="hsl(var(--primary) / 0.4)"
                  innerGlow
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Wrench className="h-24 w-24 text-primary drop-shadow-2xl" />
                  </motion.div>
                </GlassCard>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Vi är <GradientText gradient="rainbow">strax tillbaka</GradientText>!
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Fixco genomgår för tillfället planerat underhåll för att förbättra din upplevelse.
              </p>

              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-4 w-4 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium text-primary">Under arbete</span>
                </div>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="max-w-md mx-auto"
              >
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
                    animate={{
                      backgroundPosition: ["0% 0%", "200% 0%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ width: "75%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" />
                  Vi beräknar att vara tillbaka inom kort
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <GlassCard 
                className="p-8 max-w-md mx-auto"
                hoverEffect
                glowColor="hsl(var(--primary) / 0.2)"
                innerGlow
              >
                <h3 className="text-lg font-semibold mb-6">Behöver du akut hjälp?</h3>
                <div className="space-y-4">
                  <motion.a
                    href="tel:08-123 456 78"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-muted-foreground">Ring oss</p>
                      <p className="font-medium text-foreground">08-123 456 78</p>
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href="mailto:info@fixco.se"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors group"
                  >
                    <div className="p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">info@fixco.se</p>
                    </div>
                  </motion.a>
                </div>
              </GlassCard>
            </motion.div>

            {/* Admin Badge */}
            {(isAdmin || isOwner) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <GlassCard className="p-4 max-w-md mx-auto bg-yellow-500/5 border-yellow-500/20">
                  <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Administratörsläge</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Du har admin-behörighet. Detta meddelande visas för andra användare.
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
