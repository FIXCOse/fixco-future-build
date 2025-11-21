import { ReactNode, useEffect } from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useRole } from '@/hooks/useRole';
import { Wrench, Shield, Phone, Mail, Clock, Zap, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/v2/GlassCard';
import { GradientText } from '@/components/v2/GradientText';
import { AnimatedFixcoFIcon } from '@/components/icons/AnimatedFixcoFIcon';
import { Button } from '@/components/ui/button';
import { openServiceRequestModal } from '@/features/requests/ServiceRequestModal';

interface MaintenanceGateProps {
  children: ReactNode;
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const { data: maintenanceEnabled, isLoading: flagLoading, refetch } = useFeatureFlag('maintenance_mode');
  const { isAdmin, isOwner, loading: roleLoading } = useRole();

  // Force refetch when component mounts to ensure we have the latest value
  useEffect(() => {
    refetch();
  }, [refetch]);

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
        {/* Admin Login Button - Fixed Top Right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed top-6 right-6 z-50"
        >
          <Link to="/auth">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-md border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Login
            </Button>
          </Link>
        </motion.div>

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
            {/* Animated Fixco Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="mb-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AnimatedFixcoFIcon className="h-32 w-32 mx-auto" />
              </motion.div>
            </motion.div>

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


            {/* Emergency Quote Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <GlassCard 
                className="p-8 max-w-md mx-auto bg-gradient-to-br from-orange-500/5 to-red-500/5 border-orange-500/20"
                hoverEffect
                glowColor="hsl(25 95% 53% / 0.3)"
                innerGlow
              >
                <div className="text-center space-y-6">
                  {/* Animated Zap Icon */}
                  <motion.div 
                    className="flex justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="p-3 rounded-full bg-orange-500/10 relative">
                      <Zap className="h-8 w-8 text-orange-500" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-orange-500/20"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold">
                    Har du <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">bråttom</span>?
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    Vi är här för dig! Ring oss direkt eller begär offert så hör vi av oss så snart vi är tillbaka.
                  </p>

                  {/* Telefonnummer */}
                  <motion.a
                    href="tel:0733945650"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 p-4 rounded-lg bg-orange-500/10 hover:bg-orange-500/15 transition-colors group"
                  >
                    <div className="p-2 rounded-full bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                      <Phone className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Ring oss nu</p>
                      <p className="font-semibold text-lg text-foreground">073-394 56 50</p>
                    </div>
                  </motion.a>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-orange-500/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">eller</span>
                    </div>
                  </div>

                  {/* Offert Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                  <Button
                      onClick={() => openServiceRequestModal({ serviceSlug: undefined })}
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Begär Offert Nu
                    </Button>
                  </motion.div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Svar inom 24h efter vi är tillbaka</span>
                  </div>
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
