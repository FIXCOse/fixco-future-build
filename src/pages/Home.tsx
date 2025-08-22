import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ComparisonAnimation from "@/components/ComparisonAnimation";
import ServicesOverview from "@/components/ServicesOverview";
import { Button } from "@/components/ui/button-premium";
import { ArrowRight, CheckCircle, Star, Quote } from "lucide-react";
import finishedProject from "@/assets/finished-project.jpg";
import toolsImage from "@/assets/tools-professional.jpg";

const Home = () => {
  console.log("Home component is loading...");
  
  const usps = [
    {
      icon: CheckCircle,
      title: "Snabb service",
      description: "Start inom 24h för de flesta projekt. Vi förstår att tid är pengar."
    },
    {
      icon: CheckCircle,
      title: "Lägre pris",
      description: "480 kr/h med ROT-avdrag. 50% rabatt på arbetskostnaden."
    },
    {
      icon: CheckCircle,
      title: "Helhetslösning",
      description: "Allt inom bygg, mark, montering & service från en leverantör."
    },
    {
      icon: CheckCircle,
      title: "Nationell räckvidd",
      description: "Stora projekt i hela Sverige. Lokala team med nationell styrka."
    }
  ];

  const testimonials = [
    {
      name: "Anna Lindström",
      company: "Lindström Bygg AB",
      text: "Fixco levererade vårt kontorsprojekt 3 veckor före deadline. Otrolig kvalitet och professionalism!",
      rating: 5,
      project: "Kontorsrenovering 800m²"
    },
    {
      name: "Lars Eriksson", 
      company: "Privatperson",
      text: "Fantastisk service från start till mål. ROT-avdraget gjorde det mycket prisvärt. Rekommenderar starkt!",
      rating: 5,
      project: "Kök & badrumsrenovering"
    },
    {
      name: "Maria Johansson",
      company: "Johansson Fastigheter",
      text: "Fixco har varit vår partner i 3 år. Pålitliga, kompetenta och alltid levererar i tid.",
      rating: 5,
      project: "Löpande fastighetsunderhåll"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">FIXCO DEBUG</h1>
      <p className="text-xl mb-4">If you can see this, React is working</p>
      <div className="bg-red-500 p-4 rounded">
        <p>This should be a red box with white text</p>
      </div>
      
      {/* Minimal navigation test */}
      <div className="mt-8">
        <div className="text-2xl font-bold text-green-500">FIXCO</div>
      </div>
    </div>
  );
};

export default Home;