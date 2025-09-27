import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, MapPin, Calendar, Euro } from "lucide-react";

interface Reference {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  duration: string;
  budget: string;
  rotSaving: string;
  image: string;
  description: string;
  services: string[];
  quote: string;
  client: string;
  rating: number;
  beforeAfter: {
    before: string;
    after: string;
  };
}

interface EditableReferenceGridProps {
  initialReferences: Reference[];
}


const EditableReferenceGrid: React.FC<EditableReferenceGridProps> = ({ initialReferences }) => {

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {initialReferences.map((ref) => (
        <ReferenceCard key={ref.id} reference={ref} />
      ))}
    </div>
  );
};

const ReferenceCard: React.FC<{ reference: Reference }> = ({ reference: ref }) => (
  <>
    {/* Project Image */}
    <div className="relative h-48 bg-gradient-to-r from-primary/20 to-accent/20">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">🏠</div>
          <div className="text-sm">{ref.title}</div>
        </div>
      </div>
      <Badge className="absolute top-4 left-4">{ref.category}</Badge>
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
        <Star className="h-3 w-3 fill-current text-yellow-500" />
        <span className="text-xs font-medium">{ref.rating}.0</span>
      </div>
    </div>

    <div className="p-6">
      {/* Project Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">{ref.title}</h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{ref.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{ref.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Euro className="h-4 w-4" />
            <span>{ref.budget}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground mb-4">{ref.description}</p>

      {/* Services */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ref.services.map(service => (
          <Badge key={service} variant="secondary">{service}</Badge>
        ))}
      </div>

      {/* ROT Saving */}
      {ref.rotSaving !== "0 kr" && (
        <div className="p-3 bg-primary/10 rounded-lg mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">ROT-besparing: </span>
            <span className="font-bold text-primary">{ref.rotSaving}</span>
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="relative p-4 bg-muted/20 rounded-lg mb-4">
        <Quote className="h-6 w-6 text-primary mb-2" />
        <p className="text-sm italic mb-2">"{ref.quote}"</p>
        <p className="text-xs text-muted-foreground font-medium">– {ref.client}</p>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Projekttid:</span>
          <div className="font-medium">{ref.duration}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Total investering:</span>
          <div className="font-medium">{ref.budget}</div>
        </div>
      </div>
    </div>
  </>
);

export default EditableReferenceGrid;