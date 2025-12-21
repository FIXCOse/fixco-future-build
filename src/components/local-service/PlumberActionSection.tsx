import { motion } from "framer-motion";
import { Shield, Percent, Droplets } from "lucide-react";
import plumberImage from "@/assets/vvs-tekniker-badrum.webp";

interface PlumberActionSectionProps {
  area: string;
}

export const PlumberActionSection = ({ area }: PlumberActionSectionProps) => {
  const usps = [
    { icon: Shield, text: "Certifierade rörmokare" },
    { icon: Percent, text: "ROT-avdrag 30%" },
    { icon: Droplets, text: "Akutservice" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-[300px] md:h-[400px] overflow-hidden group"
    >
      {/* Background image with hover-zoom */}
      <img
        src={plumberImage}
        alt={`Fixco VVS-tekniker arbetar i badrum i ${area}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Lokala VVS-tekniker i {area}
          </h2>
          <div className="flex flex-wrap gap-3">
            {usps.map((usp, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm"
              >
                <usp.icon className="h-4 w-4 text-primary" />
                <span>{usp.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
