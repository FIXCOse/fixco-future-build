import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { sv, enUS } from "date-fns/locale";
import type { Locale } from "@/i18n/context";

interface ReferenceProject {
  id: string;
  title_sv: string;
  title_en?: string;
  description_sv?: string;
  description_en?: string;
  location: string;
  completion_date?: string;
  category?: string;
  rating?: number;
  client_initials?: string;
  rot_savings?: number;
  rut_savings?: number;
  price?: number;
  images: string[];
}

interface ReferenceProjectCardProps {
  project: ReferenceProject;
  locale: Locale;
  isAdmin: boolean;
  isEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export const ReferenceProjectCard = ({
  project,
  locale,
  isAdmin,
  isEditMode,
  onEdit,
  onDelete,
  onView,
}: ReferenceProjectCardProps) => {
  const title = locale === "en" && project.title_en ? project.title_en : project.title_sv;
  const firstImage = project.images[0] || "/placeholder.svg";
  const totalSavings = (project.rot_savings || 0) + (project.rut_savings || 0);

  const formattedDate = project.completion_date
    ? format(new Date(project.completion_date), "MMM yyyy", {
        locale: locale === "sv" ? sv : enUS,
      })
    : null;

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={onView}
    >
      {/* Image with gradient overlay */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={firstImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Category badge */}
        {project.category && (
          <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
            {project.category}
          </Badge>
        )}

        {/* ROT/RUT savings badge */}
        {totalSavings > 0 && (
          <Badge className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white">
            {totalSavings.toLocaleString("sv-SE")} kr besparingar
          </Badge>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Client initials */}
        {project.client_initials && (
          <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm">
            {project.client_initials}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4 space-y-3">
        {/* Rating */}
        {project.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < project.rating!
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {project.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Location and date */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{project.location}</span>
          </div>
          {formattedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Price */}
        {project.price && (
          <div className="text-sm font-medium">
            {project.price.toLocaleString("sv-SE")} kr
          </div>
        )}

        {/* Admin buttons */}
        {isAdmin && isEditMode && (
          <div className="flex gap-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="h-4 w-4 mr-1" />
              Redigera
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* View button (always visible) */}
        {!isEditMode && (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visa projekt
          </Button>
        )}
      </div>
    </Card>
  );
};
