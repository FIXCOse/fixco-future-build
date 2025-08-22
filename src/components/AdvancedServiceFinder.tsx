import { useState, useMemo } from "react";
import { Search, Filter, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button-premium";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { servicesData, SubService } from "@/data/servicesData";

interface AdvancedServiceFinderProps {
  onServiceSelect?: (service: SubService) => void;
  className?: string;
}

const AdvancedServiceFinder = ({ onServiceSelect, className = "" }: AdvancedServiceFinderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("alla");
  const [selectedPriceType, setSelectedPriceType] = useState<string>("alla");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("alla");
  const [selectedLocation, setSelectedLocation] = useState<string>("alla");
  const [rotOnly, setRotOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get all sub-services
  const allSubServices = useMemo(() => {
    return servicesData.flatMap(service => 
      service.subServices.map(subService => ({
        ...subService,
        parentService: service.title
      }))
    );
  }, []);

  // Get unique filter options
  const categories = useMemo(() => {
    const cats = new Set(allSubServices.map(s => s.category));
    return Array.from(cats).sort();
  }, [allSubServices]);

  // Filter services
  const filteredServices = useMemo(() => {
    return allSubServices.filter(service => {
      const matchesSearch = searchQuery === "" || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.parentService.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "alla" || service.category === selectedCategory;
      const matchesPriceType = selectedPriceType === "alla" || service.priceType === selectedPriceType;
      const matchesDifficulty = selectedDifficulty === "alla" || service.difficulty === selectedDifficulty;
      const matchesLocation = selectedLocation === "alla" || 
        service.location === selectedLocation || 
        service.location === "båda";
      const matchesRot = !rotOnly || service.rotEligible;

      return matchesSearch && matchesCategory && matchesPriceType && 
             matchesDifficulty && matchesLocation && matchesRot;
    });
  }, [allSubServices, searchQuery, selectedCategory, selectedPriceType, 
      selectedDifficulty, selectedLocation, rotOnly]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("alla");
    setSelectedPriceType("alla");
    setSelectedDifficulty("alla");
    setSelectedLocation("alla");
    setRotOnly(false);
  };

  const activeFiltersCount = [
    selectedCategory !== "alla",
    selectedPriceType !== "alla", 
    selectedDifficulty !== "alla",
    selectedLocation !== "alla",
    rotOnly
  ].filter(Boolean).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Sök efter tjänst, ex: 'eluttag', 'köksblandare'..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 h-12 text-base"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost-premium" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Uppsala & Stockholm</span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card-premium p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filtrera tjänster</h3>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Rensa alla
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Kategori</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alla">Alla kategorier</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Prissättning</label>
              <Select value={selectedPriceType} onValueChange={setSelectedPriceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alla">Alla pristyper</SelectItem>
                  <SelectItem value="fast">Fast pris</SelectItem>
                  <SelectItem value="timpris">Timpris</SelectItem>
                  <SelectItem value="offert">Offert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Svårighetsgrad</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alla">Alla svårighetsgrader</SelectItem>
                  <SelectItem value="enkel">Enkel</SelectItem>
                  <SelectItem value="mellan">Mellan</SelectItem>
                  <SelectItem value="avancerad">Avancerad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Plats</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alla">Alla platser</SelectItem>
                  <SelectItem value="inomhus">Inomhus</SelectItem>
                  <SelectItem value="utomhus">Utomhus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ROT Filter */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium mb-2 block">ROT-berättigad</label>
              <Button
                variant={rotOnly ? "premium" : "outline"}
                onClick={() => setRotOnly(!rotOnly)}
                className="w-full justify-start"
              >
                {rotOnly ? "Endast ROT-berättigade" : "Alla tjänster"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredServices.length} tjänster funna
          </h3>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              Sökning: "{searchQuery}"
            </p>
          )}
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Inga tjänster matchade dina sökkriterier
            </p>
            <Button variant="ghost-premium" onClick={clearFilters}>
              Rensa filter och försök igen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map(service => (
              <div key={service.id} className="card-premium p-4 hover:shadow-glow transition-all duration-300">
                <div className="space-y-3">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{service.title}</h4>
                      <Badge 
                        variant={service.rotEligible ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {service.rotEligible ? "ROT" : "EJ ROT"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {service.description}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Kategori:</span>
                      <span>{service.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Typ:</span>
                      <span className="capitalize">{service.difficulty}</span>
                    </div>
                    {service.room && (
                      <div className="flex justify-between">
                        <span>Rum:</span>
                        <span>{service.room}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-border pt-3">
                    {service.rotEligible ? (
                      <>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-muted-foreground">Ordinarie:</span>
                          <span className="line-through text-muted-foreground">
                            {service.basePrice}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-medium text-xs">Med ROT:</span>
                          <span className="font-bold text-primary">
                            {service.rotPrice}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Pris:</span>
                        <span className="font-semibold">{service.basePrice}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Button 
                    variant="premium"
                    size="sm" 
                    className="w-full"
                    onClick={() => onServiceSelect?.(service)}
                  >
                    {service.priceType === 'offert' ? 'Begär offert' : 'Boka nu'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedServiceFinder;