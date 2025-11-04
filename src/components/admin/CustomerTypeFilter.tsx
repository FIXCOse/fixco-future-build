import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building2, Home } from 'lucide-react';

type CustomerType = 'all' | 'private' | 'company' | 'brf';

interface CustomerTypeFilterProps {
  value: CustomerType;
  onChange: (value: CustomerType) => void;
  counts: {
    all: number;
    private: number;
    company: number;
    brf: number;
  };
}

export function CustomerTypeFilter({ value, onChange, counts }: CustomerTypeFilterProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as CustomerType)} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Alla ({counts.all})
        </TabsTrigger>
        <TabsTrigger value="private" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Privat ({counts.private})
        </TabsTrigger>
        <TabsTrigger value="company" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Företag ({counts.company})
        </TabsTrigger>
        <TabsTrigger value="brf" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          BRF ({counts.brf})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
