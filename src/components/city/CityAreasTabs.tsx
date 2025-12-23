import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, ChevronRight, Users, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAreaActivity } from "@/data/areaActivityData";
import { AreaKey } from "@/data/localServiceData";

interface CityAreasTabsProps {
  cityName: string;
  areas: string[];
  categoryMap?: Record<string, string[]>;
}

// Default kategorisering för Uppsala - synkat med UPPSALA_AREAS
const defaultUppsalaCategories: Record<string, string[]> = {
  "alla": [],  // Alla områden
  "centralt": ["Uppsala", "Gränby", "Eriksberg", "Sävja"],
  "norr": ["Storvreta", "Björklinge", "Bälinge", "Gamla Uppsala", "Vattholma", "Skyttorp", "Lövstalöt"],
  "soder": ["Gottsunda", "Sunnersta", "Ultuna", "Alsike", "Knivsta"],
};

// Default kategorisering för Stockholm - synkat med STOCKHOLM_AREAS
const defaultStockholmCategories: Record<string, string[]> = {
  "alla": [],
  "innerstad": ["Stockholm", "Södermalm", "Vasastan", "Östermalm", "Kungsholmen"],
  "norr": ["Solna", "Sundbyberg", "Täby", "Danderyd", "Lidingö", "Vallentuna", "Upplands Väsby", "Sigtuna", "Märsta"],
  "soder": ["Huddinge", "Botkyrka", "Haninge", "Tyresö", "Nacka", "Nynäshamn", "Salem", "Södertälje"],
  "vast": ["Bromma", "Ekerö", "Järfälla", "Sollentuna", "Upplands-Bro", "Hägersten"],
};

const categoryLabels: Record<string, string> = {
  "alla": "Alla områden",
  "centralt": "Centralt",
  "innerstad": "Innerstaden",
  "norr": "Norr",
  "soder": "Söder",
  "vast": "Väster",
};

export const CityAreasTabs = ({ cityName, areas, categoryMap }: CityAreasTabsProps) => {
  // Bestäm kategorisering baserat på stad
  const categories = categoryMap || 
    (cityName === "Stockholm" ? defaultStockholmCategories : defaultUppsalaCategories);
  
  // Sätt "alla" till alla områden
  categories["alla"] = areas;

  const categoryKeys = Object.keys(categories).filter(k => categories[k].length > 0 || k === "alla");

  return (
    <Tabs defaultValue="alla" className="w-full">
      <TabsList className="flex flex-wrap justify-start gap-2 bg-transparent h-auto p-0 mb-8">
        {categoryKeys.map((cat) => (
          <TabsTrigger
            key={cat}
            value={cat}
            className="px-5 py-2.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-all"
          >
            {categoryLabels[cat] || cat}
          </TabsTrigger>
        ))}
      </TabsList>

      {categoryKeys.map((cat) => (
        <TabsContent key={cat} value={cat} className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {(cat === "alla" ? areas : categories[cat]).map((area, idx) => (
              <AreaCard key={area} area={area} index={idx} />
            ))}
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

interface AreaCardProps {
  area: string;
  index: number;
}

const AreaCard = ({ area, index }: AreaCardProps) => {
  const activity = getAreaActivity(area as AreaKey);
  const areaSlug = area.toLowerCase().replace(/\s+/g, "-").replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Link
        to={`/tjanster/snickare/${areaSlug}`}
        className="group flex flex-col p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-primary/30 hover:scale-[1.02] transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {area}
            </h3>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {activity.recentProjects} projekt
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            {activity.avgRating.toFixed(1)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
