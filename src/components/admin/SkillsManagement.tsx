import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Wrench } from 'lucide-react';

export function SkillsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general'
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const categories = [
    { value: 'plumbing', label: 'VVS' },
    { value: 'electrical', label: 'El' },
    { value: 'painting', label: 'Målning' },
    { value: 'tiling', label: 'Kakelläggning' },
    { value: 'flooring', label: 'Golv' },
    { value: 'carpentry', label: 'Snickeri' },
    { value: 'construction', label: 'Bygg' },
    { value: 'roofing', label: 'Tak' },
    { value: 'hvac', label: 'Ventilation' },
    { value: 'technology', label: 'Teknik' },
    { value: 'general', label: 'Allmänt' }
  ];

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      plumbing: 'bg-blue-100 text-blue-800',
      electrical: 'bg-yellow-100 text-yellow-800',
      painting: 'bg-green-100 text-green-800',
      tiling: 'bg-purple-100 text-purple-800',
      flooring: 'bg-orange-100 text-orange-800',
      carpentry: 'bg-red-100 text-red-800',
      construction: 'bg-gray-100 text-gray-800',
      roofing: 'bg-indigo-100 text-indigo-800',
      hvac: 'bg-cyan-100 text-cyan-800',
      technology: 'bg-pink-100 text-pink-800',
      general: 'bg-slate-100 text-slate-800'
    };
    return colors[category] || colors.general;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Fel",
        description: "Kompetensnamn är obligatoriskt",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSkill.id);

        if (error) throw error;
        
        toast({
          title: "Framgång",
          description: "Kompetens uppdaterad"
        });
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([{
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category
          }]);

        if (error) throw error;
        
        toast({
          title: "Framgång",
          description: "Ny kompetens skapad"
        });
      }

      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsModalOpen(false);
      resetForm();

    } catch (error) {
      console.error('Error saving skill:', error);
      toast({
        title: "Fel",
        description: "Kunde inte spara kompetens",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (skill: any) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description || '',
      category: skill.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (skillId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna kompetens?')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      toast({
        title: "Framgång",
        description: "Kompetens borttagen"
      });

      queryClient.invalidateQueries({ queryKey: ['skills'] });

    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ta bort kompetens",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: 'general' });
    setEditingSkill(null);
  };

  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Kompetenshantering
          </CardTitle>
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Lägg till kompetens
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSkill ? 'Redigera Kompetens' : 'Ny Kompetens'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Namn *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beskrivning</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Avbryt
                  </Button>
                  <Button type="submit">
                    {editingSkill ? 'Uppdatera' : 'Skapa'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg capitalize">
                {getCategoryLabel(category)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categorySkills.map((skill: any) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <Badge className={getCategoryColor(skill.category)}>
                          {getCategoryLabel(skill.category)}
                        </Badge>
                      </div>
                      {skill.description && (
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(skill)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(skill.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}