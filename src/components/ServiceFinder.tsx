import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button-premium";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Clock, Euro, Star } from "lucide-react";

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  rotPrice: number;
  type: 'hourly' | 'fixed';
  location: 'local' | 'national';
  rating: number;
  tags: string[];
}

const mockServices: Service[] = [
  {
    id: '1',
    title: 'Byta toalettstol',
    category: 'VVS',
    description: 'Komplett byte av toalettstol inklusive installation',
    price: 3500,
    rotPrice: 1750,
    type: 'fixed',
    location: 'local',
    rating: 4.9,
    tags: ['badrum', 'installation', 'snabbt']
  },
  {
    id: '2',
    title: 'IKEA-möbler montering',
    category: 'Montering',
    description: 'Professionell montering av IKEA-möbler och skåp',
    price: 959,
    rotPrice: 480,
    type: 'hourly',
    location: 'local',
    rating: 4.8,
    tags: ['möbler', 'ikea', 'hem']
  },
  {
    id: '3',
    title: 'Köksluckor montering',
    category: 'Snickeri',
    description: 'Montering av köksluckor och skåpdörrar',
    price: 959,
    rotPrice: 480,
    type: 'hourly',
    location: 'local',
    rating: 4.9,
    tags: ['kök', 'luckor', 'renovering']
  },
  {
    id: '4',
    title: 'Flyttstädning',
    category: 'Städning',
    description: 'Komplett flyttstädning enligt besiktningsstandard',
    price: 60,
    rotPrice: 30,
    type: 'fixed',
    location: 'local',
    rating: 4.7,
    tags: ['städning', 'flyttstäd', 'besiktning']
  },
  {
    id: '5',
    title: 'Eluttag installation',
    category: 'El',
    description: 'Installation av nya eluttag och strömbrytare',
    price: 1059,
    rotPrice: 530,
    type: 'hourly',
    location: 'local',
    rating: 4.8,
    tags: ['el', 'uttag', 'installation']
  },
  {
    id: '6',
    title: 'Trädgårdsanläggning',
    category: 'Trädgård',
    description: 'Plantering, gräsmatta och landskapsarkitektur',
    price: 959,
    rotPrice: 480,
    type: 'hourly',
    location: 'local',
    rating: 4.6,
    tags: ['trädgård', 'plantering', 'landskap']
  }
];

const categories = ['Alla', 'Snickeri', 'VVS', 'Montering', 'Trädgård', 'Städning', 'El', 'Projektledning'];
const priceTypes = ['Alla', 'Timpris', 'Fast pris'];
const locations = ['Alla', 'Uppsala & Stockholm', 'Nationellt'];

interface ServiceFinderProps {
  onServiceSelect?: (service: Service) => void;
}

const ServiceFinder = ({ onServiceSelect }: ServiceFinderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alla");
  const [selectedPriceType, setSelectedPriceType] = useState("Alla");
  const [selectedLocation, setSelectedLocation] = useState("Alla");
  const [showROTPrice, setShowROTPrice] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'relevance'>('relevance');

  const filteredServices = useMemo(() => {
    return mockServices
      .filter(service => {
        const matchesSearch = !searchQuery || 
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'Alla' || service.category === selectedCategory;
        
        const matchesPriceType = selectedPriceType === 'Alla' || 
          (selectedPriceType === 'Timpris' && service.type === 'hourly') ||
          (selectedPriceType === 'Fast pris' && service.type === 'fixed');
        
        const matchesLocation = selectedLocation === 'Alla' || 
          (selectedLocation === 'Uppsala & Stockholm' && service.location === 'local') ||
          (selectedLocation === 'Nationellt' && service.location === 'national');

        return matchesSearch && matchesCategory && matchesPriceType && matchesLocation;
      })
      .sort((a, b) => {
        if (sortBy === 'price') {
          const priceA = showROTPrice ? a.rotPrice : a.price;
          const priceB = showROTPrice ? b.rotPrice : b.price;
          return priceA - priceB;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0; // relevance (original order)
      });
  }, [searchQuery, selectedCategory, selectedPriceType, selectedLocation, showROTPrice, sortBy]);

  const formatPrice = (service: Service) => {
    const price = showROTPrice ? service.rotPrice : service.price;
    const unit = service.type === 'hourly' ? '/h' : (service.category === 'Städning' ? '/kvm' : '');
    return `${price.toLocaleString()} kr${unit}`;
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold gradient-text">Hitta din tjänst</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sök bland våra tjänster eller filtrera för att hitta exakt vad du behöver. 
          Vi arbetar i Uppsala & Stockholm med möjlighet för nationella projekt.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Sök tjänst, t.ex. 'byta toalett' eller 'ikea montering'..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-3 text-base"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Price Type Filter */}
        <div className="border-l pl-4 flex flex-wrap gap-2">
          {priceTypes.map(type => (
            <Button
              key={type}
              variant={selectedPriceType === type ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedPriceType(type)}
            >
              <Euro className="h-4 w-4 mr-1" />
              {type}
            </Button>
          ))}
        </div>

        {/* Location Filter */}
        <div className="border-l pl-4 flex flex-wrap gap-2">
          {locations.map(location => (
            <Button
              key={location}
              variant={selectedLocation === location ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedLocation(location)}
            >
              <MapPin className="h-4 w-4 mr-1" />
              {location === 'Alla' ? location : location.split(' ')[0]}
            </Button>
          ))}
        </div>
      </div>

      {/* ROT Toggle & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/20 rounded-lg">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showROTPrice}
            onChange={(e) => setShowROTPrice(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="font-medium">Visa priser med ROT-avdrag (50% rabatt)</span>
        </label>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sortera:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'relevance')}
            className="px-3 py-1 border border-border rounded-md bg-background text-sm"
          >
            <option value="relevance">Relevans</option>
            <option value="price">Pris</option>
            <option value="rating">Betyg</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center">
        <p className="text-muted-foreground">
          Visar {filteredServices.length} tjänster
          {searchQuery && ` för "${searchQuery}"`}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div 
            key={service.id}
            className="card-service group"
            onClick={() => onServiceSelect?.(service)}
          >
            <div className="flex items-start justify-between mb-3">
              <Badge variant="secondary" className="text-xs">
                {service.category}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                <span className="text-xs text-muted-foreground">{service.rating}</span>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {service.title}
            </h3>

            <p className="text-muted-foreground text-sm mb-4">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {service.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
              <div>
                {showROTPrice && service.price !== service.rotPrice && (
                  <div className="text-xs text-muted-foreground line-through">
                    {service.price.toLocaleString()} kr{service.type === 'hourly' ? '/h' : ''}
                  </div>
                )}
                <div className="font-bold text-lg gradient-text">
                  {formatPrice(service)}
                </div>
                {showROTPrice && service.price !== service.rotPrice && (
                  <div className="text-xs text-primary font-medium">med ROT-avdrag</div>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Start inom 5 dagar</span>
              </div>
            </div>

            <Button variant="premium" className="w-full mt-4">
              Boka nu
            </Button>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Inga tjänster hittades</h3>
          <p className="text-muted-foreground mb-4">
            Prova att ändra dina sökkriterier eller kontakta oss för anpassade lösningar.
          </p>
          <Button variant="cta">
            Kontakta oss för speciallösning
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceFinder;